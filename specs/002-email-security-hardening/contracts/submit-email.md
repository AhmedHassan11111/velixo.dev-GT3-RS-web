# Contract: Email Submission Endpoint

**Feature**: Email Security Hardening
**Date**: 2026-07-17
**Endpoint**: `POST /api/submit-email`

## Purpose

Provides a server-side endpoint for submitting email addresses from the public showcase form. Enforces validation, sanitization, rate limiting, and bot protection before forwarding accepted submissions to a transactional email API.

## Request

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| Content-Type | Yes | `application/json` |
| Origin | Yes | Automatically sent by browser; used for CORS and referrer checks |

### Body

```json
{
  "email": "string (required)",
  "honeypot": "string (optional, must be empty for legitimate users)"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format; sanitized server-side |
| honeypot | string | No | MUST be empty or absent for accepted submissions |

### Example Request

```bash
curl -X POST https://example.com/api/submit-email \
  -H "Content-Type: application/json" \
  -d '{"email":"visitor@example.com","honeypot":""}'
```

## Response

### Success (200 OK)

```json
{
  "status": "accepted",
  "message": "Thank you for subscribing."
}
```

### Validation Failure (400 Bad Request)

```json
{
  "status": "validation_failed",
  "message": "Please enter a valid email address."
}
```

### Rate Limited (429 Too Many Requests)

```json
{
  "status": "rate_limited",
  "message": "Too many submissions. Please try again later.",
  "retryAfter": 3600
}
```

### Bot Detected (200 OK or 400 Bad Request)

```json
{
  "status": "bot_rejected",
  "message": "Invalid submission."
}
```

> Note: Bot rejection should return a generic success-like response or a 400 to avoid signaling to bots that the honeypot was detected. Exact status code is implementation-dependent but should not reveal security mechanisms.

## Security Behavior

- **CORS**: Endpoint MUST accept requests only from the same origin or configured allowed origins. No wildcard `*` for credentials-bearing requests.
- **Rate Limiting**: Enforced per source IP. Default: 5 submissions per hour (configurable).
- **Sanitization**: All string inputs are sanitized server-side before any processing or logging.
- **Bot Protection**: Honeypot field is checked server-side. If filled, submission is silently rejected.
- **No Authentication**: Endpoint is public; no API keys or tokens required from the client. Authentication applies only if an admin area exists (which it does not in v1).

## Client Contract

The React frontend will:

1. Add a hidden honeypot input field to the email form.
2. Submit form data as JSON via `fetch` to `/api/submit-email`.
3. Display the response `message` to the user on success or validation failure.
4. Disable the submit button during the request to prevent duplicate submissions.
5. Not expose rate-limit or bot-rejection details differently from validation errors (uniform error handling).
