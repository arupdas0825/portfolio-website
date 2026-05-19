/**
 * WelcomeScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Redesigned Premium AI Developer Landing Experience.
 * Aesthetic: Apple AI Event / OpenAI Landing / Elite SaaS startup.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Compass, Download, Cpu, Activity, Shield } from 'lucide-react';

export default function WelcomeScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 3D Tilt Effect on Desktop
  const handleMouseMove = (e) => {
    if (window.innerWidth < 1025) return;
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const xVal = (clientX - width / 2) / (width / 2);
    const yVal = (clientY - height / 2) / (height / 2);
    setMousePosition({ x: xVal * 15, y: -yVal * 15 });
  };

  const handleAction = (hash) => {
    if (exiting) return;
    setExiting(true);
    
    if (hash) {
      window.location.hash = hash;
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    setTimeout(onEnter, 800);
  };

  // Safe timeout to auto-skip if a user remains completely idle for too long (18 seconds)
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      handleAction('#home');
    }, 18000);
    return () => clearTimeout(idleTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="ws-premium-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(30px)', scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
        >
          {/* Subtle grid background overlay */}
          <div className="ws-grid-overlay" aria-hidden="true" />
          
          {/* Animated Ambient Light Blobs */}
          <div className="ws-ambient-glow" aria-hidden="true" />
          <div className="ws-ambient-glow-2" aria-hidden="true" />

          {/* Premium Logo Floating Header */}
          <div className="ws-header">
            <div className="ws-header-dot" />
            <span className="ws-header-text">arup.dev • AI Core v4</span>
          </div>

          <div className="ws-container">
            
            {/* ── LEFT CONTAINER: Cinematic Typography & CTA ── */}
            <div className="ws-content">
              
              {/* Premium Staggered Fade Up Reveals */}
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="ws-badge"
              >
                <Sparkles size={12} className="ws-badge-spark" />
                <span>Next-Gen Intelligent Systems</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="ws-headline"
              >
                Building Intelligent<br />
                <span className="gradient-text">Digital Experiences</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="ws-subtext"
              >
                AI Engineer • Full Stack Developer • Creative Technologist
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="ws-desc"
              >
                Specializing in the development of sophisticated artificial intelligence integrations, 
                high-performance full-stack architectures, and hyper-optimized cinematic responsive 
                user interfaces.
              </motion.p>

              {/* Call To Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="ws-buttons-row"
              >
                <button 
                  className="ws-btn-primary" 
                  onClick={() => handleAction('#work')}
                >
                  View Projects
                  <ArrowRight size={16} />
                </button>

                <button 
                  className="ws-btn-secondary" 
                  onClick={() => handleAction('#internship')}
                >
                  <Compass size={16} />
                  Explore Experience
                </button>

                <a 
                  className="ws-btn-tertiary"
                  href="/CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    // Let the default link open resume PDF, but also skip intro smoothly
                    setTimeout(() => handleAction('#home'), 600);
                  }}
                >
                  <Download size={15} />
                  Download CV
                </a>
              </motion.div>

            </div>

            {/* ── RIGHT CONTAINER: Elite Interactive AI Centerpiece ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="ws-centerpiece"
              style={{
                transform: `rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
                transition: exiting ? 'all 0.8s ease' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {/* Holographic SaaS AI Dashboard Glass Card */}
              <div className="ws-ai-card">
                
                {/* Glass Card Header */}
                <div className="ws-card-header">
                  <div className="ws-card-title">Aivox Cognitive Engine</div>
                  <div className="ws-card-status">
                    <span className="ws-card-status-dot" />
                    ONLINE
                  </div>
                </div>

                {/* Pulsing AI Neural Core Orb Visual centerpiece */}
                <div className="ws-orb-container">
                  <div className="ws-core-glow" />
                  
                  {/* Premium Rotating SVG Mesh */}
                  <svg className="ws-svg-mesh" viewBox="0 0 200 200" fill="none">
                    {/* Ring 1 - Outer Pulsing */}
                    <circle 
                      cx="100" cy="100" r="85" 
                      stroke="rgba(138, 92, 246, 0.15)" 
                      strokeWidth="1.5" 
                      strokeDasharray="4 8" 
                      className="ws-svg-ring-1"
                    />
                    {/* Ring 2 - Inner Speed */}
                    <circle 
                      cx="100" cy="100" r="65" 
                      stroke="rgba(34, 211, 238, 0.2)" 
                      strokeWidth="1" 
                      strokeDasharray="20 4" 
                      className="ws-svg-ring-2"
                    />
                    {/* Glowing Core Orbit paths */}
                    <path 
                      d="M 50,100 A 50,30 45 0,0 150,100 A 50,30 45 0,0 50,100" 
                      stroke="url(#purpleGrad)" 
                      strokeWidth="1.5" 
                      opacity="0.4"
                    />
                    <path 
                      d="M 50,100 A 50,30 -45 0,0 150,100 A 50,30 -45 0,0 50,100" 
                      stroke="url(#cyanGrad)" 
                      strokeWidth="1.5" 
                      opacity="0.4"
                    />

                    {/* Gradients declarations */}
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8a5cf6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8a5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Floating Translucent Status Indicators */}
                <div className="ws-ai-stat-card top-right">
                  <Cpu size={12} style={{ color: '#8a5cf6' }} />
                  <span>MODEL: AIVOX-v4</span>
                </div>

                <div className="ws-ai-stat-card bottom-left">
                  <Activity size={12} style={{ color: '#22d3ee' }} />
                  <span>LATENCY: 14ms</span>
                </div>

                {/* Glass Card Footer */}
                <div className="ws-card-footer">
                  <div className="ws-card-footer-metric">
                    <span className="ws-card-footer-label">Computation</span>
                    <span className="ws-card-footer-value">GPU-ACCELERATED</span>
                  </div>
                  <div className="ws-card-footer-metric" style={{ alignItems: 'flex-end' }}>
                    <span className="ws-card-footer-label">Security</span>
                    <span className="ws-card-footer-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Shield size={11} style={{ color: '#4ade80' }} />
                      RSA-4096
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
