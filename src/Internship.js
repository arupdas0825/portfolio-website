import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Internship() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: { 
          trigger: titleRef.current, 
          start: 'top 90%', 
          once: true 
        } 
      }
    );
  }, []);

  return (
    <section id="internship" className="page-section internship-section" ref={sectionRef}>
      <div className="section-inner">
        {/* ── Header ─────────────────────────────────────────────── */}
        <span className="section-label">✦ INDUSTRY EXPERIENCE ✦</span>
        <h2 className="section-title" ref={titleRef}>
          My <span>Internship</span>
        </h2>
        <div className="section-line" />

        {/* ── Premium Placeholder Card ───────────────────────────── */}
        <motion.div 
          className="intern-placeholder-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated Background Glows */}
          <div className="intern-card-glow" />
          <div className="intern-card-glow-secondary" />

          <div className="intern-placeholder-content">
            <div className="intern-icon-wrap">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>

            <h3 className="intern-placeholder-heading">Preparing for the Next Chapter</h3>
            <p className="intern-placeholder-text">
              "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle."
            </p>
            
            <div className="intern-status-badge">
              <span className="intern-status-dot" />
              OPEN FOR OPPORTUNITIES
            </div>

            <p className="intern-placeholder-sub">
              Actively seeking internship opportunities where I can apply my skills in AI, 
              Web Development, and System Design to solve real-world challenges.
            </p>

            <div className="intern-skills-preview">
              {['AI & ML', 'Full Stack', 'Cloud Architecture', 'Problem Solving'].map(skill => (
                <span key={skill} className="intern-skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
