import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LucideExternalLink, LucideMaximize2 } from 'lucide-react';
import ALL_CERTIFICATES from './data/certificates.json';

gsap.registerPlugin(ScrollTrigger);

// Cyber-holographic empty state component for incoming certifications
function CertificatesEmptyState({ category }) {
  const isProfessional = category === 'Professional Experience';
  const isIndustry = category === 'Industry Certifications';
  
  let text = '';
  let title = 'Coming Soon';
  let icon = '💼';
  
  if (isProfessional) {
    text = 'Professional experience certifications coming soon.';
    icon = '💼';
  } else if (isIndustry) {
    title = 'System Idle / Pending';
    text = 'No Industry Certifications Available Yet';
    icon = '🛡️';
  } else {
    text = 'Academic certifications will be added soon.';
    icon = '🎓';
  }
  
  const glowAccent = isProfessional ? '#ec4899' : (isIndustry ? '#8a5cf6' : '#00f2fe');
  const glowColor = isProfessional ? 'rgba(236, 72, 153, 0.15)' : (isIndustry ? 'rgba(138, 92, 246, 0.15)' : 'rgba(0, 242, 254, 0.15)');
  const glowAccentAlpha = isProfessional ? 'rgba(236, 72, 153, 0.15)' : (isIndustry ? 'rgba(138, 92, 246, 0.15)' : 'rgba(0, 242, 254, 0.15)');

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
      <h4 className="cert-empty-title">{title}</h4>
      <p className="cert-empty-desc">{text}</p>

      {/* Ambient Float Particles */}
      {particles}
    </div>
  );
}

export default function Certificates() {
  const [activeTab, setActiveTab] = useState('Professional Experience');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const titleRef = useRef(null);
  const navigate = useNavigate();

  // Resize listener to toggle mobile/desktop mode
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Title ScrollTrigger Animation
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
  
  // Decide which certificates to display
  let displayCerts = [];
  if (isMobile) {
    displayCerts = processedCerts.slice(0, 2);
  } else {
    displayCerts = isExpanded ? processedCerts : processedCerts.slice(0, 4);
  }

  const hasMore = isMobile 
    ? processedCerts.length > 2 
    : processedCerts.length > 4;

  const handleTabChange = (cat) => {
    setActiveTab(cat);
    setIsExpanded(false);
  };

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
        <div className="cert-category-tabs-container">
          <div className="cert-category-tabs">
            {categories.map(cat => {
              const count = ALL_CERTIFICATES.filter(c => (c.category || "Industry Certifications") === cat).length;
              return (
                <button
                  key={cat}
                  className={`cert-category-tab ${activeTab === cat ? 'active' : ''}`}
                  onClick={() => handleTabChange(cat)}
                >
                  {cat} <span style={{ marginLeft: '6px', fontSize: '0.75rem', opacity: 0.6 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Cards Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`cert-grid-compact ${activeTab === 'Professional Experience' ? 'four-cols' : ''}`}
            style={{ marginTop: '28px' }}
          >
            {displayCerts.length > 0 ? (
              displayCerts.map((cert, idx) => (
                 <motion.div
                  key={cert.id}
                  layout
                  className="cert-card-compact"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: 'easeOut' }}
                  style={{ 
                    '--cert-color-22': `${cert.color}22`,
                    '--cert-color-aa': `${cert.color}aa`,
                    border: `1.5px solid ${cert.color}22`,
                    boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
                    background: 'rgba(15, 10, 28, 0.75)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                >
                  {/* Image Section */}
                  <div className="cert-compact-img-wrap" onClick={() => window.open(cert.image, "_blank", "noopener,noreferrer")}>
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      className="cert-compact-img" 
                      loading="lazy" 
                    />
                    <div className="cert-preview-overlay">
                      <LucideMaximize2 size={18} />
                    </div>
                  </div>

                  {/* Card Info Content */}
                  <div className="cert-compact-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
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
                    </div>
                    
                    {/* Action buttons and badge (2-row structure) */}
                    <div className="cert-card-footer">
                      <div className="cert-actions-row-1">
                        <button 
                          onClick={() => window.open(cert.image, "_blank", "noopener,noreferrer")}
                          className="cert-compact-btn view flex-1" 
                          style={{ 
                            background: `${cert.color}15`,
                            borderColor: `${cert.color}44`,
                            color: '#fff'
                          }}
                        >
                          <LucideMaximize2 size={12} style={{ marginRight: '4px' }} /> View
                        </button>

                        <a 
                          href={cert.verifyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cert-compact-btn cred-link flex-1" 
                          style={{ 
                            background: 'transparent', 
                            borderColor: `${cert.color}33`,
                            color: cert.color,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <LucideExternalLink size={12} style={{ marginRight: '4px' }} /> Credential Link
                        </a>
                      </div>

                      {cert.credentialId && (
                        <div 
                          className="cert-credential-badge"
                          style={{ 
                            borderColor: `${cert.color}44`,
                            color: cert.color,
                            boxShadow: `0 0 8px ${cert.color}11`
                          }}
                        >
                          <span className="cert-cred-label">Credential ID:</span>
                          <span className="cert-cred-val">{cert.credentialId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <CertificatesEmptyState category={activeTab} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Homepage Navigation / Expansion System */}
        {hasMore && (
          <motion.div
            className="cert-see-more-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isMobile ? (
              <button className="cert-see-more-btn" onClick={() => navigate('/certificates')}>
                View All Certificates
                <LucideExternalLink size={14} style={{ marginLeft: 6 }} />
              </button>
            ) : (
              <button className="cert-see-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Show Less' : 'Show More Certificates'}
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
