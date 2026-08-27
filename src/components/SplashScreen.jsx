import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Unmount after circle reveal completes (1.05s total)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1050);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none flex items-center justify-center overflow-hidden">
      
      {/* Full Screen Green SVG with Expanding Center Circular Aperture Mask */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="splash-circle-reveal">
            {/* White: solid green canvas */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black circle at center: expands to reveal the website */}
            <motion.circle
              cx="50%"
              cy="50%"
              initial={{ r: '0%' }}
              animate={{ r: ['0%', '0%', '160%'] }}
              transition={{
                duration: 1.0,
                times: [0, 0.52, 1],
                ease: [0.77, 0, 0.175, 1]
              }}
              fill="black"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#DFFCA1" mask="url(#splash-circle-reveal)" />
      </svg>

      {/* Center Pulsing Signature Mark */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: [0.9, 1.06, 1, 0.92],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 0.68,
          times: [0, 0.25, 0.6, 0.88],
          ease: 'easeInOut' 
        }}
        className="relative z-10 flex flex-col items-center gap-3.5"
      >
        <img
          src="/img/signature_logo.png"
          alt="Iamkrs"
          className="h-16 sm:h-20 w-auto object-contain filter brightness-0 contrast-200"
        />
        <div className="font-mono-code text-[11px] sm:text-xs tracking-widest uppercase font-bold text-[#094020]">
          DESIGN / CODE / MOTION
        </div>
      </motion.div>

    </div>
  );
};
