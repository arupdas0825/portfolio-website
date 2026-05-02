import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const titleRef  = useRef(null);
  const [contactData, setContactData] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [focused, setFocused] = useState(null);

  /* GSAP heading */
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true } }
    );
  }, []);

  /* Firestore real-time */
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteData', 'contact'), snap => {
      if (snap.exists()) setContactData(snap.data());
    }, () => {});
    return unsub;
  }, []);

  const email     = contactData?.email     || 'dasarup0804@gmail.com';
  const location  = contactData?.location  || 'Kolkata, West Bengal, India';
  const github    = contactData?.github    || 'https://github.com/arupdas0825';
  const linkedin  = contactData?.linkedin  || 'https://www.linkedin.com/in/arup-das-381bb02a1/';
  const facebook  = contactData?.facebook  || 'https://www.facebook.com/arupofficial08';
  const instagram = contactData?.instagram || 'https://www.instagram.com/_arup_official_08/';

  const handleSubmit = e => {
    e.preventDefault();
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const socials = [
    {
      href: github, title: 'GitHub', color: '#c9d1d9',
      icon: <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>,
    },
    {
      href: linkedin, title: 'LinkedIn', color: '#0a66c2',
      icon: <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    },
    {
      href: facebook, title: 'Facebook', color: '#1877f2',
      icon: <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    {
      href: instagram, title: 'Instagram', color: '#e1306c',
      icon: <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
    },
  ];

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

            {/* Socials */}
            <div className="contact-socials-v2">
              {socials.map(({ href, title, icon, color }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={title}
                  className="contact-social-btn"
                  style={{ '--social-color': color }}
                >
                  {icon}
                  <span>{title}</span>
                </a>
              ))}
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