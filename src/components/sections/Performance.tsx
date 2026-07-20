import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ResponsiveImage } from "../ResponsiveImage";
import { useIsMobile } from "../../hooks/useIsMobile";
import { performanceSpecs } from "../../data";

export function Performance() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section id="performance" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[15%] h-[130%]">
        <ResponsiveImage name={isMobile ? "performance-mobile" : "section3"} alt="" widthsAttr="100vw" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold tracking-widest text-electric-blue"
          >
            PERFORMANCE
          </motion.p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Numbers that speak for themselves
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Every figure is a result of relentless motorsport engineering and
            decades of racing heritage.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {performanceSpecs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-blue/10 text-electric-blue">
                {spec.icon}
              </div>
              <div className="perf-number text-5xl font-extrabold text-white">
                {spec.value}
              </div>
              <div className="mt-1 text-sm text-neutral-500">{spec.unit}</div>
              <div className="mt-3 text-sm font-medium tracking-wide text-neutral-300">
                {spec.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
