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
  tape: "rgb(222 213 187 / 75%)"
  page-edge: "#aaa79f"
  ruled-line: "#8a877e"
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
  circle: "9999px"
spacing:
  half: "10px"
  "1": "20px"
  "2": "40px"
  "3": "60px"
  "4": "80px"
  "6": "120px"
  measure: "70ch"
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
    height: "48px"
  link-hover:
    textColor: "{colors.ink-deep}"
  evidence-item:
    textColor: "{colors.graphite}"
    typography: "{typography.small}"
  evidence-item-pending:
    textColor: "{colors.graphite-soft}"
    typography: "{typography.small}"
  evidence-highlight:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.graphite}"
    padding: "3px 4px"
  evidence-reference:
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.circle}"
    size: "28px"
  margin-note:
    textColor: "{colors.graphite-soft}"
    typography: "{typography.small}"
  taped-screenshot:
    backgroundColor: "{colors.print}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "10px"
  ink-annotation:
    textColor: "{colors.ink}"
    typography: "{typography.annotation}"
  ink-diagram-node:
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  notebook-spread:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    width: "min(100%, 1280px)"
  notebook-page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "60px 30px 40px 60px"
  nav:
    backgroundColor: "{colors.desk}"
    textColor: "{colors.graphite}"
    height: "80px"
    padding: "0 20px"
  nav-link:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    height: "44px"
  nav-link-active:
    textColor: "{colors.ink}"
  mobile-menu:
    backgroundColor: "{colors.desk}"
    textColor: "{colors.graphite}"
    padding: "0 20px 20px"
  input:
    backgroundColor: "{colors.print}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "10px"
    height: "48px"
---

# Design System: Imanol Antonio De la Cruz — Portafolio

## Overview

**Creative North Star: "The Open Engineering Notebook"**

The site is a quad-ruled notebook lying open on a desk. Warm paper carries a 5 mm (20 px) blue grid and one red margin rule; the author writes over it in Bic-blue ink: a circle around the word that matters, ticks beside verified facts, arrows from a screenshot to what it proves, a pen underline under a secondary action, hand-drawn boxes for an architecture diagram, and circled numbers that tie a claim to its evidence. Real screenshots are printed and taped in, never floated in glass. Set text is graphite in one sturdy grotesk; the hand shows only in strokes, never in a handwriting font.

Density is a working notebook, not a magazine: content sits on the grid, prose keeps a measured line, and every mark carries information. State is written, not lit: ✓ verified, ○ pending, struck through = unavailable. Depth comes only from overlap: tape over a print, a print over the page, a page over the desk. Empty space is never filled with decoration: when a column would be empty, already-published content moves into the margin or the page narrows. The world refuses the dark-neon developer portfolio entirely: no graphite-and-lime HUD, no mono kicker labels, no glass, no glow.

The notebook is professional first. Personality lives in the precision of the marks and the honesty of the annotations (synthetic data labelled as synthetic, pending dates marked pending), not in decoration. Motion is the pen arriving once, at the top of the page, and nowhere else.

**Key Characteristics:**
- Warm paper on a slightly darker desk, a 20 px blue quad grid, one red margin rule per page.
- Bic-blue ink is the only accent that acts: buttons, links, marks, annotations, diagram boxes, evidence numbers.
- One highlighter swipe per page, on the strongest single piece of evidence.
- Main text at most 70 characters per line.
- Square everything except the evidence-number circle. Slight hand-placed rotation on prints (+1°) and the primary button (−1°).
- Depth by overlap only; no blurred shadows.
- Irregular SVG ink strokes that draw once in the hero and are simply present everywhere else.

## Colors

Paper, graphite and one blue ink, with a red margin and a yellow highlighter used as sparingly as they would be in a real notebook.

### Primary
- **Bic Ink** (#1f3a93): the author's pen. Primary button fill, links, circles, ticks, ○ marks, arrows, ink annotations, diagram boxes, evidence-number circles, the spine stitches, active nav. 9.31:1 on paper, 7.85:1 on desk.
- **Pressed Ink** (#162a6e): hover state of ink fills and links, and the focus ring. 12.2:1 on paper.

### Secondary
- **Margin Red** (#d2453b): the single 2 px vertical margin rule on each page. Decorative only (4.17:1 on paper); never used for text, buttons or state.
- **Highlighter** (#e6f54a): one flat swipe behind the strongest evidence on a page. Graphite on highlighter is 13.12:1.

### Neutral
- **Desk** (#e6e3da): the surface the notebook rests on; page background outside the paper, behind the nav and the mobile menu.
- **Notebook Paper** (#f7f6f1): page surface that carries the grid.
- **Print White** (#ffffff): the border of taped screenshots and the fill of form fields.
- **Quad Grid Blue** (#cfdce8): the 1 px grid lines at 20 px pitch, and the hairline above each stack entry. Texture only (1.29:1 on paper, by design).
- **Graphite** (#232323): all set text. 14.52:1 on paper, 12.25:1 on desk, 15.72:1 on print white.
- **Soft Graphite** (#56544d): secondary prose, captions, margin notes, pending evidence. 7.0:1 on paper, 5.91:1 on desk.
- **Tape** (rgb(222 213 187 / 75%)): translucent masking tape over print edges.
- **Page Edge** (#aaa79f): the paper's outer border, the spine fold, section dividers inside a page, inline-code boxes. Decorative.
- **Ruled Line** (#8a877e): borders that separate regions or bound a control (form fields, the header/body divide of a case, project dividers). 3.32:1 on paper.

### Status
- **Correction Red** (#a3291f): error text and invalid field borders. 6.71:1 on paper.
- **Ledger Green** (#2b6a3a): success text after a real, confirmed outcome. 6.02:1 on paper.

### Named Rules
**The One Pen Rule.** Blue ink is the only colour that marks or acts. Red belongs to the margin and to errors; it never circles, ticks or underlines.

**The One Swipe Rule.** One highlighter swipe per page, not per screen. On the home page it sits on the hero evidence only; on each case study it sits on "Mi aportación" only. A second highlight means neither is the strongest.

## Typography

**Display Font:** Schibsted Grotesk (with Helvetica Neue, Arial, sans-serif), self-hosted via next/font as `--font-schibsted`
**Body Font:** Schibsted Grotesk (same family; weights 400, 600, 700, 800 loaded)

**Character:** One sturdy, slightly editorial grotesk set in graphite, as if typed onto the page; the hand-drawn quality lives entirely in the ink strokes around it.

### Hierarchy
- **Display** (800, clamp(2.75rem → 4rem), 1.05, -0.02em): the name on the first page only, one line per name part.
- **H2** (700, clamp(1.5rem → 1.75rem), 40 px line, -0.01em): section titles on the home page and the case title and case section titles.
- **H3** (700, clamp(1.25rem → 1.375rem), 30 px line): the role statement, project names, trajectory entries, stack and form titles.
- **Body** (400, 1rem, 1.5): descriptions, case prose, diagram node labels.
- **Small** (400, 0.875rem, 20 px line): evidence lines, captions under prints, margin notes, evidence numbers.
- **Label** (700, 0.875rem, 20 px line, 0.01em, sentence case): buttons, nav links, field labels, small headings such as "Mi aportación".
- **Annotation** (700, 0.9375rem, 20 px line, in Bic Ink): short ink notes beside arrows.

Headings use `text-wrap: balance`; prose uses `text-wrap: pretty`. Both break long words rather than overflow.

### Named Rules
**The Set Type Rule.** Text is always set in Schibsted Grotesk. No handwriting, script or "marker" fonts, ever; the hand is the strokes.

**The Measured Reading Rule.** Main text stays at ≤ 70 characters per line (`max-width: 70ch` on profile prose, 65ch on project and case prose, 450 px for the hero description).

**The Grid Line Rule.** Headings, small text, labels and component heights snap to the 20 px grid (40 px, 30 px, 20 px lines). Body prose keeps 1.5 for readability and does not chase grid lines; blocks re-align through their margins.

## Layout

The page is a desk with paper on it. Every section is a sheet: 1 px Page Edge border, Notebook Paper with the 20 px grid, one 2 px Margin Red rule near its left edge. The content container is at most 1280 px with a 20 px gutter; the fixed nav is 80 px and anchors compensate with `scroll-padding-top`.

**Hero spread.** From 768 px the hero is two equal pages joined by a sewn spine (18 px paper fold, Bic Ink stitches 2 px every 40 px). At ≥1280 px each page has 60 px top, 30 px right, 40 px bottom, 60 px left padding with the margin rule at 40 px; 768–1279 px tightens to 40 px right and 50 px left with the rule at 30 px. Below 768 px the pages stack, left page first, margin rule at 20 px, the spine replaced by an 8 px double Page Edge rule.

**Projects.** The featured project is one sheet that splits into text and taped screenshot at ≥1024 px with the spine between them; the other projects share a second sheet, each a 3fr/2fr row of text and ink diagram from 768 px, separated by Ruled Line.

**Case study.** One sheet: back link, header (title, description, "Mi aportación", technologies, actions), then "Problema y alcance" at full width. A two-page spread opens at ≥1280 px for the claim/evidence pairs (Arquitectura beside its diagram or capture, Decisiones beside the next piece of evidence) with the spine down the middle and an 80 px gap, and closes after the evidence. Validación and Límites run on a single reading page, followed by previous/next links and the contact block. Below 1280 px everything is one column in reading order.

**Margin notes.** Where a two-column page would leave the right column empty, already-published content moves to the margin. Trajectory (≥1024 px) is a 2fr/1fr grid: entry title and description on the left, the ✓/○ mark, dates and place/modality as a right-margin note aligned with each entry. Contact (≥1024 px) has its heading and text on the left and the action block (Escríbeme, copy email, CV, GitHub, LinkedIn) on the right. A page with no marginal content (Cómo trabajo + stack) uses a narrower centred measure (70ch) instead of leaving empty grid. Below 1024 px margin notes sit above their entry.

Spacing is a multiple of the 20 px cell with 10 px half-steps. Test at 360, 390, 768, 1024 and 1280+.

**The Cell Rule.** If a measurement is not a multiple of 10 px, it is wrong unless it is a 1–2 px stroke, a 44/48 px touch target or a text measure in ch.

**The Empty Space Rule.** «El espacio vacío no se rellena con decoración. Si una columna queda vacía, se reacomoda contenido ya publicado (notas al margen) o se angosta el layout. Las relaciones entre elementos se marcan con referencias numeradas legibles, no con flechas que dependan de la posición.»

## Elevation & Depth

Flat by construction. There are no blurred drop shadows anywhere. Depth is physical overlap: tape (translucent, ±6° on the hero print, −2° on case captures) overlaps a print, a print (white, 1 px graphite edge, +1°) sits on the paper, the paper sits on the desk with a 1 px Page Edge border. The spine fold is the one shaded surface, a narrow paper-to-page-edge gradient that reads as a crease, not as elevation. The nav and mobile menu are opaque Desk, never glass.

### Named Rules
**The Overlap Rule.** If something must look raised, put it on top of something else. Never add box-shadow, glow, blur or backdrop-filter.

## Shapes

Square paper geometry: paper, prints, tape, buttons, fields and diagram boxes have 0 px radius. The single exception is the evidence-number circle, a true circle because it is a numbered pen ring, not a container. Organic form comes from the SVG ink strokes: an irregular ellipse, curved arrows, ticks, ○ marks, wavering underlines and hand-drawn diagram boxes, 2–2.5 px stroke, round caps and joins, `vector-effect: non-scaling-stroke` where the box stretches. Small rotations (primary button −1°, hero print +1°, tape ±6°) give a hand-placed feel; text blocks are never rotated.

## Components

### Buttons
Iconiq UI Button adapted to the notebook (`src/components/ui/b-button.tsx`), ripple off.
- **Shape:** square (0 px), at least 48 px tall.
- **Primary:** Bic Ink fill, Print White label, 20 px horizontal padding, rotated −1°. One per view, for the main action.
- **Secondary (pen underline):** no fill, graphite label, 2 px Bic Ink bottom border, no horizontal padding.
- **Hover:** colour only (primary deepens to Pressed Ink, secondary label shifts to Bic Ink), gated to `(hover: hover) and (pointer: fine)`. There is no hover lift.
- **Press:** scale 0.97, 120 ms in / 160 ms out on `--ease-out-ui` (cubic-bezier(0.23, 1, 0.32, 1)), composed with the primary's −1° rotation. Off under reduced motion.
- **Focus:** 3 px Pressed Ink outline, 4 px offset (shared ring).
- **Disabled:** a sticker not yet stuck down: paper fill, 2 px dashed Ruled Line border, Graphite Soft label (7:1), no tilt. Never lowered opacity.
- **Loading:** keeps the Pressed Ink fill and the tilt, adds a 14 px ring spinner and a shorter label in the same width (`SwapLabel`), `aria-busy` and `aria-disabled` so focus stays on the button.
- **Implementation:** `NotebookButton` (`src/components/ui/notebook-button.tsx`) renders the same classes on `<a>` and `<button>`; tilt is the `rotate` property and press the `scale` property, so they compose.
- **Arrows:** directional cues (↗ external, ↓ download, → in the primary) are 16 px drawn SVG strokes, not font glyphs.

### Links
Inline and standalone links are Bic Ink, 700, underlined with a 4 px offset, 48 px hit area when standalone; hover moves to Pressed Ink. Focus uses the shared ring.

### Evidence list (hero)
Small text with a 20 px ink mark beside each item:
- **Verified:** a drawn ✓; graphite text.
- **Pending:** a drawn ○; soft graphite text with the reason in words.
The "Verificado:"/"En curso:" prefixes are `sr-only`; the mark carries the state visually and the first visible letter is capitalised via CSS. The page's single highlighter swipe sits on the first verified item.

### Evidence reference
`src/components/projects/evidence-reference.tsx`. A 28 px circle with a 2 px Bic Ink ring and a bold small-type number inside: the number sits before a claim on the left page and the same number sits beside the evidence (a capture caption or a diagram step) on the right page. Pair only when the evidence visibly shows the claim, at most 3 per case. The number is real text, works at 390 px, and depends on neither colour nor position.

### Taped screenshot
A real screenshot printed on a white sheet. Hero: 10 px white border, 1 px graphite edge, +1° rotation, two 84 × 24 px tape strips (±6°) over the top corners, caption inside the print. Case and project captures: white sheet, 1 px Page Edge image border, one centred tape strip. Every caption labels synthetic data as synthetic.

### Ink annotation
A short note in annotation type, in Bic Ink, led by a 40 × 20 px drawn arrow (2.5 px stroke). Annotations state facts from the repository, never marketing.

### Ink diagram
A vertical flow of hand-drawn SVG boxes (`pathLength=1`, 2.2 px Bic Ink, non-scaling stroke, 0 radius) holding body-type labels, joined by drawn down arrows; a label-type caption names the direction ("Diagrama · Cliente a almacenamiento"). The figure carries an accessible description.

### Margin note
Small type in Soft Graphite, led by the 20 px ✓/○ ink mark, holding the dates, place and modality of a trajectory entry. "Completado"/"En curso" are `sr-only`.

### Notebook spread and page
- **Spread:** two pages, 1 px Page Edge border, centre spine fold with blue stitches; stacks to one page below the breakpoint.
- **Page:** paper with the 20 px quad grid and one 2 px red margin rule; content begins right of the margin.

### Navigation
Fixed on the desk above the paper: 80 px tall, the name at 800 on the left. At ≥1024 px, label-weight links with 40 px gaps sit in the centre and the ES | EN switch on the right; the current section (IntersectionObserver) and hover get a wavering 2 px Bic Ink SVG underline and Bic Ink text, the current language is Bic Ink underlined. Below 1024 px a 44 px menu button (two lines that cross into an ×) opens a Desk panel under the bar with the links stacked; the panel traps focus, closes on Escape and returns focus to the button, and fades and slides with opacity + translateY(−8px): 200 ms open, 150 ms close, on `--ease-out-ui`; under reduced motion it only fades. Without JavaScript the links render as a wrapping row. The language switch keeps the equivalent page.

### Contact
Text on the left, the action block on the right: primary "Escríbeme" (mailto), copy-email button with a polite status, the address in body text, then the CV pen-underline button and GitHub/LinkedIn links. The form renders below the contact block only when a provider is configured, and never leaves an empty slot.

### Inputs (when the contact form appears)
Square Print White field, 1 px Ruled Line border, 48 px minimum height, 10 px padding, persistent label in label type above, focus by the shared ring; errors as Correction Red text tied to the field with aria-describedby and a Correction Red border.

## Do's and Don'ts

### Do:
- **Do** keep spacing on the 20 px cell (10 px half-steps), except 1–2 px strokes, 44/48 px touch targets and ch measures.
- **Do** keep main text at ≤ 70 characters per line.
- **Do** draw every mark (circle, tick, ○, arrow, strike, underline, diagram box) as an irregular SVG stroke in Bic Ink (#1f3a93).
- **Do** let the ink draw (500 ms `--ease-ink`, 80 ms stagger) only in the hero; diagrams and every other mark are static (a server-rendered stroke that re-hides on hydration to animate flashes).
- **Do** sweep the highlighter with background-size and `box-decoration-break: clone` (400 ms `--ease-highlighter`).
- **Do** handle reduced motion per component (marks fully drawn, highlighter fully shown, no press scale, menu fade only); there is no global kill.
- **Do** gate hover styles to `(hover: hover) and (pointer: fine)`.
- **Do** mark state with ✓ verified, ○ pending, struck = unavailable, with the words available to assistive tech.
- **Do** move already-published content into the margin, or narrow the page, when a column would otherwise be empty.
- **Do** tie a claim to its evidence with a numbered evidence reference, at most 3 per case.
- **Do** label synthetic data as synthetic on every taped screenshot.
- **Do** create depth by overlap: tape over print over paper over desk.

### Don't:
- **Don't** use more than one highlighter swipe per page.
- **Don't** fill empty space with decoration, or point at relationships with arrows that depend on position.
- **Don't** animate the highlighter with clip-path; it hid wrapped lines on mobile.
- **Don't** add a hover lift or replay ink on hover.
- **Don't** render an empty form slot when no contact provider is configured.
- **Don't** use handwriting, script or marker fonts.
- **Don't** use gradient text, glass, backdrop blur, glow or blurred drop shadows.
- **Don't** use a dark or neon theme, or any part of the old graphite + lime HUD (Space Grotesk, JetBrains Mono, #101214, #C2F362).
- **Don't** use an "IA" monogram or any generated or simulated portrait; omit the portrait slot until a real photo exists.
- **Don't** show availability indicators, response-time promises or status dots.
- **Don't** invent metrics, proficiency bars, percentages or counts.
- **Don't** use red ink for marks or emphasis; red is the margin and errors only.
- **Don't** use mono or uppercase kicker/eyebrow labels above headings.
- **Don't** use font glyph icons (↗, ↓, ✓ as text) in place of drawn strokes.
