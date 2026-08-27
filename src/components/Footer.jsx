import React from 'react';
import { TitleReveal } from './TitleReveal';

export const Footer = ({ onOpenResume }) => {
  const email = 'karthiksatheesh610@gmail.com';

  return (
    <footer id="contact" className="relative w-full bg-black text-white select-none border-t border-white/10 pt-16 sm:pt-20 pb-0 overflow-hidden font-sans flex flex-col">
      
      {/* Top Content Container */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-20">
        
        {/* Main Grid: Headline & Action Buttons (Left) + Social Links (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end justify-between">
          
          {/* Left Column: Let's make something Bold, + Pill Buttons */}
          <div className="lg:col-span-8 flex flex-col items-start space-y-8">
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-medium tracking-[-0.045em] text-white leading-[0.98] flex flex-col items-start gap-1">
              <TitleReveal delay={0.1}>
                <span className="block">Let's make</span>
              </TitleReveal>
              <TitleReveal delay={0.25}>
                <span className="block">something Bold,</span>
              </TitleReveal>
            </h2>

            {/* Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`mailto:${email}`}
                className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full border border-white/30 hover:border-[#DFFCA1] bg-white/[0.02] hover:bg-[#DFFCA1] hover:text-[#094020] text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2.5 group"
              >
                <span>DROP ME AN EMAIL</span>
                <span className="font-normal text-xs">@</span>
              </a>

              <a
                href="https://wa.me/918943948269"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full border border-white/30 hover:border-[#DFFCA1] bg-white/[0.02] hover:bg-[#DFFCA1] hover:text-[#094020] text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2.5 group"
              >
                <span>BOOK A CALL</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Vertical Social Links Stack */}
          <div className="lg:col-span-4 flex flex-col sm:items-end space-y-3.5 text-base sm:text-lg md:text-xl font-medium text-white pb-2">
            <a 
              href="https://www.linkedin.com/in/karthik-satheesh-3b52351b3/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#DFFCA1] transition-colors w-fit"
            >
              Linkedin
            </a>
            <a 
              href="https://www.instagram.com/i.am.krs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#DFFCA1] transition-colors w-fit"
            >
              Instagram
            </a>
            <a 
              href="https://www.behance.net/krsgaming" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#DFFCA1] transition-colors w-fit"
            >
              Behance
            </a>
            <a 
              href="/Resume" 
              onClick={(e) => { if (onOpenResume) { e.preventDefault(); onOpenResume(); } }}
              className="hover:text-[#DFFCA1] transition-colors w-fit cursor-pointer text-[#DFFCA1]"
            >
              Resumé
            </a>
          </div>

        </div>

      </div>

      {/* Massive Monumental Bottom Logo Bleed: Signature Mark */}
      <div className="w-full select-none overflow-hidden pt-8 sm:pt-12 pb-4 sm:pb-6 px-6 sm:px-12 flex justify-center items-center pointer-events-none">
        <img
          src="/img/signature_white.png"
          alt="Iamkrs Logo"
          className="w-full max-w-[1300px] h-auto max-h-[28vh] sm:max-h-[36vh] object-contain opacity-95"
        />
      </div>

    </footer>
  );
};
