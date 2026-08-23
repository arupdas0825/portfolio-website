/**
 * Home.js — Hero section
 * Visual: Clean futuristic CSS coding monitor (all devices)
 * Content: ALL original text, buttons, socials preserved exactly.
 */

import React, { useEffect, useRef, useState } from 'react';
import SplineScene from './components/SplineScene';

// Mobile detection — safe at module level in CRA (browser env)
const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)')?.matches ||
   'ontouchstart' in window ||
   (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));




const ROLES = [
  'AI / ML Developer', 'React Developer', 'Android App Developer',
  'Full Stack Developer', 'Open Source Contributor',
  'Photographer & Videographer', 'Problem Solver', 'B.Tech CSE (AIML) Student',
];

function useTypewriter(words, ts = 80, ds = 40, pt = 1800) {
  const [disp, setDisp] = useState('');
  const [wi, setWi]     = useState(0);
  const [del, setDel]   = useState(false);

  useEffect(() => {
    let timerId;
    let pauseTimerId;
    const cur = words[wi % words.length];

    if (!del) {
      if (disp.length < cur.length) {
        timerId = setTimeout(() => {
          setDisp(cur.slice(0, disp.length + 1));
        }, ts);
      } else {
        pauseTimerId = setTimeout(() => {
          setDel(true);
        }, pt);
      }
    } else {
      if (disp.length > 0) {
        timerId = setTimeout(() => {
          setDisp(cur.slice(0, disp.length - 1));
        }, ds);
      } else {
        setDel(false);
        setWi(i => (i + 1) % words.length);
      }
    }

    return () => {
      clearTimeout(timerId);
      clearTimeout(pauseTimerId);
    };
  }, [disp, del, wi, words, ts, ds, pt]);

  return disp;
}

const IconPath = {
  github:    'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z',
  linkedin:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
};

export default function Home() {
  const fadeRefs  = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  const typedText = useTypewriter(ROLES);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach(el => el && obs.observe(el));
    setTimeout(() => fadeRefs.current.forEach(el => el && el.classList.add('visible')), 100);
    return () => obs.disconnect();
  }, []);

  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <section className='home-section'>
      {/* ── Background Depth & Cinematic Grid ── */}
      <div className='hero-bg-depth'>
        <div className='hero-perspective-grid' />
        <div className='hero-ambient-mesh-1' />
      </div>

      {/* ── LEFT: all original text & buttons ── */}
      <div className='hero-left fade-in' ref={addRef} style={{ position: 'relative', zIndex: 20 }}>
        <div className='hero-badge'><span className='badge-dot' />Senior AI & Full-Stack Architect</div>
        <div className='hero-code-tag'>&lt; SYSTEM ARCHITECT /&gt;</div>
        <h1 className='hero-name'>
          Hi, I'm <span className='hero-name-gradient'>Arup Das</span>
        </h1>
        <div className='hero-role-wrap'>
          <span className='hero-role-text'>{typedText}</span>
          <span className='hero-cursor'>|</span>
        </div>

        {/* ── Stats / Trust Bar ── */}
        <div className='hero-stats-bar'>
          <div className='hero-stat-pill'>
            <span className='hero-stat-val'>15+</span>
            <span>Projects Shipped</span>
          </div>
          <div className='hero-stat-pill'>
            <span className='hero-stat-val'>8+</span>
            <span>Certifications</span>
          </div>
          <div className='hero-stat-pill'>
            <span className='hero-stat-val'>40+</span>
            <span>AI / Tech Stack</span>
          </div>
          <div className='hero-stat-pill'>
            <span className='hero-stat-val'>2028</span>
            <span>B.Tech CSE (AI/ML)</span>
          </div>
        </div>

        <div className='hero-location'>
          <span>
            <svg width='14' height='14' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' /></svg>
            Based in Kolkata
          </span>
          <span>
            <svg width='14' height='14' fill='currentColor' viewBox='0 0 24 24'><path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' /></svg>
            Available Now
          </span>
        </div>
        <div className='hero-btns'>
          <a className='btn-primary' href='#contact'>
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 24 24'><path d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' /></svg>
            Hire Me
          </a>
          <a className='btn-secondary' href='/CV.pdf' target='_blank' rel='noreferrer'>
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 24 24'><path d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' /></svg>
            Download CV
          </a>
        </div>
        <div className='hero-social'>
          <span>Follow me:</span>
          {['github', 'linkedin', 'instagram'].map(k => (
            <a key={k} className='social-icon'
              href={k === 'github' ? 'https://github.com/arupdas0825' : k === 'linkedin' ? 'https://www.linkedin.com/in/arup-das-381bb02a1/' : 'https://www.instagram.com/_arup_official_08/'}
              target='_blank' rel='noreferrer' title={k.charAt(0).toUpperCase() + k.slice(1)}>
              <svg width='16' height='16' fill='currentColor' viewBox='0 0 24 24'><path d={IconPath[k]} /></svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Spline 3D Scene (Clean Seamless Background) ── */}
      <div className='hero-visual fade-in' ref={addRef} style={{ animationDelay: '0.2s', position: 'relative', zIndex: 5 }}>
        {/* Soft un-clipped ambient glow behind the 3D scene */}
        <div style={{
          position: 'absolute',
          inset: '-25%',
          background: 'radial-gradient(circle at 60% 50%, rgba(139,92,246,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <div style={{
          width: '100%',
          height: isMobile ? '390px' : '590px',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Scaled/translated Spline wrapper to keep exact visual presence without boxy glow borders */}
          <div style={{
            width: '100%',
            height: '100%',
            transform: isMobile ? 'scale(1.08) translateY(-6px)' : 'scale(1.16) translateY(-10px)',
            transformOrigin: 'center center',
          }}>
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* ── Scroll Down Cue ── */}
      <a href='#about' className='hero-scroll-cue'>
        <div className='scroll-mouse'>
          <div className='scroll-wheel' />
        </div>
        <span className='scroll-text'>Scroll to Explore</span>
      </a>
    </section>
  );
}