import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Work from './Work';
import Services from './Services';
import Contact from './Contact';
import Gallery from './Gallery';
import CV from './CV';
import GithubStats from './GithubStats';
import CustomCursor from './CustomCursor';
import MyJourney from './MyJourney';
import TechStack from './TechStack';
import './App.css';

const MainLayout = () => (
  <>
    <div id="home"><Home /></div>
    <div id="about"><About /></div>
    <div id="tech"><TechStack /></div>
    <div id="journey"><MyJourney /></div>
    <div id="github"><GithubStats /></div>
    <div id="work"><Work /></div>
    <div id="photography"><Gallery /></div>
    <div id="services"><Services /></div>
    <div id="contact"><Contact /></div>
  </>
);

function App() {
  useEffect(() => {
    // Global scroll behavior for anchors
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.hash && target.origin === window.location.origin) {
        const id = target.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="app-wrapper">
      {/* Ambient background effects */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      
      <CustomCursor />
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