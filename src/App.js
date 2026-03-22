import React from 'react';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import TechStack from './TechStack';
import Work from './Work';
import GithubStats from './GithubStats';
import Gallery from './Gallery';
import Services from './Services';
import CV from './CV';
import Contact from './Contact';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <Navbar />

      <div id="home"><Home /></div>
      <div id="about"><About /></div>
      <div id="techstack"><TechStack /></div>
      <div id="work"><Work /></div>
      <div id="githubstats"><GithubStats /></div>  {/* ← navbar ছাড়াই */}
      <div id="gallery"><Gallery /></div>
      <div id="services"><Services /></div>
      <div id="cv"><CV /></div>
      <div id="contact"><Contact /></div>

      <footer className="site-footer">
        <span>© 2025 <a href="/">Arup Das</a>. Built with 💜 React & Tailwind.</span>
        <span>B.Tech CSE (AIML) · Brainware University · Kolkata</span>
      </footer>
    </div>
  );
}

export default App;