# Research: Performance Optimization (GT3 RS Showcase)

**Feature**: `001-performance-optimization` | **Date**: 2026-07-16

This documents the investigation behind the implementation plan. Each decision is grounded in the repo audit performed during spec creation and confirmed via direct file inspection.

---

## R1. Image optimization strategy (FR-001, FR-002, FR-003, SC-004, SC-006)

**Decision**: Transcode all `public/` JPEGs to AVIF + WebP and serve via `<picture>`; generate 2–3 width variants per content image with `srcset`/`sizes`; lazy-load offscreen images.

**Rationale**:
- Audit: ~14 MB total in `public/` with zero modern formats. AVIF typically yields 50–70% smaller files than JPEG at equivalent quality; WebP 25–35% smaller. This directly satisfies SC-004 (≥50% byte reduction) and SC-006 (0 full-size JPEG on critical path).
- Content images (`section.jpg` 980 KB, `thirdcard.jpg` 759 KB, `fhoto2.jpg` 658 KB) are decorative/large-viewport; generating `srcset` (e.g., 640/1024/1600/2400w) lets mobile download a fraction.
- Hero frames (174 × ~51 KB JPEG) are painted to a `<canvas>` programmatically, so they are **not** `<img>` elements — `srcset`/`sizes` does not apply to them. Their optimization is: transcode to WebP/AVIF and decode efficiently (see R4), plus reduced-resolution variants.

**Alternatives considered**:
- Keep JPEG, only recompress → misses the constitution's explicit WebP/AVIF requirement (Principle 1) and leaves most savings on the table.
- Use a runtime image CDN (e.g., Cloudinary) → adds an external dependency/security surface (violates Principle 5) and is overkill for a static portfolio. Rejected.

**Tooling**: `sharp` (npm) is the standard Vite-compatible transcoder and can run in a Node script. If `sharp` install fails on the environment, fall back to `imagemagick`/`libvips` CLI in the same script. Documented as a setup task.

---

## R2. JavaScript bundle reduction (FR-004, FR-005, SC-005)

**Decision**: Remove genuinely dead dependencies; keep `motion` and `gsap` only if both are still required after the hero rewrite; tree-shake aggressively; verify with a bundle analyzer.

**Rationale**:
- Direct inspection confirms `@google/genai` has **zero usage** in `src/`. `metadata.json` advertises `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, but no server/api code exists in the repo and the live deploy is a single static `index.html` (`.impeccable/live/config.json` → `files: ["index.html"]`). The capability flag is AI-Studio scaffold metadata, not a wired feature. → `@google/genai` is removable per Principle 1 ("no dead code").
- `express`/`dotenv` are declared but unused by the client build (no `server.js`). However, one legitimate use remains: a **production static server** to set `Cache-Control` headers (FR-009). We can satisfy FR-009 more simply — see R5 — so `express` stays only if we choose a Node static server; otherwise remove.
- `gsap` + `ScrollTrigger` is used **only** for the hero stacking-card effect (one `gsap.timeline` with `scrub`). `motion` (Framer Motion) is used for everything else (whileInView reveals, hero text, marquee). They are two animation libraries doing overlapping jobs.

**Alternatives considered**:
- Migrate the GSAP stacking effect to `motion`'s `useScroll`/`useTransform` (already used elsewhere) and drop `gsap` entirely → single animation dependency, smaller bundle. Strongly preferred (Principle 5). Risk: parity of the scrub feel; mitigations in tasks.
- Keep both → larger bundle, violates Principle 1 justification requirement.

**Net expectation**: removing `@google/genai` (~hundreds of KB) alone likely exceeds SC-005 (≥30% JS reduction); dropping `gsap` adds further savings.

---

## R3. Hero scroll animation rewrite (FR-006, FR-007, SC-002, SC-003, FR-011)

**Decision**: Coalesce scroll updates into a single `requestAnimationFrame` callback; compute scroll progress from cached layout values (read layout once per resize, not per scroll event); drive only canvas paint + `transform`/`opacity`.

**Rationale**:
- Current implementation (`HeroScrollFrames`) attaches a `scroll` listener that reads `section.offsetTop` and `window.scrollY` on every event, then `setCurrentFrame` (React state) + `drawFrame` (canvas). `offsetTop` forces layout; doing it per-event under fast scroll can cause thrash → poor INP (SC-003).
- Fix pattern: on scroll, only set a `ticking` flag and schedule one rAF. Inside rAF, read `scrollY` once, compute `progress`, update the frame index, and call `drawFrame`. Cache `sectionTop`/`scrollDist` in refs, refreshed on `resize` (a layout read outside the hot path).
- The stacking/shrink effect currently uses GSAP `scrub`. If we keep `motion`, implement it with `useScroll` on `#content-wrapper` + `useTransform` → `scale`/`borderRadius` (transform/opacity only), satisfying FR-007.
- `prefers-reduced-motion`: keep the existing guard; render a static poster frame instead of the scrub loop.

**Alternatives considered**:
- Native CSS `scroll-timeline` / `animation-timeline` → no JS, but browser support is still incomplete (Safari) as of 2026 and the canvas frame-swap needs JS anyway. Use rAF approach for reliability; revisit CSS scroll-driven if support widens.
- `IntersectionObserver` + rAF → IO doesn't give continuous progress; rAF on scroll (passive) is the correct tool for scrubbing.

---

## R4. Hero frame decode/paint cost (edge case: low-end devices)

**Decision**: Pre-decode frames into `Image` objects once (already done), but also generate a **reduced-resolution** frame set for small viewports and a **static poster** for first paint / reduced-motion / low-end.

**Rationale**:
- Painting 174 full-res JPEGs to canvas is the heaviest CWV risk on mobile (LCP, INP). Serving smaller frame dimensions for mobile (`< 768px`) cuts decode + paint cost.
- Poster (frame 0 or a mid frame) shown immediately as LCP candidate, frames swap in once preloaded → improves LCP (SC-001) and avoids blank canvas.
- Modern-format frames (WebP/AVIF) decode faster and transfer less.

---

## R5. Caching & serving layer (FR-009, SC-007)

**Decision**: Configure `Cache-Control` for hashed build assets and images via (a) Vite `build.assetsInlineLimit`/`manifest` + a thin static server, OR (b) deploy-time headers on the static host. Prefer a lightweight Node static server script (reusing `express` if kept, else `node:http`) for local `preview` parity, plus a `vercel.json`/`_headers`/host equivalent for the real deploy.

**Rationale**:
- Audit: dev middleware sets `Cache-Control: no-store` on hero frames; production has no policy. Hashed Vite assets (`[hash].js/css`) are content-addressed → safe to mark `immutable`, max-age 1y. Images in `public/` keep their names → use long `max-age` with `immutable` only if filenames are hashed; otherwise moderate `max-age` + ETag.
- Simplest solution (Principle 5): emit `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` (hashed), and `public, max-age=86400` for `/public` images.

**Alternatives considered**:
- Full CDN config → handled by host; we just ship the header manifest. Not adding a dependency.

---

## R6. Font loading (FR-008, SC-002)

**Decision**: Self-host `Inter` (body/UI) and `JetBrains Mono` (canvas HUD/telemetry) as `woff2`; `<link rel="preload">` the critical subsets in `index.html`, declare `@font-face { font-display: swap }`; set `size-adjust`/`fallback` metrics to avoid CLS.

**Rationale**:
- Audit: fonts referenced only as canvas string names; no `@font-face`, no preload, no `font-display`. First paint either uses system fallback (FOIT-free but off-brand) or blocks. Self-hosted `woff2` + `swap` removes network dependency on Google Fonts (privacy + speed) and eliminates invisible-text delay.
- Avoid CLS: provide `size-adjust` fallback or use `font-display: swap` with a metric-matched local fallback so swap doesn't shift layout.
- Scope: only these two families (per spec Assumptions); no new typography.

**Alternatives considered**:
- Google Fonts CDN `<link>` → simpler but adds a render-blocking/3rd-party request and a privacy/security surface (Principle 2/5). Rejected in favor of self-host.

---

## Open environment dependencies
- `sharp` (image transcode) and a Lighthouse runner (Chrome/`@lhci/cli`) must be available. If not installed, the plan includes setup tasks to add them as devDependencies. Benchmark gating (FR-010) depends on this.
