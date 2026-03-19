import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Code2, Monitor, Database, Terminal, Cpu, Globe } from 'lucide-react';

const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
      className={className}
    >
      <motion.div 
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const TechItem = ({ name, icon: Icon, color }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
    <Icon size={18} style={{ color }} className="group-hover:scale-110 transition-transform" />
    <span className="font-syne text-xs font-semibold text-slate-300 group-hover:text-white uppercase tracking-wider">{name}</span>
  </div>
);

const TechCategory = ({ title, items, icon: Icon, delay }) => (
  <TiltCard className="h-full">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-purple-500/30 transition-colors"
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={80} className="text-purple-500" />
      </div>
      
      <h3 className="text-xl font-bold font-syne text-white mb-6 flex items-center gap-3">
        <Icon size={24} className="text-purple-400" /> {title}
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {items.map((item, idx) => (
          <TechItem key={idx} {...item} />
        ))}
      </div>
      
      {/* Dynamic Glow Spotlight */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
    </motion.div>
  </TiltCard>
);

const TechStack = () => {
  const categories = [
    {
      title: "Frontend",
      icon: Monitor,
      items: [
        { name: "React", color: "#61dbfb", icon: Code2 },
        { name: "JavaScript", color: "#f7df1e", icon: Code2 },
        { name: "HTML", color: "#e34c26", icon: Globe },
        { name: "CSS", color: "#264de4", icon: Globe },
      ]
    },
    {
      title: "Backend",
      icon: Terminal,
      items: [
        { name: "Python", color: "#3776ab", icon: Terminal },
        { name: "Node.js", color: "#339933", icon: Terminal },
      ]
    },
    {
      title: "Database",
      icon: Database,
      items: [
        { name: "Supabase", color: "#3ecf8e", icon: Database },
        { name: "Firebase", color: "#ffca28", icon: Database },
      ]
    },
    {
      title: "Tools & Platforms",
      icon: Globe,
      items: [
        { name: "Git", color: "#f05032", icon: Code2 },
        { name: "GitHub", color: "#ffffff", icon: Code2 },
        { name: "APIs", color: "#00bfff", icon: Code2 },
        { name: "Vercel", color: "#ffffff", icon: Globe },
        { name: "VS Code", color: "#007acc", icon: Code2 },
        { name: "Render", color: "#46e3b7", icon: Globe },
      ]
    },
    {
      title: "Programming Languages",
      icon: Code2,
      items: [
        { name: "C", color: "#a8b9cc", icon: Code2 },
        { name: "Java", color: "#b07219", icon: Code2 },
        { name: "Python", color: "#3776ab", icon: Code2 },
        { name: "JavaScript", color: "#f7df1e", icon: Code2 },
      ]
    },
    {
      title: "Currently Exploring",
      icon: Cpu,
      items: [
        { name: "AI/ML", color: "#ff6347", icon: Cpu },
        { name: "System Design", color: "#9370db", icon: Cpu },
        { name: "Express", color: "#ffffff", icon: Terminal },
        { name: "MongoDB", color: "#47a248", icon: Database },
      ]
    }
  ];

  return (
    <section id="tech" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4 font-syne uppercase tracking-tight text-white"
          >
            Technologies I work with
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-medium tracking-wide"
          >
            Organized by what I use them for — always learning more.
          </motion.p>
          <div className="w-20 h-1 bg-purple-500 mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(138,92,246,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <TechCategory key={idx} {...cat} delay={idx * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
