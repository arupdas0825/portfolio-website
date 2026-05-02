import React, { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About({ onPhotoDoubleClick }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [aboutData, setAboutData] = useState(null);

  // Real-time listener from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteData', 'about'), snap => {
      if (snap.exists()) setAboutData(snap.data());
    }, () => { }); // silent fail if no Firebase config
    return unsub;
  }, []);

  // ── GSAP ScrollTrigger on section heading ──────────────────────────────
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  // ── Framer Motion scroll parallax on photo ─────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Bio from Firestore or fallback
  const bio1 = aboutData?.bio1 || 'I am a detail-oriented Computer Science & Engineering student at Brainware University, specialising in Artificial Intelligence and Machine Learning. Based in Kolkata, I am passionate about bridging the gap between robust software architecture and intelligent system design.';
  const bio2 = aboutData?.bio2 || 'With a strong foundation in Python, Java, C/C++, and Google Firebase, I focus on building scalable applications. My technical toolkit is complemented by a creative background in Photography and Professional Video Editing.';
  const photoUrl = aboutData?.photoUrl || '/arup.jpg';



  const tiltX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(y * -12); // Rotate around X-axis based on Y mouse position
    tiltY.set(x * 12);  // Rotate around Y-axis based on X mouse position
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section 
      className="page-section about-section" 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ background: 'transparent', overflow: 'visible' }}
    >

      <div className="section-inner about-inner" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
        
        {/* Photo — wrapped with Framer Motion for parallax & 3D Tilt */}
        <motion.div 
          className="about-img-wrap" 
          style={{ 
            y: photoY,
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d'
          }}
        >
          <div
            className="about-photo-gradient-border"
            onDoubleClick={onPhotoDoubleClick}
            title="Double-click to open admin"
            style={{ transform: 'translateZ(50px)' }}
          >
            <div className="about-photo-inner">
              <img
                src={photoUrl}
                alt="Arup Das"
                className="about-photo-img"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/arup.jpg';
                }}
              />
            </div>
          </div>
          {/* Backdrop depth glow */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            background: 'radial-gradient(circle, var(--purple-dim) 0%, transparent 70%)',
            zIndex: -1,
            transform: 'translateZ(-20px)',
            opacity: 0.5
          }} />
        </motion.div>

        {/* Content — Framer Motion whileInView entrance + 3D Tilt */}
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid rgba(138, 92, 246, 0.2)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ transform: 'translateZ(40px)' }}>
            <span className="section-label">— WHO AM I —</span>
            <h2 className="section-title" ref={titleRef}>About <span>Me</span></h2>
            <div className="section-line" style={{ marginLeft: 0 }} />
            <p className="section-sub about-sub">
              {bio1.includes('Artificial Intelligence')
                ? (<>{bio1.split('Artificial Intelligence and Machine Learning')[0]}<strong style={{ color: 'var(--purple-light)' }}>Artificial Intelligence and Machine Learning</strong>{bio1.split('Artificial Intelligence and Machine Learning')[1]}</>)
                : bio1
              }
              <br /><br />{bio2}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}