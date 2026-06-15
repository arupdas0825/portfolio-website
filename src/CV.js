import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Download, X, Eye } from 'lucide-react';

import { supabase } from './supabase';

const CV = React.memo(function CV() {
  const fadeRefs = useRef([]);
  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cvInfo, setCvInfo] = useState({
    cvUrl: '/ARUP DAS CV.pdf',
    version: '1.0'
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadCv() {
      try {
        const { data, error } = await supabase.from('cv').select('*').eq('id', 1).maybeSingle();
        if (error) throw error;
        if (data) {
          setCvInfo({
            cvUrl: data.cv_file || data.cv_url || '/ARUP DAS CV.pdf',
            version: data.cv_name || data.version || '1.0'
          });
        }
      } catch (err) {
        console.error("Failed to load CV from Supabase:", err);
      }
    }
    loadCv();
  }, []);

  const toggleViewer = (e) => {
    if (e) e.preventDefault();
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => setZoom(1), 300); // Reset zoom after animation
  };

  const description = "Comprehensive curriculum vitae highlighting academic achievements, software engineering projects, technical expertise, certifications, leadership experience, and professional accomplishments. Designed to present a complete overview of my educational background, practical experience, and professional development.";
  const isLongDesc = description.length > 80;

  return (
    <section className="page-section cv-section">
      <div className="section-inner cv-inner" style={{ alignItems: 'center' }}>
        
        {/* LEFT SIDE: Heading & Stats */}
        <div className="fade-in" ref={addRef} style={{ flex: 1, paddingRight: isMobile ? 0 : '40px' }}>
          <span className="section-label">✦ PROFESSIONAL PROFILE ✦</span>
          <h2 className="section-title">Curriculum <span>Vitae</span></h2>
          <div className="section-line" />
          
          <div className="cv-stat-strip">
            <div className="stat-pill">
              <span className="stat-num">15+</span> Projects
            </div>
            <div className="stat-pill">
              <span className="stat-num">5+</span> Certifications
            </div>
            <div className="stat-pill">
              <span className="stat-num">AI/ML</span> Specialization
            </div>
          </div>

          <p className="section-sub">
            View or download my latest CV to explore my academic background,
            technical expertise, and project experience.
          </p>
        </div>

        {/* RIGHT SIDE: Premium Project-Style CV Card */}
        <div className="cv-preview-container fade-in" ref={addRef} style={{ animationDelay: '0.15s', flex: 1, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
          
          <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className={`premium-project-card ${isExpanded ? 'expanded' : ''} ${isMobile ? 'mobile-card' : ''}`}
            style={{ width: '100%', maxWidth: '520px', cursor: 'default' }}
          >
            <div className="premium-media-section" style={{ height: '260px' }}>
              <div className="premium-media-container">
                <div 
                  className="premium-image" 
                  style={{ 
                    background: `url('/cv image.png') center/cover no-repeat`,
                    height: '100%',
                    width: '100%'
                  }} 
                />
              </div>
              <div className="premium-media-gradient-overlay" />
              <div className="premium-meta-badges">
                <div className="premium-meta-badge" style={{ background: 'rgba(255,255,255,0.1)' }}>VERSION {cvInfo.version}</div>
              </div>
            </div>
            
            <div className="premium-section-divider"><div className="divider-glow-line" /></div>
            
            <div className="premium-info-section">
              <div className="premium-info-header" style={{ paddingBottom: '0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Brainware University</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI/ML Specialization • 2028 Graduate</span>
                </div>
              </div>
              
              <div className="premium-desc-wrapper">
                <motion.div layout="position" animate={{ height: isExpanded ? 'auto' : '42px' }} className="premium-desc-anim-container">
                  <p className={`premium-desc-text ${isExpanded ? 'expanded' : 'collapsed'}`}>{description}</p>
                </motion.div>
                {isLongDesc && (
                  <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="premium-showmore-btn">
                    {isExpanded ? 'SHOW LESS' : 'SHOW MORE'}
                  </button>
                )}
              </div>
              
              <div className="premium-actions-footer" onClick={e => e.stopPropagation()}>
                <button onClick={toggleViewer} className="premium-action-link github" style={{ border: 'none', cursor: 'pointer', flex: isMobile ? '1' : 'initial', justifyContent: 'center' }}>
                  <Eye size={13} /> VIEW CV
                </button>
                <a href={cvInfo.cvUrl} download className="premium-action-link demo" style={{ flex: isMobile ? '1' : 'initial', justifyContent: 'center' }}>
                  <Download size={13} /> DOWNLOAD
                </a>
              </div>
            </div>
            
            <div className="premium-card-ambient-glow" />
          </motion.div>
        </div>
      </div>

      {/* Embedded PDF Viewer Modal (Premium Liquid Glass) */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div 
            className="pdf-viewer-overlay frosted-blur"
            style={{ 
              background: 'rgba(5, 5, 8, 0.85)', 
              backdropFilter: 'blur(24px)', 
              WebkitBackdropFilter: 'blur(24px)' 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={closeViewer}
          >
            <motion.div 
              className={`pdf-liquid-panel ${isMobile ? 'mobile-bottom-sheet' : 'desktop-glass-panel'}`}
              initial={{ scale: 0.98, opacity: 0, y: isMobile ? '100%' : 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: isMobile ? '100%' : 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {isMobile && <div className="sheet-handle" onClick={closeViewer} />}
              
              <div className="pdf-toolbar glass-toolbar" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="toolbar-left">
                  <span className="toolbar-title" style={{ color: '#fff', fontWeight: 600 }}>{cvInfo.cvUrl.substring(cvInfo.cvUrl.lastIndexOf('/') + 1) || 'ARUP_DAS_CV.pdf'}</span>
                </div>
                <div className="toolbar-center">
                  <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}><ZoomOut size={16} /></button>
                  <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}><ZoomIn size={16} /></button>
                </div>
                <div className="toolbar-right">
                  <a href={cvInfo.cvUrl} download className="toolbar-btn"><Download size={16} /></a>
                  <button className="toolbar-btn close-btn" onClick={closeViewer}><X size={18} /></button>
                </div>
              </div>
              
              <div className="pdf-content-wrapper" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="pdf-scale-container" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                  <iframe 
                    src={`${cvInfo.cvUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                    title="CV PDF"
                    className="pdf-iframe"
                    style={{ background: 'transparent' }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default CV;