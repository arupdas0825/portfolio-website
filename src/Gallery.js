import React, { useState, useEffect, useMemo, useRef, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideX,
  LucideMapPin,
  LucideCamera,
  LucideChevronLeft,
  LucideChevronRight,
  LucideAperture,
  LucideFocus
} from 'lucide-react';
import { PHOTOGRAPHY_DUMP } from './data/photographyDump';
import './Gallery.css';

// Fallback Data Model
const fallbackPhotos = [
  { 
    id: 1, src: "/photos/1.jpg", 
    title: "Amber Awakening", 
    desc: "A meditation on perception and intimacy—the human eye becomes a universe unto itself. The warm, honey-toned iris captures light like a sunset.", 
    category: "Portrait Photography",
    location: "Kolkata, India",
    camera: "Sony A7IV", lens: "FE 85mm F1.4 GM", iso: "100", shutterSpeed: "1/200s", aperture: "f/1.8"
  },
  { 
    id: 2, src: "/photos/2.jpg", 
    title: "Offerings of Devotion", 
    desc: "In the chaos of the crowd, one man stands anchored in faith. The marigold garlands symbolize the persistence of tradition in modern India.", 
    category: "Festival Photography",
    location: "Varanasi, India",
    camera: "Fujifilm X-T4", lens: "XF 23mm F1.4 R", iso: "400", shutterSpeed: "1/500s", aperture: "f/2.8"
  },
  { 
    id: 4, src: "/photos/4.jpg", 
    title: "Geometric Dreams", 
    desc: "A ferris wheel transformed into a kaleidoscope of neon geometry.", 
    category: "Night Photography",
    location: "Mumbai, India",
    camera: "Sony A7R IV", lens: "FE 24-70mm F2.8 GM", iso: "1600", shutterSpeed: "1/30s", aperture: "f/4.0"
  },
  { 
    id: 3, src: "/photos/3.jpg", 
    title: "Symphony of Light", 
    desc: "Nature and celebration collide in a single frame. The fireworks mirror the ephemeral beauty of blooming flowers.", 
    category: "Night Photography",
    location: "Kolkata, India",
    camera: "Canon EOS R5", lens: "RF 15-35mm F2.8 L", iso: "100", shutterSpeed: "4s", aperture: "f/8.0"
  },
  { 
    id: 5, src: "/photos/5.jpg", 
    title: "Still Waiting for Tomorrow", 
    desc: "A powerful portrait of urban invisibility. The elderly man and his dog exist in parallel with the rushing world behind them.", 
    category: "Street Photography",
    location: "Delhi, India",
    camera: "Fujifilm X-Pro3", lens: "XF 35mm F2 R WR", iso: "800", shutterSpeed: "1/250s", aperture: "f/2.0"
  },
  { 
    id: 6, src: "/photos/6.jpg", 
    title: "Golden Hour Commute", 
    desc: "The ordinary transformed by light. Morning mist and golden haze turn a mundane street into a cinematic dreamscape.", 
    category: "Street Photography",
    location: "Kolkata, India",
    camera: "Sony A7IV", lens: "FE 35mm F1.4 GM", iso: "100", shutterSpeed: "1/1000s", aperture: "f/1.4"
  },
  { 
    id: 7, src: "/photos/7.jpg", 
    title: "The Last Red of the Day", 
    desc: "The sun sinks behind wires and concrete, yet still finds space to glow.", 
    category: "Urban Landscapes",
    location: "Bangalore, India",
    camera: "Nikon Z7 II", lens: "NIKKOR Z 24-120mm f/4 S", iso: "200", shutterSpeed: "1/60s", aperture: "f/5.6"
  },
  { 
    id: 8, src: "/photos/8.jpg", 
    title: "Hooghly Serenity", 
    desc: "The iconic Vidyasagar Setu stands sentinel over the Hooghly River as fishermen continue their timeless practice.", 
    category: "Landscape Photography",
    location: "Kolkata, India",
    camera: "Sony A7R IV", lens: "FE 16-35mm F2.8 GM", iso: "100", shutterSpeed: "1/125s", aperture: "f/8.0"
  },
  { 
    id: 9, src: "/photos/9.jpg", 
    title: "Consuming Light", 
    desc: "In the darkness, fire becomes a living entity—breathing, moving, devouring.", 
    category: "Light Trails",
    location: "Jaipur, India",
    camera: "Canon EOS R6", lens: "RF 50mm F1.2 L", iso: "400", shutterSpeed: "1/50s", aperture: "f/1.2"
  },
  { 
    id: 10, src: "/photos/10.jpg", 
    title: "Solitary Path", 
    desc: "An empty lane bathed in nocturnal green—simultaneously inviting and isolating.", 
    category: "Night Photography",
    location: "Kolkata, India",
    camera: "Fujifilm X-T4", lens: "XF 18-55mm F2.8-4", iso: "3200", shutterSpeed: "1/15s", aperture: "f/2.8"
  },
  { 
    id: 11, src: "/photos/11.jpg", 
    title: "Last Light Over the Ganges", 
    desc: "A mesmerizing view of the sacred Ganges river bathed in the fading light of dusk.", 
    category: "Landscape Photography",
    location: "Varanasi, India",
    camera: "Unknown", lens: "Unknown", iso: "Auto", shutterSpeed: "Auto", aperture: "Auto"
  },
];

// Single Orbiting Photo Card (Outward facing, styled in 3D CSS3D space)
function OrbitingImageCard({ imageConfig, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const { photo, position, rotation, isMobile } = imageConfig;

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  return (
    <group position={position} rotation={rotation}>
      <Html 
        transform 
        distanceFactor={isMobile ? 4.5 : 5.5} 
        pointerEvents="auto"
      >
        <div 
          className={`three-orbit-card ${hovered ? 'hovered' : ''}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onSelect(photo)}
          style={{
            width: isMobile ? '200px' : '290px',
            height: isMobile ? '140px' : '200px',
            borderRadius: '24px',
            background: 'rgba(12, 9, 24, 0.92)',
            border: hovered ? '2px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: hovered 
              ? '0 0 30px rgba(0, 242, 254, 0.5)' 
              : '0 10px 25px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease',
            transform: hovered ? 'scale(1.12)' : 'scale(1)',
            cursor: 'pointer',
            padding: isMobile ? '4px' : '6px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            willChange: 'transform'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '18px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img 
              src={photo.src} 
              alt={photo.title} 
              loading="eager"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                pointerEvents: 'none'
              }} 
            />
            {/* Hover overlay text */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8, 6, 16, 0.9) 0%, rgba(8, 6, 16, 0) 70%)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '16px',
              boxSizing: 'border-box',
              color: '#fff',
              fontFamily: 'Syne, sans-serif',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#00f2fe', fontWeight: 700, letterSpacing: '1px' }}>{photo.category}</span>
              <h4 style={{ fontSize: '0.95rem', margin: '4px 0 0', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{photo.title}</h4>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Particle Sphere and Orbiting Images Combined Scene (High Performance Instanced Points)
function ParticleGalleryScene({ photosList, isMobile, onSelect }) {
  const groupRef = useRef();

  const PARTICLE_COUNT = isMobile ? 250 : 500;
  const SPHERE_RADIUS = isMobile ? 6 : 9;
  const POSITION_RANDOMNESS = isMobile ? 2.5 : 4;
  const ROTATION_SPEED_Y = 0.001;

  // Single Instanced Points Geometry (1 draw call for all particles)
  const particlesGeometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const colorPalette = [
      new THREE.Color('#00f2fe'),
      new THREE.Color('#3b82f6'),
      new THREE.Color('#8a5cf6'),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS;

      positions[i * 3] = radiusVariation * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radiusVariation * Math.cos(phi);
      positions[i * 3 + 2] = radiusVariation * Math.sin(theta) * Math.sin(phi);

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [PARTICLE_COUNT, SPHERE_RADIUS, POSITION_RANDOMNESS]);

  // Generate orbiting images positions facing outward
  const orbitingImages = useMemo(() => {
    const images = [];
    const count = photosList.length;

    if (count === 0) return [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = SPHERE_RADIUS * Math.cos(angle);
      const y = 0;
      const z = SPHERE_RADIUS * Math.sin(angle);

      const position = new THREE.Vector3(x, y, z);
      const center = new THREE.Vector3(0, 0, 0);
      const outwardDirection = position.clone().sub(center).normalize();

      const euler = new THREE.Euler();
      const matrix = new THREE.Matrix4();
      matrix.lookAt(position, position.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0));
      euler.setFromRotationMatrix(matrix);

      images.push({
        photo: photosList[i],
        position: [x, y, z],
        rotation: [euler.x, euler.y, euler.z],
        isMobile: isMobile
      });
    }

    return images;
  }, [photosList, SPHERE_RADIUS, isMobile]);

  // Rotate group slowly
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += ROTATION_SPEED_Y;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1 WebGL Draw Call Instanced Particle Starfield */}
      <points geometry={particlesGeometry}>
        <pointsMaterial
          size={isMobile ? 0.1 : 0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Orbiting Images */}
      {orbitingImages.map((image, index) => (
        <OrbitingImageCard 
          key={`img-${image.photo.id}-${index}`} 
          imageConfig={image} 
          onSelect={onSelect} 
        />
      ))}
    </group>
  );
}

// Main Component
export default function Gallery() {
  const [photosList, setPhotosList] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const canvasContainerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Pause WebGL rendering loop when section is not in viewport
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Load photos database
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

  // Screen resizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lightbox navigation
  const handleLightboxNext = useCallback(() => {
    setSelectedPhoto(prev => {
      if (!prev) return null;
      const idx = photosList.findIndex(p => p.id === prev.id);
      if (idx === -1) return null;
      return photosList[(idx + 1) % photosList.length];
    });
  }, [photosList]);

  const handleLightboxPrev = useCallback(() => {
    setSelectedPhoto(prev => {
      if (!prev) return null;
      const idx = photosList.findIndex(p => p.id === prev.id);
      if (idx === -1) return null;
      return photosList[(idx - 1 + photosList.length) % photosList.length];
    });
  }, [photosList]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (selectedPhoto) {
        if (e.key === 'ArrowRight') handleLightboxNext();
        if (e.key === 'ArrowLeft') handleLightboxPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedPhoto, handleLightboxNext, handleLightboxPrev]);

  return (
    <section id="photography" className="page-section 3d-gallery-root">
      
      {/* ── SECTION HEADER ── */}
      <div className="gallery-header-wrapper">
        <motion.div 
          className="section-header" 
          style={{ marginBottom: '20px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Cinematic <span>Photography</span>
          </h2>
          <div className="section-line" />
          <p className="section-sub">
            Drag to orbit the 3D gallery. Click any photo to inspect full details.
          </p>
        </motion.div>
      </div>

      {/* ── 3D CANVAS WRAPPER ── */}
      <div className="canvas-container" ref={canvasContainerRef}>
        <Suspense fallback={null}>
          <Canvas
            frameloop={isInView ? "always" : "never"}
            camera={{ position: [-10, 1.5, 10], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            
            <ParticleGalleryScene 
              photosList={photosList} 
              isMobile={isMobile} 
              onSelect={setSelectedPhoto} 
            />

            <OrbitControls 
              enablePan={false} 
              enableZoom={false} 
              enableRotate={true} 
              rotateSpeed={0.5}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* ── PREMIUM LIGHTBOX VIEWER MODAL ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            className="premium-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="lightbox-backdrop" onClick={() => setSelectedPhoto(null)} />

            {/* Lightbox Content Container */}
            <motion.div 
              className="lightbox-box"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
            >
              {/* Close Button */}
              <button className="lightbox-close-btn" onClick={() => setSelectedPhoto(null)} aria-label="Close lightbox">
                <LucideX size={20} />
              </button>

              {/* Navigation Buttons */}
              <button className="lightbox-nav-btn prev" onClick={handleLightboxPrev} aria-label="Previous image">
                <LucideChevronLeft size={28} />
              </button>
              <button className="lightbox-nav-btn next" onClick={handleLightboxNext} aria-label="Next image">
                <LucideChevronRight size={28} />
              </button>

              {/* Layout Content */}
              <div className="lightbox-body">
                {/* Image Section */}
                <div className="lightbox-image-section">
                  <img src={selectedPhoto.src} alt={selectedPhoto.title} />
                </div>

                {/* Details Section */}
                <div className="lightbox-details-section">
                  <div className="details-header">
                    <span className="details-category-badge">{selectedPhoto.category}</span>
                    <h2 className="details-title">{selectedPhoto.title}</h2>
                  </div>

                  <p className="details-description">{selectedPhoto.desc}</p>

                  {/* EXIF Information Grid */}
                  <div className="exif-grid-layout">
                    <div className="exif-cell">
                      <div className="exif-cell-label"><LucideMapPin size={13} /> Location</div>
                      <div className="exif-cell-value">{selectedPhoto.location}</div>
                    </div>
                    <div className="exif-cell">
                      <div className="exif-cell-label"><LucideCamera size={13} /> Camera</div>
                      <div className="exif-cell-value">{selectedPhoto.camera}</div>
                    </div>
                    <div className="exif-cell">
                      <div className="exif-cell-label"><LucideFocus size={13} /> Lens</div>
                      <div className="exif-cell-value">{selectedPhoto.lens}</div>
                    </div>
                    <div className="exif-cell">
                      <div className="exif-cell-label"><LucideAperture size={13} /> Settings</div>
                      <div className="exif-cell-value">
                        {selectedPhoto.aperture} • {selectedPhoto.shutterSpeed} • ISO {selectedPhoto.iso}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}