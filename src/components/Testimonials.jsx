import React from 'react';
import { testimonials } from '../data/testimonials';
import { TitleReveal } from './TitleReveal';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="pt-10 sm:pt-16 md:pt-36 pb-20 sm:pb-28 md:pb-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10 sm:mb-16 md:mb-20 text-center">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.04em] text-white leading-[1.05] flex flex-col items-center gap-1">
          <TitleReveal delay={0.1}>
            <span>Nice Things</span>
          </TitleReveal>
          <TitleReveal delay={0.25}>
            <span>People Have Said</span>
          </TitleReveal>
          <TitleReveal delay={0.4}>
            <span>About Me</span>
          </TitleReveal>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#9A9A96] mt-6 font-normal">
          100% human feedback from developers, graphic designers, and product leaders.
        </p>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="overflow-hidden whitespace-nowrap py-4">
        <div className="flex gap-8 w-max animate-marquee">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="w-[360px] sm:w-[460px] p-8 sm:p-10 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all duration-300 shrink-0 whitespace-normal flex flex-col justify-between shadow-2xl"
            >
              <p className="text-lg sm:text-xl md:text-[1.3rem] text-white/80 font-semibold tracking-[-0.025em] leading-[1.38]">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-14 h-14 rounded-full object-cover border border-white/20" 
                />
                <div>
                  <h4 className="text-base sm:text-lg font-medium text-white tracking-tight">{t.name}</h4>
                  <span className="font-mono-code text-xs text-[#DFFCA1]/90">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
