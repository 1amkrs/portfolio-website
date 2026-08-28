"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const ImageReveal = ({
  visualData = [],
  onSelectProject,
  className = ""
}) => {
  const [focusedItem, setFocusedItem] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const hasPosition = useRef(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 450, damping: 35, mass: 0.2 });
  const smoothY = useSpring(cursorY, { stiffness: 450, damping: 35, mass: 0.2 });

  const updateCursor = (clientX, clientY, instant = false) => {
    if (!hasPosition.current || instant) {
      cursorX.set(clientX);
      cursorY.set(clientY);
      smoothX.jump(clientX);
      smoothY.jump(clientY);
      hasPosition.current = true;
    } else {
      cursorX.set(clientX);
      cursorY.set(clientY);
    }
  };

  useEffect(() => {
    const updateScreen = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    updateScreen();
    window.addEventListener("resize", updateScreen);

    const handleGlobalMouseMove = (e) => {
      updateCursor(e.clientX, e.clientY, !hasPosition.current);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", updateScreen);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, []);

  const onMouseTrack = (e) => {
    updateCursor(e.clientX, e.clientY);
  };

  const onHoverActivate = (item, e) => {
    if (e) {
      updateCursor(e.clientX, e.clientY, !hasPosition.current);
    }
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
              className={`py-4 sm:py-5 px-2 sm:px-4 cursor-pointer relative flex items-center justify-between transition-colors duration-150 group ${
                isFocused ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
              }`}
              onMouseEnter={(e) => onHoverActivate(item, e)}
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
                    className={`text-sm sm:text-base md:text-lg font-normal tracking-tight transition-all duration-150 ${
                      isFocused
                        ? "text-white font-medium translate-x-1"
                        : "text-[#888888] group-hover:text-[#EDEBE4]"
                    }`}
                  >
                    {item.title || item.label}
                  </span>

                  {/* Active Glowing Dot */}
                  {isFocused && (
                    <motion.span
                      layoutId="tableActiveDot"
                      className="w-2 h-2 rounded-full bg-[#DFFCA1] shadow-[0_0_10px_#DFFCA1] shrink-0"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
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

      {/* Ultra-Smooth GPU-Accelerated Floating Mockup Reveal */}
      {isLargeScreen && (
        <motion.div
          className="fixed top-0 left-0 z-50 pointer-events-none will-change-transform"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%"
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{
            opacity: focusedItem ? 1 : 0,
            scale: focusedItem ? 1 : 0.88
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {focusedItem && (
            <div className="overflow-hidden rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-black/60 backdrop-blur-sm border border-white/10">
              <img
                src={focusedItem.image || focusedItem.url}
                alt={focusedItem.title || focusedItem.label}
                className="w-[320px] sm:w-[380px] md:w-[420px] max-h-[300px] object-contain rounded-xl sm:rounded-2xl pointer-events-none select-none"
              />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ImageReveal;
