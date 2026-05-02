/**
 * MaintenanceGate.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * ╔══════════════════════════════════════════════════════╗
 * ║  TOGGLE:  Set MAINTENANCE_MODE = false to disable.   ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Bypass options:
 *   • Click  "Bypass & Enter →" button
 *   • Press  Enter  |  Ctrl+Shift+A
 *   • Click the hidden status dot (top-right corner)
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useRef, useState } from 'react';

// ── MASTER TOGGLE ─────────────────────────────────────────
export const MAINTENANCE_MODE = false;
// ──────────────────────────────────────────────────────────

const STATUS_LINES = [
  { text: '> Checking server status...', delay: 0 },
  { text: '> Build version: 2025.05.dev', delay: 500 },
  { text: '> Maintenance mode: ENABLED', delay: 1000, warn: true },
  { text: '> Estimated downtime: unknown', delay: 1500 },
  { text: '> Contact: arupdas0825@github', delay: 2000 },
];

export default function MaintenanceGate({ onBypass }) {
  const [lines, setLines]       = useState([]);
  const [showBypass, setShowBypass] = useState(false);
  const [exiting, setExiting]   = useState(false);
  const dotRef                  = useRef(null);

  /* Reveal status lines */
  useEffect(() => {
    const timers = STATUS_LINES.map(({ delay }, i) =>
      setTimeout(() => setLines(prev => [...prev, i]), delay)
    );
    const bypassTimer = setTimeout(() => setShowBypass(true), 2400);
    return () => { timers.forEach(clearTimeout); clearTimeout(bypassTimer); };
  }, []);

  /* Keyboard bypass: Enter or Ctrl+Shift+A */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') handleBypass();
      if (e.ctrlKey && e.shiftKey && e.key === 'A') handleBypass();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting]);

  const handleBypass = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onBypass, 550);
  };

  return (
    <div className={`mg-root ${exiting ? 'mg-exit' : 'mg-enter'}`}>
      <div className="ws-grid"      aria-hidden="true" />
      <div className="ws-scanlines" aria-hidden="true" />

      {/* Hidden bypass dot — top-right corner */}
      <button
        ref={dotRef}
        className="mg-secret-dot"
        onClick={handleBypass}
        aria-label="Hidden bypass (click to enter)"
        title=""
      />

      <div className="mg-center">
        {/* Status icon */}
        <div className="mg-icon" aria-hidden="true">
          <div className="mg-icon-ring" />
          <div className="mg-icon-inner">⚙</div>
        </div>

        <h1 className="mg-title">System Status</h1>
        <p  className="mg-subtitle">Maintenance Mode Active</p>

        {/* Terminal box */}
        <div className="mg-terminal" role="status" aria-live="polite">
          <div className="mg-term-bar">
            <span className="mg-term-dot" style={{ background:'#ff5f57' }} />
            <span className="mg-term-dot" style={{ background:'#febc2e' }} />
            <span className="mg-term-dot" style={{ background:'#28c840' }} />
            <span className="mg-term-title">system-status.sh</span>
          </div>
          <div className="mg-term-body">
            {STATUS_LINES.map((line, i) => (
              <div
                key={i}
                className={`mg-line ${lines.includes(i) ? 'mg-line-visible' : ''} ${line.warn ? 'mg-line-warn' : ''}`}
              >
                {line.text}
                {i === lines[lines.length - 1] && (
                  <span className="ws-cursor" aria-hidden="true">_</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bypass button */}
        <div className={`mg-btn-wrap ${showBypass ? 'mg-btn-visible' : ''}`}>
          <button className="mg-bypass-btn" onClick={handleBypass}>
            Bypass &amp; Enter
            <span className="ws-btn-arrow">→</span>
          </button>
          <p className="ws-skip-hint">
            or press <kbd>Enter</kbd> / <kbd>Ctrl+Shift+A</kbd>
          </p>
        </div>
      </div>

      {/* Corners */}
      <div className="ws-corner ws-corner-tl" aria-hidden="true" />
      <div className="ws-corner ws-corner-tr" aria-hidden="true" />
      <div className="ws-corner ws-corner-bl" aria-hidden="true" />
      <div className="ws-corner ws-corner-br" aria-hidden="true" />
    </div>
  );
}
