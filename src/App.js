import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar         from './Navbar';
import Home           from './Home';
import About          from './About';
import { isAdminAuthenticated } from './utils/auth';
import PasswordModal from './components/PasswordModal';
import AdminPanel from './admin/AdminPanel';

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

import Starfield       from './Starfield';
import WelcomeScreen   from './WelcomeScreen';
import usePlaybackStore from './ai-playback/usePlaybackStore';
import './App.css';
import './MobileExperience.css';


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
}



function PortfolioHome({ onAdminTrigger }) {
  return (
    <>
      <Navbar />
      <div id="home"><Home /></div>
      <div id="about"><About onAdminTrigger={onAdminTrigger} /></div>
      <Suspense fallback={null}>
        <div id="techstack"><TechStack /></div>
        <div id="work"><Work /></div>
        <div id="internship"><Internship /></div>
        <div id="publications"><Publications /></div>
        <div id="certificates"><Certificates featuredOnly={true} /></div>
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

function AppContent() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  // Skip welcome if already seen this session (refresh-safe)
  const [stage, setStage] = useState(() => {
    const seen = sessionStorage.getItem('seenWelcome');
    return seen ? 'portfolio' : 'welcome';
  });

  const handleWelcomeDone = () => {
    sessionStorage.setItem('seenWelcome', 'true');
    setStage('portfolio');
  };

  const handleAuthSuccess = () => {
    setShowPasswordModal(false);
    navigate('/admin');
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
                element={<PortfolioHome onAdminTrigger={() => setShowPasswordModal(true)} />}
              />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:categorySlug" element={<WorkCategoryPage />} />
              <Route path="/photography-gallery" element={<PhotographyGallery />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              
              {/* Protected Admin Route */}
              <Route 
                path="/admin" 
                element={isAdminAuthenticated() ? <AdminPanel /> : <Navigate to="/" replace />} 
              />
            </Routes>

            {/* Password Verification Modal Overlay */}
            <PasswordModal
              isOpen={showPasswordModal}
              onClose={() => setShowPasswordModal(false)}
              onAuthSuccess={handleAuthSuccess}
            />

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