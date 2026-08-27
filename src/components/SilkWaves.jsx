import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './SilkWaves.css';

const vertexShader = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uSheen;
uniform vec3 uColorBase;
uniform vec3 uColorMid;
uniform vec3 uColorHighlight;
uniform vec3 uColorAccent;

// Smooth pseudo-random noise
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// 2D Value Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractional Brownian Motion for silky ribbons
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;

    float t = uTime * uSpeed;

    // Mouse influence
    vec2 mouseOffset = (uMouse - 0.5) * aspect;
    float mouseDist = length(p - mouseOffset);
    float mousePush = smoothstep(0.6, 0.0, mouseDist) * 0.35;

    // Domain warping for organic liquid silk flow
    vec2 q = vec2(0.0);
    q.x = fbm(p + vec2(0.0, t * 0.15) + mousePush);
    q.y = fbm(p + vec2(t * 0.12, 0.0) - mousePush);

    vec2 r = vec2(0.0);
    r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
    r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

    // Primary silk wave height
    float wave = fbm(p + 1.4 * r + vec2(0.0, t * 0.08));

    // Silk folds modulation
    float folds = sin(p.y * uFrequency * 8.0 + wave * 9.0 + t * 0.8) * 0.5 + 0.5;
    folds = pow(folds, 1.8);

    // Highlight sheen & edge highlights
    float sheen = pow(wave, 2.2) * uSheen;
    float highlight = pow(folds, 3.0) * 0.65;

    // Color gradient mapping with brand tokens
    vec3 col = uColorBase;
    col = mix(col, uColorMid, smoothstep(0.2, 0.65, wave));
    col = mix(col, uColorHighlight, smoothstep(0.45, 0.95, wave + highlight * 0.4));
    col += uColorAccent * (sheen * 0.4 + highlight * 0.5);

    // Vignette for seamless dark edge blending
    float vignette = smoothstep(1.3, 0.2, length(p));
    col *= vignette;

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const hexToRgb = (hex) => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
};

export const SilkWaves = ({
  speed = 0.4,
  amplitude = 1.0,
  frequency = 1.2,
  sheen = 1.6,
  colorBase = '#090B0A',
  colorMid = '#094020',
  colorHighlight = '#DFFCA1',
  colorAccent = '#EDEBE4',
  className = ''
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
    const renderer = new Renderer({ dpr, alpha: false, antialias: false });
    const gl = renderer.gl;

    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    container.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
        uSheen: { value: sheen },
        uColorBase: { value: hexToRgb(colorBase) },
        uColorMid: { value: hexToRgb(colorMid) },
        uColorHighlight: { value: hexToRgb(colorHighlight) },
        uColorAccent: { value: hexToRgb(colorAccent) }
      }
    });

    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    let mouseTarget = [0.5, 0.5];
    let mouseCurrent = [0.5, 0.5];

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseTarget = [x, y];
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();
    let accumTime = 0;

    const render = (now) => {
      const dt = Math.max(0, now - lastTime) * 0.001;
      lastTime = now;

      if (isVisible && !document.hidden) {
        accumTime += dt;
        mouseCurrent[0] += (mouseTarget[0] - mouseCurrent[0]) * 0.06;
        mouseCurrent[1] += (mouseTarget[1] - mouseCurrent[1]) * 0.06;

        program.uniforms.uTime.value = accumTime;
        program.uniforms.uMouse.value = mouseCurrent;

        renderer.render({ scene: mesh });
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      try {
        container.removeChild(gl.canvas);
      } catch (e) {
        /* already removed */
      }
    };
  }, [speed, amplitude, frequency, sheen, colorBase, colorMid, colorHighlight, colorAccent]);

  return <div ref={containerRef} className={`silk-waves-container ${className}`} />;
};

export default SilkWaves;
