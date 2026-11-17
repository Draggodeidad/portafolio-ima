# Critique — Assessment A (Design Review)

Target: home `src/app/[locale]/page.tsx` (+ `src/components/**`) and case study `src/app/[locale]/proyectos/[slug]/page.tsx`.
Evidence: pre-captured screenshots in `.orchestration/audit/before/` (1440/768/390, ES), plus my own Playwright runs (EN 1440 hero, 360 px mobile menu and opened HUD, Secure Transfer case at 390, keyboard tab order at 1440, touch-target sizes at 360). I did not run any detector and did not submit the contact form.
Limitation: the contact form only renders when `/api/contact/config` returns a Turnstile site key. Locally it returns `{"siteKey":null}`, so I could not see the form in the browser. I judged its states from source (`src/components/sections/contact-form.tsx`).

---

## 1. Design-specificity verdict

**Verdict: interchangeable with any dev portfolio. The person behind it barely comes through.**

- **The visual kit is generic.** Space Grotesk with JetBrains Mono, graphite with neon lime, corner-bracket frames, mono uppercase eyebrows on every block, `[ 01 ]` button prefixes, `///` index marks, a grid-paper panel and a hexagon around a monogram. This is the standard "developer terminal/HUD" kit. You could swap in any other junior developer's name and nothing would look wrong. The structure is also the stock order: hero, projects, about, stack, trajectory, contact.
- **The one personal trait is decoration, not character.** The love of video games appears in two places: a single sentence ("Fuera del código, disfruto los videojuegos.") and the HUD styling. The styling reads as "techy template", not "this person plays games". The stage-select node picker is the one idea that is genuinely his: areas of work wired to the case that proves them. But it sits inside the template frame and looks like part of it.
- **The monogram reads as "AI" in Spanish.** The hero's largest graphic is a huge "IA" in a hexagon, under the header "PERFIL TÉCNICO … IA". To a Spanish-speaking recruiter, "IA" means _inteligencia artificial_, so the panel reads as "AI technical profile". In 2026 that suggests an AI-generated portfolio. This is the worst possible reading for a candidate whose differentiator is "every claim is mine and traceable". (Evidence: `src/components/hero/hero.tsx:170-199`, `home-es-1440-fold.webp`.)
- **Character the page misses:**
  - Real PWA UTT screenshots exist in `pwa-img/` and are unused.
  - The candour, which is meant to be the differentiator, comes out as auditor boilerplate instead of a voice.
  - The internship, his only professional signal, sits fifth in the page.
- **Two craft breaks undercut the "engineer who cares about details" story:**
  - The uppercase H1 uses `tracking-[-0.055em]` (`hero.tsx:24`), which squeezes the word space so the name reads "IMANOLANTONIO" at 1440.
  - The brand monogram has a lime "online" dot (`navbar-client.styles.ts:11`, `navbar-client.tsx:214`). It reads as an availability indicator, which PRODUCT.md says must not be shown.

## 2. Nielsen heuristic scores

| #         | Heuristic                       | Score           | Key issue                                                                                                                                                                                                                                                                                                                                                                                       |
| --------- | ------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 3               | Good: active nav section (IntersectionObserver), copy-email feedback, live HUD caption, form idle/submitting/success/error states. Gaps: the form submit stays disabled until Turnstile issues a token, with no visible reason (`contact-form.tsx:316`). The form also appears only after a client fetch, which reflows the contact section from one column to two (`profile-sections.tsx:60`). |
| 2         | Match System / Real World       | 2               | Recruiters must decode terms like "PERFIL TÉCNICO", "ELIGE UN ÁREA DE TRABAJO", "Cola durable", "API / Gateway" (overstates an Express file API), "DIAGRAMA, NO CAPTURA", `[ 01 ]`. The case copy speaks as a third-party auditor ("El repositorio describe…", "No se ejecutaron aquí"), not as the developer.                                                                                  |
| 3         | User Control and Freedom        | 3               | Back-to-projects link, previous/next case links, Esc closes the mobile menu, focus trap in the menu, and the language switch keeps the current page. No traps.                                                                                                                                                                                                                                  |
| 4         | Consistency and Standards       | 2               | "Ver caso" has three looks: outlined button (featured card, `projects-section.tsx:125`), lime text link (small cards, `:200`) and mono uppercase "VER CASO" (HUD). Contact has five labels: Contacto / Contactar / `[01] Contactar` / Escríbeme / Más formas de contacto. Buttons are square in the hero (`!rounded-none`) but rounded in project cards.                                        |
| 5         | Error Prevention                | 3               | Native constraints (required, maxLength, minLength, type=email), validation on blur, in-flight guard against double submit, and a copy-email fallback. Fine for this surface.                                                                                                                                                                                                                   |
| 6         | Recognition Rather Than Recall  | 3               | Labelled navigation and named previous/next links. But the bordered ◀ ▶ key hints in the HUD look like buttons and are inert `span`s (`node-selector.tsx:185-192`). Mouse users will click them and nothing happens.                                                                                                                                                                            |
| 7         | Flexibility and Efficiency      | n/a             | Portfolio: a one-time read with no repeat-use workflow. (A skip link and arrow-key radio group exist anyway.)                                                                                                                                                                                                                                                                                   |
| 8         | Aesthetic and Minimalist Design | 2               | High noise floor. Lime carries about ten roles: nav active, CTA, eyebrows, role line, badges, links, dots, brackets, timeline marks, tile state. Nearly every block has a mono uppercase micro-label or footer. The stack section is 13 rows, each with a badge, five of them "SIN CASO PUBLICADO".                                                                                             |
| 9         | Error Recovery                  | 3               | Field-level errors linked with `aria-describedby`. The message is kept on failure (`form.reset()` runs only on success). Separate copy for rate limit, verification and generic errors, in a `role=status` region.                                                                                                                                                                              |
| 10        | Help and Documentation          | n/a             | A portfolio needs no help system. Each case study works as its own documentation.                                                                                                                                                                                                                                                                                                               |
| **Total** |                                 | **21/32 (66%)** | **Acceptable**: solid engineering underneath; hierarchy, voice and identity need significant work.                                                                                                                                                                                                                                                                                              |

## 3. Cognitive load

The page fails 4 of the 8 checklist items, which counts as high load:

- **Single focus — fail.** The 1440 first screen splits attention between the identity column (3 actions) and a HUD widget (3 radio tiles, a caption and a case link). The widget repeats the projects grid directly below it.
- **Visual hierarchy — fail.** Accent and mono-uppercase treatment are used so widely that nothing stands out. The role line, the eyebrow, the CTA and the active nav pill are all the same lime at similar weight.
- **One thing at a time — fail.** The hero asks "read who I am", "pick a project area" and "contact/download" at the same moment.
- **Minimal choices (≤4) — fail.** See the decision points below.

Passes:

- Chunking: stack groups have 3–4 items.
- Grouping.
- Working memory: case pages repeat their context.
- Progressive disclosure: the HUD collapses below `lg`, and depth lives in the case pages.

Decision points with more than 4 visible options:

- **Desktop header: 10 controls.** Six section links, ES, EN, Contactar and GitHub. "Contacto" and "Contactar" go to the same anchor.
- **Hero at 1440: about 7 actions.** Ver proyectos, Contactar, Descargar CV, 3 area tiles and Ver caso. Together with the header, that is 17 interactive targets in the first viewport.
- **Mobile menu: 7 items.** It lists both "CONTACTO" and a full-width "CONTACTAR", which are the same destination (`menu-open.png`).
- **Contact section: 5 direct routes plus the form in production.** Email (mailto), copy email, CV, GitHub, LinkedIn.

## 4. Emotional journey

1. **Arrival:** dark, competent, "techy". It feels cool rather than warm, with no face, and on mobile no visual identity at all. The HUD is collapsed into an unexplained "ÁREAS DE TRABAJO Y CASOS" bar (`home-es-390-fold.webp`).
2. **First peak:** the featured PWA UTT card. It has a clear contribution statement, real stack tags, a live demo and a case link. This is the strongest moment on the home page.
3. **Valley 1:** the Secure Transfer and Classroom cards repeat the same boxy diagram. The "DIAGRAMA, NO CAPTURA" footers read like apologies.
4. **Valley 2, mid-page:** the stack section. A wall of 13 rows where "SIN CASO PUBLICADO" appears five times, including NestJS and Hono, the declared backend stack. Candour presented this way becomes a list of negatives.
5. **Recovery:** the trajectory section is good news (the 1Degree Holdings internship), but it arrives too late, after the low point.
6. **End:** a plain contact block and a footer. There is no portrait, no closing personality and no sign-off. The peak-end rule says visitors remember the stack-wall valley and a flat ending.
7. **Case study end:** worse. The last two sections are "Validación documentada" and "Límites conocidos". For Secure Transfer the final note before the CTA is "lanza un error… la base de datos fue eliminada… no se confirma una revisión de seguridad". Then comes "¿Quieres hablar de este proyecto?". The page asks for contact at its lowest emotional point.

## 5. Strengths

1. **The case-study substance is the real asset.** Problem, architecture, decisions, validation and limits are written with concrete engineering detail: frozen requests and idempotency to avoid duplicate writes, explicit version conflicts instead of silent overwrites, AES-256-GCM with RSA-OAEP key wrapping and RSA-PSS signatures. A tech lead can judge reasoning, which is exactly the product promise. The sticky "Problema y alcance" column (`proyectos/[slug]/page.tsx:44`) and the previous/next links are good reading furniture.
2. **The node selector links claims to proof.** Each area of work points to the case that demonstrates it, as a real WAI-ARIA radio group with arrow, Home and End keys and an `aria-live` caption (`node-selector.tsx:91-199`). The concept is worth keeping even if the HUD costume goes.
3. **Solid accessibility and robustness:**
   - Skip link; visible 2px outline or ring on all 22 tab stops I checked.
   - Mobile menu with focus trap and Esc to close.
   - No horizontal overflow at 360 px, and the HUD is collapsed on small screens.
   - The language switch keeps the page; the form keeps the message on failure.
   - Diagrams are honestly labelled as diagrams.

## 6. Priority issues

### [P1] The identity is a generic HUD costume, and the "IA" monogram reads as "AI"

- **Why it matters:** Recruiters spend seconds forming an impression. The look says "template". The giant "IA" says "artificial intelligence" in the primary language. Combined with an auditor-style voice, the site risks being read as AI-generated, the opposite of the "every claim is mine" positioning. Nothing on the page signals a young, curious person who loves games, beyond one sentence.
- **Fix:** Use the approved free redesign to choose a person-first direction.
  - Replace the HUD frame and hexagon with a name-led wordmark (full name or "Imanol"; never "IA" alone) until the portrait arrives.
  - Drop the corner brackets, `[ 01 ]`, `///` and the lime "online" dot.
  - Express the gaming side through one authored mechanic: keep the stage-select idea for choosing a case, without chrome.
  - Pick a type pairing that isn't the default Space Grotesk + JetBrains Mono, and fix the H1 tracking.
- **Command:** `/impeccable shape`, then `/impeccable craft`; `/impeccable typeset` for the H1.
- **Evidence:** `hero.tsx:24, 135-137, 159-199`; `navbar-client.styles.ts:11`; `home-es-1440-fold.webp` (hero right column); `src/styles/tokens.css:30-32`.

### [P1] The evidence hierarchy is upside-down for a 30-second recruiter scan

- **Why it matters:** A recruiter's three questions are role fit, real experience and how to contact or get the CV. Right now:
  - The internship at 1Degree Holdings (2025), his only professional signal, is the fifth section, below the stack wall.
  - The CV, a product success criterion, is a small mono-uppercase text link in the hero, the weakest-styled action there.
  - At desktop the hero's right half is spent on a widget that repeats the project list one scroll below.
- **Fix:**
  - Add a one-line evidence strip under the role: "Prácticas backend · 1Degree Holdings 2025 · TSU UTT · 3 casos documentados".
  - Promote the CV to a visible secondary button.
  - Use the right column for the strongest real artefact (a PWA UTT screen) or drop it.
  - Move Trayectoria above Stack, or fold it into About.
  - Remove the duplicate "Contacto"/"Contactar" pair in the nav.
- **Command:** `/impeccable layout`, `/impeccable distill`.
- **Evidence:** `src/app/[locale]/page.tsx:41-48` (section order); `hero.tsx:140-153` (CV link); `home-es-1440-full.webp` (trajectory near the bottom); `menu-open.png`.

### [P1] Real product proof is unused; the visuals are labelled boxes that don't explain a flow

- **Why it matters:**
  - Eight real PWA UTT captures (`pwa-img/`) exist, yet every project, including the one with a live demo, is shown as a grid of text boxes with a "DIAGRAMA, NO CAPTURA" disclaimer.
  - The featured sync diagram ("Dispositivo / Sin conexión / Inspección local ···› Red disponible / Cola durable / Supabase") is six boxes and one dotted arrow. A tech lead cannot read a sequence from it.
  - On the case page the diagram sits before "Mi aportación", so contribution, the key fact, comes third.
- **Fix:**
  - Optimise 2–3 PWA captures into `public/` and use them as the PWA UTT hero visual (labelled as synthetic test data).
  - Redraw the architecture visuals as directional flows with numbered steps; keep them for Secure Transfer and Classroom, which have no screenshots.
  - On case pages, put contribution and stack directly under the title, before the visual.
- **Command:** `/impeccable visualize`, `/impeccable layout`.
- **Evidence:** `pwa-img/` (8 files, unused); `src/components/projects/project-visual.tsx`; `proyectos/[slug]/page.tsx:189-201`; `case-es-1440-full.webp` (diagram band, then contribution).

### [P2] Candour is presented as deficit, in an auditor's voice instead of the developer's

- **Why it matters:** PRODUCT.md says candour is the differentiator. Right now it reads as a review written about him rather than by him:
  - "El repositorio describe pruebas…"
  - "Eso confirma que la ruta está disponible…"
  - "No se ejecutaron aquí" — "aquí" refers to whoever audited the repository.
  - In the stack, five rows say "SIN CASO PUBLICADO".

  Limits are listed with no "what I learned or would do next", so every case ends on a negative. A tech lead values a candidate who names limits and then reasons about them. This copy does only the first half.

- **Fix:**
  - Rewrite the case copy in first person.
  - Pair each limit with a next step or lesson, e.g. "Límites y siguiente paso".
  - Replace per-row negative badges with two tiers: "Con evidencia en casos" vs "También he trabajado con".
  - Rename the node label "API / Gateway" to what the project is.
- **Command:** `/impeccable clarify`.
- **Evidence:** `src/content/projects.ts:226, 235` (and the PWA validation paragraph); `messages/es.json:44, 102`; `profile-sections.tsx:155-157`; `case-st-390.webp` (end of page).

### [P2] The noise floor and inconsistent action styles weaken hierarchy

- **Why it matters:** When lime and mono uppercase mark everything, the primary action and the key facts stop standing out. The same action ("Ver caso") looks three different ways, so users cannot learn the pattern. The fake ◀ ▶ key hints invite clicks that do nothing.
- **Fix:**
  - Limit the accent to primary actions and one state colour.
  - Cut decorative micro-labels and footers (e.g. "LOCAL → SERVIDOR", "CLIENTE → API → ALMACENAMIENTO").
  - Give each action type one component and one label, with one contact verb.
  - Make the arrow hints real buttons or remove them.
- **Command:** `/impeccable quieter`, `/impeccable polish`.
- **Evidence:** `projects-section.tsx:125-130` vs `:200-205` vs `node-selector.tsx:200-204`; `node-selector.tsx:185-192`; `home-es-1440-full.webp` (projects and stack bands).

## 7. Persona red flags

**Jordan (first-timer):**

- Cannot tell what "PERFIL TÉCNICO · IA" or "ELIGE UN ÁREA DE TRABAJO" is for.
- Clicks the ◀ ▶ squares and nothing happens.
- On mobile, the collapsed bar "ÁREAS DE TRABAJO Y CASOS" gives no reason to open it.
- Reads "DIAGRAMA, NO CAPTURA" and wonders whether something is missing.
- `[ 01 ]` before "Contactar" suggests a step number that doesn't exist.

**Riley (stress tester):**

- The case pages promise a demo flow ("La demo requiere iniciar sesión") but give no credentials or guest path, so "Abrir aplicación" leads to a login wall.
- The form's submit stays disabled with no reason while Turnstile loads, or forever if Turnstile is blocked by an extension. The form also appears late and reflows the section.
- The EN visitor's only CV is Spanish. The label says so honestly, but there is no EN equivalent, which breaks "Spanish and English are equals".
- "Contacto" and "Contactar" are separate nav items with the same destination.

**Casey (mobile, 390/360):**

- The first screen has no image or identity mark beyond the small header logo. The hero is all text.
- The primary CTAs are 40 px tall, and the ES/EN controls are 36×36 at 360 px, below the PRODUCT.md ~44 px target. Measured: "Ver proyectos" 165×40, "Contactar" 172×40, ES/EN 36×36.
- The home page is about 8,300 px tall at 390, with the trajectory and internship near the bottom.
- Case pages are long single columns with no in-page jump to "Límites" or "Mi aportación".

**Recruiter scanning for 30 seconds (project persona):**

- Gets name, role and a CTA quickly.
- But cannot see "has internship experience" without scrolling past projects and stack.
- Must notice a tiny mono link to find the CV.
- May read "IA" as "AI".
- The stack section's repeated "SIN CASO PUBLICADO" is the most scannable text in the middle of the page and reads as a negative.

**Tech lead reading a case study (project persona):**

- Gets real substance (strength 1).
- But the opening visual is a box grid without sequence semantics.
- Contribution comes after the visual.
- The narrative never states what _he_ decided versus what the repository "describes".
- Every case ends on limits with no reflection, so the lead learns what is missing but not how the candidate would close the gap, which is the signal they are hiring a junior for.

## 8. Minor observations

- **Case hero at 1440:** the title is in an 8-column span, leaving a large empty right side. The actions float bottom-right, detached from the copy (`case-es-1440-full.webp`).
- **Case body misalignment:** the right column's first block starts with a border-top while the sticky left intro does not, so the top edges of the two columns don't line up.
- **Secondary hero heading** uses `text-navigation` (khaki grey) for "DE LA CRUZ". It reads as de-emphasising half his name.
- **Hero eyebrow "Perfil de desarrollador"** adds nothing. The role line under the name already says it.
- **Projects heading "Ingeniería de software y arquitectura aplicada"** is grander than three academic and personal projects support. Something like "Proyectos, explicados como decisiones" would match the positioning.
- **About section** is one lead and one paragraph. It is the natural home for the gaming personality and the "why backend" story, and is currently the thinnest part of the page.
- **Contact layout shift in production:** the contact grid uses `has-[form]`, so the section jumps from one column to two once the client fetch resolves. Reserve the space, or render the form shell on the server.
- **Wide hero row:** at 1440 the hero CTA row puts three differently styled actions on one line (filled, outlined, bare mono link), with three different heights.

## Provocative questions

1. If you removed every lime pixel and every monospace label, what would still tell a recruiter this is Imanol and not another junior developer? Whatever that is (the stage-select mechanic, the candid voice, the PWA screens) should be the design.
2. Is the candour actually working for him? A list of what isn't verified, with no "what I'd do next", shows honesty but not judgement. Which would a tech lead hiring a junior rather see?
3. Why does the strongest proof of employability (a 2025 backend internship) sit below a wall of technologies, five of which say there is no evidence?
