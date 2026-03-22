import React, { useEffect, useRef } from 'react';

const services = [
  {
    name: 'Web Development',
    desc: 'Building responsive, modern web applications using React, JavaScript, and Tailwind CSS with a focus on clean UI and solid engineering principles.',
    color: '#60a5fa',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l-3 3 3 3m4.5-6l3 3-3 3M13.5 6l-3 12"/>
      </svg>
    ),
  },
  {
    name: 'AI / ML Solutions',
    desc: 'Designing and implementing intelligent systems — from Gemini AI integrations to machine learning models that solve real-world problems at scale.',
    color: '#c084fc',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
      </svg>
    ),
  },
  {
    name: 'Mobile App Dev',
    desc: 'Creating Android applications with Kotlin, Firebase backend, and modern UI patterns — from concept to Play Store ready.',
    color: '#f472b6',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>
      </svg>
    ),
  },
  {
    name: 'Creative Direction',
    desc: "Combining technical skills with a photographer's eye — UI/UX design, video editing with Premiere Pro & After Effects, and visual storytelling.",
    color: '#2dd4bf',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/>
      </svg>
    ),
  },
  {
    name: 'Data Analysis',
    desc: 'Turning raw data into actionable insights using Python, SQL, and machine learning techniques — from data cleaning to advanced visualizations and reports.',
    color: '#4ade80',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
      </svg>
    ),
  },
  {
    name: 'Backend Systems',
    desc: 'Building robust server-side logic with Java, Firebase, and REST APIs — scalable, secure, and production-ready systems for modern web applications.',
    color: '#f87171',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
      </svg>
    ),
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    if (sectionRef.current)
      sectionRef.current.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    const glow = card.querySelector('.svc-glow');
    if (glow) { glow.style.left = x + 'px'; glow.style.top = y + 'px'; glow.style.opacity = '1'; }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    const glow = e.currentTarget.querySelector('.svc-glow');
    if (glow) glow.style.opacity = '0';
  };

  return (
    <section id="services" className="page-section" ref={sectionRef}>
      <div className="section-inner">
        <span className="section-label fade-in">✦ WHAT I OFFER ✦</span>
        <h2 className="section-title fade-in">Features & <span>Services</span></h2>
        <div className="section-line fade-in" />
        <p className="section-sub fade-in">
          What I bring to the table — from intelligent systems to creative digital experiences.
        </p>

        <div className="svc-grid">
          {services.map((service, i) => (
            <div
              key={service.name}
              className="svc-card fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Cursor glow */}
              <div className="svc-glow" style={{ background: `radial-gradient(circle 90px, ${service.color}22, transparent)` }} />

              {/* Top accent */}
              <div className="svc-top-line" style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }} />

              {/* Icon */}
              <div className="svc-icon" style={{ background: `${service.color}14`, border: `1px solid ${service.color}28`, color: service.color }}>
                {service.icon}
              </div>

              {/* Title */}
              <div className="svc-name">{service.name}</div>

              {/* Desc */}
              <div className="svc-desc">{service.desc}</div>

              {/* Bottom line */}
              <div className="svc-bottom-line" style={{ background: `linear-gradient(90deg, ${service.color}bb, transparent)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}