import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 0.85s load duration before triggering curtain reveal
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: '0%' }}
          exit={{ 
            y: '-100%',
            transition: { 
              duration: 0.75, 
              ease: [0.77, 0, 0.175, 1] 
            } 
          }}
          className="fixed inset-0 z-[9999] bg-[#DFFCA1] flex flex-col items-center justify-between p-8 sm:p-12 pointer-events-none select-none text-[#094020] font-sans"
        >
          {/* Top Telemetry Bar */}
          <div className="w-full flex items-center justify-between text-xs sm:text-sm font-mono-code font-bold uppercase tracking-widest opacity-80">
            <span>KARTHIK SATHEESH</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#094020] animate-ping" />
              <span>INITIALIZING</span>
            </span>
          </div>

          {/* Center Pulsing Signature Mark */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0.6 }}
            animate={{ 
              scale: [0.92, 1.05, 0.98, 1.02],
              opacity: [0.6, 1, 0.85, 1]
            }}
            transition={{ 
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut' 
            }}
            className="flex flex-col items-center gap-4"
          >
            <img
              src="/img/signature_logo.png"
              alt="Iamkrs"
              className="h-14 sm:h-20 w-auto object-contain filter brightness-0 contrast-200"
            />
            <div className="flex items-center gap-2 font-mono-code text-xs tracking-widest uppercase font-bold text-[#094020]/90">
              <span>DESIGN / CODE / MOTION</span>
            </div>
          </motion.div>

          {/* Bottom Telemetry */}
          <div className="w-full flex items-center justify-between text-xs font-mono-code font-bold opacity-80">
            <span>[ SYSTEM: PORTFOLIO@2026 ]</span>
            <span>KOCHI, IN</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
