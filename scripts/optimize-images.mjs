// scripts/optimize-images.mjs
// Transcodes all source images in public/ to modern formats (AVIF + WebP) with
// responsive width variants, and writes a manifest consumed by src/App.tsx.
//
// Strategy (see specs/001-performance-optimization/contracts/asset-format.md):
//  - Content/section photos: width sets [640, 1024, 1600, 2400]
//  - Gallery/technology cards: width sets [640, 1024, 1600]
//  - Hero frames (canvas, not <img>): two resolution sets, desktop 1600 / mobile 800
//
// Output layout (under public/, git-ignored generated variants):
//   public/gen/<name>/<name>-<width>.avif
//   public/gen/<name>/<name>-<width>.webp
//   public/gen/<name>/<name>.jpg            (kept fallback, original)
//   public/gen/hero/<index>-d.avif|webp      (desktop 1600)
//   public/gen/hero/<index>-m.avif|webp      (mobile 800)
// Manifest: public/image-manifest.json

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const GEN = path.join(PUBLIC, "gen");
const HERO_DIR = path.join(PUBLIC, "ezgif-85116182a5dc7c12-jpg");
const MANIFEST = path.join(PUBLIC, "image-manifest.json");

const CONTENT_SET = [640, 1024, 1600, 2400];
const CARD_SET = [640, 1024, 1600];
const HERO_DESKTOP = 1280;
const HERO_MOBILE = 640;
const CONCURRENCY = 8;

const CONTENT_IMAGES = [
  "section.jpg",
  "section3.jpg",
  "section4.jpg",
  "dark.jpg",
];
const CARD_IMAGES = [
  "thirdcard.jpg",
  "fhotoone.jpg",
  "fhoto2.jpg",
  "fhoto3.jpg",
  "fhoto4.jpg",
  "white.jpg",
  "tech-pasm.jpg",
  "tech-drs.jpg",
  "tech-telemetry.jpg",
];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function transcodeToWidths(srcAbs, outDir, baseName, widths) {
  ensureDir(outDir);
  const variants = [];
  const meta = await sharp(srcAbs).metadata();
  const srcW = meta.width || 0;
  for (const w of widths) {
    if (w > srcW) continue; // never upscale
    const avif = path.join(outDir, `${baseName}-${w}.avif`);
    const webp = path.join(outDir, `${baseName}-${w}.webp`);
    const jpg = path.join(outDir, `${baseName}-${w}.jpg`);
    await sharp(srcAbs).resize(w).avif({ quality: 50 }).toFile(avif);
    await sharp(srcAbs).resize(w).webp({ quality: 75 }).toFile(webp);
    await sharp(srcAbs).resize(w).jpeg({ quality: 82, mozjpeg: true }).toFile(jpg);
    variants.push({ width: w, avif: `/gen/${path.basename(outDir)}/${path.basename(avif)}`, webp: `/gen/${path.basename(outDir)}/${path.basename(webp)}`, jpg: `/gen/${path.basename(outDir)}/${path.basename(jpg)}` });
  }
  // keep a JPEG fallback at the largest requested width (capped to source)
  const jpgW = Math.min(Math.max(...widths), srcW);
  const jpg = path.join(outDir, `${baseName}.jpg`);
  await sharp(srcAbs).resize(jpgW).jpeg({ quality: 82, mozjpeg: true }).toFile(jpg);
  return { variants, jpg: `/gen/${path.basename(outDir)}/${path.basename(jpg)}` };
}

async function buildContentAndCards() {
  const manifest = { content: {}, cards: {} };

  for (const f of CONTENT_IMAGES) {
    const src = path.join(PUBLIC, f);
    if (!fs.existsSync(src)) continue;
    const base = path.parse(f).name;
    const outDir = path.join(GEN, base);
    const r = await transcodeToWidths(src, outDir, base, CONTENT_SET);
    manifest.content[base] = { ...r, sizes: "(max-width:768px) 100vw, 80vw", eager: true };
  }

  for (const f of CARD_IMAGES) {
    const src = path.join(PUBLIC, f);
    if (!fs.existsSync(src)) continue;
    const base = path.parse(f).name;
    const outDir = path.join(GEN, base);
    const r = await transcodeToWidths(src, outDir, base, CARD_SET);
    manifest.cards[base] = { ...r, sizes: "(max-width:768px) 100vw, (max-width:1024px) 50vw, 25vw", eager: false };
  }

  return manifest;
}

function pool(items, limit, worker) {
  return new Promise((resolve, reject) => {
    const results = [];
    let i = 0;
    let active = 0;
    let done = 0;
    const next = () => {
      if (i >= items.length && active === 0) return resolve(results);
      while (active < limit && i < items.length) {
        const item = items[i++];
        active++;
        worker(item)
          .then((r) => {
            results.push(r);
            active--;
            done++;
            if (done % 20 === 0) console.log(`[optimize] hero ${done}/${items.length}`);
            next();
          })
          .catch((e) => {
            active--;
            reject(e);
          });
      }
    };
    next();
  });
}

async function buildHero() {
  const outDir = path.join(GEN, "hero");
  ensureDir(outDir);
  const files = fs
    .readdirSync(HERO_DIR)
    .filter((f) => /^ezgif-frame-\d+\.jpg$/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0], 10);
      const nb = parseInt(b.match(/\d+/)[0], 10);
      return na - nb;
    });

  const frames = await pool(files, CONCURRENCY, async (f) => {
    const idx = parseInt(f.match(/\d+/)[0], 10);
    const src = path.join(HERO_DIR, f);
    const pad = String(idx).padStart(3, "0");
    const dAvif = path.join(outDir, `${pad}-d.avif`);
    const dWebp = path.join(outDir, `${pad}-d.webp`);
    const mAvif = path.join(outDir, `${pad}-m.avif`);
    const mWebp = path.join(outDir, `${pad}-m.webp`);
    await sharp(src).resize(HERO_DESKTOP).avif({ quality: 55 }).toFile(dAvif);
    await sharp(src).resize(HERO_DESKTOP).webp({ quality: 78 }).toFile(dWebp);
    await sharp(src).resize(HERO_MOBILE).avif({ quality: 50 }).toFile(mAvif);
    await sharp(src).resize(HERO_MOBILE).webp({ quality: 72 }).toFile(mWebp);
    return {
      index: idx,
      desktop: { avif: `/gen/hero/${pad}-d.avif`, webp: `/gen/hero/${pad}-d.webp` },
      mobile: { avif: `/gen/hero/${pad}-m.avif`, webp: `/gen/hero/${pad}-m.webp` },
    };
  });
  frames.sort((a, b) => a.index - b.index);
  return { total: frames.length, frames };
}

async function main() {
  ensureDir(GEN);
  console.log("[optimize] transcoding content + card images...");
  const cc = await buildContentAndCards();
  console.log("[optimize] transcoding hero frames...");
  const hero = await buildHero();
  const manifest = {
    content: cc.content,
    cards: cc.cards,
    hero: { desktopWidth: HERO_DESKTOP, mobileWidth: HERO_MOBILE, total: hero.total, frames: hero.frames },
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  const genBytes = (await scanDir(GEN)).bytes;
  console.log(`[optimize] done. Generated ${(genBytes / 1e6).toFixed(1)} MB under public/gen/`);
  console.log(`[optimize] manifest written to public/image-manifest.json (${hero.total} hero frames)`);
}

async function scanDir(dir) {
  let bytes = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) bytes += (await scanDir(p)).bytes;
    else bytes += fs.statSync(p).size;
  }
  return { bytes };
}

main().catch((err) => {
  console.error("[optimize] failed:", err);
  process.exit(1);
});
