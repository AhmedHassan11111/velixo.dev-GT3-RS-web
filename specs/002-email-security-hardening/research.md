# Research: Email Security Hardening

**Feature**: Email Security Hardening
**Date**: 2026-07-17
**Status**: Complete

## Unknowns Resolved

### 1. Storage Approach for Email Submissions

**Question**: Should the project introduce a database to store submitted emails, or is a simpler email-only approach sufficient?

**Decision**: Use a transactional email API (e.g., Resend, SendGrid, or equivalent) to forward submissions directly to an email inbox. No database is introduced.

**Rationale**:
- The project constitution (Core Principle 5) explicitly states: "Prefer the simplest solution that satisfies the requirement (e.g., a transactional email API over a full database + admin panel, unless persistence/querying is actually needed)."
- No admin area currently exists for viewing submissions, and authentication is only required if an admin area exists (per spec FR-010 and constitution Principle 2).
- A transactional email API satisfies the core requirement of capturing visitor emails with server-side validation, without adding database complexity, Row-Level Security concerns, or an admin panel.
- This approach eliminates the need for database hosting, backups, access control policies, and migration management.

**Alternatives Considered**:
- **PostgreSQL/SQLite database with RLS**: Rejected because it introduces unnecessary complexity for a portfolio site with no admin area and low submission volume. Justification against Principle 5 would be weak.
- **Third-party form service (Formspree, Netlify Forms)**: Rejected because it adds an external dependency with less control over validation, sanitization, and rate-limiting logic. Server-side control is preferred for security compliance.
- **Simple JSON file storage on server**: Rejected because it lacks scalability, access control, and is not suitable for serverless environments with ephemeral filesystems.

### 2. Serverless Platform Strategy

**Question**: Which serverless platform should be used for the email submission endpoint?

**Decision**: Implement the endpoint as a platform-agnostic serverless function under `api/submit-email/`, deployable to Vercel Edge Functions, Netlify Functions, Cloudflare Workers, or any standard serverless runtime.

**Rationale**:
- The project does not currently have a locked-in deployment platform.
- A platform-agnostic structure avoids vendor lock-in and allows the site to be deployed wherever is most convenient.
- Standard serverless runtimes all support TypeScript, environment variables, and standard HTTP request/response handling.
- This keeps the dependency surface minimal (Principle 1 & 5).

**Alternatives Considered**:
- **Vercel-specific API routes**: Rejected to avoid vendor lock-in.
- **Cloudflare Workers-only**: Rejected because some users may prefer Vercel or Netlify.
- **Separate backend service (Express/Fastify)**: Rejected because it violates Principle 5 (minimal additions) and adds unnecessary operational complexity.

### 3. Rate Limiting Strategy

**Question**: How should rate limiting be implemented in a serverless environment?

**Decision**: Use an in-memory rate limiter with a short-lived cache (e.g., Upstash Redis, or a lightweight in-process store for single-instance deployments). For multi-instance serverless, use a shared KV store or edge-compatible rate limiter.

**Rationale**:
- Serverless functions are stateless and may run on multiple instances. In-memory rate limiting alone is insufficient for consistent enforcement across instances.
- A shared KV store (e.g., Upstash Redis, Vercel KV, Cloudflare KV) provides consistent rate limiting across all instances with minimal latency.
- For low-traffic portfolio sites, a generous but effective limit (e.g., 5 submissions per hour per IP) balances security and usability.

**Alternatives Considered**:
- **Pure in-memory rate limiting**: Rejected because serverless instances are ephemeral and multiple instances would not share state, allowing bypass.
- **Database-backed rate limiting**: Rejected because it introduces unnecessary database dependency (violates Principle 5).
- **Third-party rate limiting service (Cloudflare, AWS WAF)**: Rejected because it adds cost and configuration complexity; a simple KV-based approach is sufficient for this traffic level.

### 4. Bot Protection Strategy

**Question**: Should the site use a honeypot field or a lightweight challenge (e.g., hCaptcha, Turnstile)?

**Decision**: Use a honeypot field as the primary bot protection mechanism, with optional progressive enhancement to a lightweight challenge if honeypot evasion is detected.

**Rationale**:
- A honeypot field is invisible to legitimate users, requires no external dependencies, and has zero performance impact (Principle 1).
- It satisfies the constitutional requirement for "basic bot protection (honeypot field or lightweight challenge)."
- Adding a full CAPTCHA service would introduce external JS dependencies and potential Core Web Vitals impact, which violates Principle 1 and 5.
- The honeypot can be combined with simple timing analysis (e.g., form filled too quickly) for additional protection without external calls.

**Alternatives Considered**:
- **Cloudflare Turnstile / hCaptcha**: Rejected because it loads external JavaScript, which can degrade performance and adds a third-party dependency.
- **reCAPTCHA v3**: Rejected for the same reasons; also adds privacy concerns.
- **JavaScript challenge / proof-of-work**: Rejected because it adds CPU load and complexity disproportionate to the threat level of a portfolio site.

### 5. Security Headers Implementation

**Question**: How should security headers be applied site-wide?

**Decision**: Continue applying security headers at the Vite dev/preview server level for local development, and add a `_headers` file (Netlify) or `vercel.json` (Vercel) or equivalent for production deployment.

**Rationale**:
- The existing `vite.config.ts` already applies CSP, X-Frame-Options, Referrer-Policy, and X-Content-Type-Options in dev/preview mode.
- For production static hosting, headers must be configured at the CDN/hosting layer because there is no application server.
- Common static hosts support header configuration via flat files (`_headers`) or platform config (`vercel.json`).

**Alternatives Considered**:
- **Meta tags in HTML**: Rejected because CSP and X-Frame-Options cannot be reliably enforced via meta tags; they require HTTP headers.
- **Client-side header injection**: Rejected because headers must be set by the server/CDN before the response reaches the browser.

## Dependencies to Add

| Dependency | Purpose | Justification |
|------------|---------|---------------|
| Upstash Redis / Vercel KV / Cloudflare KV | Shared rate-limiting store | Required for consistent rate limiting across serverless instances (Principle 2). Minimal operational cost. |
| Resend (or equivalent transactional email API) | Forward validated emails to inbox | Simplest solution for email delivery without database (Principle 5). Client-side only SDK or direct API call from serverless function. |

No other new dependencies are anticipated.
