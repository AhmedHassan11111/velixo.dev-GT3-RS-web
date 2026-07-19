import React from "react";
import { motion } from "motion/react";
import { getContentImage } from "../../lib/images";
import { techFeatures } from "../../data";

export function Technology() {
  return (
    <section id="technology" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold tracking-widest text-electric-blue"
          >
            TECHNOLOGY
          </motion.p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Engineered for the apex
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Race-borne technology adapted for the road. Every system works in
            harmony to deliver pure driving precision.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {techFeatures.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -14, scale: 1.03 }}
              className="group relative min-h-[420px] cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-lg transition-all duration-500 hover:border-electric-blue hover:shadow-2xl hover:shadow-electric-blue/10"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                  backgroundImage: `url(${getContentImage(item.image)?.variants.at(-1)?.webp ?? `/${item.image}.jpg`})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />

              <div className="relative z-10 flex h-full flex-col justify-end p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-blue/20 text-electric-blue transition-all duration-300 group-hover:scale-110 group-hover:bg-electric-blue group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
