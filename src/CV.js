import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Download, Maximize, X } from 'lucide-react';

export default function CV() {
  const fadeRefs = useRef([]);
  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  // 3D Card effect
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-150, 150], [10, -10]);
  const rotateY = useTransform(cardX, [-150, 150], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set(e.clientX - rect.left - rect.width / 2);
    cardY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  const toggleViewer = (e) => {
    e.preventDefault();
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => setZoom(1), 300); // Reset zoom after animation
  };

  return (
    <section className="page-section cv-section">
      <div className="section-inner cv-inner">
        <div className="fade-in" ref={addRef}>
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

          <div className="cv-actions centered-actions">
            <button className="btn-primary liquid-btn" onClick={toggleViewer}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              View CV
            </button>
            <a className="btn-secondary liquid-btn" href="/ARUP%20DAS%20CV.pdf" download>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Download CV
            </a>
          </div>
        </div>

        {/* 3D Premium Card */}
        <div className="cv-preview-container fade-in" ref={addRef} style={{ animationDelay: '0.15s' }}>
          <motion.div 
            className="cv-3d-card"
            style={{ rotateX, rotateY, z: 100 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="card-glass-overlay"></div>
            <div className="cv-preview-header">
              <div className="cv-preview-dots">
                <span className="dot red"/><span className="dot yellow"/><span className="dot green"/>
              </div>
              <span className="cv-preview-title">ARUP_DAS_CV.pdf</span>
            </div>
            
            <div className="cv-actual-content">
              <div className="cv-profile-header">
                <h3>ARUP DAS</h3>
                <p>AI/ML Developer</p>
              </div>
              <div className="cv-divider" />
              <div className="cv-details-grid">
                <div className="cv-detail-group">
                  <h4>University</h4>
                  <p>Brainware University, Kolkata</p>
                </div>
                <div className="cv-detail-group">
                  <h4>Core Skills</h4>
                  <div className="skill-tags">
                    <span>Python</span><span>React</span><span>Java</span><span>Firebase</span>
                  </div>
                </div>
                <div className="cv-detail-group">
                  <h4>Key Projects</h4>
                  <ul className="project-list-cv">
                    <li>EverBond Wealth</li>
                    <li>HireSight AI</li>
                    <li>StudyTra</li>
                  </ul>
                </div>
              </div>
              <div className="cv-watermark">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--purple-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Embedded PDF Viewer Modal */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div 
            className="pdf-viewer-overlay frosted-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewer}
          >
            <motion.div 
              className={`pdf-liquid-panel ${isMobile ? 'mobile-bottom-sheet' : 'desktop-glass-panel'}`}
              initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0, y: 20 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isMobile && <div className="sheet-handle" onClick={closeViewer} />}
              
              <div className="pdf-toolbar glass-toolbar">
                <div className="toolbar-left">
                  <span className="toolbar-title">ARUP DAS CV.pdf</span>
                </div>
                <div className="toolbar-center">
                  <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}><ZoomOut size={16} /></button>
                  <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}><ZoomIn size={16} /></button>
                </div>
                <div className="toolbar-right">
                  <a href="/ARUP%20DAS%20CV.pdf" download className="toolbar-btn"><Download size={16} /></a>
                  <button className="toolbar-btn close-btn" onClick={closeViewer}><X size={18} /></button>
                </div>
              </div>
              
              <div className="pdf-content-wrapper">
                <div className="pdf-scale-container" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                  <iframe 
                    src="/ARUP%20DAS%20CV.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                    title="CV PDF"
                    className="pdf-iframe"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}