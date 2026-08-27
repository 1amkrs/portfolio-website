import React from 'react';
import { Globe, Copyright } from 'lucide-react';

export const Footer = ({ onOpenResume }) => {
  const email = 'karthiksatheesh610@gmail.com';
  const tickerItems = Array(16).fill("Let's connect");

  return (
    <footer id="contact" className="bg-black text-[#EDEBE4] select-none border-t border-white/10 overflow-hidden font-sans">
      
      {/* =========================================================================
          MASSIVE INFINITE ROLLING TICKER TAPE
          ========================================================================= */}
      <div className="overflow-hidden whitespace-nowrap bg-[#DFFCA1] text-[#094020] py-6 sm:py-8 border-b border-[#094020]/20">
        <div className="flex gap-12 sm:gap-16 w-max animate-marquee">
          {tickerItems.map((text, idx) => (
            <div key={idx} className="flex items-center gap-10 sm:gap-14">
              {/* Standalone Big Copyright Mark */}
              <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#094020] shrink-0 select-none">
                &copy;
              </span>
              {/* Massive Bold Heading */}
              <span className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] whitespace-nowrap">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          FOOTER MAIN BODY (Exact Match Reference Layout)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start justify-between">
          
          {/* Left Column: Technical Stamp Box & Copyright */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Stamp Box */}
            <div className="w-fit border border-white/35 rounded-none text-[11px] sm:text-xs text-white uppercase font-medium">
              {/* Top Row: Location */}
              <div className="px-3.5 py-1.5 border-b border-white/35 tracking-wider">
                KOCHI, IN · KERALA, INDIA
              </div>
              {/* Bottom Row: Globe / Working Globally / Country Code */}
              <div className="flex items-center divide-x divide-white/35">
                <div className="px-3 py-2 flex items-center justify-center">
                  <Globe size={14} className="text-white" />
                </div>
                <div className="px-3 py-1.5 text-[10px] sm:text-[11px] leading-tight tracking-wider text-center">
                  <div>WORKING</div>
                  <div>GLOBALLY</div>
                </div>
                <div className="px-3 py-2 font-bold tracking-wider">
                  IND
                </div>
              </div>
            </div>

            {/* Copyright */}
            <span className="text-[11px] sm:text-xs text-[#9A9A96] tracking-wider uppercase font-normal pt-1">
              &copy;2026 KARTHIK SATHEESH, ALL RIGHTS RESERVED
            </span>
          </div>

          {/* Right Column: 3 Clean Minimal Columns (Exact Match Reference) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 text-xs sm:text-[13px] font-medium text-[#EDEBE4]">
            
            {/* Column 1: LinkedIn, Instagram, Email */}
            <div className="flex flex-col space-y-2.5">
              <a 
                href="https://www.linkedin.com/in/karthik-satheesh-3b52351b3/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#DFFCA1] transition-colors w-fit"
              >
                LinkedIn
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
                href={`mailto:${email}`}
                className="hover:text-[#DFFCA1] transition-colors w-fit pt-2 break-all text-white font-normal"
              >
                {email}
              </a>
            </div>

            {/* Column 2: Behance, Dribbble / Resume */}
            <div className="flex flex-col space-y-2.5">
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
                className="hover:text-[#DFFCA1] transition-colors w-fit cursor-pointer"
              >
                View Resumé
              </a>
            </div>

            {/* Column 3: Awwwards, Twitter (X) */}
            <div className="flex flex-col space-y-2.5">
              <a 
                href="https://wa.me/918943948269" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#DFFCA1] transition-colors w-fit"
              >
                Awwwards
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#DFFCA1] transition-colors w-fit"
              >
                Twitter (X)
              </a>
            </div>

          </div>

        </div>
      </div>

    </footer>
  );
};
