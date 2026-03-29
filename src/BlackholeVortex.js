// src/BlackholeVortex.js — Realistic blackhole with real tech logos
import React, { useEffect, useRef } from 'react';

// Real tech brand colors + proper labels
const TECH = [
  { label:'React',      color:'#61DAFB', bg:'#0d1b2a' },
  { label:'Python',     color:'#3572A5', bg:'#0d1520' },
  { label:'JS',         color:'#f7df1e', bg:'#1a1800' },
  { label:'Firebase',   color:'#FFCA28', bg:'#1a1400' },
  { label:'Kotlin',     color:'#A97BFF', bg:'#150d2a' },
  { label:'Java',       color:'#ED8B00', bg:'#1a1000' },
  { label:'Node',       color:'#68A063', bg:'#0d1a0d' },
  { label:'TypeScript', color:'#3178C6', bg:'#0d1520' },
  { label:'Git',        color:'#F05032', bg:'#1a0d0a' },
  { label:'CSS',        color:'#264DE4', bg:'#0d1020' },
  { label:'HTML',       color:'#E34F26', bg:'#1a0d08' },
  { label:'AWS',        color:'#FF9900', bg:'#1a1000' },
];

export default function BlackholeVortex() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, W, H;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const cx = () => W / 2;
    const cy = () => H / 2;
    const BH_R = 44; // blackhole core radius

    // Build particles — start spread out
    const particles = TECH.map((tech, i) => {
      const angle  = (i / TECH.length) * Math.PI * 2;
      const base   = Math.min(W, H) * 0.28 + Math.random() * 60;
      return {
        ...tech,
        angle,
        baseR: base,
        r:     base,
        speed: 0.004 + Math.random() * 0.003,
        phase: 'orbit',
        suckTimer: 0,
        suckDelay: i * 60 + Math.random() * 180,
        suckDur:   55 + Math.random() * 30,
        emergeTimer: 0,
        emergeDur:   65 + Math.random() * 35,
        opacity: 1,
        sc: 1,
      };
    });

    let frame = 0;

    // Draw a single tech badge
    const drawBadge = (ctx, tech, x, y, sc, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(sc, sc);
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

      const label = tech.label;
      const fSize  = 11;
      ctx.font = `bold ${fSize}px 'Syne', monospace`;
      const tw = ctx.measureText(label).width;
      const pw = tw + 18, ph = 22;
      const rx = 6;

      // Badge background
      ctx.beginPath();
      ctx.roundRect(-pw / 2, -ph / 2, pw, ph, rx);
      ctx.fillStyle = tech.bg || 'rgba(15,10,30,0.92)';
      ctx.fill();

      // Badge border (colored)
      ctx.strokeStyle = tech.color + 'aa';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Label text
      ctx.fillStyle = tech.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, 0);

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const x0 = cx(), y0 = cy();

      // ── Blackhole glow rings ──
      const numRings = 8;
      for (let i = numRings; i >= 1; i--) {
        const rr = BH_R * (1 + i * 0.55);
        const alpha = 0.022 * i;
        ctx.beginPath();
        ctx.arc(x0, y0, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(138,92,246,${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Accretion disk — ellipse for perspective
      ctx.save();
      ctx.translate(x0, y0);
      ctx.scale(1, 0.28);
      const diskGrad = ctx.createRadialGradient(0, 0, BH_R, 0, 0, BH_R * 3.8);
      diskGrad.addColorStop(0,   'rgba(192,132,252,0.55)');
      diskGrad.addColorStop(0.3, 'rgba(138,92,246,0.3)');
      diskGrad.addColorStop(0.7, 'rgba(100,60,220,0.12)');
      diskGrad.addColorStop(1,   'rgba(138,92,246,0)');
      ctx.beginPath();
      ctx.arc(0, 0, BH_R * 3.8, 0, Math.PI * 2);
      ctx.fillStyle = diskGrad;
      ctx.fill();
      ctx.restore();

      // Spinning swirl arms
      for (let arm = 0; arm < 2; arm++) {
        ctx.save();
        ctx.translate(x0, y0);
        ctx.rotate(frame * 0.012 + arm * Math.PI);
        const sg = ctx.createLinearGradient(BH_R, 0, BH_R * 3, 0);
        sg.addColorStop(0,   'rgba(192,132,252,0.6)');
        sg.addColorStop(0.5, 'rgba(138,92,246,0.25)');
        sg.addColorStop(1,   'rgba(138,92,246,0)');
        ctx.beginPath();
        ctx.moveTo(BH_R, 0);
        ctx.bezierCurveTo(BH_R * 1.6, -BH_R * 0.7, BH_R * 2.4, -BH_R * 0.3, BH_R * 3, 0);
        ctx.strokeStyle = sg;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }

      // Core black hole
      const coreG = ctx.createRadialGradient(x0 - 8, y0 - 8, 0, x0, y0, BH_R);
      coreG.addColorStop(0,   '#000000');
      coreG.addColorStop(0.75,'#06020f');
      coreG.addColorStop(0.92,'rgba(30,10,60,0.6)');
      coreG.addColorStop(1,   'rgba(138,92,246,0)');
      ctx.beginPath();
      ctx.arc(x0, y0, BH_R, 0, Math.PI * 2);
      ctx.fillStyle = coreG;
      ctx.fill();

      // Event horizon bright ring
      const ehGrad = ctx.createRadialGradient(x0, y0, BH_R - 2, x0, y0, BH_R + 3);
      ehGrad.addColorStop(0,   'rgba(192,132,252,0.9)');
      ehGrad.addColorStop(0.5, 'rgba(138,92,246,0.5)');
      ehGrad.addColorStop(1,   'rgba(138,92,246,0)');
      ctx.beginPath();
      ctx.arc(x0, y0, BH_R, 0, Math.PI * 2);
      ctx.strokeStyle = ehGrad;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Photon ring (very tight bright)
      ctx.beginPath();
      ctx.arc(x0, y0, BH_R * 1.06, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,220,255,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Particles ──
      particles.forEach(p => {
        p.angle += p.speed;

        if (p.phase === 'orbit') {
          p.suckDelay--;
          if (p.suckDelay <= 0) { p.phase = 'suck'; p.suckTimer = 0; }
          p.opacity = 1; p.sc = 1; p.r = p.baseR;
        }

        if (p.phase === 'suck') {
          p.suckTimer++;
          const t = p.suckTimer / p.suckDur;
          const ease = t * t; // quadratic pull
          p.r       = p.baseR * (1 - ease * 0.96);
          p.opacity = 1 - ease;
          p.sc      = 1 - ease * 0.5;
          if (p.suckTimer >= p.suckDur) {
            p.phase = 'emerge';
            p.emergeTimer = 0;
            p.angle = Math.random() * Math.PI * 2;
            p.baseR = Math.min(W, H) * 0.25 + Math.random() * 70;
            p.r = BH_R;
          }
        }

        if (p.phase === 'emerge') {
          p.emergeTimer++;
          const t = p.emergeTimer / p.emergeDur;
          const ease = 1 - (1 - t) * (1 - t); // ease out
          p.r       = BH_R + (p.baseR - BH_R) * ease;
          p.opacity = ease;
          p.sc      = 0.3 + ease * 0.7;
          if (p.emergeTimer >= p.emergeDur) {
            p.phase = 'orbit';
            p.suckDelay = 200 + Math.random() * 400;
            p.r = p.baseR; p.opacity = 1; p.sc = 1;
          }
        }

        const px = x0 + Math.cos(p.angle) * p.r;
        const py = y0 + Math.sin(p.angle) * p.r;

        // Only draw if not fully inside blackhole
        if (p.r > BH_R * 0.6) {
          drawBadge(ctx, p, px, py, p.sc, p.opacity);
        }
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width:'100%', height:'100%', display:'block' }}
    />
  );
}