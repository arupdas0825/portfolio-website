import React, { useEffect, useRef } from 'react';
import { LucideMail, LucideMapPin, LucideGraduationCap, LucideGithub, LucideLinkedin, LucideInstagram, LucideSend } from 'lucide-react';

const Contact = () => {
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

  return (
    <section id="contact" className="page-section">
      <div className="section-inner">
        <h2 className="section-title fade-in" ref={addRef}>Get In <span>Touch</span></h2>
        <div className="section-line fade-in" ref={addRef}></div>
        <p className="section-sub fade-in" ref={addRef}>
          Let's collaborate! I am always open to discussing exciting projects, internship opportunities, and new ideas.
        </p>

        <div className="contact-inner">
          <div className="contact-info fade-in" ref={addRef}>
            <div className="contact-info-list">
              <div className="contact-item">
                <div className="contact-icon"><LucideMail /></div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-val">dasarup0804@gmail.com</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><LucideMapPin /></div>
                <div>
                  <div className="contact-label">Location</div>
                  <div className="contact-val">Kolkata, West Bengal, India</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><LucideGraduationCap /></div>
                <div>
                  <div className="contact-label">University</div>
                  <div className="contact-val">Brainware University, Kolkata</div>
                </div>
              </div>
            </div>

            <div className="hero-social">
              <a href="https://github.com/arupdas0825" className="social-icon" target="_blank" rel="noreferrer"><LucideGithub /></a>
              <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noreferrer"><LucideLinkedin /></a>
              <a href="https://instagram.com" className="social-icon" target="_blank" rel="noreferrer"><LucideInstagram /></a>
            </div>
          </div>

          <form className="contact-form fade-in" ref={addRef} style={{ animationDelay: '0.2s' }}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" placeholder="John Doe" className="form-input" />
            </div>
            <div className="form-group">
              <label>Your Email</label>
              <input type="email" placeholder="john@example.com" className="form-input" />
            </div>
            <div className="form-group full">
              <label>Subject</label>
              <input type="text" placeholder="Project Inquiry / Collaboration" className="form-input" />
            </div>
            <div className="form-group full">
              <label>Your Message</label>
              <textarea placeholder="Tell me about your project or opportunity.." className="form-input" rows="5"></textarea>
            </div>
            <button type="submit" className="btn-submit">
              <LucideSend size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
