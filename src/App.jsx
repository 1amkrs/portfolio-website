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
import { 
  getProjectByPath, 
  isResumePath, 
  getProjectUrl, 
  getProjectPageTitle, 
  DEFAULT_PAGE_TITLE 
} from './utils/routes';

// Lazy-loaded on-demand modals to drastically reduce initial payload
const CaseStudyModal = lazy(() => import('./components/CaseStudyModal').then(m => ({ default: m.CaseStudyModal })));
const ResumeModal = lazy(() => import('./components/ResumeModal').then(m => ({ default: m.ResumeModal })));

export default function App() {
  const [selectedProject, setSelectedProject] = useState(() => {
    if (typeof window === 'undefined') return null;
    return getProjectByPath(window.location.pathname);
  });
  const [isResumeOpen, setIsResumeOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return isResumePath(window.location.pathname);
  });
  const lenisRef = useRef(null);

  // Sync initial URL & dynamic document title on direct landing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (selectedProject) {
      document.title = getProjectPageTitle(selectedProject);
      const canonicalPath = getProjectUrl(selectedProject);
      if (window.location.pathname !== canonicalPath) {
        window.history.replaceState({ projectId: selectedProject.id }, '', canonicalPath);
      }
    } else if (isResumeOpen) {
      document.title = 'Resume · Karthik Satheesh';
      if (window.location.pathname !== '/resume') {
        window.history.replaceState({ isResume: true }, '', '/resume');
      }
    }

    // Listen to browser Back / Forward buttons
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const matchedProject = getProjectByPath(currentPath);

      if (matchedProject) {
        setSelectedProject(matchedProject);
        setIsResumeOpen(false);
        document.title = getProjectPageTitle(matchedProject);
      } else if (isResumePath(currentPath)) {
        setIsResumeOpen(true);
        setSelectedProject(null);
        document.title = 'Resume · Karthik Satheesh';
      } else {
        setSelectedProject(null);
        setIsResumeOpen(false);
        document.title = DEFAULT_PAGE_TITLE;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleOpenProject = (project) => {
    if (!project) return;
    setSelectedProject(project);
    setIsResumeOpen(false);

    const targetPath = getProjectUrl(project);
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState({ projectId: project.id }, '', targetPath);
      document.title = getProjectPageTitle(project);
    }
  };

  const handleCloseProject = () => {
    setSelectedProject(null);

    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
      document.title = DEFAULT_PAGE_TITLE;
    }
  };

  const handleOpenResume = () => {
    setIsResumeOpen(true);
    setSelectedProject(null);

    if (typeof window !== 'undefined' && window.location.pathname !== '/resume') {
      window.history.pushState({ isResume: true }, '', '/resume');
      document.title = 'Resume · Karthik Satheesh';
    }
  };

  const handleCloseResume = () => {
    setIsResumeOpen(false);

    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
      document.title = DEFAULT_PAGE_TITLE;
    }
  };

  // Initialize Lenis smooth scroll on desktop (touchscreens use native 120Hz hardware scroll)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
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
      lenisRef.current = null;
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
        onOpenResume={handleOpenResume}
      />

      {/* 1st Section: Hero (100vh with Silk Waves & integrated bottom Marquee) */}
      <Hero />

      {/* 2nd Section: Lightswind Image Reveal Selected Works Showcase */}
      <WorkShowcase onSelectProject={handleOpenProject} />

      {/* 3rd Section: Manifesto with Parallax & One-by-One Scroll Pop-Up */}
      <Manifesto />

      {/* 4th Section: Skill Sets Matrix */}
      <SkillSets />

      {/* 5th Section: 3-Slide Horizontal Scroll Track */}
      <HorizontalScrollSection onSelectProject={handleOpenProject} />

      {/* 6th Section: ASCII CTA Section */}
      <AsciiCtaSection onOpenProject={handleOpenProject} />

      {/* 7th Section: Testimonials */}
      <Testimonials />

      {/* 8th Section: Massive Footer Marquee & Minimal Information Matrix */}
      <Footer onOpenResume={handleOpenResume} />

      {/* Full-Page Editorial Product Detail Case Study Overlay */}
      {selectedProject && (
        <Suspense fallback={null}>
          <CaseStudyModal
            project={selectedProject}
            onClose={handleCloseProject}
            onSelectProject={handleOpenProject}
          />
        </Suspense>
      )}

      {/* Full-Page Modern Resumé Modal */}
      {isResumeOpen && (
        <Suspense fallback={null}>
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={handleCloseResume}
          />
        </Suspense>
      )}

    </div>
  );
}
