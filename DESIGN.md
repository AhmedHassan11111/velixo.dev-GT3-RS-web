---
name: velixo.io Porsche GT3 RS Showcase
description: A cinematic scroll-driven portfolio showcasing the Porsche 911 GT3 RS as proof of premium web development craft.
colors:
  electric-blue: "#0066FF"
  electric-blue-bright: "#3385FF"
  electric-blue-deep: "#0047CC"
  bright-silver: "#E8E8E8"
  silver-dim: "#B0B0B0"
  pure-black: "#000000"
  ink: "#0A0A0A"
  surface-dark: "#111111"
  pure-white: "#FFFFFF"
  neutral-border-dark: "#262626"
  neutral-border-light: "#E5E5E5"
  muted-text-dark: "#A3A3A3"
  muted-text-light: "#525252"
typography:
  display:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-light:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.7
    letterSpacing: "0.01em"
  label:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  pill: "9999px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  2xl: "96px"
  3xl: "128px"
components:
  button-primary:
    backgroundColor: "{colors.electric-blue}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.electric-blue-bright}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-light:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input-email:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
---

# Design System: velixo.io Porsche GT3 RS Showcase

## 1. Overview

**Creative North Star: "The Cinematic Reel"**

This is a cinematic scroll-driven experience — full-bleed imagery, scroll-scrubbed frame sequences, and dramatic transitions between sections. Electric blue is the energy source: it catches the eye the way headlights cut through a dark road. Every section is a frame in the reel; the scroll is the playback.

The system alternates between darkness and light. Dark sections (hero, performance, engine, gallery, reviews, CTA, footer) carry the cinematic weight — immersive, full-bleed, dramatic. Light sections (showcase intro, design, technology, FAQ) provide visual relief and showcase clarity. The transitions between them are deliberate cuts, not fades. The content wrapper has rounded top corners (2rem) that slide over the hero like a card stacking effect.

Electric blue (#0066FF) is the one consistent accent across all sections. It appears on CTA buttons, section labels, icons, hover borders, focus states, the logo ".io" suffix, the loading bar, and the scroll progress indicator. Bright silver (#E8E8E8) is the secondary accent for text on dark backgrounds — used on the hero "RS", marquee text, and services showcase text. The system rejects generic AI-generated landing pages: no identical card grids, no gradient text, no tiny uppercase eyebrows above every section, no numbered section markers as scaffolding.

**Key Characteristics:**
- Scroll as playback — every section is a frame in the cinematic reel
- Electric blue (#0066FF) as the primary accent — bold, energetic, premium
- Bright silver (#E8E8E8) as secondary text accent on dark backgrounds
- Alternating dark/light rhythm — dramatic immersion vs. clear relief
- Stacking card transition — content slides over pinned hero with rounded corners
- Ambient shadows always on — cards and images carry depth at all times
- Full-bleed imagery — photographs fill their containers edge to edge
- Magnetic buttons with spring physics — premium tactile feedback
- Cinematic loading screen — velixo.io logo scales from center to navbar

## 2. Colors: The Electric Blue Palette

A high-contrast system with one bold accent. The palette is 85% neutrals (black, white, grays) and 15% electric blue — the energy that powers the interface.

### Primary
- **Electric Blue** (#0066FF): The signature accent. Used on all primary CTA buttons, section labels (PERFORMANCE, DESIGN, TECHNOLOGY, REVIEWS, FAQ), icons, hover borders, focus states, loading bar, scroll progress, logo ".io" suffix, marquee bullets, CTA glow effect. Bold, saturated, premium. Never exceeds 10% of any screen.
- **Electric Blue Bright** (#3385FF): Hover state for primary buttons. A lighter, more energetic blue.
- **Electric Blue Deep** (#0047CC): Pressed/active state. Darker, more grounded.

### Secondary
- **Bright Silver** (#E8E8E8): Secondary text accent on dark backgrounds. Used on hero "RS" lettering, marquee text, services showcase text. High contrast against black (16:1 ratio).
- **Silver Dim** (#B0B0B0): Dimmed silver for less prominent text on dark backgrounds.

### Neutral
- **Pure Black** (#000000): Body background for dark sections, hero canvas background. The void that makes the blue sing.
- **Ink** (#0A0A0A): Primary text color on light backgrounds. Near-black for slightly softer reading on white.
- **Surface Dark** (#111111): Card backgrounds on dark sections. One step up from pure black for subtle layering.
- **Pure White** (#FFFFFF): Text on dark backgrounds, light section backgrounds, body background (prevents black flash during scroll transitions).
- **Neutral Border Dark** (#262626): Borders and dividers on dark sections.
- **Neutral Border Light** (#E5E5E5): Borders on light sections.
- **Muted Text Dark** (#A3A3A3): Secondary text on dark backgrounds.
- **Muted Text Light** (#525252): Secondary text on light backgrounds.

### Named Rules
**The One Energy Source Rule.** Electric Blue is the only accent color in the system. It never shares the screen with another saturated hue. If you need emphasis, use electric blue. If you need a second color, reconsider — the system doesn't have one.

**The 10% Ceiling Rule.** Electric Blue never covers more than 10% of any visible viewport. It punctuates; it never fills. A blue button, a blue label, a blue icon — that's the budget per frame.

**The White Body Rule.** The body background is white (#FFFFFF), not black. This prevents black flash during scroll stacking transitions. Dark sections carry their own `bg-black` explicitly.

## 3. Typography

**Display Font:** system-ui, -apple-system, sans-serif (with fallback to system stack)
**Body Font:** system-ui, -apple-system, sans-serif

**Character:** A single-family system using weight and size contrast for hierarchy. The system stack is fast, universal, and clean — it doesn't compete with the imagery or the motion. The personality comes from the weight discipline (700 for display, 300 for body-light) and the tracking (tight on display, wide on labels), not from the typeface itself.

### Hierarchy
- **Display** (700, clamp(2.5rem, 6vw, 3rem), 1.1 line-height, -0.02em tracking): Hero and section headlines.
- **Headline** (700, clamp(2rem, 5vw, 3rem), 1.1 line-height, -0.02em tracking): Section titles on dark and light backgrounds.
- **Title** (600, 1.25rem, 1.3 line-height): Card titles, sub-section headings.
- **Body** (400, 1rem, 1.6 line-height): Primary body text. Cap line length at 65–75ch.
- **Body Light** (300, 1rem, 1.7 line-height, 0.01em tracking): Showcase intro text, CTA subtitle.
- **Label** (700, 0.75rem, 1 line-height, 0.1em tracking): Used sparingly — NOT above every section. Reserved for functional labels.

### Named Rules
**The No-Eyebrow Rule.** Tiny uppercase tracked labels must NOT appear above every section heading. Use a label only when it carries functional information.

**The Weight Contrast Rule.** Display headings are 700. Body is 400. Body-light is 300. The contrast is the hierarchy.

## 4. Elevation

Ambient depth is always on. Cards, images, and interactive elements carry shadows at all times — not just on hover.

### Shadow Vocabulary
- **Ambient Card** (`box-shadow: 0 4px 24px rgba(0,0,0,0.15)`): Default shadow for cards on light backgrounds.
- **Elevated Image** (`box-shadow: 0 8px 32px rgba(0,0,0,0.25)`): Images and large cards.
- **Dramatic Lift** (`box-shadow: 0 16px 48px rgba(0,0,0,0.4)`): Technology cards and featured elements on dark backgrounds.
- **Blue Glow** (`box-shadow: 0 4px 20px rgba(0,102,255,0.15)`): Hover state on electric blue buttons. A subtle blue glow.

### Named Rules
**The Always-On Rule.** Shadows are not hover decorations. Cards and images carry ambient shadows at rest.

**The Dark Section Deepening Rule.** Shadows on dark sections must be deeper (0.4+ alpha) than shadows on light sections (0.15 alpha).

## 5. Components

### Buttons
- **Shape:** Full pill (9999px radius). No rectangular buttons.
- **Primary:** Electric Blue (#0066FF) background, white text, 14px 28px padding, font-semibold. Hover: background lightens to Electric Blue Bright (#3385FF), transform: scale(1.05), Blue Glow shadow. Magnetic hover effect with spring physics (stiffness: 300, damping: 25).
- **Secondary / Ghost:** Transparent background, 1px border in white/30% (on dark) or neutral-300 (on light), white/ink text. Hover: background fills to white/10%.
- **Focus:** 2px outline in Electric Blue with 2px offset.

### Cards
- **Corner Style:** 16px radius (rounded-2xl), 24px (rounded-3xl) for large images.
- **Dark Background:** Surface Dark (#111111) with Neutral Border Dark (#262626).
- **Light Background:** Pure White with Neutral Border Light (#E5E5E5).
- **Interactive Cards (Technology):** Min-height 420px, background image with dark gradient overlay, content at bottom, hover: scale(1.03) + translateY(-14px) + border glows to Electric Blue + Dramatic Lift shadow. Background image scales to 1.1 on hover. Icon changes from blue/20% bg to solid blue bg with white icon.

### Inputs / Fields
- **Style:** Surface Dark (#111111) background, Neutral Border Dark (#262626) 1px border, pill radius, 12px 20px padding.
- **Focus:** Border shifts to Electric Blue (#0066FF).

### Navigation
- **Style:** Fixed top, transparent over hero, transitions to hidden when scrolling past hero. Logo (velixo.io with ".io" in Electric Blue) on left, nav links center-right, primary button on right.
- **Mobile:** Hamburger menu opens full-width panel.

### Scroll-Driven Frame Sequence (Signature Component)
- **Behavior:** 174 hero frames rendered to canvas, scrubbed by scroll position over 600vh. CSS sticky positioning pins the hero card. GSAP ScrollTrigger scales the hero back (0.88) as the content wrapper slides over.
- **Stacking effect:** Content wrapper (#content-wrapper) has z-10, rounded-t-[2rem], bg-white, and -2rem margin-top. It slides over the pinned hero like a card rising from the bottom.

### Cinematic Loading Screen (Signature Component)
- **Behavior:** "velixo.io" logo displayed large and centered on black. After 2.6s, scales down (0.15) and translates to navbar position. Progress bar at bottom in Electric Blue.

### Scroll Progress Bar
- **Behavior:** Fixed 2px bar at top of viewport. Electric Blue. ScaleX bound to scroll progress.

## 6. Do's and Don'ts

### Do:
- **Do** use Electric Blue (#0066FF) as the single accent color for buttons, labels, icons, and interactive borders.
- **Do** use Bright Silver (#E8E8E8) for secondary text accents on dark backgrounds (hero "RS", marquee text).
- **Do** use full pill (9999px) radius on all buttons.
- **Do** carry ambient shadows on cards and images at all times.
- **Do** alternate dark and light sections for cinematic rhythm.
- **Do** use `prefers-reduced-motion: reduce` alternatives for all animations.
- **Do** use weight contrast (700 display, 400 body, 300 body-light) as the primary hierarchy tool.
- **Do** use magnetic buttons with spring physics for premium tactile feedback.
- **Do** use the cinematic loading screen with velixo.io logo animation.

### Don't:
- **Don't** use tiny uppercase tracked labels above every section heading.
- **Don't** use gradient text. Use a single solid color.
- **Don't** use numbered section markers (01, 02, 03) as scaffolding.
- **Don't** use side-stripe borders (border-left > 1px as colored accent).
- **Don't** let Electric Blue exceed 10% of any visible viewport.
- **Don't** use glassmorphism as default.
- **Don't** use generic AI-generated look: cream/sand backgrounds, flat card grids, templated layouts.
- **Don't** use gray text on a colored background — use a darker shade of the background's hue.
- **Don't** use body background black — it causes black flash during scroll stacking transitions. Use white.
