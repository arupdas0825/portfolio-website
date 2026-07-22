import React from "react";
import { motion } from "framer-motion";

export const ScrollAnimatedSection = React.memo(function ScrollAnimatedSection({
  children,
  className = "",
  intensity = "medium", // "subtle" | "medium" | "strong"
}) {
  const presets = {
    subtle: { y: 24 },
    medium: { y: 36 },
    strong: { y: 48 },
  }[intensity] || { y: 36 };

  return (
    <motion.div
      initial={{ opacity: 0, y: presets.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default ScrollAnimatedSection;

