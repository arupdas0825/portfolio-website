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
  const [navBlur, setNavBlur]     = useState(8);

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
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @media (max-width: 1023px) {
          .desktop-nav-wrapper { display: none !important; }
        }
        @media (min-width: 1024px) {
          .mobile-nav-wrapper { display: none !important; }
        }
      `}</style>

      {/* ── MOBILE NAV (Premium SaaS Redesign) ── */}
      <div className="mobile-nav-wrapper">
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          maxWidth: '400px',
          height: '65px',
          background: 'rgba(10, 8, 20, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(138, 92, 246, 0.25)',
          borderRadius: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(138, 92, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
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
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '45px',
              height: '45px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              WebkitTapHighlightColor: 'transparent',
            }}
            aria-label={`Navigate to ${link.label}`}
          >
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <link.Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 1.5} 
                color={isActive ? '#a78bfa' : 'rgba(255, 255, 255, 0.5)'} 
                style={{
                  transition: 'all 0.3s ease',
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.6))' : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                }}
              />
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#00f2fe',
                    position: 'absolute',
                    bottom: '-8px',
                    boxShadow: '0 0 8px #00f2fe'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </div>
          </motion.button>
        );
      })}
        </div>
      </div>

      {/* ── DESKTOP NAV (scroll-based blur) ── */}
      <div className="desktop-nav-wrapper">
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
      </div>
    </>
  );
}