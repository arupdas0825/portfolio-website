/**
 * WelcomeScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Professional Tech-Level Cyberpunk Intro.
 * Version: 2026.05.ENTROPY-CORE
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const AUTO_SKIP_MS = 4000;

const BOOT_LINES = [
  { text: '> INITIALIZING KERNEL [ENTROPY-CORE]...', delay: 0 },
  { text: '> LOADING NEURAL INTERFACE MODULES...', delay: 600 },
  { text: '> CONNECTING TO REMOTE FIREBASE CLUSTER...', delay: 1200 },
  { text: '> PROTOCOL: RSA-4096-AES-GCM VERIFIED', delay: 1800, highlight: true },
  { text: '> USER: ARUP DAS (ADMIN_LEVEL_0)', delay: 2400 },
  { text: '> STATUS: HANDSHAKE SUCCESSFUL', delay: 3000, highlight: true },
];

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const N = 65;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 0.8 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      o: 0.15 + Math.random() * 0.5,
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.o})`;
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

export default function WelcomeScreen({ onEnter }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [exiting, setExiting] = useState(false);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    const timers = BOOT_LINES.map(({ delay }, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), delay)
    );
    const btnTimer = setTimeout(() => setShowBtn(true), 3200);
    const autoSkip = setTimeout(() => handleEnter(), AUTO_SKIP_MS + 800);
    
    return () => { 
      timers.forEach(clearTimeout); 
      clearTimeout(btnTimer);
      clearTimeout(autoSkip);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onEnter, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="ws-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, filter: 'blur(30px)', scale: 1.1 }}
        transition={{ duration: 0.8 }}
        onMouseMove={handleMouseMove}
        onClick={showBtn ? handleEnter : undefined}
      >
        <div className="ws-grid" aria-hidden="true" />
        <div className="ws-scanlines" aria-hidden="true" />
        <ParticleCanvas />

        <motion.div 
          className="ws-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1200px' }}
        >
          {/* Futuristic Logo Mark */}
          <motion.div 
            className="ws-logo" 
            aria-hidden="true"
            style={{ transform: 'translateZ(80px)' }}
          >
            <span className="ws-logo-bracket" style={{ color: '#22d3ee' }}>{'['}</span>
            <span className="ws-logo-text" style={{ 
              background: 'linear-gradient(90deg, #a78bfa, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800
            }}>SYSTEM_ONLINE</span>
            <span className="ws-logo-bracket" style={{ color: '#22d3ee' }}>{']'}</span>
          </motion.div>

          {/* High-Fidelity Terminal */}
          <motion.div 
            className="ws-terminal" 
            role="status" 
            aria-live="polite"
            style={{ transform: 'translateZ(40px)', background: 'rgba(6, 3, 20, 0.92)' }}
          >
            <div className="mg-term-bar" style={{ padding: '8px 12px', borderBottom: '1px solid rgba(138,92,246,0.2)' }}>
              <div className="mg-term-dots">
                <span className="mg-term-dot" style={{ background: '#ff5f57', width: 8, height: 8 }} />
                <span className="mg-term-dot" style={{ background: '#febc2e', width: 8, height: 8 }} />
                <span className="mg-term-dot" style={{ background: '#28c840', width: 8, height: 8 }} />
              </div>
              <span className="mg-term-title" style={{ fontSize: 9 }}>boot_sequence.iso</span>
            </div>

            <div style={{ padding: '15px 20px' }}>
              {BOOT_LINES.map((line, i) => (
                <div
                  key={i}
                  className={`ws-line ${visibleLines.includes(i) ? 'ws-line-visible' : ''} ${line.highlight ? 'ws-line-hl' : ''}`}
                  style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}
                >
                  {line.text}
                  {i === visibleLines[visibleLines.length - 1] && (
                    <motion.span 
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="ws-cursor"
                    >
                      _
                    </motion.span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Action */}
          <motion.div 
            className={`ws-btn-wrap ${showBtn ? 'ws-btn-visible' : ''}`}
            style={{ transform: 'translateZ(60px)' }}
          >
            <button className="ws-btn" onClick={handleEnter} style={{ padding: '12px 36px' }}>
              ACCESS PORTFOLIO
              <span className="ws-btn-arrow">→</span>
            </button>
            <p className="ws-skip-hint">ENCRYPTED CONNECTION ESTABLISHED</p>
          </motion.div>
        </motion.div>

        {/* Framing Corners */}
        <div className="ws-corner ws-corner-tl" />
        <div className="ws-corner ws-corner-tr" />
        <div className="ws-corner ws-corner-bl" />
        <div className="ws-corner ws-corner-br" />
      </motion.div>
    </AnimatePresence>
  );
}
