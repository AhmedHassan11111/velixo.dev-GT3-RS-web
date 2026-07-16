# Implementation Plan: Performance Optimization (GT3 RS Showcase)

**Branch**: `001-performance-optimization` | **Date**: 2026-07-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-performance-optimization/spec.md`

## Summary

The Porsche GT3 RS showcase is a static React 19 + Vite 6 single-page site that currently ships ~14 MB of unoptimized JPEGs (including 174 hero canvas frames), an oversized JS bundle with dead dependencies (`@google/genai`, unused `express`/`dotenv`), fonts that are referenced but never loaded, and no production cache policy. We will (1) transcode all images to AVIF/WebP with responsive `srcset` and lazy loading, (2) remove dead deps and consolidate animation libraries, (3) rewrite the hero scroll-scrub into a single rAF-coalesced loop that only paints canvas + animates transform/opacity and never reads layout in the hot path, (4) self-host and preload fonts with `font-display: swap`, and (5) add long-lived `Cache-Control` headers at the serving layer. Every change is benchmarked before/after with Lighthouse on mobile (constitution Principle 1) and the hero is re-tested on two real mobile sizes (Principle 3).

## Technical Context

**Language/Version**: TypeScript 5.8 + React 19 + Vite 6 (Node 22)

**Primary Dependencies**: `react`, `react-dom`, `motion` (Framer Motion) for scroll/reveal animations; `lucide-react` for icons. `gsap` + `ScrollTrigger` currently used only for the hero stacking effect (candidate for removal/conversion to `motion`). `tailwindcss` v4 (via `@tailwindcss/vite`). Build tool: `vite`, `esbuild`, `typescript`.

**Storage**: N/A (static site; no database). Images live in `public/`.

**Testing**: `tsc --noEmit` (typecheck/lint per `package.json`), manual Lighthouse + DevTools Performance on mobile emulation, real-device scroll testing. (No unit-test framework present; verification is build + benchmark + manual.)

**Target Platform**: Static web; desktop + mobile (mid-range mobile is the hard case). Deploys as a single `index.html` + hashed assets (per `.impeccable/live/config.json`).

**Project Type**: Static client-rendered web application (SPA, no SSR).

**Performance Goals**: LCP (mobile 4G) −40% (target < 2.5 s), CLS ≤ 0.1, INP ≤ 200 ms during hero scroll, −50% first-visit bytes, −30% JS bundle, 0 critical-path full-size JPEG, long-lived caching on repeat view.

**Constraints**: No new content/sections (constitution Non-Goals). Keep the 174-frame hero sequence and its canvas procedural fallback intact. Must remain a static deploy (no mandatory backend). Must respect `prefers-reduced-motion`.

**Scale/Scope**: One SPA, ~1,400-line `src/App.tsx`, ~14 MB assets, 5–6 image sections. Change is performance-only.

## Constitution Check

*GATE: Evaluated against `.specify/memory/constitution.md` before research (re-checked after design).*

| Principle | Status | Notes |
|-----------|--------|-------|
| 1 — Performance Non-Negotiable | PASS | Whole feature exists to satisfy it; FR-010 mandates before/after Lighthouse benchmarking; hero restricted to transform/opacity + rAF (FR-006/FR-007). |
| 2 — Security by Default | PASS (N/A scope) | No new form/endpoint added. Removing Google Fonts CDN + dead `@google/genai` *reduces* attack surface. If a static server is added for FR-009, it must stay read-only static + CSP (noted in tasks). |
| 3 — Mobile-First Responsiveness | PASS | FR-011 requires re-test on ≥2 real mobile sizes; R4 adds mobile-resolution hero frames + responsive `srcset`. |
| 4 — Visual/Interaction Integrity | PASS | Hero stacking effect preserved (converted, not removed); reveal directions unchanged (no new reveals). |
| 5 — Minimal, Justified Additions | PASS (with notes) | Adds: `sharp` (devDep, justified by FR-001), optional static-server/header manifest (justified by FR-009). Removes dead `@google/genai`/`express`/`dotenv` usage. Single animation lib preferred. |

**No violations requiring the Complexity Tracking table.**

## Project Structure

### Documentation (this feature)

```text
specs/001-performance-optimization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (asset + serving contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root) — changes, not new layout

```text
public/
├── (transcoded) *.avif / *.webp variants + srcset width sets
├── fonts/                       # NEW: self-hosted woff2 (Inter, JetBrains Mono)
└── ezgif-85116182a5dc7c12-jpg/  # hero frames (transcoded, + mobile-res set)

src/
├── App.tsx                      # hero rAF rewrite, <picture> images, font wiring
├── main.tsx
├── index.css                    # @font-face + font-display: swap
└── (new) lib/perf.ts            # optional: shared scroll/rAF helpers

scripts/
└── (new) optimize-images.mjs    # sharp transcode + srcset manifest generation

vite.config.ts                   # build cache headers, assetsInlineLimit tuning
index.html                       # font preload links, accurate <title>, CSP meta
```

**Structure Decision**: Single static SPA (default). No backend introduced. Image pipeline is a build-time Node script; serving headers are configured in `vite.config.ts` (preview) and a host header manifest. The plan edits the existing `src/App.tsx` rather than restructuring components.

## Phase 0 → Research

See [research.md](./research.md). Key decisions: AVIF/WebP + `srcset` via `sharp`; remove dead `@google/genai` (and unused `express`/`dotenv` unless kept for a static server); convert the single GSAP usage to `motion` to drop a library; rewrite hero scroll to one rAF loop with cached layout reads; self-host `woff2` + `font-display: swap`; long-lived `Cache-Control` on hashed assets.

## Phase 1 → Design & Contracts

- **data-model.md**: describes the two key entities — `StaticAsset` (format/size/cache/responsive variants) and `HeroFrame` (index/format/resolution/decode cost), plus the `CWVSnapshot` measurement record used for before/after comparison.
- **contracts/asset-format.md**: the image format/size matrix (which widths, which formats, `<picture>` order) every image must satisfy.
- **contracts/serving-headers.md**: the `Cache-Control`/CSP header contract for the production serving layer.
- **quickstart.md**: how to run the optimize script, build, and execute the before/after Lighthouse benchmark to prove SC-001…SC-007.

## Risks & Mitigations

- **GSAP→motion parity**: the hero stacking scrub may feel different. Mitigation: match `scrub` easing with `useTransform`; A/B against current build in DevTools.
- **`sharp` unavailable**: Mitigation: fall back to `imagemagick`/CLI in `optimize-images.mjs`; if neither, document manual step.
- **CLS from font swap**: Mitigation: metric-matched fallback + `size-adjust` so swap is shift-free.
- **LCP regression from canvas**: Mitigation: paint poster frame immediately (LCP candidate) before preloading all 174.

## Benchmark Gates (FR-010)

Before any "done" claim, capture a baseline `CWVSnapshot` (Lighthouse mobile, throttled 4G) and a final one; the delta must meet SC-001…SC-007. Artifacts stored under `specs/001-performance-optimization/benchmarks/`.
