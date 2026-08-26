"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const ImageReveal = ({
  visualData = [],
  onSelectProject,
  className = ""
}) => {
  const [focusedItem, setFocusedItem] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 320, damping: 32, mass: 0.5 });
  const smoothY = useSpring(cursorY, { stiffness: 320, damping: 32, mass: 0.5 });

  useEffect(() => {
    const updateScreen = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    updateScreen();
    window.addEventListener("resize", updateScreen);
    return () => window.removeEventListener("resize", updateScreen);
  }, []);

  const onMouseTrack = (e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  const onHoverActivate = (item) => {
    setFocusedItem(item);
  };

  const onHoverDeactivate = () => {
    setFocusedItem(null);
  };

  return (
    <div
      className={`relative mx-auto w-full min-h-fit bg-transparent select-none ${className}`}
      onMouseMove={onMouseTrack}
      onMouseLeave={onHoverDeactivate}
    >
      {/* Exact Match Table Rows (Matching Reference Image) */}
      <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
        {visualData.map((item, idx) => {
          const number = `(0${idx + 1})`;
          const isFocused = focusedItem?.id === item.id;

          return (
            <div
              key={item.id || idx}
              className={`py-4 sm:py-5 px-2 sm:px-4 cursor-pointer relative flex items-center justify-between transition-colors duration-200 group ${
                isFocused ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
              }`}
              onMouseEnter={() => onHoverActivate(item)}
              onClick={() => onSelectProject && onSelectProject(item)}
            >
              {/* Left Side: Number Index and Project Title */}
              <div className="flex items-center gap-6 sm:gap-12 md:gap-16">
                {/* Index */}
                <span
                  className={`font-mono-code text-xs sm:text-sm w-12 sm:w-14 shrink-0 transition-colors ${
                    isFocused ? "text-white font-bold" : "text-[#777777]"
                  }`}
                >
                  {number}
                </span>

                {/* Title & Glowing Status Dot */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm sm:text-base md:text-lg font-normal tracking-tight transition-all duration-200 ${
                      isFocused
                        ? "text-white font-medium translate-x-1"
                        : "text-[#888888] group-hover:text-[#EDEBE4]"
                    }`}
                  >
                    {item.title || item.label}
                  </span>

                  {/* Active Glowing Dot (Matching Reference) */}
                  {isFocused && (
                    <motion.span
                      layoutId="tableActiveDot"
                      className="w-2 h-2 rounded-full bg-[#DFFCA1] shadow-[0_0_10px_#DFFCA1] shrink-0"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </div>
              </div>

              {/* Right Side: Year aligned to the far right */}
              <div className="text-right shrink-0">
                <span
                  className={`font-mono-code text-xs sm:text-sm transition-colors ${
                    isFocused ? "text-white font-bold" : "text-[#777777]"
                  }`}
                >
                  {item.year || "2026"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Mockup Reveal on Hover */}
      {isLargeScreen && (
        <AnimatePresence>
          {focusedItem && (
            <motion.div
              key={`reveal-${focusedItem.id}`}
              className="fixed z-50 pointer-events-none"
              style={{
                left: smoothX,
                top: smoothY,
                x: "-50%",
                y: "-50%"
              }}
              initial={{ opacity: 0, scale: 0.75, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.75, rotate: 2 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <div className="overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]">
                <img
                  src={focusedItem.image || focusedItem.url}
                  alt={focusedItem.title || focusedItem.label}
                  className="w-[340px] sm:w-[400px] md:w-[450px] max-h-[320px] object-contain rounded-xl sm:rounded-2xl filter contrast-125 pointer-events-none select-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ImageReveal;
