import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Heart, Sparkles, Compass, Terminal, Music, Coffee, MapPin, Mail } from 'lucide-react';

export const AboutModal = ({ isOpen, onClose, onOpenResume }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const philosophies = [
    {
      title: 'Form Follows Physics',
      desc: 'Static UI is dead. Real interfaces have weight, inertia, and tactile feedback that make interactions feel physical and deliberate.'
    },
    {
      title: 'Code As A Design Medium',
      desc: 'Designers who understand code build better products. Writing React and prototyping living shaders closes the gap between Figma and reality.'
    },
    {
      title: 'Relentless Simplicity',
      desc: 'True elegance is taking a convoluted enterprise flow with dozens of edge cases and making it feel so effortless you forget how hard it was to build.'
    }
  ];

  const dailyDrivers = [
    { name: 'Figma & FigJam', role: 'Primary Interface Architecture' },
    { name: 'React & Next.js', role: 'Living Code Production' },
    { name: 'Tailwind CSS', role: 'Token Systems & Ergonomic Styling' },
    { name: 'Framer Motion', role: 'Micro-interactions & Spring Physics' },
    { name: 'Blender & OGL', role: '3D Spatial Modeling & Shaders' },
    { name: 'After Effects', role: 'Cinematic Motion Design' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        ref={modalRef}
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 overflow-y-auto bg-black text-[#EDEBE4] select-none font-sans overscroll-contain"
      >
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#DFFCA1] shadow-[0_0_10px_#DFFCA1]" />
            <span className="text-base sm:text-lg font-bold tracking-tight text-white">
              Karthik Satheesh // About Me
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                if (onOpenResume) onOpenResume();
              }}
              className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-[#DFFCA1] hover:text-[#094020] hover:border-[#DFFCA1] text-xs font-mono-code uppercase tracking-wider transition-all"
            >
              View Resumé
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors"
              aria-label="Close About"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-16 sm:space-y-24">
          
          {/* Hero Bio Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-12 border-b border-white/10">
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                <img 
                  src="/img/hero_profile_portrait.png" 
                  alt="Karthik Satheesh" 
                  className="w-full h-full object-cover object-[center_20%]"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono-code text-xs text-[#DFFCA1] uppercase tracking-widest block">
                / ABOUT THE CRAFT /
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                Obsessed with why great buttons feel satisfying and how bad UX ruins good days.
              </h1>
              <p className="text-base sm:text-lg text-[#9A9A96] leading-relaxed pt-2">
                I'm Karthik Satheesh, a Digital Product Designer based in Kochi, Kerala. With 4+ years in product design and creative development, I specialize in crafting software that balances functional rigor with memorable visual character.
              </p>
            </div>
          </div>

          {/* Section: Design Philosophy */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Compass size={20} className="text-[#DFFCA1]" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Core Principles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {philosophies.map((p, idx) => (
                <div key={idx} className="p-6 sm:p-8 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 hover:border-[#DFFCA1]/30 transition-colors">
                  <span className="font-mono-code text-xs text-[#DFFCA1] block">0{idx + 1}.</span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{p.title}</h3>
                  <p className="text-sm text-[#9A9A96] leading-relaxed font-normal">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Daily Drivers & Toolkit */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Terminal size={20} className="text-[#DFFCA1]" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Daily Drivers &amp; Tech Stack
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dailyDrivers.map((tool, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <h4 className="text-base font-bold text-white">{tool.name}</h4>
                  <p className="text-xs font-mono-code text-[#9A9A96]">{tool.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Beyond The Screen */}
          <section className="p-8 sm:p-12 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6">
            <div className="flex items-center gap-3">
              <Music size={20} className="text-[#DFFCA1]" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Beyond The Pixels
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#EDEBE4]/90 leading-relaxed font-normal">
              When I'm not tweaking spring physics curves or building token systems in Figma, you can find me playing acoustic guitar, exploring hardware synthesis, geeking out over industrial design and tactile switch mechanisms, or traveling to new places.
            </p>
          </section>

          {/* Bottom CTA */}
          <div className="pt-12 border-t border-white/10 text-center space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold text-white">
              Want to build something memorable together?
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:karthiksatheesh610@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#DFFCA1] text-[#094020] font-bold text-base hover:scale-105 transition-transform shadow-[0_0_30px_rgba(223,252,161,0.3)]"
              >
                <span>Drop Me An Email</span>
                <Mail size={18} />
              </a>
            </div>
          </div>

        </main>
      </motion.div>
    </AnimatePresence>
  );
};
