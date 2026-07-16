# Quickstart: Verifying the Performance Optimization

**Feature**: `001-performance-optimization` | **Part of**: [plan.md](../plan.md) Phase 1
**Purpose**: Runnable steps to prove the feature works end-to-end and meets the success criteria (FR-010 benchmark gate).

Prerequisites:
- Node 22 + the project's `npm install` completed.
- `sharp` available (added as a devDependency by the image pipeline task) for transcoding.
- A Chromium-based browser for Lighthouse (local Chrome or `@lhci/cli`).

---

## 1. Baseline capture (do FIRST — FR-010)

```bash
# Install deps (includes sharp + lighthouse if added as devDeps)
npm install

# Build the CURRENT (unmodified) site to measure baseline
npm run build
npm run preview -- --port 4173 &
# In another shell, run Lighthouse mobile (throttled 4G) against http://localhost:4173
npx lhci autorun --collect.url=http://localhost:4173 \
  --collect.settings.preset=desktop:false \
  --collect.throttling.cpuSlowdownMultiplier=4
```

Record the resulting **LCP / CLS / INP / total bytes / JS bytes** as the `baseline` `CWVSnapshot` (see data-model.md). Save to `specs/001-performance-optimization/benchmarks/baseline.json`.

## 2. Apply the optimization

```bash
# Transcode all public images to AVIF/WebP + responsive widths
node scripts/optimize-images.mjs

# (manual) Edit src/App.tsx per plan: <picture> markup, rAF hero rewrite,
#         remove dead deps, self-host fonts; update index.html (preload, title, CSP)
# (manual) Update vite.config.ts for cache headers
```

## 3. Build & re-benchmark (final)

```bash
npm run build
npm run preview -- --port 4173 &
npx lhci autorun --collect.url=http://localhost:4173 \
  --collect.settings.preset=desktop:false \
  --collect.throttling.cpuSlowdownMultiplier=4
```

Save results as `final` `CWVSnapshot` in `benchmarks/final.json`.

## 4. Expected outcomes (Success Criteria)

| Check | How to verify | Target |
|-------|---------------|--------|
| SC-001 LCP −40% | `final.lcpMs` vs `baseline.lcpMs` | ≥ 40% lower, ideally < 2.5 s |
| SC-002 CLS ≤ 0.1 | Lighthouse CLS + manual full scroll | ≤ 0.1 |
| SC-003 INP ≤ 200 ms | Lighthouse INP during hero scroll | ≤ 200 ms, no >50 ms scroll long task |
| SC-004 −50% bytes | `final.totalBytes` vs `baseline` | ≥ 50% lower |
| SC-005 −30% JS | `final.jsBytes` vs `baseline` | ≥ 30% lower |
| SC-006 modern formats | `npx lhci` uses + Network tab on critical path | 0 full-size JPEG critical |
| SC-007 caching | Repeat visit Network tab | hashed assets `200 (memory/disk)`, immutable |

## 5. Mobile re-test (FR-011, Constitution Principle 3)

- Open the `preview` URL in device emulation at **iPhone SE (375×667)** and **Pixel 5 (393×851)**.
- Scroll the full 700vh hero; confirm smooth frame advance, no jank, final frame matches scroll position.
- Confirm no layout shift and fonts swap without FOIT.

## 6. Negative / edge checks

- Disable AVIF (Chrome `image.avif.enabled=false`) → WebP served; disable WebP → JPEG served (contract `asset-format.md`).
- `prefers-reduced-motion: reduce` → static poster frame, no scrub loop.
- Kill one hero frame request → procedural canvas telemetry fallback still renders.

---

**Note**: This file is a validation/run guide only. Implementation details belong in `tasks.md` and the implementation phase.
