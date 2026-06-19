import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  LucideArrowLeft, 
  LucideChevronLeft, 
  LucideChevronRight, 
  LucideX,
  LucideCamera,
  LucideAperture,
  LucideFocus,
  LucideMapPin
} from 'lucide-react';
import Navbar from './Navbar';
import { PHOTOGRAPHY_DUMP } from './data/photographyDump';
import { ZoomParallax } from './components/ui/zoom-parallax';
import './PhotographyGallery.css'; // New styles

// Extended Data Model with EXIF info
const fallbackPhotos = [
  { 
    id: 1, src: "/photos/1.jpg", 
    title: "Amber Awakening", 
    desc: "A meditation on perception and intimacy—the human eye becomes a universe unto itself. The warm, honey-toned iris captures light like a sunset, reminding us that every moment of seeing is an act of connection between inner consciousness and outer reality.", 
    category: "Portrait Photography",
    location: "Kolkata, India",
    camera: "Sony A7IV", lens: "FE 85mm F1.4 GM", iso: "100", shutterSpeed: "1/200s", aperture: "f/1.8"
  },
  { 
    id: 2, src: "/photos/2.jpg", 
    title: "Offerings of Devotion", 
    desc: "In the chaos of the crowd, one man stands anchored in faith. The marigold garlands symbolize the persistence of tradition in modern India—a bridge between the spiritual and the everyday, where commerce and devotion share the same sacred space.", 
    category: "Festival Photography",
    location: "Varanasi, India",
    camera: "Fujifilm X-T4", lens: "XF 23mm F1.4 R", iso: "400", shutterSpeed: "1/500s", aperture: "f/2.8"
  },
  { 
    id: 4, src: "/photos/4.jpg", 
    title: "Geometric Dreams", 
    desc: "A ferris wheel transformed into a kaleidoscope of neon geometry. This captures the intersection of childhood wonder and contemporary aesthetics—where nostalgia meets innovation, and simple pleasures become extraordinary through the lens of night and color.", 
    category: "Night Photography",
    location: "Mumbai, India",
    camera: "Sony A7R IV", lens: "FE 24-70mm F2.8 GM", iso: "1600", shutterSpeed: "1/30s", aperture: "f/4.0"
  },
  { 
    id: 3, src: "/photos/3.jpg", 
    title: "Symphony of Light", 
    desc: "Nature and celebration collide in a single frame. The fireworks mirror the ephemeral beauty of blooming flowers, both destined to fade yet forever etched in memory. This image speaks to moments of joy that illuminate our darkest skies.", 
    category: "Night Photography",
    location: "Kolkata, India",
    camera: "Canon EOS R5", lens: "RF 15-35mm F2.8 L", iso: "100", shutterSpeed: "4s", aperture: "f/8.0"
  },
  { 
    id: 5, src: "/photos/5.jpg", 
    title: "Still Waiting for Tomorrow", 
    desc: "A powerful portrait of urban invisibility. The elderly man and his dog exist in parallel with the rushing world behind them—a quiet commentary on displacement, dignity, and the unconditional loyalty that transcends circumstance.", 
    category: "Street Photography",
    location: "Delhi, India",
    camera: "Fujifilm X-Pro3", lens: "XF 35mm F2 R WR", iso: "800", shutterSpeed: "1/250s", aperture: "f/2.0"
  },
  { 
    id: 6, src: "/photos/6.jpg", 
    title: "Golden Hour Commute", 
    desc: "The ordinary transformed by light. Morning mist and golden haze turn a mundane street into a cinematic dreamscape, reminding us that magic exists in our daily routines if we pause long enough to witness it.", 
    category: "Street Photography",
    location: "Kolkata, India",
    camera: "Sony A7IV", lens: "FE 35mm F1.4 GM", iso: "100", shutterSpeed: "1/1000s", aperture: "f/1.4"
  },
  { 
    id: 7, src: "/photos/7.jpg", 
    title: "The Last Red of the Day", 
    desc: "The sun sinks behind wires and concrete, yet still finds space to glow. This photograph symbolises how beauty continues to exist even when life feels crowded, broken or tangled.", 
    category: "Urban Landscapes",
    location: "Bangalore, India",
    camera: "Nikon Z7 II", lens: "NIKKOR Z 24-120mm f/4 S", iso: "200", shutterSpeed: "1/60s", aperture: "f/5.6"
  },
  { 
    id: 8, src: "/photos/8.jpg", 
    title: "Hooghly Serenity", 
    desc: "The iconic Vidyasagar Setu stands sentinel over the Hooghly River as fishermen continue their timeless practice. This image embodies Kolkata's soul—where monumental infrastructure and humble tradition coexist.", 
    category: "Landscape Photography",
    location: "Kolkata, India",
    camera: "Sony A7R IV", lens: "FE 16-35mm F2.8 GM", iso: "100", shutterSpeed: "1/125s", aperture: "f/8.0"
  },
  { 
    id: 9, src: "/photos/9.jpg", 
    title: "Consuming Light", 
    desc: "In the darkness, fire becomes a living entity—breathing, moving, devouring. This photograph freezes the ephemeral nature of flame, capturing its hungry elegance. A meditation on impermanence: what burns brightest burns briefly.", 
    category: "Light Trails",
    location: "Jaipur, India",
    camera: "Canon EOS R6", lens: "RF 50mm F1.2 L", iso: "400", shutterSpeed: "1/50s", aperture: "f/1.2"
  },
  { 
    id: 10, src: "/photos/10.jpg", 
    title: "Solitary Path", 
    desc: "An empty lane bathed in nocturnal green—simultaneously inviting and isolating. This image captures the duality of urban solitude: the comfort of familiar neighborhoods and the strange loneliness that descends when the world sleeps.", 
    category: "Night Photography",
    location: "Kolkata, India",
    camera: "Fujifilm X-T4", lens: "XF 18-55mm F2.8-4", iso: "3200", shutterSpeed: "1/15s", aperture: "f/2.8"
  },
  { 
    id: 11, src: "/photos/11.jpg", 
    title: "Last Light Over the Ganges", 
    desc: "A mesmerizing view of the sacred Ganges river bathed in the fading light of dusk, capturing the timeless essence of life along its banks.", 
    category: "Landscape Photography",
    location: "Varanasi, India",
    camera: "Unknown", lens: "Unknown", iso: "Auto", shutterSpeed: "Auto", aperture: "Auto"
  },
];

export default function PhotographyGallery() {
  const navigate = useNavigate();
  const [photosList, setPhotosList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Parallax for Hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load photos from local dump
  useEffect(() => {
    const data = PHOTOGRAPHY_DUMP ? PHOTOGRAPHY_DUMP.filter(p => p.image) : [];
    if (data && data.length > 0) {
      const mapped = data.map(p => {
        let exif = {};
        let desc = p.description || '';
        if (p.description) {
          try {
            exif = JSON.parse(p.description);
            desc = exif.desc || '';
          } catch (e) {
            desc = p.description;
          }
        }
        return {
          id: p.id,
          src: p.image || p.image_url,
          title: p.title,
          desc: desc || `Captured in ${exif.location || p.location || 'India'} using ${exif.camera || p.camera || 'professional camera'}.`,
          category: p.category || 'Landscape Photography',
          location: exif.location || p.location || 'Kolkata, India',
          camera: exif.camera || p.camera || 'Unknown',
          lens: exif.lens || p.lens || 'Unknown',
          iso: exif.iso || p.iso || 'Auto',
          shutterSpeed: exif.shutterSpeed || exif.shutter_speed || p.shutter_speed || 'Auto',
          aperture: exif.aperture || p.aperture || 'Auto'
        };
      });
      setPhotosList(mapped);
    } else {
      setPhotosList(fallbackPhotos);
    }
  }, []);

  // Derived variables
  const featuredPhoto = photosList[0] || { src: '', title: '', category: '', location: '' };
  const carouselPhotos = photosList.slice(1);
  const zoomParallaxImages = (photosList.length > 0 ? photosList : fallbackPhotos)
    .slice(0, 7)
    .map(p => ({
      id: p.id,
      src: p.src,
      alt: p.title,
      title: p.title,
      category: p.category,
      camera: p.camera,
      lens: p.lens,
      location: p.location,
      desc: p.desc
    }));

  // Generate categories
  const categories = photosList.reduce((acc, photo) => {
    if (!acc[photo.category]) {
      acc[photo.category] = { count: 0, cover: photo.src };
    }
    acc[photo.category].count += 1;
    return acc;
  }, {});

  const categoryList = Object.keys(categories).map(key => ({
    name: key,
    count: categories[key].count,
    cover: categories[key].cover
  }));

  // Carousel Autoplay
  useEffect(() => {
    if (isHovered || selected || carouselPhotos.length === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, selected, carouselPhotos.length]);

  const handleCarouselNext = () => {
    if (carouselPhotos.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % carouselPhotos.length);
  };
  const handleCarouselPrev = () => {
    if (carouselPhotos.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + carouselPhotos.length) % carouselPhotos.length);
  };

  // Lightbox Navigation
  const handleLightboxPrev = useCallback((e) => {
    e?.stopPropagation();
    setSelected(prev => {
      if (!prev) return null;
      const idx = photosList.findIndex(p => p.id === prev.id);
      return photosList[(idx - 1 + photosList.length) % photosList.length];
    });
  }, [photosList]);

  const handleLightboxNext = useCallback((e) => {
    e?.stopPropagation();
    setSelected(prev => {
      if (!prev) return null;
      const idx = photosList.findIndex(p => p.id === prev.id);
      return photosList[(idx + 1) % photosList.length];
    });
  }, [photosList]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSelected(null);
      if (selected) {
        if (e.key === 'ArrowLeft') handleLightboxPrev();
        if (e.key === 'ArrowRight') handleLightboxNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, handleLightboxNext, handleLightboxPrev]);

  // Swipe Handlers for Carousel
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;
  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) handleCarouselNext();
    else if (swipe > swipeConfidenceThreshold) handleCarouselPrev();
  };

  return (
    <div className="pg-root">
      <Navbar />
      
      {/* Absolute back button over hero */}
      <button 
        className="workpage-back" 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '100px', left: '5%', zIndex: 50, background: 'rgba(0,0,0,0.5)', border: 'none', backdropFilter: 'blur(10px)' }}
      >
        <LucideArrowLeft size={16} /> Back
      </button>

      {/* SECTION 1: Intro Title Screen */}
      <div className="relative flex h-[60vh] flex-col items-center justify-center text-center px-4" style={{ zIndex: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label" style={{ letterSpacing: '4px', opacity: 0.8 }}>✦ VISUAL JOURNAL ✦</span>
          <h1 className="pg-hero-title mt-4 mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800 }}>
            Captured <span style={{ color: 'var(--theme-primary)', textShadow: '0 0 30px rgba(138, 92, 246, 0.4)' }}>Moments</span>
          </h1>
          <div className="section-line mx-auto" style={{ width: '80px', height: '3px', background: 'var(--gradient)' }} />
          <p className="max-w-xl mx-auto mt-6" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            A cinematic exploration of light, life, and landscapes through my lens. Scroll down to enter the visual story.
          </p>
        </motion.div>
      </div>

      {/* SECTION 1.5: Zoom Parallax Reel */}
      {zoomParallaxImages.length > 0 && (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <ZoomParallax images={zoomParallaxImages} onImageClick={(photo) => setSelected(photo)} />
        </div>
      )}

      {/* SECTION 2: Cinematic Film Strip */}
      <section className="pg-carousel-section">
        <div className="pg-section-header">
          <h2 className="pg-section-title">Latest Visuals</h2>
          <p className="pg-section-subtitle">Swipe or drag to explore the cinematic reel</p>
        </div>
        
        <div 
          className="pg-carousel-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button className="pg-carousel-nav prev" onClick={handleCarouselPrev}>
            <LucideChevronLeft />
          </button>
          
          <AnimatePresence initial={false}>
            {carouselPhotos.map((photo, i) => {
              let position = "hidden";
              if (i === carouselIndex) position = "center";
              else if (i === (carouselIndex - 1 + carouselPhotos.length) % carouselPhotos.length) position = "left";
              else if (i === (carouselIndex + 1) % carouselPhotos.length) position = "right";

              return (
                <motion.div 
                  key={photo.id}
                  className={`pg-carousel-slide ${position}`}
                  onClick={() => {
                    if (position === "center") setSelected(photo);
                    else if (position === "left") handleCarouselPrev();
                    else if (position === "right") handleCarouselNext();
                  }}
                  drag={position === "center" ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                >
                  <img src={photo.src} alt={photo.title} loading="lazy" />
                  <div className="pg-carousel-info">
                    <h3>{photo.title}</h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <button className="pg-carousel-nav next" onClick={handleCarouselNext}>
            <LucideChevronRight />
          </button>
        </div>
      </section>

      {/* SECTION 3: Photo Categories */}
      <section className="pg-categories-section">
        <div className="pg-section-header" style={{ padding: 0 }}>
          <h2 className="pg-section-title">Disciplines</h2>
          <p className="pg-section-subtitle">Exploring different styles of visual storytelling</p>
        </div>

        <div className="pg-categories-grid">
          {categoryList.map((cat, idx) => (
            <motion.div 
              key={cat.name}
              className="pg-category-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <img src={cat.cover} alt={cat.name} className="pg-category-bg" loading="lazy" />
              <div className="pg-category-content">
                <h3 className="pg-category-title">{cat.name}</h3>
                <div className="pg-category-count">
                  <LucideCamera size={14} /> {cat.count} {cat.count === 1 ? 'Photo' : 'Photos'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4 & 5: Enhanced Lightbox Viewer */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            className="pg-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Viewer Area */}
            <div className="pg-lightbox-viewer" onClick={() => setSelected(null)}>
              <button className="pg-lightbox-nav prev" onClick={handleLightboxPrev}>
                <LucideChevronLeft size={36} />
              </button>

              <motion.img 
                src={selected.src} 
                alt={selected.title} 
                className="pg-lightbox-img"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) handleLightboxNext();
                  else if (swipe > swipeConfidenceThreshold) handleLightboxPrev();
                }}
              />

              <button className="pg-lightbox-nav next" onClick={handleLightboxNext}>
                <LucideChevronRight size={36} />
              </button>
            </div>

            {/* Sidebar Data Area */}
            <motion.div 
              className="pg-lightbox-sidebar"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="pg-lightbox-close" onClick={() => setSelected(null)}>
                <LucideX size={20} />
              </button>

              <div style={{ marginTop: '40px' }}>
                <div className="pg-hero-badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  {selected.category}
                </div>
                <h2 className="pg-exif-title">{selected.title}</h2>
                <p className="pg-exif-desc">{selected.desc}</p>

                {/* EXIF Grid */}
                <div className="pg-exif-grid">
                  <div className="pg-exif-item">
                    <span className="pg-exif-label"><LucideMapPin size={12}/> Location</span>
                    <span className="pg-exif-value">{selected.location || "Unknown"}</span>
                  </div>
                  <div className="pg-exif-item">
                    <span className="pg-exif-label"><LucideCamera size={12}/> Camera</span>
                    <span className="pg-exif-value">{selected.camera || "N/A"}</span>
                  </div>
                  <div className="pg-exif-item">
                    <span className="pg-exif-label"><LucideFocus size={12}/> Lens</span>
                    <span className="pg-exif-value">{selected.lens || "N/A"}</span>
                  </div>
                  <div className="pg-exif-item">
                    <span className="pg-exif-label"><LucideAperture size={12}/> Settings</span>
                    <span className="pg-exif-value">
                      {selected.aperture} • {selected.shutterSpeed} • ISO {selected.iso}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
