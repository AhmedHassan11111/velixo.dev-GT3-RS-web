import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Security headers applied to every response (Constitution Principle 2).
function applySecurityHeaders(res: any) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: blob:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

// Cache-Control policy per asset class (contracts/serving-headers.md, FR-009).
function applyCacheHeaders(reqUrl: string, res: any) {
  const url = reqUrl.split('?')[0];
  if (/\/assets\/[A-Za-z0-9_-]+\.(js|css)$/.test(url)) {
    // Vite content-hashed build assets → safe to cache forever.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (/\/(fonts|gen)\//.test(url) && /\.(woff2|avif|webp|jpg)$/.test(url)) {
    // Self-hosted fonts + generated images (versioned by name/path) → immutable.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (/\.(avif|webp|jpg|jpeg|png|svg|woff2)$/i.test(url)) {
    // Stable-named public images → moderate TTL + revalidation.
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  // index.html and other documents are served without caching (revalidate on deploy).
}

// Shared middleware for dev + preview: security + cache headers (read-only static).
function cacheAndSecurityMiddleware() {
  return (req: any, res: any, next: () => void) => {
    applySecurityHeaders(res);
    applyCacheHeaders(req.url || '', res);
    next();
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'perf-headers',
        configureServer(server) {
          server.middlewares.use(cacheAndSecurityMiddleware());
        },
        configurePreviewServer(server) {
          server.middlewares.use(cacheAndSecurityMiddleware());
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'motion': ['motion/react'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
