import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  LucideGithub, LucideX, LucideCalendar, LucideZap, 
  LucideTerminal, LucideBarChart3, LucideLayout, LucideCpu, 
  LucideWorkflow, LucideLineChart, LucideMilestone, 
  LucideCode2, LucideGlobe, LucideShieldCheck, 
  LucideTarget, LucideLightbulb, LucideLayers,
  LucideCompass, LucideCheckCircle2, LucideAlertCircle,
  LucideArrowUpRight, LucideInfo
} from 'lucide-react';
import { getProjectMetadata } from '../data/projectsData';
import './ProjectDetails.css';

/**
 * PROJECT DETAILS REBUILD (v3-PRO) - PORTAL EDITION
 */

const ProjectDetails = ({ repo, onClose }) => {
  const data = getProjectMetadata(repo);
  const scrollContainerRef = useRef(null);
  
  // 1. SCROLL LOCK SYSTEM
  useEffect(() => {
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    const originalPadding = window.getComputedStyle(document.body).paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    };
  }, []);

  // 2. KEYBOARD ACCESSIBILITY
  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  // 3. PROGRESS TRACKING
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 4. ANIMATION CONFIG
  const animConfig = {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, transition: { delay: 0.2 } }
    },
    modal: {
      initial: { y: "100%" },
      animate: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 150 } },
      exit: { y: "100%", transition: { duration: 0.4, ease: "easeInOut" } }
    },
    item: {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 }
    }
  };

  const renderTechTag = (label) => (
    <span key={label} className="pd-pro-tech-tag">{label}</span>
  );

  const modalContent = (
    <AnimatePresence>
      <motion.div 
        className="pd-pro-root"
        {...animConfig.overlay}
        onClick={onClose}
      >
        <motion.div 
          className="pd-pro-modal"
          {...animConfig.modal}
          onClick={e => e.stopPropagation()}
        >
          {/* STICKY HEADER */}
          <header className="pd-pro-header">
            <div className="pd-pro-progress-track">
              <motion.div className="pd-pro-progress-bar" style={{ scaleX }} />
            </div>
            <div className="pd-pro-header-inner">
              <div className="pd-pro-header-label">
                <LucideTerminal size={14} className="pd-pro-accent-icon" />
                <span>CASE_STUDY // {data.title}</span>
              </div>
              <button className="pd-pro-close-btn" onClick={onClose} aria-label="Close Case Study">
                <LucideX size={18} />
              </button>
            </div>
          </header>

          <div 
            className="pd-pro-scroll-container" 
            ref={scrollContainerRef}
          >
            
            {/* HERO SECTION */}
            <section className="pd-pro-hero">
              <div className="pd-pro-hero-bg">
                <div 
                  className="pd-pro-hero-image" 
                  style={{ backgroundImage: data.banner ? `url(${data.banner})` : 'none' }}
                />
                <div className="pd-pro-hero-overlay" />
              </div>

              <div className="pd-pro-hero-content">
                <motion.div className="pd-pro-badges" {...animConfig.item}>
                  <span className={`pd-pro-status pd-pro-status--${data.status.toLowerCase()}`}>
                    {data.status}
                  </span>
                  <span className="pd-pro-badge"><LucideCalendar size={12} /> {data.year}</span>
                  <span className="pd-pro-badge"><LucideCompass size={12} /> {data.timeline}</span>
                </motion.div>

                <motion.h1 className="pd-pro-title" {...animConfig.item} transition={{ delay: 0.1 }}>
                  {data.title}
                </motion.h1>

                <motion.p className="pd-pro-tagline" {...animConfig.item} transition={{ delay: 0.2 }}>
                  {data.tagline}
                </motion.p>

                <motion.div className="pd-pro-hero-actions" {...animConfig.item} transition={{ delay: 0.3 }}>
                  {data.links?.demo && (
                    <a href={data.links.demo} target="_blank" rel="noreferrer" className="pd-pro-btn-primary">
                      <LucideGlobe size={18} /> <span>Live Launch</span>
                    </a>
                  )}
                  {data.links?.github && (
                    <a href={data.links.github} target="_blank" rel="noreferrer" className="pd-pro-btn-outline">
                      <LucideGithub size={18} /> <span>Source Archive</span>
                    </a>
                  )}
                </motion.div>
              </div>
            </section>

            {/* MAIN CONTENT GRID */}
            <div className="pd-pro-body">
              <div className="pd-pro-layout-grid">
                
                {/* LEFT: PRIMARY INSIGHTS */}
                <main className="pd-pro-main">
                  
                  {/* OVERVIEW */}
                  <article className="pd-pro-section">
                    <div className="pd-pro-section-header">
                      <LucideInfo size={16} />
                      <h3>Project Overview</h3>
                    </div>
                    <p className="pd-pro-text">{data.description}</p>
                    
                    {/* FEATURES SUB-GRID */}
                    <div className="pd-pro-features-grid">
                      {data.features?.map((f, i) => (
                        <div key={i} className="pd-pro-feature-card">
                          <span className="pd-pro-feature-icon">{f.icon}</span>
                          <div>
                            <h6>{f.title}</h6>
                            <p>{f.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  {/* IMPLEMENTATION DEEP DIVE */}
                  <article className="pd-pro-section">
                    <div className="pd-pro-section-header">
                      <LucideCode2 size={16} />
                      <h3>Technical Implementation</h3>
                    </div>
                    <div className="pd-pro-stack-grid">
                      <div className="pd-pro-stack-item">
                        <LucideLayers size={16} />
                        <div>
                          <strong>Architecture</strong>
                          <p>{data.implementationDetails.architecture}</p>
                        </div>
                      </div>
                      <div className="pd-pro-stack-item">
                        <LucideWorkflow size={16} />
                        <div>
                          <strong>Workflow</strong>
                          <p>{data.implementationDetails.workflow}</p>
                        </div>
                      </div>
                      <div className="pd-pro-stack-item">
                        <LucideZap size={16} />
                        <div>
                          <strong>Performance</strong>
                          <p>{data.implementationDetails.performance}</p>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* PLANNING & STRATEGY */}
                  <article className="pd-pro-section">
                    <div className="pd-pro-section-header">
                      <LucideTarget size={16} />
                      <h3>Planning & Process</h3>
                    </div>
                    <div className="pd-pro-process-timeline">
                      <div className="pd-pro-process-item">
                        <div className="pd-pro-p-marker"><LucideLightbulb size={12} /></div>
                        <div className="pd-pro-p-content">
                          <h6>Inception & Origin</h6>
                          <p>{data.planningDetails.origin}</p>
                        </div>
                      </div>
                      <div className="pd-pro-process-item">
                        <div className="pd-pro-p-marker"><LucideShieldCheck size={12} /></div>
                        <div className="pd-pro-p-content">
                          <h6>Strategic Decisions</h6>
                          <p>{data.planningDetails.decisions}</p>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* CHALLENGES */}
                  <article className="pd-pro-section">
                    <div className="pd-pro-section-header">
                      <LucideAlertCircle size={16} />
                      <h3>Challenges & Solutions</h3>
                    </div>
                    <div className="pd-pro-challenge-card">
                      <div className="pd-pro-c-box pd-pro-c--problem">
                        <h6>Critical Obstacle</h6>
                        <p>{data.challenges?.problem}</p>
                      </div>
                      <div className="pd-pro-c-box pd-pro-c--solution">
                        <h6>Engineered Solution</h6>
                        <p>{data.challenges?.solution}</p>
                      </div>
                    </div>
                  </article>

                  {/* ROADMAP */}
                  <article className="pd-pro-section">
                    <div className="pd-pro-section-header">
                      <LucideLineChart size={16} />
                      <h3>Future Roadmap</h3>
                    </div>
                    <div className="pd-pro-roadmap-list">
                      {data.futureRoadmap.map((item, i) => (
                        <div key={i} className={`pd-pro-r-item pd-pro-r--${item.status}`}>
                          <div className="pd-pro-r-status">{item.status}</div>
                          <div>
                            <h6>{item.title}</h6>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                </main>

                {/* RIGHT: TECHNICAL SIDEBAR */}
                <aside className="pd-pro-sidebar">
                  <div className="pd-pro-sidebar-sticky">
                    
                    {/* TECH STACK BOX */}
                    <div className="pd-pro-side-box">
                      <h4 className="pd-pro-side-title">
                        <LucideTerminal size={14} /> Full Tech Stack
                      </h4>
                      <div className="pd-pro-tech-groups">
                        {data.fullStack.languages && (
                          <div className="pd-pro-tg">
                            <span>Core Logic</span>
                            <div className="pd-pro-tl">{data.fullStack.languages.map(renderTechTag)}</div>
                          </div>
                        )}
                        {(data.fullStack.frontend || data.fullStack.styling) && (
                          <div className="pd-pro-tg">
                            <span>UI Engine</span>
                            <div className="pd-pro-tl">{(data.fullStack.frontend || data.fullStack.styling).map(renderTechTag)}</div>
                          </div>
                        )}
                        {data.fullStack.threejs && (
                          <div className="pd-pro-tg">
                            <span>Visual Engine</span>
                            <div className="pd-pro-tl">{data.fullStack.threejs.map(renderTechTag)}</div>
                          </div>
                        )}
                        {data.fullStack.ai && (
                          <div className="pd-pro-tg">
                            <span>Intelligence</span>
                            <div className="pd-pro-tl">{data.fullStack.ai.map(renderTechTag)}</div>
                          </div>
                        )}
                        {data.fullStack.tools && (
                          <div className="pd-pro-tg">
                            <span>DevOps & Infrastructure</span>
                            <div className="pd-pro-tl">{data.fullStack.tools.map(renderTechTag)}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* METRICS BOX */}
                    <div className="pd-pro-side-box">
                      <h4 className="pd-pro-side-title">
                        <LucideBarChart3 size={14} /> Engineering Metrics
                      </h4>
                      <div className="pd-pro-metrics">
                        {Object.entries(data.metrics).map(([key, val], i) => (
                          <div key={i} className="pd-pro-metric">
                            <span className="pd-pro-m-key">{key}</span>
                            <span className="pd-pro-m-val">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TRUST BADGE */}
                    <div className="pd-pro-verify">
                      <LucideCheckCircle2 size={16} />
                      <span>Production Grade Architecture</span>
                    </div>

                  </div>
                </aside>
              </div>
            </div>

            {/* FOOTER / CTA */}
            <footer className="pd-pro-footer">
              <div className="pd-pro-footer-inner">
                <div className="pd-pro-footer-text">
                  <h5>End of Analysis</h5>
                  <p>Thank you for exploring this case study.</p>
                </div>
                <div className="pd-pro-footer-actions">
                  {data.links?.github && (
                    <a href={data.links.github} target="_blank" rel="noreferrer" className="pd-pro-btn-outline">
                      Explore Full Repo <LucideArrowUpRight size={14} />
                    </a>
                  )}
                  <button className="pd-pro-btn-primary" onClick={onClose}>
                    Close Case Study
                  </button>
                </div>
              </div>
            </footer>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ProjectDetails;
