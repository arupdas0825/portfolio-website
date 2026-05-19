/**
 * WelcomeScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Simple, Clean, Premium, and Attractive Modern Intro Screen.
 * Aesthetic: Vercel / Linear / Apple Minimalist Luxury SaaS
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function WelcomeScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onEnter, 800);
  };

  // Safe timeout to auto-proceed after 15 seconds if untouched
  useEffect(() => {
    const timer = setTimeout(handleEnter, 15000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="ws-minimal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.03 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle Grid Backdrop Layer */}
          <div className="ws-minimal-grid" aria-hidden="true" />
          
          {/* Luxury Ambient Radial Glow Centerpiece */}
          <div className="ws-minimal-ambient" aria-hidden="true" />

          {/* Centered Minimal Container */}
          <div className="ws-minimal-container">
            
            {/* Staggered entrance animations */}
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="ws-minimal-title"
            >
              Welcome to <span className="gradient-text">My Portfolio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="ws-minimal-subtext"
            >
              AI Developer • Full Stack Engineer • Creative Technologist
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="ws-minimal-btn-wrap"
            >
              <button 
                className="ws-minimal-btn" 
                onClick={handleEnter}
                aria-label="Enter Portfolio"
              >
                <span>Enter Portfolio</span>
                <ArrowRight size={16} className="ws-btn-arrow" />
              </button>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
