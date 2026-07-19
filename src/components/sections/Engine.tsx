import React from "react";
import { motion } from "motion/react";
import { engineSpecs } from "../../data";

export function Engine() {
  return (
    <section id="engine" className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold tracking-widest text-electric-blue"
          >
            POWERTRAIN
          </motion.p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The heart of a racer
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            A naturally aspirated 4.0-liter flat-six that revs to 9,000 rpm —
            derived directly from the 911 RSR GT racing car.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 overflow-hidden rounded-2xl border border-neutral-800"
        >
          <table className="w-full text-left">
            <tbody>
              {engineSpecs.map((spec, i) => (
                <motion.tr
                  key={spec.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={i % 2 === 0 ? "bg-neutral-900/50" : "bg-black"}
                >
                  <td className="px-6 py-4 text-sm font-medium text-neutral-400">
                    {spec.label}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-white">
                    {spec.value}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
