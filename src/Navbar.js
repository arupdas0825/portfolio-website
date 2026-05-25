import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { id:'home',      label:'Home',        icon:'🏠' },
  { id:'about',     label:'About',       icon:'👤' },
  { id:'work',      label:'Work',        icon:'💼' },
  { id:'internship', label:'Internship', icon:'🚀' },
  { id:'publications', label:'Publications', icon:'📚' },
  { id:'certificates', label:'Certificates', icon:'📜' },
  { id:'gallery',   label:'Photography', icon:'📷' },
  { id:'services',  label:'Services',    icon:'⚙️' },
  { id:'cv',        label:'CV',          icon:'📄' },
  { id:'contact',   label:'Contact',     icon:'📬' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [active, setActive]       = useState('home');
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);
  const [navBlur, setNavBlur]     = useState(8);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // Scroll-based blur: 8px at top → 20px after 50px scroll
      setNavBlur(window.scrollY > 50 ? 20 : 8);
      const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean);
      let current = 'home';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener('scroll', close, { once: true });
    }
  }, [menuOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  // ── MOBILE NAV (Apple Floating Dock Redesign) ──
  if (isMobile) return (
    <>
      <div className="apple-dock-border-wrap">
        <nav className="apple-dock-container">
          {/* Quick Links for Dock */}
          {[
            { id:'home',      icon:'🏠' },
            { id:'work',      icon:'💼' },
            { id:'gallery',   icon:'📷' },
            { id:'contact',   icon:'📬' },
          ].map(link => {
            const isActive = active === link.id;
            return (
              <motion.button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`apple-dock-btn ${isActive ? 'active' : ''}`}
                whileTap={{ scale: 0.92, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                aria-label={`Navigate to ${link.id}`}
              >
                <span>{link.icon}</span>
                {isActive && (
                  <motion.div 
                    className="apple-dock-dot"
                    layoutId="activeDockIndicatorDot"
                    transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Divider */}
          <div className="apple-dock-divider" />

          {/* More/Menu Toggle */}
          <motion.button
            onClick={() => setMenuOpen(o => !o)}
            className={`apple-dock-more-btn ${menuOpen ? 'open' : ''}`}
            whileTap={{ scale: 0.92, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label="Toggle full menu navigation"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block',
                width: menuOpen ? (i === 1 ? 0 : 20) : 20,
                height: 2,
                background: menuOpen ? '#a78bfa' : 'rgba(255,255,255,0.75)',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(4px,4px)'
                  : i === 2 ? 'rotate(-45deg) translate(4px,-4px)'
                  : 'scaleX(0)'
                  : 'none',
              }}/>
            ))}
          </motion.button>
        </nav>
      </div>

      {/* Drawer (Bottom Sheet Style) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 190,
        pointerEvents: menuOpen ? 'all' : 'none',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Menu panel (Bottom Sheet) */}
        <div style={{
          position: 'relative',
          width: '100%',
          background: 'rgba(15, 12, 26, 0.95)',
          backdropFilter: 'blur(30px)',
          borderTop: '1px solid rgba(138, 92, 246, 0.3)',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          transform: menuOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex', flexDirection: 'column',
          padding: '24px 20px 100px', // Extra bottom padding for dock
          gap: 10,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          {/* Handle */}
          <div style={{
            width: 40, height: 4, background: 'rgba(255,255,255,0.2)',
            borderRadius: 2, margin: '0 auto 20px',
          }} />

          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, letterSpacing:'2px', color:'rgba(255,255,255,0.3)', marginBottom:8, textAlign:'center' }}>
            FULL NAVIGATION
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10 }}>
            {navLinks.map((link, i) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '16px', borderRadius: 16,
                  background: active === link.id ? 'rgba(138,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                  border: active === link.id ? '1px solid rgba(138,92,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  color: active === link.id ? '#a78bfa' : 'rgba(255,255,255,0.65)',
                  fontSize: 14, fontWeight: 600,
                  fontFamily: "'Syne',sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: menuOpen ? `${i * 0.03}s` : '0s',
                }}
              >
                <span style={{ fontSize: 18 }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>

          {/* Bottom */}
          <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.06)', textAlign:'center' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:"'Syne',sans-serif" }}>
              Arup Das · Portfolio v3.0
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ── DESKTOP NAV (scroll-based blur) ──
  return (
    <>
      <div className="brand-dock" onClick={() => window.location.reload()} title="Refresh Page">
        <svg className="brand-logo-icon" viewBox="0 0 24 24" fill="none" stroke="url(#cyan-blue-logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="cyan-blue-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
          </defs>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span className="brand-logo-text">arup.dev</span>
        <span className="brand-accent-dot" />
      </div>

      <nav
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        style={{ '--nav-blur': `${navBlur}px`, backdropFilter: `blur(${navBlur}px)`, WebkitBackdropFilter: `blur(${navBlur}px)` }}
      >
        {navLinks.map(({ id, label }) => (
          <button
            key={id}
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => scrollTo(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}