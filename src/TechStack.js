import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STACKS = [
  {
    category: 'Languages',
    icon: '🗣️',
    color: '#3b82f6',
    items: [
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
      { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
      { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
      { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    icon: '⚒️',
    color: '#8b5cf6',
    items: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/white' },
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
      { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
      { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Vite', icon: 'https://cdn.simpleicons.org/vite/white' },
      { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    ],

    badges: [
      { name: 'PANDAS', color: '#150458' },
      { name: 'NUMPY', color: '#013243' },
      { name: 'MATPLOTLIB', color: '#11557c' },
      { name: 'SCIKIT-LEARN', color: '#f7931e' },
      { name: 'PLOTLY', color: '#3f4f75' },
    ]
  },
  {
    category: 'Databases',
    icon: '💾',
    color: '#10b981',
    items: [
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
      { name: 'Supabase', icon: 'https://cdn.simpleicons.org/supabase/white' },
      { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    icon: '🚀',
    color: '#f43f5e',
    items: [
      { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
      { name: 'Google Cloud', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/white' },
      { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
      { name: 'Blender', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg' },
      { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/white' },
      { name: 'Netlify', icon: 'https://cdn.simpleicons.org/netlify/white' },
    ],
  },

];


const TechIcon = ({ src, name }) => {
  // Only invert icons that are known to be dark by default (Devicon originals)
  // SimpleIcons are already requested as /white
  const isSimpleIcon = src.includes('simpleicons.org');
  const isDarkDevicon = !isSimpleIcon && (name.toLowerCase() === 'next.js' || name.toLowerCase() === 'vercel' || name.toLowerCase() === 'github');
  
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -5 }}
      className="tech-icon-box"
      style={{
        width: 64, height: 64,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 14,
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <img 
        src={src} 
        alt={name} 
        title={name} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          filter: isDarkDevicon ? 'brightness(0) invert(1)' : 'none'
        }} 
      />
      <div className="tech-tooltip">{name}</div>
    </motion.div>
  );
};



const TechBadge = ({ name, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    style={{
      background: color,
      color: '#fff',
      padding: '6px 12px',
      borderRadius: 4,
      fontSize: '0.65rem',
      fontWeight: 800,
      letterSpacing: '1px',
      display: 'flex', alignItems: 'center', gap: 6,
      cursor: 'default'
    }}
  >
    <span style={{ opacity: 0.7 }}>||</span> {name}
  </motion.div>
);

export default function TechStack() {
  const titleRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 90%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section id="techstack" style={{ padding: '100px 0', background: 'transparent' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        
        {/* ── Standard Portfolio Header ── */}
        <div style={{ marginBottom: 48 }}>
          <span className="section-label" style={{ textAlign: 'left' }}>✦ WHAT I WORK WITH ✦</span>
          <h2 className="section-title" ref={titleRef} style={{ textAlign: 'left', marginBottom: 12 }}>
            Technology <span>Stack</span>
          </h2>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '1rem',
            color: 'var(--text-muted)', marginBottom: 0, lineHeight: 1.7,
            maxWidth: '600px'
          }}>
            A curated list of languages, frameworks, and tools I use to build scalable, high-performance digital solutions.
          </p>
          <div className="section-line" style={{ marginLeft: 0, marginTop: 24, width: '80px' }} />
        </div>

        {/* Categories */}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
          {STACKS.map((category) => (
            <div key={category.category}>
              {/* Category Header — Portfolio Style */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{ 
                  width: 3, height: 24, 
                  background: category.color, 
                  borderRadius: 4,
                  boxShadow: `0 0 10px ${category.color}88`
                }} />
                <span style={{ fontSize: '1.6rem' }}>{category.icon}</span>
                <h3 style={{ 
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '1.25rem', 
                  fontWeight: 800, 
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#fff', 
                  margin: 0 
                }}>
                  {category.category}
                </h3>
              </div>


              {/* Icons Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, paddingLeft: 40 }}>
                {category.items.map((item) => (
                  <TechIcon key={item.name} src={item.icon} name={item.name} />
                ))}
              </div>

              {/* Badges Row (for DS/ML) */}
              {category.badges && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingLeft: 40, marginTop: 20 }}>
                  {category.badges.map((badge) => (
                    <TechBadge key={badge.name} name={badge.name} color={badge.color} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tech-icon-box:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(138,92,246,0.4) !important;
          box-shadow: 0 0 20px rgba(138,92,246,0.15);
        }
        .tech-tooltip {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #1e1b4b;
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          opacity: 0;
          pointer-events: none;
          transition: 0.2s;
          white-space: nowrap;
          z-index: 10;
        }
        .tech-icon-box:hover .tech-tooltip {
          opacity: 1;
          bottom: -25px;
        }
      `}} />
    </section>
  );
}