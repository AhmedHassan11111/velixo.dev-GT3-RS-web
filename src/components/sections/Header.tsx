import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link } from "../ui/Link";
import { navLinks } from "../../data";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById("overview");
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        // rect.bottom represents the bottom bounds of the hero container
        setInHero(rect.bottom > 50);
      } else {
        setInHero(window.scrollY < window.innerHeight * 7);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 z-50 w-full border-b border-transparent bg-transparent transition-all duration-500 ${inHero ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center text-xl font-bold tracking-tight text-white">
          velixo<span className="text-electric-blue">.io</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-400 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="#contact"
            className="rounded-full bg-electric-blue px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-electric-blue-bright"
          >
            Build & Order
          </Link>
        </div>

        <button
          className="rounded-md p-2 text-white lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-neutral-800 bg-black lg:hidden"
        >
          <nav className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-electric-blue px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Build & Order
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
