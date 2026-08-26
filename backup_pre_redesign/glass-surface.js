/*
  Vanilla JS port of the React Bits "GlassSurface" component.
  Builds a per-element SVG displacement filter (chromatic-aberration-style
  refraction) and wires it up via backdrop-filter: url(#filter), with a
  plain blur fallback for browsers that don't support SVG backdrop filters
  (Safari, Firefox). Applied to header nav CTAs only.
*/
(function () {
  'use strict';

  var uidCounter = 0;
  function nextId(prefix) {
    uidCounter += 1;
    return prefix + '-' + uidCounter + '-' + Date.now().toString(36);
  }

  function supportsSVGBackdropFilter() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    var ua = navigator.userAgent;
    var isWebkit = /Safari/.test(ua) && !/Chrome/.test(ua);
    var isFirefox = /Firefox/.test(ua);
    if (isWebkit || isFirefox) return false;
    var div = document.createElement('div');
    div.style.backdropFilter = 'url(#test)';
    return div.style.backdropFilter !== '';
  }

  function buildDisplacementMapDataURI(width, height, opts) {
    var edgeSize = Math.min(width, height) * (opts.borderWidth * 0.5);
    var innerW = Math.max(width - edgeSize * 2, 0);
    var innerH = Math.max(height - edgeSize * 2, 0);
    var svg =
      '<svg viewBox="0 0 ' + width + ' ' + height + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="' + opts.redGradId + '" x1="100%" y1="0%" x2="0%" y2="0%">' +
      '<stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + opts.blueGradId + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
      '<stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="black"></rect>' +
      '<rect x="0" y="0" width="' + width + '" height="' + height + '" rx="' + opts.borderRadius + '" fill="url(#' + opts.redGradId + ')" />' +
      '<rect x="0" y="0" width="' + width + '" height="' + height + '" rx="' + opts.borderRadius + '" fill="url(#' + opts.blueGradId + ')" style="mix-blend-mode: ' + opts.mixBlendMode + '" />' +
      '<rect x="' + edgeSize + '" y="' + edgeSize + '" width="' + innerW + '" height="' + innerH + '" rx="' + opts.borderRadius + '" fill="hsl(0 0% ' + opts.brightness + '% / ' + opts.opacity + ')" style="filter:blur(' + opts.blur + 'px)" />' +
      '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function createGlassSurface(el, options) {
    var opts = Object.assign({
      borderRadius: 30,
      borderWidth: 0.07,
      brightness: 50,
      opacity: 0.93,
      blur: 11,
      displace: 0.5,
      backgroundOpacity: 0,
      saturation: 1,
      distortionScale: -60,
      redOffset: 0,
      greenOffset: 8,
      blueOffset: 16,
      xChannel: 'R',
      yChannel: 'G',
      mixBlendMode: 'difference',
      // The SVG displacement filter is a genuine per-pixel cost on the
      // GPU/CPU that scales with the filtered element's area, so large
      // surfaces use `simplified` (single displacement pass, no RGB
      // channel splitting) instead of the full chromatic-aberration
      // graph - still visibly "liquid" but far cheaper to render.
      useSVGFilter: true,
      simplified: false
    }, options || {});

    var existingContent = document.createDocumentFragment();
    while (el.firstChild) existingContent.appendChild(el.firstChild);

    var content = document.createElement('div');
    content.className = 'glass-surface__content';
    content.appendChild(existingContent);

    if (!opts.useSVGFilter) {
      el.classList.add('glass-surface', 'glass-surface--fallback');
      el.style.setProperty('--glass-frost', String(opts.backgroundOpacity));
      el.style.setProperty('--glass-saturation', String(opts.saturation));
      el.appendChild(content);
      return el;
    }

    var svgSupported = supportsSVGBackdropFilter();
    var uid = nextId('glass');
    var filterId = 'glass-filter-' + uid;
    var redGradId = 'red-grad-' + uid;
    var blueGradId = 'blue-grad-' + uid;

    var svgNS = 'http://www.w3.org/2000/svg';
    var filterSvg = document.createElementNS(svgNS, 'svg');
    filterSvg.setAttribute('class', 'glass-surface__filter');

    if (opts.simplified) {
      // Lightweight path: one feDisplacementMap + one feGaussianBlur.
      // Keeps the visible "liquid" warp of the backdrop without the
      // 3x channel-split + feBlend chain, which is the expensive part
      // on large, frequently-repainted surfaces.
      filterSvg.innerHTML =
        '<defs>' +
        '<filter id="' + filterId + '" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">' +
        '<feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />' +
        '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + opts.distortionScale + '" xChannelSelector="' + opts.xChannel + '" yChannelSelector="' + opts.yChannel + '" result="disp" />' +
        '<feGaussianBlur in="disp" stdDeviation="' + opts.displace + '" />' +
        '</filter>' +
        '</defs>';
    } else {
      var redScale = opts.distortionScale + opts.redOffset;
      var greenScale = opts.distortionScale + opts.greenOffset;
      var blueScale = opts.distortionScale + opts.blueOffset;

      filterSvg.innerHTML =
        '<defs>' +
        '<filter id="' + filterId + '" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">' +
        '<feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />' +
        '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + redScale + '" xChannelSelector="' + opts.xChannel + '" yChannelSelector="' + opts.yChannel + '" result="dispRed" />' +
        '<feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />' +
        '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + greenScale + '" xChannelSelector="' + opts.xChannel + '" yChannelSelector="' + opts.yChannel + '" result="dispGreen" />' +
        '<feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />' +
        '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + blueScale + '" xChannelSelector="' + opts.xChannel + '" yChannelSelector="' + opts.yChannel + '" result="dispBlue" />' +
        '<feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />' +
        '<feBlend in="red" in2="green" mode="screen" result="rg" />' +
        '<feBlend in="rg" in2="blue" mode="screen" result="output" />' +
        '<feGaussianBlur in="output" stdDeviation="' + opts.displace + '" />' +
        '</filter>' +
        '</defs>';
    }

    var feImage = filterSvg.querySelector('feImage');

    el.classList.add('glass-surface', svgSupported ? 'glass-surface--svg' : 'glass-surface--fallback');
    el.style.setProperty('--glass-frost', String(opts.backgroundOpacity));
    el.style.setProperty('--glass-saturation', String(opts.saturation));
    el.style.setProperty('--filter-id', 'url(#' + filterId + ')');

    el.appendChild(filterSvg);
    el.appendChild(content);

    function updateMap() {
      var rect = el.getBoundingClientRect();
      var w = rect.width || 200;
      var h = rect.height || 44;
      feImage.setAttribute('href', buildDisplacementMapDataURI(w, h, {
        borderRadius: opts.borderRadius,
        borderWidth: opts.borderWidth,
        brightness: opts.brightness,
        opacity: opts.opacity,
        blur: opts.blur,
        mixBlendMode: opts.mixBlendMode,
        redGradId: redGradId,
        blueGradId: blueGradId
      }));
    }

    updateMap();

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () { updateMap(); });
      ro.observe(el);
    }

    return el;
  }

  function init() {
    var secondaryOpts = {
      backgroundOpacity: 0.32,
      saturation: 1.6,
      brightness: 65,
      opacity: 0.9,
      blur: 6,
      displace: 0.4,
      distortionScale: -40,
      redOffset: 0,
      greenOffset: 4,
      blueOffset: 8
    };

    var ctaOpts = {
      backgroundOpacity: 0.62,
      saturation: 1.4,
      brightness: 20,
      opacity: 0.85,
      blur: 6,
      displace: 0.4,
      distortionScale: -40,
      redOffset: 0,
      greenOffset: 4,
      blueOffset: 8
    };

    // Cards are large, text-heavy surfaces - the SVG displacement filter's
    // cost scales with filtered area, and these are ~50x the area of a nav
    // pill. `simplified` keeps the visible liquid warp (one displacement
    // pass) but drops the 3x RGB channel-split + feBlend chain, so it's
    // still clearly "glass" without the heavier per-pixel cost.
    var cardOpts = {
      borderRadius: 32,
      backgroundOpacity: 0.55,
      saturation: 1.3,
      brightness: 75,
      opacity: 0.9,
      blur: 8,
      displace: 0.3,
      distortionScale: -25,
      simplified: true
    };

    // Secondary nav pills only get the light-tinted glass on the light
    // "paper grid" pages - on dark pages (e.g. ARZEN) a light-glass pill
    // over a dark background loses text contrast, so those stay opaque.
    if (document.body.classList.contains('paper-grid')) {
      document.querySelectorAll('.navbar-button:not(.glass-surface), .works-bottom-button:not(.glass-surface)').forEach(function (btn) {
        createGlassSurface(btn, secondaryOpts);
      });
    }

    document.querySelectorAll('.navbar-button-contact:not(.glass-surface)').forEach(function (btn) {
      createGlassSurface(btn, ctaOpts);
    });

    // Project cards (.work-item) used to get the real SVG-filter glass
    // here too, but at ~50x a nav pill's area, repeated per card, on a
    // page users scroll through, the per-pixel displacement filter was
    // the single biggest paint cost on the homepage. They now get a
    // static CSS-only "looks like glass" treatment instead (see
    // .work-item in styles.css) - same visual language, zero
    // backdrop-filter/SVG cost. .card (Design Philosophy) keeps the
    // real thing since there are far fewer of them on screen at once.
    document.querySelectorAll('.card:not(.glass-surface)').forEach(function (card) {
      createGlassSurface(card, cardOpts);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

