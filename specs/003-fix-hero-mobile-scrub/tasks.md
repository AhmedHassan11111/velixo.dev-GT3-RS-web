---
description: "Task list for fixing Hero mobile scroll-scrubbing"
---

# Tasks: Fix Hero Mobile Scroll-Scrubbing

**Input**: Design documents from `/specs/003-fix-hero-mobile-scrub/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested in the feature specification and no test framework exists in the repo. Verification is browser-tooling driven per quickstart.md; independent-test criteria are noted per story instead of test tasks.

**Organization**: Tasks are grouped by user story (US1–US4) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Include exact file paths in descriptions

## Path Conventions

- Single frontend project: `src/`, `index.html` at repository root
- Hero logic: `src/App.tsx` (`HeroScrollFrames` component, lines ~184–397)
- Global styles / hero overlay: `src/index.css`, `index.html` (hero section markup)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Build/verification baseline (no new project scaffolding needed — single existing Vite app).

- [x] T001 Capture before-build mobile performance baseline (Lighthouse mobile + DevTools Performance on iPhone SE & Pixel) and save to `specs/003-fix-hero-mobile-scrub/` for before/after comparison (FR-013, SC-006)
- [x] T002 [P] Confirm production build works and serve `dist/` over LAN for real-device testing: `npm run build` then `npm run preview` (quickstart V1)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Hero scroll-scrub rework that all user stories depend on. Must be complete before any story-specific tuning.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Replace fixed `window.innerHeight * 6` travel in `src/App.tsx` `measureLayout()` with geometry-derived travel (`HeroScrollTravel.startScroll` / `travel` from the sticky element's rect vs scroll), re-measured on resize only — never per frame (FR-001, FR-005, R1)
- [x] T004 Add `VisualViewport` resize/`scroll` listener in `src/App.tsx` to re-measure travel when the mobile address bar shows/hides, storing into `layoutRef` without per-frame layout reads (FR-005, R1)
- [x] T005 Keep the rAF update loop passive and document that the earlier `IntersectionObserver` gate was removed after regression testing; no scroll input is intercepted or canceled (FR-004, R2)
- [x] T006 Keep the loop passive + rAF-coalesced and remove any `offsetTop`/`getBoundingClientRect` reads from the per-frame `update()` path in `src/App.tsx`; cache geometry from T003/T004 only (FR-005, R2)
- [x] T007 Replace per-frame `Math.round(progress * (TOTAL_FRAMES - 1))` mapping in `src/App.tsx` with clamped `Math.round` + clamp to `[0, TOTAL_FRAMES-1]` (no sub-pixel interpolation) — already `Math.round`, add clamp + document (FR-002, R4)

**Checkpoint**: Geometry-derived, IO-gated, passive rAF scrub with no per-frame layout reads — foundation ready for story tuning.

---

## Phase 3: User Story 1 - Smooth, correctly-aligned hero scrub on mobile (Priority: P1) 🎯 MVP

**Goal**: On ≤480px touch devices the frame sequence tracks the finger and ends aligned with the section transition, with no multi-frame catch-up jump.

**Independent Test**: On a real iPhone SE scroll the full hero slowly and with a fast fling; final frame aligns with the section boundary and the visible frame stays within one frame of target during steady scroll (quickstart V2/V4).

- [x] T008 [US1] Add a mobile-tuned travel/pacing parameter in `src/App.tsx` `measureLayout()` (e.g., shorter/snappier scrub for `layoutRef.mobile`) computed from geometry, not `innerHeight * 6` (FR-001, R1)
- [x] T009 [US1] Ensure `progress`→`frameIndex` end-of-travel maps exactly to the last frame and aligns with the white content section start in `src/App.tsx` (FR-003, SC-001)
- [x] T010 [US1] Verify steady-scroll frame tracking stays within ±1 frame in `src/App.tsx` `update()` (no multi-frame catch-up jump on slow and fast fling) (FR-002, SC-002)
- [ ] T011 [US1] Validate on real iPhone SE + Pixel: alignment within ±1 frame at scroll-end and ≤1 frame lag (quickstart V2/V4) (FR-002, FR-003, SC-001, SC-002) — see verification-records.md (device run pending env)

**Checkpoint**: User Story 1 fully functional and testable independently on two real devices.

---

## Phase 4: User Story 2 - No scroll-jacking or input lag on touch (Priority: P1)

**Goal**: Native touch-scroll feel preserved over the hero — no forced pauses, resets, or snap-back.

**Independent Test**: Continuous + fast-fling touch scrolls on iPhone SE and Pixel; scrollbar moves continuously, no frozen frames / forced deceleration / scroll reset / snap-back (quickstart V3).

- [x] T012 [US2] Preserve native Hero touch scroll by avoiding gesture containment (`touch-action: auto`, `overscroll-behavior: auto`) and making the sticky visual layer pointer-transparent while CTA links opt back in (FR-004, R2)
- [x] T013 [US2] Promote the hero `<canvas>` with `will-change: transform` in `src/index.css` and confirm the update loop never reads layout props on mobile (FR-004, FR-005, R2)
- [ ] T014 [US2] Validate on real iPhone SE + Pixel: 0 scroll-jacking instances across slow and fast flings (quickstart V3) (FR-004, SC-003) — see verification-records.md
- [ ] T015 [US2] Capture DevTools Performance on both devices: no hero-attributable main-thread task > 50ms during scroll (quickstart V5) (FR-005, SC-006) — see verification-records.md

**Checkpoint**: User Stories 1 AND 2 both work independently; smooth native touch scroll confirmed.

---

## Phase 5: User Story 3 - Hero typography and overlay layout tuned for small screens (Priority: P2)

**Goal**: Hero heading/subhead/CTA and HUD overlay laid out for phone aspect ratios and safe areas — legible, no overflow, no collision.

**Independent Test**: View hero at iPhone SE and Pixel widths; headings fit without horizontal overflow, safe-area insets respected, overlay not cut off or colliding (quickstart V6).

- [x] T016 [US3] Apply `env(safe-area-inset-*)` padding to the hero overlay container in `src/index.css` so notched/home-indicator devices don't clip content (FR-008, R5)
- [x] T017 [US3] Convert hero heading/subhead/CTA type to fluid `clamp()` scales in `src/index.css` so they fit without horizontal overflow at 375px (FR-007, R5)
- [x] T018 [US3] Add hero-scoped width constraints only; do not use a global `html, body { overflow-x: hidden }` guard because it regressed native scrolling (FR-007, R5)
- [x] T019 [US3] Differentiate small (~375px) vs larger (~412px) phone via fluid `clamp()` spacing (not a uniform scaled copy) in `src/index.css` + verify in `index.html`/hero markup (FR-009, R5)
- [ ] T020 [US3] Validate on real iPhone SE + Pixel: 0 horizontal overflow, 0 safe-area cut-off, 0 title collision (quickstart V6) (FR-007, FR-008, FR-009, SC-004, SC-005) — see verification-records.md

**Checkpoint**: All user stories so far independently functional with correct mobile typography.

---

## Phase 6: User Story 4 - Verified across two real mobile sizes (Priority: P2)

**Goal**: Fix confirmed working on two distinct real mobile screen sizes with a per-device record.

**Independent Test**: Run scroll/orientation checks on a real iPhone SE and real Pixel; capture per-device notes/screenshots confirming scrub alignment, smoothness, and layout (quickstart V2–V7).

- [ ] T021 [US4] Execute full quickstart.md verification (V2–V7) on a real iPhone SE and record results in `specs/003-fix-hero-mobile-scrub/checklists/` (or a notes file) (FR-010, SC-007) — see verification-records.md (device run pending env)
- [ ] T022 [US4] Execute full quickstart.md verification (V2–V7) on a real Pixel and record results alongside iPhone SE (FR-010, SC-007) — see verification-records.md (device run pending env)
- [ ] T023 [US4] Confirm both device records pass all criteria (alignment, no scroll-jacking, ≤1 frame lag, INP ≤ 200ms, layout) before marking the section "responsive" (FR-010, SC-001..SC-007) — see verification-records.md (device run pending env)

**Checkpoint**: Feature verified on two real devices — responsive per constitution Principle 3.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, performance budget confirmation, and cleanup affecting multiple stories.

- [x] T024 [P] Add `prefers-reduced-motion` guard (already present in `src/App.tsx`) — re-verify it still shows a static poster and does NOT start the mobile scrub loop after tuning (FR-011)
- [x] T025 [P] Add orientation-change/resize re-measure in `src/App.tsx` (VisualViewport + `resize`) so mid-hero rotation never leaves the canvas misaligned (FR-012, R1)
- [x] T026 [P] Implement/confirm decode-ahead buffer (~8 frames) via `img.decode()` with stale-preload cancellation in `src/App.tsx` `ensureFramesLoaded`, preferring `mobile` variants (FR-006, R3)
- [ ] T027 Run after-build Lighthouse mobile + DevTools Performance on iPhone SE & Pixel and compare to T001 baseline; confirm INP ≤ 200ms and no regression (FR-013, SC-006) — see verification-records.md
- [ ] T028 Run full `quickstart.md` validation pass end-to-end and update `checklists/requirements.md` status (Polish) — see verification-records.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately (baseline capture + build).
- **Foundational (Phase 2)**: Depends on Setup; BLOCKS all user stories.
- **User Stories (Phase 3–6)**: All depend on Foundational completion.
  - US1 (P1) and US2 (P1) are the core mobile fixes and can be validated together.
  - US3 (P2) and US4 (P2) build on the working scrub.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependency on other stories.
- **US2 (P1)**: After Foundational — pairs with US1 (both about scrub smoothness/alignment feel).
- **US3 (P2)**: After Foundational — independent layout work; can run parallel with US1/US2 verification.
- **US4 (P2)**: After US1–US3 — it is the cross-device verification gate.

### Within Each User Story

- Foundational rework before story-specific tuning.
- Implementation before device validation.
- Story complete (validated on device) before next priority.

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel.
- T008–T011 (US1), T012–T015 (US2), T016–T020 (US3) touch different concerns; US3 CSS tasks can run parallel with US1/US2 verification once Foundational is done.
- T024, T025, T026 (Polish) are independent and can run in parallel.
- T021 and T022 (per-device verification) are independent and can run in parallel on two devices.

---

## Parallel Example: User Story 1

```bash
# After Foundational (T003-T007) completes:
Task: "T008 Add mobile-tuned travel/pacing in src/App.tsx measureLayout()"
Task: "T009 Ensure end-of-travel frame aligns with section start in src/App.tsx"
Task: "T010 Verify steady-scroll frame tracking within ±1 frame in src/App.tsx update()"
# Then validate on devices (T011) before moving to US2.
```

---

## Implementation Strategy

### MVP First (User Story 1 + US2 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T007) — CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T008–T011)
4. Complete Phase 4: User Story 2 (T012–T015)
5. **STOP and VALIDATE**: Verify smooth, aligned, non-jacking scrub on iPhone SE + Pixel (quickstart V2/V3/V4)
6. Demo/commit if ready

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 + US2 → test on devices → MVP (smooth, aligned, native scroll)
3. US3 → test typography/safe-area → deploy
4. US4 → verify on two real devices → responsive per constitution
5. Polish (T024–T028) → performance budget confirmed, edge cases covered

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: US1 + US2 (scrub feel)
   - Developer B: US3 (typography/layout)
3. US4 (device verification) runs after A and B land; Polish in parallel.

---

## Notes

- No test framework exists and tests were not requested → verification is browser-tooling driven per `quickstart.md`; independent-test criteria are stated per story.
- All edits are localized to `src/App.tsx` (`HeroScrollFrames`), `src/index.css`, and `index.html` hero markup. No new dependency is introduced (constitution Principle 5).
- Keep the canvas + rAF + passive-scroll architecture; this plan tunes parameters and layout, not a rewrite.
- [P] tasks = different files/concerns, no dependencies. [Story] label maps task to US1–US4 for traceability.
