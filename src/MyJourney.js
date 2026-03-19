import React from 'react';
import { motion } from 'framer-motion';

const journeyData = [
  {
    year: '2025',
    content: 'Building AI/ML projects and advanced portfolio systems',
  },
  {
    year: '2024',
    content: 'Started working on real-world projects and exploring full-stack development',
  },
  {
    year: '2023',
    content: 'Built first complete web applications and strengthened programming skills',
  },
  {
    year: '2022',
    content: 'Learned React and modern frontend development',
  },
  {
    year: '2021',
    content: 'Started coding journey with HTML, CSS, and JavaScript',
  },
];

const TimelineItem = ({ item, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex items-center justify-between mb-12 w-full ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Year Dot on Center Line */}
      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(138,92,246,0.8)] z-10">
        <div className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-75" />
      </div>

      {/* Card */}
      <motion.div 
        className={`w-[45%] p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-[0_0_20px_rgba(138,92,246,0.1)] hover:shadow-[0_0_30px_rgba(138,92,246,0.2)] hover:-translate-y-1 transition-all duration-300 group`}
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <span className="text-sm font-bold text-purple-400 mb-2 block font-syne group-hover:text-purple-300">{item.year}</span>
        <p className="text-slate-300 text-sm leading-relaxed">{item.content}</p>
      </motion.div>

      {/* Spacer for the other side */}
      <div className="w-[45%]" />
    </div>
  );
};

export default function MyJourney() {
  return (
    <section id="journey" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-white mb-2 font-syne uppercase tracking-wider">My Journey</h2>
        <div className="w-16 h-1 bg-purple-500 mx-auto mb-16 shadow-[0_0_10px_rgba(138,92,246,0.5)]" />

        <div className="relative">
          {/* Vertical Glowing Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0" />
          
          <div className="flex flex-col items-center">
            {journeyData.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
