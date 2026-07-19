import React, { useState } from "react";
import { ArrowRight, Instagram, Linkedin } from "lucide-react";
import { Link } from "../ui/Link";

export function Footer() {
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
    <footer id="contact" className="border-t border-neutral-800 bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Link href="/" className="flex items-center text-xl font-bold tracking-tight text-white">
              velixo<span className="text-electric-blue">.io</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
              Our services are distinguished by quality, fast delivery, and after-sales support. We can create anything, regardless of the type of service you provide. Just get in touch with us.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Get in touch</h4>
            <p className="mt-3 text-sm text-neutral-500">
              Send us a message and we'll get back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-1 rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-electric-blue focus:outline-none"
              />
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-electric-blue px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-electric-blue-bright disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
            {formStatus && (
              <p className={`mt-3 text-sm ${formStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {formStatus.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-all duration-300 hover:border-electric-blue hover:text-electric-blue hover:scale-110"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-all duration-300 hover:border-electric-blue hover:text-electric-blue hover:scale-110"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.91l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-all duration-300 hover:border-electric-blue hover:text-electric-blue hover:scale-110"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
