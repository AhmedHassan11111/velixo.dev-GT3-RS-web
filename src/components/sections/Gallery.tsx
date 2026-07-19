import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ResponsiveImage } from "../ResponsiveImage";

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <section id="gallery" ref={ref} className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Every angle, perfection
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-lg font-light tracking-wide leading-relaxed text-neutral-400"
          >
            Showcase all the elements of your product with clarity and a modern touch, while still allowing customers to choose the price.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(15px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 overflow-hidden rounded-2xl"
          style={{ padding: "0 20px" }}
        >
          <motion.div
            style={{ y: imgY, scale: imgScale }}
            className="h-[50vh] min-h-[400px] md:h-[calc(100vh-10px)] md:min-h-[70vh] w-full"
          >
            <ResponsiveImage
              name="dark"
              alt="Showcase"
              className="h-full w-full rounded-2xl object-cover object-[center_60%]"
              widthsAttr="(max-width:768px) 100vw, 80vw"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
