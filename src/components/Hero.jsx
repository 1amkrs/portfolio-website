import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { ButtonCTA } from './ButtonCTA';
import { MarqueeTicker } from './MarqueeTicker';
import { TitleReveal } from './TitleReveal';
import SilkWaves from './SilkWaves';

const ASCII_CHARS = '!<>/[]{}*+=^?#_01%$&~';

const GREETINGS = [
  { text: 'Hello,', lang: 'English' },
  { text: 'നമസ്കാരം,', lang: 'Malayalam' },
  { text: 'नमस्ते,', lang: 'Hindi' },
  { text: 'வணக்கம்,', lang: 'Tamil' },
  { text: 'ನಮಸ್ಕಾರ,', lang: 'Kannada' },
  { text: 'こんにちは,', lang: 'Japanese' },
  { text: 'Bonjour,', lang: 'French' },
  { text: '¡Hola!,', lang: 'Spanish' },
  { text: 'Hallo,', lang: 'German' },
  { text: 'Ciao,', lang: 'Italian' }
];

const AsciiGreeting = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState(GREETINGS[0].text);

  useEffect(() => {
    let frame = 0;
    let scrambleInterval;
    
    const cycleTimeout = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % GREETINGS.length;
        const targetText = GREETINGS[nextIndex].text;
        
        frame = 0;
        clearInterval(scrambleInterval);
        
        const maxFrames = 10;
        scrambleInterval = setInterval(() => {
          frame++;
          const progress = frame / maxFrames;
          
          const scrambled = targetText
            .split('')
            .map((char, charIdx) => {
              if (char === ' ') return ' ';
              if (charIdx / targetText.length < progress) {
                return char;
              }
              return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
            })
            .join('');
            
          setDisplayText(scrambled);
          
          if (frame >= maxFrames) {
            setDisplayText(targetText);
            clearInterval(scrambleInterval);
          }
        }, 32);

        return nextIndex;
      });
    }, 2500);

    return () => {
      clearInterval(cycleTimeout);
      clearInterval(scrambleInterval);
    };
  }, []);

  return (
    <div className="select-none text-[#DFFCA1] leading-[1.08]">
      <span className="text-2xl xs:text-3xl sm:text-4xl md:text-[2.2rem] lg:text-[1.85rem] xl:text-[2.4rem] 2xl:text-[3.2rem] font-medium tracking-[-0.045em] block">
        {displayText}
      </span>
    </div>
  );
};

export const Hero = () => {
  return (
    <section className="relative h-[100dvh] w-full bg-black text-white flex flex-col justify-between pt-24 sm:pt-28 overflow-hidden select-none">
      
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
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* Left Column: Clean Borderless Circular Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 xl:col-span-5 flex justify-start items-center"
          >
            <div className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] lg:w-[300px] lg:h-[300px] xl:w-[380px] xl:h-[380px] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group">
              {/* Grayscale Studio Portrait Image */}
              <img
                src="/img/hero_profile_portrait.png"
                alt="Karthik Satheesh"
                className="w-full h-full object-cover object-[center_20%] filter grayscale contrast-115 brightness-105 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Right Column: Statement Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 xl:col-span-7 flex flex-col items-start justify-center max-w-full"
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-[2.2rem] lg:text-[1.85rem] xl:text-[2.4rem] 2xl:text-[3.2rem] font-medium tracking-[-0.045em] text-white leading-[1.12] flex flex-col items-start gap-1 max-w-full">
              {/* Plain Text Neue Montreal ASCII Scramble Greeting */}
              <AsciiGreeting />

              <TitleReveal delay={0.1}>
                <span className="block">I'm Karthik. I design products,</span>
              </TitleReveal>
              <TitleReveal delay={0.25}>
                <span className="block">interfaces & the occasional questionable idea.</span>
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
