# Contract: Static Asset Serving Headers

**Feature**: `001-performance-optimization` | **Part of**: [plan.md](../plan.md) Phase 1
**Satisfies**: FR-009, SC-007, Constitution Principle 2 (security headers)

This contract defines the HTTP response headers the production serving layer MUST emit for static assets. It applies to whichever mechanism serves the built `dist/` (a thin Node static server for local `preview`, or the host's header manifest for the real deploy).

---

## 1. Cache-Control by asset class

| Asset class | Path pattern | `Cache-Control` | Rationale |
|-------------|--------------|-----------------|-----------|
| Hashed build assets | `/assets/*.js`, `/assets/*.css` (Vite content hashes) | `public, max-age=31536000, immutable` | Content-addressed → safe to cache forever (SC-007) |
| Self-hosted fonts | `/fonts/*.woff2` | `public, max-age=31536000, immutable` | Versioned by filename → immutable |
| Optimized images | `/public/*`, `/ezgif-*/` (stable names) | `public, max-age=86400` + `ETag` | Names not hashed → moderate TTL + revalidation |
| Document | `/index.html` | `no-cache` (or `max-age=0, must-revalidate`) | Always revalidate so deploys show immediately |

## 2. Security headers (Constitution Principle 2)

Emitted site-wide on the document and assets:

- `Content-Security-Policy`: restrict to `self` for `script`/`style`/`img`/`font`; `img-src` allows `self` + `data:` (canvas fallback). No `unsafe-inline` for scripts where avoidable.
- `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`).
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `HTTPS` enforced (HSTS `max-age=31536000` when behind TLS termination).

> If a Node static server is added for FR-009/FR-010 preview, it MUST be read-only static file serving + these headers only. It MUST NOT introduce server-side data handling (keeps Principle 2 surface minimal, Principle 5).

## 3. Acceptance

- A repeat visit to a hashed asset returns `304`/`200 (from cache)` with the `immutable` header — SC-007.
- `index.html` is never served `immutable` (deploy pickups must revalidate).
- Security headers present on the document response (Principle 2).
