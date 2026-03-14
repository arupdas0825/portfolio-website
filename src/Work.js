import React, { useEffect, useRef } from 'react';
import { LucideExternalLink, LucideGithub } from 'lucide-react';

const Work = () => {
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

  const projects = [
    {
      name: "studytra",
      desc: "Study Abroad Execution Platform for Indian students wanting to study in Germany, USA, or Canada without paying consultancies. Powered by Gemini AI — structured roadmaps, visa guidance, cost breakdowns, and timeline planning.",
      tags: ["React", "Gemini AI", "Firebase"],
      icon: "🌍",
      bgColor: "rgba(138, 92, 246, 0.1)",
      github: "https://github.com/arupdas0825",
      demo: "#"
    },
    {
      name: "localcare-finder",
      desc: "A public utility web application designed to help users quickly locate nearby healthcare services such as hospitals, pharmacies, and blood banks using location-based search.",
      tags: ["JavaScript", "Maps API", "Firebase"],
      icon: "🏥",
      bgColor: "rgba(192, 132, 252, 0.1)",
      github: "https://github.com/arupdas0825",
      demo: "#"
    },
    {
      name: "algorithm-visualizer",
      desc: "A React-based Algorithm Visualizer that animates sorting algorithms like Bubble Sort to provide an intuitive understanding of data structures and algorithm behavior through real-time visualization.",
      tags: ["React", "JavaScript", "CSS Animations"],
      icon: "📊",
      bgColor: "rgba(138, 92, 246, 0.1)",
      github: "https://github.com/arupdas0825",
      demo: "#"
    }
  ];

  return (
    <section id="work" className="page-section">
      <div className="section-inner">
        <h2 className="section-title fade-in" ref={addRef}>Featured <span>Work</span></h2>
        <div className="section-line fade-in" ref={addRef}></div>
        <p className="section-sub fade-in" ref={addRef}>
          A showcase of my recent projects demonstrating expertise in AI, full-stack development, and creative problem-solving.
        </p>

        <div className="projects-grid">
          {projects.map((proj, idx) => (
            <div key={idx} className="project-card fade-in" ref={addRef} style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="project-thumb" style={{ background: proj.bgColor }}>
                <div className="project-thumb-icon">{proj.icon}</div>
              </div>
              <div className="project-name">{proj.name}</div>
              <div className="project-desc">{proj.desc}</div>
              <div className="project-tags">
                {proj.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
              </div>
              <div className="project-links">
                <a href={proj.github} target="_blank" rel="noreferrer" className="project-link github">
                  <LucideGithub size={16} /> GitHub
                </a>
                <a href={proj.demo} target="_blank" rel="noreferrer" className="project-link demo">
                  <LucideExternalLink size={16} /> Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;