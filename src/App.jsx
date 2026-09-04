import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { SplashScreen } from './components/SplashScreen';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkShowcase } from './components/WorkShowcase';
import { Manifesto } from './components/Manifesto';
import { SkillSets } from './components/SkillSets';
import { HorizontalScrollSection } from './components/HorizontalScrollSection';
import { AsciiCtaSection } from './components/AsciiCtaSection';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { projects } from './data/projects';

// Lazy-loaded on-demand modals to drastically reduce initial payload
const CaseStudyModal = lazy(() => import('./components/CaseStudyModal').then(m => ({ default: m.CaseStudyModal })));
const ResumeModal = lazy(() => import('./components/ResumeModal').then(m => ({ default: m.ResumeModal })));

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.0,
      wheelMultiplier: 0.85,
      infinite: false,
      autoResize: true
    });
    lenisRef.current = lenis;

    // Connect Lenis to global anchor clicks for seamless smooth scrolling
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href !== '#' && document.querySelector(href)) {
          e.preventDefault();
          lenis.scrollTo(href, { offset: 0, duration: 0.9 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
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

  return (
    <div className="min-h-[100dvh] bg-black text-[#EDEBE4] relative">
      
      {/* 0.8s Pulse Screen Load Splash Screen */}
      <SplashScreen />

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

      {/* 7th Section: Testimonials */}
      <Testimonials />

      {/* 8th Section: Massive Footer Marquee & Minimal Information Matrix */}
      <Footer onOpenResume={() => setIsResumeOpen(true)} />

      {/* Full-Page Editorial Product Detail Case Study Overlay */}
      {selectedProject && (
        <Suspense fallback={null}>
          <CaseStudyModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onSelectProject={setSelectedProject}
          />
        </Suspense>
      )}

      {/* Full-Page Modern Resumé Modal */}
      {isResumeOpen && (
        <Suspense fallback={null}>
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={() => setIsResumeOpen(false)}
          />
        </Suspense>
      )}

    </div>
  );
}
