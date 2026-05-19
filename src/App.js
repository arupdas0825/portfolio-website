import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar         from './Navbar';
import Home           from './Home';
import About          from './About';

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
const AdminPanel = lazy(() => import('./admin/AdminPanel'));
const CustomCursor = lazy(() => import('./CustomCursor'));
const WorkPage = lazy(() => import('./WorkPage'));
const PhotographyGallery = lazy(() => import('./PhotographyGallery'));
const PublicationsPage = lazy(() => import('./PublicationsPage'));
const AIPlaybackAssistant = lazy(() => import('./ai-playback/AIPlaybackAssistant'));

import ThreeBackground from './components/ThreeBackground';
import WelcomeScreen   from './WelcomeScreen';
import usePlaybackStore from './ai-playback/usePlaybackStore';
import './App.css';


const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

function MobileHeader() {
  const playback = usePlaybackStore();
  if (!IS_TOUCH) return null;

  return (
    <div className="mobile-header-container">
      <div className="mobile-header-glass">
        {/* Logo Section */}
        <div className="mobile-logo-wrap" onClick={() => window.location.reload()}>
          <svg className="mobile-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span className="mobile-logo-text">arup.dev</span>
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
}



function PortfolioHome({ onAdminOpen }) {
  return (
    <>
      <Navbar />
      <div id="home"><Home /></div>
      <div id="about"><About onPhotoDoubleClick={onAdminOpen} /></div>
      <Suspense fallback={null}>
        <div id="techstack"><TechStack /></div>
        <div id="work"><Work /></div>
        <div id="internship"><Internship /></div>
        <div id="publications"><Publications /></div>
        <div id="certificates"><Certificates /></div>
        <div id="githubstats"><GithubStats /></div>
        <div id="gallery"><Gallery /></div>
        <div id="services"><Services /></div>
        <div id="cv"><CV /></div>
        <div id="contact"><Contact /></div>
      </Suspense>
      <footer className="site-footer">
        <span>© 2025 <a href="/">Arup Das</a>. Built with 💜 React &amp; Tailwind.</span>
        <span>B.Tech CSE (AIML) · Brainware University · Kolkata</span>
      </footer>
    </>
  );
}

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);

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
    <BrowserRouter>
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
          <ThreeBackground />
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          {!IS_TOUCH && <CustomCursor />}
          
          {/* ── Mobile Header (Logo + AI) ── */}
          <MobileHeader />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <Suspense fallback={null}>
              <Routes>
                <Route
                  path="/"
                  element={<PortfolioHome onAdminOpen={() => setAdminOpen(true)} />}
                />
                <Route path="/work" element={<WorkPage />} />
                <Route path="/photography-gallery" element={<PhotographyGallery />} />
                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
              </Routes>
              {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}

              {/* ── AI Playback Assistant (floating overlay) ── */}

              <AIPlaybackAssistant />
            </Suspense>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}