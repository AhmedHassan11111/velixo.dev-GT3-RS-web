# Project Constitution — Porsche GT3 RS Showcase (Portfolio Project)

## Project Nature

This is a personal portfolio project (not client work) — a marketing-style showcase website for the Porsche GT3 RS, used to demonstrate design/development skills. Content (copy, images) is final. Current focus is exclusively on: performance, security, and mobile responsiveness/polish. No new content or sections should be added unless explicitly specified.

## Core Principles

### Core Principle 1 — Performance Is Non-Negotiable

- Every change must be evaluated for its impact on Core Web Vitals (LCP, CLS, INP) before being considered done.
- Animations (especially the hero scroll-scrubbing effect) must only animate transform/opacity, must run via requestAnimationFrame or an equivalent scroll-linked technique, and must never cause layout thrashing or forced reflows.
- All images must be served in modern formats (WebP/AVIF) with correct compression and responsive srcset/sizes.
- No unnecessary JS libraries or dead code. Bundle size must be justified.
- Any performance-affecting change must be benchmarked before/after (Lighthouse or equivalent) — "looks fine" is not sufficient proof.

### Core Principle 2 — Security by Default

- All user-submitted data (currently: the email capture form) must be validated and sanitized server-side, regardless of client-side validation.
- Rate limiting is mandatory on any public-facing submission endpoint.
- If a database is used to store submitted data, Row-Level Security (or equivalent access control) must restrict reads/writes to authorized roles only.
- Authentication is required only for any admin/management area (e.g., viewing submitted emails) — no authentication should be added where there is no actual protected resource.
- Basic bot protection (honeypot field or lightweight challenge) is required on public forms.
- Security headers (CSP, X-Frame-Options, HTTPS enforcement) are required site-wide.

### Core Principle 3 — Mobile-First Responsiveness

- Every section, especially the hero scroll-scrubbing sequence, must be explicitly designed and tested for mobile viewports — not just scaled down from desktop.
- Scroll-driven animations must be re-tuned for touch/mobile scroll behavior, not assumed to work identically to desktop.
- Images must have mobile-specific sizing/cropping where the desktop version doesn't translate well to small screens.
- Test on at least two real mobile screen sizes before considering a section "responsive."

### Core Principle 4 — Visual/Interaction Integrity

- Scroll-triggered reveal animations (e.g., the gallery images after the hero shrink) must have distinct, deliberate entry directions per element — never allow multiple elements to visually overlap/collide during a transition.
- The sticky-reveal navbar behavior must span the full viewport width in the zone between the Hero section and the following section, and must be completed, not left partial.

### Core Principle 5 — Minimal, Justified Additions

- Any new dependency, library, or backend service must be justified against Principle 1 (performance cost) and Principle 2 (security surface).
- Prefer the simplest solution that satisfies the requirement (e.g., a transactional email API over a full database + admin panel, unless persistence/querying is actually needed).

## Non-Goals (out of scope unless explicitly requested)

- Adding new content, copy, or sections.
- Redesigning sections that are not flagged as broken (hero scrubbing, gallery reveal, navbar, mobile layout, email form).

## Governance

- This constitution supersedes all other practices and defaults for this project.
- All changes must verify compliance with these principles, prioritizing Performance (1), Security (2), and Mobile-First Responsiveness (3).
- Complexity (new deps, backend services) must be justified per Principle 5.
- Amendments require explicit documentation and approval.

**Version**: 1.0.0 | **Ratified**: 2026-07-16 | **Last Amended**: 2026-07-16
