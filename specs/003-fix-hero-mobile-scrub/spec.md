# Feature Specification: Fix Hero Mobile Scroll-Scrubbing

**Feature Branch**: `003-fix-hero-mobile-scrub`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Fix the Hero section's scroll-scrubbing animation for mobile devices. Current problems:
- The scroll-scrubbing animation looks broken/misaligned on mobile screen sizes specifically
- Need to design/tune the animation timing and layout specifically for small viewports, not just scale down the desktop version
- Test and verify on at least two real mobile screen sizes (e.g., iPhone SE and a larger phone like Pixel)
- Ensure touch-scroll behavior works smoothly (avoid scroll-jacking issues common with scrubbing animations on mobile)
- Adjust hero typography/layout for small screens as needed"

## Context & Current State

This is a personal portfolio/marketing showcase for the Porsche 911 GT3 RS (React + Vite, Tailwind). Per the project constitution, scope is strictly **performance, security, and mobile responsiveness** — no new content or sections. The Hero is the centerpiece: a 174-frame canvas sequence scrubbed to a `600vh` scroll travel via a `requestAnimationFrame`-coalesced scroll listener (`src/App.tsx`, `HeroScrollFrames`).

Baseline audit of the current mobile behavior (verified against the repo):

- **Scroll math is desktop-derived**: `scrollDist = window.innerHeight * 6` (i.e., the full 600vh travel) is used identically on mobile. On short, wide phone viewports this produces a scrub whose pacing, frame advance, and end alignment feel off versus the desktop, leading to the "misaligned" appearance.
- **Frame resolution is already viewport-aware** (`layoutRef.mobile = window.innerWidth < 768` selects `f.mobile` frame variants from `IMAGES.hero.frames`), so the *frames* exist; the problem is the *scrubbing geometry, timing, and overlay layout* on small screens, not the image assets.
- **Touch scroll is passive** (`{ passive: true }`), which is good — but the canvas only redraws on the `scroll` event inside a rAF. On momentum/touch scrolling, low frame delivery (frame loading behind the scroll position) and per-frame decode cost can cause the visible frame to lag the finger and then "catch up" in a jump, which reads as jank/scroll-jacking.
- **Typography/overlay layout is not designed for small screens**: hero heading, subhead, and HUD overlay inherit desktop sizing and positioning, so text can overflow, collide with the scrubbing canvas, or sit misaligned at the top/bottom of small viewports.
- **No mobile-specific scrub tuning**: there are no distinct timings, travel distances, or frame-rate/throttle strategies tuned for touch input — the desktop model is simply scaled.

This feature is scoped to make the hero scrubbing *correct and smooth specifically on mobile*, not to add content or redesign the desktop path.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Smooth, correctly-aligned hero scrub on mobile (Priority: P1)

A visitor on a small touch device (e.g., iPhone SE, 375×667) scrolls through the hero and the frame sequence advances in lockstep with their finger, ending exactly aligned with the section transition (the rounded white content wrapper), with no visible jump, drift, or "catch-up" lag.

**Why this priority**: This is the explicit complaint — broken/misaligned scrubbing on mobile is the core defect and the most visible credibility problem on phones.

**Independent Test**: On a real iPhone SE (or emulated 375×667 touch) scroll the full hero slowly and quickly; verify the final frame aligns with the section boundary at the end of travel and the visible frame tracks the scroll position without jumping > 1 frame behind during steady scrolling.

**Acceptance Scenarios**:

1. **Given** the hero is visible on a ≤480px-wide touch device, **When** the user scrolls at any reasonable speed, **Then** the displayed frame index stays within one frame of the scroll-derived target (no multi-frame catch-up jumps).
2. **Given** the user reaches the end of the hero scroll travel, **When** scrolling completes, **Then** the final frame is shown and it aligns with the start of the following section (no over/under-scroll gap or early/late transition).
3. **Given** a slow and a fast fling on touch, **When** each gesture ends, **Then** the resting frame matches the scroll position with no residual drift.

---

### User Story 2 - No scroll-jacking or input lag on touch (Priority: P1)

A visitor using touch scrolling (momentum/惯性 scroll) experiences the hero as a normal part of the page — the browser's native scroll feel is preserved, the address bar / sticky behavior works naturally, and the hero never "fights" or stalls the scroll.

**Why this priority**: Scroll-jacking is the most common failure of scrubbing animations on mobile and directly degrades the perceived quality; the constitution requires scroll-driven animation to be re-tuned for touch, not assumed identical to desktop.

**Independent Test**: Perform continuous touch scrolls (including fast flings) on a real phone; confirm the scrollbar moves continuously, no forced pauses occur, and the page does not "snap back" or stutter while the hero is on screen.

**Acceptance Scenarios**:

1. **Given** a touch scroll over the hero, **When** the user flicks quickly, **Then** scrolling remains smooth and native (no frozen frames, no forced deceleration, no scroll position reset).
2. **Given** the hero scroll listener, **When** it runs, **Then** it uses a passive, rAF-coalesced, transform/opacity (or canvas paint) path with no layout-reading properties (`offsetTop`, `getBoundingClientRect`) read inside the scroll/update loop on mobile.
3. **Given** the page is mid-hero, **When** the user scrolls away to content below, **Then** the hero does not re-trigger, intercept, or delay the transition.

---

### User Story 3 - Hero typography and overlay layout tuned for small screens (Priority: P2)

A visitor on a small phone sees hero heading/subhead/CTA and the HUD overlay laid out for the phone's aspect ratio and safe areas — text is legible, fits without clipping, and does not overlap the scrubbing car visual in a broken way.

**Why this priority**: The user explicitly asked to adjust hero typography/layout for small screens; misalignment is partly a layout/overlay problem, not just the scrub math.

**Independent Test**: View the hero at iPhone SE and Pixel widths; confirm headings fit within the viewport width, scale appropriately, respect safe-area insets (notches/home indicators), and the overlay does not collide with the title or extend off-screen.

**Acceptance Scenarios**:

1. **Given** a ≤480px viewport, **When** the hero is shown, **Then** the heading and subhead fit without horizontal overflow or clipping, using mobile-appropriate type scale.
2. **Given** a device with a notch/home-indicator safe area, **When** the hero renders, **Then** overlay content respects safe-area insets and is not cut off.
3. **Given** both a small (≈375px) and a larger (≈412px) phone, **When** compared, **Then** the hero layout adapts (type scale, spacing, overlay placement) rather than being a uniform scaled copy.

---

### User Story 4 - Verified across two real mobile sizes (Priority: P2)

The fix is confirmed to work on at least two distinct real mobile screen sizes — a small phone (iPhone SE-class, ~375×667) and a larger phone (Pixel-class, ~412×915) — not only in desktop responsive emulation.

**Why this priority**: The constitution (Principle 3) mandates testing on at least two real mobile screen sizes before a section is "responsive," and the user named these exact device classes.

**Independent Test**: Run the same scroll/orientation checks on both a real iPhone SE and a real Pixel (or their devicemotion/remote-debug equivalents); capture before/after for each and confirm no regressions on either.

**Acceptance Scenarios**:

1. **Given** a real iPhone SE and a real Pixel, **When** the hero scrub and layout are tested on each, **Then** both pass Stories 1–3 with no device-specific breakage.
2. **Given** the testing is performed, **When** it completes, **Then** a record exists (per-device notes/screenshots) confirming scrub alignment, smoothness, and layout on both sizes.

---

### Edge Cases

- What happens on a very short landscape phone (e.g., iPhone SE landscape ~667×375)? (scrub travel/pacing and overlay must still align; typography must not overflow horizontally.)
- What happens when `prefers-reduced-motion` is set on mobile? (current code draws a static poster and must continue to do so — the mobile tuning must not reintroduce motion for these users.)
- What happens if a hero frame fails to load / is still decoding while the user scrolls past it? (fallback must show last good frame or poster, not a blank canvas or jump.)
- What happens on a low-end phone where decoding many frames is heavy? (mobile tuning should keep frame delivery ahead of the scroll position via look-ahead and consider reduced mobile frame count/resolution without breaking alignment.)
- What happens on orientation change / resize mid-hero? (re-measure travel and re-pick frame resolution without leaving the canvas misaligned.)
- What happens with browser UI (address bar) show/hide changing `innerHeight` mid-scroll? (travel math must not depend on a stale viewport height captured once at load.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The hero scroll-scrubbing animation MUST be explicitly tuned for small (≤480px) touch viewports with its own pacing/travel/layout parameters, NOT a scaled-down copy of the desktop scrub.
- **FR-002**: On mobile, the displayed frame index MUST track the scroll position within one frame during steady scrolling (no multi-frame catch-up jumps).
- **FR-003**: At the end of the hero scroll travel on mobile, the final frame MUST align with the start of the following section (no gap, early, or late transition).
- **FR-004**: The hero scroll handling on mobile MUST preserve native touch-scroll feel — no scroll-jacking, no forced pauses, no scroll-position reset, no "snap-back" — while the hero is on screen.
- **FR-005**: The hero scroll/update loop on mobile MUST remain passive, `requestAnimationFrame`-coalesced, and MUST NOT read layout-triggering properties (`offsetTop`, `getBoundingClientRect`, `clientHeight`) inside the scroll/update path (per constitution Principle 1 and existing FR-006/FR-007).
- **FR-006**: The hero must keep frame delivery (look-ahead loading) ahead of the touch scroll position on mobile so decoding cost does not cause visible lag or jumps.
- **FR-007**: Hero typography (heading, subhead, CTA) MUST use a mobile-appropriate type scale and MUST NOT overflow or clip horizontally on ≤480px viewports.
- **FR-008**: Hero overlay/HUD content MUST respect device safe-area insets (notch, home indicator) and MUST NOT be cut off or collide with the title on small screens.
- **FR-009**: The hero layout/scrub MUST adapt between a small phone (~375px) and a larger phone (~412px) rather than being a uniform scaled copy.
- **FR-010**: The fix MUST be verified on at least two real mobile screen sizes (small phone ~iPhone SE and larger phone ~Pixel), with a per-device record of scrub alignment, smoothness, and layout.
- **FR-011**: `prefers-reduced-motion` on mobile MUST continue to show a static poster with no scrubbing loop (the mobile tuning must not reintroduce motion).
- **FR-012**: Orientation change and mid-hero resize MUST re-measure scroll travel and re-pick frame resolution without leaving the canvas misaligned.
- **FR-013**: Any performance-affecting change to the hero MUST be benchmarked before/after on mobile (e.g., Lighthouse / DevTools Performance) — "looks fine" is not sufficient proof (per constitution Principle 1).

### Key Entities

- **Hero Scroll Travel**: the scroll distance over which the 174 frames are distributed on a given viewport; key attributes: viewport class (mobile/desktop), travel distance, frame-to-progress mapping.
- **Hero Frame Variant**: a viewport-specific (mobile) encoded image for one of the 174 indices; key attributes: index, resolution, decode/paint cost, availability (avif/webp/jpeg fallback).
- **Mobile Verification Record**: captured evidence (notes/screenshots) of scrub alignment, smoothness, and layout on each tested real device.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a real iPhone SE and a real Pixel, the hero's final frame aligns with the following section boundary within ±1 frame of scroll-derived target at the end of travel (no visible misalignment).
- **SC-002**: During steady touch scrolling on mobile, the visible frame never lags the scroll position by more than one frame (no multi-frame catch-up jumps) across slow and fast flings.
- **SC-003**: Touch scrolling over the hero feels native — 0 instances of scroll-jacking, forced pause, scroll reset, or snap-back observed during testing on both devices.
- **SC-004**: Hero heading/subhead fit fully within the viewport on a 375px-wide screen with 0 horizontal overflow/clipping, verified on both tested devices.
- **SC-005**: Hero overlay content respects safe-area insets on both tested devices with 0 cut-off or title-collision cases.
- **SC-006**: Interaction to Next Paint (INP) during hero scrolling on mobile stays ≤ 200 ms with no scroll-attributable long tasks > 50 ms on both tested devices (no regression versus current mobile build).
- **SC-007**: The fix is confirmed working on at least two distinct real mobile screen sizes, with a per-device verification record produced for each.

## Assumptions

- The 174-frame sequence and the existing mobile frame variants (`IMAGES.hero.frames[].mobile`) are final assets and must not be reduced in count unless a low-end performance gate requires it (then only reduced resolution/count with alignment preserved).
- "Real mobile screen sizes" means a small phone in the iPhone SE class (~375×667) and a larger phone in the Pixel class (~412×915); physical-device testing or equivalent remote-debug/emulation with touch input is acceptable, but responsive desktop emulation alone does not satisfy FR-010.
- Native touch scroll is the desired behavior; no scroll-snapping, pinning, or scroll-hijacking is introduced by this fix.
- The existing canvas + rAF + passive-scroll architecture is retained; this feature tunes parameters and layout, it does not replace the mechanism.
- Tooling for mobile benchmarking (Lighthouse / Chrome DevTools remote debugging) is available in the environment; if not, that is captured as a setup task in planning.
- No new sections, copy, or content are added (constitution Non-Goals).
