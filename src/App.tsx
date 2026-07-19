"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence } from "motion/react";

import { LoadingScreen } from "./components/LoadingScreen";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { Header } from "./components/sections/Header";
import { HeroScrollFrames } from "./components/sections/HeroScrollFrames";
import { ShowcaseIntro } from "./components/sections/ShowcaseIntro";
import { Marquee } from "./components/sections/Marquee";
import { Performance } from "./components/sections/Performance";
import { Design } from "./components/sections/Design";
import { Engine } from "./components/sections/Engine";
import { Technology } from "./components/sections/Technology";
import { ServicesShowcase } from "./components/sections/ServicesShowcase";
import { Gallery } from "./components/sections/Gallery";
import { Reviews } from "./components/sections/Reviews";
import { FAQ } from "./components/sections/FAQ";
import { CTA } from "./components/sections/CTA";
import { Footer } from "./components/sections/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const readyRef = useRef(false);
  const minTimeRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      minTimeRef.current = true;
      if (readyRef.current) {
        setLoading(false);
        document.body.classList.add('hero-ready');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleHeroReady = useCallback(() => {
    readyRef.current = true;
    if (minTimeRef.current) {
      setLoading(false);
      document.body.classList.add('hero-ready');
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleHeroReady} />}
      </AnimatePresence>
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <HeroScrollFrames onReady={handleHeroReady} />
        <div id="content-wrapper" className="relative z-10 rounded-t-[2rem] bg-white" style={{ marginTop: "-2rem" }}>
          <ShowcaseIntro />
          <Marquee />
          <Performance />
          <Design />
          <Engine />
          <Technology />
          <ServicesShowcase />
          <Gallery />
          <Reviews />
          <FAQ />
          <CTA />
        </div>
      </main>
      <Footer />
    </>
  );
}

