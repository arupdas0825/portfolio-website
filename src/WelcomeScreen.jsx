/**
 * WelcomeScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium, High-Performance Cinematic Intro.
 * Aesthetic: Vercel / Linear / Apple Minimalist Luxury
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Stage 1: Wait 1.65 seconds, then initiate the graceful exit fadeout
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 1650);

    // Stage 2: Signal parent to render main portfolio instantly at 2.2 seconds
    const completeTimer = setTimeout(() => {
      onEnter();
    }, 2200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onEnter]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="ws-minimal-root"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.985
          }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
        >
          {/* Subtle Grid Backdrop Layer */}
          <div className="ws-minimal-grid" aria-hidden="true" />
          
          {/* Luxury Ambient Radial Glow Centerpiece */}
          <motion.div 
            className="ws-minimal-ambient" 
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
          />

          {/* Centered Minimal Container */}
          <div className="ws-minimal-container">
            
            {/* 1. FUTURISTIC LOGO WITH STROKE GRADIENT & GLOW */}
            <motion.div
              className="ws-logo-wrap"
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              <img 
                src="/ad-logo.jpeg" 
                alt="AD Logo" 
                className="ws-logo-icon" 
                style={{ borderRadius: '50%', objectFit: 'contain' }} 
              />
            </motion.div>

            {/* 2. ELEGANT HEADLINE */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="ws-minimal-title"
              style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              Welcome to <span className="gradient-text">My Personal Website</span>
            </motion.h1>

            {/* 3. MUTED SUBTEXT */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="ws-minimal-subtext"
              style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              Developer • AI/ML Researcher • Creator
            </motion.p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
