import React, { useEffect, useRef, useState } from "react";
import { IMAGES } from "../../lib/images";
import { heroPoster } from "../../lib/hero-poster";

/* ──────────────────────────────────────────────
   Hero: scroll-scrubbed frame sequence (174 frames)
   ────────────────────────────────────────────── */
const TOTAL_FRAMES = 174;
export function HeroScrollFrames({ onReady }: { onReady?: () => void }) {
  const containerRef = useRef<HTMLElement>(document.getElementById("overview")!);
  const stickyRef = useRef<HTMLElement>(document.getElementById("hero-sticky")!);
  const canvasRef = useRef<HTMLCanvasElement>(document.getElementById("hero-canvas") as HTMLCanvasElement);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const layoutRef = useRef({ sectionTop: 0, scrollDist: 0, mobile: false });
  const [currentFrame, setCurrentFrame] = useState(1);

  const heroManifest = IMAGES.hero;

  // Pick desktop vs mobile frame src based on the cached viewport class.
  const frameSrc = (index: number, fmt: "avif" | "webp"): string => {
    const f = heroManifest.frames[index];
    if (!f) return "";
    const set = layoutRef.current.mobile ? f.mobile : f.desktop;
    return set[fmt];
  };

  const measureLayout = () => {
    const section = containerRef.current;
    const sticky = stickyRef.current;
    if (!section) return;
    // Derive the scrub travel from the sticky element's actual scroll range rather than a
    // fixed `innerHeight * 6` multiple, so it stays correct when the mobile address bar
    // show/hide resizes the viewport mid-scroll (FR-003/FR-005, R1).
    const stickyHeight = sticky ? sticky.getBoundingClientRect().height : window.innerHeight;
    layoutRef.current.sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const totalScroll = section.offsetHeight - stickyHeight;
    // Mobile gets a slightly snappier, shorter scrub tuned for short/wide phone viewports
    // (not a uniform scale-down of desktop) — FR-001/R1.
    layoutRef.current.mobile = window.innerWidth < 768;
    const mobileFactor = layoutRef.current.mobile ? 0.85 : 1;
    layoutRef.current.scrollDist = Math.max(1, totalScroll * mobileFactor);
  };

  // Lazy frame loader: only the poster + a small initial window get .src up front,
  // so the hero does not fire 174 parallel requests (which kills LCP on slow networks).
  // Frames further ahead are loaded on demand as the user scrolls near them.
  const INITIAL_WINDOW = 12;
  const LOAD_AHEAD = 8;

  const loadFrame = (images: HTMLImageElement[], i: number, onReady?: () => void) => {
    const img = images[i];
    if (!img || (img as any).started || (img as any).canceled) return;
    (img as any).started = true;
    const avif = frameSrc(i, "avif");
    const webp = frameSrc(i, "webp");
    img.onload = () => {
      (img as any).ready = true;
      decodeFrame(img);
      if (currentFrameRef.current === i) {
        drawFrame(i);
      }
      onReady?.();
    };
    img.onerror = () => {
      if (!(img as any).triedWebp && webp) {
        (img as any).triedWebp = true;
        img.src = webp;
      } else {
        (img as any).failed = true;
        onReady?.();
      }
    };
    img.src = avif;
  };

  useEffect(() => {
    measureLayout();
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) images[i] = new Image();
    imagesRef.current = images;

    let readyFired = false;
    const fireReady = () => {
      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
    };

    // Pre-populate frame 0 with an inlined base64 poster so the LCP candidate
    // paints instantly from memory — zero network round-trip.
    images[0].src = heroPoster;
    const drawPoster = () => drawFrame(0);
    if (images[0].complete) {
      drawPoster();
    } else {
      images[0].onload = drawPoster;
    }
    // Safety: draw poster even if onload doesn't fire (e.g., cached base64).
    setTimeout(drawPoster, 50);

    // Warm a small initial window so early scrolling is smooth.
    let warmed = 0;
    const total = Math.min(INITIAL_WINDOW, TOTAL_FRAMES - 1);
    const onWarm = () => {
      warmed++;
      if (warmed >= total) fireReady();
    };
    for (let i = 1; i <= INITIAL_WINDOW && i < TOTAL_FRAMES; i++) loadFrame(images, i, onWarm);
    const safety = setTimeout(() => fireReady(), 2500);
    return () => {
      clearTimeout(safety);
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady]);

  // Ensure the frame we're about to draw (and a decode-ahead window) is loaded.
  // Decode-ahead keeps frames ready before a fast touch fling reaches them so the
  // visible frame never lags >1 frame behind (FR-002/FR-006, R3).
  const ensureFramesLoaded = (center: number) => {
    const images = imagesRef.current;
    if (!images.length) return;
    // Cancel preloads that are now far behind the scroll position (free decode bandwidth).
    for (let i = 0; i < center - (LOAD_AHEAD + 4); i++) {
      (images[i] as any).canceled = true;
    }
    for (let i = Math.max(0, center - 1); i <= Math.min(TOTAL_FRAMES - 1, center + LOAD_AHEAD); i++) {
      loadFrame(images, i);
    }
  };

  // Pre-decode an image element so it is paint-ready without blocking the scroll frame.
  const decodeFrame = (img: HTMLImageElement) => {
    if ((img as any).decoded || (img as any).failed || (img as any).canceled) return;
    if (typeof img.decode === "function") {
      img
        .decode()
        .then(() => {
          (img as any).decoded = true;
        })
        .catch(() => {
          /* decode is best-effort; onload still fires for paint */
        });
    }
  };

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Only resize the canvas buffer if the window size actually changed. 
    // This dramatically improves scrolling smoothness and avoids pixelation.
    const targetW = Math.floor(w * dpr);
    const targetH = Math.floor(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    // Reset transform matrix and apply high DPI and crisp smoothing options
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const img = imagesRef.current[index];
    if (!img || !img.complete || (img as any).failed) {
      return;
    }

    // Cover fit
    const imgRatio = img.width / img.height;
    const screenRatio = w / h;
    let drawW = w;
    let drawH = h;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > screenRatio) {
      drawH = h;
      drawW = h * imgRatio;
      offsetX = (w - drawW) / 2;
    } else {
      drawW = w;
      drawH = w / imgRatio;
      offsetY = (h - drawH) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  // ── Scroll-driven frame animation (CSS sticky → no GSAP pin) ──
  // rAF-coalesced: scroll only sets a dirty flag; one update per animation frame (FR-006).
  useEffect(() => {
    // Respect reduced-motion: show a static poster, no scrub loop (accessibility).
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      drawFrame(0);
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const { sectionTop, scrollDist } = layoutRef.current;
      if (!scrollDist) return;
      const scrollY = window.scrollY;
      const progress = Math.max(0, Math.min(1, (scrollY - sectionTop) / scrollDist));
      // Clamped Math.round mapping — no sub-pixel interpolation (FR-002/R4).
      const frameIndex = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1)))
      );
      ensureFramesLoaded(frameIndex);
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        setCurrentFrame(frameIndex + 1);
        drawFrame(frameIndex);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw on resize / mobile address-bar show-hide (re-measure layout, re-pick frame).
  useEffect(() => {
    let resizeRaf = 0;
    const handleResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        measureLayout();
        const frameIndex = Math.min(currentFrameRef.current, TOTAL_FRAMES - 1);
        drawFrame(frameIndex);
      });
    };
    window.addEventListener("resize", handleResize);
    // VisualViewport resize fires when the mobile address bar changes the viewport.
    // Avoid VisualViewport scroll here: it can fire during touch scrolling and would
    // reintroduce layout reads into the scroll path (FR-005/R1).
    const vv = window.visualViewport;
    vv?.addEventListener("resize", handleResize);
    return () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", handleResize);
      vv?.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
