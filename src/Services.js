import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LucideCode, LucideBrain, LucideSmartphone, LucideCamera, LucideBarChart4, LucideShieldCheck } from 'lucide-react';
import TiltCard from './TiltCard';

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
      icon: <LucideCode size={32} />,
      color: "blue"
    },
    {
      title: "AI / ML Solutions",
      desc: "Designing and implementing intelligent systems — from Gemini AI integrations to machine learning models that solve real-world problems at scale.",
      icon: <LucideBrain size={32} />,
      color: "purple"
    },
    {
      title: "Mobile App Dev",
      desc: "Creating cross-platform mobile applications with Firebase backend, location services, and modern UI patterns that work seamlessly on both iOS and Android.",
      icon: <LucideSmartphone size={32} />,
      color: "fuchsia"
    },
    {
      title: "Creative Direction",
      desc: "Combining technical skills with a photographer's eye — UI/UX design, video editing with Premiere Pro & After Effects, and visual storytelling.",
      icon: <LucideCamera size={32} />,
      color: "cyan"
    },
    {
      title: "Data Analysis",
      desc: "Turning raw data into actionable insights using Python, SQL, and machine learning techniques — from data cleaning to advanced visualizations and reports.",
      icon: <LucideBarChart4 size={32} />,
      color: "green"
    },
    {
      title: "Backend Systems",
      desc: "Building robust server-side logic with Java, Firebase, and REST APIs — scalable, secure, and production-ready systems for modern web applications.",
      icon: <LucideShieldCheck size={32} />,
      color: "rose"
    }
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4 font-syne uppercase tracking-tight text-white"
          >
            Capabilities & <span>Services</span>
          </motion.h2>
          <div className="w-20 h-1 bg-purple-500 mx-auto rounded-full shadow-[0_0_15px_rgba(138,92,246,0.5)]"></div>
          <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-lg">
            What I bring to the table — from intelligent systems to creative digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <TiltCard key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex flex-col group hover:border-purple-500/30 transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-400 mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
                  {s.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-syne">{s.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6 flex-1">{s.desc}</p>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    className={`h-full bg-${s.color}-500/50`}
                  />
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
