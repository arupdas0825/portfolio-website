import React from "react";
import { motion } from "framer-motion";

export const ScrollAnimatedSection = React.memo(function ScrollAnimatedSection({
  children,
  className = "",
  intensity = "medium", // "subtle" | "medium" | "strong"
}) {
  const presets = {
    subtle: { y: 12 },
    medium: { y: 16 },
    strong: { y: 20 },
  }[intensity] || { y: 16 };

  return (
    <motion.div
      initial={{ opacity: 0, y: presets.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "150px 0px 50px 0px" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default ScrollAnimatedSection;

