import { AsciiSculpture } from './AsciiSculpture';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';
import { TitleReveal } from './TitleReveal';

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
    <section ref={targetRef} className="relative h-[320vh] bg-black select-none">
      
      {/* Sticky Full-Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        <motion.div style={{ x }} className="flex h-full w-[300vw] will-change-transform">
          
          {/* SLIDE 1: DARK EDITORIAL INTRO */}
          <div className="relative w-screen h-full shrink-0 bg-black p-8 md:p-16 flex flex-col justify-between border-r border-white/10 overflow-hidden font-sans">
            
            {/* Top Quote (Clean, without the scroll track badge) */}
            <div className="max-w-md z-10">
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white leading-snug tracking-tight">
                Most designers make things look pretty. I make things feel inevitable: where every button, token, and spring curve has a deliberate reason.
              </p>
            </div>

            {/* Center 1003.js Frame-by-Frame ASCII Rotating Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              <AsciiSculpture className="scale-100 sm:scale-125 md:scale-150 drop-shadow-[0_0_30px_rgba(223,252,161,0.25)]" />
            </div>

            {/* Telemetry */}
            <div className="w-full flex items-center justify-between text-xs text-[#9A9A96] z-10 font-medium">
              <span>KARTHIK SATHEESH</span>
              <span>/ 2026 /</span>
            </div>

            {/* Bottom Row: Massive Left Display Text & Right Scroll Indicator */}
            <div className="z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 w-full">
              <h2 className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-bold tracking-[-0.05em] text-[#DFFCA1] leading-[0.85] opacity-95">
                Portfolio@26
              </h2>

              {/* Bottom-Right Minimal Muted Grey Scroll Indicator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#9A9A96] tracking-wider uppercase mb-2 sm:mb-4">
                <span>Scroll</span>
                <span>→</span>
              </div>
            </div>

          </div>


          {/* SLIDE 2: BORDERLESS LIGHTER BRAND GRADIENT DESIGN SERVICES */}
          <div className="relative w-screen h-full shrink-0 bg-gradient-to-tr from-[#1E6B3B] via-[#489960] to-[#DFFCA1] text-white p-8 md:p-14 flex flex-col justify-between border-r border-white/20 overflow-hidden font-sans">
            
            {/* Lighter Luminous Ambient Glow */}
            <div className="absolute -top-20 -right-20 w-[700px] h-[700px] bg-[#DFFCA1]/60 blur-[150px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-[#3B8F55]/80 blur-[130px] pointer-events-none" />

            {/* Top Monumental Header Title */}
            <div className="z-10 pt-4 sm:pt-6">
              <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[9rem] xl:text-[10.5rem] font-bold tracking-[-0.045em] text-[#DFFCA1] leading-[0.92] select-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                Design services *
              </h2>
            </div>

            {/* Bottom 3 Borderless Featured Service Mockup Cards */}
            <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end w-full pb-4">
              
              {serviceCards.map((card, idx) => {
                const matchedProject = projects.find(p => p.id === card.projectId) || projects[0];

                return (
                  <div key={idx} className="flex flex-col space-y-3">
                    {/* Bigger Eyebrow Text */}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-md">
                      <TitleReveal delay={idx * 0.12}>
                        <span>{card.category}</span>
                      </TitleReveal>
                    </h3>

                    {/* Borderless Edge-to-Edge Image Mockup */}
                    <motion.div
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      onClick={() => onSelectProject && onSelectProject(matchedProject)}
                      className="cursor-pointer overflow-hidden shadow-2xl group aspect-[16/10] sm:aspect-[16/11] relative rounded-xl"
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 bg-[#DFFCA1] text-[#094020] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg rounded-md">
                        <ArrowUpRight size={16} />
                      </div>
                    </motion.div>
                  </div>
                );
              })}

            </div>

          </div>


          {/* SLIDE 3: DARK EDITORIAL OUTRO SLIDE */}
          <div className="relative w-screen h-full shrink-0 bg-black p-8 md:p-16 flex flex-col justify-between overflow-hidden font-sans">
            
            {/* Top Philosophy Quote */}
            <div className="max-w-xl z-10">
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-white leading-tight">
                Interfaces designed for humans, built for scale.
              </h3>
              <p className="text-base sm:text-lg text-[#9A9A96] mt-4 leading-relaxed font-normal">
                Bridging the divide between tactile aesthetics and robust engineering. If it adds friction to the user's day, I'll ruthlessly redesign it until it feels weightless.
              </p>
            </div>

            {/* Telemetry Stamp */}
            <div className="w-full flex items-center justify-between text-xs text-[#9A9A96] z-10 font-medium">
              <span>KOCHI / INDIA</span>
              <span>AVAILABLE WORLDWIDE</span>
            </div>

            {/* Massive Bottom Watermark */}
            <div className="z-10">
              <h2 className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-bold tracking-[-0.05em] text-white/10 leading-[0.85]">
                Karthik (.26)
              </h2>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
