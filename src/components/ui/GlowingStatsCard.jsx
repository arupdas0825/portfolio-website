import React, { useState, useEffect } from 'react';
import { animate } from 'framer-motion';
import { Flame } from 'lucide-react';
import './GlowingStatsCard.css';

// Performance-optimized memoized counting animation component
const AnimatedValue = React.memo(({ value, duration = 1.5 }) => {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    if (value === null || value === undefined) return;
    
    // Smooth counting animation from 0 to the fetched value
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayVal(Math.floor(v)),
    });
    
    return () => controls.stop();
  }, [value, duration]);

  if (value === null || value === undefined) {
    return (
      <span style={{ display: 'inline-block', opacity: 0.35 }} className="animate-pulse">
        ...
      </span>
    );
  }

  return <span>{displayVal}</span>;
});

AnimatedValue.displayName = 'AnimatedValue';

// Reusable premium glowing card component for statistics
const GlowingStatsCard = React.memo(({
  icon: Icon,
  label,
  value,
  color,
  glowColor,
  isStreak = false
}) => {
  // Show special fire icon when streak is > 0
  const showFlame = isStreak && value > 0;

  const styleVariables = {
    '--card-accent-color': color,
    '--card-glow-color': glowColor,
  };

  return (
    <div className="glowing-stats-card-wrapper" style={styleVariables}>
      {/* Outer animated gradient border boundary */}
      <div className="glowing-stats-card-border" />
      
      {/* Inner floating glow shadow */}
      <div className="glowing-stats-card-glow" />
      
      {/* Card Content Panel */}
      <div className="glowing-stats-card">
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          marginBottom: 12,
          background: showFlame ? 'rgba(249, 115, 22, 0.12)' : `${color}12`,
          border: `1px solid ${showFlame ? 'rgba(249, 115, 22, 0.25)' : `${color}25`}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.3s ease'
        }}>
          {showFlame ? (
            <Flame size={20} className="flame-icon-anim" />
          ) : (
            Icon && <Icon size={18} style={{ color }} />
          )}
        </div>

        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 24,
          color: '#fff',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <AnimatedValue value={value} />
          {isStreak && value > 0 && (
            <span style={{ 
              fontSize: 12, 
              fontWeight: 700, 
              color: 'rgba(255,255,255,0.5)', 
              marginLeft: 4,
              fontFamily: 'Syne, sans-serif'
            }}>
              Days
            </span>
          )}
        </div>

        <div style={{
          fontSize: 11,
          color: 'rgba(255, 255, 255, 0.35)',
          marginTop: 8,
          fontFamily: 'Syne, sans-serif',
          letterSpacing: '0.4px',
          textTransform: 'uppercase'
        }}>
          {label}
        </div>
      </div>
    </div>
  );
});

GlowingStatsCard.displayName = 'GlowingStatsCard';

export default GlowingStatsCard;
