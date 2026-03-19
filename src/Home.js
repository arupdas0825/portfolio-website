import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiJavascript, SiPython } from 'react-icons/si';
import { FaBrain, FaJava } from 'react-icons/fa';
import axios from 'axios';

const ROLES = [
  'AI / ML Developer',
  'React Developer',
  'Android App Developer',
  'Full Stack Developer',
  'Open Source Contributor',
  'Photographer & Videographer',
  'Problem Solver',
  'B.Tech CSE (AIML) Student',
];

function useTypewriter(words, typingSpeed = 80, deletingSpeed = 40, pauseTime = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return displayed;
}

const OrbitIcon = ({ icon: Icon, label, delay, index }) => {
  const angle = (index * 90) * (Math.PI / 180);
  const radius = 100;
  
  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        width: '40px',
        height: '40px',
      }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <motion.div
        className="relative group cursor-pointer"
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{ scale: 1.2 }}
      >
        <div className="orbit-icon-glow absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
             style={{ background: 'var(--purple)' }} />
        <div className="relative z-10 w-10 h-10 rounded-full bg-slate-900/90 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:border-purple-400 transition-all duration-300 shadow-[0_0_15px_rgba(138,92,246,0.3)]">
          <Icon size={20} />
        </div>
        
        {/* Tooltip */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-slate-900/90 border border-purple-500/20 px-2 py-1 rounded text-[10px] whitespace-nowrap text-purple-200 backdrop-blur-md">
            {label}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CountUp = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}+</span>;
};

export default function Home() {
  const fadeRefs = useRef([]);
  const typedText = useTypewriter(ROLES);
  const [repoCount, setRepoCount] = useState(4);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/arupdas0825');
        if (response.data && response.data.public_repos) {
          setRepoCount(response.data.public_repos);
        }
      } catch (error) {
        console.error('Error fetching GitHub repos:', error);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    setTimeout(() => {
      fadeRefs.current.forEach(el => el && el.classList.add('visible'));
    }, 100);
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  const icons = [
    { icon: FaJava, label: 'Java' },
    { icon: SiJavascript, label: 'JavaScript' },
    { icon: SiPython, label: 'Python' },
    { icon: FaBrain, label: 'AI/ML' },
  ];

  return (
    <section className="home-section relative overflow-hidden">
      {/* Background Light Streak */}
      <motion.div 
        className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -rotate-45"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ top: '30%' }}
      />

      {/* LEFT */}
      <div className="hero-left fade-in" ref={addRef}>
        <div className="hero-badge">
          <span className="badge-dot" />
          Available for opportunities
        </div>

        <div className="hero-code-tag">&lt; HELLO WORLD /&gt;</div>

        <h1 className="hero-name">Hi, I'm Arup Das</h1>

        {/* TYPEWRITER ROLE */}
        <div className="hero-role-wrap">
          <span className="hero-role-text">{typedText}</span>
          <span className="hero-cursor">|</span>
        </div>

        <p className="hero-desc">
          I'm a B.Tech CSE (AIML) student at Brainware University, Kolkata — building immersive
          AI-powered digital systems with design precision and engineering excellence.
        </p>

        <div className="hero-location">
          <span>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Based in Kolkata
          </span>
          <span>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            Available Now
          </span>
        </div>

        <div className="hero-btns">
          <a className="btn-primary" href="#contact">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            Hire Me
          </a>
          <a className="btn-secondary" href="/CV.pdf" target="_blank" rel="noreferrer">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Download CV
          </a>
        </div>

        <div className="hero-social">
          <span>Follow me:</span>
          <a className="social-icon" href="https://github.com/arupdas0825" target="_blank" rel="noreferrer" title="GitHub">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
            </svg>
          </a>
          <a className="social-icon" href="https://linkedin.com/in/arupdas0825" target="_blank" rel="noreferrer" title="LinkedIn">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a className="social-icon" href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
        </div>
      </div>

      {/* RIGHT — Orbital Widget */}
      <div className="hero-visual fade-in" ref={addRef} style={{ animationDelay: '0.2s' }}>
        <div className="orbit-container">
          <div className="orbit-card bg-[#0f0c1a]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            {/* Background texture override */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
            
            <div className="orbit-card-header z-10">
              <span>CORE UI</span>
              <span className="flex items-center gap-1.5 text-[#22c55e] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                ONLINE
              </span>
            </div>
            
            <div className="orbit-badges-top z-10">
              <span className="orbit-badge">● SYSTEM READY</span>
              <span className="orbit-badge">PORTFOLIO 2025</span>
              <span className="orbit-badge">AI POWERED</span>
            </div>

            {/* Orbit System */}
            <div className="relative w-64 h-64 flex items-center justify-center mt-8">
              {/* Outer Orbit Ring */}
              <div className="absolute w-full h-full rounded-full border border-purple-500/10 shadow-[inset_0_0_20px_rgba(138,92,246,0.05)]" />
              
              {/* Rotating Icons Container */}
              <motion.div 
                className="absolute w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                {icons.map((item, i) => (
                  <div key={i} className="absolute" style={{ 
                    top: '50%', left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-128px) rotate(${-i * 90}deg)`
                  }}>
                    <motion.div 
                      className="relative group/icon"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      whileHover={{ scale: 1.15 }}
                    >
                      <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                      <div className="w-10 h-10 rounded-full bg-[#0a0812] border border-white/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(138,92,246,0.2)] group-hover/icon:border-purple-500/50 group-hover/icon:text-purple-300 transition-all">
                        <item.icon size={18} />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-all">
                        <span className="bg-slate-900/90 border border-white/10 px-2 py-0.5 rounded text-[10px] text-purple-200 backdrop-blur-md">
                          {item.label}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>

              {/* Inner Core */}
              <motion.div 
                className="orbit-core z-20 cursor-pointer"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                ARUP
              </motion.div>
            </div>

            <div className="orbit-stats z-10 w-full px-6 mt-6">
              <div className="orbit-stat">
                <div className="orbit-stat-val">
                  <CountUp end={repoCount} />
                </div>
                <div className="orbit-stat-label">Projects</div>
              </div>
              <div className="orbit-stat">
                <div className="orbit-stat-val text-purple-400">AI/ML</div>
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
}