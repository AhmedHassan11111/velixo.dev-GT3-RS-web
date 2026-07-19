import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "../ui/Link";

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 0]);
  const [formStatus, setFormStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    const form = e.currentTarget;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    const honeypotInput = form.querySelector('input[name="honeypot"]') as HTMLInputElement;

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.value,
          honeypot: honeypotInput.value,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'accepted') {
        setFormStatus({ type: 'success', message: data.message });
        emailInput.value = '';
        honeypotInput.value = '';
      } else {
        setFormStatus({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch {
      setFormStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-24 sm:py-32">
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-blue/20 blur-[100px]"
      />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Make your website more elegant and modern.
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 text-lg text-neutral-400"
        >
          Your website is the mirror that reflects your product's identity. Don't hesitate to make it modern and premium.
        </motion.p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-electric-blue px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-electric-blue-bright"
          >
            Build & Order
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-700 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Send Message
            <Phone className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
