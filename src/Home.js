import React, { useEffect, useRef } from 'react';
import { LucideGithub, LucideLinkedin, LucideInstagram, LucideSend, LucideDownload, LucideMapPin, LucideBriefcase, LucideAtom, LucideFlame, LucideBot } from 'lucide-react';

const Home = () => {
  const fadeRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <section id="home" className="page-section home-section">
      <div className="hero-content">
        <div className="hero-badge fade-in" ref={addRef}>
          Available for opportunities
        </div>
        
        <h1 className="hero-name fade-in" ref={addRef} style={{ animationDelay: '0.1s' }}>
          Hi, I'm Arup<br/>Das
        </h1>
        
        <div className="hero-role fade-in" ref={addRef} style={{ animationDelay: '0.2s' }}>
          AI/ML Developer
        </div>
        
        <p className="hero-desc fade-in" ref={addRef} style={{ animationDelay: '0.3s' }}>
          I'm a B.Tech CSE (AIML) student at Brainware University, Kolkata — building immersive AI-powered digital systems with design precision and engineering excellence.
        </p>
        
        <div className="hero-location fade-in" ref={addRef} style={{ animationDelay: '0.4s' }}>
          <span><LucideMapPin size={16} /> Based in Kolkata</span>
          <span><LucideBriefcase size={16} /> Available Now</span>
        </div>
        
        <div className="hero-btns fade-in" ref={addRef} style={{ animationDelay: '0.5s' }}>
          <a href="#contact" className="btn-primary">
            <LucideSend size={18} /> Hire Me
          </a>
          <a href="/CV.pdf" className="btn-secondary" download>
            <LucideDownload size={18} /> Download CV
          </a>
        </div>
        
        <div className="hero-social fade-in" ref={addRef} style={{ animationDelay: '0.6s' }}>
          <span>Follow me:</span>
          <a href="https://github.com/arupdas0825" className="social-icon" target="_blank" rel="noreferrer"><LucideGithub /></a>
          <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noreferrer"><LucideLinkedin /></a>
          <a href="https://instagram.com" className="social-icon" target="_blank" rel="noreferrer"><LucideInstagram /></a>
        </div>
      </div>

      <div className="hero-visual fade-in" ref={addRef} style={{ animationDelay: '0.3s' }}>
        <div className="orbit-container">
          <div className="orbit-card">
            <div className="orbit-card-header">
              <span>CORE UI</span>
              <span className="orbit-online">ONLINE</span>
            </div>
            
            <div className="orbit-badges">
              <span className="orbit-badge">SYSTEM READY</span>
              <span className="orbit-badge">PORTFOLIO 2025</span>
            </div>
            
            <div className="orbit-ring-2"></div>
            <div className="orbit-ring">
              <div className="orbit-dot"><LucideGithub size={18} /></div>
              <div className="orbit-dot"><LucideBot size={18} /></div>
              <div className="orbit-dot"><LucideAtom size={18} /></div>
              <div className="orbit-dot"><LucideFlame size={18} /></div>
            </div>
            
            <div className="orbit-core">
              ARUP
            </div>
            
            <div className="orbit-stats">
              <div className="orbit-stat">
                <div className="orbit-stat-val">4+</div>
                <div className="orbit-stat-label">Projects</div>
              </div>
              <div className="orbit-stat">
                <div className="orbit-stat-val">AI/ML</div>
                <div className="orbit-stat-label">Focus</div>
              </div>
              <div className="orbit-stat">
                <div className="orbit-stat-val">∞</div>
                <div className="orbit-stat-label">Curiosity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;