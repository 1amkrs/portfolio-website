import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { ButtonCTA } from './ButtonCTA';
import { MarqueeTicker } from './MarqueeTicker';
import { TitleReveal } from './TitleReveal';
import SilkWaves from './SilkWaves';

const GREETINGS = [
  { text: 'Hello', lang: 'English' },
  { text: 'നമസ്കാരം', lang: 'Malayalam' },
  { text: 'नमस्ते', lang: 'Hindi' },
  { text: 'வணக்கம்', lang: 'Tamil' },
  { text: 'ನಮಸ್ಕಾರ', lang: 'Kannada' },
  { text: 'こんにちは', lang: 'Japanese' },
  { text: 'Bonjour', lang: 'French' },
  { text: '¡Hola!', lang: 'Spanish' },
  { text: 'Hallo', lang: 'German' },
  { text: 'Ciao', lang: 'Italian' }
];

export const Hero = () => {
  const [greetIndex, setGreetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full bg-black text-white flex flex-col justify-between pt-24 sm:pt-28 overflow-hidden select-none">
      
      {/* Silk Waves WebGL Background with Project Color Tokens */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-85">
        <SilkWaves
          speed={0.42}
          amplitude={1.0}
          frequency={1.3}
          sheen={1.8}
          colorBase="#000000"
          colorMid="#094020"
          colorHighlight="#DFFCA1"
          colorAccent="#EDEBE4"
        />
      </div>

      {/* Main Hero Split Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Clean Borderless Circular Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-start items-center"
          >
            <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group">
              {/* Grayscale Studio Portrait Image */}
              <img
                src="/img/hero_profile_portrait.png"
                alt="Karthik Satheesh"
                className="w-full h-full object-cover object-[center_20%] filter grayscale contrast-115 brightness-105 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Right Column: Statement Typography in 3 Exact Lines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col items-start justify-center"
          >
            {/* Animated 10-Language Greeting Pill */}
            <div className="mb-3 sm:mb-5">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-lg select-none">
                <span className="w-2 h-2 rounded-full bg-[#DFFCA1] shadow-[0_0_8px_#DFFCA1] shrink-0 animate-pulse" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={greetIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="flex items-center gap-2 font-mono text-xs sm:text-sm text-white"
                  >
                    <span className="font-bold text-[#DFFCA1] tracking-wide font-sans">
                      {GREETINGS[greetIndex].text}
                    </span>
                    <span className="text-white/40 text-[10px] sm:text-xs">
                      // {GREETINGS[greetIndex].lang}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.2rem] 2xl:text-[4.8rem] font-bold tracking-[-0.045em] text-white leading-[1.08] flex flex-col items-start gap-1">
              <TitleReveal delay={0.1}>
                <span className="block sm:whitespace-nowrap">I'm Karthik Satheesh,</span>
              </TitleReveal>
              <TitleReveal delay={0.25}>
                <span className="block sm:whitespace-nowrap">a Digital Product Designer</span>
              </TitleReveal>
              <TitleReveal delay={0.4}>
                <span className="block sm:whitespace-nowrap">based in Kochi, Kerala.</span>
              </TitleReveal>
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
