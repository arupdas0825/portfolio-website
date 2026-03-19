import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';
import { Briefcase, Wrench, Code } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4 font-syne uppercase tracking-tight text-white"
          >
            About
          </motion.h2>
          <div className="w-20 h-1 bg-purple-500 mx-auto rounded-full shadow-[0_0_15px_rgba(138,92,246,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT SIDE: Image + Stats */}
          <div className="flex flex-col items-center gap-12 w-full">
            {/* Profile Image (Top) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center w-full"
            >
              <div className="relative group inline-block">
                {/* Premium Animated Border Wrapper */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                
                <div className="relative bg-[#0a0812] rounded-2xl p-[3px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 animate-gradient-move group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="relative rounded-2xl overflow-hidden bg-[#0a0812]">
                    <img 
                      src="/arup.jpg" 
                      alt="Arup Das" 
                      className="w-full max-w-[320px] aspect-[4/5] object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
                    />
                    {/* Glass Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <span className="text-white font-syne font-bold text-sm tracking-widest uppercase">Arup Das</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards (Vertical Stack Under Image) */}
            <div className="w-full max-w-sm grid grid-cols-1 gap-6">
              <TiltCard>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-6 group hover:border-blue-500/30 hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-white font-syne">15+</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Projects Completed</div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-6 group hover:border-purple-500/30 hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Wrench size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-white font-syne">20+</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tools Mastered</div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-6 group hover:border-green-500/30 hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                    <Code size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-white font-syne">500+</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">DSA Solved</div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>

          {/* RIGHT SIDE: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-start max-w-xl mx-auto lg:mx-0 pt-2 lg:pt-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold font-syne text-white mb-8 leading-tight">
              I build practical web products and <span className="text-purple-400">AI-powered tools.</span><br/>
              I build products that matter.
            </h3>
            
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
              <p>
                I'm Arup Das — a developer who enjoys turning ideas into working products. I focus on building practical tools and web applications that solve real problems. Whether it's an AI-powered utility or a clean web platform, I like taking an idea from concept to a usable product.
              </p>
              <p>
                I enjoy working across the stack — from frontend interfaces to backend logic and APIs. I like learning whatever a project requires and building solutions that are simple, reliable, and useful.
              </p>
              <p>
                I build in public, contribute to open source, and constantly explore new technologies. Right now I'm deep into AI-powered tools, scalable web architectures, and competitive programming.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;