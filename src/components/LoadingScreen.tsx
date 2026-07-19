import React from "react";
import { motion } from "motion/react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        exit={{
          scale: 0.15,
          x: "-44vw",
          y: "-42vh",
          opacity: 0,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        }}
        className="text-5xl font-bold tracking-tight text-white sm:text-7xl"
      >
        velixo<span className="text-electric-blue">.io</span>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="absolute bottom-0 left-0 h-[3px] w-full bg-electric-blue"
      />
    </motion.div>
  );
}
