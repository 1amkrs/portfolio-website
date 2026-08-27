import React from 'react';
import { motion } from 'framer-motion';

export const TitleReveal = ({ 
  children, 
  className = '', 
  color = '#DFFCA1', 
  delay = 0,
  duration = 0.85
}) => {
  return (
    <span className={`relative inline-flex overflow-hidden align-top ${className}`}>
      {/* Underlying Title Typography */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.02, delay: delay + duration * 0.42 }}
        className="w-full inline-block"
      >
        {children}
      </motion.span>

      {/* Sliding Green Reveal Bar */}
      <motion.span
        initial={{ x: '-101%' }}
        whileInView={{ x: ['-101%', '0%', '101%'] }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: duration,
          delay: delay,
          ease: [0.77, 0, 0.175, 1],
          times: [0, 0.45, 1]
        }}
        style={{ backgroundColor: color }}
        className="absolute inset-0 z-20 pointer-events-none"
      />
    </span>
  );
};
