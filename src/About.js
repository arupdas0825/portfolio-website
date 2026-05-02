import React, { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About({ onPhotoDoubleClick }) {
  const sectionRef  = useRef(null);
  const titleRef    = useRef(null);
  const [aboutData, setAboutData] = useState(null);

  // Real-time listener from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteData', 'about'), snap => {
      if (snap.exists()) setAboutData(snap.data());
    }, () => {}); // silent fail if no Firebase config
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

  const skillGroups = [
    {
      title: 'Languages',
      tags: (aboutData?.languages || 'Python,Java,C/C++,JavaScript,SQL,Firebase').split(',').map(t => t.trim()),
    },
    {
      title: 'Specializations',
      tags: (aboutData?.specializations || 'AI / ML,Machine Learning,Mobile App Dev,React').split(',').map(t => t.trim()),
    },
    {
      title: 'Creative Tools',
      tags: (aboutData?.creativeTools || 'Premiere Pro,After Effects,Photography').split(',').map(t => t.trim()),
    },
  ];

  return (
    <section className="page-section about-section" ref={sectionRef}>
      <div className="section-inner about-inner">

        {/* Photo — wrapped with Framer Motion for parallax */}
        <motion.div className="about-img-wrap" style={{ y: photoY }}>
          <div
            className="about-photo-gradient-border"
            onDoubleClick={onPhotoDoubleClick}
            title="Double-click to open admin"
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
        </motion.div>

        {/* Content — Framer Motion whileInView entrance */}
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">— WHO AM I —</span>
          <h2 className="section-title" ref={titleRef}>About <span>Me</span></h2>
          <div className="section-line" style={{ marginLeft: 0 }} />
          <p className="section-sub about-sub">
            {bio1.includes('Artificial Intelligence')
              ? (<>{bio1.split('Artificial Intelligence and Machine Learning')[0]}<strong style={{color:'var(--purple-light)'}}>Artificial Intelligence and Machine Learning</strong>{bio1.split('Artificial Intelligence and Machine Learning')[1]}</>)
              : bio1
            }
            <br /><br />{bio2}
          </p>
          <div className="about-skills">
            {skillGroups.map(g => (
              <div className="skill-group" key={g.title}>
                <div className="skill-group-title">{g.title}</div>
                <div className="skill-tags">
                  {g.tags.filter(Boolean).map(tag => <span className="skill-tag" key={tag}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}