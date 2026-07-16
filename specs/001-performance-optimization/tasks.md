# Tasks: Performance Optimization (GT3 RS Showcase)

**Input**: Design documents from `/specs/001-performance-optimization/`
**Feature Branch**: `001-performance-optimization`
**Date**: 2026-07-16

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/
**Tests**: Not requested in the spec; verification is typecheck (`tsc --noEmit`), build, and Lighthouse/DevTools benchmarking per quickstart.md. No automated unit tests are added (none exist in the repo).

**Organization**: Tasks grouped by user story (US1 fast first paint/CLS, US2 smooth hero, US3 lean cache-friendly delivery). The benchmark gate (FR-010) is a cross-cutting final task.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [P] Add devDependencies to `package.json`: `sharp` (image transcode) and `@lhci/cli` (benchmark, or use local Chrome). Confirm install succeeds on the environment.
- [ ] T002 Create `scripts/optimize-images.mjs` scaffold (Node ESM) that reads a source list from `public/` and is runnable with `node scripts/optimize-images.mjs`.
- [ ] T003 [P] Create `specs/001-performance-optimization/benchmarks/` directory and a `benchmarks/README.md` noting the FR-010 capture format (`CWVSnapshot` from data-model.md).

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story optimization work should be merged/measured before the baseline is captured and the image pipeline exists.

- [ ] T004 Capture **baseline** `CWVSnapshot` (Lighthouse mobile, throttled 4G) of the current `npm run build` + `npm run preview`, saved to `specs/001-performance-optimization/benchmarks/baseline.json`. Satisfies FR-010 prerequisite.
- [ ] T005 Implement `scripts/optimize-images.mjs` core: transcode every JPEG/PNG in `public/` to AVIF (q≈50) + WebP (q≈75) + keep JPEG fallback; generate responsive width sets per the `contracts/asset-format.md` matrix; write a generated manifest (`public/image-manifest.json`) mapping source → variants/widths. Use `sharp`; fall back to `imagemagick` CLI if `sharp` unavailable.
- [ ] T006 Run `scripts/optimize-images.mjs`; verify AVIF/WebP outputs exist for `section*.jpg`, `dark.jpg`, `fhoto*.jpg`, `thirdcard.jpg`, `tech-*.jpg`, and the 174 hero frames; spot-check byte reduction vs source.

**Checkpoint**: Baseline measured; image pipeline produces modern-format variants. User story work can begin.

---

## Phase 3: User Story 1 — Fast first paint & visual stability (Priority: P1) 🎯 MVP

**Goal**: Images in modern formats with responsive `srcset`/lazy-load; fonts self-hosted + preloaded with `font-display: swap`; no CLS from images or fonts. Delivers SC-001, SC-002, SC-004, SC-006.

**Independent Test**: Lighthouse mobile cold load shows LCP in budget, CLS ≤ 0.1, 0 full-size JPEG on critical path, and total bytes ≥ 50% below baseline.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Wire `<picture>` + `srcset`/`sizes` for large section photos in `src/App.tsx`: `section.jpg`, `section3.jpg`, `section4.jpg`, `dark.jpg` — using the manifest from T005; eager + `fetchpriority="high"` for above-fold (`section.jpg`/`ShowcaseIntro`).
- [ ] T008 [P] [US1] Wire `<picture>` + `srcset`/`sizes` + `loading="lazy"` for below-fold images in `src/App.tsx`: `fhoto*.jpg`, `thirdcard.jpg`, `tech-*.jpg`, `white.jpg` gallery/technology cards (matches asset-format.md group 3).
- [ ] T009 [US1] Add self-hosted fonts: place `Inter` + `JetBrains Mono` `woff2` in `public/fonts/`; declare `@font-face { font-display: swap }` with metric-matched `size-adjust` fallback in `src/index.css` (avoids CLS — SC-002).
- [ ] T010 [US1] Update `index.html`: add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the critical font subset(s), fix the `<title>` (currently "My Google AI Studio App"), and add a CSP `<meta>` per `contracts/serving-headers.md`.
- [ ] T011 [US1] Update canvas HUD font references in `src/App.tsx` to use the self-hosted families (Inter/JetBrains Mono) now that they exist.
- [ ] T012 [US1] Run `npm run build` + `tsc --noEmit`; confirm typecheck passes and assets emit.

**Checkpoint**: US1 independently verifiable via Lighthouse — modern images, preloaded swap fonts, CLS ≤ 0.1.

---

## Phase 4: User Story 2 — Smooth scroll-scrubbing hero (Priority: P1)

**Goal**: Hero frame sequence + stacking card animate smoothly via a single rAF loop, transform/opacity only, no layout reads in the hot path. Delivers SC-003, respects FR-006/FR-007, FR-011.

**Independent Test**: Scroll the 700vh hero on desktop + 2 real mobile sizes; DevTools Performance shows one update per frame, no scroll-attributable long task > 50 ms, final frame matches scroll.

### Implementation for User Story 2

- [ ] T013 [US2] Refactor `HeroScrollFrames` scroll handler in `src/App.tsx` to coalesce into one `requestAnimationFrame` callback; compute progress from `scrollY` only; cache `sectionTop`/`scrollDist` in refs, refreshed on `resize` (no `offsetTop`/`getBoundingClientRect` in the scroll path) — satisfies FR-007.
- [ ] T014 [US2] Paint a **poster frame** (frame 0 / mid) immediately on mount as the LCP candidate before the 174-frame preload completes (mitigates LCP regression — SC-001/SC-003).
- [ ] T015 [US2] Use mobile-resolution hero frames (< 768 px) on small viewports (from T006 output) to cut decode/paint cost; keep procedural canvas fallback intact on frame error.
- [ ] T016 [US2] Convert the GSAP `ScrollTrigger` stacking-card effect in `src/App.tsx` to `motion` `useScroll` + `useTransform` (scale/borderRadius only), removing the `gsap` dependency entirely; match `scrub` easing feel.
- [ ] T017 [US2] Ensure `prefers-reduced-motion` path still renders a static poster (no scrub loop).
- [ ] T018 [US2] Re-test hero scroll on iPhone SE (375×667) and Pixel 5 (393×851) — satisfies FR-011 / Principle 3; confirm no jank and correct final frame.

**Checkpoint**: US2 independently verifiable — smooth hero, rAF-only, no layout thrash, mobile re-tested.

---

## Phase 5: User Story 3 — Lean, cache-friendly asset delivery (Priority: P2)

**Goal**: Trim the JS bundle (remove dead deps) and emit long-lived `Cache-Control` headers. Delivers SC-005, SC-007, FR-004/FR-005/FR-009.

**Independent Test**: `npm run build` JS bundle ≥ 30% smaller than baseline; repeat visit serves hashed assets from cache (`immutable`); no dead deps in bundle.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Remove dead dependency `@google/genai` from `package.json` (zero usage in `src/`; `metadata.json` capability flag is AI-Studio scaffold, not wired). Run `npm install` + `npm run build`.
- [ ] T020 [P] [US3] Remove unused `express`/`dotenv` from `package.json` UNLESS retained for the static server in T022; verify no `src/` imports. (If retained, keep minimal.)
- [ ] T021 [US3] Remove dead/unreachable code in `src/App.tsx` (e.g., unused helpers/branches) and confirm `gsap` import is gone after T016; rebuild and diff bundle size.
- [ ] T022 [US3] Configure production `Cache-Control` for hashed assets/fonts (`public, max-age=31536000, immutable`) and images (`max-age=86400` + ETag) + security headers in `vite.config.ts` preview middleware; if a real static host is used, add its header manifest (`vercel.json`/`_headers`/equivalent) per `contracts/serving-headers.md`. Keep any added server read-only static + CSP (Principle 2).
- [ ] T023 [US3] Run `npm run build`; record `jsBytes` and confirm ≥ 30% reduction vs baseline (SC-005).

**Checkpoint**: US3 independently verifiable — smaller bundle, cached repeat visits, no dead deps.

---

## Phase 6: Polish & Cross-Cutting (Benchmark Gate)

- [ ] T024 Re-run Lighthouse mobile (throttled 4G) on the optimized build; capture **final** `CWVSnapshot` to `specs/001-performance-optimization/benchmarks/final.json`.
- [ ] T025 Compare baseline vs final against SC-001 (LCP −40%), SC-002 (CLS ≤0.1), SC-003 (INP ≤200 ms), SC-004 (−50% bytes), SC-005 (−30% JS), SC-006 (0 critical JPEG), SC-007 (cached repeat). Document pass/fail per criterion (FR-010).
- [ ] T026 [P] Final `tsc --noEmit` + `npm run build` clean; confirm no regressions in other sections (reveal directions, navbar per Principle 4 unaffected).
- [ ] T027 Update `README.md`/notes with the image pipeline usage (`node scripts/optimize-images.mjs`) and benchmark procedure from `quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: no dependencies — start immediately (parallel).
- **Foundational (Phase 2)**: depends on Setup; **blocks** all stories. T004 (baseline) and T005/T006 (pipeline) can run in parallel.
- **US1 (Phase 3)**: depends on Foundational (needs transcoded images + manifest from T006).
- **US2 (Phase 4)**: depends on Foundational; independent of US1 (can run in parallel after Phase 2).
- **US3 (Phase 5)**: depends on Foundational; T016 (GSAP→motion) in US2 makes `gsap` removable — T019/T021 should run after T016. Otherwise independent of US1.
- **Polish (Phase 6)**: depends on all three stories complete.

### Within stories
- US1: images (T007/T008) before build check (T012); fonts (T009) before index.html preload (T010).
- US2: rAF refactor (T013) → poster (T014) → mobile frames (T015) → GSAP conversion (T016) → reduced-motion (T017) → mobile re-test (T018).
- US3: dep removal (T019/T020) → dead code (T021) → headers (T022) → bundle check (T023).

### Parallel Opportunities
- All `[P]` Setup tasks (T001, T003) parallel.
- T004 (baseline capture) ∥ T005/T006 (pipeline) in Foundational.
- US1 image wiring (T007) ∥ US1 font work (T009/T010/T011) after Foundational.
- US2 ∥ US3 (after Phase 2) where files don't collide (`src/App.tsx` is shared by US1/US2/US3 — serialize edits to it).

---

## Notes
- `[P]` = different files / no dependency conflicts. `src/App.tsx` is edited by US1, US2, and US3 — those specific tasks must be sequenced, not parallelized.
- No automated tests are added (spec did not request them; repo has none). Verification = typecheck + build + Lighthouse per `quickstart.md`.
- Commit after each task or logical group; stop at each Checkpoint to validate independently.
- Benchmark gate (T024/T025) is mandatory before any "done" claim (constitution Principle 1 / FR-010).
