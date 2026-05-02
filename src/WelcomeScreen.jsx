/**
 * WelcomeScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Cyberpunk / hacker intro — CSS-only animations, zero WebGL.
 * Auto-skips after AUTO_SKIP_MS, or user clicks "Enter Portfolio →".
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useRef, useState } from 'react';

const AUTO_SKIP_MS = 3200;

const BOOT_LINES = [
  { text: '> Initializing system...', delay: 0 },
  { text: '> Loading AI modules...', delay: 620 },
  { text: '> Authenticating user...', delay: 1240 },
  { text: '> Welcome, Arup Das', delay: 1920, highlight: true },
];

/* ── Tiny canvas particle field — drawn once, very lightweight ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const N = 55;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 0.8 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      o: 0.2 + Math.random() * 0.45,
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
  const [showBtn, setShowBtn]           = useState(false);
  const [exiting, setExiting]           = useState(false);

  /* Reveal lines one by one */
  useEffect(() => {
    const timers = BOOT_LINES.map(({ delay }, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), delay)
    );
    const btnTimer = setTimeout(() => setShowBtn(true), 2200);
    return () => { timers.forEach(clearTimeout); clearTimeout(btnTimer); };
  }, []);

  /* Auto skip */
  useEffect(() => {
    const id = setTimeout(() => handleEnter(), AUTO_SKIP_MS + 400);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onEnter, 550);
  };

  return (
    <div
      className={`ws-root ${exiting ? 'ws-exit' : 'ws-enter'}`}
      onClick={showBtn ? handleEnter : undefined}
      aria-label="Welcome intro screen"
    >
      {/* ── Animated grid background ── */}
      <div className="ws-grid" aria-hidden="true" />

      {/* ── Scanlines overlay ── */}
      <div className="ws-scanlines" aria-hidden="true" />

      {/* ── Particles ── */}
      <ParticleCanvas />

      {/* ── Centre content ── */}
      <div className="ws-center" onClick={e => e.stopPropagation()}>
        {/* Logo / brand mark */}
        <div className="ws-logo" aria-hidden="true">
          <span className="ws-logo-bracket">{'<'}</span>
          <span className="ws-logo-text">AD</span>
          <span className="ws-logo-bracket">{'/>'}</span>
        </div>

        {/* Terminal boot lines */}
        <div className="ws-terminal" role="status" aria-live="polite">
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className={`ws-line ${visibleLines.includes(i) ? 'ws-line-visible' : ''} ${line.highlight ? 'ws-line-hl' : ''}`}
            >
              {line.text}
              {i === visibleLines[visibleLines.length - 1] && (
                <span className="ws-cursor" aria-hidden="true">_</span>
              )}
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div className={`ws-btn-wrap ${showBtn ? 'ws-btn-visible' : ''}`}>
          <button className="ws-btn" onClick={handleEnter}>
            Enter Portfolio
            <span className="ws-btn-arrow">→</span>
          </button>
          <p className="ws-skip-hint">or wait to auto-enter</p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="ws-corner ws-corner-tl" aria-hidden="true" />
      <div className="ws-corner ws-corner-tr" aria-hidden="true" />
      <div className="ws-corner ws-corner-bl" aria-hidden="true" />
      <div className="ws-corner ws-corner-br" aria-hidden="true" />
    </div>
  );
}
