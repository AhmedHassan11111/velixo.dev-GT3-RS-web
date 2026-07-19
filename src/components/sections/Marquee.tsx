import React from "react";

export function Marquee() {
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
