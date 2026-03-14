import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LucideHome, LucideUser, LucideBriefcase, LucideWrench, LucideMail, LucideCamera } from 'lucide-react';

const navLinks = [
  { to: '/#home', id: 'home', label: 'Home', icon: <LucideHome /> },
  { to: '/#about', id: 'about', label: 'About', icon: <LucideUser /> },
  { to: '/#work', id: 'work', label: 'Work', icon: <LucideBriefcase /> },
  { to: '/#photography', id: 'photography', label: 'Photography', icon: <LucideCamera /> },
  { to: '/#services', id: 'services', label: 'Services', icon: <LucideWrench /> },
  { to: '/#contact', id: 'contact', label: 'Contact', icon: <LucideMail /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Scroll Spy Logic
      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPos = window.scrollY + 200;

      sections.forEach(section => {
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      {navLinks.map(({ to, id, label, icon }) => {
        const isActive = activeSection === id;
        
        return (
          <a
            key={id}
            href={to}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            {icon}
            <span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}