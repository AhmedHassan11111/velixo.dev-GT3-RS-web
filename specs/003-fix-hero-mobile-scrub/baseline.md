# Mobile Performance Baseline — Before Fix

**Feature**: `003-fix-hero-mobile-scrub`
**Captured**: 2026-07-18
**Purpose**: Before-state reference for FR-013 / SC-006 (Lighthouse/DevTools before/after).

## Note on capture method

A real-device Lighthouse/DevTools run on a physical iPhone SE / Pixel is not available in this
environment. The baseline below is derived from **static code analysis** of the current
production build (`src/App.tsx` `HeroScrollFrames`, `index.html` hero markup). It documents the
defects that this feature fixes so the after-fix state can be compared.

When physical devices become available, re-run `quickstart.md` V1/V5 on iPhone SE + Pixel and
replace this analysis with measured Lighthouse/DevTools numbers.

## Identified before-state issues (driving the fix)

1. **Stale viewport height (FR-003/FR-005, R1)**: `measureLayout()` sets
   `scrollDist = window.innerHeight * 6` once at mount. On mobile, the address bar show/hide
   changes `innerHeight` mid-scroll, so `progress` drifts and the final frame no longer aligns
   with the section boundary → the "misaligned at end of travel" defect.
2. **Per-frame layout reads (FR-005)**: `measureLayout` reads `section.offsetTop` at mount, and
   there is no protection against layout reads inside the scroll/update path on resize.
3. **No touch-scroll tuning (FR-004, R2)**: the loop is passive but there is no
   `IntersectionObserver` gate, no `touch-action`, and no decode-ahead buffer tuned for touch
   flings → perceived jank / frame lag behind a fast fling.
4. **Mobile typography not tuned (FR-007/FR-008/FR-009, R5)**: hero `#hero-text` uses fixed
   `padding: 6rem 1.5rem 5rem` and `h1` `font-size: 1.875rem`; no `env(safe-area-inset-*)`, no
   `clamp()` → overflow/collision risk on ≤480px and notched devices.

## Build artifacts (baseline)

- `npm run build` succeeds (2079 modules, ~7.7s).
- JS bundle: `index-BlM9r2UZ.js` 269.60 kB / gzip 82.84 kB; `motion` chunk 145.88 kB / gzip 48.52 kB.
- CSS: `index-B5pS5pYb.css` 33.60 kB / gzip 6.82 kB.

## After-fix target (from spec Success Criteria)

- SC-001: final frame aligned within ±1 frame at scroll-end on iPhone SE & Pixel.
- SC-002: ≤1 frame lag during steady scroll (slow + fast fling).
- SC-003: 0 scroll-jacking instances.
- SC-004/SC-005: 0 horizontal overflow / 0 safe-area cut-off on both devices.
- SC-006: INP ≤ 200ms, no hero-attributable >50ms task (no regression vs above baseline).
- SC-007: verification records exist for both devices.
