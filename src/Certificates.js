import React, { useState, useEffect, useRef } from 'react';
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

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true } }
    );
  }, []);

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

        {/* ── Grid ───────────────────────────────────────────────── */}
        <div className="cert-grid">
          {ALL_CERTIFICATES.map((cert, idx) => (
            <motion.div
              key={cert.id}
              className="cert-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="cert-image-container" onClick={() => setSelectedCert(cert)}>
                <img src={cert.image} alt={cert.title} className="cert-image" />
                <div className="cert-image-overlay">
                  <div className="cert-expand-icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                    <span>View Fullscreen</span>
                  </div>
                </div>
              </div>

              <div className="cert-info">
                <div className="cert-header">
                  <h3 className="cert-title">{cert.title}</h3>
                  <span className="cert-date">{cert.date}</span>
                </div>
                <p className="cert-issuer">{cert.issuer}</p>
                <div className="cert-tags">
                  {cert.tags.map(tag => (
                    <span key={tag} className="cert-tag" style={{ color: cert.color, borderColor: `${cert.color}44` }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="cert-description">{cert.description}</p>
                <button className="cert-preview-btn" onClick={() => setSelectedCert(cert)}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  Preview Certificate
                </button>
              </div>
            </motion.div>
          ))}
        </div>
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
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back
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
