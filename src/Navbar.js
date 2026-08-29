import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Briefcase, Camera, Award, FileText, Mail, BookOpen } from 'lucide-react';

const navLinks = [
  { id: 'home',         label: 'Home',         icon: '🏠' },
  { id: 'about',        label: 'About',        icon: '👤' },
  { id: 'work',         label: 'Work',         icon: '💼' },
  { id: 'internship',   label: 'Internship',   icon: '🚀' },
  { id: 'publications', label: 'Publications', icon: '📚' },
  { id: 'certificates', label: 'Certificates', icon: '📜' },
  { id: 'blogs',        label: 'Blogs',        icon: '✍️' },
  { id: 'gallery',      label: 'Photography',  icon: '📷' },
  { id: 'services',     label: 'Services',     icon: '⚙️' },
  { id: 'cv',           label: 'CV',           icon: '📄' },
  { id: 'contact',      label: 'Contact',      icon: '📬' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled]   = useState(false);
  const [active, setActive]       = useState('home');
  const [menuOpen, setMenuOpen]   = useState(false);
  const [navBlur, setNavBlur]     = useState(8);

  const isBlogsRoute = location.pathname.startsWith('/blog');

  useEffect(() => {
    if (isBlogsRoute) {
      setActive('blogs');
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setNavBlur(window.scrollY > 50 ? 20 : 8);
      const sections = navLinks
        .filter(l => l.id !== 'blogs' && l.id !== 'blog')
        .map(l => document.getElementById(l.id))
        .filter(Boolean);

      let current = 'home';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlogsRoute, location.pathname]);

  const handleNavClick = (id) => {
    setMenuOpen(false);

    if (id === 'blogs' || id === 'blog') {
      navigate('/blogs');
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
          width: '88vw',
          maxWidth: '430px',
          height: '65px',
          background: 'rgba(10, 8, 20, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(138, 92, 246, 0.25)',
          borderRadius: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(138, 92, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 12px',
          zIndex: 9999,
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
        }}>
          {[
            { id: 'home', label: 'Home', Icon: Home },
            { id: 'work', label: 'Work', Icon: Briefcase },
            { id: 'blogs', label: 'Blogs', Icon: BookOpen },
            { id: 'gallery', label: 'Photography', Icon: Camera },
            { id: 'certificates', label: 'Certificates', Icon: Award },
            { id: 'cv', label: 'CV', Icon: FileText },
            { id: 'contact', label: 'Contact', Icon: Mail },
          ].map(link => {
            const isActive = active === link.id || (link.id === 'blogs' && isBlogsRoute);
            return (
              <motion.button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
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
                    size={20} 
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
        <div
          className="brand-dock"
          onClick={() => {
            if (location.pathname !== '/') {
              navigate('/');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          title="Home"
          style={{ cursor: 'pointer' }}
        >
          <img 
            src="/ad-logo.jpeg" 
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
          {navLinks.map(({ id, label }) => {
            const isActive = active === id || (id === 'blogs' && isBlogsRoute);
            return (
              <button
                key={id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(id)}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}