---
name: Imanol Antonio De la Cruz — Portafolio
description: The open engineering notebook where a junior backend-leaning developer reasons through real projects.
colors:
  desk: "#e6e3da"
  paper: "#f7f6f1"
  print: "#ffffff"
  grid-line: "#cfdce8"
  margin-red: "#d2453b"
  ink: "#1f3a93"
  ink-deep: "#162a6e"
  graphite: "#232323"
  graphite-soft: "#56544d"
  highlighter: "#e6f54a"
  tape: "rgba(222, 213, 187, 0.75)"
  rule: "#aaa79f"
  rule-strong: "#8a877e"
  focus: "#162a6e"
  error: "#a3291f"
  success: "#2b6a3a"
typography:
  display:
    fontFamily: "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2.75rem, 1.9rem + 3.2vw, 4rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 0.6vw, 1.75rem)"
    fontWeight: 700
    lineHeight: "2.5rem"
    letterSpacing: "-0.01em"
  h3:
    fontFamily: "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.3vw, 1.375rem)"
    fontWeight: 700
    lineHeight: "1.875rem"
    letterSpacing: "0em"
  body:
    fontFamily: "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  small:
    fontFamily: "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
    letterSpacing: "0em"
  label:
    fontFamily: "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: "1.25rem"
    letterSpacing: "0.01em"
  annotation:
    fontFamily: "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: "1.25rem"
    letterSpacing: "0em"
rounded:
  none: "0px"
spacing:
  half: "10px"
  "1": "20px"
  "2": "40px"
  "3": "60px"
  "4": "80px"
  "6": "120px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.print}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.print}"
  button-primary-active:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.print}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
    height: "48px"
  button-secondary-hover:
    textColor: "{colors.ink}"
  link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  link-hover:
    textColor: "{colors.ink-deep}"
  evidence-item:
    textColor: "{colors.graphite}"
    typography: "{typography.small}"
    padding: "0 0 0 30px"
  evidence-item-pending:
    textColor: "{colors.graphite-soft}"
    typography: "{typography.small}"
  evidence-item-unavailable:
    textColor: "{colors.graphite-soft}"
    typography: "{typography.small}"
  evidence-highlight:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.graphite}"
    padding: "2px 4px"
  taped-screenshot:
    backgroundColor: "{colors.print}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "10px"
  ink-annotation:
    textColor: "{colors.ink}"
    typography: "{typography.annotation}"
  notebook-spread:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    width: "min(100%, 1280px)"
  notebook-page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "60px 60px 40px 80px"
  nav:
    backgroundColor: "{colors.desk}"
    textColor: "{colors.graphite}"
    height: "80px"
    padding: "0 20px"
  nav-link:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    height: "44px"
---

# Design System: Imanol Antonio De la Cruz — Portafolio

## Overview

**Creative North Star: "The Open Engineering Notebook"**

The site is a quad-ruled notebook lying open on a desk. Warm paper carries a 5 mm (20 px) blue grid and one red margin rule; the author writes over it in Bic-blue ink: circles around the words that matter, ticks beside verified facts, arrows from a screenshot to what it proves, a pen underline under a secondary action. Real screenshots are printed and taped in, never floated in glass. Set text is graphite in one sturdy grotesk; the hand shows only in strokes, never in a handwriting font.

Density is a working notebook, not a magazine: content sits on the grid, margins are generous but measured in cells, and every mark carries information. State is written, not lit: ✓ verified, ○ pending, struck through = unavailable. Depth comes only from overlap: tape over a print, a print over the page, a page over the desk. The world refuses the dark-neon developer portfolio entirely: no graphite-and-lime HUD, no mono kicker labels, no glass, no glow.

The notebook is professional first. Personality lives in the precision of the marks and the honesty of the annotations (synthetic data labelled as synthetic, pending dates marked pending), not in decoration.

**Key Characteristics:**
- Warm paper on a slightly darker desk, a 20 px blue quad grid, one red margin rule per page.
- Bic-blue ink is the only accent that acts: buttons, links, marks, annotations.
- One highlighter swipe per screen, on the strongest single piece of evidence.
- Square everything: paper, prints, tape, buttons. Slight hand-placed rotation (±1°) on prints and the primary button.
- Depth by overlap only; no blurred shadows.
- Irregular SVG ink strokes that draw themselves once, and are simply present under reduced motion.

## Colors

Paper, graphite and one blue ink, with a red margin and a yellow highlighter used as sparingly as they would be in a real notebook.

### Primary
- **Bic Ink** (#1f3a93): the author's pen. Primary button fill, links, circles, ticks, arrows, ink annotations, the spine stitches. 9.31:1 on paper, 7.85:1 on desk, 7.22:1 on a grid line.
- **Pressed Ink** (#162a6e): hover and pressed state of ink fills and links, and the focus ring. 12.2:1 on paper.

### Secondary
- **Margin Red** (#d2453b): the single 2 px vertical margin rule on each page. Decorative only (4.17:1 on paper); never used for text, buttons or state.
- **Highlighter** (#e6f54a): one flat swipe behind the strongest evidence per screen. Graphite on highlighter is 13.12:1.

### Neutral
- **Desk** (#e6e3da): the surface the notebook rests on; page background outside the spread and behind the nav.
- **Notebook Paper** (#f7f6f1): page surface that carries the grid.
- **Print White** (#ffffff): the border of taped screenshots, so a print reads as a separate sheet on the paper.
- **Quad Grid Blue** (#cfdce8): the 1 px grid lines at 20 px pitch. Background texture only (1.29:1 on paper, by design).
- **Graphite** (#232323): all set text. 14.52:1 on paper, 12.25:1 on desk, 15.72:1 on print white.
- **Soft Graphite** (#56544d): secondary text, captions, pending and unavailable evidence. 7.0:1 on paper, 5.91:1 on desk, 5.43:1 on a grid line.
- **Tape** (rgba(222, 213, 187, 0.75)): translucent masking tape over print corners.
- **Page Edge** (#aaa79f): the notebook's outer edge, page divisions and the spine fold. Decorative.
- **Ruled Line** (#8a877e): any border that must be perceived as a control boundary (form fields, dividers that separate interactive regions). 3.32:1 on paper.

### Status
- **Correction Red** (#a3291f): error text and error marks. 6.71:1 on paper, 5.65:1 on desk.
- **Ledger Green** (#2b6a3a): success text after a real, confirmed outcome. 6.02:1 on paper, 5.07:1 on desk.

### Named Rules
**The One Pen Rule.** Blue ink is the only colour that marks or acts. Red belongs to the margin and to errors; it never circles, ticks or underlines.

**The One Swipe Rule.** At most one highlighter swipe is visible per screen, on the single strongest piece of evidence. A second highlight means neither is the strongest.

## Typography

**Display Font:** Schibsted Grotesk (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Schibsted Grotesk (same family; weights 400, 600, 700, 800 are loaded)

**Character:** One sturdy, slightly editorial grotesk set in graphite, as if typed onto the page; the hand-drawn quality lives entirely in the ink strokes around it.

### Hierarchy
- **Display** (800, clamp(2.75rem → 4rem), 1.05, -0.02em): the name on the first page only, one line per name part.
- **H2** (700, clamp(1.5rem → 1.75rem), 40 px line, -0.01em): page and section titles ("PWA UTT", "Proyectos seleccionados").
- **H3** (700, clamp(1.25rem → 1.375rem), 30 px line): role statement and sub-headings inside a page.
- **Body** (400, 1rem, 1.5): descriptions and case prose, max 60ch.
- **Small** (400, 0.875rem, 20 px line): evidence lines, captions under prints, sub-titles.
- **Label** (700, 0.875rem, 20 px line, 0.01em, sentence case): buttons, nav links, inline actions.
- **Annotation** (700, 0.9375rem, 20 px line, in Bic Ink): short ink notes beside arrows.

### Named Rules
**The Set Type Rule.** Text is always set in Schibsted Grotesk. No handwriting, script or "marker" fonts, ever; the hand is the strokes.

**The Grid Line Rule.** Headings, small text, labels and component heights snap to the 20 px grid (40 px, 30 px half-steps, 20 px). Body prose keeps 1.5 for readability and does not chase grid lines; blocks re-align through their margins.

## Layout

The page is a desk with an open notebook on it. On wide screens (≥1280 px) the spread is two equal pages (max 1280 px) joined by a sewn spine: a soft paper fold down the centre and short blue stitches every 40 px. Each page is a grid sheet with the red margin rule 40 px from its left edge and content starting at 80 px; page padding is 60 px top, 60 px right, 40 px bottom. All spacing is a multiple of the 20 px cell (10 px half-steps inside components).

Between 768 and 1279 px the spread keeps two pages with tightened padding (40 px sides, margin rule at 30 px). Below 768 px the notebook closes to a single stacked page: margins 10 px from the desk edge, margin rule at 20 px, content at 40 px, the spine replaced by a double page-edge rule between the stacked pages, and the nav links scroll horizontally. Test at 360, 390, 768 and 1280+.

**The Cell Rule.** If a measurement is not a multiple of 10 px, it is wrong unless it is a 1–2 px stroke or a 48 px touch target.

## Elevation & Depth

Flat by construction. There are no blurred drop shadows anywhere. Depth is physical overlap: tape (translucent, ±6°) overlaps a print, a print (white, 1 px graphite edge, +1°) sits on the paper, the paper sits on the desk with a 1 px page edge. The spine fold is the one shaded surface, a narrow paper-tone gradient that reads as a crease, not as elevation.

### Named Rules
**The Overlap Rule.** If something must look raised, put it on top of something else. Never add box-shadow, glow, blur or backdrop-filter.

## Shapes

Square paper geometry: every surface has 0 px radius, including buttons, prints, tape and fields. Organic form comes only from the SVG ink strokes (irregular ellipses, curved arrows, ticks, wavering underlines, 2–2.5 px stroke, round caps). Small rotations (primary button −1°, prints +1°, tape ±6°) give a hand-placed feel; text blocks are never rotated.

## Components

### Buttons
- **Shape:** square (0 px), 48 px tall.
- **Primary:** Bic Ink fill, print-white label text, 20 px horizontal padding, rotated −1°. One per view, for the main action.
- **Hover / Focus:** fill deepens to Pressed Ink; focus is a 3 px Pressed Ink outline offset 4 px. Press scales to 0.97 while keeping the −1° rotation.
- **Secondary (pen underline):** no fill, graphite label, a 2 px Bic Ink underline as the bottom border, 48 px tall hit area. Hover shifts the label to Bic Ink.
- **Arrows:** directional cues (↗ external, ↓ download) are drawn SVG ink arrows, not font glyphs.

### Links
- Inline links are Bic Ink, 700, underlined; hover moves to Pressed Ink. Focus uses the shared ring.

### Evidence list
The ledger of verifiable facts beside the name. Each item is small text with a 30 px gutter holding its ink mark:
- **Verified:** a drawn ✓ in Bic Ink; graphite text.
- **Pending:** a drawn ○ in Bic Ink; soft graphite text, with the reason in words ("previsto").
- **Unavailable:** text in soft graphite with a single ink strike through it, and the reason stated in words; never just a struck line.
The mark is always backed by text so state never depends on the glyph alone. The single highlighter swipe, if on this screen, sits on the strongest verified item.

### Taped screenshot
A real screenshot printed on a white sheet: 10 px white border, 1 px graphite edge, +1° rotation, two strips of tape (84 × 24 px, ±6°) over the top corners, caption in small text beneath the image inside the print. Synthetic data is labelled as synthetic in the caption.

### Ink annotation
A short note set in annotation type, in Bic Ink, led by a 40 × 20 px drawn arrow (2.5 px stroke) pointing at the fact it explains. Annotations state facts from the repository, never marketing.

### Notebook spread and page
- **Spread:** two pages, 1 px page-edge border, centre spine fold with blue stitches; collapses to one stacked page below 768 px.
- **Page:** paper with the 20 px quad grid and one 2 px red margin rule; content begins right of the margin.

### Navigation
Sits on the desk above the notebook: 80 px tall, name at 800 on the left, label-weight links on the right with 40 px gaps (20 px on mobile, horizontal scroll). Links are graphite; hover and the active section get a 2 px Bic Ink pen underline. The language switch (ES / EN) is a plain text link that keeps the equivalent page.

### Inputs (when the contact form appears)
Square, print-white field on paper, 1 px Ruled Line border, persistent label in label type above, focus by the shared ring; errors as Correction Red text tied to the field with aria-describedby.

## Do's and Don'ts

### Do:
- **Do** keep every measurement on the 20 px cell (10 px half-steps), except 1–2 px strokes and 48 px touch targets.
- **Do** draw every mark (circle, tick, ○, arrow, strike, underline) as an irregular SVG stroke in Bic Ink (#1f3a93).
- **Do** let ink marks draw once on entry (500 ms ease-out, 80 ms stagger) and render them fully drawn under reduced motion.
- **Do** mark state with ✓ verified, ○ pending, struck = unavailable, always with words beside the mark.
- **Do** label synthetic data as synthetic on every taped screenshot.
- **Do** create depth by overlap: tape over print over paper over desk.

### Don't:
- **Don't** use handwriting, script or marker fonts.
- **Don't** use gradient text, glass, backdrop blur, glow or blurred drop shadows.
- **Don't** use a dark or neon theme, or any part of the old graphite + lime HUD (Space Grotesk, JetBrains Mono, #101214, #C2F362).
- **Don't** use more than one highlighter swipe per screen.
- **Don't** use an "IA" monogram or any generated or simulated portrait; omit the portrait slot until a real photo exists.
- **Don't** show availability indicators, response-time promises or status dots.
- **Don't** invent metrics, proficiency bars, percentages or counts.
- **Don't** use red ink for marks or emphasis; red is the margin and errors only.
- **Don't** use mono or uppercase kicker/eyebrow labels above headings.
- **Don't** use font glyph icons (↗, ↓, ✓ as text) in place of drawn strokes.
