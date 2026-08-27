import React from 'react';
import { Globe, ArrowUpRight } from 'lucide-react';

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
          FOOTER MAIN BODY
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start justify-between">
          
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

          {/* Right Column: Prominent Large Email & Curated Social Links */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            
            {/* Prominent Large Email */}
            <div className="space-y-2">
              <span className="font-mono-code text-xs text-[#DFFCA1] uppercase tracking-wider block">
                Direct Inquiries
              </span>
              <a 
                href={`mailto:${email}`}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-white hover:text-[#DFFCA1] transition-colors break-all tracking-tight inline-flex items-center gap-3 group"
              >
                <span>{email}</span>
                <ArrowUpRight size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[#DFFCA1] shrink-0" />
              </a>
            </div>

            {/* Curated Social Links */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm font-medium text-[#EDEBE4] pt-4 border-t border-white/10">
              <a 
                href="https://www.linkedin.com/in/karthik-satheesh-3b52351b3/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#DFFCA1] transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://www.behance.net/krsgaming" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#DFFCA1] transition-colors"
              >
                Behance
              </a>
              <a 
                href="https://www.instagram.com/i.am.krs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#DFFCA1] transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://wa.me/918943948269" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#DFFCA1] transition-colors"
              >
                WhatsApp
              </a>
              <a 
                href="/Resume" 
                onClick={(e) => { if (onOpenResume) { e.preventDefault(); onOpenResume(); } }}
                className="hover:text-[#DFFCA1] transition-colors cursor-pointer text-[#DFFCA1]"
              >
                View Resumé
              </a>
            </div>

          </div>

        </div>
      </div>

    </footer>
  );
};
