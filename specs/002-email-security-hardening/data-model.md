# Data Model: Email Security Hardening

**Feature**: Email Security Hardening
**Date**: 2026-07-17

## Entities

### EmailSubmission

Represents a single visitor email captured through the public form.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier for the submission | Generated server-side (e.g., UUID or timestamp-based) |
| email | string | The submitted email address | MUST be a valid email format; MUST be sanitized before processing |
| submittedAt | timestamp | When the submission was received | Set server-side at receipt time |
| sourceIp | string | IP address of the submitter | Collected server-side from request |
| userAgent | string | Browser user-agent string | Collected server-side from request |
| honeypotStatus | boolean | Whether the honeypot field was filled | MUST be false for legitimate submissions |
| validationStatus | enum | Result of server-side validation | `valid`, `invalid_format`, `sanitized`, `rejected` |
| status | enum | Processing outcome | `accepted`, `rate_limited`, `bot_rejected`, `validation_failed` |

### RateLimitRecord

Tracks submission attempts per IP for rate-limiting enforcement.

| Field | Type | Description |
|-------|------|-------------|
| ip | string | Submitter IP address |
| windowStart | timestamp | Start of current rate-limit window |
| attemptCount | integer | Number of submissions in current window |
| lastAttempt | timestamp | Time of most recent submission |

## Relationships

- An `EmailSubmission` is associated with one `RateLimitRecord` (the record active at submission time).
- No other entities are required for this feature. No database persistence is introduced; `EmailSubmission` records are ephemeral (forwarded to email API and logged only if logging infrastructure exists).

## State Transitions

### EmailSubmission Lifecycle

1. **Received**: Serverless function receives HTTP POST.
2. **Validated**: Server-side validation runs (format check, sanitization).
3. **Rate Checked**: Rate limit record for source IP is evaluated.
4. **Bot Checked**: Honeypot status is evaluated.
5. **Outcome**:
   - If any check fails → `rejected` with appropriate status code.
   - If all checks pass → `accepted` and forwarded to transactional email API.

### RateLimitRecord Lifecycle

1. **Created**: First submission from a new IP starts a new window.
2. **Updated**: Each submission increments `attemptCount` and updates `lastAttempt`.
3. **Expired**: Window resets after the configured time period (e.g., 1 hour), returning `attemptCount` to 0.

## Validation Rules

- **Email format**: MUST match standard email address format (RFC 5322 simplified).
- **Sanitization**: MUST strip or escape HTML, JavaScript, and SQL-like injection patterns.
- **Honeypot**: MUST be empty for accepted submissions.
- **Rate limit**: MUST block submissions exceeding the configured threshold within the time window.
- **Required fields**: Email field is required; honeypot field is required but must remain empty.
