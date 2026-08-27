import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Buttery spring physics for smooth trailing cursor motion
  const springConfig = { damping: 30, stiffness: 480, mass: 0.15 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const lastTargetRef = useRef(null);

  useEffect(() => {
    // Disable on coarse pointer devices (touchscreens)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafHoverId = null;

    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Throttled interactive element check to avoid layout thrashing and re-render storms
      if (e.target !== lastTargetRef.current) {
        lastTargetRef.current = e.target;
        if (!rafHoverId) {
          rafHoverId = requestAnimationFrame(() => {
            const isInteractive = !!e.target?.closest?.('a, button, input, textarea, [role="button"], .cursor-pointer, [data-cursor-hover]');
            setIsHovered(isInteractive);
            rafHoverId = null;
          });
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      lastTargetRef.current = null;
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      if (rafHoverId) cancelAnimationFrame(rafHoverId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden hidden md:block">
      {/* Outer Smooth Trailing Ring */}
      <motion.div
        style={{
          left: smoothX,
          top: smoothY,
          x: '-50%',
          y: '-50%'
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? '#DFFCA1' : 'rgba(223, 252, 161, 0.45)',
          backgroundColor: isHovered ? 'rgba(223, 252, 161, 0.12)' : 'rgba(223, 252, 161, 0.0)'
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed w-8 h-8 rounded-full border border-[#DFFCA1]/45 pointer-events-none will-change-transform"
      />

      {/* Inner Precision Dot */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%'
        }}
        animate={{
          scale: isHovered ? 0.6 : 1,
          backgroundColor: isHovered ? '#DFFCA1' : '#FFFFFF'
        }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        className="fixed w-2 h-2 rounded-full pointer-events-none will-change-transform"
      />
    </div>
  );
};
