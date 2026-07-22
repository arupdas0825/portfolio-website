import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar         from './Navbar';
import Home           from './Home';
import About          from './About';
import Starfield       from './Starfield';
import WelcomeScreen   from './WelcomeScreen';
import usePlaybackStore from './ai-playback/usePlaybackStore';
import { ScrollAnimatedSection } from './components/ScrollAnimatedSection';
import './App.css';
import './MobileExperience.css';

// Lazy load below-the-fold components to maximize performance & speed up welcome screen
const TechStack = lazy(() => import('./TechStack'));
const Work = lazy(() => import('./Work'));
const Internship = lazy(() => import('./Internship'));
const Publications = lazy(() => import('./Publications'));
const Certificates = lazy(() => import('./Certificates'));
const CertificatesPage = lazy(() => import('./CertificatesPage'));
const GithubStats = lazy(() => import('./GithubStats'));
const Gallery = lazy(() => import('./Gallery'));
const Services = lazy(() => import('./Services'));
const CV = lazy(() => import('./CV'));
const Contact = lazy(() => import('./Contact'));
const CustomCursor = lazy(() => import('./CustomCursor'));
const WorkPage = lazy(() => import('./WorkPage'));
const WorkCategoryPage = lazy(() => import('./WorkCategoryPage'));
const PhotographyGallery = lazy(() => import('./PhotographyGallery'));
const PublicationsPage = lazy(() => import('./PublicationsPage'));
const AIPlaybackAssistant = lazy(() => import('./ai-playback/AIPlaybackAssistant'));

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

function LazyMountSection({ children, rootMargin = '300px' }) {
  const [shouldMount, setShouldMount] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (shouldMount) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [shouldMount, rootMargin]);

  return <div ref={ref}>{shouldMount ? children : <div style={{ minHeight: '180px' }} />}</div>;
}

const MobileHeader = React.memo(function MobileHeader() {
  const playback = usePlaybackStore();
  if (!IS_TOUCH) return null;

  return (
    <div className="mobile-header-container">
      <div className="mobile-header-glass">
        {/* Logo Section */}
        <div className="mobile-logo-wrap" onClick={() => window.location.reload()}>
          <img 
            src="/ad logo.jpeg" 
            alt="AD Logo" 
            width={22} 
            height={22} 
            decoding="async" 
            loading="eager"
            className="mobile-logo-img" 
          />
          <span className="mobile-logo-text">arup.dev</span>
          <span className="brand-accent-dot" />
        </div>

        {/* Separator */}
        <div className="mobile-header-sep" />

        {/* AI Playback Trigger */}
        <button 
          className={`mobile-ai-trigger ${playback.isActive ? 'active' : ''}`}
          onClick={() => !playback.isActive && playback.start()}
        >
          <div className="mobile-ai-orb">
            <div className="ai-orb-inner" />
          </div>
          <span className="mobile-ai-label">
            {playback.isActive ? 'PRESENTING' : 'AI PLAYBACK'}
          </span>
        </button>
      </div>
    </div>
  );
});

const PortfolioHome = React.memo(function PortfolioHome() {
  return (
    <>
      <Navbar />
      <div id="home"><Home /></div>
      <div id="about">
        <ScrollAnimatedSection intensity="subtle">
          <About />
        </ScrollAnimatedSection>
      </div>
      <Suspense fallback={null}>
        <div id="techstack">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="medium">
              <TechStack />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
        <div id="work">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="medium">
              <Work />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
        <div id="internship">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="subtle">
              <Internship />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
        <div id="publications">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="subtle">
              <Publications />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
        <div id="certificates">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="strong">
              <Certificates featuredOnly={true} />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
        <div id="githubstats">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="medium">
              <GithubStats />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
        <div id="gallery">
          <LazyMountSection>
            <Gallery />
          </LazyMountSection>
        </div>
        <div id="services">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="medium">
              <Services />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
        <div id="cv">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="subtle">
              <CV />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
        <div id="contact">
          <LazyMountSection>
            <ScrollAnimatedSection intensity="medium">
              <Contact />
            </ScrollAnimatedSection>
          </LazyMountSection>
        </div>
      </Suspense>
      <footer className="site-footer">
        <span>© 2025 <a href="/">Arup Das</a>. Built with 💜 React &amp; Tailwind.</span>
        <span>B.Tech CSE (AIML) · Brainware University · Kolkata</span>
      </footer>
    </>
  );
});

function AppContent() {
  // Skip welcome if already seen this session (refresh-safe)
  const [stage, setStage] = useState(() => {
    const seen = sessionStorage.getItem('seenWelcome');
    return seen ? 'portfolio' : 'welcome';
  });

  const handleWelcomeDone = () => {
    sessionStorage.setItem('seenWelcome', 'true');
    setStage('portfolio');
  };

  return (
    <div className="app-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* ── STAGE 1: Welcome Intro (Overlay) ── */}
      {stage === 'welcome' && (
        <WelcomeScreen onEnter={handleWelcomeDone} />
      )}

      {/* ── STAGE 2: Main Portfolio (Persistent) ── */}
      <div className="app-wrapper" style={{ 
        visibility: stage === 'portfolio' ? 'visible' : 'hidden',
        opacity: stage === 'portfolio' ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
        paddingBottom: IS_TOUCH ? '100px' : '0px'
      }}>
        <Starfield />
        <div className="ambient-blob ambient-blob-1" />
        <div className="ambient-blob ambient-blob-2" />
        <div className="ambient-blob ambient-blob-3" />
        {!IS_TOUCH && <CustomCursor />}
        
        {/* ── Mobile Header (Logo + AI) ── */}
        <MobileHeader />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <Suspense fallback={null}>
            <Routes>
              <Route
                path="/"
                element={<PortfolioHome />}
              />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:categorySlug" element={<WorkCategoryPage />} />
              <Route path="/photography-gallery" element={<PhotographyGallery />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
            </Routes>

            {/* ── AI Playback Assistant (floating overlay) ── */}
            <AIPlaybackAssistant />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}