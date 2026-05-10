/**
 * CertificatesPage.js — /certificates route
 * Dedicated page displaying all professional certificates in a compact, responsive grid.
 * Matches existing portfolio design system (PublicationsPage.js pattern).
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

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

export default function CertificatesPage() {
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') setSelectedCert(null);
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  return (
    <div className="certpage-root" style={{ paddingBottom: IS_TOUCH ? '100px' : '0px' }}>
      <Navbar />

      {/* Back Button */}
      <button className="certpage-back" onClick={() => navigate('/')}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </button>

      {/* Header */}
      <div className="certpage-header">
        <span className="section-label">✦ CREDENTIALS & ACHIEVEMENTS ✦</span>
        <h1 className="certpage-title">Professional <span>Certifications</span></h1>
        <div className="section-line" style={{ margin: '12px auto 0' }} />
        <p className="certpage-sub">
          Continuous learning and professional development through globally recognized certifications.
        </p>
      </div>

      {/* Grid */}
      <div className="certpage-grid">
        {ALL_CERTIFICATES.map((cert, idx) => (
          <motion.div
            key={cert.id}
            className="cert-card-compact"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, type: 'spring', stiffness: 240, damping: 22 }}
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

      {/* Footer */}
      <div className="certpage-footer">
        <button className="certpage-back" onClick={() => navigate('/')} style={{ marginBottom: 0 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </button>
      </div>

      {/* ── Fullscreen Modal ── */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="cert-fullscreen-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className="cert-fullscreen-content"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
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
    </div>
  );
}
