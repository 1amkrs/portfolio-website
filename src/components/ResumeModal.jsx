import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Briefcase, GraduationCap, Code, Sparkles, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

export const ResumeModal = ({ isOpen, onClose }) => {
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

  const experiences = [
    {
      role: 'UI/UX Designer',
      company: 'Kaizen Que',
      period: 'Sept 2025 - Present',
      location: 'Kochi, India',
      highlights: [
        'Architected scalable design systems, token architectures, and high-performance web applications.',
        'Designed end-to-end UI/UX for enterprise platforms, taking ideas from rough wireframes to high-fidelity living code prototypes.',
        'Collaborated closely with engineering squads to bridge design tokens with production React components.'
      ]
    },
    {
      role: 'Senior Product Designer',
      company: 'Homora',
      period: 'Jan 2025 - May 2025',
      location: 'Remote',
      highlights: [
        'Led end-to-end UX/UI architecture for digital commerce tools, streamlining checkouts and boosting retention.',
        'Conducted user research, usability testing sessions, and synthesized qualitative feedback into tactical roadmap items.'
      ]
    },
    {
      role: 'Product Designer',
      company: 'Katzion',
      period: 'June 2023 - Dec 2024',
      location: 'Kochi, India',
      highlights: [
        'Untangled enterprise workflow complexity, designing intuitive multi-tenant cloud platforms and automotive digital dashboards.',
        'Standardized component libraries in Figma, cutting cross-team design turnaround time by 35%.'
      ]
    },
    {
      role: 'Freelance Product Designer & Creative Developer',
      company: 'Self-Employed',
      period: '2021 - 2023',
      location: 'Global',
      highlights: [
        'Shipped 20+ bespoke digital experiences, brand identities, and interactive web tools for founders and international startups.'
      ]
    }
  ];

  const skills = [
    { category: 'Product & UX', list: ['User Research', 'Information Architecture', 'Wireframing', 'Design Systems', 'Interactive Prototyping', 'Usability Testing'] },
    { category: 'Visual & Interface', list: ['Visual Direction', 'Typography', 'Micro-interactions', 'Motion Design', 'Spatial Design', 'Design Tokens'] },
    { category: 'Engineering & Code', list: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'JavaScript / ES6+', 'HTML5 / Modern CSS', 'Git & CI/CD'] },
    { category: 'Tools & Software', list: ['Figma', 'FigJam', 'Framer', 'Webflow', 'Adobe After Effects', 'Premiere Pro', 'Blender'] }
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
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#DFFCA1] shadow-[0_0_10px_#DFFCA1]" />
            <span className="text-base sm:text-lg font-bold tracking-tight text-white">
              Karthik Satheesh // Resumé
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/Karthik-Satheesh-Resume.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DFFCA1] text-[#094020] text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(223,252,161,0.3)]"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors"
              aria-label="Close Resume"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-16 sm:space-y-24">
          
          {/* Hero Profile Block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-white/10">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/20 shadow-2xl shrink-0">
                <img 
                  src="/img/dp.png" 
                  alt="Karthik Satheesh" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  Karthik Satheesh
                </h1>
                <p className="text-base sm:text-xl text-[#DFFCA1] font-medium">
                  UI/UX &amp; Digital Product Designer
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono-code text-[#9A9A96] pt-1">
                  <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#DFFCA1]" /> Kochi, India</span>
                  <span className="flex items-center gap-1.5"><Mail size={13} className="text-[#DFFCA1]" /> karthiksatheesh610@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2 max-w-sm">
              <span className="font-mono-code text-xs text-[#DFFCA1] uppercase tracking-wider block">
                Executive Overview
              </span>
              <p className="text-xs sm:text-sm text-[#9A9A96] leading-relaxed">
                4+ years crafting high-impact digital tools, living design systems, and frontend prototypes that convert complex friction into obvious, tactile simplicity.
              </p>
            </div>
          </div>

          {/* Section: Experience */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-[#DFFCA1]" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Work Experience
              </h2>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div 
                  key={idx} 
                  className="p-6 sm:p-8 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#DFFCA1]/30 transition-colors space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {exp.role} <span className="text-[#DFFCA1]">@ {exp.company}</span>
                      </h3>
                      <span className="font-mono-code text-xs text-[#9A9A96]">
                        {exp.location}
                      </span>
                    </div>
                    <span className="font-mono-code text-xs text-[#DFFCA1] bg-[#094020] px-3 py-1 rounded-full w-fit">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {exp.highlights.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm sm:text-base text-[#EDEBE4]/90 font-normal leading-relaxed">
                        <span className="text-[#DFFCA1] mt-1 text-xs">●</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Skills & Toolkit */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Code size={20} className="text-[#DFFCA1]" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Skills &amp; Technical Capabilities
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skillGroup, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-between">
                    <span>{skillGroup.category}</span>
                    <span className="font-mono-code text-xs text-[#DFFCA1]">0{idx + 1}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skillGroup.list.map((item, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono-code text-[#EDEBE4] hover:border-[#DFFCA1]/40 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Education */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <GraduationCap size={20} className="text-[#DFFCA1]" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Education
              </h2>
            </div>

            <div className="p-6 sm:p-8 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Bachelor of Arts (B.A.) in Graphic Design &amp; Animation
                </h3>
                <p className="text-sm font-mono-code text-[#9A9A96] mt-1">
                  Focus on visual perception, interface ergonomics, and interactive typography.
                </p>
              </div>
              <span className="font-mono-code text-xs text-[#DFFCA1] bg-[#094020] px-3 py-1 rounded-full shrink-0 w-fit">
                Graduated
              </span>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="pt-12 border-t border-white/10 text-center space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold text-white">
              Ready to collaborate on something exceptional?
            </h3>
            <div>
              <a
                href="mailto:karthiksatheesh610@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#DFFCA1] text-[#094020] font-bold text-base hover:scale-105 transition-transform shadow-[0_0_30px_rgba(223,252,161,0.3)]"
              >
                <span>Get In Touch</span>
                <Mail size={18} />
              </a>
            </div>
          </div>

        </main>
      </motion.div>
    </AnimatePresence>
  );
};
