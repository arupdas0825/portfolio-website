import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LucideExternalLink, LucideCheckCircle, LucideMaximize2, LucideX } from 'lucide-react';
import ALL_CERTIFICATES from './data/certificates.json';

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

// Cyber-holographic empty state component for incoming certifications
function CertificatesEmptyState({ category }) {
  const isProfessional = category === 'Professional Experience';
  const text = isProfessional 
    ? 'Professional experience certifications coming soon.'
    : 'Industry certifications will be added soon.';
  
  const glowAccent = isProfessional ? '#ec4899' : '#00f2fe';
  const glowColor = isProfessional ? 'rgba(236, 72, 153, 0.15)' : 'rgba(0, 242, 254, 0.15)';
  const glowAccentAlpha = isProfessional ? 'rgba(236, 72, 153, 0.15)' : 'rgba(0, 242, 254, 0.15)';
  const icon = isProfessional ? '💼' : '🛡️';

  // Floating background particles
  const particles = Array.from({ length: 6 }).map((_, i) => {
    const left = `${15 + Math.random() * 70}%`;
    const delay = `${Math.random() * 4}s`;
    const driftX = `${-25 + Math.random() * 50}px`;
    return (
      <span 
        key={i} 
        className="cert-particle" 
        style={{ 
          left, 
          animationDelay: delay, 
          '--drift-x': driftX 
        }} 
      />
    );
  });

  return (
    <div 
      className="cert-empty-state-card"
      style={{ 
        '--glow-accent': glowAccent,
        '--glow-color': glowColor,
        '--glow-accent-alpha': glowAccentAlpha
      }}
    >
      {/* Laser Corner Brackets */}
      <div className="cert-cyber-bracket tl" />
      <div className="cert-cyber-bracket tr" />
      <div className="cert-cyber-bracket bl" />
      <div className="cert-cyber-bracket br" />

      {/* Cyber Glow Core */}
      <div className="cert-empty-glow-spot" />

      {/* Pulsing Hologram Base */}
      <div className="cert-empty-hologram">
        <div className="cert-hologram-ring" />
        <div className="cert-hologram-ring ring-inner" />
        <div className="cert-hologram-icon">{icon}</div>
      </div>

      {/* Category Coming Soon Text */}
      <h4 className="cert-empty-title">Coming Soon</h4>
      <p className="cert-empty-desc">{text}</p>

      {/* Ambient Float Particles */}
      {particles}
    </div>
  );
}

export default function Certificates({ featuredOnly = true }) {
  const [activeTab, setActiveTab] = useState('Academic Certifications');
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

  const categories = [
    'Academic Certifications',
    'Professional Experience',
    'Industry Certifications'
  ];

  // Helper to filter and sort certificates dynamically
  const getProcessedCertificates = () => {
    const filtered = ALL_CERTIFICATES.filter(cert => {
      const cat = cert.category || "Industry Certifications";
      return cat === activeTab;
    });

    // Dynamic sorting: priority first (smaller number = higher priority), then descending by date
    return filtered.sort((a, b) => {
      if (a.priority !== undefined && b.priority !== undefined) {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
      }
      const yearA = parseInt(a.date) || 0;
      const yearB = parseInt(b.date) || 0;
      return yearB - yearA;
    });
  };

  const processedCerts = getProcessedCertificates();
  
  // Limiter for homepage previews (responsive limits)
  const MOBILE_LIMIT = 2;
  const DESKTOP_LIMIT = 3;
  const limit = IS_TOUCH ? MOBILE_LIMIT : DESKTOP_LIMIT;
  
  const displayCerts = featuredOnly ? processedCerts.slice(0, limit) : processedCerts;
  const hasMore = featuredOnly && processedCerts.length > limit;

  return (
    <section id="certificates" className="page-section cert-section">
      <div className="section-inner">
        {/* Header */}
        <span className="section-label">✦ CREDENTIALS & ACHIEVEMENTS ✦</span>
        <h2 className="section-title" ref={titleRef}>
          Professional <span>Certifications</span>
        </h2>
        <div className="section-line" />
        <p className="section-sub">
          Continuous learning, industry credentials, and academic achievements showcased in a futuristic portfolio hub.
        </p>

        {/* Dynamic Category Tabs */}
        <div className="work-category-tabs-container">
          <div className="work-category-tabs">
            {categories.map(cat => {
              const count = ALL_CERTIFICATES.filter(c => (c.category || "Industry Certifications") === cat).length;
              return (
                <button
                  key={cat}
                  className={`work-category-tab ${activeTab === cat ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat} <span style={{ marginLeft: '6px', fontSize: '0.75rem', opacity: 0.6 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="cert-grid-compact"
            style={{ marginTop: '28px' }}
          >
            {displayCerts.length > 0 ? (
              displayCerts.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  className="cert-card-compact"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                  whileHover={{ y: -6 }}
                  style={{ 
                    border: `1.5px solid ${cert.color}22`,
                    boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
                    background: 'rgba(15, 10, 28, 0.75)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                >
                  {/* Image Section with magnifying zoom hover */}
                  <div className="cert-compact-img-wrap" onClick={() => setSelectedCert(cert)}>
                    <img src={cert.image} alt={cert.title} className="cert-compact-img" />
                    <div className="cert-preview-overlay">
                      <LucideMaximize2 size={18} />
                    </div>
                  </div>

                  {/* Card Info Content */}
                  <div className="cert-compact-info" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="cert-compact-header">
                      <h3 className="cert-compact-title">{cert.title}</h3>
                      <span className="cert-compact-date">{cert.date}</span>
                    </div>
                    <p className="cert-compact-issuer" style={{ color: cert.color }}>{cert.issuer}</p>
                    
                    {/* Tags list */}
                    <div className="cert-compact-tags">
                      {cert.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="cert-tag" 
                          style={{ 
                            color: cert.color, 
                            borderColor: `${cert.color}33`, 
                            background: `${cert.color}08`,
                            fontSize: '0.65rem', 
                            padding: '2px 8px' 
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <p className="cert-compact-description">{cert.description}</p>
                    
                    {/* Dual Action Buttons */}
                    <div className="cert-card-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px' }}>
                      <a 
                        href={cert.credentialLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="cert-compact-btn flex-1" 
                        style={{ 
                          textDecoration: 'none',
                          background: `${cert.color}15`,
                          borderColor: `${cert.color}44`,
                          color: '#fff'
                        }}
                      >
                        <LucideExternalLink size={12} style={{ marginRight: '4px' }} /> View
                      </a>
                      <a 
                        href={cert.verifyLink || cert.credentialLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="cert-compact-btn verify flex-1" 
                        style={{ 
                          textDecoration: 'none', 
                          background: 'transparent', 
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <LucideCheckCircle size={12} style={{ marginRight: '4px' }} /> Verify
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <CertificatesEmptyState category={activeTab} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Homepage See More Button */}
        {hasMore && (
          <motion.div
            className="cert-see-more-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button className="cert-see-more-btn" onClick={() => navigate('/certificates')}>
              See More Certificates
              <LucideExternalLink size={14} style={{ marginLeft: 6 }} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Zoom overlay */}
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
                  <LucideX size={20} />
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
