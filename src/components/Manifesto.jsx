import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const Manifesto = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  // Deep Scroll-linked Multi-Layer Parallax Physics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Multi-tier Staggered Line Parallax (Creates real 3D depth separation between lines)
  const canvasY = useTransform(scrollYProgress, [0, 1], [-140, 140]);
  const line1Y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const line2Y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const line3Y = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  const textScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.03, 0.96]);
  const vignetteScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.0, 1.1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

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

    // Precomputed color buckets
    const PALETTES = Array.from({ length: NUM_PALETTES }, (_, i) => {
      const val = i / (NUM_PALETTES - 1);
      const r = Math.floor(22 + val * 190);
      const g = Math.floor(65 + val * 190);
      const b = Math.floor(30 + val * 65);
      const alpha = (0.2 + val * 0.8).toFixed(2);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    });

    const handleResize = () => {
      if (!section) return;
      width = section.clientWidth;
      height = (section.clientHeight || window.innerHeight) + 400; // Large buffer for deep parallax
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
    observer.observe(section);

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
        time += 0.035;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `600 ${FONT_SIZE}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cols = Math.ceil(canvas.width / CHAR_WIDTH);
        const rows = Math.ceil(canvas.height / CHAR_HEIGHT);
        const centerX = cols * 0.5;
        const centerY = rows * 0.5;

        // Buckets for batched rendering by color
        const buckets = Array.from({ length: NUM_PALETTES }, () => []);

        for (let y = 0; y < rows; y++) {
          const posY = y * CHAR_HEIGHT;
          const ny = (y - centerY) * 0.04;
          const wave2 = Math.cos(ny * 1.8 - time * 0.7);

          for (let x = 0; x < cols; x++) {
            const posX = x * CHAR_WIDTH;
            const nx = (x - centerX) * 0.04;

            const wave1 = Math.sin(nx * 1.5 + time * 0.9);
            const distSq = nx * nx + ny * ny;
            const swirl = Math.sin(distSq * 0.8 - time * 1.4);

            let mouseInfluence = 0;
            if (mouse.active) {
              const dx = posX - mouse.x;
              const dy = posY - mouse.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < 40000) {
                mouseInfluence = (1 - Math.sqrt(d2) / 200) * 1.2;
              }
            }

            let val = (wave1 + wave2 + swirl + 3) * 0.166 + mouseInfluence;
            if (val <= 0.12) continue;
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
      id="manifesto" 
      ref={sectionRef} 
      className="relative w-full h-[100dvh] min-h-[580px] overflow-hidden flex items-center justify-center border-y border-white/10 select-none bg-black"
    >
      {/* Scroll-Linked Parallax ASCII Canvas Background */}
      <motion.div 
        style={{ y: canvasY }} 
        className="absolute -top-48 -bottom-48 inset-x-0 w-full h-[calc(100%+380px)] will-change-transform pointer-events-auto"
      >
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
        />
      </motion.div>

      {/* Dynamic Radial Vignette Mask with Scroll Scale */}
      <motion.div 
        style={{ 
          scale: vignetteScale,
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.75) 55%, rgba(0, 0, 0, 0.98) 100%)'
        }}
        className="absolute inset-0 pointer-events-none will-change-transform"
      />

      {/* Multi-Layered 3D Parallax Typography */}
      <motion.div 
        style={{ scale: textScale }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4 sm:space-y-6 will-change-transform"
      >
        {/* Line 1: Be Real * (High Parallax Layer) */}
        <motion.div
          style={{ y: line1Y }}
          initial={{ opacity: 0, scale: 0.7, y: 50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ 
            type: 'spring', 
            stiffness: 260, 
            damping: 20, 
            delay: 0.1 
          }}
          className="will-change-transform"
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white leading-[1.02] drop-shadow-2xl">
            Be Real <span className="text-[#DFFCA1]">*</span>
          </h2>
        </motion.div>

        {/* Line 2: Be Creative # (Mid Parallax Layer) */}
        <motion.div
          style={{ y: line2Y }}
          initial={{ opacity: 0, scale: 0.7, y: 50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ 
            type: 'spring', 
            stiffness: 260, 
            damping: 20, 
            delay: 0.25 
          }}
          className="will-change-transform"
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white leading-[1.02] drop-shadow-2xl">
            Be Creative <span className="text-[#DFFCA1]">#</span>
          </h2>
        </motion.div>

        {/* Line 3: Be Bold TM (Counter Parallax Layer) */}
        <motion.div
          style={{ y: line3Y }}
          initial={{ opacity: 0, scale: 0.7, y: 50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ 
            type: 'spring', 
            stiffness: 260, 
            damping: 20, 
            delay: 0.4 
          }}
          className="will-change-transform"
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white leading-[1.02] drop-shadow-2xl">
            Be Bold <span className="text-[#DFFCA1] text-2xl sm:text-4xl align-super">TM</span>
          </h2>
        </motion.div>
      </motion.div>
    </section>
  );
};
