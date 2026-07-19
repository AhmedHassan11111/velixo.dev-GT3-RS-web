import React from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] bg-electric-blue"
    />
  );
}
