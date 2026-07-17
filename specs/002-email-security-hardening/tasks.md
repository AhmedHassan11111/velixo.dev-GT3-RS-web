# Tasks: Email Security Hardening

**Input**: Design documents from `/specs/002-email-security-hardening/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No tests requested in feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Path Conventions

- Backend serverless: `api/submit-email/`
- Frontend: `src/`
- Config: project root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency setup

- [x] T001 Create serverless endpoint directory at `api/submit-email/`
- [x] T002 [P] Install KV store client dependency in `package.json`
- [x] T003 [P] Install transactional email API client dependency in `package.json`

**Checkpoint**: Dependencies installed, directory structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create email validation utility in `api/submit-email/lib/validate.ts`
- [x] T005 [P] Create input sanitization utility in `api/submit-email/lib/sanitize.ts`
- [x] T006 [P] Create rate limiter service using KV store in `api/submit-email/lib/rate-limit.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Submit Email Securely (Priority: P1) 🎯 MVP

**Goal**: Visitor can submit email through hardened form with server-side validation, rate limiting, bot protection, and security headers

**Independent Test**: Submit valid/invalid emails, verify responses, check security headers in browser network tab

### Implementation for User Story 1

- [x] T007 [US1] Create serverless function entry point with request parsing in `api/submit-email/index.ts`
- [x] T008 [US1] Implement email validation, sanitization, bot detection, rate limiting, and email forwarding in `api/submit-email/index.ts`
- [x] T009 [US1] Implement response formatting (accepted, validation_failed, rate_limited, bot_rejected) and CORS in `api/submit-email/index.ts`
- [x] T010 [P] [US1] Add hidden honeypot input field to email form in `src/App.tsx`
- [x] T011 [US1] Update email form submission to use fetch API in `src/App.tsx`
- [x] T012 [US1] Add user-facing success and error message handling in `src/App.tsx`
- [x] T013 [US1] Add submit button disable state during request in `src/App.tsx`

**Checkpoint**: User Story 1 is fully functional and testable independently

---

## Phase 4: User Story 2 - View Submitted Emails Securely (Priority: P2)

**Goal**: Authorized users can view submitted emails securely (requires admin area and database)

**Independent Test**: N/A for v1 - no admin area or database exists

### Implementation for User Story 2

- [x] T014 [US2] Defer admin email viewing area - requires database and admin UI not present in v1

**Checkpoint**: US2 documented as deferred for future implementation

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation, performance checks, and documentation

- [x] T015 [P] Run quickstart validation scenarios from `quickstart.md`
- [x] T016 [P] Run Lighthouse performance regression check against `.lighthouseci/` baseline
- [x] T017 Update project documentation with new endpoint, dependencies, and security measures

**Checkpoint**: Feature validated and documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion (deferred for v1)
- **Polish (Phase 5)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Deferred for v1

### Within User Story 1

- Serverless function entry point (T007) before implementation details (T008, T009)
- Frontend honeypot field (T010) can start in parallel with backend implementation
- Form fetch logic (T011) after honeypot field (T010)
- UI feedback (T012, T013) after fetch logic (T011)

### Parallel Opportunities

- T002 and T003 (dependency installation, different concerns)
- T004, T005, T006 (utility files, different files)
- T010 can run in parallel with T007, T008, T009 (different file, no dependency)
- T015 and T016 (validation activities, different concerns)

---

## Parallel Example: User Story 1

```bash
# Backend endpoint implementation (sequential in same file):
Task: "Create serverless function entry point in api/submit-email/index.ts"
Task: "Implement validation, sanitization, bot detection, rate limiting, and email forwarding in api/submit-email/index.ts"
Task: "Implement response formatting and CORS in api/submit-email/index.ts"

# Frontend form updates (sequential in same file):
Task: "Add hidden honeypot field to email form in src/App.tsx"
Task: "Update email form submission to fetch API in src/App.tsx"
Task: "Add user-facing success and error messages in src/App.tsx"

# Can start in parallel (different files):
Task: "Add hidden honeypot field to email form in src/App.tsx"
# ... while backend tasks are being built
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md scenarios
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. User Story 2 → Deferred for future iteration when admin area is built
4. Polish → Final validation and documentation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Backend endpoint implementation (T007, T008, T009)
   - Developer B: Frontend form updates (T010, T011, T012, T013)
3. Stories integrate and test independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
