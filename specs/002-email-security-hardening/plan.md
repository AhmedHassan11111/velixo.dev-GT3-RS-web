# Implementation Plan: Email Security Hardening

**Branch**: `002-email-security-hardening` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-email-security-hardening/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Harden the existing email capture flow on the Porsche GT3 RS showcase site by adding server-side validation, rate limiting, bot protection, and site-wide security headers. The current site is a static React/Vite application with no backend; this plan adds a lightweight serverless endpoint and minimal client-side changes while preserving Core Web Vitals and avoiding unnecessary dependencies.

## Technical Context

**Language/Version**: TypeScript 5.8

**Primary Dependencies**: React 19, Vite 6, Tailwind CSS 4, Motion, Lucide React

**Storage**: NEEDS CLARIFICATION — no database currently exists. Must decide whether to introduce database persistence for email submissions or use an email-only/third-party service approach.

**Testing**: Playwright

**Target Platform**: Static web deployment with serverless function capability (e.g., Vercel Edge Functions, Netlify Functions, Cloudflare Workers, or equivalent)

**Project Type**: Static web application with serverless endpoint

**Performance Goals**: Maintain Core Web Vitals (LCP, CLS, INP) — no degradation from current baseline; serverless endpoint latency must not affect main page load.

**Constraints**: No unnecessary JS libraries or dead code (Principle 1 & 5). Any new backend dependency must be justified against performance and security surface costs.

**Scale/Scope**: Portfolio showcase site, low traffic volume.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Core Principle 1 — Performance Is Non-Negotiable | PASS | Security headers are already partially implemented in `vite.config.ts`. Any added endpoint must be evaluated for Core Web Vitals impact. |
| Core Principle 2 — Security by Default | PASS | All spec requirements map directly to this principle: server-side validation, rate limiting, RLS (if DB used), bot protection, security headers. |
| Core Principle 3 — Mobile-First Responsiveness | PASS | Email form hardening does not alter layout or responsive behavior. |
| Core Principle 4 — Visual/Interaction Integrity | PASS | No changes to scroll-driven animations, gallery reveals, or navbar behavior. |
| Core Principle 5 — Minimal, Justified Additions | NEEDS CLARIFICATION | Must justify any new backend dependency or service. Prefer simplest solution that satisfies the requirement. |

**Gate Decision**: PASS with ONE clarification needed (Storage approach). Proceed to Phase 0 research.

### Post-Design Check (after Phase 1)

| Principle | Status | Notes |
|-----------|--------|-------|
| Core Principle 1 — Performance Is Non-Negotiable | PASS | Honeypot adds zero client-side overhead. Serverless endpoint adds minimal network latency for form submission only. KV-based rate limiting adds <50ms per request. Security headers already implemented. |
| Core Principle 2 — Security by Default | PASS | Server-side validation, sanitization, rate limiting, bot protection, and security headers are all addressed in design. No database = no RLS needed. |
| Core Principle 3 — Mobile-First Responsiveness | PASS | Form layout remains unchanged; no responsive behavior impacted. |
| Core Principle 4 — Visual/Interaction Integrity | PASS | No visual or interaction changes proposed. |
| Core Principle 5 — Minimal, Justified Additions | PASS | Only two new dependencies: transactional email API client (justified by Principle 2) and KV store client (justified by consistent rate limiting). No database, admin panel, or full backend added. |

**Post-Design Gate Decision**: PASS. All constitution principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/002-email-security-hardening/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── App.tsx              # Existing showcase app (email form to be updated)
├── components/
│   └── ResponsiveImage.tsx
├── lib/
│   ├── hero-poster.ts
│   └── images.ts
└── main.tsx

# New serverless endpoint directory (platform-specific or abstracted)
api/
└── submit-email/
    └── index.ts         # Serverless function for email submission

# Or platform-native paths if not abstracted:
# vercel/api/submit-email.ts
# netlify/functions/submit-email.ts
# cloudflare-workers/src/submit-email.ts
```

**Structure Decision**: Add a single lightweight serverless function under an `api/` directory (or platform-native equivalent) to handle email submissions. Keep the existing static site structure unchanged. The serverless function will be the only new backend artifact.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New serverless function directory | Required for server-side validation, rate limiting, and bot rejection per Constitution Principle 2 | Client-side-only validation is explicitly prohibited by Principle 2 |
| Transactional email API dependency | Required to deliver submitted emails to an inbox without database complexity | Third-party form services offer less control over validation and security logic |
| KV store dependency | Required for consistent rate limiting across serverless instances | In-memory rate limiting is inconsistent in multi-instance serverless environments |
