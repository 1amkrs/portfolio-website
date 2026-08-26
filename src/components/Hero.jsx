import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { ButtonCTA } from './ButtonCTA';
import { MarqueeTicker } from './MarqueeTicker';
import SilkWaves from './SilkWaves';

export const Hero = () => {
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setIstTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full bg-[#090B0A] text-white flex flex-col justify-between pt-24 sm:pt-28 overflow-hidden select-none">
      
      {/* Silk Waves WebGL Background with Project Color Tokens */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-85">
        <SilkWaves
          speed={0.42}
          amplitude={1.0}
          frequency={1.3}
          sheen={1.8}
          colorBase="#090B0A"
          colorMid="#094020"
          colorHighlight="#DFFCA1"
          colorAccent="#EDEBE4"
        />
      </div>

      {/* Main Hero Split Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Enlarged Live Portrait HUD Capsule */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex justify-start"
          >
            <div className="relative w-full max-w-[580px] lg:max-w-[640px] aspect-[4/3] sm:aspect-[16/11.5] border-2 border-white/25 bg-[#111312] rounded-xl shadow-2xl overflow-hidden group">
              
              {/* Grayscale Studio Portrait Image */}
              <img
                src="/img/hero_profile_portrait.png"
                alt="Karthik Satheesh live camera"
                className="w-full h-full object-cover object-[center_20%] filter grayscale contrast-115 brightness-105 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Scrim for HUD Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

              {/* HUD Live Time Indicator (Top Right) */}
              <div className="absolute top-3.5 right-3.5 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/20 flex items-center gap-2 font-mono-code text-xs text-white shadow-lg">
                <span className="w-2 h-2 bg-[#DFFCA1] shadow-[0_0_8px_#DFFCA1] animate-pulse" />
                <span>{istTime || '10:00:00 PM IST'}</span>
              </div>

              {/* Top Left Bracket Telemetry */}
              <div className="absolute top-3.5 left-3.5 font-mono-code text-[11px] text-white/70 tracking-wider">
                [LIVE / 24.8fps]
              </div>

              {/* Bottom Left Camera Tag */}
              <div className="absolute bottom-3 left-3.5 font-mono-code text-[10px] text-[#9A9A96] tracking-widest uppercase">
                CAM_01 // KOCHI_STUDIO
              </div>
            </div>
          </motion.div>

          {/* Right Column: Statement Typography in 3 Exact Lines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.2rem] 2xl:text-[4.8rem] font-bold tracking-[-0.045em] text-white leading-[1.05]">
              <span className="block sm:whitespace-nowrap">I'm Karthik Satheesh,</span>
              <span className="block sm:whitespace-nowrap">a Digital Product Designer</span>
              <span className="block sm:whitespace-nowrap">based in Kochi, Kerala.</span>
            </h1>
          </motion.div>

        </div>
      </div>

      {/* Bottom Hero HUD Telemetry Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-between font-mono-code text-xs sm:text-sm text-[#9A9A96] relative z-10 pb-3">
        
        {/* Left: Scroll Down prompt */}
        <a
          href="#work"
          className="flex items-center gap-2 hover:text-[#DFFCA1] transition-colors"
        >
          <span>Scroll down</span>
          <ArrowDown size={14} className="animate-bounce" />
        </a>

        {/* Right: Start The Project Dual-Pill CTA */}
        <ButtonCTA text="START THE PROJECT" />

      </div>

      {/* Marquee Ticker Anchored Directly in the 100vh Hero View */}
      <div className="relative z-10 shrink-0">
        <MarqueeTicker className="!py-4 sm:!py-5" />
      </div>

    </section>
  );
};
