import { AsciiSculpture } from './AsciiSculpture';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';

export const HorizontalScrollSection = ({ onSelectProject }) => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  });

  // Transform vertical scroll progress into horizontal translation across 3 slides
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666%']);

  const serviceCards = [
    {
      category: 'Website design',
      title: 'Kaira Media OS',
      subtitle: 'Living code gamepad-first TV shell experience',
      image: '/KairaOS/img/tv mockup.png',
      projectId: 'kaira-os'
    },
    {
      category: 'Product design',
      title: 'DRAUN Desktop Audio',
      subtitle: 'Tactile parametric EQ & E-Ink music application',
      image: '/DRAUN/img/1.png',
      projectId: 'draun'
    },
    {
      category: 'UI/Visual design',
      title: 'QueWorkspace Platform',
      subtitle: 'Enterprise co-working space operating system',
      image: '/img/queworkspace.jpg',
      projectId: 'queworkspace'
    }
  ];

  return (
    <>
      {/* =========================================================================
          1. MOBILE EDITORIAL VIEW (Screens < 768px)
          Native 120Hz smooth vertical flow: 0 reloads, 0 layout shifts, 0 sticky traps
          ========================================================================= */}
      <div className="block md:hidden bg-black select-none">
        
        {/* SLIDE 1: DARK EDITORIAL INTRO */}
        <div className="relative w-full min-h-[90svh] bg-black p-6 sm:p-8 flex flex-col justify-between border-b border-white/10 overflow-hidden font-sans">
          <div className="max-w-md z-10">
            <p className="text-lg sm:text-xl font-medium text-white leading-snug tracking-tight">
              Most designers make things look pretty. I make things feel inevitable: where every button, token, and spring curve has a deliberate reason.
            </p>
          </div>

          <div className="py-8 flex items-center justify-center pointer-events-none">
            <AsciiSculpture className="scale-90 sm:scale-100" />
          </div>

          <div className="w-full flex items-center justify-between text-xs text-[#9A9A96] z-10 font-medium pb-4">
            <span>i like cats.</span>
            <span>/ 2026 /</span>
          </div>

          <div className="z-10 flex items-end justify-between w-full pt-2">
            <h2 className="text-5xl sm:text-7xl font-bold tracking-[-0.05em] text-[#DFFCA1] leading-[0.85] opacity-95">
              Portfolio@26
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#9A9A96] tracking-wider uppercase">
              <span>Scroll</span>
              <span>↓</span>
            </div>
          </div>
        </div>

        {/* SLIDE 2: DESIGN SERVICES */}
        <div className="relative w-full bg-gradient-to-tr from-[#1E6B3B] via-[#489960] to-[#DFFCA1] text-white p-6 sm:p-8 flex flex-col justify-between border-b border-white/20 overflow-hidden font-sans">
          {/* Ambient Glow */}
          <div 
            className="absolute -top-20 -right-20 w-[400px] h-[400px] pointer-events-none opacity-50"
            style={{ background: 'radial-gradient(circle, rgba(223, 252, 161, 0.4) 0%, transparent 70%)' }}
          />
          <div 
            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] pointer-events-none opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(59, 143, 85, 0.5) 0%, transparent 70%)' }}
          />

          <div className="z-10 pt-2 pb-6">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.045em] text-[#DFFCA1] leading-[0.95] select-none drop-shadow-md">
              Design services *
            </h2>
          </div>

          <div className="z-10 flex flex-col gap-5 w-full pb-4">
            {serviceCards.map((card, idx) => {
              const matchedProject = projects.find(p => p.id === card.projectId) || projects[0];

              return (
                <div key={idx} className="flex flex-col space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-md">
                    {card.category}
                  </h3>

                  <div
                    onClick={() => onSelectProject && onSelectProject(matchedProject)}
                    className="cursor-pointer overflow-hidden shadow-2xl group aspect-[16/10] relative rounded-xl bg-black/40 active:scale-[0.98] transition-transform"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-[#DFFCA1] text-[#094020] flex items-center justify-center opacity-90 shadow-lg rounded-md">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLIDE 3: DARK EDITORIAL OUTRO */}
        <div className="relative w-full bg-black p-6 sm:p-8 flex flex-col justify-between border-b border-white/10 overflow-hidden font-sans space-y-12 py-16">
          <div className="max-w-md z-10">
            <h3 className="text-3xl sm:text-4xl font-medium tracking-[-0.04em] text-white leading-[1.1]">
              Designing. Building.
              <br />
              Breaking. Repeating.
            </h3>
          </div>

          <div className="w-full flex items-center justify-between text-xs text-[#9A9A96] z-10 font-medium">
            <span>KOCHI / INDIA</span>
            <span>AVAILABLE WORLDWIDE</span>
          </div>

          <div className="z-10">
            <h2 className="text-6xl sm:text-7xl font-medium tracking-[-0.05em] text-white/10 leading-[0.85] whitespace-nowrap">
              Karthik (26)
            </h2>
          </div>
        </div>

      </div>

      {/* =========================================================================
          2. DESKTOP PINNED HORIZONTAL TRACK (Screens >= 768px)
          Smooth, pinned 3-slide horizontal travel with buttery physics
          ========================================================================= */}
      <section ref={targetRef} className="hidden md:block relative h-[300vh] bg-black select-none">
        
        {/* Sticky Full-Viewport Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center overscroll-none">
          
          <motion.div style={{ x }} className="flex h-full w-[300vw] will-change-transform">
            
            {/* SLIDE 1: DARK EDITORIAL INTRO */}
            <div className="relative w-screen h-full shrink-0 bg-black p-8 md:p-10 lg:p-12 2xl:p-16 flex flex-col justify-between border-r border-white/10 overflow-hidden font-sans">
              
              {/* Top Quote */}
              <div className="max-w-md lg:max-w-lg z-10">
                <p className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-medium text-white leading-snug tracking-tight">
                  Most designers make things look pretty. I make things feel inevitable: where every button, token, and spring curve has a deliberate reason.
                </p>
              </div>

              {/* Center 1003.js Frame-by-Frame ASCII Rotating Animation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                <AsciiSculpture className="horizontal-slide-sculpture md:scale-100 lg:scale-[1.05] xl:scale-[1.12] 2xl:scale-[1.3]" />
              </div>

              {/* Telemetry */}
              <div className="w-full flex items-center justify-between text-xs text-[#9A9A96] z-10 font-medium">
                <span>i like cats.</span>
                <span>/ 2026 /</span>
              </div>

              {/* Bottom Row: Massive Left Display Text & Right Scroll Indicator */}
              <div className="z-10 flex items-end justify-between gap-6 w-full">
                <h2 className="horizontal-slide-headline text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] 2xl:text-[11.5rem] font-bold tracking-[-0.05em] text-[#DFFCA1] leading-[0.85] opacity-95 whitespace-nowrap">
                  Portfolio@26
                </h2>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#9A9A96] tracking-wider uppercase mb-1 sm:mb-4">
                  <span>Scroll</span>
                  <span>→</span>
                </div>
              </div>

            </div>

            {/* SLIDE 2: BORDERLESS LIGHTER BRAND GRADIENT DESIGN SERVICES */}
            <div className="relative w-screen h-full shrink-0 bg-gradient-to-tr from-[#1E6B3B] via-[#489960] to-[#DFFCA1] text-white p-8 md:p-14 flex flex-col justify-between border-r border-white/20 overflow-hidden font-sans">
              
              {/* Lighter Luminous Ambient Glow (High-Performance Hardware Radial Gradient) */}
              <div 
                className="absolute -top-20 -right-20 w-[650px] h-[650px] pointer-events-none opacity-60"
                style={{ background: 'radial-gradient(circle, rgba(223, 252, 161, 0.45) 0%, rgba(223, 252, 161, 0.12) 40%, transparent 70%)' }}
              />
              <div 
                className="absolute -bottom-20 -left-20 w-[550px] h-[550px] pointer-events-none opacity-70"
                style={{ background: 'radial-gradient(circle, rgba(59, 143, 85, 0.55) 0%, rgba(59, 143, 85, 0.18) 40%, transparent 70%)' }}
              />

              {/* Top Monumental Header Title */}
              <div className="z-10 pt-1 sm:pt-4">
                <h2 className="text-5xl md:text-8xl lg:text-[9rem] xl:text-[10.5rem] font-bold tracking-[-0.045em] text-[#DFFCA1] leading-[0.95] select-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                  Design services *
                </h2>
              </div>

              {/* 3 Featured Service Mockup Cards (3-Col Grid on Desktop) */}
              <div className="z-10 grid grid-cols-3 gap-6 lg:gap-8 items-end w-full pb-4">
                {serviceCards.map((card, idx) => {
                  const matchedProject = projects.find(p => p.id === card.projectId) || projects[0];

                  return (
                    <div key={idx} className="flex flex-col space-y-2 md:space-y-3">
                      <h3 className="text-base md:text-xl font-bold text-white tracking-tight drop-shadow-md">
                        {card.category}
                      </h3>

                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={() => onSelectProject && onSelectProject(matchedProject)}
                        className="cursor-pointer overflow-hidden shadow-2xl group aspect-[16/10] relative rounded-xl bg-black/40"
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-[#DFFCA1] text-[#094020] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg rounded-md">
                          <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300 ease-out" />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* SLIDE 3: DARK EDITORIAL OUTRO SLIDE */}
            <div className="relative w-screen h-full shrink-0 bg-black p-8 md:p-10 lg:p-12 2xl:p-16 flex flex-col justify-between overflow-hidden font-sans">
              
              <div className="max-w-2xl z-10">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-white leading-[1.08]">
                  Designing. Building.
                  <br />
                  Breaking. Repeating.
                </h3>
              </div>

              <div className="w-full flex items-center justify-between text-xs text-[#9A9A96] z-10 font-medium">
                <span>KOCHI / INDIA</span>
                <span>AVAILABLE WORLDWIDE</span>
              </div>

              <div className="z-10">
                <h2 className="horizontal-slide-headline text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] 2xl:text-[11.5rem] font-medium tracking-[-0.05em] text-white/10 leading-[0.85] whitespace-nowrap">
                  Karthik (26)
                </h2>
              </div>

            </div>

          </motion.div>

        </div>
      </section>
    </>
  );
};
