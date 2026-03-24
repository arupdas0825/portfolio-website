import React, { useEffect, useRef } from 'react';

export default function BlackholeVortex() {
  const vortexRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!vortexRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 to 1
      const dy = (e.clientY - cy) / cy;
      vortexRef.current.style.transform = `translate(${dx * 18}px, ${dy * 12}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="blackhole-wrapper" ref={vortexRef}>
      <div className="blackhole-ring blackhole-ring-1" />
      <div className="blackhole-ring blackhole-ring-2" />
      <div className="blackhole-ring blackhole-ring-3" />
      <div className="blackhole-core" />
      <div className="blackhole-glow" />
    </div>
  );
}
