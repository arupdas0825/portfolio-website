import React, { useState, useEffect, useRef } from 'react';
import { LucideChevronLeft, LucideChevronRight, LucideX } from 'lucide-react';

// Updated photo list with user-provided titles and descriptions
const photos = [
  { id: 1, src: "/photos/1.jpg", title: "Amber Awakening", desc: "A meditation on perception and intimacy—the human eye becomes a universe unto itself. The warm, honey-toned iris captures light like a sunset, reminding us that every moment of seeing is an act of connection between inner consciousness and outer reality." },
  { id: 2, src: "/photos/2.jpg", title: "Offerings of Devotion", desc: "In the chaos of the crowd, one man stands anchored in faith. The marigold garlands symbolize the persistence of tradition in modern India—a bridge between the spiritual and the everyday, where commerce and devotion share the same sacred space." },
  { id: 4, src: "/photos/4.jpg", title: "Geometric Dreams", desc: "A ferris wheel transformed into a kaleidoscope of neon geometry. This captures the intersection of childhood wonder and contemporary aesthetics—where nostalgia meets innovation, and simple pleasures become extraordinary through the lens of night and color." },
  { id: 3, src: "/photos/3.jpg", title: "Symphony of Light", desc: "Nature and celebration collide in a single frame. The fireworks mirror the ephemeral beauty of blooming flowers, both destined to fade yet forever etched in memory. This image speaks to moments of joy that illuminate our darkest skies." },
  { id: 5, src: "/photos/5.jpg", title: "Still Waiting for Tomorrow", desc: "A powerful portrait of urban invisibility. The elderly man and his dog exist in parallel with the rushing world behind them—a quiet commentary on displacement, dignity, and the unconditional loyalty that transcends circumstance." },
  { id: 6, src: "/photos/6.jpg", title: "Golden Hour Commute", desc: "The ordinary transformed by light. Morning mist and golden haze turn a mundane street into a cinematic dreamscape, reminding us that magic exists in our daily routines if we pause long enough to witness it." },
  { id: 7, src: "/photos/7.jpg", title: "The Last Red of the Day", desc: "The sun sinks behind wires and concrete, yet still finds space to glow. This photograph symbolises how beauty continues to exist even when life feels crowded, broken or tangled." },
  { id: 8, src: "/photos/8.jpg", title: "Hooghly Serenity", desc: "The iconic Vidyasagar Setu stands sentinel over the Hooghly River as fishermen continue their timeless practice. This image embodies Kolkata's soul—where monumental infrastructure and humble tradition coexist, where engineering marvels don't overshadow the human scale of life." },
  { id: 9, src: "/photos/9.jpg", title: "Consuming Light", desc: "In the darkness, fire becomes a living entity—breathing, moving, devouring. This photograph freezes the ephemeral nature of flame, capturing its hungry elegance. It's a meditation on impermanence: what burns brightest burns briefly, yet leaves an indelible impression on everything it touches." },
  { id: 10, src: "/photos/10.jpg", title: "Solitary Path", desc: "An empty lane bathed in nocturnal green—simultaneously inviting and isolating. This image captures the duality of urban solitude: the comfort of familiar neighborhoods and the strange loneliness that descends when the world sleeps." },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const fadeRefs = useRef([]);
  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePrev = (e) => {
    e?.stopPropagation();
    const idx = photos.findIndex(p => p.id === selected.id);
    const prevIdx = (idx - 1 + photos.length) % photos.length;
    setSelected(photos[prevIdx]);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    const idx = photos.findIndex(p => p.id === selected.id);
    const nextIdx = (idx + 1) % photos.length;
    setSelected(photos[nextIdx]);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSelected(null);
      if (selected) {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected]);

  return (
    <section id="photography" className="page-section gallery-section">
      <div className="section-inner">
        <h2 className="section-title fade-in" ref={addRef}>
          Cinematic <span>Photography</span>
        </h2>
        <div className="section-line fade-in" ref={addRef} />
        <p className="section-sub fade-in" ref={addRef}>
          Capturing stories through light and shadow — a visual journey of perspectives.
        </p>

        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <div
              className="gallery-item fade-in"
              key={photo.id}
              ref={addRef}
              style={{ animationDelay: `${(index % 5) * 0.1}s` }}
              onClick={() => setSelected(photo)}
            >
              <img src={photo.src} alt={photo.title}
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('photo-missing');
                }}
              />
              <div className="gallery-item-overlay">
                <span>{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
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