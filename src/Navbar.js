import React, { useState, useEffect } from 'react';

const navLinks = [
  { id:'home',      label:'Home',        icon:'🏠' },
  { id:'about',     label:'About',       icon:'👤' },
  { id:'work',      label:'Work',        icon:'💼' },
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

  // ── MOBILE NAV (Bottom Floating Dock) ──
  if (isMobile) return (
    <>
      <nav style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        background: 'rgba(20, 15, 40, 0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 24,
        border: '1px solid rgba(138, 92, 246, 0.3)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        width: 'auto', maxWidth: '90vw',
      }}>
        {/* Quick Links for Dock */}
        {[
          { id:'home',      icon:'🏠' },
          { id:'work',      icon:'💼' },
          { id:'gallery',   icon:'📷' },
          { id:'contact',   icon:'📬' },
        ].map(link => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            style={{
              width: 44, height: 44, borderRadius: 16,
              background: active === link.id ? 'rgba(138, 92, 246, 0.25)' : 'transparent',
              border: active === link.id ? '1px solid rgba(138, 92, 246, 0.4)' : '1px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, cursor: 'pointer', transition: 'all 0.2s',
              filter: active === link.id ? 'drop-shadow(0 0 8px rgba(138, 92, 246, 0.5))' : 'none',
            }}
          >
            {link.icon}
          </button>
        ))}

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

        {/* More/Menu Toggle */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            width: 44, height: 44, borderRadius: 16,
            background: menuOpen ? 'rgba(138, 92, 246, 0.25)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${menuOpen ? 'rgba(138, 92, 246, 0.4)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
            cursor: 'pointer', padding: 0, transition: 'all 0.2s',
          }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block',
              width: menuOpen ? (i === 1 ? 0 : 20) : 20,
              height: 2,
              background: menuOpen ? '#a78bfa' : 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              transition: 'all 0.25s ease',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(4px,4px)'
                : i === 2 ? 'rotate(-45deg) translate(4px,-4px)'
                : 'scaleX(0)'
                : 'none',
            }}/>
          ))}
        </button>
      </nav>

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