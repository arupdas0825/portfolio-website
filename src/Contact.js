import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SocialLinks from './components/SocialLinks';


gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const titleRef  = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [focused, setFocused] = useState(null);
  const [contactData, setContactData] = useState({
    email: 'dasarup0804@gmail.com',
    location: 'Kolkata, West Bengal, India',
    github: 'https://github.com/arupdas0825',
    linkedin: 'https://www.linkedin.com/in/arup-das-381bb02a1/',
    facebook: 'https://www.facebook.com/arupofficial08',
    instagram: 'https://www.instagram.com/_arup_official_08/'
  });

  /* GSAP heading */
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 98%', once: true } }
    );
  }, []);


  const email     = contactData.email;
  const location  = contactData.location;

  const socialLinksData = [
    { name: "GitHub", href: contactData.github, icon: "github", color: "#c9d1d9" },
    { name: "LinkedIn", href: contactData.linkedin, icon: "linkedin", color: "#0a66c2" },
    { name: "Facebook", href: contactData.facebook, icon: "facebook", color: "#1877f2" },
    { name: "Instagram", href: contactData.instagram, icon: "instagram", color: "#e1306c" },
  ];

  const handleSubmit = e => {
    e.preventDefault();
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const details = [
    {
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: 'Email',
      val: email,
      href: `mailto:${email}`,
    },
    {
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: 'Location',
      val: location,
      href: null,
    },
  ];

  return (
    <section id="contact" className="page-section">
      <div className="section-inner">

        {/* ── Header ─────────────────────────────────────────── */}
        <span className="section-label">✦ REACH OUT ✦</span>
        <h2 className="section-title" ref={titleRef}>
          Get In <span>Touch</span>
        </h2>
        <div className="section-line" />
        <p className="section-sub">
          Have a project in mind, a collaboration idea, or just want to say hi?
          My inbox is always open.
        </p>

        {/* ── Body ────────────────────────────────────────────── */}
        <motion.div
          className="contact-body"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── LEFT — Info panel ──────────────────────────── */}
          <div className="contact-panel">

            {/* Availability badge */}
            <div className="contact-avail">
              <span className="contact-avail-dot" />
              Available for freelance &amp; collaboration
            </div>

            <h3 className="contact-panel-title">Let's build something<br/>great together.</h3>
            <p className="contact-panel-sub">
              I'm a full-stack developer &amp; AI enthusiast based in Kolkata,
              India — open to internships, projects, and creative opportunities.
            </p>

            {/* Contact details */}
            <div className="contact-details-v2">
              {details.map(({ icon, label, val, href }) => (
                <div key={label} className="contact-detail-v2">
                  <div className="contact-detail-icon-v2">{icon}</div>
                  <div className="contact-detail-body">
                    <span className="contact-detail-lbl">{label}</span>
                    {href
                      ? <a href={href} className="contact-detail-val-v2">{val}</a>
                      : <span className="contact-detail-val-v2">{val}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Magnetic Glassmorphic Social Links */}
            <div className="mt-4">
              <SocialLinks links={socialLinksData} />
            </div>
          </div>

          {/* ── RIGHT — Form ───────────────────────────────── */}
          <div className="contact-form-panel">
            <form className="contact-form-v2" onSubmit={handleSubmit} noValidate>

              <div className="cfv2-row">
                <div className={`cfv2-group ${focused === 'name' ? 'cfv2-focused' : ''}`}>
                  <label htmlFor="cf-name">Your Name</label>
                  <input
                    id="cf-name" type="text" required
                    placeholder="Arup Das"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div className={`cfv2-group ${focused === 'email' ? 'cfv2-focused' : ''}`}>
                  <label htmlFor="cf-email">Email Address</label>
                  <input
                    id="cf-email" type="email" required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div className={`cfv2-group ${focused === 'subject' ? 'cfv2-focused' : ''}`}>
                <label htmlFor="cf-subject">Subject</label>
                <input
                  id="cf-subject" type="text" required
                  placeholder="Project collaboration / Internship / Say hi…"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  onFocus={() => setFocused('subject')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <div className={`cfv2-group ${focused === 'message' ? 'cfv2-focused' : ''}`}>
                <label htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message" required rows={5}
                  placeholder="Tell me about your project, idea, or just say hello…"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <motion.button
                type="submit"
                className="cfv2-submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={sent}
              >
                {sent ? (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Opening your mail app…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                    Send Message
                  </>
                )}
              </motion.button>

              <p className="cfv2-note">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Your data is only used to open your email client. Nothing is stored.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}