# Research: Fix Hero Mobile Scroll-Scrubbing

**Feature**: `003-fix-hero-mobile-scrub`
**Created**: 2026-07-18
**Spec**: [spec.md](./spec.md)

This document resolves the technical unknowns for tuning the Hero scroll-scrubbing on mobile. It is grounded in the existing implementation (`src/App.tsx` `HeroScrollFrames`) and the project constitution (Performance, Security, Mobile-First Responsiveness).

## R1. Scroll travel / pacing math on mobile

- **Decision**: Derive the hero scroll travel from element geometry rather than a fixed `window.innerHeight * 6` multiple. Compute the sticky element's start/end scroll positions from its `getBoundingClientRect()` relative to current scroll (once, and on resize), so progress = `(scrollY - start) / travel` stays correct regardless of browser chrome.
- **Rationale**: Mobile browsers dynamically resize `innerHeight` as the address bar shows/hides during scroll (`window.innerHeight` is captured once at load can go stale). A geometry-based travel stays aligned through address-bar show/hide and across device sizes, fixing the "misaligned at end of travel" defect (FR-003).
- **Alternatives considered**: Fixed `100dvh` unit — still subject to chrome animation mid-scroll and does not address pacing. Keep a mobile-tuned travel multiplier (e.g., a shorter, snappier scrub) but compute it from geometry, not a hard-coded `innerHeight * 6`.

## R2. Avoiding scroll-jacking on touch

- **Decision**: Keep the passive, rAF-coalesced scroll listener (already present). Additionally: (a) gate the update loop with an `IntersectionObserver` so work only runs while the hero is on screen; (b) set `touch-action: manipulation` (and `overscroll-behavior: contain` scoped to the hero) to remove competing gesture recognizers; (c) keep the loop free of layout reads (`getBoundingClientRect`, `offsetTop`) — only re-measure geometry on resize, not per frame; (d) promote the canvas with `will-change: transform`.
- **Rationale**: `passive: true` stops the listener from blocking the compositor but does not prevent main-thread jank or gesture interference. IntersectionObserver removes off-screen work; `touch-action` suppresses double-tap zoom/pan competition; zero per-frame layout reads avoid forced synchronous layout (FR-005).
- **Alternatives considered**: `overscroll-behavior: none` globally — can break native pull-to-refresh and is unnecessary; applied `contain` only at the hero scope instead.

## R3. Frame delivery lag on touch fling

- **Decision**: Maintain a decode-ahead buffer (~8 frames) beyond the current scroll position using `img.decode()` for pre-decode, and cancel stale preloads when the user scrolls past. On mobile, prefer the existing lower-resolution `mobile` frame variants and consider a reduced mobile frame count only if a low-end gate requires it (alignment preserved).
- **Rationale**: Touch flings can outpace 60fps input; a small ahead buffer ensures the compositor never stalls on decode, keeping visible frame within one frame of target (FR-002, FR-006).
- **Alternatives considered**: On-demand decode only — causes visible lag; preloading all 174 frames — wastes memory and hurts LCP.

## R4. Frame-to-progress mapping

- **Decision**: Compute `frameIndex = Math.round(progress * (totalFrames - 1))`, clamped to `[0, totalFrames - 1]`. No sub-pixel `drawImage` interpolation (would blur and add GPU cost). This matches the existing code's `Math.round` approach and is the least-jumpy mapping.
- **Rationale**: `Math.round` minimizes perceived jump distance versus `Math.floor`. Sub-pixel canvas draws blur the image and increase cost.
- **Alternatives considered**: Linear interpolation/crossfade between two frames — added complexity and blur without perceptible benefit at 174 frames.

## R5. Safe-area / mobile typography layout

- **Decision**: Apply `padding: env(safe-area-inset-*)` to hero overlay containers; use `clamp()` fluid type scales (e.g., `clamp(1.5rem, 5vw, 3rem)`); constrain hero with `max-width` + `margin-inline: auto`; add `overflow-x: hidden` guard. Differentiate a small (~375px) vs larger (~412px) phone via `clamp()`/fluid spacing rather than brittle fixed breakpoints.
- **Rationale**: Notched devices and variable chrome make fixed margins unsafe; `clamp()` stays proportional without brittle media queries; horizontal overflow on small phones causes layout shift (FR-007, FR-008, FR-009).
- **Alternatives considered**: Fixed breakpoints at 375px/414px — brittle across Android fragmentation.

## R6. Measuring success on real devices

- **Decision**: Capture, on a real iPhone SE and Pixel:
  - Chrome DevTools remote debugging **Performance** panel: record a fast fling; verify no main-thread tasks > 50ms and no rAF gaps > 16ms.
  - **Lighthouse mobile**: INP ≤ 200ms, no scroll-jank warnings.
  - **Performance Monitor** frame-rate graph: sustained ~60fps, ≤1 frame lag visually.
  - **Alignment check**: at scroll-end, compare rendered frame index to scroll-derived target (within ±1 frame).
- **Rationale**: Directly measures the defined success criteria (SC-001..SC-007) on real devices, not just desktop emulation.
- **Alternatives considered**: Lab-only fixed-viewport tests — miss real address-bar resizing and touch fling dynamics.

## Consolidated decisions

| Area | Decision |
|------|----------|
| Travel/pacing | Geometry-derived travel + `VisualViewport`/resize re-measure; mobile-tuned multiplier |
| No scroll-jacking | Passive rAF loop + `IntersectionObserver` gate + `touch-action: manipulation` + scoped `overscroll-behavior: contain` + no per-frame layout reads |
| Frame lag | Decode-ahead buffer (~8) via `img.decode()`, cancel stale preloads, mobile-res variants |
| Mapping | `Math.round` + clamp, no sub-pixel interpolation |
| Typography/safe-area | `env(safe-area-inset-*)`, `clamp()` type, `overflow-x: hidden`, fluid spacing |
| Verification | Real-device DevTools Performance + Lighthouse mobile + alignment check on iPhone SE & Pixel |
