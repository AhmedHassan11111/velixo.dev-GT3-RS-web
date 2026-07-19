import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ResponsiveImage } from "../ResponsiveImage";

export function ServicesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const img1Scale = useTransform(scrollYProgress, [0, 0.45], [1, 0.5]);
  const img234Opacity = useTransform(scrollYProgress, [0.2, 0.45, 0.5, 1], [0, 1, 1, 1]);
  const img234Scale = useTransform(scrollYProgress, [0.2, 0.45], [0.5, 1]);

  return (
    <>
      <div className="h-px w-full bg-neutral-300" />

      <section className="flex h-[50vh] items-center justify-center bg-black px-8 py-16">
        <p className="max-w-3xl text-center text-lg font-light tracking-wide leading-relaxed text-neutral-300 sm:text-xl lg:text-2xl">
          &ldquo;Our web services are not limited to cars only; they can be tailored to anything you want, no matter what it is.&rdquo;
        </p>
      </section>

      <div className="h-px w-full bg-neutral-300" />

      <section id="configure" ref={containerRef} className="relative h-[250vh] bg-neutral-900">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.div
            className="absolute inset-0 z-10"
            style={{ scale: img1Scale, transformOrigin: "top left" }}
          >
            <ResponsiveImage name="fhotoone" alt="Service showcase" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 z-20 h-full w-full"
            style={{ opacity: img234Opacity, scale: img234Scale, transformOrigin: "top right" }}
          >
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]">
              <div className="overflow-hidden" />
              <div className="overflow-hidden">
                <ResponsiveImage name="fhoto2" alt="Service showcase" className="h-full w-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <ResponsiveImage name="fhoto3" alt="Service showcase" className="h-full w-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <ResponsiveImage name="fhoto4" alt="Service showcase" className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
