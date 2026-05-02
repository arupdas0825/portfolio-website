import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar         from './Navbar';
import Home           from './Home';
import About          from './About';
import TechStack      from './TechStack';
import Work           from './Work';
import Publications   from './Publications';
import GithubStats    from './GithubStats';
import Gallery        from './Gallery';
import Services       from './Services';
import CV             from './CV';
import Contact        from './Contact';
import AdminPanel     from './admin/AdminPanel';
import CustomCursor   from './CustomCursor';
import ThreeBackground from './components/ThreeBackground';
import WorkPage        from './WorkPage';
import WelcomeScreen   from './WelcomeScreen';
import MaintenanceGate, { MAINTENANCE_MODE } from './MaintenanceGate';
import './App.css';

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);


function PortfolioHome({ onAdminOpen }) {
  return (
    <>
      <Navbar />
      <div id="home"><Home /></div>
      <div id="about"><About onPhotoDoubleClick={onAdminOpen} /></div>
      <div id="techstack"><TechStack /></div>
      <div id="work"><Work /></div>
      <div id="publications"><Publications /></div>
      <div id="githubstats"><GithubStats /></div>
      <div id="gallery"><Gallery /></div>
      <div id="services"><Services /></div>
      <div id="cv"><CV /></div>
      <div id="contact"><Contact /></div>
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
    if (seen) return MAINTENANCE_MODE ? 'maintenance' : 'portfolio';
    return 'welcome';
  });

  const handleWelcomeDone = () => {
    sessionStorage.setItem('seenWelcome', 'true');
    setStage(MAINTENANCE_MODE ? 'maintenance' : 'portfolio');
  };
  const handleBypass = () => setStage('portfolio');

  return (
    <BrowserRouter>
      <div className="app-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
        
        {/* ── STAGE 1: Welcome Intro (Overlay) ── */}
        {stage === 'welcome' && (
          <WelcomeScreen onEnter={handleWelcomeDone} />
        )}

        {/* ── STAGE 2: Maintenance Gate (Overlay) ── */}
        {stage === 'maintenance' && (
          <MaintenanceGate onBypass={handleBypass} />
        )}

        {/* ── STAGE 3: Main Portfolio (Persistent) ── */}
        {/* We keep this mounted ALWAYS to prevent 3D canvas remount/shrink issues.
            Visibility is controlled via z-index or opacity if needed, 
            but here it stays behind the fixed overlays. */}
        <div className="app-wrapper" style={{ 
          visibility: stage === 'portfolio' ? 'visible' : 'hidden',
          opacity: stage === 'portfolio' ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out'
        }}>
          <ThreeBackground />
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          {!IS_TOUCH && <CustomCursor />}

          <div style={{ position: 'relative', zIndex: 10 }}>
            <Routes>
              <Route
                path="/"
                element={<PortfolioHome onAdminOpen={() => setAdminOpen(true)} />}
              />
              <Route path="/work" element={<WorkPage />} />
            </Routes>
            {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}