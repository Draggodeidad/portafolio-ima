# Critique: Assessment B (Detector + Browser Evidence)

Date: 2026-11-17. Target: dev server http://localhost:3100 (`/es`, `/en`, `/es/proyectos/pwa-utt`); source `src/app`, `src/components`.
Method: impeccable CLI (file and URL modes) plus Playwright/Chromium headless scripts (no native browser tool in this harness). No project source was edited. `git status` was the same before and after.
Evidence (scripts, JSON, screenshots): `/tmp/claude-1000/-home-dragodeidad-Documents-portafolio/83e24e5e-c945-4d92-8d26-77714e609aeb/scratchpad/critiqueB/`

## 1. CLI scan (source files)

`impeccable detect --json src/app src/components` gave **exit 0 (clean)**. There was **0 counted findings and 1 advisory**. Rerunning it with `--no-config` over all of `src` gave the same result. `.impeccable/critique/ignore.md` does not exist, so nothing was suppressed.

| Rule                                                      | Severity | Location                                                                                                                                               |
| --------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `codex-grid-background` (decorative grid-line background) | advisory | `src/components/hero/hero.module.css:10` (`.frameGrid`: 28px two-axis `linear-gradient` grid; imported by hero.tsx, hud-visual.tsx, node-selector.tsx) |

## 2. URL scans (`impeccable detect --json --viewport WxH <url>`)

| Page                  | 1440x900                        | 390x844                         |
| --------------------- | ------------------------------- | ------------------------------- |
| /es                   | exit 2: 6 warnings + 1 advisory | exit 2: 5 warnings + 1 advisory |
| /en                   | exit 2: 6 warnings + 1 advisory | exit 2: 5 warnings + 1 advisory |
| /es/proyectos/pwa-utt | exit 2: 2 warnings              | exit 0 (clean)                  |

Rules, with source mapping:

- **kicker-above-heading** (warning, 5 per home page at both widths). Small mono uppercase accent kickers sit above every section h2: Proyectos/Projects, Sobre mí/About, Stack, Trayectoria/Experience, Contacto/Contact. Sources: `src/components/sections/section-heading.tsx:2` (`eyebrow`) and `src/components/projects/projects-section.tsx:16` (`eyebrow`).
- **line-length** (warning, /es and /en at 1440 only). The first trajectory item's description runs about 117–119 characters per line ("~119 chars on 2 of 3 lines", aim < 80). Selector `li.relative.grid > p.m-0.text-sm`, which maps to `src/components/sections/profile-sections.tsx:58` (`timelineDescription`, used at :203). It is not flagged at 390.
- **line-length** (warning, case page at 1440). The first `max-w-prose` paragraph runs about 86 characters per line. Source: `src/app/[locale]/proyectos/[slug]/page.tsx:52`.
- **hero-eyebrow-chip** (warning, case page at 1440 only). The tracked-caps eyebrow "Caso de estudio · Aplicación web progresiva" sits above the h1. Source: `src/app/[locale]/proyectos/[slug]/page.tsx:21`.
- **codex-grid-background** (advisory, home pages). Same finding as the CLI one. The URL scan reports the selector as `body`, but the real source is `.frameGrid` in `hero.module.css:10` (the HUD "Perfil técnico" frame).

## 3. Browser overlay (live-server + detect.js)

- Preflight mutation passed on every page and width: `document.title` was set to `[Human] …` and an appended `<script>` executed.
- I started `impeccable live-server --background` (pid 56769, port 8400) and injected `http://localhost:8400/detect.js` through Playwright `addScriptTag`. This ran on /es, /en and /es/proyectos/pwa-utt at 1440 and 390, each followed by a 3 s wait. The overlay rendered in the page: the banner and outlines are visible in `overlay_es-1440.webp`, with 13, 11, 13, 11, 2 and 0 overlay elements across the six runs.
- `[impeccable]` console output:
  - /es and /en at 1440: "7 anti-patterns found" (line-length, kicker-above-heading x5, codex-grid-background).
  - /es and /en at 390: "6 anti-patterns found" (kicker x5, grid).
  - Case page at 1440: "1 anti-pattern found" (hero-eyebrow-chip). The overlay did not report the case-page line-length that the CLI URL scan found.
  - Case page at 390: "No anti-patterns found."
- I stopped the server with `impeccable live-server stop --keep-inject` ("Stopped live server on port 8400"). `/health` no longer answers, and `git status` is unchanged, so no injection reached source.

## 4. Extra browser checks

### Contrast (computed with canvas-resolved sRGB, WCAG ratio; every visible text node grouped by fg/bg pair)

- **Every text pair passes AA on all three pages.** The lowest pair is muted `#abb3b8` on `#1e2022` at 12px: **7.68:1**. Muted on page bg `#101214` is 8.82:1. Navigation/secondary `#c4c9b2` ranges from 9.61 to 11.04:1.
- **Lime accent `#c2f362`:**
  - on `#101214` (page): 14.56:1
  - on `#0c0e10`: 15.0:1
  - on `#191b1d`, `#1b2024`, `#1e2022` (cards/HUD): 13.4, 12.74 and 12.68:1
  - on `#252c31` (selected HUD tile): 10.98:1
  - on `#333537` (active locale pill): **9.55:1** (lowest accent pair)
  - inverse `#101214` on `#c2f362` (primary CTA, skip link): 14.56:1
- Caveat: on surfaces with gradient or backdrop-filter, the background was approximated from solid colours only. With margins this large, the result is not at risk.
- Not measurable: placeholder colour and input-border (non-text 3:1) contrast, because the contact form is not rendered locally (see the limits section).

### Focus visibility (keyboard Tab from the top)

- **Navbar:** the skip link, brand, all section links, ES/EN, Contactar and GitHub each show a `2px solid #c2f362` outline at 4px offset, with `:focus-visible` true. This holds at 1440 and 390.
- **Hero CTAs** (Iconiq Button): `outline: none`, with a 3px lime `box-shadow` ring that appears after a 150ms transition. Reading it immediately after Tab gives transparent shadows, so measure after about 600ms.
  - "Contactar" (secondary): clear lime ring on a dark button. See `cta2-focus-kbd-390.png`.
  - **"Ver proyectos" (primary): weak indicator.** The ring is lime on a lime fill with no offset, and the border also turns lime, so focus only looks like the button grew by 3px. The focused and unfocused screenshots (`cta-focus-kbd-1440.png`, `cta-nofocus-Ver_proyectos.png`) are nearly indistinguishable. This technically meets 2.4.7, but the indicator is poor. Cause: the `focus-visible:!ring-accent` override in `src/components/hero/hero.tsx:31` on the accent-filled variant.
- **Mobile menu (390):**
  - The toggle has `aria-expanded` and `aria-controls="mobile-navigation"`.
  - All 7 menu items measure 350x44.
  - Escape closes the menu (`aria-expanded=false`) and returns focus to the toggle.
- **Case page:** "Volver a proyectos" has an outline. "Abrir aplicación" and "Ver código" use the same box-shadow ring pattern as the hero CTAs.

### Horizontal overflow

- `scrollWidth` equals `innerWidth` on all three pages at **390 (390/390)** and **360 (360/360)**. There is no overflow and no offending elements.

### Console errors

- No JS errors, no `pageerror`, and no 4xx/5xx responses on any page or width.
- The only entry is `requestfailed /api/contact/config net::ERR_ABORTED` on /es and /en. It is benign: React dev StrictMode double-mounts the effect, and the `AbortController` cleanup in `src/components/sections/contact-form.tsx:74-85` aborts the first request. The second request returns 200. This will not occur in production.

### Heading outline

- **/es and /en:** one h1 ("Imanol Antonio De la Cruz"; the accessible name is spaced correctly), then h2 Proyectos > h3 x3, h2 Cómo trabajo, h2 Stack > h3 x4, h2 Trayectoria > h3 x3, h2 Contacto. **No skipped levels.** One note: two sibling h3s have the same text, "Universidad Tecnológica de Tehuacán", which is ambiguous in a headings list.
- **Case page:** h1 followed by 7 h2. No skips.

### Images and alt text

- Only 2 `<img>` elements on home: `icons/project-arrow.svg` and `icons/download-cv.svg`. Both have `alt=""`, which is correct for decorative icons. None on the case page.
- No `svg[role=img]` without a name, and no unhidden unlabeled SVGs.
- **Missing alt: none.**
- No `<canvas>` is present. The Canvas UI GlassObject is gated behind `NEXT_PUBLIC_ENABLE_HUD_GLASS === "true"` (`src/components/hero/hud-visual.tsx:7`), so the WebGL effect was not exercised in this run.

### Touch targets at 390 (interactive elements under 44px; none under 24px on any page or width)

| Element                                | Size            | Pages    |
| -------------------------------------- | --------------- | -------- |
| Locale links ES / EN                   | 36x36           | all      |
| Hero CTA "Ver proyectos" / "Contactar" | 165x40 / 172x40 | /es, /en |
| Brand link                             | 112x42          | all      |

- All of these pass WCAG 2.5.8 AA (24px) but miss the 44px guideline (2.5.5 / HIG).
- These are fine: menu toggle, menu items (44), HUD disclosure (316x44), HUD tiles (316x48), CV link (44), "Copiar correo" (147x48).

### Reduced motion

- With `reducedMotion: "reduce"`, `document.getAnimations()` reports no running animations. There are none at rest without it either.

## 5. False-positive judgement

- **codex-grid-background: defensible, not a defect.** The grid is confined to the HUD "Perfil técnico" frame, and the brief explicitly asks for a HUD/System Playground (a measurement-like surface the rule itself exempts). The URL-mode `body` selector is misleading, since the page body has only a radial glow (`globals.css:17`). Whether it reads as generic is a call for Assessment A.
- **kicker-above-heading x5: true detection.** One shared `SectionHeading` puts the same mono-accent kicker over every section. The repetition is real, and whether it's a problem is a design-taste decision, not a bug.
- **hero-eyebrow-chip (case page): true detection.** It only fires at 1440, which suggests the rule is width-dependent: the text wraps at 390.
- **line-length, trajectory description (~119 chars): true positive.** The `text-sm` paragraph has no max-width in a wide column.
- **line-length, case page (~86 chars): borderline.** `max-w-prose` (65ch) at `text-sm` against a 16px root lands slightly over 80, and the in-page overlay did not flag it.
- **Console `ERR_ABORTED`: false positive.** It is a dev-only StrictMode artefact.
- **Hero CTA "no outline" in the first Tab pass: false positive of my own measurement.** The ring is a box-shadow behind a 150ms transition. The real issue is only the low-salience lime-on-lime ring on the primary CTA.

## 6. Skipped or limited steps

- **No native browser tool in this harness.** I used Playwright headless Chromium scripts instead, with a fresh context per page. There was no `[Human]` visible tab to present; the title was set only inside the headless page.
- **Contact form not verifiable.** `/api/contact/config` returns `{"siteKey":null}`, and `ContactForm` returns `null` without a provider and Turnstile key (`contact-form.tsx:188`). Labels, placeholders, field errors, status region and input contrast could not be checked.
- **GlassObject/WebGL not exercised.** The env flag is off, and headless WebGL is not representative.
- **Contrast on gradient/blurred surfaces is approximate**, from solid-colour compositing; see the caveat above.
- **Only `/en` was scanned in English.** I did not visit `/en/proyectos/*` or the other case slugs (`secure-transfer`, `classroom-github`).
- **The dev-only Next.js indicator** ("N" button, bottom-left in screenshots) was ignored.
- **Live-server stopped:** confirmed with `stop --keep-inject` and a failing `/health`.
