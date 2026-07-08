"use client";

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import {
  ArrowRight,
  Gauge,
  Zap,
  Wind,
  Cog,
  Shield,
  Camera,
  Check,
  ChevronDown,
  Menu,
  X,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
} from "lucide-react";
import React, { useEffect, useRef, useState, ReactNode, MouseEventHandler } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Link({ href, children, className, onClick, ...props }: { href: string; children: ReactNode; className?: string; onClick?: MouseEventHandler<HTMLAnchorElement>; [key: string]: any }) {
  return (
    <a href={href} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  );
}

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Performance", href: "#performance" },
  { label: "Design", href: "#design" },
  { label: "Engine", href: "#engine" },
  { label: "Technology", href: "#technology" },
  { label: "Configure", href: "#configure" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

const performanceSpecs = [
  { icon: <Zap className="h-6 w-6" />, label: "Power", value: "518", unit: "hp" },
  { icon: <Gauge className="h-6 w-6" />, label: "0–100 km/h", value: "3.2", unit: "seconds" },
  { icon: <Wind className="h-6 w-6" />, label: "Downforce", value: "900", unit: "kg at 285 km/h" },
  { icon: <Cog className="h-6 w-6" />, label: "Top Speed", value: "296", unit: "km/h" },
];

const designFeatures = [
  {
    title: "Aerodynamic Dominance",
    description:
      "The DRS-inspired rear wing and active aerodynamics generate up to 900 kg of downforce — twice that of the previous generation.",
  },
  {
    title: "Lightweight Construction",
    description:
      "Carbon fiber reinforced plastic (CFRP) on the doors, roof, front fenders, and rear seat deletion saves 40 kg versus the GT3.",
  },
  {
    title: "Track-Focused Cockpit",
    description:
      "The interior mirrors a race car: bucket seats, Alcantara steering wheel, and a shift lever positioned directly on the center console.",
  },
];

const engineSpecs = [
  { label: "Engine Type", value: "4.0L naturally aspirated flat-six" },
  { label: "Max Power", value: "518 hp at 8,500 rpm" },
  { label: "Max Torque", value: "465 Nm at 6,300 rpm" },
  { label: "Redline", value: "9,000 rpm" },
  { label: "Transmission", value: "7-speed PDK dual-clutch" },
  { label: "Drivetrain", value: "Rear-wheel drive" },
  { label: "Weight", value: "1,450 kg (DIN)" },
  { label: "Power-to-Weight", value: "357 hp per tonne" },
];

const techFeatures = [
  {
    icon: <Cog className="h-6 w-6" />,
    title: "PASM Suspension",
    description:
      "Active suspension management with adjustable dampers and a fully ball-jointed suspension for track-day precision.",
    image: "/tech-pasm.jpg",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "PSM Sport",
    description:
      "Porsche Stability Management with track mode and PSM Sport for controlled drifts on closed circuits.",
    image: "/thirdcard.jpg",
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Lap Timer & Telemetry",
    description:
      "Built-in lap timer with GPS tracking and real-time telemetry displayed on the 10.9-inch PCM screen.",
    image: "/tech-telemetry.jpg",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "DRS System",
    description:
      "Drag Reduction System borrowed from Formula 1 — adjust the rear wing angle at the push of a button.",
    image: "/tech-drs.jpg",
  },
];

const colorOptions = [
  { name: "Guards Red", hex: "#d5001c" },
  { name: "Carrara White", hex: "#f0f0f0" },
  { name: "Jet Black", hex: "#0a0a0a" },
  { name: "Shark Blue", hex: "#2d4a6b" },
  { name: "Python Green", hex: "#c8d600" },
  { name: "GT Silver", hex: "#c0c0c0" },
];

const galleryImages = [
  { label: "Front Quarter", frame: "ezgif-frame-001.jpg" },
  { label: "Side Profile", frame: "ezgif-frame-045.jpg" },
  { label: "Rear Wing", frame: "ezgif-frame-090.jpg" },
  { label: "Cockpit", frame: "ezgif-frame-130.jpg" },
  { label: "Action Shot", frame: "ezgif-frame-160.jpg" },
  { label: "Detail", frame: "ezgif-frame-174.jpg" },
];

const reviews = [
  {
    name: "Car and Driver",
    role: "10/10 Rating",
    quote:
      "The GT3 RS is the most extreme road-legal 911 ever built. It blurs the line between track car and street car like nothing else.",
  },
  {
    name: "Top Gear",
    role: "5 Stars",
    quote:
      "Porsche has created a masterpiece. The aerodynamics, the engine note, the precision — it's a symphony of engineering.",
  },
  {
    name: "Motor Trend",
    role: "Best Driver's Car",
    quote:
      "Nothing on four wheels communicates with the driver like the GT3 RS. It's a visceral, emotional experience every time.",
  },
];

const faqs = [
  {
    question: "What makes the GT3 RS different from the GT3?",
    answer:
      "The GT3 RS features aggressive active aerodynamics generating 900 kg of downforce, extensive CFRP lightweight construction, a wider track, and a DRS system — making it significantly faster on track while remaining road-legal.",
  },
  {
    question: "Is the GT3 RS street legal?",
    answer:
      "Yes. The 911 GT3 RS is fully homologated for road use worldwide, while being developed primarily for track performance. It meets all emissions and safety regulations.",
  },
  {
    question: "What is the Nürburgring lap time?",
    answer:
      "The GT3 RS completed the Nürburgring Nordschleife in 6:49.328 — making it one of the fastest production cars ever to lap the Green Hell.",
  },
  {
    question: "How much does the GT3 RS cost?",
    answer:
      "The base price starts at $241,300 USD. With Weissach package, custom colors, and options, the price can exceed $300,000. Contact your Porsche dealer for detailed pricing.",
  },
  {
    question: "Can I daily drive the GT3 RS?",
    answer:
      "While street-legal and equipped with climate control and a sound system, the GT3 RS is tuned for the track. The ride is firm and the bucket seats are fixed — it's best enjoyed as a weekend or track-day car.",
  },
];

/* Helper for directories and automatic error-recovery of missing files */
let globalImageDir = "/ezgif-85116182a5dc7c12-jpg";

export function getImgDir() {
  if (typeof window !== "undefined") {
    return (window as any).__porscheImgDir || globalImageDir;
  }
  return globalImageDir;
}

export function setImgDir(dir: string) {
  globalImageDir = dir;
  if (typeof window !== "undefined") {
    (window as any).__porscheImgDir = dir;
  }
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const currentSrc = e.currentTarget.src;
  const currentDir = getImgDir();
  
  if (currentDir === "/ezgif-85116182a5dc7c12-jpg") {
    setImgDir("/herosection");
    e.currentTarget.src = currentSrc.replace("/ezgif-85116182a5dc7c12-jpg/", "/herosection/");
  } else {
    setImgDir("/ezgif-85116182a5dc7c12-jpg");
    e.currentTarget.src = currentSrc.replace("/herosection/", "/ezgif-85116182a5dc7c12-jpg/");
  }
}

/* ──────────────────────────────────────────────
   Hero: scroll-scrubbed frame sequence (174 frames)
   ────────────────────────────────────────────── */
const TOTAL_FRAMES = 174;

function drawProceduralFallback(ctx: CanvasRenderingContext2D, index: number, w: number, h: number) {
  // 1. Dark professional futuristic background
  ctx.fillStyle = "#0c0c0e";
  ctx.fillRect(0, 0, w, h);

  // Radial highlight
  const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
  grad.addColorStop(0, "#1c1214"); // extremely subtle red/burgundy tint
  grad.addColorStop(1, "#070708");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const progress = index / (TOTAL_FRAMES - 1); // 0.0 to 1.0

  // 2. Performance HUD Grid (Ground Grid)
  ctx.strokeStyle = "rgba(213, 0, 28, 0.08)"; // Guards Red accent at low opacity
  ctx.lineWidth = 1;
  const gridCols = 24;
  const gridRows = 16;
  const scrollOffset = (progress * 500) % 40;

  ctx.save();
  ctx.beginPath();
  for (let i = 0; i <= gridCols; i++) {
    const x = (w / gridCols) * i;
    ctx.moveTo(x, h * 0.45);
    ctx.lineTo((x - w / 2) * 2.5 + w / 2, h);
  }
  for (let i = 0; i <= gridRows; i++) {
    const y = h * 0.45 + (h * 0.55 / gridRows) * i + scrollOffset * (i / gridRows);
    if (y <= h) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // 3. Telemetry and Gauge Overlays
  const speed = Math.round(progress * 296);
  const rpm = Math.round(800 + progress * 8200);
  const downforce = Math.round(progress * 900);
  const drsActive = progress > 0.45 && progress < 0.85;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "bold 11px 'JetBrains Mono', monospace";
  ctx.fillText("PORSCHE TELEMETRY SYSTEM v9.11", 40, 60);

  // Digital lateral data panel
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText("SYSTEM STATUS: NOMINAL (SIMULATOR MODE)", 40, 85);
  ctx.fillText(`ACTIVE FRAME: ${String(index + 1).padStart(3, "0")} / ${TOTAL_FRAMES}`, 40, 100);
  ctx.fillText(`WIND TUNNEL SPEED: 285 KM/H`, 40, 115);
  ctx.fillText(`DOWNFORCE: ${downforce} KG`, 40, 130);

  // Active DRS indicator
  if (drsActive) {
    ctx.fillStyle = "#d5001c"; // Guards red
    ctx.fillRect(40, 145, 80, 18);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.fillText("DRS PASSIVE", 48, 157);
  } else {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.strokeRect(40, 145, 80, 18);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.fillText("DRS CLOSED", 48, 157);
  }

  // Interactive circular gauge for RPM
  const gaugeX = w - 100;
  const gaugeY = 85;
  const gaugeR = 40;
  ctx.beginPath();
  ctx.arc(gaugeX, gaugeY, gaugeR, Math.PI * 0.8, Math.PI * 2.2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 5;
  ctx.stroke();

  // RPM Dial fill
  const rpmAngle = Math.PI * 0.8 + (rpm / 9000) * (Math.PI * 1.4);
  ctx.beginPath();
  ctx.arc(gaugeX, gaugeY, gaugeR, Math.PI * 0.8, rpmAngle);
  ctx.strokeStyle = rpm > 8500 ? "#d5001c" : "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${rpm}`, gaugeX, gaugeY + 4);
  ctx.font = "8px 'Inter', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText("RPM", gaugeX, gaugeY + 14);
  ctx.restore();

  // Epic speed layout readout
  ctx.save();
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(213, 0, 28, 0.04)";
  ctx.font = "900 120px 'JetBrains Mono', monospace";
  ctx.fillText(`${speed}`, w - 40, h - 80);
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "bold 44px 'JetBrains Mono', monospace";
  ctx.fillText(`${speed}`, w - 75, h - 100);
  ctx.font = "14px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#d5001c";
  ctx.fillText("KM/H", w - 75, h - 80);
  ctx.restore();

  // 4. Drawing the Porsche Silhouette
  ctx.save();
  const cx = w / 2;
  const cy = h / 2 + 40;
  const carSize = Math.min(w * 0.55, 600);

  // Ground shadow
  const shadowGrad = ctx.createRadialGradient(cx, cy + 60, 5, cx, cy + 60, carSize * 0.6);
  shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.7)");
  shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(cx - carSize / 2, cy + 45, carSize, 25);

  // Wind tunnel active streamline flow lines (Neon turquoise curves)
  ctx.strokeStyle = "rgba(65, 195, 219, 0.4)"; // cyan airflow
  ctx.lineWidth = 1.5;
  for (let k = 0; k < 5; k++) {
    ctx.beginPath();
    const startY = cy - 70 + k * 25;
    const progressOffset = (Date.now() / 6) % 120;
    ctx.setLineDash([15, 35]);
    ctx.lineDashOffset = -progressOffset - (k * 30);
    
    ctx.moveTo(cx - carSize * 0.7, startY);
    ctx.bezierCurveTo(
      cx - carSize * 0.35, startY - 15,
      cx - carSize * 0.1, cy - 85 - (drsActive ? 15 : 0),
      cx + carSize * 0.1, cy - 85
    );
    ctx.bezierCurveTo(
      cx + carSize * 0.3, cy - 90,
      cx + carSize * 0.45, cy - 55 - (drsActive ? -10 : 10),
      cx + carSize * 0.65, cy - 25 + (drsActive ? 15 : 0)
    );
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Main sports car aerodynamic contour path (911 shape)
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 2.5;

  const startX = cx - carSize * 0.45;
  const floorY = cy + 40;

  ctx.moveTo(startX, floorY);
  ctx.lineTo(startX - 15, floorY - 5);
  ctx.lineTo(startX - 15, floorY - 18);
  ctx.bezierCurveTo(
    startX - 10, cy + 12,
    startX + 40, cy + 6,
    cx - carSize * 0.18, cy - 3
  );
  ctx.bezierCurveTo(
    cx - carSize * 0.12, cy - 22,
    cx - carSize * 0.05, cy - 46,
    cx, cy - 48
  );
  ctx.bezierCurveTo(
    cx + carSize * 0.08, cy - 50,
    cx + carSize * 0.22, cy - 38,
    cx + carSize * 0.32, cy - 8
  );
  ctx.lineTo(cx + carSize * 0.4, cy);
  ctx.lineTo(cx + carSize * 0.42, floorY - 15);
  ctx.lineTo(cx + carSize * 0.45, floorY - 15);
  ctx.lineTo(cx + carSize * 0.45, floorY);

  ctx.lineTo(cx + carSize * 0.3, floorY);
  ctx.arc(cx + carSize * 0.2, floorY, 32, 0, Math.PI, true);
  ctx.lineTo(cx - carSize * 0.1, floorY);
  ctx.arc(cx - carSize * 0.2, floorY, 32, 0, Math.PI, true);
  ctx.closePath();
  ctx.stroke();

  // Decal sticker line
  ctx.beginPath();
  ctx.strokeStyle = "#d5001c";
  ctx.lineWidth = 3;
  ctx.moveTo(cx - carSize * 0.12, cy + 24);
  ctx.lineTo(cx + carSize * 0.12, cy + 24);
  ctx.stroke();

  ctx.fillStyle = "#d5001c";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GT3 RS", cx, cy + 21);

  // Active massive rear performance spoiler
  ctx.save();
  const wingX = cx + carSize * 0.35;
  const wingY = cy - 48;
  ctx.translate(wingX, wingY);
  const wingAngle = drsActive ? -0.15 : 0.08;
  ctx.rotate(wingAngle);

  // Draw wing endplates & blade
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 2.5;
  ctx.moveTo(-30, -5);
  ctx.lineTo(30, -10);
  ctx.moveTo(30, -18);
  ctx.lineTo(30, 8);
  ctx.lineTo(18, 8);
  ctx.lineTo(18, -18);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "#d5001c";
  ctx.fillRect(-22, -8, 44, 4);
  ctx.restore();

  // Front spinning wheel
  ctx.save();
  ctx.translate(cx - carSize * 0.2, floorY);
  ctx.rotate(progress * Math.PI * 12);
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
  ctx.lineWidth = 3.5;
  ctx.stroke();
  for (let r = 0; r < 8; r++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(r * Math.PI / 4) * 28, Math.sin(r * Math.PI / 4) * 28);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 0.4);
  ctx.strokeStyle = "#d5001c";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  // Rear spinning wheel
  ctx.save();
  ctx.translate(cx + carSize * 0.2, floorY);
  ctx.rotate(progress * Math.PI * 12);
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
  ctx.lineWidth = 3.5;
  ctx.stroke();
  for (let r = 0; r < 8; r++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(r * Math.PI / 4) * 28, Math.sin(r * Math.PI / 4) * 28);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 0.4);
  ctx.strokeStyle = "#d5001c";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function HeroScrollFrames() {
  const containerRef = useRef<HTMLDivElement>(null);  // outer tall section (700vh)
  const stickyRef   = useRef<HTMLDivElement>(null);   // inner sticky card
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imagesRef   = useRef<HTMLImageElement[]>([]);
  const stackOverlayRef = useRef<HTMLDivElement>(null);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const padded = String(i).padStart(3, "0");
      
      const tryPath = (isFallback: boolean) => {
        const basePath = isFallback 
          ? (getImgDir() === "/ezgif-85116182a5dc7c12-jpg" ? "/herosection" : "/ezgif-85116182a5dc7c12-jpg")
          : getImgDir();
        
        img.src = `${basePath}/ezgif-frame-${padded}.jpg`;
      };

      img.onload = () => {
        count++;
        setLoaded(count);
        if (count === TOTAL_FRAMES) {
          drawFrame(0);
        }
      };

      img.onerror = () => {
        if (!(img as any).triedFallback) {
          (img as any).triedFallback = true;
          tryPath(true);
        } else {
          count++;
          // Tag image as failed, so canvas knows to draw the procedural fallback
          (img as any).failed = true;
          setLoaded(count);
          if (count === TOTAL_FRAMES) {
            drawFrame(0);
          }
        }
      };

      tryPath(false);
      images[i - 1] = img;
    }
    imagesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Draw dynamic high-tech wireframe telemetry fallback
      drawProceduralFallback(ctx, index, w, h);
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
  useEffect(() => {
    if (loaded < TOTAL_FRAMES) return;

    drawFrame(0);

    const handleScroll = () => {
      const section = containerRef.current;
      if (!section) return;
      const scrollY     = window.scrollY;
      const sectionTop  = section.offsetTop;
      const scrollDist  = window.innerHeight * 6; // 600vh of travel
      const progress    = Math.max(0, Math.min(1, (scrollY - sectionTop) / scrollDist));
      const frameIndex  = Math.round(progress * (TOTAL_FRAMES - 1));
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        setCurrentFrame(frameIndex + 1);
        drawFrame(frameIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // ── Stacking effect: hero card scales back as content wrapper slides over it ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sticky  = stickyRef.current;
      const overlay = stackOverlayRef.current;
      if (!sticky) return;

      // Triggered when #content-wrapper scrolls from viewport-bottom to viewport-top
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#content-wrapper",
          start: "top bottom",   // wrapper top hits viewport bottom
          end:   "top top",      // wrapper top reaches viewport top
          scrub: 1.5,
        },
      });

      // Hero card shrinks and rounds like a card going to the back of the stack
      tl.to(sticky, {
        scale: 0.88,
        borderRadius: "20px",
        transformOrigin: "center center",
        ease: "none",
      }, 0);

      // Dark overlay fades in to give depth
      if (overlay) {
        tl.to(overlay, { opacity: 0.5, ease: "none" }, 0);
      }
    });

    return () => ctx.revert();
  }, []);

  // Redraw on resize
  useEffect(() => {
    const handleResize = () => {
      const frameIndex = Math.min(currentFrame - 1, TOTAL_FRAMES - 1);
      drawFrame(frameIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame]);

  return (
    /*
     * Outer section: 700vh tall — provides the scroll distance for the frame
     * animation (600vh) while keeping the inner card sticky at the top.
     * The next section (#content-wrapper) naturally slides UP over this,
     * creating the true stacking-card effect.
     */
    <section
      id="overview"
      ref={containerRef}
      style={{ height: "700vh" }}
      className="relative"
    >
      {/* Inner sticky card — stays fixed at top while outer section scrolls */}
      <div
        ref={stickyRef}
        className="hero-canvas-section sticky top-0 h-screen w-full overflow-hidden bg-black"
        style={{ zIndex: 1 }}
      >
        {/* Canvas */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* Loading indicator */}
        {loaded < TOTAL_FRAMES && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="mb-4 text-sm font-medium tracking-widest text-neutral-500">
                LOADING
              </div>
              <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full bg-electric-blue transition-all duration-300"
                  style={{ width: `${(loaded / TOTAL_FRAMES) * 100}%` }}
                />
              </div>
              <div className="mt-3 text-xs text-neutral-600">
                {Math.round((loaded / TOTAL_FRAMES) * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Dark overlay — fades in during stacking transition (GSAP-driven) */}
        <div
          ref={stackOverlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Gradient vignette at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Hero text content */}
        <div className="hero-overlay absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end items-start px-6 pb-20 pt-24 md:px-12 md:pb-28 max-w-4xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-black/60 px-3 py-1 text-[10px] font-medium tracking-widest text-neutral-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-electric-blue animate-pulse" />
              NEW 2025 MODEL
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl">
              911 GT3 RS
            </h1>
            <p className="mt-3 text-sm text-neutral-400 sm:text-base leading-relaxed">
              Born from the track. Built for the road. The most extreme
              road-legal 911 in history.
            </p>
            <p className="mt-2 text-xs text-neutral-500 sm:text-sm">
              Developed by velixo.io — contact me to chat about your next web project.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <MagneticButton
                href="mailto:contact@velixo.io"
                className="group inline-flex items-center gap-2 rounded-full bg-electric-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-electric-blue-bright"
              >
                Send Message
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton
                href="#performance"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-black/65 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-neutral-950"
              >
                Explore performance
              </MagneticButton>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 right-6 md:right-12">
            <div className="scroll-indicator flex items-center gap-2 text-neutral-500">
              <span className="text-[10px] tracking-widest font-mono">SCROLL TO EXPLORE</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseIntro() {
  return (
    <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-white py-24 sm:py-32">
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xl italic text-neutral-900 sm:text-2xl">
          “This website is a creative frontend showcase — designed and developed to demonstrate advanced web design and animation skills”
        </p>
      </div>
      <div className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <img
          src="/section.jpg"
          alt="Showcase"
          className="w-full rounded-xl object-cover shadow-2xl"
        />
      </div>
    </section>
  );
}

function Header() {
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
            href="#configure"
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
              href="#configure"
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

function Marquee() {
  const items = [
    "518 HP",
    "0–100 IN 3.2S",
    "900 KG DOWNFORCE",
    "9,000 RPM REDLINE",
    "NÜRBURGRING 6:49",
    "4.0L FLAT-SIX",
    "DRS SYSTEM",
    "CARBON FIBER BODY",
  ];
  return (
    <div className="border-y border-neutral-800 bg-black py-5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-sm font-bold tracking-widest text-brand-accent">
            {item}
            <span className="ml-8 text-electric-blue">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Performance() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section id="performance" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[15%] h-[130%]">
        <img src="/section3.jpg" alt="" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold tracking-widest text-electric-blue"
          >
            PERFORMANCE
          </motion.p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Numbers that speak for themselves
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Every figure is a result of relentless motorsport engineering and
            decades of racing heritage.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {performanceSpecs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-blue/10 text-electric-blue">
                {spec.icon}
              </div>
              <div className="perf-number text-5xl font-extrabold text-white">
                {spec.value}
              </div>
              <div className="mt-1 text-sm text-neutral-500">{spec.unit}</div>
              <div className="mt-3 text-sm font-medium tracking-wide text-neutral-300">
                {spec.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Design() {
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
            className="relative overflow-hidden rounded-3xl"
          >
            <img
              src="/section4.jpg"
              alt="Portfolio showcase"
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

function Engine() {
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

function Technology() {
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
                  backgroundImage: `url(${item.image})`,
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

function ServicesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const img1Scale = useTransform(scrollYProgress, [0, 0.45], [1, 0.5]);
  const img234Opacity = useTransform(scrollYProgress, [0.2, 0.45, 0.5, 1], [0, 1, 1, 1]);
  const img234Scale = useTransform(scrollYProgress, [0.2, 0.45], [0.5, 1]);

  return (
    <>
      <div className="h-px w-full bg-neutral-300" />

      <section className="flex h-[50vh] items-center justify-center bg-black px-8 py-16">
        <p className="max-w-3xl text-center text-lg font-light tracking-wide leading-relaxed text-neutral-300 sm:text-xl lg:text-2xl">
          &ldquo;Our web services are not limited to cars only; they can be tailored to anything you want, no matter what it is.&rdquo;
        </p>
      </section>

      <div className="h-px w-full bg-neutral-300" />

      <section id="configure" ref={containerRef} className="relative h-[250vh] bg-neutral-900">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.div
            className="absolute inset-0 z-10"
            style={{ scale: img1Scale, transformOrigin: "top left" }}
          >
            <img src="/fhotoone.jpg" alt="Service showcase" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 z-20 h-full w-full"
            style={{ opacity: img234Opacity, scale: img234Scale, transformOrigin: "top right" }}
          >
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]">
              <div className="overflow-hidden" />
              <div className="overflow-hidden">
                <img src="/fhoto2.jpg" alt="Service showcase" className="h-full w-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <img src="/fhoto3.jpg" alt="Service showcase" className="h-full w-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <img src="/fhoto4.jpg" alt="Service showcase" className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function Gallery() {
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
          <motion.img
            src="/dark.jpg"
            alt="Showcase"
            className="w-full rounded-2xl object-cover"
            style={{ y: imgY, scale: imgScale, height: "calc(100vh - 10px)", minHeight: "70vh", objectPosition: "center 60%" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function Reviews() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-24 sm:py-32">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[20%] h-[140%]">
        <img src="/white.jpg" alt="" className="h-full w-full object-cover" />
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

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold tracking-widest text-electric-blue"
          >
            FAQ
          </motion.p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Questions, answered
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold text-neutral-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-neutral-500 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 text-neutral-600"
                >
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 0]);

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
          <MagneticButton
            href="#configure"
            className="inline-flex items-center gap-2 rounded-full bg-electric-blue px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-electric-blue-bright"
          >
            Build & Order
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton
            href="mailto:contact@velixo.io"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
            Send Message
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black py-12">
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
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-electric-blue focus:outline-none"
              />
              <a
                href="mailto:contact@velixo.io"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-electric-blue px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-electric-blue-bright"
              >
                Send Message
                <ArrowRight className="h-4 w-4" />
              </a>
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 md:flex-row">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} velixo.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] bg-electric-blue"
    />
  );
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        exit={{
          scale: 0.15,
          x: "-44vw",
          y: "-42vh",
          opacity: 0,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        }}
        className="text-5xl font-bold tracking-tight text-white sm:text-7xl"
      >
        velixo<span className="text-electric-blue">.io</span>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="absolute bottom-0 left-0 h-[3px] w-full bg-electric-blue"
      />
    </motion.div>
  );
}

function MagneticButton({ href, children, className, onClick }: { href: string; children: ReactNode; className?: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <HeroScrollFrames />
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