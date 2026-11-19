---
name: Medical Image Viewer
description: A private browser lightbox shaped as one precise imaging instrument.
colors:
  paper: "#f3f4f6"
  surface: "#ffffff"
  surface-soft: "#e9ebef"
  ink: "#14171c"
  muted: "#626975"
  line: "#d4d8df"
  line-strong: "#aeb4bf"
  accent: "#3157ed"
  accent-hover: "#2446c7"
  accent-soft: "#e7ecff"
  danger: "#a72d25"
  viewport: "#08090c"
  viewport-line: "#292c32"
typography:
  display:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6.2vw, 5.8rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 4vw, 3.8rem)"
    fontWeight: 550
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  tool-label:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 550
    lineHeight: 1.5
    letterSpacing: "normal"
  button-label:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  instrument: "14px"
  drop-zone: "9px"
  feedback: "8px"
  control: "7px"
  tool: "6px"
  aperture: "999px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    padding: "0.65rem 0.9rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.surface}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    padding: "0.65rem 0.9rem"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    padding: "0.65rem 0.9rem"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.danger}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    padding: "0.65rem 0.9rem"
  tool-button:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.tool-label}"
    rounded: "{rounded.tool}"
    padding: "0.45rem 0.58rem"
  tool-button-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-hover}"
    typography: "{typography.tool-label}"
    rounded: "{rounded.tool}"
    padding: "0.45rem 0.58rem"
  viewer-shell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.instrument}"
    width: "min(100% - 2rem, 1500px)"
---

# Design System: Medical Image Viewer

## Overview

**Creative North Star: "The Private Lightbox"**

The Private Lightbox treats the browser as a calibrated viewing instrument: a quiet paper-colored room surrounding one optically dominant black image field. Graphite typography, one-pixel rules, and cobalt actuators create the confidence of laboratory equipment without borrowing the visual severity of hospital enterprise software.

Every surface supports a local inspection sequence. Controls remain physically attached to the image rather than floating as cards; state is explicit, compact, and close to the operation it governs. The interface earns trust through restraint: no ornamental chrome, no account theater, and no visual competition with the scan.

The system is exact but not cold. Outfit's rounded geometry, a restrained shell radius, and sparse ambient depth keep the instrument approachable while preserving the hierarchy of action, image, metadata, and privacy explanation.

**Key Characteristics:**

- One integrated control chassis and imaging field.
- Paper, graphite, cobalt, and imaging black as the complete visual world.
- One-pixel structural rules instead of nested cards.
- Dense controls with generous reading space around the instrument.
- Motion that clarifies arrival, state, and disclosure, then gets out of the way.

## Colors

The palette separates the quiet workspace from the black diagnostic field, using cobalt only where the instrument can be operated or its active state must be read.

### Primary

- **Cobalt Actuator** (`#3157ed`): Primary file actions, upload iconography, range controls, focus language, and drag-active boundaries.
- **Pressed Cobalt** (`#2446c7`): Primary hover state and the foreground of selected tools.
- **Cobalt Wash** (`#e7ecff`): Selected-tool and drag-target background without adding a second accent.

### Neutral

- **Instrument Paper** (`#f3f4f6`): Page workspace and translucent sticky-header base.
- **Clean Surface** (`#ffffff`): Control chassis, toolbar, and secondary controls.
- **Soft Equipment Grey** (`#e9ebef`): Quiet hover fill for secondary and toolbar controls.
- **Graphite Ink** (`#14171c`): Primary text, brand mass, and highest-contrast non-image marks.
- **Calibrated Muted** (`#626975`): Explanatory text, labels, navigation, metadata keys, and inactive tools.
- **Hairline** (`#d4d8df`): Internal dividers and secondary-control borders.
- **Strong Rule** (`#aeb4bf`): Instrument perimeter, drop target, and disclosure boundaries.
- **Imaging Black** (`#08090c`): Viewport, inline scan aperture, and image-state foundation.
- **Viewport Rule** (`#292c32`): Low-contrast separators inside the imaging field.

### Semantic

- **Clear-Session Red** (`#a72d25`): Destructive local-session removal only; it is never a decorative accent.

**The Cobalt Restraint Rule.** Cobalt appears only for primary action, selection, focus, and live tool state; the image remains chromatically neutral.

## Typography

**Display Font:** Outfit (with `ui-sans-serif`, `system-ui`, and `sans-serif` fallbacks)<br>
**Body Font:** Outfit (with `ui-sans-serif`, `system-ui`, and `sans-serif` fallbacks)<br>
**Label Font:** Outfit (with `ui-sans-serif`, `system-ui`, and `sans-serif` fallbacks)

**Character:** Outfit supplies a single technical-humanist voice. Tight display tracking and compact operational labels make the product feel engineered, while open counters and moderate body leading keep privacy and status copy calm.

### Hierarchy

- **Display** (600, `clamp(3rem, 6.2vw, 5.8rem)`, 0.94, `-0.04em`): The primary statement; balanced into a compact two-line mass and reduced to `clamp(2.65rem, 13vw, 4rem)` on narrow screens.
- **Headline** (550, `clamp(2.2rem, 4vw, 3.8rem)`, 0.98, `-0.04em`): Major explanatory section heading.
- **Body** (400, `1rem`, 1.5): Default explanatory copy; lead copy expands fluidly where shipped.
- **Tool Label** (550, `0.78rem`, 1.5): Toolbar operations and compact functional state.
- **Button Label** (650, `0.78rem`, 1.5): Primary, secondary, and destructive actions.
- **Metadata** (550 values / 400 keys, `0.70rem–0.72rem`, 1.5): Tabular, clipped instrument readouts.

**The One Instrument Voice Rule.** Outfit is the only typeface; hierarchy comes from scale, weight, line height, and negative tracking, never from a decorative pairing.

## Layout

The spatial model alternates open reading space with one bounded operating surface. The header is a 64px sticky three-part grid; the main statement sits in a 1200px container; the viewer expands to 1500px; the privacy explanation resolves inside 1240px. Horizontal gutters remain at 1rem per side, tightening only for the mobile viewer shell.

The operating surface uses a 12-column grid: controls occupy three columns and the viewport nine above 1120px, then four and eight through the intermediate range. At 820px and below, the instrument stacks vertically while the control area becomes a two-column grid. At 560px and below, upload, viewport, series controls, metadata, and session clearing are reordered into one continuous instrument; the toolbar becomes a compact six-column row plus a two-column export row.

Spacing follows functional proximity rather than a decorative card rhythm. Tight gaps (`0.35rem–0.75rem`) bind controls, medium gaps (`1rem–1.35rem`) organize control groups, and large fluid padding separates the hero, instrument, privacy section, and footer. Interactive controls maintain a 44px minimum target.

## Elevation & Depth

The system is flat by default. White surfaces are separated by one-pixel rules and by the hard contrast against Imaging Black. The complete viewer may cast one low, broad ambient shadow (`0 34px 80px -54px rgba(20, 23, 28, 0.45)`); transient feedback uses a tighter dark shadow, while viewport overlays use only a minimal text shadow for image legibility.

### Shadow Vocabulary

- **Instrument Ambient** (`0 34px 80px -54px rgba(20, 23, 28, 0.45)`): Grounds the complete operating surface without lifting its internal regions.
- **Local Status Ring** (`0 0 0 3px rgba(31, 157, 96, 0.12)`): Makes the browser-only status visible without becoming an action color.
- **Toast Lift** (`0 16px 35px -18px rgba(0, 0, 0, 0.65)`): Separates transient feedback from the page edge.
- **Overlay Legibility** (`0 1px 2px #000`): Keeps viewport metadata readable over variable scan content.

**The Flat Instrument Rule.** Internal modules never receive independent card shadows; depth belongs to the complete instrument or to transient feedback.

## Shapes

The form language is restrained and nested by function. The complete instrument uses a 14px radius, reduced to 10px on narrow screens. Drop targets use 9px, transient feedback 8px, standard controls 7px, and toolbar or error controls 6px. The inline scan aperture alone is fully pill-shaped (`999px`) because it represents an optical opening rather than a container.

One-pixel solid rules define structural boundaries; the file drop target uses a one-pixel dashed rule. Circular geometry is reserved for scan reticles, status indicators, and spinners. No decorative blob, gradient, or free-floating rounded panel belongs in this world.

## Components

### Instrument Header

- **Structure:** Sticky, 64px-high three-column grid with the brand at the start, navigation centered, and browser-only status at the end; it becomes a two-column brand/status bar at 820px.
- **Material:** Instrument Paper at 94% opacity with 12px backdrop blur and a single Hairline bottom rule.
- **Brand Mark:** A 28px Graphite Ink square with a 6px radius and white crosshair; the slash is the only cobalt mark.
- **Navigation:** Muted `0.78rem` links turn Graphite Ink on hover or keyboard focus.

### Buttons

- **Shape:** Gently curved control (`7px`) with `0.65rem 0.9rem` padding, `0.78rem` type at weight 650, and a 44px minimum target.
- **Primary:** Cobalt Actuator fill with white text; hover deepens to Pressed Cobalt and lifts 1px, while active returns to baseline.
- **Secondary:** Clean Surface with a Hairline border; hover adds Soft Equipment Grey and strengthens the rule.
- **Destructive:** Transparent with a pale red rule and Clear-Session Red text; the fill appears only on hover.
- **Focus / Disabled:** Every control receives a 3px translucent cobalt outline with 2px offset; disabled controls remain present at 38% opacity.

### Upload Zone

- **Shape:** A 9px rounded, one-pixel dashed Strong Rule surrounding the file actions.
- **Background:** Near-white component surface (`#fafbfc`) distinct from both page paper and control white.
- **State:** Dragging switches the rule to cobalt, applies Cobalt Wash, and lifts the zone 2px with the instrument easing curve.
- **Content:** Cobalt upload glyph, strong action label, muted local-only note, then full-width primary and secondary actions.

### Viewer Shell

- **Structure:** One 12-column chassis with controls and toolbar physically joined to the viewport; the shell has a 14px radius, Strong Rule perimeter, Clean Surface control region, and Imaging Black image region.
- **Viewport:** Imaging Black with an extremely low-contrast 48px grid, crosshair cursor, compact corner overlays, and a dark interaction rail.
- **Empty / Loading / Error:** States occupy the image field rather than opening modals. Loading dims the field; error approaches opaque black and keeps recovery actions inside the viewport.

### Tool and Slice Controls

- **Toolbar Buttons:** 6px radius, transparent at rest, Muted foreground, and a 44px minimum target. Window/level and pan are mutually exclusive drag modes; hover uses Soft Equipment Grey, while selected or pressed state uses Cobalt Wash, a pale cobalt border, and Pressed Cobalt foreground.
- **Slice Range:** Native range control spans the panel width and uses the cobalt accent.
- **Previous / Next:** Equal-width 44px icon controls with a Hairline border and the same secondary hover behavior.
- **Responsive:** Text labels disappear below 1120px except for the wide active tool; all tool labels disappear on narrow mobile layouts.

### Metadata Readout

- **Structure:** Stacked definition rows separated from controls by one Hairline top rule.
- **Grid:** Fixed 74px keys and a flexible value column, with tabular numerals and ellipsis for long values.
- **Tone:** Keys remain Muted; values use compact, slightly stronger Graphite text.

### Privacy Accordion

- **Structure:** Full-width disclosure rows between Strong Rules, with no enclosing card.
- **Typography:** `clamp(1rem, 1.5vw, 1.2rem)` at weight 550.
- **Motion:** Chevron rotation and grid-row expansion use the shared `cubic-bezier(0.2, 0.8, 0.2, 1)` curve; only one row remains expanded.

### Feedback

- **Toast:** Fixed to the lower-right edge, 8px radius, dark graphite fill, light text, one dark rule, and restrained transient lift.
- **Focus:** A consistent cobalt outline is the only global focus treatment.
- **Motion Safety:** Reduced-motion preference collapses all transitions and animations to `0.01ms`; content remains visible if GSAP is absent.

## Do's and Don'ts

### Do:

- **Do** keep controls physically attached to the image field so the interface reads as one instrument.
- **Do** reserve cobalt for primary action, selection, focus, and active operational state.
- **Do** use one-pixel rules and contrast before adding depth.
- **Do** preserve 44px minimum interactive targets and the reduced-motion path.
- **Do** let the black viewport remain the dominant visual mass whenever an image can be inspected.

### Don't:

- **Don't** turn tool groups, metadata, or privacy disclosures into separate floating cards.
- **Don't** add gradients, decorative glass, or independent shadows to internal modules.
- **Don't** introduce a second decorative accent or use Clear-Session Red outside destructive state.
- **Don't** replace Outfit with an editorial display pairing or all-caps dashboard typography.
- **Don't** soften the instrument into oversized pills; reserve the full pill for the optical aperture.
