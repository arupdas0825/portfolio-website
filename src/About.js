import React, { useEffect, useRef } from 'react';

const About = () => {
  const fadeRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <section id="about" className="page-section about-section">
      <div className="section-inner about-inner">
        <div className="about-img-wrap fade-in" ref={addRef}>
          <div className="photo-placeholder">
            <img 
              src="/arup.jpg" 
              alt="Arup Das" 
              className="about-photo-img" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="photo-fallback" style={{ display: 'none' }}>
              <div className="photo-emoji">🥷</div>
              <div className="photo-name-label">Arup Das</div>
              <div className="photo-subtitle-label">
                B.Tech CSE (AIML)<br/>
                Brainware University
              </div>
            </div>
          </div>
        </div>

        <div className="about-content fade-in" ref={addRef} style={{ animationDelay: '0.15s' }}>
          <h2 className="section-title" style={{ textAlign: 'left' }}>ABOUT ME</h2>
          <div className="section-line" style={{ marginLeft: '0' }}></div>
          
          <p className="section-sub" style={{ textAlign: 'left', margin: '0 0 30px', maxWidth: 'none' }}>
            I am a detail-oriented Computer Science & Engineering student at Brainware University, specialising in <strong style={{ color: 'var(--purple-light)' }}>Artificial Intelligence and Machine Learning</strong>. Based in Kolkata, I am passionate about bridging the gap between robust software architecture and intelligent system design.
            <br/><br/>
            With a strong foundation in Python, Java, C/C++, and Google Firebase, I focus on building scalable applications. My technical toolkit is complemented by a creative background in Photography and Professional Video Editing.
          </p>

          <div className="about-skills">
            <div className="skill-group">
              <div className="skill-group-title">Languages</div>
              <div className="skill-tags">
                <span className="skill-tag">Python</span>
                <span className="skill-tag">Java</span>
                <span className="skill-tag">C/C++</span>
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">SQL</span>
                <span className="skill-tag">Firebase</span>
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-group-title">Specializations</div>
              <div className="skill-tags">
                <span className="skill-tag">AI / ML</span>
                <span className="skill-tag">Machine Learning</span>
                <span className="skill-tag">Mobile App Dev</span>
                <span className="skill-tag">React</span>
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-group-title">Creative Tools</div>
              <div className="skill-tags">
                <span className="skill-tag">Premiere Pro</span>
                <span className="skill-tag">After Effects</span>
                <span className="skill-tag">Photography</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;