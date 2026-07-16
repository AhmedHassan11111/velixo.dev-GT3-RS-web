// src/lib/images.ts
// Accessor for the generated image manifest (scripts/optimize-images.mjs output).
// Provides responsive <picture> sources for content/card images and frame URLs for the hero canvas.

import manifest from "../../public/image-manifest.json";

export type Variant = { width: number; avif: string; webp: string; jpg: string };

export interface ContentImage {
  variants: Variant[];
  jpg: string;
  sizes: string;
  eager: boolean;
}

export interface HeroFrame {
  index: number;
  desktop: { avif: string; webp: string };
  mobile: { avif: string; webp: string };
}

export const IMAGES = manifest as {
  content: Record<string, ContentImage>;
  cards: Record<string, ContentImage>;
  hero: { desktopWidth: number; mobileWidth: number; total: number; frames: HeroFrame[] };
  generatedAt: string;
};

export function getContentImage(name: string): ContentImage | undefined {
  return IMAGES.content[name] ?? IMAGES.cards[name];
}

export function heroFrame(index: number, isMobile: boolean): HeroFrame | undefined {
  return IMAGES.hero.frames[index];
}
