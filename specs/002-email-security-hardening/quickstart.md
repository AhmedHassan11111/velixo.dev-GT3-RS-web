# Quickstart: Email Security Hardening Validation

**Feature**: Email Security Hardening
**Date**: 2026-07-17

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Vite dev server running (`npm run dev`)
- For full validation: deploy to a platform that supports serverless functions (Vercel, Netlify, or Cloudflare Pages)

## Validation Scenarios

### Scenario 1: Valid Email Submission (Happy Path)

**Steps**:
1. Open the site at `http://localhost:3000`
2. Scroll to the email capture form
3. Enter a valid email address (e.g., `test@example.com`)
4. Ensure the hidden honeypot field remains empty
5. Click "Send Message" or submit the form
6. Wait for response

**Expected Outcome**:
- Form shows success message: "Thank you for subscribing."
- No console errors
- Network tab shows `POST /api/submit-email` returning `200 OK` with `status: "accepted"`
- Email is received at the configured inbox (if email API is configured)

---

### Scenario 2: Invalid Email Format

**Steps**:
1. Open the site at `http://localhost:3000`
2. Enter an invalid email (e.g., `not-an-email`)
3. Submit the form

**Expected Outcome**:
- Form shows error message: "Please enter a valid email address."
- Network tab shows `POST /api/submit-email` returning `400 Bad Request` with `status: "validation_failed"`
- No email is sent

---

### Scenario 3: Honeypot Bot Detection

**Steps**:
1. Open browser DevTools → Elements
2. Locate the hidden honeypot input field
3. Fill the honeypot field with any value
4. Enter a valid email in the visible field
5. Submit the form

**Expected Outcome**:
- Form shows generic success message or error (should not reveal honeypot detection)
- Network tab shows `POST /api/submit-email` returning `200 OK` or `400 Bad Request` with `status: "bot_rejected"`
- No email is sent
- Server logs (if accessible) show bot rejection

---

### Scenario 4: Rate Limiting

**Steps**:
1. Submit the form 6 times rapidly from the same IP (or use a script)
2. Observe responses

**Expected Outcome**:
- First 5 submissions return `200 OK` with `status: "accepted"`
- 6th submission returns `429 Too Many Requests` with `status: "rate_limited"` and `retryAfter` header/field
- Message displayed: "Too many submissions. Please try again later."

---

### Scenario 5: Security Headers

**Steps**:
1. Open DevTools → Network
2. Reload the page
3. Click the main document request
4. Inspect Response Headers

**Expected Outcome**:
- `Content-Security-Policy` is present and matches expected policy
- `X-Frame-Options: DENY` is present
- `Referrer-Policy: strict-origin-when-cross-origin` is present
- `X-Content-Type-Options: nosniff` is present
- No mixed content warnings (all resources loaded over HTTPS in production)

---

### Scenario 6: Performance Regression Check

**Steps**:
1. Run Lighthouse audit before changes (baseline exists in `.lighthouseci/`)
2. Run Lighthouse audit after changes
3. Compare Core Web Vitals scores

**Expected Outcome**:
- LCP, CLS, and INP scores do not degrade beyond acceptable thresholds
- No new performance issues introduced by the serverless endpoint or client-side changes
- Bundle size increase is minimal and justified

---

## References

- [Data Model](./data-model.md)
- [API Contract](./contracts/submit-email.md)
- [Feature Specification](./spec.md)
