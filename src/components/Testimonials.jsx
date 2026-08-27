import React from 'react';
import { testimonials } from '../data/testimonials';
import { TitleReveal } from './TitleReveal';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-28 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-20 text-center">
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-[-0.04em] text-white">
          <TitleReveal delay={0.1}>
            <span>What collaborators say</span>
          </TitleReveal>
        </h2>
        <p className="text-lg sm:text-xl text-[#9A9A96] mt-5 font-normal">
          100% human feedback from developers, graphic designers, and product leaders.
        </p>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="overflow-hidden whitespace-nowrap py-4">
        <div className="flex gap-8 w-max animate-marquee hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="w-[360px] sm:w-[460px] p-8 sm:p-10 rounded-xl bg-[#0A0A0A] border border-white/10 shrink-0 whitespace-normal flex flex-col justify-between shadow-2xl"
            >
              <p className="text-base sm:text-lg text-[#EDEBE4] leading-relaxed font-normal italic">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/20" 
                />
                <div>
                  <h4 className="text-lg font-medium text-white tracking-tight">{t.name}</h4>
                  <span className="font-mono-code text-xs text-[#DFFCA1]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
