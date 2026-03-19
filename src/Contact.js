import React from 'react';
import { motion } from 'framer-motion';
import { LucideMail, LucideMapPin, LucideGraduationCap, LucideGithub, LucideLinkedin, LucideInstagram, LucideSend, LucideFacebook } from 'lucide-react';
import TiltCard from './TiltCard';

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] -z-10 animate-pulse delay-1000"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4 font-syne uppercase tracking-tight text-white"
          >
            Get In <span>Touch</span>
          </motion.h2>
          <div className="w-20 h-1 bg-purple-500 mx-auto rounded-full shadow-[0_0_15px_rgba(138,92,246,0.5)]"></div>
          <p className="mt-6 text-slate-400 max-w-xl mx-auto text-lg">
            Let's collaborate! I am always open to discussing exciting projects, internship opportunities, and new ideas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <TiltCard>
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 h-full shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-8 font-syne">Contact Information</h3>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/10 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                      <LucideMail size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-lg text-white font-medium">dasarup0804@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                      <LucideMapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Location</p>
                      <p className="text-lg text-white font-medium">Kolkata, WB, India</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/10 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
                      <LucideGraduationCap size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">University</p>
                      <p className="text-lg text-white font-medium">Brainware University</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Connect with me</p>
                  <div className="flex gap-4">
                    {[
                      { icon: <LucideGithub size={20} />, href: "https://github.com/arupdas0825", color: "white" },
                      { icon: <LucideLinkedin size={20} />, href: "https://www.linkedin.com/in/arup-das-381bb02a1/", color: "blue-400" },
                      { icon: <LucideInstagram size={20} />, href: "https://www.instagram.com/_arup_official_08/", color: "fuchsia-400" },
                      { icon: <LucideFacebook size={20} />, href: "https://www.facebook.com/arupofficial08", color: "blue-600" }
                    ].map((social, i) => (
                      <a 
                        key={i} href={social.href} target="_blank" rel="noreferrer"
                        className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-600/50 hover:border-purple-500/50 transition-all duration-300`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 h-full shadow-2xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Arup Das" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="hello@arup.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Project Inquiry / Collaboration" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    placeholder="Tell me about your amazing project idea..."
                    rows="6"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-syne font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 transition-all duration-300"
                >
                  <LucideSend size={20} />
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
