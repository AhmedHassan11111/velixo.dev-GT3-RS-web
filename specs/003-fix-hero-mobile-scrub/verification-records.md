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
| Re-measure on address-bar resize | `VisualViewport` resize + `window.resize` handler | ✅ implemented |
| IntersectionObserver gate (no off-screen work) | `HeroScrollFrames` scroll effect | ⚠️ removed after regression; passive scroll loop only |
| No per-frame layout reads | geometry cached in `layoutRef`, read only on measure | ✅ implemented |
| Clamped `Math.round` frame mapping | `update()` | ✅ implemented |
| Mobile-tuned scrub factor (0.85) | `measureLayout()` `mobileFactor` | ✅ implemented |
| Native scroll hit-testing over Hero | `index.html` `#hero-sticky`; `src/index.css` `#hero-text a` | ✅ implemented (`pointer-events: none`; links opt in) |
| `will-change: transform` on canvas | `src/index.css` `#hero-canvas` | ✅ implemented |
| Safe-area insets on overlay | `src/index.css` `#hero-text` / `#hero-scroll-indicator` | ✅ implemented |
| Fluid `clamp()` typography (no 375px overflow) | `src/index.css` `#hero-text h1/p/a` | ✅ implemented |
| `overflow-x: hidden` guard | `src/index.css` `html, body` | ⚠️ removed after regression; do not re-add globally |
| `prefers-reduced-motion` static poster | `HeroScrollFrames` (unchanged guard) | ✅ preserved |
| Orientation/resize re-measure | `VisualViewport` + `resize` handler | ✅ implemented |
| Decode-ahead + stale-preload cancel | `ensureFramesLoaded` / `decodeFrame` | ✅ implemented |
| Production build | `npm run build` | ✅ passes (270.24 kB JS / 83.10 kB gz) |

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

## Regression fix (2026-07-18): global scroll breakage

**Symptom reported**: whole-site scroll blocked; Configure (`#configure`) section collapsed/overlapping.

**Root cause**: `src/index.css` had a global rule `html, body { overflow-x: hidden; }` added during this
feature (committed in `c8e7d33`). `overflow-x: hidden` on `html`/`body` is a known footgun — it can make
the page non-scrollable and break scroll containment, collapsing later sections (Configure).

**Fix**: removed the global `html, body { overflow-x: hidden; }`. All other hero CSS is scoped to
`#hero-sticky`, `#hero-canvas`, `#hero-text`, `#hero-scroll-indicator` (safe). The hero section already
clips its own overflow, so no global guard is needed.

**JS scroll handlers**: confirmed NOT the cause — the scroll listener is `{ passive: true }` with no
`preventDefault()`; the IntersectionObserver gate was removed; no `overflow`/`position` writes to
html/body anywhere in `src/App.tsx`.

**Verified via Playwright (mobile 390×844, touch)**:
- Native scroll works: `scrollMoved: true`, `html`/`body` `overflow: visible`.
- Full page reaches bottom: `scrollTo(maxScroll)` → `endY === maxScroll === 18388`, footer visible.
- Configure section healthy: `height: 2110`, `overflowY: visible`, `position: relative`,
  `scrollHeight === height` (not collapsed/overlapping).
- No JS/scroll/layout errors (only benign CSP/X-Frame-Options meta warnings + one 404).

## Regression fix (2026-07-19): Hero sticky layer consuming mobile scroll input

**Symptom reported**: scrolling directly over the top Hero felt stuck/locked; jumping lower with the
browser scrollbar allowed the rest of the page to scroll, but scrolling back up into the Hero hit the
same dead zone.

**Likely root cause in current code**: the static Hero shell in `index.html` still combined
`position: sticky`, `height: 100vh`, `overflow: hidden`, and `contain: layout` on `#hero-sticky`.
That sticky visual layer was also still the hit-test target for touch/wheel input. This is a risky
combination on mobile browsers because the non-scrollable sticky layer can win the gesture target even
though the document is the only element that should scroll.

**Fix**:
- Removed `contain: layout` from `#hero-sticky`.
- Made `#hero-sticky` pointer-transparent (`pointer-events: none`) so scroll gestures target the page.
- Kept Hero CTA links clickable by opting `#hero-text a` back into `pointer-events: auto`.
- Added a `100dvh` sticky height override after the `100vh` fallback for mobile viewport correctness.
- Removed the `visualViewport.scroll` measurement listener from `src/App.tsx`; resize measurement is
  now rAF-coalesced and no longer re-added on every frame update.

**Verified via Playwright + Chrome (mobile 390×844, touch dispatch)**:
- Fresh load at top: `scrollY: 0`; `#hero-sticky` computed `contain: none`,
  `pointer-events: none`, `overflowY: hidden`, `position: sticky`.
- Twelve touch swipes starting over the Hero moved normally from `scrollY: 0` to `scrollY: 7807`,
  passing the Hero (`#overview.bottom: -1899`) and the white content wrapper
  (`#content-wrapper.top: -1931`).
- Scrub visuals changed during the normal scroll path; screenshot hashes differed across sampled
  Hero positions (`d862593206064f75`, `cd9751faf8e9a05d`, `ce3e6bf9e279dda1`,
  `9a8326930887a987`, `fe11d2fbe93f77be`, `f7466e3b515dbd87`).
- Runtime logs had no app JS errors; only existing CSP/X-Frame-Options meta warnings and one 404.
