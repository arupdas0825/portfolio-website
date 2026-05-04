import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LucideChevronLeft, LucideChevronRight, LucideX } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isMobileDevice = () => typeof window !== 'undefined' && window.innerWidth < 768;

const photos = [
  { id: 1, src: "/photos/1.jpg", title: "Amber Awakening", desc: "A meditation on perception and intimacy—the human eye becomes a universe unto itself. The warm, honey-toned iris captures light like a sunset, reminding us that every moment of seeing is an act of connection between inner consciousness and outer reality." },
  { id: 2, src: "/photos/2.jpg", title: "Offerings of Devotion", desc: "In the chaos of the crowd, one man stands anchored in faith. The marigold garlands symbolize the persistence of tradition in modern India—a bridge between the spiritual and the everyday, where commerce and devotion share the same sacred space." },
  { id: 4, src: "/photos/4.jpg", title: "Geometric Dreams", desc: "A ferris wheel transformed into a kaleidoscope of neon geometry. This captures the intersection of childhood wonder and contemporary aesthetics—where nostalgia meets innovation, and simple pleasures become extraordinary through the lens of night and color." },
  { id: 3, src: "/photos/3.jpg", title: "Symphony of Light", desc: "Nature and celebration collide in a single frame. The fireworks mirror the ephemeral beauty of blooming flowers, both destined to fade yet forever etched in memory. This image speaks to moments of joy that illuminate our darkest skies." },
  { id: 5, src: "/photos/5.jpg", title: "Still Waiting for Tomorrow", desc: "A powerful portrait of urban invisibility. The elderly man and his dog exist in parallel with the rushing world behind them—a quiet commentary on displacement, dignity, and the unconditional loyalty that transcends circumstance." },
  { id: 6, src: "/photos/6.jpg", title: "Golden Hour Commute", desc: "The ordinary transformed by light. Morning mist and golden haze turn a mundane street into a cinematic dreamscape, reminding us that magic exists in our daily routines if we pause long enough to witness it." },
  { id: 7, src: "/photos/7.jpg", title: "The Last Red of the Day", desc: "The sun sinks behind wires and concrete, yet still finds space to glow. This photograph symbolises how beauty continues to exist even when life feels crowded, broken or tangled." },
  { id: 8, src: "/photos/8.jpg", title: "Hooghly Serenity", desc: "The iconic Vidyasagar Setu stands sentinel over the Hooghly River as fishermen continue their timeless practice. This image embodies Kolkata's soul—where monumental infrastructure and humble tradition coexist." },
  { id: 9, src: "/photos/9.jpg", title: "Consuming Light", desc: "In the darkness, fire becomes a living entity—breathing, moving, devouring. This photograph freezes the ephemeral nature of flame, capturing its hungry elegance. A meditation on impermanence: what burns brightest burns briefly." },
  { id: 10, src: "/photos/10.jpg", title: "Solitary Path", desc: "An empty lane bathed in nocturnal green—simultaneously inviting and isolating. This image captures the duality of urban solitude: the comfort of familiar neighborhoods and the strange loneliness that descends when the world sleeps." },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const fadeRefs = useRef([]);
  const titleRef = useRef(null);
  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  useEffect(() => {
    const checkMobile = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const MOBILE_LIMIT = 4;
  const visiblePhotos = (isMobile && !isExpanded) ? photos.slice(0, MOBILE_LIMIT) : photos;
  const showButton = isMobile && !isExpanded && photos.length > MOBILE_LIMIT;

  // GSAP ScrollTrigger on heading
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    
    // Use a small delay to ensure refs are populated after state changes
    const timeout = setTimeout(() => {
      fadeRefs.current.forEach(el => el && observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [isMobile, isExpanded]);


  // ✅ useCallback — ESLint exhaustive-deps fix
  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    setSelected(prev => {
      const idx = photos.findIndex(p => p.id === prev.id);
      return photos[(idx - 1 + photos.length) % photos.length];
    });
  }, []);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setSelected(prev => {
      const idx = photos.findIndex(p => p.id === prev.id);
      return photos[(idx + 1) % photos.length];
    });
  }, []);

  // ✅ handleNext & handlePrev now stable — safe in deps array
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNext, handlePrev]);

  return (
    <section id="photography" className="page-section gallery-section">
      <div className="section-inner">
        <h2 className="section-title fade-in" ref={r => { addRef(r); titleRef.current = r; }}>
          Cinematic <span>Photography</span>
        </h2>
        <div className="section-line fade-in" ref={addRef} />
        <p className="section-sub fade-in" ref={addRef}>
          Capturing stories through light and shadow — a visual journey of perspectives.
        </p>

        <motion.div
          className="gallery-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {visiblePhotos.map((photo, index) => (
            <motion.div
              className="gallery-item fade-in"
              key={photo.id}
              ref={addRef}
              onClick={() => setSelected(photo)}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show:   { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <img
                src={photo.src}
                alt={photo.title}
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('photo-missing');
                }}
              />
              <div className="gallery-item-overlay">
                <span>{photo.title}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Mobile CTA: See More Photos ── */}
        {showButton && (
          <div className="work-see-more visible" style={{ marginTop: 40, opacity: 1 }}>
            <motion.button
              className="work-see-more-btn"
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              See More Photos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.button>
            <p className="work-see-more-hint">
              {photos.length - MOBILE_LIMIT} more cinematic shots available
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <button className="lightbox-nav lightbox-prev" onClick={handlePrev}>
            <LucideChevronLeft />
          </button>

          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelected(null)}>
              <LucideX />
            </button>
            <div className="lightbox-content">
              <div className="lightbox-img-wrap">
                <img src={selected.src} alt={selected.title} className="lightbox-img" />
              </div>
              <div className="lightbox-info">
                <h3>{selected.title}</h3>
                <p>{selected.desc}</p>
              </div>
            </div>
          </div>

          <button className="lightbox-nav lightbox-next" onClick={handleNext}>
            <LucideChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}