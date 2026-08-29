import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';

export const MarqueeTicker = ({ className = "" }) => {
  const items = [
    "Karthik Satheesh",
    "UI/UX Designer",
    "Multidisciplinary Designer",
    "Creative Engineer",
    "Digital Architect",
    "Interaction Designer"
  ];

  // Duplicate list to create a seamless loop
  const seamlessList = [...items, ...items, ...items, ...items];

  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const currentSpeed = useRef(60); // px per second

  useAnimationFrame((time, delta) => {
    // Normal speed: 60 px/s; Hover speed: 14 px/s
    const targetSpeed = isHovered ? 14 : 60;
    
    // Smooth deceleration / acceleration lerp factor
    currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.06;

    if (containerRef.current) {
      const totalWidth = containerRef.current.scrollWidth;
      const halfWidth = totalWidth / 2;

      if (halfWidth > 0) {
        let newX = x.get() - (currentSpeed.current * (delta / 1000));
        if (newX <= -halfWidth) {
          newX += halfWidth;
        }
        x.set(newX);
      }
    }
  });

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`overflow-hidden whitespace-nowrap py-3 sm:py-4 bg-[#DFFCA1] text-[#094020] border-y border-[#094020]/20 select-none cursor-default ${className}`}
    >
      <motion.div 
        ref={containerRef}
        style={{ x }}
        className="flex items-center gap-10 sm:gap-14 w-max will-change-transform"
      >
        {seamlessList.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 sm:gap-12 shrink-0">
            {/* Unboxed Enlarged Copyright Symbol */}
            <span className="text-2xl sm:text-4xl md:text-5xl font-medium select-none shrink-0">
              &copy;
            </span>
            {/* Bold Text */}
            <span className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.04em] whitespace-nowrap">
              {item}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
