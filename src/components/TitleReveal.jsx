import React from 'react';
import { motion } from 'framer-motion';

export const TitleReveal = ({ 
  children, 
  className = '', 
  color = '#DFFCA1', 
  delay = 0,
  duration = 0.75
}) => {
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {/* Underlying Title Typography */}
      <span className="block relative z-10 w-full">
        {children}
      </span>

      {/* Lime Green Reveal Bar: Covers text in default state, slides off when entering viewport */}
      <motion.span
        initial={{ x: '0%' }}
        whileInView={{ x: '105%' }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: duration,
          delay: delay + 0.15,
          ease: [0.77, 0, 0.175, 1]
        }}
        style={{ backgroundColor: color }}
        className="absolute inset-0 z-20 pointer-events-none rounded-[1px] shadow-[0_0_15px_rgba(223,252,161,0.4)]"
      />
    </span>
  );
};
