import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STACKS = [
  {
    category: 'FRONTEND',
    color: '#60a5fa',
    items: [
      { name: 'React',      icon: '⚛️' },
      { name: 'JavaScript', icon: '🟨' },
      { name: 'HTML',       icon: '🟧' },
      { name: 'CSS',        icon: '🟦' },
      { name: 'Tailwind',   icon: '🎨' },
    ],
  },
  {
    category: 'BACKEND',
    color: '#4ade80',
    items: [
      { name: 'Python',   icon: '🐍' },
      { name: 'Node.js',  icon: '🟩' },
      { name: 'Java',     icon: '☕' },
      { name: 'REST APIs',icon: '🔌' },
    ],
  },
  {
    category: 'DATABASE',
    color: '#fb923c',
    items: [
      { name: 'Firebase',  icon: '🔥' },
      { name: 'Supabase',  icon: '⚡' },
      { name: 'MongoDB',   icon: '🍃' },
      { name: 'SQL',       icon: '🗄️' },
    ],
  },
  {
    category: 'TOOLS & PLATFORMS',
    color: '#f472b6',
    items: [
      { name: 'Git',     icon: '🔀' },
      { name: 'GitHub',  icon: '🐙' },
      { name: 'VS Code', icon: '💙' },
      { name: 'Vercel',  icon: '▲' },
      { name: 'Netlify', icon: '🌐' },
    ],
  },
  {
    category: 'PROGRAMMING LANGUAGES',
    color: '#a78bfa',
    items: [
      { name: 'C',          icon: '🔧' },
      { name: 'C++',        icon: '⚙️' },
      { name: 'Java',       icon: '☕' },
      { name: 'Python',     icon: '🐍' },
      { name: 'JavaScript', icon: '🟨' },
      { name: 'Kotlin',     icon: '📱' },
    ],
  },
  {
    category: 'CURRENTLY EXPLORING',
    color: '#facc15',
    items: [
      { name: 'AI / ML',       icon: '🤖' },
      { name: 'System Design', icon: '🏗️' },
      { name: 'Express',       icon: '🚂' },
      { name: 'TypeScript',    icon: '🔷' },
      { name: 'Docker',        icon: '🐳' },
    ],
  },
];

/* ── Liquid Glass Panel (same as GithubStats) ── */
const Panel = ({ children, color, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4, scale: 1.015 }}
    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    style={{
      position: 'relative',
      background: 'rgba(255,255,255,0.035)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 40px rgba(0,0,0,0.3)',
      padding: '28px 24px',
      ...style,
    }}
  >
    {/* Top accent line — category colour */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      borderRadius: '20px 20px 0 0',
    }} />
    {/* Top sheen */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 1,
      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)',
      pointerEvents: 'none',
    }} />
    {children}
  </motion.div>
);

/* ── Tech chip ── */
const Chip = ({ name, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.08, y: -2 }}
    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      background: `${color}12`,
      border: `1px solid ${color}28`,
      borderRadius: 10, padding: '7px 13px',
      cursor: 'default',
      boxShadow: `0 0 0 0 ${color}00`,
      transition: 'box-shadow 0.25s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 14px ${color}30`}
    onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 0 0 ${color}00`}
  >
    <span style={{ fontSize: 15, lineHeight: 1 }}>{icon}</span>
    <span style={{
      fontFamily: 'Syne, sans-serif', fontWeight: 700,
      fontSize: 13, color: 'rgba(255,255,255,0.82)',
      letterSpacing: '0.3px',
    }}>
      {name}
    </span>
  </motion.div>
);

export default function TechStack() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);

  // GSAP ScrollTrigger on heading — use start:'top 98%' so it fires
  // as soon as the element is anywhere near the viewport.
  // rAF delay ensures layout is flushed before ScrollTrigger measures positions.
  useEffect(() => {
    if (!titleRef.current) return;
    const id = requestAnimationFrame(() => {
      gsap.fromTo(titleRef.current,
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 98%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });
    return () => {
      cancelAnimationFrame(id);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);


  return (
    <section
      id="techstack"
      ref={sectionRef}
      style={{ background: 'transparent', padding: '100px 0 80px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(138,92,246,0.07),transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(192,132,252,0.05),transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>

        {/* ── Title — portfolio heading style ── */}
        <div className="fade-in" style={{ marginBottom: 16 }}>
          <span className="section-label" style={{ textAlign:'left' }}>✦ WHAT I WORK WITH ✦</span>
          <h2 className="section-title" ref={titleRef} style={{ textAlign: 'left', marginBottom: 8 }}>
            Tech <span>Stack</span>
          </h2>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem',
            color: 'var(--text-muted)', marginBottom: 0, lineHeight: 1.7,
          }}>
            Organised by what I use them for — always learning more.
          </p>
          <div className="section-line" style={{ marginLeft: 0, marginTop: 18 }} />
        </div>

        {/* ── 2-column grid of panels ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginTop: 36,
        }}>
          {STACKS.map((stack) => (
            <Panel key={stack.category} color={stack.color}>
              {/* Category label */}
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 11, letterSpacing: '2px',
                color: stack.color,
                marginBottom: 18,
                textTransform: 'uppercase',
              }}>
                {stack.category}
              </div>

              {/* Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {stack.items.map(item => (
                  <Chip key={item.name} name={item.name} icon={item.icon} color={stack.color} />
                ))}
              </div>
            </Panel>
          ))}
        </div>

      </div>
    </section>
  );
}