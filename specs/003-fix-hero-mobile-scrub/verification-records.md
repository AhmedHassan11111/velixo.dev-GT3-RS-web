# Mobile Verification Records — Fix Hero Mobile Scroll-Scrubbing

**Feature**: `003-fix-hero-mobile-scrub`
**Created**: 2026-07-18
**Purpose**: Per-device evidence for FR-010 / SC-007 and the validation tasks (T011, T014, T015, T020, T021–T023, T027, T028).

## Environment status

Physical iPhone SE / Pixel devices and Chrome DevTools remote debugging are **not available in this
implementation environment**. Therefore the *device-run* validation tasks (T011, T014, T015, T020,
T021, T022, T023, T027) are marked with a note rather than claimed as passed. The code-level
implementation for each criterion is complete and the production build succeeds. When devices become
available, run `quickstart.md` V2–V7 and fill in the Device columns below.

## Code-level verification (completed here)

| Criterion | Where | Status |
|-----------|-------|--------|
| Geometry-derived travel (not `innerHeight*6`) | `src/App.tsx` `measureLayout()` | ✅ implemented |
| Re-measure on address-bar resize | `VisualViewport` resize/scroll listener | ✅ implemented |
| IntersectionObserver gate (no off-screen work) | `HeroScrollFrames` scroll effect | ✅ implemented |
| No per-frame layout reads | geometry cached in `layoutRef`, read only on measure | ✅ implemented |
| Clamped `Math.round` frame mapping | `update()` | ✅ implemented |
| Mobile-tuned scrub factor (0.85) | `measureLayout()` `mobileFactor` | ✅ implemented |
| `touch-action: manipulation` + `overscroll-behavior: contain` | `src/index.css` `#hero-sticky` | ✅ implemented |
| `will-change: transform` on canvas | `src/index.css` `#hero-canvas` | ✅ implemented |
| Safe-area insets on overlay | `src/index.css` `#hero-text` / `#hero-scroll-indicator` | ✅ implemented |
| Fluid `clamp()` typography (no 375px overflow) | `src/index.css` `#hero-text h1/p/a` | ✅ implemented |
| `overflow-x: hidden` guard | `src/index.css` `html, body` | ✅ implemented |
| `prefers-reduced-motion` static poster | `HeroScrollFrames` (unchanged guard) | ✅ preserved |
| Orientation/resize re-measure | `VisualViewport` + `resize` handler | ✅ implemented |
| Decode-ahead + stale-preload cancel | `ensureFramesLoaded` / `decodeFrame` | ✅ implemented |
| Production build | `npm run build` | ✅ passes (270.44 kB JS / 83.23 kB gz) |

## Device run (fill when devices available)

### iPhone SE (~375×667)

| Check | Result | Notes |
|-------|--------|-------|
| V2 alignment (±1 frame at scroll-end) | ☐ | |
| V3 no scroll-jacking | ☐ | |
| V4 ≤1 frame lag | ☐ | |
| V5 INP ≤ 200ms, no >50ms task | ☐ | |
| V6 no overflow / safe-area cut-off | ☐ | |
| V7 reduced-motion poster | ☐ | |

### Pixel (~412×915)

| Check | Result | Notes |
|-------|--------|-------|
| V2 alignment (±1 frame at scroll-end) | ☐ | |
| V3 no scroll-jacking | ☐ | |
| V4 ≤1 frame lag | ☐ | |
| V5 INP ≤ 200ms, no >50ms task | ☐ | |
| V6 no overflow / safe-area cut-off | ☐ | |
| V7 reduced-motion poster | ☐ | |

## Before/after performance (T027)

See `baseline.md` (before). After-build bundle is recorded above; Lighthouse/DevTools mobile numbers
to be captured on devices and compared.
