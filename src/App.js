import React, { useState } from 'react';
import Navbar       from './Navbar';
import Home         from './Home';
import About        from './About';
import TechStack    from './TechStack';
import Work         from './Work';
import Publications from './Publications';
import GithubStats  from './GithubStats';
import Gallery      from './Gallery';
import Services     from './Services';
import CV           from './CV';
import Contact      from './Contact';
import AdminPanel   from './admin/AdminPanel';
import CustomCursor from './CustomCursor';
import ThreeBackground from './components/ThreeBackground';
import './App.css';

// Detect touch device once at module level (safe — runs in browser only)
const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="app-wrapper">
      {/* Three.js star field — desktop only; returns null on touch devices */}
      <ThreeBackground />

      {/* Ambient blobs — mobile fallback when Three.js is disabled */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Custom cursor — desktop/mouse only */}
      {!IS_TOUCH && <CustomCursor />}

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />

        <div id="home"><Home /></div>
        <div id="about"><About onPhotoDoubleClick={() => setAdminOpen(true)} /></div>
        <div id="techstack"><TechStack /></div>
        <div id="work"><Work /></div>
        <div id="publications"><Publications /></div>
        <div id="githubstats"><GithubStats /></div>
        <div id="gallery"><Gallery /></div>
        <div id="services"><Services /></div>
        <div id="cv"><CV /></div>
        <div id="contact"><Contact /></div>

        <footer className="site-footer">
          <span>© 2025 <a href="/">Arup Das</a>. Built with 💜 React & Tailwind.</span>
          <span>B.Tech CSE (AIML) · Brainware University · Kolkata</span>
        </footer>

        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      </div>
    </div>
  );
}