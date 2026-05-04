import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideArrowLeft, 
  LucideChevronLeft, 
  LucideChevronRight, 
  LucideX,
  LucideCamera
} from 'lucide-react';
import Navbar from './Navbar';

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

const IS_TOUCH = typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
   'ontouchstart' in window ||
   navigator.maxTouchPoints > 0);

export default function PhotographyGallery() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="pg-gallery-root" style={{ paddingBottom: IS_TOUCH ? '100px' : '0px' }}>
      <Navbar />
      <button className="workpage-back" onClick={() => navigate('/')}>
        <LucideArrowLeft size={16} /> Back to Home
      </button>

      <header className="pg-gallery-header">
        <div className="pg-header-content">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">✦ VISUAL STORIES ✦</span>
            <h1 className="pg-gallery-title">Cinematic <span>Gallery</span></h1>
            <div className="section-line" style={{ margin: '16px auto 0' }} />
            <p className="pg-gallery-sub">
              A curated collection of moments captured through my lens. Each frame tells a unique story of light, shadow, and human connection.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="section-inner">
        <motion.div 
          className="pg-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="pg-item"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelected(photo)}
            >
              <div className="pg-img-container">
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <div className="pg-overlay">
                  <div className="pg-overlay-info">
                    <h3>{photo.title}</h3>
                    <div className="pg-view-btn">
                      <LucideCamera size={16} /> View Story
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            className="lightbox" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <button className="lightbox-nav lightbox-prev" onClick={handlePrev}>
              <LucideChevronLeft />
            </button>

            <motion.div 
              className="lightbox-inner" 
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
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
            </motion.div>

            <button className="lightbox-nav lightbox-next" onClick={handleNext}>
              <LucideChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
