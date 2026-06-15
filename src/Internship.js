import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from './supabase';
import { LucideExternalLink, LucideMapPin, LucideCalendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Internship() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [internships, setInternships] = useState([]);

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

  // Fetch internships from Supabase
  useEffect(() => {
    async function loadInternships() {
      try {
        const { data, error } = await supabase.from('internships').select('*').order('display_order', { ascending: true });
        if (error) throw error;
        setInternships(data || []);
      } catch (err) {
        console.error("Failed to load internships from Supabase:", err);
      }
    }
    loadInternships();
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

        {/* ── Content ───────────────────────────────────────────── */}
        {internships.length > 0 ? (
          <div className="intern-grid" style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '800px', margin: '40px auto 0' }}>
            {internships.map((intern, idx) => (
              <motion.div 
                key={intern.id}
                className="intern-placeholder-card"
                style={{ textAlign: 'left', cursor: 'default' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
              >
                <div className="intern-card-glow" />
                <div className="intern-card-glow-secondary" />

                <div className="intern-placeholder-content" style={{ padding: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h3 className="intern-placeholder-heading" style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'Syne, sans-serif' }}>{intern.role}</h3>
                      <p style={{ color: 'var(--purple-light)', fontSize: '1.05rem', fontWeight: 'bold', margin: '6px 0 12px', fontFamily: 'Syne, sans-serif' }}>{intern.company}</p>
                    </div>
                    {intern.certificate_url && (
                      <a 
                        href={intern.certificate_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="intern-status-badge"
                        style={{ textDecoration: 'none', background: 'rgba(138, 92, 246, 0.1)', borderColor: 'rgba(138, 92, 246, 0.3)', color: '#a78bfa', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        Certificate <LucideExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '0.85rem', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {intern.location && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LucideMapPin size={14} /> {intern.location}</span>}
                    {intern.duration && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LucideCalendar size={14} /> {intern.duration}</span>}
                  </div>

                  <p className="intern-placeholder-text" style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                    {intern.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Premium Placeholder Card */
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
        )}
      </div>
    </section>
  );
}

