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
  // 'welcome' | 'maintenance' | 'portfolio'
  const [stage, setStage] = useState('welcome');

  const handleWelcomeDone = () => {
    setStage(MAINTENANCE_MODE ? 'maintenance' : 'portfolio');
  };
  const handleBypass = () => setStage('portfolio');

  /* ── Stage: Welcome intro ── */
  if (stage === 'welcome') {
    return <WelcomeScreen onEnter={handleWelcomeDone} />;
  }

  /* ── Stage: Maintenance gate ── */
  if (stage === 'maintenance') {
    return <MaintenanceGate onBypass={handleBypass} />;
  }

  /* ── Stage: Main portfolio ── */
  return (
    <BrowserRouter>
      <div className="app-wrapper">
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
    </BrowserRouter>
  );
}