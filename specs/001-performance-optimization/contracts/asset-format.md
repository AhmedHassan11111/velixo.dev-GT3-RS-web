# Contract: Asset Format & Responsive Image Matrix

**Feature**: `001-performance-optimization` | **Part of**: [plan.md](../plan.md) Phase 1
**Satisfies**: FR-001, FR-002, FR-003, SC-004, SC-006

This contract defines the format and responsive-variant rules every image in the site MUST obey after optimization. It is the acceptance standard for the `scripts/optimize-images.mjs` pipeline and for hand-edited `<picture>` markup in `src/App.tsx`.

---

## 1. Format ladder (per image)

Every photographic image MUST be produced in, and served via, this `<picture>` order (most modern first):

```html
<picture>
  <source type="image/avif" srcset="...avif 640w, ...avif 1024w, ..." sizes="...">
  <source type="image/webp" srcset="...webp 640w, ...webp 1024w, ..." sizes="...">
  <img src="...jpg" srcset="...jpg 640w, ...jpg 1024w, ..." sizes="..." alt="..." loading="..." decoding="async">
</picture>
```

- AVIF is the primary encoding (FR-001). WebP is the fallback. JPEG is the ultimate fallback (edge case: no AVIF/WebP support).
- Quality target: AVIF `q≈50`, WebP `q≈75`, visually lossless vs source. No banding on gradients (hero/section photos).

## 2. Responsive width sets

| Image group | Widths (`srcset`) | `sizes` hint | Notes |
|-------------|------------------|--------------|-------|
| Hero frames (canvas) | desktop `1600`, mobile `800` | n/a (painted to canvas at viewport size) | Two resolution sets by viewport (R4); format AVIF/WebP |
| Large section photos (`section.jpg`, `section3.jpg`, `section4.jpg`, `dark.jpg`) | `640, 1024, 1600, 2400` | `(max-width:768px) 100vw, 80vw` | Critical/above-fold get eager + high-pri |
| Gallery / technology cards (`fhoto*.jpg`, `thirdcard.jpg`, `tech-*.jpg`) | `640, 1024, 1600` | `(max-width:768px) 100vw, (max-width:1024px) 50vw, 25vw` | Below-fold → `loading="lazy"` (FR-003) |

## 3. Lazy loading (FR-003)

- Above-the-fold / LCP candidates: `loading="eager"`, `fetchpriority="high"`, `decoding="async"`.
- Everything below the first viewport: `loading="lazy"`, `decoding="async"`.
- Hero frames are preloaded in JS (not via `<img>`), so lazy rules apply to the regular `<img>` tags only.

## 4. Acceptance

- An image FAILS this contract if served as a single uncompressed full-size JPEG on the critical path (SC-006 = 0 such cases).
- An image PASSES if AVIF+WebP present, `srcset` matches its group's width set, and `sizes`/`loading` match its fold position.
