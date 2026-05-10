import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ALL_CERTIFICATES = [
  {
    id: 1,
    title: "“The Prompters” at TEXIBITION 2K26",
    issuer: "Brainware University Tech Club",
    date: "2026",
    image: "/certificate .jpeg",
    description: "Participated in “The Prompters” at TEXIBITION 2K26, organized by Brainware University Tech Club and Institution’s Innovation Council. Contributed innovative prompting ideas, showcased enthusiasm for AI-driven creativity, and actively engaged in collaborative tech discussions and activities.",
    tags: ["Generative AI", "Prompt Engineering", "Tech Club"],
    color: "#8a5cf6",
  }
];

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

export default function Certificates({ featuredOnly = false }) {
  const [selectedCert, setSelectedCert] = useState(null);
  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true } }
    );
  }, []);

  /* Responsive preview limits:
     Mobile (touch): show 1 card
     Desktop: show up to 4 cards */
  const MOBILE_LIMIT = 1;
  const DESKTOP_LIMIT = 4;
  const previewLimit = IS_TOUCH ? MOBILE_LIMIT : DESKTOP_LIMIT;
  
  // By default (on homepage), we use featuredOnly logic or similar
  const displayCerts = featuredOnly ? ALL_CERTIFICATES.slice(0, previewLimit) : ALL_CERTIFICATES.slice(0, previewLimit);
  const hasMore = ALL_CERTIFICATES.length > previewLimit;

  return (
    <section id="certificates" className="page-section cert-section">
      <div className="section-inner">
        {/* ── Header ─────────────────────────────────────────────── */}
        <span className="section-label">✦ CREDENTIALS & ACHIEVEMENTS ✦</span>
        <h2 className="section-title" ref={titleRef}>
          Professional <span>Certifications</span>
        </h2>
        <div className="section-line" />
        <p className="section-sub">
          Continuous learning and professional development through globally recognized certifications.
        </p>

        {/* ── Compact Grid ────────────────────────────────────────── */}
        <div className="cert-grid-compact">
          {displayCerts.map((cert, idx) => (
            <motion.div
              key={cert.id}
              className="cert-card-compact"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(138,92,246,0.2)' }}
            >
              <div className="cert-compact-img-wrap" onClick={() => setSelectedCert(cert)}>
                <img src={cert.image} alt={cert.title} className="cert-compact-img" />
                <div className="cert-preview-overlay">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </div>
              </div>

              <div className="cert-compact-info">
                <div className="cert-compact-header">
                  <h3 className="cert-compact-title">{cert.title}</h3>
                  <span className="cert-compact-date">{cert.date}</span>
                </div>
                <p className="cert-compact-issuer">{cert.issuer}</p>
                <div className="cert-compact-tags">
                  {cert.tags.map(tag => (
                    <span key={tag} className="cert-tag" style={{ color: cert.color, borderColor: `${cert.color}44`, fontSize: '0.65rem', padding: '2px 8px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="cert-compact-description">{cert.description}</p>
                <button className="cert-compact-btn" onClick={() => setSelectedCert(cert)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Certificate
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── "See More Certificates" Button ─────────────────────── */}
        {hasMore && (
          <motion.div
            className="cert-see-more-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button className="cert-see-more-btn" onClick={() => navigate('/certificates')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              See More Certificates
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Fullscreen View ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="cert-fullscreen-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className="cert-fullscreen-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cert-fullscreen-header">
                <div className="cert-fullscreen-info">
                  <h3>{selectedCert.title}</h3>
                  <p>{selectedCert.issuer} • {selectedCert.date}</p>
                </div>
                <button className="cert-back-btn" onClick={() => setSelectedCert(null)}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="cert-fullscreen-image-wrap">
                <img src={selectedCert.image} alt={selectedCert.title} className="cert-fullscreen-image" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
