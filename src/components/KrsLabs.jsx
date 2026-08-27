import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { labExperiments } from '../data/labs';
import { TitleReveal } from './TitleReveal';

export const KrsLabs = ({ onSelectProject, onSelectProjectById }) => {
  return (
    <section id="labs" className="py-28 md:py-40 max-w-7xl mx-auto px-6 md:px-10">
      
      {/* Section Header */}
      <div className="max-w-4xl mb-20">
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-[-0.04em] text-white leading-[0.98] flex flex-col items-start gap-1">
          <TitleReveal delay={0.1}>
            <span>Where code meets curiosity</span>
          </TitleReveal>
          <TitleReveal delay={0.25}>
            <span>at <span className="text-[#DFFCA1] px-3.5 py-1 bg-[#094020] rounded-md inline-block">2 AM.</span></span>
          </TitleReveal>
        </h2>
        <p className="text-lg sm:text-xl text-[#9A9A96] mt-8 leading-relaxed font-normal">
          Zero corporate fluff, no meetings that could have been a text: just pure side quests, late-night experiments, and unhinged ideas coded up because the vibe was right.
        </p>
      </div>

      {/* Figma Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {labExperiments.map((lab) => (
          <div key={lab.id} className="relative group">
            
            {/* Figma Frame Tag */}
            <div className="absolute -top-7 left-0 px-3 py-0.5 rounded-md bg-[#094020] border border-[#DFFCA1]/30 text-[#DFFCA1] font-mono-code text-[11px] uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
              {lab.tag}
            </div>

            {/* Main Interactive Card */}
            <div 
              onClick={() => {
                const targetId = lab.id === 'draun-lab' ? 'draun' : 'kaira-os';
                if (onSelectProjectById) onSelectProjectById(targetId);
              }}
              className="cursor-pointer relative p-8 sm:p-10 rounded-xl bg-[#0A0A0A] border-2 border-white/10 group-hover:border-[#DFFCA1] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Figma Corner Handles */}
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#DFFCA1] border border-[#131313] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#DFFCA1] border border-[#131313] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#DFFCA1] border border-[#131313] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#DFFCA1] border border-[#131313] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="aspect-[16/10] overflow-hidden rounded-md bg-black mb-8">
                <img 
                  src={lab.image} 
                  alt={lab.title} 
                  loading="lazy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono-code text-[#9A9A96] mb-3">
                  <span>{lab.year}</span>
                  <span>{lab.role}</span>
                </div>
                <h3 className="text-3xl font-medium text-white group-hover:text-[#DFFCA1] transition-colors tracking-tight">
                  {lab.title}
                </h3>
                <p className="text-base text-[#9A9A96] mt-4 leading-relaxed font-normal">
                  {lab.desc}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium uppercase tracking-wider text-[#DFFCA1]">
                  Launch Experiment
                </span>
                <ArrowUpRight size={18} className="text-[#DFFCA1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
