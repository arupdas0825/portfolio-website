import React, { useEffect, useRef } from 'react';

const skillGroups = [
  { title:'Languages',       tags:['Python','Java','C/C++','JavaScript','SQL','Firebase'] },
  { title:'Specializations', tags:['AI / ML','Machine Learning','Mobile App Dev','React'] },
  { title:'Creative Tools',  tags:['Premiere Pro','After Effects','Photography'] },
];

export default function About({ onPhotoDoubleClick }) {
  const fadeRefs = useRef([]);
  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="page-section about-section">
      <div className="section-inner about-inner">

        {/* Photo with animated gradient border */}
        <div className="about-img-wrap fade-in" ref={addRef}>
          <div
            className="about-photo-gradient-border"
            onDoubleClick={onPhotoDoubleClick}
            title="Double click to open admin"
          >
            <div className="about-photo-inner">
              <img
                src="/arup.jpg"
                alt="Arup Das"
                className="about-photo-img"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
              <div className="photo-fallback" style={{ display:'none' }}>
                <span className="photo-emoji">🧑‍💻</span>
                <span className="photo-name-label">Arup Das</span>
                <span className="photo-subtitle-label">B.Tech CSE (AIML)<br/>Brainware University</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="about-content fade-in" ref={addRef} style={{ animationDelay:'0.15s' }}>
          <span className="section-label about-title">— WHO AM I —</span>
          <h2 className="section-title about-title">About <span>Me</span></h2>
          <div className="section-line" style={{ marginLeft:0 }}/>
          <p className="section-sub about-sub">
            I am a detail-oriented Computer Science & Engineering student at Brainware University,
            specialising in <strong style={{ color:'var(--purple-light)' }}>Artificial Intelligence and Machine Learning</strong>.
            Based in Kolkata, I am passionate about bridging the gap between robust software architecture
            and intelligent system design.
            <br/><br/>
            With a strong foundation in Python, Java, C/C++, and Google Firebase, I focus on building
            scalable applications. My technical toolkit is complemented by a creative background in
            Photography and Professional Video Editing.
          </p>
          <div className="about-skills">
            {skillGroups.map(group => (
              <div className="skill-group" key={group.title}>
                <div className="skill-group-title">{group.title}</div>
                <div className="skill-tags">
                  {group.tags.map(tag => <span className="skill-tag" key={tag}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}