import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export const ScrollAnimatedSection = React.memo(function ScrollAnimatedSection({
  children,
  className = "",
  intensity = "medium", // "subtle" | "medium" | "strong"
}) {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const touch = typeof window !== 'undefined' &&
        (window.matchMedia('(pointer: coarse)').matches ||
         'ontouchstart' in window ||
         navigator.maxTouchPoints > 0 ||
         window.innerWidth < 768);
      setIsMobile(touch);
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 25%"],
  });

  const presets = {
    subtle: { y: 30, scale: [0.98, 1], rotate: 2 },
    medium: { y: 50, scale: [0.95, 1], rotate: 4 },
    strong: { y: 70, scale: [0.90, 1], rotate: 6 },
  }[intensity] || { y: 50, scale: [0.95, 1], rotate: 4 };

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [presets.y, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], presets.scale);
  const rotateX = useTransform(scrollYProgress, [0, 1], [presets.rotate, 0]);

  if (isMobile) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: presets.y * 0.6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: presets.y * 0.6 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={className}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
        scale,
        rotateX,
        transformPerspective: 1200,
        willChange: 'transform, opacity',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default ScrollAnimatedSection;
