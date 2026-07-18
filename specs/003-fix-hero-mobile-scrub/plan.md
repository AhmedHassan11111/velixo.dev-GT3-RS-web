# Implementation Plan: Fix Hero Mobile Scroll-Scrubbing

**Branch**: `003-fix-hero-mobile-scrub` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-fix-hero-mobile-scrub/spec.md`

## Summary

The Hero's 174-frame canvas scroll-scrub looks broken/misaligned and janky on mobile because its scroll travel, pacing, and overlay layout are derived from desktop assumptions (`window.innerHeight * 6`, desktop type scale). This plan tunes the scrub **specifically for small touch viewports**: geometry-derived travel (robust to address-bar resize), an IntersectionObserver-gated passive rAF loop with no per-frame layout reads, a decode-ahead frame buffer, mobile-tuned typography/safe-area overlay, and verification on a real iPhone SE and Pixel. The existing canvas + rAF + passive-scroll architecture is retained; this is parameter/layout tuning, not a rewrite.

## Technical Context

**Language/Version**: TypeScript 5.x on React 19 + Vite 6 (per existing `src/App.tsx`, `package.json`).

**Primary Dependencies**: `motion` (Framer Motion, `motion/react`) and `react` (already present). No new runtime dependency is introduced (constitution Principle 5 — minimal justified additions). Browser APIs used: `IntersectionObserver`, `VisualViewport`, `HTMLImageElement.decode()`, `requestAnimationFrame`, `matchMedia`.

**Storage**: N/A (client-only static site; no backend state for this feature).

**Testing**: No automated test framework in repo; verification is manual + browser-tooling driven. Use Chrome DevTools remote debugging (Performance panel) + Lighthouse mobile on real iPhone SE and Pixel. Static checks via `tsc`/`vite build` for type/build correctness.

**Target Platform**: Mobile web — touch devices ≤480px (iPhone SE ~375×667, Pixel ~412×915), modern mobile browsers (iOS Safari, Android Chrome). Desktop behavior must not regress.

**Project Type**: Web application (frontend client-rendered static build).

**Performance Goals**: Sustained ~60fps hero scrub on mobile; INP ≤ 200ms during hero scroll; no scroll-attributable long task > 50ms; ≤1 frame lag during steady scroll (SC-002, SC-006). No regression to LCP/CLS from current build.

**Constraints**: Animations must only use `transform`/`opacity`/canvas paint, no layout thrashing (constitution Principle 1). No scroll-jacking on touch (FR-004). No new content/sections (constitution Non-Goals). No unnecessary JS/libraries (Principle 5).

**Scale/Scope**: Single Hero component (`HeroScrollFrames` in `src/App.tsx`) + hero overlay/typography + image manifest (`src/lib/images.ts`, `public/image-manifest.json`). No new routes, APIs, or copy.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| 1 — Performance | transform/opacity-only animation, rAF, no layout thrash; benchmark before/after | PASS | Loop stays rAF-coalesced, no per-frame layout reads (R2, FR-005); Lighthouse before/after required (FR-013, SC-006) |
| 2 — Security | Validate/sanitize, rate-limit, headers | N/A | No input/data handling in this feature |
| 3 — Mobile-First | Designed+tested for mobile, not scaled; re-tuned scroll for touch; mobile-specific images; ≥2 real sizes | PASS | Entire feature is mobile-specific tuning; verified on iPhone SE + Pixel (FR-001, FR-010, SC-001/007) |
| 4 — Visual Integrity | Distinct reveal directions, full-width sticky navbar | N/A | No gallery/navbar changes in scope |
| 5 — Minimal Additions | New deps justified vs P1/P2 | PASS | No new runtime dependency; only browser APIs (FR-005, R2/R3) |

No gate violations. No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/003-fix-hero-mobile-scrub/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (entities below)
├── quickstart.md        # Phase 1 output (verification guide)
├── contracts/           # Not applicable (internal UI component, no external interface)
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

The change is localized to the existing frontend; no new top-level dirs.

```text
src/
├── App.tsx                  # HeroScrollFrames: mobile travel/pacing, IO gate, decode-ahead, touch-action
├── lib/images.ts           # (read-only use) mobile frame variants already present
└── index.css / tailwind    # hero overlay: clamp() type, env(safe-area-inset-*), overflow-x guard

public/
└── image-manifest.json      # (read-only) existing mobile frame variants
```

**Structure Decision**: Single-project frontend (default). All edits are within the existing `src/App.tsx` Hero component and the global stylesheet; no new modules required unless a small helper (e.g., `src/lib/heroScroll.ts`) is extracted during implementation for clarity — that decision is left to the task phase but must not add a dependency.

## Constitution Check (post-design)

Re-validated after design: all gates remain PASS. Design introduces no new dependency, preserves the rAF/canvas architecture, keeps animation on transform/opacity/canvas, and mandates mobile verification on two real devices — fully consistent with Principles 1, 3, and 5. No changes needed.
