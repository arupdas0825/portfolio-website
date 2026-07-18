import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideArrowLeft, LucideExternalLink, LucideMaximize2 } from 'lucide-react';
import Navbar from './Navbar';
import { CERTIFICATES_DUMP } from './data/certificatesDump';
import { ScrollAnimatedSection } from './components/ScrollAnimatedSection';

// Helper to assign vibrant brand colors based on issuer
const getColorForIssuer = (issuer) => {
  if (!issuer) return '#3b82f6';
  const name = issuer.toLowerCase();
  if (name.includes('google')) return '#4285f4';
  if (name.includes('aws') || name.includes('amazon')) return '#ff9900';
  if (name.includes('ibm')) return '#0f62fe';
  if (name.includes('microsoft')) return '#00a4ef';
  if (name.includes('anthropic')) return '#e0b880';
  if (name.includes('freecodecamp')) return '#198754';
  if (name.includes('coursera')) return '#0056d2';
  
  // Consistent color based on name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 75%, 60%)`;
};


const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

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

export default function CertificatesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Professional Experience');
  const [certificatesList, setCertificatesList] = useState([]);

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  // Load certificates from local dump
  useEffect(() => {
    const data = CERTIFICATES_DUMP;
    if (data) {
      const mapped = data
        .filter(c => c.title) // filter out invalid null entries
        .map(c => {
          const link = c.credential_id || c.credential_url || '#';
          return {
            id: c.id,
            title: c.title,
            issuer: c.issuer,
            date: c.year || '',
            image: c.image || c.image_url || '/certificate-fallback.png',
            verifyLink: link,
            tags: c.tags ? c.tags.split(',').map(t => t.trim()) : [],
            category: c.category || 'Academic Certifications',
            color: getColorForIssuer(c.issuer),
            priority: c.display_order !== null && c.display_order !== undefined ? c.display_order : 999,
            credentialId: (() => {
              if (link === '#') return null;
              if (link.includes('credential/') || link.includes('credential.net/')) {
                return link.substring(link.lastIndexOf('/') + 1).split('?')[0];
              }
              if (link.includes('verify.skilljar.com/c/')) {
                return link.substring(link.lastIndexOf('/') + 1).split('?')[0];
              }
              if (link.includes('freecodecamp.org/certification/')) {
                const parts = link.split('/');
                const username = parts[parts.indexOf('certification') + 1];
                const certName = parts[parts.indexOf('certification') + 2];
                if (username && certName) {
                  const shortName = certName.includes('responsive-web-design') ? 'rwdv9' : certName;
                  return `${username}-${shortName}`;
                }
              }
              if (c.title && c.title.includes('TEXIBITION')) {
                return 'BWU-TEX-2026';
              }
              if (c.title && c.title.includes('Class Representative')) {
                return 'BWU/BTA/24/641';
              }
              return null;
            })()
          };
        });
      setCertificatesList(mapped);
    }
  }, []);

  const categories = [
    'Academic Certifications',
    'Professional Experience',
    'Industry Certifications'
  ];

  // Filter and sort certificates for the active tab
  const getProcessedCertificates = () => {
    const filtered = certificatesList.filter(cert => {
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
        <h1 className="certpage-title">All <span>Certifications</span></h1>
        <div className="section-line" style={{ margin: '12px auto 0' }} />
        <p className="certpage-sub">
          Professional, Academic and Industry Credentials
        </p>
      </div>

      {/* Category Navigation Tabs */}
      <div className="cert-category-tabs-container" style={{ maxWidth: '1200px', margin: '0 auto 12px' }}>
        <div className="cert-category-tabs" style={{ margin: '0 auto' }}>
          {categories.map(cat => {
            const count = certificatesList.filter(c => (c.category || "Industry Certifications") === cat).length;
            return (
              <button
                key={cat}
                className={`cert-category-tab ${activeTab === cat ? 'active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat} <span style={{ marginLeft: '6px', fontSize: '0.75rem', opacity: 0.6 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Grid */}
      <ScrollAnimatedSection intensity="strong">
        <div className="certpage-inner" style={{ padding: '0 24px 80px', maxWidth: '1440px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="cert-grid-page"
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
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            window.open(cert.image, "_blank", "noopener,noreferrer");
                          }}
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
                          onClick={(e) => e.stopPropagation()}
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

        <div className="certpage-footer" style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}>
          <button className="certpage-back" onClick={() => navigate('/#certificates')} style={{ marginBottom: 0 }}>
            <LucideArrowLeft size={16} style={{ marginRight: '8px' }} />
            Back to Home
          </button>
        </div>
      </div>
      </ScrollAnimatedSection>
    </div>
  );
}
