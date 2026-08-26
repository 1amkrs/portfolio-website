import React from 'react';
import { ImageReveal } from './lightswind/image-reveal';
import { AsciiSculpture } from './AsciiSculpture';
import { projects } from '../data/projects';

export const WorkShowcase = ({ onSelectProject }) => {
  const allEntries = [
    ...projects,
    {
      id: 'krs-labs',
      title: 'KRS Labs',
      subtitle: 'Experimental Motion & Interactive Playground',
      year: '2026',
      category: 'Creative Engineering',
      image: '/img/placeholder-card.png',
      description: 'Living code experiments, physical knobs, and creative shaders built at 2 AM.'
    }
  ];

  return (
    <section 
      id="work" 
      className="relative bg-black text-white select-none border-b border-white/10 overflow-hidden"
    >
      {/* Background Bedrock Terrain Horizon at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-0">
        <img
          src="/img/hero_terrain.png"
          alt="Bedrock terrain horizon"
          className="w-full h-[24vh] sm:h-[32vh] md:h-[36vh] object-cover object-bottom opacity-40 filter contrast-125 grayscale brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* =========================================================================
          PART 1: EXACT MATCH 2-COLUMN SELECTED WORKS SHOWCASE
          ========================================================================= */}
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pt-24 sm:pt-32 pb-24 relative z-10">
        
        {/* Top Header Row (Matching Reference) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          {/* Massive Display Title: My Recently Selected Works */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white leading-[0.98]">
            My Recently<br />Selected Works
          </h2>

          {/* Right Telemetry Badge */}
          <span className="font-mono-code text-xs text-[#9A9A96]/80 tracking-wider pb-2">
            vr/03 -#- c.
          </span>
        </div>

        {/* Full-Width Solid White Horizontal Divider Bar */}
        <div className="w-full h-[2.5px] bg-white mt-8 sm:mt-10 mb-12 sm:mb-16" />

        {/* Two-Column Grid: Left (From zero to one + ASCII) & Right (Project Rows) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: /From zero to one/ & 3D ASCII Rotating Bear Animation */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-12">
            <span className="font-mono-code text-xs sm:text-sm text-[#9A9A96] block tracking-wide">
              /From zero to one/
            </span>

            {/* 3D ASCII Animation */}
            <div className="flex items-center justify-center py-6">
              <AsciiSculpture className="scale-90 sm:scale-100 md:scale-105" />
            </div>

            <div className="hidden lg:block text-xs font-mono text-[#9A9A96]/50">
              [SYSTEM: 08_PROJECTS // HOVER_REVEAL]
            </div>
          </div>

          {/* Right Column: Interactive Lightswind Table Rows */}
          <div className="lg:col-span-8">
            <ImageReveal 
              visualData={allEntries} 
              onSelectProject={onSelectProject}
            />
          </div>

        </div>

      </div>

      {/* =========================================================================
          PART 2: MINIMALIST FULL-WIDTH STATEMENT (PURE BLACK CANVAS)
          ========================================================================= */}
      <div className="relative w-full py-24 sm:py-32 md:py-40 overflow-hidden border-t border-white/10 bg-black">
        
        {/* 100% Full-Width Screen Spanning Typography (3 Wide Lines) */}
        <div className="w-full px-6 sm:px-10 md:px-12 lg:px-16 relative z-10 text-left">
          <h2 className="w-full text-2xl sm:text-4xl md:text-5xl lg:text-[2.7vw] xl:text-[2.95vw] font-bold tracking-[-0.04em] text-white leading-[1.18] drop-shadow-[0_16px_50px_rgba(0,0,0,0.95)]">
            <span className="block">
              Design is the <span className="text-[#DFFCA1]">intentional craft</span> of turning complex technology
            </span>
            <span className="block">
              into <span className="text-[#DFFCA1]">effortless clarity</span>, creating digital products that feel
            </span>
            <span className="block">
              rigorously engineered and <span className="text-[#DFFCA1]">naturally intuitive.</span>
            </span>
          </h2>
        </div>

      </div>

    </section>
  );
};
