import React, { useEffect, useRef } from 'react';

const services = [
  {
    name: 'Web Development',
    desc: 'Building responsive, modern web applications using React, JavaScript, and Tailwind CSS with a focus on clean UI and solid engineering principles.',
    tags: ['Responsive Design', 'React', 'Performance'],
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      </svg>
    ),
  },
  {
    name: 'AI / ML Solutions',
    desc: 'Designing and implementing intelligent systems — from Gemini AI integrations to machine learning models that solve real-world problems at scale.',
    tags: ['Gemini AI', 'ML Models', 'Data Analysis'],
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
  },
  {
    name: 'Mobile App Dev',
    desc: 'Creating Android applications with Kotlin, Firebase backend, and modern UI patterns — from concept to Play Store ready.',
    tags: ['Kotlin', 'Firebase', 'Android'],
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
        <path d="M17 1H7C5.9 1 5 1.9 5 3v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 20c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5-4H7V4h10v13z" />
      </svg>
    ),
  },
  {
    name: 'Creative Direction',
    desc: 'Combining technical skills with a photographer\'s eye — UI/UX design, video editing with Premiere Pro & After Effects, and visual storytelling.',
    tags: ['Photography', 'Premiere Pro', 'After Effects'],
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.61.07-.93 0-.32-.03-.63-.07-.93l2.01-1.57c.18-.14.23-.41.12-.61l-1.9-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.8c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.01 1.57c-.04.3-.07.62-.07.93s.03.63.07.93L2.86 14.48c-.18.14-.23.41-.12.61l1.9 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.8c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.9-3.32c.12-.22.07-.47-.12-.61l-2.01-1.56z" />
      </svg>
    ),
  },
  {
    name: 'Data Analysis',
    desc: 'Turning raw data into actionable insights using Python, SQL, and machine learning techniques — from data cleaning to visualizations.',
    tags: ['Python', 'SQL', 'Visualization'],
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
  },
  {
    name: 'Backend Systems',
    desc: 'Building robust server-side logic with Java, Firebase, and REST APIs — scalable, secure, and production-ready systems for modern applications.',
    tags: ['Java', 'Firebase', 'REST APIs'],
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
        <path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.99 16.5 2 15 2c-.88 0-1.65.4-2.18 1.02L12 4.5l-.82-1.48C10.65 2.4 9.88 2 9 2 7.5 2 6 2.99 6 4.67c0 .45.11.89.18 1.33H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
];

export default function Services() {
  // ✅ No addRef — using direct observer on section children
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="page-section" ref={sectionRef}>
      <div className="section-inner">
        <h2 className="section-title fade-in">Features & <span>Services</span></h2>
        <div className="section-line fade-in" />
        <p className="section-sub fade-in">
          What I bring to the table — from intelligent systems to creative digital experiences.
        </p>

        <div className="services-grid">
          {services.map((s, i) => (
            <div
              className="service-card fade-in"
              key={s.name}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="service-icon-wrap">{s.icon}</div>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
              <div className="service-tags">
                {s.tags.map(tag => (
                  <span className="service-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}