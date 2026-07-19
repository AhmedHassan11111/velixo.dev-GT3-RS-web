import React from "react";
import { Zap, Gauge, Wind, Cog, Shield, Camera } from "lucide-react";

export const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Performance", href: "#performance" },
  { label: "Design", href: "#design" },
  { label: "Engine", href: "#engine" },
  { label: "Technology", href: "#technology" },
  { label: "Configure", href: "#configure" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

export const performanceSpecs = [
  { icon: <Zap className="h-6 w-6" />, label: "Power", value: "518", unit: "hp" },
  { icon: <Gauge className="h-6 w-6" />, label: "0–100 km/h", value: "3.2", unit: "seconds" },
  { icon: <Wind className="h-6 w-6" />, label: "Downforce", value: "900", unit: "kg at 285 km/h" },
  { icon: <Cog className="h-6 w-6" />, label: "Top Speed", value: "296", unit: "km/h" },
];

export const designFeatures = [
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

export const engineSpecs = [
  { label: "Engine Type", value: "4.0L naturally aspirated flat-six" },
  { label: "Max Power", value: "518 hp at 8,500 rpm" },
  { label: "Max Torque", value: "465 Nm at 6,300 rpm" },
  { label: "Redline", value: "9,000 rpm" },
  { label: "Transmission", value: "7-speed PDK dual-clutch" },
  { label: "Drivetrain", value: "Rear-wheel drive" },
  { label: "Weight", value: "1,450 kg (DIN)" },
  { label: "Power-to-Weight", value: "357 hp per tonne" },
];

export const techFeatures = [
  {
    icon: <Cog className="h-6 w-6" />,
    title: "PASM Suspension",
    description:
      "Active suspension management with adjustable dampers and a fully ball-jointed suspension for track-day precision.",
    image: "tech-pasm",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "PSM Sport",
    description:
      "Porsche Stability Management with track mode and PSM Sport for controlled drifts on closed circuits.",
    image: "thirdcard",
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Lap Timer & Telemetry",
    description:
      "Built-in lap timer with GPS tracking and real-time telemetry displayed on the 10.9-inch PCM screen.",
    image: "tech-telemetry",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "DRS System",
    description:
      "Drag Reduction System borrowed from Formula 1 — adjust the rear wing angle at the push of a button.",
    image: "tech-drs",
  },
];

export const colorOptions = [
  { name: "Guards Red", hex: "#d5001c" },
  { name: "Carrara White", hex: "#f0f0f0" },
  { name: "Jet Black", hex: "#0a0a0a" },
  { name: "Shark Blue", hex: "#2d4a6b" },
  { name: "Python Green", hex: "#c8d600" },
  { name: "GT Silver", hex: "#c0c0c0" },
];

export const galleryImages = [
  { label: "Front Quarter", frame: "ezgif-frame-001.jpg" },
  { label: "Side Profile", frame: "ezgif-frame-045.jpg" },
  { label: "Rear Wing", frame: "ezgif-frame-090.jpg" },
  { label: "Cockpit", frame: "ezgif-frame-130.jpg" },
  { label: "Action Shot", frame: "ezgif-frame-160.jpg" },
  { label: "Detail", frame: "ezgif-frame-174.jpg" },
];

export const reviews = [
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

export const faqs = [
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
