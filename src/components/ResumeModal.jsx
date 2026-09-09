import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Briefcase, GraduationCap, Award, Languages, Sparkles, Mail, MapPin } from 'lucide-react';

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
      company: 'Kaizen Que',
      location: 'Bengaluru, Karnataka',
      logo: '/img/kaizen.svg',
      roles: [
        {
          title: 'UI/UX Designer',
          period: 'Sept 2025 - Aug 2026',
          highlights: [
            'Designed and developed high-performing law firm websites, delivering a seamless, trustworthy, and client-focused user experience.',
            'Designed end-to-end UI/UX for blog websites, from initial wireframes to polished high-fidelity prototypes.',
            'Successfully worked on and shipped 10+ live projects, ensuring quality, usability, and business alignment.',
            'Collaborated closely with development teams to align user needs with business goals.'
          ]
        }
      ]
    },
    {
      company: 'Homora',
      location: 'Kochi, Kerala',
      logo: '/img/homora.svg',
      roles: [
        {
          title: 'Senior Product Designer',
          period: '01/2025 - 05/2025',
          highlights: [
            'Designed and developed a full-featured online store web app, ensuring a seamless and engaging user experience.',
            'Led end-to-end UI/UX design for client websites, from wireframes to highfidelity prototypes.',
            'Implemented responsive front-end interfaces using HTML, CSS, and JavaScript.',
            'Collaborated closely with development teams to align user needs with business goals.'
          ]
        }
      ]
    },
    {
      company: 'Katzion, A GlobalLogic Company',
      location: 'Kochi, Kerala',
      logo: '/img/katz.svg',
      roles: [
        {
          title: 'UI/UX Consultant',
          period: '05/2022 - 09/2024',
          highlights: [
            'Collaborated with automotive brands like Audi Australia, Skoda, and Volkswagen Australia to design user interfaces and mobile-friendly experiences.',
            'Applied UX processes such as user research, wireframing, prototyping, and usability testing to create seamless user experiences.'
          ]
        },
        {
          title: 'Associate UI/UX Consultant',
          period: '2023',
          highlights: [
            "Contributed to the Audi Australia project, designing intuitive and engaging user interfaces tailored to the brand's standards.",
            'Established and maintained component repositories to ensure consistency and efficient reuse across projects.'
          ]
        },
        {
          title: 'UI/UX Intern',
          period: '2022',
          highlights: [
            "Contributed to the Audi Australia project, designing intuitive and engaging user interfaces tailored to the brand's standards.",
            'Established and maintained component repositories to ensure consistency and efficient reuse across projects.'
          ]
        }
      ]
    }
  ];

  const categorizedSkills = [
    {
      category: 'UI & Product Design',
      tools: ['Figma', 'Maze', 'Notion', 'Canva']
    },
    {
      category: 'AI & Intelligent Systems',
      tools: ['Claude', 'Codex', 'Antigravity']
    },
    {
      category: 'Visual, Motion & 3D',
      tools: ['Adobe Photoshop', 'Adobe Illustrator', 'After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Blender', 'Magnific']
    },
    {
      category: 'Frontend Engineering',
      tools: ['HTML', 'CSS', 'Javascript', 'React.js']
    }
  ];

  const technicalSkills = [
    { name: 'UI Animation', level: 5 },
    { name: 'Visual Design', level: 5 },
    { name: 'Prototyping', level: 5 },
    { name: 'User Research', level: 5 },
    { name: 'Branding', level: 5 },
    { name: 'Storytelling', level: 5 }
  ];

  const certifications = [
    { title: 'Google UX Design Specialization Certificate', issuer: 'Google' },
    { title: 'Meta Front-end Developer Certificate', issuer: 'Meta' }
  ];

  const languages = [
    { name: 'English', proficiency: 'Fluent' },
    { name: 'Malayalam', proficiency: 'Native Speaker' },
    { name: 'Hindi', proficiency: 'Working Proficiency' },
    { name: 'Tamil', proficiency: 'Beginner' },
    { name: 'Kannada', proficiency: 'Beginner' }
  ];

  const education = [
    {
      institution: 'Sacred Heart College, Thevara',
      degree: 'Bachelor of Arts, Animation and Graphic Design',
      period: '06/2019 - 03/2022',
      location: 'Kochi, Kerala'
    },
    {
      institution: 'Assisi Vidyaniketan Public School',
      degree: 'High School, Commerce',
      period: '06/2018 - 03/2019',
      location: 'Kochi, Kerala'
    }
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
              className="p-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
              aria-label="Close Resume"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-16 sm:space-y-24">
          
          {/* Header Profile Info */}
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
                  <span>+91 8943948269</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2 max-w-sm">
              <span className="font-mono-code text-xs text-[#DFFCA1] uppercase tracking-wider block">
                Overview
              </span>
              <p className="text-xs sm:text-sm text-[#9A9A96] leading-relaxed">
                Proven track record delivering client-focused web apps, automotive interface systems, design tokens, and living prototypes.
              </p>
            </div>
          </div>

          {/* Section: Professional Experience */}
          <section className="space-y-10">
            <div className="flex items-center gap-3">
              <Briefcase size={22} className="text-[#DFFCA1]" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Professional Experience
              </h2>
            </div>

            <div className="space-y-10">
              {experiences.map((exp, idx) => (
                <div 
                  key={idx} 
                  className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#DFFCA1]/30 transition-colors space-y-8"
                >
                  {/* Standalone Large Company Header with Big Logo (No Box/Square) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-5">
                      {exp.logo && (
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="h-10 sm:h-12 md:h-14 w-auto max-w-[160px] object-contain filter brightness-125 contrast-125"
                        />
                      )}
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {exp.company}
                        </h3>
                        <span className="font-mono-code text-xs text-[#9A9A96]">
                          {exp.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hierarchical Roles */}
                  <div className="space-y-8">
                    {exp.roles.map((role, rIdx) => (
                      <div key={rIdx} className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {role.title}
                          </h4>
                          <span className="font-mono-code text-xs text-[#DFFCA1] bg-[#094020] px-3.5 py-1.5 rounded-full w-fit">
                            {role.period}
                          </span>
                        </div>

                        <ul className="space-y-2.5 pt-1">
                          {role.highlights.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-3 text-sm sm:text-base text-[#EDEBE4]/90 font-normal leading-relaxed">
                              <span className="text-[#DFFCA1] mt-1 text-xs">●</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* Section: Education */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <GraduationCap size={22} className="text-[#DFFCA1]" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Education
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu, idx) => (
                <div key={idx} className="p-6 sm:p-8 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="font-mono-code text-xs text-[#9A9A96] block">{edu.location}</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {edu.institution}
                    </h3>
                    <p className="text-sm text-[#DFFCA1] font-medium">
                      {edu.degree}
                    </p>
                  </div>
                  <span className="font-mono-code text-xs text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full w-fit">
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Technical Skills & Certifications & Languages Grid */}
          {/* Technical Skills & Software Stack */}
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-[#DFFCA1]" />
              <h3 className="text-xl font-bold text-white tracking-tight">
                Technical Skills & Software Stack
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categorizedSkills.map((group, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#DFFCA1] mb-3">
                      {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.tools.map((tool, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white hover:border-[#DFFCA1]/50 transition-colors"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Certifications */}
            <section className="space-y-6">
              <div className="flex items-center gap-2.5">
                <Award size={18} className="text-[#DFFCA1]" />
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Certifications
                </h3>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4 flex flex-col justify-between h-[calc(100%-3rem)]">
                <div className="space-y-4">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-[#DFFCA1] mt-1 text-xs">●</span>
                        <h4 className="text-sm font-bold text-white leading-snug">{cert.title}</h4>
                      </div>
                      <span className="font-mono-code text-xs text-[#9A9A96] pl-4 block">{cert.issuer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Languages */}
            <section className="space-y-6">
              <div className="flex items-center gap-2.5">
                <Languages size={18} className="text-[#DFFCA1]" />
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Languages
                </h3>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4 flex flex-col justify-between h-[calc(100%-3rem)]">
                <div className="space-y-3">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                      <span className="text-sm font-medium text-white">{lang.name}</span>
                      <span className="font-mono-code text-xs text-[#DFFCA1]">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>

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
