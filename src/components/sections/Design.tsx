import React from "react";
import { motion } from "motion/react";
import { ResponsiveImage } from "../ResponsiveImage";
import { designFeatures } from "../../data";

export function Design() {
  return (
    <section id="design" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-bold tracking-widest text-electric-blue">DESIGN</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Form follows <span className="font-serif italic text-electric-blue">function</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-600">
              Every vent, every wing, every surface serves a purpose. The GT3 RS
              is sculpted by the wind tunnel and validated on the racetrack.
            </p>
            <div className="mt-8 space-y-4">
              {designFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-xl bg-electric-blue/5 p-5"
                >
                  <h3 className="text-lg font-semibold text-neutral-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl aspect-[4/3] lg:aspect-auto lg:h-full"
          >
            <ResponsiveImage
              name="section4"
              alt="Portfolio showcase"
              widthsAttr="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm font-medium tracking-widest text-electric-blue">AERODYNAMICS</p>
              <p className="mt-1 text-2xl font-bold text-white">Active rear wing with DRS</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
