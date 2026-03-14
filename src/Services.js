import React, { useEffect, useRef } from 'react';
import { LucideCode, LucideBrain, LucideSmartphone, LucideCamera, LucideBarChart4, LucideShieldCheck } from 'lucide-react';

const Services = () => {
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

  const services = [
    {
      title: "Web Development",
      desc: "Building responsive, modern web applications using React, JavaScript, and Tailwind CSS with a focus on clean UI and solid engineering principles.",
      icon: <LucideCode />,
      tags: ["Responsive Design", "React", "Performance"]
    },
    {
      title: "AI / ML Solutions",
      desc: "Designing and implementing intelligent systems — from Gemini AI integrations to machine learning models that solve real-world problems at scale.",
      icon: <LucideBrain />,
      tags: ["Gemini AI", "ML Models", "Data Analysis"]
    },
    {
      title: "Mobile App Dev",
      desc: "Creating cross-platform mobile applications with Firebase backend, location services, and modern UI patterns that work seamlessly on both iOS and Android.",
      icon: <LucideSmartphone />,
      tags: ["Firebase", "Cross-Platform", "User-Friendly"]
    },
    {
      title: "Creative Direction",
      desc: "Combining technical skills with a photographer's eye — UI/UX design, video editing with Premiere Pro & After Effects, and visual storytelling.",
      icon: <LucideCamera />,
      tags: ["Photography", "Premiere Pro", "After Effects"]
    },
    {
      title: "Data Analysis",
      desc: "Turning raw data into actionable insights using Python, SQL, and machine learning techniques — from data cleaning to advanced visualizations and reports.",
      icon: <LucideBarChart4 />,
      tags: ["Python", "SQL", "Visualization"]
    },
    {
      title: "Backend Systems",
      desc: "Building robust server-side logic with Java, Firebase, and REST APIs — scalable, secure, and production-ready systems for modern web applications.",
      icon: <LucideShieldCheck />,
      tags: ["Java", "Firebase", "REST APIs"]
    }
  ];

  return (
    <section id="services" className="page-section">
      <div className="section-inner">
        <h2 className="section-title fade-in" ref={addRef}>Features & <span>Services</span></h2>
        <div className="section-line fade-in" ref={addRef}></div>
        <p className="section-sub fade-in" ref={addRef}>
          What I bring to the table — from intelligent systems to creative digital experiences.
        </p>

        <div className="services-grid">
          {services.map((s, idx) => (
            <div key={idx} className="service-card fade-in" ref={addRef} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="skill-tags" style={{ justifyContent: 'center' }}>
                {s.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
