# Critique: Assessment B, after the redesign (Detector + Browser Evidence)

Date: 2026-11-17. Target: dev server http://localhost:3100 (`/es`, `/en`, `/es/proyectos/pwa-utt`), serving `main` at 25c77d5 (notebook / paper redesign). Source scanned: `src/app`, `src/components`.
Method: impeccable CLI (file and URL modes) plus headless Chromium scripts through Playwright. No native browser tool was available, so every page ran in a fresh context. No project source was edited. `git status` was unchanged before and after, apart from `critique-A-after.md`, which a sibling run added and I did not read.
Evidence (scripts, JSON, screenshots): `/tmp/claude-1000/-home-dragodeidad-Documents-portafolio/83e24e5e-c945-4d92-8d26-77714e609aeb/scratchpad/critiqueB2/`

## 1. CLI scan (source files)

`impeccable detect --json src/app src/components` returned **exit 0 with `[]`: no findings and no advisories.** A rerun with `--no-config` returned the same. No `impeccable-disable` comments exist in `src`, and `.impeccable/critique/ignore.md` does not exist, so nothing was suppressed.

## 2. URL scans (`impeccable detect --json --viewport WxH <url>`)

| Page                  | 1440x900                        | 390x844             |
| --------------------- | ------------------------------- | ------------------- |
| /es                   | exit 2: 2 warnings + 1 advisory | exit 2: 2 warnings  |
| /en                   | exit 2: 2 warnings + 1 advisory | exit 2: 2 warnings  |
| /es/proyectos/pwa-utt | exit 2: 1 warning               | exit 2: 1 warning   |

A rerun of `/es` at 1440 with `--no-config` gave the same 3 findings, so DESIGN.md and design.json suppress nothing.

Rules and where they come from in the source:

- **cream-palette** (warning, all 6 scans). It flags the cream/beige page background `rgb(230,227,218)`, the `--desk: #e6e3da` token in `src/styles/tokens.css:4`, applied as the body background at `src/app/globals.css:11` and `:17`.
- **cramped-padding** (warning, home pages at both widths). Selector `span.hero-module__…highlight`: the text has only 3px above and below it, where the rule wants at least 4.2px for 14px text. Source: the first hero evidence item, `src/components/hero/hero.tsx:133`, styled by `.highlight` in `src/components/hero/hero.module.css` (the highlighter background, no padding).
- **repeating-stripes-gradient** (advisory, home at 1440 only). The URL scan reports it as `body`, but the real source is the dashed binding stitch `.spine::after` at `src/components/hero/hero.module.css:38` (a `repeating-linear-gradient`). The spine is `display:none` below 768px, so it does not fire at 390.

## 3. Browser overlay (live-server + detect.js)

- **Preflight mutation passed on all 6 page/width runs.** Each run set `document.title = "[Human] …"` and an appended `<script>` executed.
- **Injection.** I ran `impeccable live-server --background` (pid 260687, port 8400) and injected `http://localhost:8400/detect.js` with Playwright `addScriptTag` after scrolling to the top, then waited 3 seconds. The overlay rendered 3, 3, 3, 3, 1 and 1 overlay elements.
- **`[impeccable]` console output.** It matches the URL scans exactly:
  - /es and /en at 1440: "2 anti-patterns found": cramped-padding and cream-palette, plus repeating-stripes-gradient as an advisory.
  - /es and /en at 390: "2 anti-patterns found": cramped-padding and cream-palette.
  - Case page at 1440 and 390: "1 anti-pattern found": cream-palette.
- **Stop.** I stopped the server with `impeccable live-server stop --keep-inject`, which printed "Stopped live server on port 8400". `/health` no longer answers, and nothing is listening on 8400. No injection reached the project files.

## 4. Extra browser checks

### Contrast (WCAG ratio; every visible text node, grouped by foreground/background pair)

**Every text pair passes AA on all three pages.** Where text sits on the 20px paper grid, I also measured the text colour against the grid-line colour `#cfdce8`, the worst case where a line passes under a glyph.

| Surface               | Text pair                                 | Ratio (on grid line) | Lowest size     |
| --------------------- | ----------------------------------------- | -------------------- | --------------- |
| desk `#e6e3da`        | graphite-soft `#56544d` (footer ©)        | 5.91                 | 14px            |
| desk                  | ink `#1f3a93` (active locale ES/EN)       | 7.85                 | 14px bold       |
| desk                  | graphite `#232323` (nav, section h2)      | 12.25                | 14px            |
| paper `#f7f6f1`       | graphite-soft (secondary copy, captions)  | 7.00 (5.43)          | 14px            |
| paper                 | ink (hero notes, back link, labels)       | 9.31 (7.22)          | 14px bold       |
| paper                 | graphite (body, headings)                 | 14.52 (11.27)        | 14px            |
| print `#fff`          | graphite-soft (figcaptions)               | 7.58 (5.43)          | 14px            |
| print                 | graphite (diagram nodes)                  | 15.72                | 16px            |
| highlighter `#e6f54a` | graphite (hero evidence item 1)           | 13.12                | 14px            |
| ink button `#1f3a93`  | white (primary CTA, skip link)            | 10.07                | 16px bold       |
| ink-deep `#162a6e`    | white (primary CTA on hover; measured)    | 13.20                | 16px bold       |

Non-text contrast (my notes; none of these is a text failure):

- **Card borders.** `--page-edge #aaa79f` measures 2.22:1 on paper and 1.87:1 on desk. Project cards and the case-page previous/next cards use this border. Their text labels identify them, so 1.4.11 is not strictly triggered. A form input using this border would fail, but no form renders (see the limits section).
- **Outline-CTA underline.** The ink underline on paper measures 9.31:1. It is fine.
- **Decorative colours.** Margin red `#d2453b` on paper measures 4.17:1 and the highlighter on paper 1.11:1. Both are decorative only.

### Focus visibility (keyboard Tab from the top, 1440 and 390, all three pages)

**Every Tab stop shows the same indicator:**

- a `3px solid #162a6e` outline at a 4px offset, with `:focus-visible` true;
- 10.29:1 against desk and 12.2:1 against paper;
- no box-shadow rings and no transition delay, so the indicator appears immediately.

Tab order at 1440 on `/es`, read in absolute page coordinates after letting smooth scroll settle (700ms per stop), follows the DOM and the visual order:

- skip link, brand, the 4 nav links, ES, EN
- hero: Ver proyectos, Descargar CV, Contactar
- projects: Ver caso x3
- contact: Escríbeme, Copiar correo, Descargar CV, GitHub, LinkedIn
- footer: GitHub, LinkedIn

At 390 the order is the same, except the menu toggle replaces the 4 nav links. Every stop scrolled into view.

- **Ink (primary) button.** The ring is ink-deep on paper with a 4px paper gap, so it reads clearly against the ink fill. Compare `ink-btn-focus.png` with `ink-btn-rest.png`. **The previous weak lime-on-lime ring is gone.**
- **Outline buttons** ("Contactar", "Descargar CV"): the ring is clear (`outline-btn-focus.png`).
- **Case page.** "Volver a proyectos", "Abrir aplicación", "Ver código", the previous/next cards, "Escríbeme" and "Más formas de contacto" all show the same outline.
- **No weak indicator was found.** One small note: the outline colour `#162a6e` against the adjacent ink fill `#1f3a93` is only 1.31:1. The 4px paper offset carries the indicator, so it must not be reduced to 0.
- The final Tab stop, `nextjs-portal`, is the dev-only Next.js overlay and does not exist in production.

### Horizontal overflow

`scrollWidth === innerWidth` on all three pages at **390 (390/390)** and **360 (360/360)**. There is no overflow and no offending elements.

### Console errors

- **No JS errors, no `pageerror`, and no 4xx/5xx responses** on any page or width.
- **`requestfailed /api/contact/config net::ERR_ABORTED`** on every page. This is the dev StrictMode double-mount aborting the first fetch, the same as in the previous run.
- **One `_next/image … ERR_ABORTED`** at 390 on /es. This is a srcset candidate being cancelled, which is benign.
- **Next.js dev warning on the case page at 390 and 360:** `nueva-inspeccion-1544.webp` was detected as LCP without `loading="eager"` (`src/components/projects/project-screenshots.tsx:46`). It only appeared in runs that took a full-page screenshot, which resizes the viewport. It is probably an artefact, because that image sits far below the fold at 390, but it is worth a production Lighthouse check.

### Heading outline

- **/es and /en:**
  - h1 "Imanol Antonio De la Cruz"
  - h2 "PWA UTT" (the hero's right-hand page)
  - h2 Proyectos y decisiones, with h3 x3
  - h2 Formación y experiencia, with h3 x3
  - h2 Cómo trabajo, with h3 x1
  - h2 Hablemos de una oportunidad

  There are **no skipped levels and exactly one h1.**
  - **Resolved since the previous run:** the duplicate h3 "Universidad Tecnológica de Tehuacán". The three h3s now have distinct text.
  - **Note:** the hero's h2 "PWA UTT" appears in a headings list as a top-level section before "Proyectos". It is semantically valid, but a little odd.
- **Case page:** h1, then 8 h2s. No skips. The h2s ("Mi aportación", etc.) render at 14px/700, the same as label text, so the visual hierarchy is flatter than the semantic one. This is for Assessment A to judge.

### Images and alt text

- **Missing alt: none.**
  - Home: 2 `<img>`, the hero print and the featured "Sincronización" screenshot, both with alt text.
  - Case page: 3 `<img>`, all with alt text.
- No unlabeled `svg[role=img]` and no unhidden unlabeled SVGs. The diagram `<figure>`s carry descriptive `aria-label`s.
- No `<canvas>` (GlassObject is still behind its env flag).
- **Minor: screenshot alt text repeats its figcaption** (alt "Sincronización", caption "Sincronización · Captura con datos sintéticos"), so screen readers hear it twice, and the alt names the screen without describing it. Source: `project-screenshots.tsx:50`.

### Touch targets at 390

**No interactive element is under 44px on any of the three pages** (28 interactive elements on home, 22 on the case page).

- Locale links ES/EN: 44x44
- Menu toggle: 44x44
- Brand link: 163x44
- Hero CTAs: 51 / 48 / 48 tall
- "Ver caso" and "Copiar correo": 48 tall
- Footer GitHub/LinkedIn: 48 tall
- Open-menu items: 44 tall

### Reduced motion (`reducedMotion: 'reduce'`, 1440, after scrolling the whole page)

**Every ink mark is fully drawn and visible.**

| Mark | Animation | Dash | Offset | Length | Visible |
| --- | --- | --- | --- | --- | --- |
| Hero circle around "backend" (`.draw`) | `none` | 250 | 0 | 214 | 100% |
| Hero note arrows x3 (`.noteDraw`) | `none` | 80 | 0 | 50.1 | 100% |
| Case-page evidence arrows x3 (`.inkStroke`) | `none` | 1 | 0 | `pathLength=1` | 100% |

- **Highlighter span:** `animation: none` and `clip-path: none`, with its background `#e6f54a` present.
- `document.getAnimations()` is empty on every page.
- Screenshots `reduced_es-1440.png`, `reduced_es-390.png` and `reduced_case-evidence.png` confirm the circle, arrows, highlighter and diagram arrows are all drawn.
- Without reduced motion, the end state is identical after the animations finish: dashoffset 0 and the same dash lengths.
- **Fragility note.** The hero dash lengths are hard-coded: 250 against a path length of 214, and 80 against 50.1. Only the case-page arrows use `pathLength`. If someone redraws the circle path longer than 250 user units, it would render truncated, both in reduced motion and at rest.
- **Note.** The case-page arrows animate on load (`[data-ink-draw]` is static), not when scrolled into view. The evidence block is below the fold, so the draw has usually finished before anyone sees it.

### Mobile menu (390, all three pages)

- **Closed:** `aria-expanded="false"`, `aria-label="Abrir menú"` / "Open menu", `aria-controls="mobile-navigation"`. The panel is `visibility:hidden` and `inert`, so its links are not reachable by Tab.
- **Open (Enter on the toggle):** `aria-expanded="true"` and the label changes to "Cerrar menú" / "Close menu". Focus stays on the toggle, and the next Tabs move through Proyectos, Trayectoria, Sobre mí and Contacto, each 44 tall with a visible outline.
- **Escape,** pressed with focus on the last menu link, closes the menu (`aria-expanded="false"`) and **returns focus to the toggle**, with `:focus-visible` true.
- **Clicking a menu link** closes the menu and navigates. From the case page it goes to `/es#proyectos`.
- **Toggling twice** returns the menu to closed.
- Observation: there is no scrim, and the open panel overlays the hero without locking scroll (`menu_es-390.png`). This is acceptable for a disclosure nav.

## 5. Comparison with the previous run (`critique-B.md`)

| Rule (previous)                       | Then                                          | Now                           |
| ------------------------------------- | --------------------------------------------- | ----------------------------- |
| codex-grid-background (advisory)      | CLI + home URL (`hero.module.css:10`)         | **Gone**                      |
| kicker-above-heading (warning)        | 5 per home page, both widths                  | **Gone**                      |
| line-length (warning)                 | trajectory text (~119 ch); case page (~86 ch) | **Gone** on all pages         |
| hero-eyebrow-chip (warning)           | case page at 1440                             | **Gone**                      |

**New rules:**

- **cream-palette** (warning, on every page and width). This is the redesign's desk colour, and it is the only finding on the case page.
- **cramped-padding** (warning, home pages). It is the highlighter span in the hero.
- **repeating-stripes-gradient** (advisory, home at 1440). It is the stitched notebook spine.

The source CLI went from 1 advisory to fully clean. Detector findings went from **13/11/2/0** (home 1440 / home 390 / case 1440 / case 390) to **3/2/1/1** per page.

The 20px paper grid (`hero.module.css` `.page`, `--paper-grid`) is still a two-axis `linear-gradient` grid, but `codex-grid-background` no longer fires on it, with or without config. The detector may simply not match this variant. The motif is no less present, and it is now the hero's main texture rather than a contained HUD panel.

**Touch targets improved: there are now none under 44px.** Before, these were all under 44px:

- locale ES/EN at 36x36
- hero CTAs at 40 tall
- brand link at 112x42

**Focus improved.** The previous lime box-shadow ring arrived after a 150ms transition and was nearly invisible on the lime primary CTA. It is replaced by one immediate `3px #162a6e` outline at a 4px offset on every stop, at 10.3 to 12.2:1. The Escape/focus-return behaviour of the mobile menu was already correct and is unchanged. The menu is now also `inert` while closed.

**Other changes:**

- **Contrast margins are lower than in the dark theme** (lowest pair 5.43:1 on a grid line, against 7.68:1 before), but every pair passes AA comfortably.
- **Overflow, console, alt text and the heading-level checks** are unchanged and clean.
- **The duplicate h3 is fixed.**
- **There is now ink animation to verify in reduced motion.** Before there were no animations at all; now every mark checks out.

## 6. False-positive judgement

- **cream-palette: true detection, but intentional.** The warm desk/paper palette is the redesign's notebook metaphor (`tokens.css`). Whether it reads as the generic "AI cream" look or as earned by the concept is a call for Assessment A and the synthesis. It is not a defect.
- **cramped-padding on the highlighter: technically true, low impact.** A highlighter stroke hugging the text is the intended look, and the 13.12:1 contrast is unaffected. Two lines of `padding-block: 2px` with `box-decoration-break: clone` would satisfy the rule if wanted.
- **repeating-stripes-gradient: false positive in spirit.** It is the 5px-wide stitch on the notebook spine, `aria-hidden`, hidden below 768px. It is not decorative stripe wallpaper. The `body` selector is misleading.
- **Console `ERR_ABORTED` entries: dev-only artefacts.**
- **LCP warning on the case page: probable artefact** of the viewport resize from the full-page screenshot.

## 7. Skipped or limited steps

- **No native browser tool in this harness.** I used Playwright headless Chromium with fresh contexts. There was no visible `[Human]` tab; the title was set only inside the headless page.
- **Contact form not rendered.** `form` is absent on every page because no provider or Turnstile key is configured. Labels, field errors, the status region, input-border contrast and the submit button's focus and loading states could not be checked. The contact section offers mailto ("Escríbeme"), "Copiar correo", CV and social links instead, and all of those were checked.
- **Contrast on the grid is an approximation.** I took the worst case as text over a solid grid line, which is stricter than reality. Hover/active states were measured only for the primary ink button.
- **Pages not visited.** I did not check `/en/proyectos/*` or the other case slugs (`secure-transfer`, `classroom-github`).
- **GlassObject/WebGL not exercised.** The env flag is off.
- **Live server is stopped.** I confirmed this with `stop --keep-inject`, a dead `/health` and no listener on 8400.
