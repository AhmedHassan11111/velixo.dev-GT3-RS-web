# Quickstart & Verification Guide: Fix Hero Mobile Scroll-Scrubbing

**Feature**: `003-fix-hero-mobile-scrub`
**Created**: 2026-07-18
**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md) · **Data Model**: [data-model.md](./data-model.md)

This guide proves the feature works end-to-end. It is a **validation/run guide**, not implementation. Commands are standard for this Vite project.

## Prerequisites

- Node + the project's installed deps (`npm install` if needed).
- A production build for realistic mobile performance: `npm run build` then serve `dist/` (e.g., `npm run preview` or a static server). Mobile perf must be measured on the **build**, not dev.
- Two real mobile devices (or remote-debug equivalents): **iPhone SE class (~375×667)** and **Pixel class (~412×915)**, with Chrome/Safari remote debugging enabled.
- Chrome DevTools on desktop for remote debugging + Lighthouse mobile.

## Validation Scenarios

### V1 — Build & smoke (every change)
```bash
npm run build
npm run preview   # serve dist/ on a LAN IP
```
**Expected**: build succeeds, no TypeScript errors, preview serves on a reachable IP.

### V2 — Mobile scrub alignment (FR-001, FR-003, SC-001)
1. Open the preview URL on **iPhone SE** and **Pixel** (remote debug or direct).
2. Slowly scroll the full hero, then a fast fling to the end.
3. At scroll end, confirm the final frame aligns with the start of the white content section (no gap / early / late transition).
4. Rotate to landscape; re-scroll; confirm still aligned (FR-012).

**Pass**: alignment within ±1 frame of scroll-derived target on **both** devices.

### V3 — No scroll-jacking on touch (FR-004, SC-003)
1. On each device, perform continuous and fast-fling touch scrolls over the hero.
2. Observe: scrollbar moves continuously, no frozen frames, no forced deceleration, no scroll-position reset, no snap-back.

**Pass**: 0 scroll-jacking instances on both devices.

### V4 — Frame-tracking / no lag (FR-002, FR-006, SC-002)
1. DevTools → Performance Monitor (or Performance panel) on each device.
2. Record a fast fling; inspect frame-rate graph and rAF cadence.

**Pass**: sustained ~60fps, visible frame never lags target by >1 frame during steady scroll.

### V5 — Performance budget (FR-005, FR-013, SC-006)
1. DevTools → Performance: record a hero scroll; confirm no main-thread task > 50ms attributable to the hero and no rAF gap > 16ms.
2. Lighthouse (mobile, throttled) on the hero page: **INP ≤ 200ms**, no scroll-jank warnings.
3. Compare against a before-build Lighthouse/Performance capture.

**Pass**: INP ≤ 200ms, no >50ms hero task, no regression vs before-build.

### V6 — Mobile typography & safe-area (FR-007, FR-008, FR-009, SC-004, SC-005)
1. On each device, view hero at rest and mid-scrub.
2. Check: heading/subhead fit with **no horizontal overflow** at 375px; overlay respects `env(safe-area-inset-*)` (notch/home indicator not cut off); small (375) vs large (412) adapt via fluid `clamp()` spacing, not a uniform scaled copy.

**Pass**: 0 overflow / 0 safe-area cut-off / 0 title collision on both devices.

### V7 — Reduced motion (FR-011)
1. Enable "Reduce motion" (iOS Accessibility / `prefers-reduced-motion`) on a device.
2. Reload hero.

**Pass**: static poster shown, no scrub loop runs.

## Per-Device Verification Record (FR-010, SC-007)

For each device (iPhone SE, Pixel) record: alignment result (V2), scroll-jacking result (V3), frame-lag result (V4), INP/perf (V5), layout (V6), reduced-motion (V7). Attach screenshots/DevTools captures. Both records must pass before the feature is "responsive" per constitution Principle 3.

## References

- Frame/travel mapping: [data-model.md](./data-model.md) (`HeroScrollTravel`, `HeroFrame`).
- Design rationale: [research.md](./research.md) (R1–R6).
- Requirements/acceptance: [spec.md](./spec.md) User Stories 1–4 and FR-001..FR-013.
