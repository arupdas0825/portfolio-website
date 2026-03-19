import React, { useState, useEffect } from 'react';

const navLinks = [
  {
    id: 'home', label: 'Home',
    icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
  },
  {
    id: 'about', label: 'About',
    icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" /></svg>
  },
  {
    id: 'work', label: 'Work',
    icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.99 16.5 2 15 2c-.88 0-1.65.4-2.18 1.02L12 4.5l-.82-1.48C10.65 2.4 9.88 2 9 2 7.5 2 6 2.99 6 4.67 6 5.12 6.11 5.56 6.18 6H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" /></svg>
  },
  {
    id: 'gallery', label: 'Photography',
    icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M12 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5m-7 5.5H3v-1h2V7l1.5-2h11L19 7v4.5h2v1h-2V17l-1.5 2H6.5L5 17v-4.5z" /></svg>
  },
  {
    id: 'services', label: 'Services',
    icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>
  },
  {
    id: 'cv', label: 'CV',
    icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" /></svg>
  },
  {
    id: 'contact', label: 'Contact',
    icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean);
      let current = 'home';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
          current = sec.id;
        }
      });
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      {navLinks.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`nav-item ${active === id ? 'active' : ''}`}
          onClick={() => scrollTo(id)}
        >
          {icon}
          {label}
        </button>
      ))}
    </nav>
  );
}