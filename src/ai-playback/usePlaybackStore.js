/**
 * usePlaybackStore.js — Playback state management hook
 * 
 * Manages the entire AI playback lifecycle: start, pause, resume, skip,
 * previous, mute, speed, and stop. Also manages UI state like subtitles,
 * current section, and progress.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  SECTION_CONFIG,
  analyzeSection,
  SpeechEngine,
  smoothScrollToSection,
  highlightSection,
  clearHighlights,
} from './playbackEngine';

const PLAYBACK_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  TRANSITIONING: 'transitioning',
};

export default function usePlaybackStore() {
  const [state, setState] = useState(PLAYBACK_STATES.IDLE);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [subtitle, setSubtitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [sectionSummary, setSectionSummary] = useState('');
  const [isManualPause, setIsManualPause] = useState(false);

  const speechRef = useRef(null);
  const playingRef = useRef(false);
  const currentIndexRef = useRef(-1);
  const abortRef = useRef(false);
  const mutedRef = useRef(false);

  // Initialize speech engine
  useEffect(() => {
    speechRef.current = new SpeechEngine();
    
    // Load voices after a short delay (browsers need time)
    const timer = setTimeout(() => {
      if (speechRef.current) {
        const v = speechRef.current.getVoices();
        setVoices(v);
        if (speechRef.current.selectedVoice) {
          setSelectedVoice(speechRef.current.selectedVoice.name);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (speechRef.current) {
        speechRef.current.stop();
      }
      clearHighlights();
    };
  }, []);

  // Keep muted ref in sync
  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  // Update subtitle from speech boundary events
  const setupBoundaryHandler = useCallback((narrationText) => {
    if (!speechRef.current) return;

    let wordIndex = 0;
    const words = narrationText.split(' ');
    const totalWords = words.length;
    
    speechRef.current.onBoundary = (e) => {
      if (e.name === 'word') {
        wordIndex++;
        // Show last ~12 words as running subtitle
        const start = Math.max(0, wordIndex - 6);
        const end = Math.min(totalWords, wordIndex + 6);
        const visibleWords = words.slice(start, end).join(' ');
        setSubtitle(visibleWords);
        
        // Calculate progress within current section
        const sectionProgress = wordIndex / totalWords;
        const totalSections = SECTION_CONFIG.length;
        const idx = currentIndexRef.current;
        const overallProgress = ((idx + sectionProgress) / totalSections) * 100;
        setProgress(overallProgress);
      }
    };
  }, []);

  // ── Core playback for a single section ─────────────────────────────────
  const playSection = useCallback(async (index) => {
    if (abortRef.current) return;

    const section = SECTION_CONFIG[index];
    if (!section) return;

    currentIndexRef.current = index;
    setCurrentIndex(index);
    setState(PLAYBACK_STATES.TRANSITIONING);

    // Scroll to section with cinematic timing
    smoothScrollToSection(section.id);
    highlightSection(section.id);

    // Brief pause for scroll to complete
    await new Promise(r => setTimeout(r, 1200));
    if (abortRef.current) return;

    // Analyze content dynamically
    const content = analyzeSection(section.id);
    const narration = section.getNarration(content);
    setSectionSummary(narration.slice(0, 120) + '...');

    setState(PLAYBACK_STATES.PLAYING);

    if (!mutedRef.current) {
      setupBoundaryHandler(narration);
      setSubtitle(narration.split(' ').slice(0, 8).join(' '));
      await speechRef.current.speak(narration);
    } else {
      // If muted, simulate timing by showing subtitle and waiting
      setSubtitle(narration.slice(0, 80) + '...');
      const readTime = Math.max(3000, narration.length * 40); // ~40ms per char for reading
      await new Promise(r => setTimeout(r, readTime));
    }

  }, [setupBoundaryHandler]);

  // ── Start playback ──────────────────────────────────────────────────────
  const start = useCallback(async () => {
    if (playingRef.current) return;
    
    playingRef.current = true;
    abortRef.current = false;
    setState(PLAYBACK_STATES.PLAYING);

    for (let i = 0; i < SECTION_CONFIG.length; i++) {
      if (abortRef.current) break;
      
      // Wait if paused
      while (speechRef.current?.isPaused && !abortRef.current) {
        await new Promise(r => setTimeout(r, 200));
      }
      
      if (abortRef.current) break;
      
      await playSection(i);
      
      if (abortRef.current) break;

      // Transition delay between sections
      if (i < SECTION_CONFIG.length - 1) {
        setState(PLAYBACK_STATES.TRANSITIONING);
        await new Promise(r => setTimeout(r, 800));
      }
    }

    // Playback complete
    if (!abortRef.current) {
      setProgress(100);
      setSubtitle('Playback complete. Thank you for watching.');
      setTimeout(() => {
        stop();
      }, 3000);
    }
  }, [playSection]);

  // ── Stop ────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    abortRef.current = true;
    playingRef.current = false;
    if (speechRef.current) speechRef.current.stop();
    setState(PLAYBACK_STATES.IDLE);
    setCurrentIndex(-1);
    setSubtitle('');
    setProgress(0);
    setSectionSummary('');
    setIsManualPause(false);
    clearHighlights();
  }, []);

  // ── Pause ───────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    if (speechRef.current) speechRef.current.pause();
    setState(PLAYBACK_STATES.PAUSED);
    setIsManualPause(true);
  }, []);

  // ── Resume ──────────────────────────────────────────────────────────────
  const resume = useCallback(() => {
    if (speechRef.current) speechRef.current.resume();
    setState(PLAYBACK_STATES.PLAYING);
    setIsManualPause(false);
  }, []);

  // ── Skip to next section ────────────────────────────────────────────────
  const skipNext = useCallback(() => {
    if (speechRef.current) speechRef.current.stop();
    const nextIdx = Math.min(currentIndexRef.current + 1, SECTION_CONFIG.length - 1);
    setCurrentIndex(nextIdx);
    // The main loop will pick up the next section
  }, []);

  // ── Go to previous section ──────────────────────────────────────────────
  const skipPrev = useCallback(() => {
    if (speechRef.current) speechRef.current.stop();
    const prevIdx = Math.max(currentIndexRef.current - 1, 0);
    setCurrentIndex(prevIdx);
  }, []);

  // ── Jump to specific section ────────────────────────────────────────────
  const jumpToSection = useCallback(async (index) => {
    if (speechRef.current) speechRef.current.stop();
    abortRef.current = true;
    
    // Small delay then restart from this section
    await new Promise(r => setTimeout(r, 100));
    abortRef.current = false;
    playingRef.current = true;
    setState(PLAYBACK_STATES.PLAYING);

    for (let i = index; i < SECTION_CONFIG.length; i++) {
      if (abortRef.current) break;
      await playSection(i);
      if (abortRef.current) break;
      if (i < SECTION_CONFIG.length - 1) {
        setState(PLAYBACK_STATES.TRANSITIONING);
        await new Promise(r => setTimeout(r, 800));
      }
    }

    if (!abortRef.current) {
      setProgress(100);
      setTimeout(() => stop(), 3000);
    }
  }, [playSection, stop]);

  // ── Toggle mute ─────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newVal = !prev;
      if (newVal && speechRef.current) {
        speechRef.current.stop();
      }
      return newVal;
    });
  }, []);

  // ── Change speed ────────────────────────────────────────────────────────
  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    if (speechRef.current) {
      speechRef.current.setRate(newSpeed);
    }
  }, []);

  // ── Change voice ────────────────────────────────────────────────────────
  const changeVoice = useCallback((voiceName) => {
    setSelectedVoice(voiceName);
    if (speechRef.current) {
      speechRef.current.setVoice(voiceName);
    }
  }, []);

  // ── Detect manual interaction to auto-pause ────────────────────────────
  useEffect(() => {
    if (state !== PLAYBACK_STATES.PLAYING) return;

    let scrollTimeout;
    const handleScroll = () => {
      // User is manually scrolling while playing — pause
      if (playingRef.current && !isManualPause) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // Only pause if still playing and user initiated the scroll
        }, 300);
      }
    };

    // Don't add scroll listener during programmatic scrolling
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [state, isManualPause]);

  // ── Tab visibility handling ────────────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && state === PLAYBACK_STATES.PLAYING) {
        pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [state, pause]);

  return {
    // State
    state,
    currentIndex,
    currentSection: currentIndex >= 0 ? SECTION_CONFIG[currentIndex] : null,
    subtitle,
    progress,
    isMuted,
    speed,
    voices,
    selectedVoice,
    sectionSummary,
    sections: SECTION_CONFIG,
    isActive: state !== PLAYBACK_STATES.IDLE,
    isPlaying: state === PLAYBACK_STATES.PLAYING,
    isPaused: state === PLAYBACK_STATES.PAUSED,
    isTransitioning: state === PLAYBACK_STATES.TRANSITIONING,
    totalSections: SECTION_CONFIG.length,

    // Actions
    start,
    stop,
    pause,
    resume,
    skipNext,
    skipPrev,
    jumpToSection,
    toggleMute,
    changeSpeed,
    changeVoice,
  };
}
