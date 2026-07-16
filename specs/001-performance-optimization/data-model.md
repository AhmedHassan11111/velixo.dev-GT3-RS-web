# Data Model: Performance Optimization (GT3 RS Showcase)

**Feature**: `001-performance-optimization` | **Date**: 2026-07-16

This feature has no persistent application data (no database, no user records). The "data" it manages is **build-time asset metadata** and a **measurement record** used to prove the success criteria. Entities below are intentionally lightweight — they describe facts the build pipeline and benchmark produce, not runtime domain objects.

---

## Entity 1 — StaticAsset

Represents one image (or font) file served by the site.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Stable key, e.g. `section`, `dark`, `hero-frame-001` |
| `sourcePath` | string | Original file in `public/` (e.g. `public/section.jpg`) |
| `formats` | enum[] | Generated encodings: `avif`, `webp`, `jpeg` (fallback) |
| `widths` | number[] | Responsive width variants produced (e.g. `[640, 1024, 1600, 2400]`) |
| `defaultWidth` | number | Width chosen for the LCP/critical path |
| `bytesByFormat` | map<format, bytes> | Compressed size per format (drives SC-004/SC-006) |
| `lazy` | boolean | `true` if below the fold and deferred (FR-003) |
| `cachePolicy` | string | `Cache-Control` applied at serving layer (FR-009) |

**Relationships**: A `HeroFrame` is a specialized `StaticAsset` (see below).

**Validation rules**:
- Every photographic `StaticAsset` MUST have at least `avif` + `webp` (+ `jpeg` fallback) — FR-001.
- Every content `StaticAsset` with `lazy=false` (critical path) MUST have `widths` and be referenced via `<picture>` + `srcset`/`sizes` — FR-002.
- No `StaticAsset` on the critical path may exceed its pre-optimization byte size — SC-006.

---

## Entity 2 — HeroFrame

A single frame of the 174-image hero canvas sequence.

| Attribute | Type | Description |
|-----------|------|-------------|
| `index` | number | 1..174 (sequence order) |
| `format` | enum | `avif` \| `webp` \| `jpeg` (fallback) |
| `desktopWidth` | number | Frame pixel width for ≥768 px viewports |
| `mobileWidth` | number | Frame pixel width for <768 px viewports (R4) |
| `decodeCost` | relative | Estimated decode/paint cost (smaller width = lower) |
| `preloaded` | boolean | Whether it is in the initial preload set |

**Relationships**: 174 `HeroFrame` instances compose the hero animation; collectively they are painted to one `<canvas>` (not `<img>`), so `srcset`/`sizes` does not apply — only format + resolution variants.

**State transitions**:
- `idle` → `preloading` (Image object created) → `ready` (decoded) → `painted` (drawn to canvas at scroll progress) → on error → `fallback` (procedural canvas telemetry, must remain intact).

**Validation rules**:
- Frame 0 (or a mid frame) MUST be painted as the LCP poster immediately on load — SC-001.
- The scroll update MUST NOT read layout properties between `ready` and `painted` — FR-007.

---

## Entity 3 — CWVSnapshot

A captured Core Web Vitals measurement at a point in time, used for before/after comparison (FR-010).

| Attribute | Type | Description |
|-----------|------|-------------|
| `label` | string | `baseline` \| `final` |
| `capturedAt` | datetime | When measured |
| `device` | string | `mobile-emulated` \| `real-device-A` \| `real-device-B` |
| `lcpMs` | number | Largest Contentful Paint (ms) |
| `cls` | number | Cumulative Layout Shift |
| `inpMs` | number | Interaction to Next Paint (ms) |
| `totalBytes` | number | First-visit transferred bytes |
| `jsBytes` | number | Production JS bundle bytes |
| `tool` | string | `lighthouse` \| `webpagetest` \| `devtools` |

**Validation rules**:
- A `baseline` snapshot MUST exist before any optimization merge — FR-010.
- `final` vs `baseline` MUST satisfy SC-001 (LCP −40%), SC-002 (CLS ≤0.1), SC-003 (INP ≤200 ms), SC-004 (−50% bytes), SC-005 (−30% JS).
