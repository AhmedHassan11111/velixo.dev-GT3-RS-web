import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ResponsiveImage } from "../ResponsiveImage";
import { reviews } from "../../data";

export function Reviews() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-24 sm:py-32">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[20%] h-[140%]">
        <ResponsiveImage name="white" alt="" widthsAttr="100vw" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold tracking-widest text-electric-blue"
          >
            REVIEWS
          </motion.p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The critics agree
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 40, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "bottom" }}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8"
            >
              <p className="text-sm font-bold tracking-widest text-electric-blue">
                {review.role}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-neutral-300">
                &ldquo;{review.quote}&rdquo;
              </p>
              <p className="mt-6 font-semibold text-white">— {review.name}</p>
            </motion.div>
          ))}
        </div>
        </div>
      </section>
  );
}
