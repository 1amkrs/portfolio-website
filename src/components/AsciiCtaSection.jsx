import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ButtonCTA } from './ButtonCTA';
import { TitleReveal } from './TitleReveal';

export const AsciiCtaSection = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let isVisible = false;
    let width = 0;
    let height = 0;
    let mouse = { x: -2000, y: -2000, active: false };

    const CHARS = [' ', '.', ':', '-', '+', '*', '%', '#', '@'];
    const FONT_SIZE = 16;
    const CHAR_WIDTH = 22;
    const CHAR_HEIGHT = 28;
    const NUM_PALETTES = 6;

    // Precomputed palette buckets
    const PALETTES = Array.from({ length: NUM_PALETTES }, (_, i) => {
      const val = i / (NUM_PALETTES - 1);
      const alpha = (0.12 + val * 0.68).toFixed(2);
      return `rgba(223, 252, 161, ${alpha})`;
    });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastFrame = performance.now();
          animationFrameId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let time = 0;
    let lastFrame = performance.now();
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const render = (now) => {
      if (!isVisible) return;

      const elapsed = now - lastFrame;

      if (elapsed >= FRAME_INTERVAL) {
        lastFrame = now - (elapsed % FRAME_INTERVAL);
        time += 0.03;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `500 ${FONT_SIZE}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cols = Math.ceil(width / CHAR_WIDTH);
        const rows = Math.ceil(height / CHAR_HEIGHT);
        const centerX = cols * 0.5;
        const centerY = rows * 0.5;

        // Buckets for batched rendering by color
        const buckets = Array.from({ length: NUM_PALETTES }, () => []);

        for (let y = 0; y < rows; y++) {
          const posY = y * CHAR_HEIGHT;
          const dy = y - centerY;

          for (let x = 0; x < cols; x++) {
            const posX = x * CHAR_WIDTH;
            const dx = x - centerX;
            const r = Math.sqrt(dx * dx + dy * dy);
            const theta = Math.atan2(dy, dx);

            const spiral = Math.sin(theta * 3 + r * 0.12 - time * 1.5);
            const wave = (spiral + 1) * 0.5;

            let mouseInfluence = 0;
            if (mouse.active) {
              const mx = posX - mouse.x;
              const my = posY - mouse.y;
              const mDistSq = mx * mx + my * my;
              if (mDistSq < 32400) {
                mouseInfluence = (1 - Math.sqrt(mDistSq) / 180) * 0.8;
              }
            }

            let val = wave * (0.3 + (r / (centerX || 1)) * 0.7) + mouseInfluence;
            if (val <= 0.1) continue;
            if (val > 1) val = 1;

            const charIndex = Math.floor(val * (CHARS.length - 1));
            const char = CHARS[charIndex];

            if (char !== ' ') {
              const paletteIndex = Math.min(NUM_PALETTES - 1, Math.floor(val * NUM_PALETTES));
              buckets[paletteIndex].push(char, posX, posY);
            }
          }
        }

        // Draw batched buckets
        for (let p = 0; p < NUM_PALETTES; p++) {
          const items = buckets[p];
          if (items.length === 0) continue;
          ctx.fillStyle = PALETTES[p];
          for (let i = 0; i < items.length; i += 3) {
            ctx.fillText(items[i], items[i + 1], items[i + 2]);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen min-h-[640px] overflow-hidden flex items-center justify-center border-y border-white/10 select-none bg-black"
    >
      {/* Dynamic ASCII Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      {/* Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.75) 55%, rgba(0, 0, 0, 0.95) 100%)'
        }}
      />

      {/* Centered 2-Line Headline & Dual-Pill CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-6 max-w-7xl mx-auto flex flex-col items-center justify-center space-y-8"
      >
        <div className="space-y-2 sm:space-y-4 w-full flex flex-col items-center">
          {/* Line 1 */}
          <TitleReveal delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2vw] xl:text-[4.6vw] 2xl:text-[4.8vw] font-medium tracking-[-0.04em] text-white leading-[1.12]">
              Got an idea?
            </h2>
          </TitleReveal>

          {/* Line 2 */}
          <TitleReveal delay={0.25}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2vw] xl:text-[4.6vw] 2xl:text-[4.8vw] font-medium tracking-[-0.04em] text-white leading-[1.12]">
              Let's <span className="text-[#DFFCA1]">make it real.</span>
            </h2>
          </TitleReveal>
        </div>

        <div className="pt-4 flex justify-center">
          <ButtonCTA text="START THE PROJECT" />
        </div>
      </motion.div>
    </section>
  );
};
