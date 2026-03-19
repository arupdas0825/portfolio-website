import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LucideHome, LucideUser, LucideBriefcase, LucideWrench, LucideMail, LucideCamera } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { to: '/#home', id: 'home', label: 'Home', icon: <LucideHome size={18} /> },
  { to: '/#about', id: 'about', label: 'About', icon: <LucideUser size={18} /> },
  { to: '/#work', id: 'work', label: 'Work', icon: <LucideBriefcase size={18} /> },
  { to: '/#photography', id: 'photography', label: 'Photography', icon: <LucideCamera size={18} /> },
  { to: '/#services', id: 'services', label: 'Services', icon: <LucideWrench size={18} /> },
  { to: '/#contact', id: 'contact', label: 'Contact', icon: <LucideMail size={18} /> },
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
    <nav className={`navbar transition-all duration-500 ${scrolled ? 'navbar-scrolled' : ''}`}>
      {navLinks.map(({ to, id, label, icon }) => {
        const isActive = activeSection === id;
        
        return (
          <a
            key={id}
            href={to}
            className={`nav-item relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-purple-600/80 shadow-[0_0_20px_rgba(147,51,234,0.5)] rounded-full z-0"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {icon}
              <span className="hidden md:block">{label}</span>
            </span>
          </a>
        );
      })}
    </nav>
  );
}