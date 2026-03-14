import React, { useEffect, useRef } from 'react';

export default function CV() {
  const fadeRefs = useRef([]);
  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="page-section cv-section">
      <div className="section-inner cv-inner">
        <div className="fade-in" ref={addRef}>
          <h2 className="section-title">Curriculum <span>Vitae</span></h2>
          <div className="section-line" />
          <p className="section-sub">
            View or download my latest CV to explore my academic background,
            technical expertise, and project experience.
          </p>

          <div className="cv-actions">
            <a className="btn-primary" href="/CV.pdf" target="_blank" rel="noreferrer">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              View CV
            </a>
            <a className="btn-secondary" href="/CV.pdf" download>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Download CV
            </a>
          </div>
        </div>

        {/* CV Preview Card */}
        <div className="cv-preview fade-in" ref={addRef} style={{ animationDelay: '0.15s' }}>
          <div className="cv-preview-header">
            <div className="cv-preview-dots">
              <span /><span /><span />
            </div>
            <span className="cv-preview-title">Arup_Das_CV.pdf</span>
          </div>
          <div className="cv-preview-body">
            <div className="cv-preview-name">Arup Das</div>
            <div className="cv-preview-role">B.Tech CSE (AIML) · AI/ML Developer</div>
            <div className="cv-divider" />
            <div className="cv-section-row">
              <span className="cv-section-label">Education</span>
              <span className="cv-section-val">Brainware University, Kolkata</span>
            </div>
            <div className="cv-section-row">
              <span className="cv-section-label">Focus</span>
              <span className="cv-section-val">Artificial Intelligence & Machine Learning</span>
            </div>
            <div className="cv-section-row">
              <span className="cv-section-label">Skills</span>
              <span className="cv-section-val">Python · Java · React · Firebase · C/C++</span>
            </div>
            <div className="cv-section-row">
              <span className="cv-section-label">Creative</span>
              <span className="cv-section-val">Photography · Premiere Pro · After Effects</span>
            </div>
            <div className="cv-divider" />
            <div className="cv-blur-rows">
              <div className="cv-blur-line" style={{ width: '80%' }} />
              <div className="cv-blur-line" style={{ width: '60%' }} />
              <div className="cv-blur-line" style={{ width: '70%' }} />
              <div className="cv-blur-line" style={{ width: '50%' }} />
            </div>
            <div className="cv-preview-cta">Open full PDF to read more →</div>
          </div>
        </div>
      </div>
    </section>
  );
}