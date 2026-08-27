import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkShowcase } from './components/WorkShowcase';
import { Manifesto } from './components/Manifesto';
import { SkillSets } from './components/SkillSets';
import { HorizontalScrollSection } from './components/HorizontalScrollSection';
import { AsciiCtaSection } from './components/AsciiCtaSection';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ResumeModal } from './components/ResumeModal';
import { KrsLabs } from './components/KrsLabs';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { projects } from './data/projects';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Stop Lenis background scrolling when any modal is open
  useEffect(() => {
    const isAnyModalOpen = !!selectedProject || isResumeOpen;
    if (isAnyModalOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [selectedProject, isResumeOpen]);

  const handleSelectProjectById = (id) => {
    const found = projects.find(p => p.id === id);
    if (found) setSelectedProject(found);
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEBE4] relative">
      
      {/* Precision Custom Dot Cursor */}
      <CustomCursor />

      {/* Navigation Header with Resume Action */}
      <Navbar 
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* 1st Section: Hero (100vh with Silk Waves & integrated bottom Marquee) */}
      <Hero />

      {/* 2nd Section: Lightswind Image Reveal Selected Works Showcase */}
      <WorkShowcase onSelectProject={setSelectedProject} />

      {/* 3rd Section: Manifesto with Parallax & One-by-One Scroll Pop-Up */}
      <Manifesto />

      {/* 4th Section: Skill Sets Matrix */}
      <SkillSets />

      {/* 5th Section: 3-Slide Horizontal Scroll Track */}
      <HorizontalScrollSection onSelectProject={setSelectedProject} />

      {/* 6th Section: ASCII CTA Section */}
      <AsciiCtaSection onOpenProject={setSelectedProject} />

      {/* 7th Section: KRS Labs Experimental Grid */}
      <KrsLabs 
        onSelectProject={setSelectedProject} 
        onSelectProjectById={handleSelectProjectById} 
      />

      {/* 8th Section: Testimonials */}
      <Testimonials />

      {/* 9th Section: Massive Footer Marquee & Minimal Information Matrix */}
      <Footer onOpenResume={() => setIsResumeOpen(true)} />

      {/* Full-Page Editorial Product Detail Case Study Overlay */}
      {selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSelectProject={setSelectedProject}
        />
      )}

      {/* Full-Page Modern Resumé Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

    </div>
  );
}
