# Feature Specification: Performance Optimization (GT3 RS Showcase)

**Feature Branch**: `001-performance-optimization`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "Improve the performance of the Porsche GT3 RS showcase website. Current problem: the site is very slow and performs poorly overall. Requirements: optimize images (WebP/AVIF, compression, responsive srcset/sizes), reduce JS bundle size and remove unused libs/dead code, optimize the scroll-scrubbing hero animation (transform/opacity only, requestAnimationFrame or equivalent scroll-linked technique, no layout thrashing/forced reflows), improve font loading (preload, font-display: swap), add caching headers for static assets, with measurable Core Web Vitals (LCP, CLS, INP) improvement."

## Context & Current State

This is a personal portfolio/marketing showcase for the Porsche 911 GT3 RS (React 19 + Vite 6, Tailwind v4). Per the project constitution, scope is strictly **performance, security, and mobile responsiveness** — no new content or sections.

Baseline audit of the current build (verified against the repo):

- **Images**: ~14 MB total in `public/`. Hero animation uses **174 sequential JPEG frames** (`ezgif-frame-001..174.jpg`, ~8.7 MB, avg ~51 KB each) painted to a `<canvas>`. Section/gallery photos are large JPEGs (`section.jpg` 980 KB, `thirdcard.jpg` 759 KB, `fhoto2.jpg` 658 KB, etc.). No WebP/AVIF, no `srcset`/`sizes`, no lazy loading.
- **Fonts**: Project canvas code references `JetBrains Mono` and `Inter` by name only — **no web fonts are loaded, preloaded, or declared**. HTML `<title>` is still the default "My Google AI Studio App".
- **JavaScript**: Bundle includes `motion` (Framer Motion, used for scroll/whileInView animations), `gsap` + `ScrollTrigger` (used for the hero stacking-card effect), and `lucide-react` icons. `@google/genai` is a declared dependency but has **no usage anywhere in `src/`** (dead dependency). `express`/`dotenv` are declared but unused by the current client-only build (no `server.js` exists).
- **Hero scroll handler** (`src/App.tsx` `HeroScrollFrames`): a `window` `scroll` listener reads `window.scrollY` and `section.offsetTop` every event and calls `setCurrentFrame` + redraws the canvas. `offsetTop` is a layout-reading property; reading it inside a scroll handler can force reflows under load. The goal is to move to rAF-coalesced updates and avoid layout reads.
- **Caching**: The Vite dev middleware sets `Cache-Control: no-store` on hero frames. There is **no production static asset cache policy** (no `server.js`, no CDN/header config in `vite.config.ts`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fast first paint and visual stability (Priority: P1)

A visitor lands on the site on a mid-range mobile device over a 4G connection and sees the hero content render quickly, with no layout shift as images and fonts load.

**Why this priority**: LCP and CLS are the most visible performance problems for a content-heavy showcase; they directly affect perceived speed and the portfolio's credibility.

**Independent Test**: Load the production build in Chrome DevTools (mobile emulation, throttled 4G) and observe LCP element painting early with CLS near zero; no reflow as the hero canvas/critical images settle.

**Acceptance Scenarios**:

1. **Given** a cold load on throttled mobile, **When** the page reaches first meaningful paint, **Then** the LCP element is painted within the target budget and no element shifts the layout after fonts/images load (CLS ≤ 0.1).
2. **Given** the page is loading, **When** web fonts finish downloading, **Then** text swaps in via `font-display: swap` without invisible text (FOIT) and without a measurable layout shift.

---

### User Story 2 - Smooth scroll-scrubbing hero animation (Priority: P1)

A visitor scrolls through the 700vh hero section and the frame sequence + stacking card animate smoothly, with no jank or stutter, on both desktop and touch/mobile.

**Why this priority**: The hero is the centerpiece interaction; jank here dominates INP and scroll responsiveness and is the explicit performance complaint.

**Independent Test**: Scroll the hero section on desktop and on a real mobile device; verify frames advance smoothly via transform/opacity-driven rendering on an rAF loop, with no forced synchronous layout during scroll (verified in DevTools Performance panel — no long tasks from layout/recalc during scroll).

**Acceptance Scenarios**:

1. **Given** the hero is visible, **When** the user scrolls, **Then** frame updates are coalesced into one per animation frame (rAF) and drive only `transform`/`opacity` (or canvas paint), with no reads of layout properties (`offsetTop`, `getBoundingClientRect`) inside the scroll path.
2. **Given** a scroll gesture on touch, **When** it completes, **Then** the final frame matches scroll position with no skipped/duplicated visual state and no main-thread long task (>50 ms) attributable to the hero.

---

### User Story 3 - Lean, cache-friendly asset delivery (Priority: P2)

A returning visitor loads the site and static assets (images, JS, CSS, fonts) are served in modern formats with long-lived cache headers, so repeat visits are near-instant and bandwidth use is minimized.

**Why this priority**: Reduces total transfer size and improves repeat-view CWV; complements Stories 1–2 but is independently shippable.

**Independent Test**: Inspect network responses for static assets — confirm modern image formats, `srcset`/`sizes` on key images, and `Cache-Control` with a long `max-age`/`immutable` on build assets and hashed image filenames.

**Acceptance Scenarios**:

1. **Given** any image, **When** the browser requests it, **Then** a modern format (WebP/AVIF) is served with appropriate compression and responsive variants selected via `srcset`/`sizes`.
2. **Given** a repeat visit, **When** the browser requests a hashed build asset, **Then** it is served from cache (`Cache-Control` long-lived) and not re-downloaded.

---

### Edge Cases

- What happens when a hero frame fails to load? (current code already falls back to a canvas-drawn procedural telemetry screen — fallback must remain intact and not break the rAF loop).
- What happens on very low-end devices where decoding 174 frames is too heavy? (consider capping frame count / resolution and a static poster).
- What happens when `prefers-reduced-motion` is set? (animations already largely respect this; optimization must not reintroduce motion).
- What happens if a browser does not support AVIF? (must fall back to WebP, then JPEG, via `<picture>`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST serve all photographic images (hero frames and section/gallery photos) in modern formats (AVIF preferred, WebP fallback, JPEG ultimate fallback) with visible-artifact-free compression.
- **FR-002**: System MUST provide responsive image variants via `srcset` and `sizes` for all content images so the browser downloads a viewport-appropriate size (especially `section.jpg`, `dark.jpg`, gallery/technology cards).
- **FR-003**: System MUST lazy-load below-the-fold images (loading strategy that defers offscreen images) so they do not block LCP.
- **FR-004**: System MUST NOT include unused dependencies in the production bundle; specifically `@google/genai`, and any unused `express`/`dotenv`/build tooling not used by the client build, MUST be removed or code-split as justified.
- **FR-005**: System MUST remove dead/unreachable code paths from `src/App.tsx` and elsewhere that contribute to bundle size without delivering user value.
- **FR-006**: Hero scroll-scrubbing animation MUST update on `requestAnimationFrame` (or an equivalent scroll-linked API) so at most one visual update occurs per frame.
- **FR-007**: Hero animation MUST animate only `transform`/`opacity` (and canvas 2D paint), and MUST NOT read layout-triggering properties (`offsetTop`, `getBoundingClientRect`, `clientHeight`, etc.) inside the scroll/update loop.
- **FR-008**: System MUST preload the critical web fonts and declare `font-display: swap` so text renders immediately with a swap, eliminating invisible-text delay.
- **FR-009**: System MUST emit `Cache-Control` headers with long `max-age` (and `immutable` where safe) for static build assets and hashed images, applied in the production serving layer.
- **FR-010**: Any performance-affecting change MUST be benchmarked before/after using Lighthouse (or equivalent) on mobile emulation; "looks fine" is not sufficient proof (per constitution Principle 1).
- **FR-011**: Hero animation changes MUST be re-tested on at least two real mobile screen sizes before considered complete (per constitution Principle 3).

### Key Entities

- **Static Asset**: an image/JS/CSS/font file served from `public/` or the Vite build `dist/`, with attributes: format, byte size, cache policy, responsive variants.
- **Hero Frame**: one of 174 sequentially-painted images composited onto the hero `<canvas>`; key attribute is its index and decode/paint cost.
- **Core Web Vitals Snapshot**: a captured measurement (LCP, CLS, INP, total byte weight) at a point in time, used for before/after comparison.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Largest Contentful Paint on mobile (throttled 4G) improves by at least 40% versus the captured baseline (e.g., from a slow baseline into the "Good" < 2.5 s range).
- **SC-002**: Cumulative Layout Shift stays ≤ 0.1 on both desktop and mobile across the full scroll, measured at both the initial load and post-hero.
- **SC-003**: Interaction to Next Paint (INP) stays ≤ 200 ms during hero scrolling on mobile (no scroll-attributable long tasks > 50 ms).
- **SC-004**: Total transferred bytes for a first visit (document + images + JS + CSS + fonts) decrease by at least 50% versus baseline.
- **SC-005**: Production JavaScript bundle size decreases by at least 30% versus baseline (removing `@google/genai` and tree-shaking unused code).
- **SC-006**: All photographic images are served in AVIF/WebP with `srcset`/`sizes`; 0 images are served as uncompressed full-size JPEG on the critical path.
- **SC-007**: Repeat-view static assets (hashed JS/CSS/images/fonts) are served from cache with `Cache-Control` long-lived, yielding near-zero re-download on reload.

## Assumptions

- Target audience reaches the site over typical mobile/desktop connections; optimization is tuned for mid-range mobile as the hardest case.
- Bundle is delivered as a static client-rendered build (no SSR exists today); production serving is via a static host/CDN or a simple static server that can set `Cache-Control` (the current `express` dependency may be repurposed or replaced for this).
- Image content (copy, framing, the 174-frame sequence) is final and must not be altered or reduced in count unless a performance gate requires it (FR-011 / low-end fallback is the only allowed reduction).
- Web fonts to be added are limited to the families already referenced in the canvas HUD (`Inter` for body/UI, `JetBrains Mono` for telemetry); no additional typography is introduced.
- Tooling for image transcoding (e.g., `sharp`/`imagemagick`) and benchmarking (Lighthouse CI or local Chrome) is available in the environment; if not, that is captured as a setup task in planning.
- No new sections or copy are added (constitution Non-Goals).
