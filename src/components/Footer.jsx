import React from 'react';

export const Footer = ({ onOpenResume }) => {
  const email = 'karthiksatheesh610@gmail.com';

  return (
    <footer id="contact" className="relative w-full bg-black text-white select-none border-t border-white/10 pt-16 sm:pt-24 pb-0 overflow-hidden font-sans flex flex-col justify-between min-h-[90vh]">
      
      {/* Top Content Container */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-20">
        
        {/* Top Brand Monogram & Menu Indicator */}
        <div className="flex items-center justify-between pb-12 sm:pb-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tighter text-white">
              N'
            </span>
          </div>
          <a href="#work" className="flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-widest text-[#9A9A96] hover:text-[#DFFCA1] transition-colors">
            <span>MENU</span>
            <span>::</span>
          </a>
        </div>

        {/* Main Grid: Headline & Action Buttons (Left) + Social Links (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end justify-between">
          
          {/* Left Column: Let's start from nothin' + Dual Pill Buttons */}
          <div className="lg:col-span-8 flex flex-col items-start space-y-8">
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-medium tracking-[-0.045em] text-white leading-[0.98]">
              <span className="block">Let's start</span>
              <span className="block">from nothin'</span>
            </h2>

            {/* Dual Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://wa.me/918943948269"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-white/30 hover:border-[#DFFCA1] bg-white/[0.02] hover:bg-[#DFFCA1] hover:text-[#094020] text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2.5 group"
              >
                <span>BOOK A CALL</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-white/30 hover:border-[#DFFCA1] bg-white/[0.02] hover:bg-[#DFFCA1] hover:text-[#094020] text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2.5 group"
              >
                <span>DROP US AN EMAIL</span>
                <span className="font-normal text-xs">@</span>
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

      {/* Massive Monumental Bottom Display Bleed: NOTHIN' */}
      <div className="w-full select-none overflow-hidden pt-12 sm:pt-20 pointer-events-none">
        <h1 className="w-full text-center text-[19vw] font-black tracking-[-0.06em] text-white leading-[0.78] m-0 p-0 block uppercase whitespace-nowrap -mb-2 sm:-mb-6">
          NOTHIN'
        </h1>
      </div>

    </footer>
  );
};
