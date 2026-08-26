// SMOOTH SCROLL (Lenis)
let lenis = null;

if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 0.85,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}


// THEME TOGGLE WITH SPRING ROTATION
(function () {
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    let rotation = 0;

    toggle.addEventListener('click', function () {
        const isDark = root.getAttribute('data-theme') === 'dark';
        rotation += 180;
        
        if (window.Motion && window.Motion.animate) {
            window.Motion.animate(toggle, { 
                transform: `rotate(${rotation}deg) scale(0.9)` 
            }, { duration: 0.35, easing: [0.34, 1.56, 0.64, 1] }).finished.then(() => {
                window.Motion.animate(toggle, { transform: `rotate(${rotation}deg) scale(1)` }, { duration: 0.2 });
            });
        }

        if (isDark) {
            root.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
})();


// HERO ENTRANCE SPRING SEQUENCE (Benjamin Creative Inspiration)
(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !window.Motion || !window.Motion.animate) return;

    const availBadge = document.querySelector('.availability-badge');
    const heroMeta = document.querySelector('.hero-meta');
    const heroTitle = document.querySelector('.display-hero');
    const badgePills = document.querySelectorAll('.badge-pill');
    const heroDesc = document.querySelector('.hero-text p');
    const arrow = document.getElementById('scroll-down-arrow');

    if (availBadge) {
        window.Motion.animate(availBadge, { opacity: [0, 1], transform: ['translateY(-16px)', 'translateY(0px)'] }, { duration: 0.5, easing: [0.22, 1, 0.36, 1] });
    }

    if (heroMeta) {
        window.Motion.animate(heroMeta, { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0px)'] }, { duration: 0.5, delay: 0.08, easing: [0.22, 1, 0.36, 1] });
    }

    if (heroTitle) {
        window.Motion.animate(heroTitle, { opacity: [0, 1], transform: ['translateY(24px) scale(0.94)', 'translateY(0px) scale(1)'] }, { duration: 0.65, delay: 0.16, easing: [0.22, 1, 0.36, 1] });
    }

    if (badgePills && badgePills.length > 0) {
        badgePills.forEach((pill, idx) => {
            window.Motion.animate(pill, { opacity: [0, 1], transform: ['scale(0.7)', 'scale(1)'] }, { duration: 0.45, delay: 0.28 + (idx * 0.08), easing: [0.34, 1.56, 0.64, 1] });
        });
    }

    if (heroDesc) {
        window.Motion.animate(heroDesc, { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] }, { duration: 0.5, delay: 0.48, easing: [0.22, 1, 0.36, 1] });
    }

    if (arrow) {
        window.Motion.animate(arrow, { opacity: [0, 1], transform: ['scale(0.6)', 'scale(1)'] }, { duration: 0.45, delay: 0.6, easing: [0.34, 1.56, 0.64, 1] });
    }
})();


// MAGNETIC BUTTONS & INTERACTIVE ELEMENTS (Benjamin Creative Inspiration)
(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const magneticTargets = document.querySelectorAll('.button-work, .badge-pill, .footer-back-to-top, .next-project-arrow, .availability-badge');

    magneticTargets.forEach((el) => {
        let bounds = null;

        el.addEventListener('mouseenter', () => {
            bounds = el.getBoundingClientRect();
        });

        el.addEventListener('mousemove', (e) => {
            if (!bounds) return;
            const x = e.clientX - bounds.left - bounds.width / 2;
            const y = e.clientY - bounds.top - bounds.height / 2;

            if (window.Motion && window.Motion.animate) {
                window.Motion.animate(el, { 
                    transform: `translate(${x * 0.2}px, ${y * 0.2}px)` 
                }, { duration: 0.2, easing: [0.22, 1, 0.36, 1] });
            } else {
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            if (window.Motion && window.Motion.animate) {
                window.Motion.animate(el, { 
                    transform: 'translate(0px, 0px)' 
                }, { duration: 0.4, easing: [0.34, 1.56, 0.64, 1] });
            } else {
                el.style.transform = 'translate(0px, 0px)';
            }
            bounds = null;
        });
    });
})();


// KEYBOARD ACCESSIBILITY
(function () {
    const NATIVELY_FOCUSABLE = new Set(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']);

    const onclickTargets = Array.prototype.slice.call(document.querySelectorAll('[onclick]'));
    const hamburgerEl = document.getElementById('hamburger');
    const targets = hamburgerEl ? onclickTargets.concat(hamburgerEl) : onclickTargets;

    targets.forEach((el) => {
        if (NATIVELY_FOCUSABLE.has(el.tagName)) return;

        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }
        if (!el.hasAttribute('role')) {
            const onclick = el.getAttribute('onclick') || '';
            el.setAttribute('role', onclick.includes('window.location') ? 'link' : 'button');
        }

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                el.click();
            }
        });
    });
})();


// BUTTON ARROW HOVER SWAP
const buttons = document.querySelectorAll('.button-work');

buttons.forEach(button => {
    const img = button.querySelector('img');
    if (!img) return;
    const originalSrc = '/img/button-arrow-img.svg';
    const hoverSrc = '/img/button-arrow-img-hover.svg';

    button.addEventListener('mouseenter', () => {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = hoverSrc;
            img.style.opacity = '1';
        }, 50);
    });

    button.addEventListener('mouseleave', () => {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = originalSrc;
            img.style.opacity = '1';
        }, 50);
    });
});


// TILTED CARD & SPECULAR SHEEN (Zero-Layout-Thrashing)
const tiltCards = document.querySelectorAll('.work-item, .tilted-card-figure');

tiltCards.forEach(card => {
    const inner = card.querySelector('.tilted-card-inner');
    const caption = card.querySelector('.tilted-card-caption');

    const ROTATE_AMPLITUDE = 8;
    const SCALE_ON_HOVER = 1.03;

    let tiltRect = null;

    card.addEventListener('mouseenter', () => {
        tiltRect = card.getBoundingClientRect();
        if (caption) caption.style.opacity = '1';
    });

    card.addEventListener('mousemove', (e) => {
        if (!tiltRect) return;
        const mouseX = e.clientX - tiltRect.left;
        const mouseY = e.clientY - tiltRect.top;

        // Update CSS variables for radial specular sheen
        card.style.setProperty('--sheen-x', `${mouseX}px`);
        card.style.setProperty('--sheen-y', `${mouseY}px`);

        if (inner) {
            const offsetX = mouseX - tiltRect.width / 2;
            const offsetY = mouseY - tiltRect.height / 2;

            const rotationX = (offsetY / (tiltRect.height / 2)) * -ROTATE_AMPLITUDE;
            const rotationY = (offsetX / (tiltRect.width / 2)) * ROTATE_AMPLITUDE;

            if (window.Motion && window.Motion.animate) {
                window.Motion.animate(inner, { 
                    transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${SCALE_ON_HOVER})`
                }, { duration: 0.25, easing: [0.22, 1, 0.36, 1] });
            } else {
                inner.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${SCALE_ON_HOVER})`;
            }
        }

        if (caption) {
            caption.style.left = `${mouseX}px`;
            caption.style.top = `${mouseY}px`;
        }
    });

    card.addEventListener('mouseleave', () => {
        if (inner) {
            if (window.Motion && window.Motion.animate) {
                window.Motion.animate(inner, { 
                    transform: 'rotateX(0deg) rotateY(0deg) scale(1)'
                }, { duration: 0.4, easing: [0.22, 1, 0.36, 1] });
            } else {
                inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            }
        }
        if (caption) caption.style.opacity = '0';
        tiltRect = null;
    });
});


// SCROLL REVEAL (Single-fire, Butter-smooth, Non-flickering)
(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target); // Unobserve so it stays visible without flickering
            }
        });
    }, { threshold: 0.15 });

    const elementsToAnimate = document.querySelectorAll('.about-me-inner-wrap, .works-bottom-button, .next-project-card');

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-scale', 'hidden');
        observer.observe(el);
    });
})();


// SCROLL ANIMATION FOR ABOUT ME TEXT
const scrollDownArrow = document.getElementById('scroll-down-arrow');
const aboutSection = document.getElementById('about');

if (scrollDownArrow && aboutSection) {
    scrollDownArrow.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(aboutSection);
        } else {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}


// BACK TO TOP (footer)

const backToTop = document.getElementById('back-to-top');

if (backToTop) {
    backToTop.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}


// NAVBAR BACKGROUND ON SCROLL

const navbar = document.querySelector('.navbar');

if (navbar) {
    const toggleNavbarScrolled = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    toggleNavbarScrolled();
    window.addEventListener('scroll', toggleNavbarScrolled, { passive: true });
}


// HAMBURGER MENU TOGGLE

const hamburger = document.getElementById('hamburger');
const navbarRight = document.querySelector('.navbar-right');

if (hamburger && navbarRight) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbarRight.classList.toggle('show');
    });
}


// SCREEN TRANSITION ANIMATION
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in'); // Start with fade-in

    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        if(link.hostname === window.location.hostname){ // Only internal links
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default jump
                document.body.classList.add('screen-fade-out');

                setTimeout(() => {
                    window.location = this.href; // Redirect after fade-out
                }, 500); // Match the CSS transition time
            });
        }
    });
});


// DOT GRID HOVER GLOW

const dotGridBody = document.querySelector('body.paper-grid');

if (dotGridBody) {
    let glowTicking = false;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        glowX = e.clientX;
        glowY = e.clientY;
        if (!glowTicking) {
            window.requestAnimationFrame(() => {
                dotGridBody.style.setProperty('--spot-x', `${glowX}px`);
                dotGridBody.style.setProperty('--spot-y', `${glowY}px`);
                dotGridBody.classList.add('dots-glow-active');
                glowTicking = false;
            });
            glowTicking = true;
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        dotGridBody.classList.remove('dots-glow-active');
    });
}


// GRADUAL BLUR (footer fade)
// Lightweight GPU-accelerated backdrop blur gradient

function createGradualBlur({
    position = 'bottom',
    height = '6rem',
    width,
    strength = 1.5,
    divCount = 2,
    curve = 'linear',
    exponential = false,
    opacity = 1,
    target = 'parent',
    zIndex = 1000,
    className = ''
} = {}) {
    const CURVE_FUNCTIONS = {
        linear: p => p,
        bezier: p => p * p * (3 - 2 * p),
        'ease-in': p => p * p,
        'ease-out': p => 1 - Math.pow(1 - p, 2),
        'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
    };
    const DIRECTIONS = { top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' };

    const isVertical = position === 'top' || position === 'bottom';
    const isPage = target === 'page';
    const curveFunc = CURVE_FUNCTIONS[curve] || CURVE_FUNCTIONS.linear;
    const direction = DIRECTIONS[position] || 'to bottom';

    const container = document.createElement('div');
    container.className = `gradual-blur ${isPage ? 'gradual-blur-page' : 'gradual-blur-parent'} ${className}`.trim();
    container.style.position = isPage ? 'fixed' : 'absolute';
    container.style.zIndex = isPage ? zIndex + 100 : zIndex;
    container.style.pointerEvents = 'none';
    container.style.willChange = 'transform';
    container.style.transform = 'translateZ(0)';

    if (isVertical) {
        container.style.height = height;
        container.style.width = width || '100%';
        container.style[position] = '0';
        container.style.left = '0';
        container.style.right = '0';
    } else {
        container.style.width = width || height;
        container.style.height = '100%';
        container.style[position] = '0';
        container.style.top = '0';
        container.style.bottom = '0';
    }

    const inner = document.createElement('div');
    inner.className = 'gradual-blur-inner';

    const increment = 100 / divCount;

    for (let i = 1; i <= divCount; i++) {
        const progress = curveFunc(i / divCount);

        const blurValue = exponential
            ? Math.pow(2, progress * 4) * 0.0625 * strength
            : 0.0625 * (progress * divCount + 1) * strength;

        const p1 = Math.round((increment * i - increment) * 10) / 10;
        const p2 = Math.round(increment * i * 10) / 10;
        const p3 = Math.round((increment * i + increment) * 10) / 10;
        const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

        let gradient = `transparent ${p1}%, black ${p2}%`;
        if (p3 <= 100) gradient += `, black ${p3}%`;
        if (p4 <= 100) gradient += `, transparent ${p4}%`;

        const mask = `linear-gradient(${direction}, ${gradient})`;

        const layer = document.createElement('div');
        layer.style.maskImage = mask;
        layer.style.webkitMaskImage = mask;
        layer.style.backdropFilter = `blur(${blurValue.toFixed(3)}rem)`;
        layer.style.webkitBackdropFilter = `blur(${blurValue.toFixed(3)}rem)`;
        layer.style.opacity = opacity;
        layer.style.willChange = 'transform';
        layer.style.transform = 'translateZ(0)';

        inner.appendChild(layer);
    }

    container.appendChild(inner);
    return container;
}

if (document.body.classList.contains('paper-grid')) {
    document.body.appendChild(
        createGradualBlur({
            target: 'page',
            position: 'bottom',
            height: '6rem',
            strength: 1.5,
            divCount: 2,
            curve: 'bezier',
            exponential: true,
            opacity: 1,
            zIndex: 500
        })
    );

    const topBlur = createGradualBlur({
        target: 'page',
        position: 'top',
        height: '6rem',
        strength: 1.5,
        divCount: 2,
        curve: 'bezier',
        exponential: true,
        opacity: 1,
        zIndex: -20,
        className: 'gradual-blur-top'
    });
    document.body.appendChild(topBlur);

    const TOP_BLUR_SCROLL_THRESHOLD = 10;
    let topBlurTicking = false;

    const updateTopBlurVisibility = () => {
        const scrolled = (window.scrollY || document.documentElement.scrollTop) > TOP_BLUR_SCROLL_THRESHOLD;
        topBlur.classList.toggle('gradual-blur-visible', scrolled);
        topBlurTicking = false;
    };

    updateTopBlurVisibility();
    window.addEventListener('scroll', () => {
        if (!topBlurTicking) {
            window.requestAnimationFrame(updateTopBlurVisibility);
            topBlurTicking = true;
        }
    }, { passive: true });
}


// CUSTOM CURSOR

const cursor = document.getElementById("custom-cursor");
const cursorImg = document.getElementById("cursor-img");

const DEFAULT_CURSOR = "/img/Figma Cursor.svg";
const POINTER_CURSOR = "/img/select cursor.svg";

// Zones that use a native/inline cursor instead of the custom one
const cursorZones = [
  ".work-thumb",
  ".about-me-inner-wrap img"
];

if (cursor && cursorImg) {
  let cursorTicking = false;
  let cursorX = 0;
  let cursorY = 0;

  const updateCursorPosition = (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (!cursorTicking) {
      window.requestAnimationFrame(() => {
        cursor.style.setProperty('--cx', `${cursorX}px`);
        cursor.style.setProperty('--cy', `${cursorY}px`);
        cursorTicking = false;
      });
      cursorTicking = true;
    }
  };

  document.addEventListener("mousemove", updateCursorPosition, { passive: true });
  document.addEventListener("pointermove", updateCursorPosition, { passive: true });

  document.addEventListener("mouseover", (e) => {
    const isInCursorZone = cursorZones.some(selector => e.target.closest(selector));

    if (isInCursorZone) {
      cursor.classList.add("cursor-hidden");
      return;
    }

    cursor.classList.remove("cursor-hidden");

    // CSS cursor:pointer is what marks an element as a "link" target for
    // this swap - but that same property is what makes the browser render
    // its own native pointer alongside our custom one. Read the real
    // stylesheet value once, cache it, then blank the element's own cursor
    // so only the custom cursor renders on every hover after the first.
    const target = e.target;
    let pointerFlag = target.dataset.cursorPointer;
    if (pointerFlag === undefined) {
      pointerFlag = window.getComputedStyle(target).cursor === "pointer" ? "true" : "false";
      target.dataset.cursorPointer = pointerFlag;
      target.style.cursor = "none";
    }

    const isPointer = pointerFlag === "true";
    cursorImg.src = isPointer ? POINTER_CURSOR : DEFAULT_CURSOR;
    cursor.classList.toggle("pointer-active", isPointer);
  });
}


// CURSOR GREETING (Home page intro bubble)
// Plays on every load: a pill trails the custom cursor, types
// "Hey there!", holds, clears and types "Curious? Have a look!", holds,
// then collapses shut.

const cursorGreeting = document.getElementById("cursor-greeting");
const cursorGreetingText = document.getElementById("cursor-greeting-text");

if (cursorGreeting && cursorGreetingText) {
  const GREETING_MESSAGES = ["Hey there!", "Curious? Have a look!"];
  const TYPE_SPEED = 100;     // ms per character
  const DELETE_SPEED = 50;    // ms per character when backspacing
  const MESSAGE_HOLD = 2200;  // ms to hold a finished message before continuing
  const START_DELAY = 900;    // ms after load before the pill opens
  const OFFSET_X = 16;        // px right of the live cursor position
  const OFFSET_Y = 22;        // px below the live cursor position

  let greetingX = window.innerWidth / 2;
  let greetingY = window.innerHeight / 2;
  let greetingTicking = false;

  const positionGreeting = () => {
    cursorGreeting.style.setProperty('--gx', `${greetingX + OFFSET_X}px`);
    cursorGreeting.style.setProperty('--gy', `${greetingY + OFFSET_Y}px`);
  };
  positionGreeting();

  const trackGreetingPosition = (e) => {
    greetingX = e.clientX;
    greetingY = e.clientY;
    if (!greetingTicking) {
      window.requestAnimationFrame(() => {
        positionGreeting();
        greetingTicking = false;
      });
      greetingTicking = true;
    }
  };
  document.addEventListener("mousemove", trackGreetingPosition, { passive: true });

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const typeMessage = async (text) => {
    cursorGreetingText.textContent = "";
    for (const char of text) {
      cursorGreetingText.textContent += char;
      await wait(TYPE_SPEED);
    }
  };

  const deleteMessage = async () => {
    const text = cursorGreetingText.textContent;
    for (let i = text.length; i > 0; i--) {
      cursorGreetingText.textContent = text.slice(0, i - 1);
      await wait(DELETE_SPEED);
    }
  };

  (async () => {
    await wait(START_DELAY);
    cursorGreeting.classList.add("greeting-open");

    for (let i = 0; i < GREETING_MESSAGES.length; i++) {
      await typeMessage(GREETING_MESSAGES[i]);
      await wait(MESSAGE_HOLD);
      if (i < GREETING_MESSAGES.length - 1) {
        await deleteMessage();
        await wait(300);
      }
    }

    cursorGreeting.classList.remove("greeting-open");
    cursorGreeting.classList.add("greeting-closed");
    document.removeEventListener("mousemove", trackGreetingPosition);
  })();
}


// SCREENSHOT LIGHTBOX
// Case-study pages mark their zoomable screenshots with .case-zoomable  - 
// this builds one shared overlay (styled entirely inline, so no per-page
// stylesheet changes are needed) and wires every matching image to open
// it at full size on click.

const zoomableImages = document.querySelectorAll("img.case-zoomable");

if (zoomableImages.length) {
  const overlay = document.createElement("div");
  overlay.className = "case-lightbox-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5vh 5vw",
    background: "rgba(10, 10, 10, 0.92)",
    opacity: "0",
    visibility: "hidden",
    transition: "opacity 0.25s ease, visibility 0.25s ease",
    cursor: "zoom-out"
  });

  const overlayImg = document.createElement("img");
  Object.assign(overlayImg.style, {
    maxWidth: "90vw",
    maxHeight: "90vh",
    objectFit: "contain",
    borderRadius: "12px",
    boxShadow: "0 40px 100px rgba(0, 0, 0, 0.5)",
    cursor: "default",
    transform: "scale(0.96)",
    transition: "transform 0.25s ease"
  });

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "✕";
  Object.assign(closeBtn.style, {
    position: "fixed",
    top: "24px",
    right: "24px",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255, 255, 255, 0.12)",
    color: "#fff",
    fontSize: "18px",
    lineHeight: "1",
    cursor: "pointer"
  });

  overlay.appendChild(overlayImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  const openLightbox = (src, alt) => {
    overlayImg.src = src;
    overlayImg.alt = alt || "";
    overlay.style.visibility = "visible";
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      overlayImg.style.transform = "scale(1)";
    });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    overlay.style.opacity = "0";
    overlayImg.style.transform = "scale(0.96)";
    document.body.style.overflow = "";
    window.setTimeout(() => {
      overlay.style.visibility = "hidden";
    }, 250);
  };

  zoomableImages.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => openLightbox(img.currentSrc || img.src, img.alt));
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlayImg) return;
    closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.visibility === "visible") {
      closeLightbox();
    }
  });
}

