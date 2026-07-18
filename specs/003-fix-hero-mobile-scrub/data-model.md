# Data Model: Fix Hero Mobile Scroll-Scrubbing

**Feature**: `003-fix-hero-mobile-scrub`
**Created**: 2026-07-18
**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

This feature has no persistent data store — it is a client-side animation/layout tuning. The "entities" are the in-memory/derived concepts the implementation must track to satisfy the functional requirements. They are derived directly from the spec's Key Entities and FRs.

## Entities

### HeroScrollTravel (derived, per viewport)

Represents the scroll distance over which the 174 frames are distributed for the current viewport.

| Field | Type | Source | Validation / Rule |
|-------|------|--------|-------------------|
| `viewportClass` | enum `mobile` \| `desktop` | `window.innerWidth < 768` | Drives frame variant + pacing selection (FR-001) |
| `startScroll` | number (px) | geometry: sticky element start vs document scroll | Captured on mount + resize, **not** per frame (FR-005) |
| `travel` | number (px) | geometry-derived (element traverse distance), may be mobile-tuned | Must remain correct through address-bar show/hide (R1) |
| `progress` | number [0..1] | `(scrollY - startScroll) / travel`, clamped | Input to frame mapping (R4) |

**State transitions**: `unmeasured → measured (mount/resize) → re-measured (VisualViewport/resize while in view)`. Re-measure must never leave canvas misaligned (FR-012).

### HeroFrame (existing asset reference, read-only)

One of 174 sequentially-painted images composited onto the hero `<canvas>`.

| Field | Type | Notes |
|-------|------|-------|
| `index` | number 0..173 | frame ordinal |
| `desktop` | { avif, webp } | used when `viewportClass === desktop` |
| `mobile` | { avif, webp } | used when `viewportClass === mobile` (FR-001) |
| `decodeState` | `idle \| decoding \| ready \| failed` | runtime decode-ahead tracking (R3, FR-006) |

**Validation**: missing/broken frame → keep last good frame or poster, never blank canvas jump (Edge Case).

### HeroOverlayLayout (CSS/responsive, derived)

The hero heading/subhead/CTA + HUD overlay arrangement on small screens.

| Field | Type | Rule |
|-------|------|------|
| `typeScale` | fluid `clamp()` | no horizontal overflow at 375px (FR-007) |
| `safeAreaPadding` | `env(safe-area-inset-*)` | no cut-off on notched devices (FR-008) |
| `adaptation` | small(≈375) ↔ large(≈412) | fluid, not uniform scaled copy (FR-009) |

### MobileVerificationRecord (artifact, per device)

Captured evidence that the fix works on each real device.

| Field | Type | Rule |
|-------|------|------|
| `device` | string (e.g., "iPhone SE", "Pixel") | ≥2 distinct sizes required (FR-010) |
| `alignment` | frame delta at scroll-end (±1 target) | SC-001 |
| `smoothness` | INP ≤ 200ms, no >50ms task, ≤1 frame lag | SC-002, SC-006 |
| `layout` | no overflow/collision/safe-area cut-off | SC-004, SC-005 |
| `evidence` | notes/screenshots | SC-007 |

## Relationships

- `HeroScrollTravel` selects `viewportClass` → chooses `HeroFrame.desktop` vs `.mobile` variant.
- `HeroScrollTravel.progress` → maps (R4 `Math.round`+clamp) → `HeroFrame.index` → drawn to canvas.
- `HeroOverlayLayout` is independent of the scrub but shares the same `viewportClass`/safe-area context.
- Each tested device produces one `MobileVerificationRecord`.

## Validation Rules (from Requirements)

- FR-002: visible `HeroFrame.index` within 1 of scroll-derived target during steady scroll.
- FR-003: at `progress === 1`, drawn frame aligns with following section start (travel correct).
- FR-004: no scroll-jacking — `HeroScrollTravel` reads are not in the scroll loop.
- FR-011: `prefers-reduced-motion` → `HeroFrame.index` frozen at 0 (poster), loop not started.
- FR-012: resize/orientation → `HeroScrollTravel` re-measured, no misalignment.
