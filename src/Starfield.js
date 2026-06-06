import React, { useMemo, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Starfield() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();

  // Create smooth parallax layers based on absolute scroll position
  // Far layer moves slowest, near layer moves fastest
  const yFar = useTransform(scrollY, [0, 5000], [0, -150]);
  const yMid = useTransform(scrollY, [0, 5000], [0, -300]);
  const yNear = useTransform(scrollY, [0, 5000], [0, -600]);

  // Generate particles based on device performance rules
  const { farStars, midStars, nearStars } = useMemo(() => {
    // We only use this component on mobile, but just in case:
    const count = isMobile ? 15 : 15; 
    
    const generateLayer = (num, sizeRange, opacityRange) => {
      return Array.from({ length: num }, (_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * sizeRange[0] + sizeRange[1],
        opacity: Math.random() * opacityRange[0] + opacityRange[1],
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
      }));
    };

    // Distribute counts: more distant stars, fewer near stars
    return {
      farStars: generateLayer(Math.floor(count * 0.5), [1.5, 0.5], [0.15, 0.05]),
      midStars: generateLayer(Math.floor(count * 0.35), [2.5, 1], [0.3, 0.1]),
      nearStars: generateLayer(Math.floor(count * 0.15), [4, 2], [0.5, 0.2]),
    };
  }, [isMobile]);

  const renderLayer = (stars, yTransform, layerClass) => (
    <motion.div 
      className={`parallax-layer ${layerClass}`} 
      style={{ y: yTransform }}
    >
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </motion.div>
  );

  return (
    <div className="starfield">
      {/* Cinematic Ambient Lighting (GPU friendly, no blurs) */}
      <div className="ambient-light ambient-blue" />
      <div className="ambient-light ambient-cyan" />
      <div className="ambient-light ambient-purple" />
      
      {/* 3D Depth Layers */}
      {renderLayer(farStars, yFar, 'layer-far')}
      {renderLayer(midStars, yMid, 'layer-mid')}
      {renderLayer(nearStars, yNear, 'layer-near')}
    </div>
  );
}
