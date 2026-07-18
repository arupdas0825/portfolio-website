"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- Reusable wrapper: wrap ANY section in this to get the same scroll animation ---
export const ScrollAnimatedSection = ({
  children,
  className = "",
  intensity = "medium", // "subtle" | "medium" | "strong"
}) => {
  const ref = useRef(null);

  // tracks scroll progress specifically for THIS section:
  // 0 = section top just entered bottom of viewport
  // 1 = section top reached ~25% from top of viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 25%"],
  });

  const presets = {
    subtle: { y: 40, scale: [0.97, 1], rotate: 4 },
    medium: { y: 80, scale: [0.92, 1], rotate: 8 },
    strong: { y: 120, scale: [0.85, 1], rotate: 14 },
  }[intensity] || { y: 80, scale: [0.92, 1], rotate: 8 };

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [presets.y, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], presets.scale);
  const rotateX = useTransform(scrollYProgress, [0, 1], [presets.rotate, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
        scale,
        rotateX,
        transformPerspective: 1200,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimatedSection;
