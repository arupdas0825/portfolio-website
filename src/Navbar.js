import React, { useState, useEffect } from 'react';

const navLinks = [
  { id:'home',      label:'Home',        icon:'🏠' },
  { id:'about',     label:'About',       icon:'👤' },
  { id:'work',      label:'Work',        icon:'💼' },
  { id:'publications', label:'Publications', icon:'📚' },
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

  // ── MOBILE NAV ──
  if (isMobile) return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px',
        background: scrolled ? 'rgba(10,8,18,0.95)' : 'rgba(10,8,18,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(138,92,246,0.15)',
        transition: 'background 0.3s',
      }}>
        {/* Logo */}
        <div onClick={() => window.location.reload()} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <svg style={{ width: 22, height: 22, color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span className="nav-logo-text" style={{ fontSize: 18 }}>
            arup.dev
          </span>
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: menuOpen ? 'rgba(138,92,246,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${menuOpen ? 'rgba(138,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 10, width: 40, height: 40,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            cursor: 'pointer', padding: 0, transition: 'all 0.2s',
          }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block',
              width: menuOpen ? (i === 1 ? 0 : 22) : 22,
              height: 2,
              background: menuOpen ? '#a78bfa' : 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              transition: 'all 0.25s ease',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                : i === 2 ? 'rotate(-45deg) translate(5px,-5px)'
                : 'scaleX(0)'
                : 'none',
            }}/>
          ))}
        </button>
      </nav>

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 190,
        pointerEvents: menuOpen ? 'all' : 'none',
      }}>
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Menu panel */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '75vw', maxWidth: 280,
          height: '100%',
          background: 'rgba(12,8,24,0.98)',
          borderLeft: '1px solid rgba(138,92,246,0.25)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.34,1.2,0.64,1)',
          display: 'flex', flexDirection: 'column',
          padding: '80px 20px 40px',
          gap: 6,
        }}>
          {/* Purple top line */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#8a5cf6,#22d3ee,transparent)' }}/>

          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, letterSpacing:'2px', color:'rgba(255,255,255,0.3)', marginBottom:8 }}>
            NAVIGATE
          </div>

          {navLinks.map((link, i) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px', borderRadius: 12,
                background: active === link.id ? 'rgba(138,92,246,0.2)' : 'transparent',
                border: active === link.id ? '1px solid rgba(138,92,246,0.4)' : '1px solid transparent',
                color: active === link.id ? '#a78bfa' : 'rgba(255,255,255,0.65)',
                fontSize: 14, fontWeight: 600,
                fontFamily: "'Syne',sans-serif",
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
                transform: menuOpen ? 'translateX(0)' : 'translateX(30px)',
                opacity: menuOpen ? 1 : 0,
                transitionDelay: menuOpen ? `${i * 0.04}s` : '0s',
              }}
            >
              <span style={{ fontSize: 16 }}>{link.icon}</span>
              {link.label}
              {active === link.id && (
                <span style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#8a5cf6', boxShadow:'0 0 8px #8a5cf6' }}/>
              )}
            </button>
          ))}

          {/* Bottom */}
          <div style={{ marginTop:'auto', paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:"'Syne',sans-serif", textAlign:'center' }}>
              Arup Das · Portfolio v2.1
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ── DESKTOP NAV (scroll-based blur) ──
  return (
    <nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{ '--nav-blur': `${navBlur}px`, backdropFilter: `blur(${navBlur}px)`, WebkitBackdropFilter: `blur(${navBlur}px)` }}
    >
      <div className="nav-logo-container" onClick={() => window.location.reload()} title="Refresh Page">
        <svg className="nav-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span className="nav-logo-text">arup.dev</span>
      </div>
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
  );
}