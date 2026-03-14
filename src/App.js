import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Work from './Work';
import Services from './Services';
import Contact from './Contact';
import Gallery from './Gallery';
import CV from './CV';
import './App.css';

const MainLayout = () => (
  <>
    <div id="home"><Home /></div>
    <div id="about"><About /></div>
    <div id="work"><Work /></div>
    <div id="photography"><Gallery /></div>
    <div id="services"><Services /></div>
    <div id="contact"><Contact /></div>
  </>
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Global scroll behavior for anchors
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.hash && target.origin === window.location.origin) {
        const id = target.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: 0, duration: 1.5 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="app-wrapper">
      {/* Ambient background effects */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/cv" element={<CV />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <span>© 2025 <a href="/">Arup Das</a>. Built with 💜 using React & Tailwind.</span>
        <span>B.Tech CSE (AIML) · Brainware University · Kolkata</span>
      </footer>
    </div>
  );
}

export default App;