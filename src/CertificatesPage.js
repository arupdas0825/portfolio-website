import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideArrowLeft, LucideExternalLink, LucideCheckCircle, LucideMaximize2, LucideX } from 'lucide-react';
import Navbar from './Navbar';
import ALL_CERTIFICATES from './data/certificates.json';

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

export default function CertificatesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Academic Certifications');
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') setSelectedCert(null);
  }, []);
  
  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  const categories = [
    'Academic Certifications',
    'Professional Experience',
    'Industry Certifications'
  ];

  // Filter and sort certificates for the active tab
  const getProcessedCertificates = () => {
    const filtered = ALL_CERTIFICATES.filter(cert => {
      const cat = cert.category || "Industry Certifications";
      return cat === activeTab;
    });

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

  return (
    <div className="certpage-root" style={{ paddingBottom: IS_TOUCH ? '100px' : '0px', minHeight: '100vh', background: '#04020a', position: 'relative' }}>
      <Navbar />

      {/* Back Button */}
      <button className="certpage-back" onClick={() => navigate('/#certificates')}>
        <LucideArrowLeft size={16} style={{ marginRight: '8px' }} />
        Back to Home
      </button>

      {/* Header */}
      <div className="certpage-header" style={{ padding: '40px 16px 20px' }}>
        <span className="section-label">✦ CREDENTIALS ARCHIVE ✦</span>
        <h1 className="certpage-title">Professional <span>Certifications</span></h1>
        <div className="section-line" style={{ margin: '12px auto 0' }} />
        <p className="certpage-sub">
          A dynamic showcase of globally recognized cloud certs, hackathons, and software engineering training.
        </p>
      </div>

      {/* Category Navigation Tabs */}
      <div className="work-category-tabs-container fade-in" style={{ maxWidth: '1200px', margin: '0 auto 12px' }}>
        <div className="work-category-tabs" style={{ margin: '0 auto' }}>
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

      {/* Dynamic Grid */}
      <div className="certpage-inner" style={{ padding: '0 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
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
            {processedCerts.length > 0 ? (
              processedCerts.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  className="cert-card-compact"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, type: 'spring', stiffness: 240, damping: 22 }}
                  whileHover={{ y: -6 }}
                  style={{ 
                    border: `1.5px solid ${cert.color}22`,
                    boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
                    background: 'rgba(15, 10, 28, 0.75)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                >
                  <div className="cert-compact-img-wrap" onClick={() => setSelectedCert(cert)}>
                    <img src={cert.image} alt={cert.title} className="cert-compact-img" />
                    <div className="cert-preview-overlay">
                      <LucideMaximize2 size={18} />
                    </div>
                  </div>

                  <div className="cert-compact-info" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="cert-compact-header">
                      <h3 className="cert-compact-title">{cert.title}</h3>
                      <span className="cert-compact-date">{cert.date}</span>
                    </div>
                    <p className="cert-compact-issuer" style={{ color: cert.color }}>{cert.issuer}</p>
                    
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
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', width: '100%', padding: '48px 0' }}>
                No certifications found in this category.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="certpage-footer" style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}>
          <button className="certpage-back" onClick={() => navigate('/#certificates')} style={{ marginBottom: 0 }}>
            <LucideArrowLeft size={16} style={{ marginRight: '8px' }} />
            Back to Home
          </button>
        </div>
      </div>

      {/* Fullscreen Modal zoom */}
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
    </div>
  );
}
