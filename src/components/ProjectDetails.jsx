import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideExternalLink, LucideGithub, LucideX, 
  LucideCalendar, LucideZap, LucideTerminal, 
  LucideBarChart3, LucideAlertCircle, LucideCheckCircle2,
  LucideArrowRight
} from 'lucide-react';
import { getProjectMetadata } from '../data/projectsData';
import './ProjectDetails.css';

const ProjectDetails = ({ repo, onClose }) => {
  const data = getProjectMetadata(repo);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { y: 100, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { y: 50, opacity: 0, scale: 0.95 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="pd-overlay"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="pd-modal"
          variants={modalVariants}
          onClick={e => e.stopPropagation()}
        >
          {/* Header Controls */}
          <div className="pd-controls">
            <button className="pd-close" onClick={onClose} aria-label="Close">
              <LucideX size={20} />
            </button>
          </div>

          {/* Hero Section */}
          <section className="pd-hero">
            <div className="pd-hero-banner" style={{ 
              backgroundImage: data.banner ? `url(${data.banner})` : 'linear-gradient(135deg, var(--bg2), var(--purple-dim))'
            }}>
              <div className="pd-hero-overlay" />
            </div>
            
            <div className="pd-hero-content">
              <motion.div className="pd-hero-badges" variants={itemVariants}>
                <span className={`pd-status pd-status--${data.status.toLowerCase().replace(' ', '-')}`}>
                  {data.status}
                </span>
                <span className="pd-year">
                  <LucideCalendar size={14} /> {data.year}
                </span>
              </motion.div>
              
              <motion.h1 className="pd-title" variants={itemVariants}>
                {data.title}
              </motion.h1>
              
              <motion.p className="pd-tagline" variants={itemVariants}>
                {data.tagline}
              </motion.p>
              
              <motion.div className="pd-hero-actions" variants={itemVariants}>
                {(repo.homepage || data.homepage) && (
                  <a href={repo.homepage || data.homepage} target="_blank" rel="noreferrer" className="pd-btn pd-btn--primary">
                    <LucideExternalLink size={18} /> Live Demo
                  </a>
                )}
                <a href={repo.html_url} target="_blank" rel="noreferrer" className="pd-btn pd-btn--secondary">
                  <LucideGithub size={18} /> Source Code
                </a>
              </motion.div>
            </div>
          </section>

          <div className="pd-scroll-content">
            {/* Project Overview */}
            <section className="pd-section pd-overview">
              <motion.div variants={itemVariants}>
                <h2 className="pd-section-title">Overview</h2>
                <p className="pd-description">{data.description}</p>
              </motion.div>
            </section>

            {/* Features Grid */}
            <section className="pd-section">
              <motion.h2 className="pd-section-title" variants={itemVariants}>Key Features</motion.h2>
              <div className="pd-features-grid">
                {data.features.map((feature, i) => (
                  <motion.div 
                    key={i} 
                    className="pd-feature-card"
                    variants={itemVariants}
                    whileHover={{ y: -5, background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <span className="pd-feature-icon">{feature.icon}</span>
                    <h3 className="pd-feature-title">{feature.title}</h3>
                    <p className="pd-feature-desc">{feature.explanation}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Tech Stack */}
            <section className="pd-section">
              <motion.h2 className="pd-section-title" variants={itemVariants}>Tech Stack</motion.h2>
              <motion.div className="pd-stack-pills" variants={itemVariants}>
                {data.stack.map((tech, i) => (
                  <span key={i} className="pd-pill">{tech}</span>
                ))}
              </motion.div>
            </section>

            {/* Challenges & Solutions */}
            <section className="pd-section pd-challenges-section">
              <motion.h2 className="pd-section-title" variants={itemVariants}>Challenges & Solutions</motion.h2>
              <div className="pd-challenges-grid">
                <motion.div className="pd-challenge-box" variants={itemVariants}>
                  <div className="pd-challenge-header">
                    <LucideAlertCircle size={18} className="pd-icon-problem" />
                    <h3>The Problem</h3>
                  </div>
                  <p>{data.challenges.problem}</p>
                </motion.div>
                
                <motion.div className="pd-challenge-box" variants={itemVariants}>
                  <div className="pd-challenge-header">
                    <LucideCheckCircle2 size={18} className="pd-icon-solution" />
                    <h3>The Solution</h3>
                  </div>
                  <p>{data.challenges.solution}</p>
                </motion.div>
              </div>
              
              <motion.div className="pd-decision-box" variants={itemVariants}>
                <LucideTerminal size={18} />
                <span><strong>Technical Decision:</strong> {data.challenges.decision}</span>
              </motion.div>
            </section>

            {/* Metrics */}
            <section className="pd-section">
              <motion.h2 className="pd-section-title" variants={itemVariants}>Performance & Metrics</motion.h2>
              <div className="pd-metrics-grid">
                {Object.entries(data.metrics).map(([key, value], i) => (
                  <motion.div key={i} className="pd-metric-item" variants={itemVariants}>
                    <LucideBarChart3 size={16} />
                    <span className="pd-metric-label">{key}:</span>
                    <span className="pd-metric-value">{value}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Footer CTA */}
            <section className="pd-footer-cta">
              <motion.div className="pd-cta-box" variants={itemVariants}>
                <h3>Love this project?</h3>
                <div className="pd-cta-btns">
                  <a href={repo.html_url} target="_blank" rel="noreferrer" className="pd-btn pd-btn--github">
                    View on GitHub <LucideArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetails;
