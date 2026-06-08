import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, Camera, Award, FileText, Mail } from 'lucide-react';

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

  // ── MOBILE NAV (Premium SaaS Redesign) ──
  if (isMobile) return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 20px)', 
      maxWidth: '480px',
      height: '62px',
      background: 'rgba(12, 12, 25, 0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(120, 180, 255, 0.18)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(120, 180, 255, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 6px',
      zIndex: 9999,
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
    }}>
      {[
        { id: 'home', label: 'Home', Icon: Home },
        { id: 'work', label: 'Work', Icon: Briefcase },
        { id: 'gallery', label: 'Photography', Icon: Camera },
        { id: 'certificates', label: 'Certificates', Icon: Award },
        { id: 'cv', label: 'CV', Icon: FileText },
        { id: 'contact', label: 'Contact', Icon: Mail },
      ].map(link => {
        const isActive = active === link.id;
        return (
          <motion.button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1.05 }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '52px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              WebkitTapHighlightColor: 'transparent',
              padding: '0 2px',
            }}
            aria-label={`Navigate to ${link.label}`}
          >
            {isActive && (
              <>
                <motion.div
                  layoutId="activePremiumIndicator"
                  style={{
                    position: 'absolute',
                    inset: '2px',
                    background: 'linear-gradient(180deg, rgba(120, 180, 255, 0.12) 0%, rgba(120, 180, 255, 0.02) 100%)',
                    borderRadius: '16px',
                    zIndex: 0,
                  }}
                  transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
                />
                <motion.div
                  animate={{
                    boxShadow: ['0 0 4px rgba(120, 180, 255, 0.2)', '0 0 12px rgba(120, 180, 255, 0.4)', '0 0 4px rgba(120, 180, 255, 0.2)']
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: '2px',
                    borderRadius: '16px',
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                />
              </>
            )}
            
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <link.Icon 
                size={19} 
                strokeWidth={isActive ? 2.5 : 1.5} 
                color={isActive ? '#78b4ff' : 'rgba(255, 255, 255, 0.5)'} 
                style={{
                  transition: 'all 0.25s ease',
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(120, 180, 255, 0.5))' : 'none',
                }}
              />
              <span style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                color: isActive ? '#78b4ff' : 'rgba(255, 255, 255, 0.5)',
                transition: 'all 0.25s ease',
                letterSpacing: '-0.3px',
                textShadow: isActive ? '0 0 8px rgba(120, 180, 255, 0.4)' : 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}>
                {link.label}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  // ── DESKTOP NAV (scroll-based blur) ──
  return (
    <>
      <div className="brand-dock" onClick={() => window.location.reload()} title="Refresh Page">
        <img 
          src="/ad logo.jpeg" 
          alt="AD Logo" 
          width={26} 
          height={26} 
          decoding="async" 
          loading="eager"
          className="brand-logo-img" 
        />
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