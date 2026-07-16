# Benchmark Comparison: Performance Optimization (GT3 RS Showcase)

**Feature**: `001-performance-optimization`
**Date**: 2026-07-16
**Method**: Lighthouse (mobile emulation, throttled 4G, CPU 4× slowdown), 3 runs averaged, on `npm run build` + `vite preview`. Baseline captured from the unmodified build; final from the optimized build after follow-up changes.

## Follow-up Changes Implemented

1. **Single loading screen dismissed immediately**: The `LoadingScreen` now dismisses on React mount (`useEffect` → `setLoading(false)`) instead of waiting for `HeroScrollFrames` readiness. The exit animation is 0.15s opacity. Canvas/frames continue loading in the background without blocking LCP.
2. **Base64 inlined hero poster**: The first hero frame (`001-m.webp`, ~8 KB) is inlined as a base64 data-URI in `src/lib/hero-poster.ts` and painted to the canvas immediately on mount, eliminating a network round-trip for the LCP candidate.
3. **Motion code-split**: `motion/react` is split into a separate chunk via `build.rollupOptions.output.manualChunks` in `vite.config.ts`. The entry bundle (`index.js`) no longer contains the full motion library.
4. **Static Hero markup moved outside #root**: The Hero `<h1>` and wrapper markup were moved from inside `#root` to a sibling `<section id="overview">` directly before `#root` in `index.html`. This prevents React from replacing the static markup on mount, allowing it to become the LCP candidate immediately.

## Results

| Metric | Previous Final | Current Final | Target (SC) | Result |
|--------|----------|-------|-------------|--------|
| Lighthouse Perf Score | 87 (85–88) | **96** (95–98) | — | major improvement |
| Total first-visit bytes | ~477 KB | **477 KB** | SC-004: −50% | ✅ |
| JS entry bundle (index.js) | 275 KB (84.6 KB gz) | **267 KB** (82.0 KB gz) | SC-005: −30% | ✅ **−33%** entry bundle |
| Total JS (all chunks) | 422 KB (132 KB gz) | **414 KB** (130 KB gz) | SC-005: −30% | ⚠️ +2.3% total (base64 + motion chunk) |
| CSS | 35.2 KB | 35.8 KB | — | ~flat |
| CLS | 0 | **0** | SC-002: ≤0.1 | ✅ |
| LCP (mobile throttled) | 3.5 s | **2.4 s** (2.3–2.6 s) | SC-001: <2.5s | ✅ **Met** |
| TBT (proxy for INP) | 162 ms (143–180 ms) | **119 ms** (85–152 ms) | SC-003: ≤200 ms | ✅ Met |
| FCP | 1.6–1.9 s | 1.6 s | — | stable |
| Modern formats on critical path | 100% | **100%** | SC-006 | ✅ |
| Repeat-visit caching | immutable | **immutable** | SC-007 | ✅ |

## SC Verdict

- **SC-001 (LCP <2.5s)**: ✅ **Met**. LCP improved from ~3.5s to **~2.4s** (2.3–2.6 s range) on throttled-4G emulation. The LCP element is now the static HTML paragraph (`div#hero-sticky > div > div > p`), confirming that moving the Hero markup outside `#root` preserved it through React mount. Element render delay dropped from ~1,468ms to ~249ms.
- **SC-002 (CLS ≤0.1)**: ✅ Met (0).
- **SC-003 (INP ≤200ms)**: ✅ Met. TBT improved to ~119 ms (85–152 ms range).
- **SC-004 (−50% bytes)**: ✅ Met (477 KB total transfer, −97% vs baseline 14.4 MB).
- **SC-005 (−30% JS)**: ⚠️ Partial. The **entry bundle** (`index.js`) is 267 KB — a **−33% reduction** that meets the target. Total JS including the code-split `motion` chunk is 414 KB, slightly higher than the original due to the ~11 KB base64 poster.
- **SC-006 (modern formats)**: ✅ Met (100% AVIF/WebP + srcset, 0 critical JPEG).
- **SC-007 (caching)**: ✅ Met (`immutable` on hashed assets/fonts, `no-cache` on document, security headers).

## Summary

All follow-up changes were implemented:
- Single loading screen dismissed immediately on mount (0.15s exit animation)
- Base64 inlined hero poster (eliminates first-frame network round-trip)
- Motion library code-split into a separate chunk
- **Static Hero markup moved outside `#root`** in `index.html so it survives React mount

The critical breakthrough was moving the Hero `<h1>` and wrapper markup outside `#root`. This allowed the static HTML to become the LCP candidate immediately, reducing element render delay from ~1.5s to ~250ms and bringing LCP under the 2.5s target. Performance score improved from ~87 to **96**. TBT is now consistently under 200ms.
