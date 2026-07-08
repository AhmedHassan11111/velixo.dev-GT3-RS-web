---
name: velixo.io Porsche GT3 RS Showcase
description: A cinematic scroll-driven portfolio showcasing the Porsche 911 GT3 RS as proof of premium web development craft.
colors:
  polished-chrome: "#C4CCD4"
  polished-chrome-deep: "#A0AAB8"
  polished-chrome-bright: "#E0E6EC"
  pure-black: "#000000"
  ink: "#0A0A0A"
  surface-dark: "#111111"
  pure-white: "#FFFFFF"
  neutral-border-dark: "#262626"
  neutral-border-light: "#E5E5E5"
  muted-text-dark: "#A3A3A3"
  muted-text-light: "#525252"
  warm-tan: "#D4B896"
  warm-brown: "#4A2C2A"
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
    backgroundColor: "{colors.polished-chrome}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.polished-chrome-bright}"
    textColor: "{colors.ink}"
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

This is a cinematic scroll-driven experience — full-bleed imagery, scroll-scrubbed frame sequences, and dramatic transitions between sections. The silver accent is the light source: it catches the eye the way chrome catches a spotlight in a dark showroom. Every section is a frame in the reel; the scroll is the playback.

The system alternates between darkness and light. Dark sections (hero, performance, gallery, reviews, CTA) carry the cinematic weight — immersive, full-bleed, dramatic. Light sections (design, technology, FAQ) provide visual relief and showcase clarity. The transitions between them are deliberate cuts, not fades. Section dividers (1px lines) act as film splices between scenes.

The polished chrome silver is the one consistent character across all sections. It appears on CTA buttons, accent text, the "RS" lettering in the hero, icons, and divider details. Its rarity is its power — it never fills a section, it punctuates one. The system rejects generic AI-generated landing pages: no identical card grids, no gradient text, no tiny uppercase eyebrows above every section, no numbered section markers as scaffolding.

**Key Characteristics:**
- Scroll as playback — every section is a frame in the cinematic reel
- Polished chrome silver as the single accent — cool, reflective, rare
- Alternating dark/light rhythm — dramatic immersion vs. clear relief
- Ambient shadows always on — cards and images carry depth at all times
- Full-bleed imagery — photographs fill their containers edge to edge
- Section dividers as film splices — 1px lines between scenes, not gradients

## 2. Colors: The Polished Chrome Palette

A monochromatic system with one metallic accent. The palette is 90% neutrals (black, white, grays) and 10% polished chrome — the silver that catches the light.

### Primary
- **Polished Chrome** (#C4CCD4): The signature accent. Used on CTA buttons, the "RS" lettering in the hero, icon highlights, interactive element borders on hover, and the velixo.io ".io" suffix in the logo. Cool, reflective, high-chroma silver. Never exceeds 10% of any screen.
- **Polished Chrome Bright** (#E0E6EC): Hover state for primary buttons. A brighter, more reflective silver that simulates the light catching the chrome at a different angle.
- **Polished Chrome Deep** (#A0AAB8): Pressed/active state. Darker chrome, like the shadow side of a polished surface.

### Neutral
- **Pure Black** (#000000): Body background, dark section backgrounds. The void that makes the silver sing.
- **Ink** (#0A0A0A): Primary text color on light backgrounds. Near-black, not pure black, for slightly softer reading on white.
- **Surface Dark** (#111111): Card backgrounds on dark sections. One step up from pure black to create subtle layering.
- **Pure White** (#FFFFFF): Text on dark backgrounds, light section backgrounds. The opposite pole of the cinematic contrast.
- **Neutral Border Dark** (#262626): Borders and dividers on dark sections. Visible but never loud.
- **Neutral Border Light** (#E5E5E5): Borders on light sections. Subtle separation without heaviness.
- **Muted Text Dark** (#A3A3A3): Secondary text on dark backgrounds. Reads clearly without competing with primary text.
- **Muted Text Light** (#525252): Secondary text on light backgrounds.

### Section-Specific
- **Warm Tan** (#D4B896): Engine section background. A deliberate tonal shift — warm, premium, distinct from the neutral system.
- **Warm Brown** (#4A2C2A): Engine section text. Pairs with the warm tan for a self-contained tonal scene within the reel.

### Named Rules
**The One Light Source Rule.** Polished Chrome is the only accent color in the system. It never shares the screen with another saturated hue. If you need emphasis, use chrome. If you need a second color, reconsider — the system doesn't have one.

**The 10% Ceiling Rule.** Polished Chrome never covers more than 10% of any visible viewport. It punctuates; it never fills. A silver button, a silver "RS", a silver icon — that's the budget per frame.

**The Non-White Vacuum Rule.** Any non-white empty area on a dark section should use Pure Black (#000000), not a gray. Grays in empty space read as unintentional; pure black reads as deliberate void.

## 3. Typography

**Display Font:** system-ui, -apple-system, sans-serif (with fallback to system stack)
**Body Font:** system-ui, -apple-system, sans-serif

**Character:** A single-family system using weight and size contrast for hierarchy. The system stack is fast, universal, and clean — it doesn't compete with the imagery or the motion. The personality comes from the weight discipline (700 for display, 300 for body-light) and the tracking (tight on display, wide on labels), not from the typeface itself.

### Hierarchy
- **Display** (700, clamp(2.5rem, 6vw, 3rem), 1.1 line-height, -0.02em tracking): Hero and section headlines. The heaviest voice in the system.
- **Headline** (700, clamp(2rem, 5vw, 3rem), 1.1 line-height, -0.02em tracking): Section titles on dark and light backgrounds.
- **Title** (600, 1.25rem, 1.3 line-height): Card titles, sub-section headings.
- **Body** (400, 1rem, 1.6 line-height): Primary body text. Cap line length at 65–75ch.
- **Body Light** (300, 1rem, 1.7 line-height, 0.01em tracking): Showcase intro text, CTA subtitle. A thinner, more spacious voice for reflective moments.
- **Label** (700, 0.75rem, 1 line-height, 0.1em tracking): Used sparingly — NOT above every section. Reserved for functional labels (loading indicators, status text).

### Named Rules
**The No-Eyebrow Rule.** Tiny uppercase tracked labels (0.75rem, 0.1em, all-caps) must NOT appear above every section heading. This is the saturated AI scaffold. Use a label only when it carries functional information (status, category, state), never as decorative scaffolding.

**The Weight Contrast Rule.** Display headings are 700. Body is 400. Body-light is 300. The contrast between 700 and 300 is the hierarchy — not color, not size alone. Never use 500 or 600 for body text; it collapses the contrast ladder.

## 4. Elevation

Ambient depth is always on. Cards, images, and interactive elements carry shadows at all times — not just on hover. This creates a layered, cinematic feel where elements float in space rather than sitting flat on a surface.

### Shadow Vocabulary
- **Ambient Card** (`box-shadow: 0 4px 24px rgba(0,0,0,0.15)`): Default shadow for cards on light backgrounds. Soft, diffuse, always present.
- **Elevated Image** (`box-shadow: 0 8px 32px rgba(0,0,0,0.25)`): Images and large cards. Deeper shadow for heavier elements.
- **Dramatic Lift** (`box-shadow: 0 16px 48px rgba(0,0,0,0.4)`): Technology cards and featured elements on dark backgrounds. Deep, cinematic shadow.
- **Chrome Glow** (`box-shadow: 0 4px 20px rgba(196,204,212,0.15)`): Hover state on polished chrome buttons. A subtle silver glow that simulates light reflecting off chrome.

### Named Rules
**The Always-On Rule.** Shadows are not hover decorations. Cards and images carry ambient shadows at rest. Hover deepens the shadow; it doesn't create it from nothing.

**The Dark Section Deepening Rule.** Shadows on dark sections must be deeper (0.4+ alpha) than shadows on light sections (0.15 alpha). A 0.15 shadow on black is invisible; depth on dark requires more force.

## 5. Components

### Buttons
- **Shape:** Full pill (9999px radius). No rectangular buttons anywhere in the system.
- **Primary:** Polished Chrome (#C4CCD4) background, Ink (#0A0A0A) text, 14px 28px padding, font-semibold. Hover: background lightens to Polished Chrome Bright (#E0E6EC), transform: scale(1.05), Chrome Glow shadow.
- **Secondary / Ghost:** Transparent background, 1px border in white/30% (on dark) or neutral-300 (on light), white/ink text. Hover: background fills to black/20% (on dark) or neutral-100 (on light).
- **Focus:** 2px outline in Polished Chrome with 2px offset. Never rely on color alone.

### Cards
- **Corner Style:** 16px radius (rounded-2xl) for standard cards, 24px (rounded-3xl) for large image containers.
- **Dark Background:** Surface Dark (#111111) with Neutral Border Dark (#262626), Ambient Card shadow.
- **Light Background:** Pure White with Neutral Border Light (#E5E5E5), Ambient Card shadow.
- **Interactive Cards (Technology):** Min-height 420px, background image with dark gradient overlay, content at bottom, hover: scale(1.03) + translateY(-14px) + border glows to Polished Chrome + Dramatic Lift shadow. Background image scales to 1.1 on hover.
- **Internal Padding:** 24px (p-6) standard, 28px (p-7) for larger cards.

### Inputs / Fields
- **Style:** Surface Dark (#111111) background, Neutral Border Dark (#262626) 1px border, pill radius, 12px 20px padding, white text, placeholder in muted gray.
- **Focus:** Border shifts to Polished Chrome (#C4CCD4). No glow — the border change is enough.

### Navigation
- **Style:** Fixed top, transparent over hero, transitions to hidden when scrolling past hero. Logo (velixo.io with ".io" in Polished Chrome) on left, nav links center-right, primary button on right.
- **Hover:** Links transition from muted gray to white. No underline, no background.
- **Mobile:** Hamburger menu opens a full-width panel with stacked links and a primary button.

### Scroll-Driven Frame Sequence (Signature Component)
- **Behavior:** 174 hero frames rendered to canvas, scrubbed by scroll position. The car rotates as the user scrolls. Loading bar in Polished Chrome.
- **Overlay:** Gradient from black/60 at bottom to transparent at top. Text content fades and translates as scroll progresses.

### Services Showcase (Signature Component)
- **Behavior:** Full-screen image shrinks to top-left quadrant on scroll, three additional images fade in to form a 2x2 grid. Text in a separate half-screen section above with 1px dividers.

## 6. Do's and Don'ts

### Do:
- **Do** use Polished Chrome (#C4CCD4) as the single accent color for buttons, "RS" lettering, icon highlights, and interactive element borders.
- **Do** use full pill (9999px) radius on all buttons — no exceptions.
- **Do** carry ambient shadows on cards and images at all times — depth is always on.
- **Do** alternate dark and light sections for cinematic rhythm — the contrast between them is the pacing.
- **Do** use 1px dividers between sections as film splices — clean, deliberate cuts.
- **Do** keep body line length at 65–75ch for readability.
- **Do** respect `prefers-reduced-motion: reduce` — provide crossfade or instant alternatives for all scroll animations and parallax.
- **Do** use weight contrast (700 display, 400 body, 300 body-light) as the primary hierarchy tool.

### Don't:
- **Don't** use tiny uppercase tracked labels above every section heading. This is the saturated AI scaffold — the "GALLERY", "PERFORMANCE", "TECHNOLOGY" eyebrows are banned. One functional label is voice; repeated eyebrows are AI grammar.
- **Don't** use gradient text (`background-clip: text` with gradient). Use a single solid color — Polished Chrome for accents, white or ink for headings.
- **Don't** use numbered section markers (01, 02, 03) as scaffolding. Numbers earn their place only when the section is a real sequence.
- **Don't** use side-stripe borders (`border-left` > 1px as a colored accent). Rewrite with full borders, background tints, or leading icons.
- **Don't** use identical card grids with the same icon + heading + text pattern repeated endlessly. Vary card sizes, content, and imagery.
- **Don't** let Polished Chrome exceed 10% of any visible viewport. It punctuates; it never fills.
- **Don't** use glassmorphism as default. Blurs and glass cards are decorative, not structural.
- **Don't** use generic AI-generated look: cream/sand backgrounds, flat card grids, templated layouts. If someone could guess "AI made that" without doubt, it has failed.
- **Don't** use gray text on a colored background — it looks washed out. Use a darker shade of the background's hue or a transparency of the text color.
- **Don't** use any font from the reflex-reject list (Fraunces, Inter, DM Sans, Space Grotesk, etc.) as a new design choice. The system stack is the committed choice.
