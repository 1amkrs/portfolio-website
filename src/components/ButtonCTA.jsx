import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const ButtonCTA = ({ 
  text = "LET'S TALK", 
  href = 'https://wa.me/918943948269?text=Hi%20Karthik%2C%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project%20with%20you.', 
  target = '_blank', 
  className = '',
  onClick
}) => {
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 select-none cursor-pointer ${className}`}
    >
      {/* Main Pill Capsule */}
      <span className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full border border-white/25 bg-black/40 backdrop-blur-md text-xs sm:text-sm font-bold uppercase tracking-wider text-white group-hover:bg-[#DFFCA1] group-hover:text-[#094020] group-hover:border-[#DFFCA1] transition-all duration-300 shadow-xl flex items-center justify-center">
        {text}
      </span>

      {/* Circular Arrow Badge */}
      <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/25 bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#DFFCA1] group-hover:text-[#094020] group-hover:border-[#DFFCA1] transition-all duration-300 shadow-xl shrink-0">
        <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300 ease-out" />
      </span>
    </a>
  );
};
