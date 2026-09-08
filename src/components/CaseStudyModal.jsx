import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Maximize2, ZoomIn, Download } from 'lucide-react';
import { projects } from '../data/projects';

export const CaseStudyModal = ({ project, onClose, onSelectProject }) => {
  const modalRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const [expandedImage, setExpandedImage] = useState(null); // { src, tag, title, caption }
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);

  const currentIndex = projects.findIndex(p => p.id === project?.id);
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const nextProject = projects.find(p => p.id === project?.nextProjectId) || projects[(currentIndex + 1) % projects.length];

  const handleProjectChange = (targetProject) => {
    if (!targetProject || targetProject.id === project?.id || isTransitioning) return;
    
    setIsTransitioning(true);
    setTransitionTarget(targetProject);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Step 1: Smooth curtain closes and active content eases out
    transitionTimeoutRef.current = setTimeout(() => {
      // Step 2: Reset scroll to top behind the curtain and switch active project
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
      onSelectProject(targetProject);
      setExpandedImage(null);

      // Step 3: Reveal new project smoothly
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionTarget(null);
      }, 260);
    }, 260);
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (expandedImage) {
          setExpandedImage(null);
        } else {
          onClose();
        }
      } else if (!expandedImage && !isTransitioning) {
        if (e.key === 'ArrowRight') {
          handleProjectChange(nextProject);
        } else if (e.key === 'ArrowLeft') {
          handleProjectChange(prevProject);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose, expandedImage, isTransitioning, nextProject, prevProject]);

  // Clean up lightbox when project changes
  useEffect(() => {
    setExpandedImage(null);
  }, [project?.id]);

  if (!project) return null;

  const artifact1 = project.artifacts?.[0] || {
    tag: 'ARTIFACT_01 // ARCHITECTURAL_ANALYSIS',
    caption: 'Information architecture and interactive focus wireframes',
    image: project.image
  };

  const artifact2 = project.artifacts?.[1] || {
    tag: 'ARTIFACT_02 // SYSTEM_COMPONENTS & TOKENS',
    caption: 'Design system components and spatial hierarchy',
    image: project.image
  };

  const artifact3 = project.artifacts?.[2] || {
    tag: 'ARTIFACT_03 // FINAL_PRODUCTION_DEPLOYMENT',
    caption: 'High-fidelity production release and user flow validation',
    image: project.image
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        ref={modalRef}
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 overflow-y-auto bg-black text-[#EDEBE4] select-none font-sans overscroll-contain"
      >
        {/* =========================================================================
            1. MINIMAL STICKY HEADER TOP BAR
            ========================================================================= */}
        <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex items-center justify-between">
          
          {/* Left: Brand Identity, Active Project Name & Index Indicator */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#DFFCA1] shadow-[0_0_10px_#DFFCA1] shrink-0" />
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <AnimatePresence mode="wait">
                <motion.span
                  key={project.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white truncate"
                >
                  {project.title}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono-code text-[11px] sm:text-xs text-[#9A9A96]/70 hidden xs:inline-block shrink-0">
                [0{currentIndex + 1} / 0{projects.length}]
              </span>
            </div>
          </div>

          {/* Right: Prev / Next Navigation & Close Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Quick Prev / Next Navigator */}
            <div className="flex items-center border border-white/15 rounded-full bg-white/5 overflow-hidden p-0.5">
              <button
                onClick={() => handleProjectChange(prevProject)}
                disabled={isTransitioning}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 hover:bg-[#DFFCA1] hover:text-[#094020] text-white transition-all text-xs font-mono-code rounded-full cursor-pointer disabled:opacity-40"
                title={`Previous: ${prevProject.title}`}
                aria-label="Previous Project"
              >
                <ArrowLeft size={13} />
                <span className="hidden md:inline">Prev</span>
              </button>
              <div className="w-[1px] h-3 bg-white/15 mx-0.5" />
              <button
                onClick={() => handleProjectChange(nextProject)}
                disabled={isTransitioning}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 hover:bg-[#DFFCA1] hover:text-[#094020] text-white transition-all text-xs font-mono-code rounded-full cursor-pointer disabled:opacity-40"
                title={`Next: ${nextProject.title}`}
                aria-label="Next Project"
              >
                <span className="hidden md:inline">Next</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/15 bg-white/5 hover:bg-[#DFFCA1] hover:text-[#094020] hover:border-[#DFFCA1] transition-all text-xs font-mono-code uppercase tracking-wider cursor-pointer"
              aria-label="Close Project Detail"
            >
              <span className="hidden sm:inline">Back to Works</span>
              <X size={14} />
            </button>
          </div>
        </header>

        {/* =========================================================================
            2. MAIN EDITORIAL CASE STUDY CONTAINER
            ========================================================================= */}
        <motion.main
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: isTransitioning ? 0.985 : 1
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 pt-10 sm:pt-16 pb-32 space-y-20 sm:space-y-28"
        >

          {/* Monumental Hero Showcase Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 font-mono-code text-xs text-[#DFFCA1] tracking-widest uppercase">
              <span>{project.category}</span>
              <span>·</span>
              <span>{project.year}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white leading-[0.98]">
              {project.title}
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-[#9A9A96] font-normal max-w-4xl leading-snug pt-2">
              {project.subtitle}
            </p>
          </div>

          {/* HERO 3D MOCKUP STAGE */}
          <div className="w-full rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#161817] to-[#0A0B0B] p-3 sm:p-6 shadow-2xl relative group">
            <div 
              onClick={() => {
                if (!project.video && project.image) {
                  setExpandedImage({
                    src: project.image,
                    title: project.title,
                    tag: 'HERO_SHOWCASE',
                    caption: project.subtitle
                  });
                }
              }}
              className={`rounded-xl overflow-hidden bg-black/80 flex items-center justify-center relative p-2 sm:p-4 ${!project.video ? 'cursor-zoom-in' : ''}`}
            >
              {project.video ? (
                <video 
                  src={project.video} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-auto max-h-[80dvh] object-contain rounded-lg"
                />
              ) : (
                <>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-auto max-h-[80dvh] object-contain rounded-lg filter contrast-105 group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/75 backdrop-blur-md text-[#DFFCA1] opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 flex items-center gap-1.5 text-xs font-mono-code">
                    <Maximize2 size={13} />
                    <span>Expand</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Specifications Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 rounded-xl border border-white/10 bg-white/[0.02]">
            <div>
              <span className="font-mono-code text-xs text-[#9A9A96] uppercase tracking-wider block">Role</span>
              <span className="text-sm sm:text-base font-medium text-white mt-1.5 block">{project.role}</span>
            </div>
            <div>
              <span className="font-mono-code text-xs text-[#9A9A96] uppercase tracking-wider block">Timeline</span>
              <span className="text-sm sm:text-base font-medium text-white mt-1.5 block">{project.timeline}</span>
            </div>
            <div>
              <span className="font-mono-code text-xs text-[#9A9A96] uppercase tracking-wider block">Platform</span>
              <span className="text-sm sm:text-base font-medium text-white mt-1.5 block">{project.platform}</span>
            </div>
            <div>
              <span className="font-mono-code text-xs text-[#9A9A96] uppercase tracking-wider block">Deliverables</span>
              <span className="text-sm sm:text-base font-medium text-white mt-1.5 block">{project.deliverables}</span>
            </div>
          </div>

          {/* =========================================================================
              SECTION 01: * BACKGROUND
              ========================================================================= */}
          <section className="space-y-6 pt-4 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#DFFCA1]">*</span> Background
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#9A9A96] leading-relaxed max-w-4xl">
              {project.description}
            </p>
          </section>

          {/* =========================================================================
              SECTION 02: * THE PROBLEM & FRICTION
              ========================================================================= */}
          <section className="space-y-8 pt-4 border-t border-white/10">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="text-[#DFFCA1]">*</span> The Problem &amp; Operational Friction
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#9A9A96] leading-relaxed max-w-4xl">
                {project.friction}
              </p>
            </div>

            {/* Artifact Showcase Card 01 */}
            <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#0E100F] p-4 sm:p-6 shadow-xl space-y-4">
              <div 
                onClick={() => setExpandedImage({
                  src: artifact1.image,
                  title: project.title,
                  tag: artifact1.tag,
                  caption: artifact1.caption
                })}
                className="rounded-lg overflow-hidden bg-black/60 flex items-center justify-center relative group p-2 sm:p-3 cursor-zoom-in"
              >
                <img 
                  src={artifact1.image} 
                  alt={artifact1.tag} 
                  className="w-full h-auto max-h-[85dvh] object-contain rounded-md filter contrast-110 group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 font-mono-code text-[11px] text-white/90 bg-black/80 backdrop-blur-md px-3 py-1 rounded border border-white/15">
                  {artifact1.tag}
                </div>
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/75 backdrop-blur-md text-[#DFFCA1] opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 flex items-center gap-1.5 text-xs font-mono-code">
                  <Maximize2 size={13} />
                  <span>Expand</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-mono-code text-[#9A9A96] px-1">
                {artifact1.caption}
              </p>
            </div>
          </section>

          {/* =========================================================================
              SECTION 03: * DESIGN STRATEGY & CORE FLOW
              ========================================================================= */}
          <section className="space-y-8 pt-4 border-t border-white/10">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="text-[#DFFCA1]">*</span> Design Strategy &amp; Interaction Architecture
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#9A9A96] leading-relaxed max-w-4xl">
                {project.approach}
              </p>
            </div>

            {/* Artifact Showcase Card 02 */}
            <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#0E100F] p-4 sm:p-6 shadow-xl space-y-4">
              <div 
                onClick={() => setExpandedImage({
                  src: artifact2.image,
                  title: project.title,
                  tag: artifact2.tag,
                  caption: artifact2.caption
                })}
                className="rounded-lg overflow-hidden bg-black/60 flex items-center justify-center relative group p-2 sm:p-3 cursor-zoom-in"
              >
                <img 
                  src={artifact2.image} 
                  alt={artifact2.tag} 
                  className="w-full h-auto max-h-[85dvh] object-contain rounded-md filter contrast-110 group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 font-mono-code text-[11px] text-white/90 bg-black/80 backdrop-blur-md px-3 py-1 rounded border border-white/15">
                  {artifact2.tag}
                </div>
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/75 backdrop-blur-md text-[#DFFCA1] opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 flex items-center gap-1.5 text-xs font-mono-code">
                  <Maximize2 size={13} />
                  <span>Expand</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-mono-code text-[#9A9A96] px-1">
                {artifact2.caption}
              </p>
            </div>
          </section>

          {/* =========================================================================
              SECTION 04: * CORE CRAFT & ENGINEERING PILLARS
              ========================================================================= */}
          {project.features && (
            <section className="space-y-8 pt-4 border-t border-white/10">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="text-[#DFFCA1]">*</span> Solutions &amp; Engineering Deliverables
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {project.features.map((feature, i) => (
                  <div 
                    key={i} 
                    className="p-6 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-4 hover:border-[#DFFCA1]/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#DFFCA1]/10 text-[#DFFCA1] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-base sm:text-lg font-medium text-white leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Artifact Showcase Card 03 */}
              <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#0E100F] p-4 sm:p-6 shadow-xl space-y-4">
                <div 
                  onClick={() => setExpandedImage({
                    src: artifact3.image,
                    title: project.title,
                    tag: artifact3.tag,
                    caption: artifact3.caption
                  })}
                  className="rounded-lg overflow-hidden bg-black/60 flex items-center justify-center relative group p-2 sm:p-3 cursor-zoom-in"
                >
                  <img 
                    src={artifact3.image} 
                    alt={artifact3.tag} 
                    className="w-full h-auto max-h-[85dvh] object-contain rounded-md filter contrast-110 group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 font-mono-code text-[11px] text-white/90 bg-black/80 backdrop-blur-md px-3 py-1 rounded border border-white/15">
                    {artifact3.tag}
                  </div>
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-black/75 backdrop-blur-md text-[#DFFCA1] opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 flex items-center gap-1.5 text-xs font-mono-code">
                    <Maximize2 size={13} />
                    <span>Expand</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-mono-code text-[#9A9A96] px-1">
                  {artifact3.caption}
                </p>
              </div>
            </section>
          )}

          {/* =========================================================================
              SECTION 05: * EXTENDED VISUAL INTERFACE GALLERY
              ========================================================================= */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="space-y-8 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="text-[#DFFCA1]">*</span> Extended Screen &amp; Interface Gallery
                </h2>
                <p className="text-sm sm:text-base text-[#9A9A96]">
                  Click any image to view in full-resolution expanded mode.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
                {project.gallery.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-xl overflow-hidden border border-white/10 bg-[#0E100F] p-4 sm:p-5 shadow-xl space-y-3.5 group hover:border-[#DFFCA1]/30 transition-colors flex flex-col justify-between"
                  >
                    <div 
                      onClick={() => setExpandedImage({
                        src: item.image,
                        title: item.title,
                        tag: `SCREEN_0${idx + 1}`,
                        caption: item.caption
                      })}
                      className="rounded-lg overflow-hidden bg-black/60 flex items-center justify-center relative p-2 sm:p-3 min-h-[220px] cursor-zoom-in"
                    >
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-auto max-h-[70dvh] object-contain rounded-md filter contrast-105 group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 p-2 rounded-full bg-black/75 backdrop-blur-md text-[#DFFCA1] opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 flex items-center gap-1.5 text-xs font-mono-code">
                        <Maximize2 size={13} />
                        <span>Expand</span>
                      </div>
                    </div>
                    <div className="space-y-1 px-1">
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#9A9A96] leading-relaxed">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =========================================================================
              6. BOTTOM INTERACTIVE HIGH-IMPACT CTA BANNER
              ========================================================================= */}
          <div className="pt-16 sm:pt-24 border-t border-white/10 text-center space-y-8">
            <div className="space-y-3">
              <span className="font-mono-code text-xs text-[#DFFCA1] tracking-widest uppercase block">
                [ COLLABORATION ]
              </span>
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-white max-w-3xl mx-auto leading-tight">
                ( <span className="text-[#DFFCA1]">Have something on your mind?</span> Let&apos;s visualize together! )
              </h3>
            </div>

            <div>
              <a
                href="mailto:karthiksatheesh610@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#DFFCA1] text-[#094020] font-bold text-base sm:text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(223,252,161,0.3)] cursor-pointer"
              >
                <span>Let&apos;s talk</span>
                <ArrowRight size={20} />
              </a>
            </div>
          </div>

          {/* =========================================================================
              7. NEXT PROJECT TEASER CARD
              ========================================================================= */}
          <div className="pt-10 border-t border-white/10">
            <div 
              onClick={() => handleProjectChange(nextProject)}
              className="group cursor-pointer p-8 sm:p-12 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#DFFCA1]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all hover:bg-white/[0.04]"
            >
              <div>
                <span className="font-mono-code text-xs text-[#DFFCA1] uppercase tracking-wider block mb-2">
                  Next Case Study
                </span>
                <h4 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white group-hover:text-[#DFFCA1] transition-colors tracking-tight">
                  {nextProject.title}
                </h4>
                <p className="text-[#9A9A96] text-sm sm:text-base mt-2">
                  {nextProject.subtitle}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#DFFCA1] text-[#094020] flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-all shrink-0">
                <ArrowRight size={24} />
              </div>
            </div>
          </div>

        </motion.main>

        {/* =========================================================================
            8. FULLSCREEN EXPANDED IMAGE LIGHTBOX OVERLAY
            ========================================================================= */}
        <AnimatePresence>
          {expandedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setExpandedImage(null)}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 select-none overscroll-contain cursor-zoom-out"
            >
              {/* Top Bar with Title & Close Action */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-7xl mx-auto flex items-center justify-between py-2 border-b border-white/10 shrink-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-code text-xs text-[#DFFCA1] bg-[#094020] px-3 py-1 rounded-full uppercase tracking-wider">
                    {expandedImage.tag || 'EXPANDED_VIEW'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {expandedImage.title || project.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedImage(null)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#DFFCA1] hover:text-[#094020] text-white text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Close [ESC]</span>
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Main Expanded Image Container */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="w-full flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden my-auto"
              >
                <motion.img
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.94, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  src={expandedImage.src}
                  alt={expandedImage.title || 'Expanded View'}
                  className="max-w-full max-h-[82dvh] object-contain rounded-xl shadow-2xl border border-white/15 filter contrast-105 select-none"
                />
              </div>

              {/* Bottom Caption Bar */}
              {expandedImage.caption && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-4xl mx-auto text-center py-2 shrink-0"
                >
                  <p className="text-xs sm:text-sm font-mono-code text-[#9A9A96] bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 inline-block">
                    {expandedImage.caption}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            9. CINEMATIC PROJECT TRANSITION SHUTTER (TRANSLUCENT BLURRED)
            ========================================================================= */}
        <AnimatePresence>
          {isTransitioning && transitionTarget && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xl flex flex-col items-center justify-center p-6 select-none pointer-events-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center text-center max-w-lg space-y-3"
              >
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.03em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                  {transitionTarget.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono-code text-[#9A9A96] tracking-wide">
                  {transitionTarget.category} · {transitionTarget.year}
                </p>

                {/* High-Precision Loading Track */}
                <div className="w-48 sm:w-56 h-[2px] bg-white/15 rounded-full overflow-hidden mt-3 relative">
                  <motion.div
                    initial={{ left: '-100%', width: '50%' }}
                    animate={{ left: '140%', width: '50%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut', repeat: Infinity }}
                    className="absolute top-0 bottom-0 bg-[#DFFCA1] shadow-[0_0_10px_#DFFCA1]"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </AnimatePresence>
  );
};
