import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { TitleReveal } from './TitleReveal';

export const SkillSets = () => {
  const skillGroups = [
    {
      title: 'UI design',
      count: '(06)',
      items: [
        { name: 'Visual direction', id: '1' },
        { name: 'Design concept', id: '2' },
        { name: 'Typography', id: '3' },
        { name: 'Color', id: '4' },
        { name: 'Composition', id: '5' },
        { name: 'UI style guide', id: '6' }
      ]
    },
    {
      title: 'UX design',
      count: '(05)',
      items: [
        { name: 'UX research', id: '1' },
        { name: 'Usability testing', id: '2' },
        { name: 'Quantitative research', id: '3' },
        { name: 'Qualitative research', id: '4' },
        { name: 'User interview', id: '5' }
      ]
    },
    {
      title: 'Product & AI Systems',
      count: '(07)',
      items: [
        { name: 'Figma', id: '1' },
        { name: 'Notion', id: '2' },
        { name: 'Maze', id: '3' },
        { name: 'Canva', id: '4' },
        { name: 'Claude', id: '5' },
        { name: 'Codex', id: '6' },
        { name: 'Antigravity', id: '7' }
      ]
    },
    {
      title: 'Visual, Motion & 3D Tools',
      count: '(07)',
      items: [
        { name: 'Adobe Photoshop', id: '1' },
        { name: 'Adobe Illustrator', id: '2' },
        { name: 'After Effects', id: '3' },
        { name: 'Premiere Pro', id: '4' },
        { name: 'DaVinci Resolve', id: '5' },
        { name: 'Blender', id: '6' },
        { name: 'Magnific', id: '7' }
      ]
    },
    {
      title: 'Website development',
      count: '(06)',
      items: [
        { name: 'HTML', id: '1' },
        { name: 'CSS', id: '2' },
        { name: 'Javascript', id: '3' },
        { name: 'React.js', id: '4' },
        { name: 'Framer', id: '5' },
        { name: 'Webflow', id: '6' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-28 md:py-44 max-w-7xl mx-auto px-6 md:px-12 bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
        
        {/* Left Column: Heading, Divider, Statement & Arrow */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-medium tracking-[-0.045em] text-white leading-[0.96] flex flex-col items-start gap-1">
            <TitleReveal delay={0.1}>
              <span>Design</span>
            </TitleReveal>
            <TitleReveal delay={0.25}>
              <span>skill sets</span>
            </TitleReveal>
          </h2>

          {/* Solid Horizontal Divider Bar */}
          <div className="w-full max-w-[340px] h-[3px] bg-white/20 mt-12 mb-8" />

          {/* Subtext Statement */}
          <div className="space-y-4 max-w-[340px]">
            
            <p className="text-sm sm:text-base text-[#EDEBE4] font-normal leading-relaxed">
              I don't just hand off static Figma artboards and disappear. I build living design systems, stress-test real user journeys, and write production code so the final product actually matches the vision.
            </p>
          </div>

          {/* Big Arrow CTA */}
          <a
            href="https://wa.me/918943948269?text=Hi%20Karthik%2C%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project%20with%20you."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 text-[#9A9A96] hover:text-[#DFFCA1] transition-colors inline-block w-fit group"
            aria-label="Contact for collaboration"
          >
            <ArrowUpRight 
              size={56} 
              strokeWidth={1.5}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" 
            />
          </a>
        </div>

        {/* Right Column: Exact Match Categorized Tables */}
        <div className="lg:col-span-7 space-y-16 lg:space-y-20">
          {skillGroups.map((group) => (
            <div key={group.title} className="flex flex-col">
              
              {/* Category Title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tight mb-8">
                {group.title}
              </h3>

              {/* Group Layout with Left Count and Right Table */}
              <div className="grid grid-cols-12 gap-4 items-start">
                
                {/* Count (e.g. 06) */}
                <div className="col-span-2 sm:col-span-2">
                  <span className="font-mono-code text-xs sm:text-sm text-[#9A9A96] block pt-3">
                    {group.count}
                  </span>
                </div>

                {/* Numbered Rows Table */}
                <div className="col-span-10 sm:col-span-10 flex flex-col divide-y divide-white/10 border-t border-white/10">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="py-3.5 sm:py-4 flex items-center justify-between group hover:bg-white/[0.02] px-2 -mx-2 rounded-none transition-colors"
                    >
                      <span className="text-sm sm:text-base text-[#EDEBE4] font-normal group-hover:text-[#DFFCA1] transition-colors">
                        {item.name}
                      </span>
                      <span className="font-mono-code text-xs sm:text-sm text-[#9A9A96] group-hover:text-white transition-colors">
                        {item.id}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
