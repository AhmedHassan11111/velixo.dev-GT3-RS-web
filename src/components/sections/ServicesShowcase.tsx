import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ResponsiveImage } from "../ResponsiveImage";

export function ServicesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Hero image ──────────────────────────────────────────────────
  // Scales from full-screen (1) down to the top-left quarter (0.5).
  // We clamp at 0.5 for the remainder of the scroll so it stays put.
  const img1Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.5]);

  // ── Image 2 – top-right, slides in from the right ───────────────
  // Starts fully offscreen to the right, then slides left into position.
  // Opacity and translateX are clamped to final values after 0.4.
  const img2Opacity = useTransform(scrollYProgress, [0.2, 0.38, 1], [0, 1, 1]);
  const img2X = useTransform(scrollYProgress, [0.2, 0.38, 1], ["100%", "0%", "0%"]);

  // ── Image 3 – bottom-left, slides in from the left ──────────────
  const img3Opacity = useTransform(scrollYProgress, [0.27, 0.43, 1], [0, 1, 1]);
  const img3X = useTransform(scrollYProgress, [0.27, 0.43, 1], ["-100%", "0%", "0%"]);

  // ── Image 4 – bottom-right, slides in from the bottom ───────────
  const img4Opacity = useTransform(scrollYProgress, [0.34, 0.50, 1], [0, 1, 1]);
  const img4Y = useTransform(scrollYProgress, [0.34, 0.50, 1], ["100%", "0%", "0%"]);

  return (
    <>
      <div className="h-px w-full bg-neutral-300" />

      <section className="flex h-[50vh] items-center justify-center bg-black px-8 py-16">
        <p className="max-w-3xl text-center text-lg font-light tracking-wide leading-relaxed text-neutral-300 sm:text-xl lg:text-2xl">
          &ldquo;Our web services are not limited to cars only; they can be tailored to anything you want, no matter what it is.&rdquo;
        </p>
      </section>

      <div className="h-px w-full bg-neutral-300" />

      {/*
        ── Configure section ─────────────────────────────────────────
        Layout goal: 4 equal-quarter grid
          ┌────────────┬────────────┐
          │  fhotoone  │  fhoto2   │
          │  (hero)    │  (→right) │
          ├────────────┼────────────┤
          │  fhoto3    │  fhoto4   │
          │  (←left)  │  (↑bottom)│
          └────────────┴────────────┘

        - fhotoone starts full-screen and scales down to the top-left quarter.
        - fhoto2 is already positioned at the top-right quarter and slides in from the right.
        - fhoto3 is at the bottom-left quarter and slides in from the left.
        - fhoto4 is at the bottom-right quarter and slides in from the bottom.
        - All images stay at 1 opacity once revealed — no disappearing.
      */}
      <section id="configure" ref={containerRef} className="relative h-[300vh] bg-neutral-900">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* ── Hero image: top-left quarter, scales down from full-screen ── */}
          <motion.div
            className="absolute top-0 left-0 z-10 h-screen w-screen"
            style={{ scale: img1Scale, transformOrigin: "top left" }}
          >
            <ResponsiveImage
              name="fhotoone"
              alt="Service showcase"
              widthsAttr="100vw"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* ── Image 2: top-right quarter, slides from the right ── */}
          <motion.div
            className="absolute top-0 right-0 z-20 h-1/2 w-1/2 overflow-hidden"
            style={{ opacity: img2Opacity, x: img2X }}
          >
            <ResponsiveImage
              name="fhoto2"
              alt="Service showcase"
              widthsAttr="50vw"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* ── Image 3: bottom-left quarter, slides from the left ── */}
          <motion.div
            className="absolute bottom-0 left-0 z-20 h-1/2 w-1/2 overflow-hidden"
            style={{ opacity: img3Opacity, x: img3X }}
          >
            <ResponsiveImage
              name="fhoto3"
              alt="Service showcase"
              widthsAttr="50vw"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* ── Image 4: bottom-right quarter, slides from the bottom ── */}
          <motion.div
            className="absolute bottom-0 right-0 z-20 h-1/2 w-1/2 overflow-hidden"
            style={{ opacity: img4Opacity, y: img4Y }}
          >
            <ResponsiveImage
              name="fhoto4"
              alt="Service showcase"
              widthsAttr="50vw"
              className="h-full w-full object-cover"
            />
          </motion.div>

        </div>
      </section>
    </>
  );
}
