import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import usePlaybackStore from '../ai-playback/usePlaybackStore';
import '../ai-playback/AIPlayback.css';

export default function AIPlaybackButton({ onClick }) {
  const playback = usePlaybackStore();

  const handleStart = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      playback.start();
    }
  };

  return (
    <motion.button
      onClick={handleStart}
      className="ai-premium-trigger group fixed z-[100] flex items-center justify-center transition-all duration-300
                 bottom-6 right-6 md:bottom-auto md:top-5 md:right-6 lg:right-10
                 w-[46px] h-[46px] md:w-auto md:h-auto
                 p-0 md:py-2 md:px-4 lg:py-2.5 lg:px-5
                 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0812]"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 15 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      aria-label="Start AI Playback"
    >
      {/* Subtle Premium WebKit Mask Shimmer Border */}
      <div className="ai-premium-trigger-shimmer" />

      {/* Expanding Soft Radial Neon Glow */}
      <div className="ai-premium-trigger-glow" />

      {/* Circular Glowing Play Icon Container */}
      <div className="ai-play-icon-container">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut"
          }}
          className="relative z-10 flex items-center justify-center pl-[1px]"
        >
          <Play 
            size={11} 
            className="text-white fill-white transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110 drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]"
          />
        </motion.div>
      </div>

      {/* Single-line Premium Typography (hidden on mobile, clean medium text on desktop/tablet) */}
      <span className="hidden md:inline-block pl-2.5 relative z-10 select-none font-sans font-semibold text-[13px] lg:text-[14px] tracking-[0.3px] text-white/90 group-hover:text-white transition-colors duration-300">
        Start AI Playback
      </span>
    </motion.button>
  );
}
