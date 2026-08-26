import React from 'react';
import { ButtonCTA } from './ButtonCTA';

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 select-none">
      
      {/* Crisp Subtle Gradient Scrim */}
      <div className="absolute inset-0 h-20 sm:h-24 bg-gradient-to-b from-[#090B0A]/90 via-[#090B0A]/40 to-transparent pointer-events-none" />

      {/* Crystal Clear Minimal Header Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-5 sm:pt-6 flex items-center justify-between relative z-10">
        
        {/* Left Side Spacer for Optical Balance */}
        <div className="w-24 hidden sm:block pointer-events-none" />

        {/* Center: Crystal Sharp Signature Logo */}
        <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center">
          <a href="/" aria-label="Karthik Satheesh Home" className="block group">
            <img
              src="/img/signature_logo.png"
              alt="Iamkrs signature logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain filter brightness-125 contrast-125 group-hover:scale-105 transition-all duration-300"
            />
          </a>
        </div>

        {/* Right Side: Dual-Pill Contact CTA */}
        <div>
          <ButtonCTA 
            text="LET'S TALK" 
            className="scale-90 sm:scale-95 origin-right" 
          />
        </div>

      </div>
    </header>
  );
};
