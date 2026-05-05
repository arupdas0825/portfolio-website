/**
 * AIPlaybackAssistant.jsx — The main AI Playback Assistant UI
 * 
 * Features:
 * - Floating AI assistant panel (desktop)
 * - Compact playback bar (mobile)
 * - AI Orb with waveform animations
 * - Playback timeline/progress
 * - Section mini-map
 * - Floating subtitles
 * - Full playback controls
 * - Voice/speed settings
 * - Cinematic glassmorphism design
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlaybackStore from './usePlaybackStore';
import './AIPlayback.css';

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

// ── AI Orb Component ──────────────────────────────────────────────────────
function AIOrb({ isActive, isPlaying, isPaused, size = 48 }) {
  return (
    <div className={`ai-orb ${isActive ? 'ai-orb--active' : ''} ${isPlaying ? 'ai-orb--playing' : ''} ${isPaused ? 'ai-orb--paused' : ''}`}
      style={{ width: size, height: size }}
    >
      <div className="ai-orb__core" />
      <div className="ai-orb__ring ai-orb__ring--1" />
      <div className="ai-orb__ring ai-orb__ring--2" />
      <div className="ai-orb__ring ai-orb__ring--3" />
      {isPlaying && (
        <div className="ai-orb__pulse" />
      )}
    </div>
  );
}

// ── Waveform Visualizer ──────────────────────────────────────────────────
function WaveformVisualizer({ isPlaying, barCount = 24 }) {
  const bars = useMemo(() => 
    Array.from({ length: barCount }, (_, i) => ({
      delay: (i * 0.05) % 0.8,
      height: 20 + Math.random() * 60,
    })), [barCount]);

  return (
    <div className="ai-waveform">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`ai-waveform__bar ${isPlaying ? 'ai-waveform__bar--active' : ''}`}
          style={{
            animationDelay: `${bar.delay}s`,
            '--bar-height': `${bar.height}%`,
          }}
        />
      ))}
    </div>
  );
}

// ── Section Mini-Map ─────────────────────────────────────────────────────
function SectionMiniMap({ sections, currentIndex, onJump }) {
  return (
    <div className="ai-minimap">
      <div className="ai-minimap__label">SECTIONS</div>
      <div className="ai-minimap__list">
        {sections.map((section, i) => (
          <button
            key={section.id}
            className={`ai-minimap__item ${i === currentIndex ? 'ai-minimap__item--active' : ''} ${i < currentIndex ? 'ai-minimap__item--done' : ''}`}
            onClick={() => onJump(i)}
            title={section.label}
          >
            <span className="ai-minimap__icon">{section.icon}</span>
            <span className="ai-minimap__name">{section.label}</span>
            <span className="ai-minimap__indicator">
              {i < currentIndex ? '✓' : i === currentIndex ? '▶' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────────────────────
function PlaybackProgress({ progress, sections, currentIndex }) {
  return (
    <div className="ai-progress">
      <div className="ai-progress__track">
        <motion.div
          className="ai-progress__fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        {/* Section markers */}
        {sections.map((_, i) => (
          <div
            key={i}
            className={`ai-progress__marker ${i <= currentIndex ? 'ai-progress__marker--done' : ''}`}
            style={{ left: `${(i / sections.length) * 100}%` }}
          />
        ))}
      </div>
      <div className="ai-progress__labels">
        <span>{currentIndex >= 0 ? sections[currentIndex]?.label : 'Ready'}</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

// ── Speed Selector ────────────────────────────────────────────────────────
function SpeedSelector({ speed, onChangeSpeed }) {
  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
  return (
    <div className="ai-speed-selector">
      {speeds.map(s => (
        <button
          key={s}
          className={`ai-speed-btn ${speed === s ? 'ai-speed-btn--active' : ''}`}
          onClick={() => onChangeSpeed(s)}
        >
          {s}x
        </button>
      ))}
    </div>
  );
}

// ── Floating Start Button (Desktop) ───────────────────────────────────────
function StartButton({ onClick }) {
  return (
    <motion.button
      className="ai-start-btn"
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(138,92,246,0.4)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <AIOrb isActive={false} size={32} />
      <span className="ai-start-btn__text">
        <span className="ai-start-btn__label">Start AI Playback</span>
        <span className="ai-start-btn__sub">Let AI present this portfolio</span>
      </span>
      <svg className="ai-start-btn__arrow" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}

// ── Compact AI Trigger (Mobile) ───────────────────────────────────────────
function CompactTrigger({ onClick }) {
  return (
    <motion.button
      className="ai-compact-trigger"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="ai-compact-trigger__glow" />
      <div className="ai-compact-trigger__orb">
        <AIOrb isActive={false} size={36} />
      </div>
      <div className="ai-compact-trigger__pulse" />
      
      {/* Tooltip-like label */}
      <div className="ai-compact-trigger__label">
        <span>AI PLAYBACK</span>
      </div>
    </motion.button>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── DESKTOP PANEL ─────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════
function DesktopPanel({ playback }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.div
      className={`ai-panel ${isExpanded ? 'ai-panel--expanded' : 'ai-panel--collapsed'}`}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      drag={!IS_TOUCH}
      dragMomentum={false}
      dragElastic={0.1}
    >
      {/* Top Accent Line */}
      <div className="ai-panel__accent" />

      {/* Header */}
      <div className="ai-panel__header">
        <div className="ai-panel__header-left">
          <AIOrb
            isActive={playback.isActive}
            isPlaying={playback.isPlaying}
            isPaused={playback.isPaused}
            size={36}
          />
          <div className="ai-panel__title-group">
            <span className="ai-panel__title">AI Assistant</span>
            <span className="ai-panel__status">
              {playback.isPlaying ? 'Presenting...' : 
               playback.isPaused ? 'Paused' :
               playback.isTransitioning ? 'Transitioning...' : 'Ready'}
            </span>
          </div>
        </div>
        <div className="ai-panel__header-right">
          <button
            className="ai-panel__btn ai-panel__btn--settings"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <button
            className="ai-panel__btn ai-panel__btn--collapse"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isExpanded ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
            </svg>
          </button>
          <button
            className="ai-panel__btn ai-panel__btn--close"
            onClick={playback.stop}
            title="Stop Playback"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Waveform */}
      <div className="ai-panel__waveform">
        <WaveformVisualizer isPlaying={playback.isPlaying} barCount={32} />
      </div>

      {/* Progress */}
      <PlaybackProgress
        progress={playback.progress}
        sections={playback.sections}
        currentIndex={playback.currentIndex}
      />

      {/* Subtitle Area */}
      <div className="ai-panel__subtitle-area">
        <AnimatePresence mode="wait">
          {playback.subtitle && (
            <motion.div
              key={playback.subtitle.slice(0, 20)}
              className="ai-panel__subtitle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              "{playback.subtitle}"
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="ai-panel__controls">
        <button className="ai-ctrl ai-ctrl--skip" onClick={playback.skipPrev} title="Previous Section">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
        </button>

        <button
          className="ai-ctrl ai-ctrl--main"
          onClick={playback.isPlaying ? playback.pause : playback.resume}
          title={playback.isPlaying ? 'Pause' : 'Resume'}
        >
          {playback.isPlaying ? (
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        <button className="ai-ctrl ai-ctrl--skip" onClick={playback.skipNext} title="Next Section">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
        </button>

        <button
          className={`ai-ctrl ai-ctrl--mute ${playback.isMuted ? 'ai-ctrl--muted' : ''}`}
          onClick={playback.toggleMute}
          title={playback.isMuted ? 'Unmute' : 'Mute'}
        >
          {playback.isMuted ? (
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
          ) : (
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
          )}
        </button>

        <button
          className="ai-ctrl ai-ctrl--stop"
          onClick={playback.stop}
          title="Stop"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
        </button>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="ai-panel__expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  className="ai-panel__settings"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="ai-panel__setting-group">
                    <span className="ai-panel__setting-label">Speed</span>
                    <SpeedSelector speed={playback.speed} onChangeSpeed={playback.changeSpeed} />
                  </div>
                  {playback.voices.length > 0 && (
                    <div className="ai-panel__setting-group">
                      <span className="ai-panel__setting-label">Voice</span>
                      <select
                        className="ai-voice-select"
                        value={playback.selectedVoice}
                        onChange={e => playback.changeVoice(e.target.value)}
                      >
                        {playback.voices.map(v => (
                          <option key={v.name} value={v.name}>
                            {v.name.replace('Microsoft ', '').replace('Google ', '')}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section Mini-Map */}
            <SectionMiniMap
              sections={playback.sections}
              currentIndex={playback.currentIndex}
              onJump={playback.jumpToSection}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── MOBILE BAR ────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════
function MobileBar({ playback }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className={`ai-mobile ${isExpanded ? 'ai-mobile--expanded' : ''}`}
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Progress bar at top */}
      <div className="ai-mobile__progress">
        <motion.div
          className="ai-mobile__progress-fill"
          animate={{ width: `${playback.progress}%` }}
        />
      </div>

      {/* Main bar */}
      <div className="ai-mobile__bar" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="ai-mobile__left">
          <AIOrb isActive isPlaying={playback.isPlaying} size={28} />
          <div className="ai-mobile__info">
            <span className="ai-mobile__section">
              {playback.currentSection?.icon} {playback.currentSection?.label || 'AI Playback'}
            </span>
            <span className="ai-mobile__subtitle">
              {playback.subtitle ? playback.subtitle.slice(0, 40) + '...' : 'Starting...'}
            </span>
          </div>
        </div>

        <div className="ai-mobile__controls" onClick={e => e.stopPropagation()}>
          <button className="ai-mobile-ctrl" onClick={playback.skipPrev}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
          </button>
          <button className="ai-mobile-ctrl ai-mobile-ctrl--main" onClick={playback.isPlaying ? playback.pause : playback.resume}>
            {playback.isPlaying ? (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button className="ai-mobile-ctrl" onClick={playback.skipNext}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
          </button>
          <button className="ai-mobile-ctrl" onClick={playback.stop}>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
          </button>
        </div>
      </div>

      {/* Expanded view */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="ai-mobile__expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <WaveformVisualizer isPlaying={playback.isPlaying} barCount={20} />
            
            <div className="ai-mobile__subtitle-full">
              "{playback.subtitle || '...'}"
            </div>

            <div className="ai-mobile__extra-controls">
              <button
                className={`ai-mobile-ctrl ${playback.isMuted ? 'ai-ctrl--muted' : ''}`}
                onClick={playback.toggleMute}
              >
                {playback.isMuted ? '🔇' : '🔊'}
              </button>
              <SpeedSelector speed={playback.speed} onChangeSpeed={playback.changeSpeed} />
            </div>

            {/* Mobile section list */}
            <div className="ai-mobile__sections">
              {playback.sections.map((section, i) => (
                <button
                  key={section.id}
                  className={`ai-mobile__section-btn ${i === playback.currentIndex ? 'ai-mobile__section-btn--active' : ''}`}
                  onClick={() => { playback.jumpToSection(i); setIsExpanded(false); }}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Floating Subtitle Overlay ────────────────────────────────────────────
function FloatingSubtitle({ subtitle }) {
  if (!subtitle) return null;
  return (
    <motion.div
      className="ai-floating-subtitle"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="ai-floating-subtitle__inner">
        <div className="ai-floating-subtitle__icon">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <span>{subtitle}</span>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── MAIN COMPONENT ────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════
export default function AIPlaybackAssistant() {
  const playback = usePlaybackStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleStart = useCallback(() => {
    playback.start();
  }, [playback]);

  return (
    <>
      {/* Start Trigger — shown when idle */}
      <AnimatePresence>
        {!playback.isActive && (
          isMobile ? (
            <CompactTrigger onClick={handleStart} />
          ) : (
            <StartButton onClick={handleStart} />
          )
        )}
      </AnimatePresence>

      {/* Active Playback UI */}
      <AnimatePresence>
        {playback.isActive && (
          <>
            {/* Background overlay during playback */}
            <motion.div
              className="ai-playback-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Desktop: Floating Panel / Mobile: Bottom Bar */}
            {isMobile ? (
              <MobileBar playback={playback} />
            ) : (
              <DesktopPanel playback={playback} />
            )}

            {/* Floating subtitle (desktop only) */}
            {!isMobile && (
              <AnimatePresence>
                <FloatingSubtitle subtitle={playback.subtitle} />
              </AnimatePresence>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
