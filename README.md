<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Porsche GT3 RS Showcase

An interactive landing page for the Porsche 911 GT3 RS, featuring scroll-driven frame animations, performance specs, and color configurator.

## Security Hardening

This site includes server-side email capture hardening:

- **Server-side validation & sanitization**: All email submissions are validated and sanitized server-side before processing.
- **Rate limiting**: Email submission endpoint enforces rate limits per IP address.
- **Bot protection**: Honeypot field detects and blocks automated submissions.
- **Security headers**: CSP, X-Frame-Options, Referrer-Policy, and X-Content-Type-Options are applied site-wide.
- **Transactional email delivery**: Submissions are forwarded via Resend API (no database storage).

## Environment Variables

The email submission endpoint requires:

- `RESEND_API_KEY`: API key for transactional email delivery
- `UPSTASH_REDIS_REST_URL`: URL for Upstash Redis instance (rate limiting)
- `UPSTASH_REDIS_REST_TOKEN`: Token for Upstash Redis instance
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (optional)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set required environment variables in `.env.local`
3. Run the app:
   `npm run dev`

## Deploy

The site is a static Vite application. Deploy the `dist/` folder to any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

For serverless email submission, deploy the `api/submit-email/` function to your chosen platform and configure the required environment variables.

Security headers are configured in `public/_headers` (Netlify-compatible) and `vite.config.ts` (dev/preview mode).

## Performance

Performance benchmarks and Lighthouse CI reports are stored in `.lighthouseci/`. Run `npm run lint` to verify TypeScript compilation.
