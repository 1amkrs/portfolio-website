import React from 'react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-28 md:py-40 bg-black border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="w-72 sm:w-88 aspect-square rounded-lg overflow-hidden border-2 border-white/15 shadow-2xl">
                <img 
                  src="/img/dp.png" 
                  alt="Karthik Satheesh" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-4 -right-4 px-5 py-2.5 rounded-md bg-[#DFFCA1] text-[#094020] text-xs font-bold uppercase tracking-wider shadow-xl">
                4+ Years In The Craft
              </div>
            </div>
          </div>

          {/* Right: Quirky Designer Narrative Story */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-[-0.04em] text-white leading-[1.02]">
              Obsessed with why great buttons feel satisfying and how bad UX ruins good days.
            </h2>
            
            <p className="text-lg sm:text-xl text-[#9A9A96] leading-relaxed font-normal">
              Armed with a B.A. in Graphic Design &amp; Animation and an unhealthy obsession with Auto-Layout, I turn complicated user problems into clean, tactile digital tools people actually enjoy using.
            </p>

            <p className="text-lg sm:text-xl text-[#9A9A96] leading-relaxed font-normal">
              Cut my teeth at <strong className="text-white font-medium">Katzion</strong> untangling enterprise complexity and designing interfaces that don't need a user manual. Leveled up at <strong className="text-white font-medium">Kaizen Que</strong> crafting design tokens, scalable component libraries, and interactive prototypes developers actually liked building.
            </p>

            <p className="text-lg sm:text-xl text-[#9A9A96] leading-relaxed font-normal">
              When I'm not nudging pixels by 1px increments in Figma, you'll find me strumming guitar chords, obsessing over physical knob ergonomics, or traveling somewhere with spotty Wi-Fi.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
