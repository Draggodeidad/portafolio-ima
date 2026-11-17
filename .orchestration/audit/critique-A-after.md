# Critique — Assessment A (Design Review), after the redesign

Target: home `src/app/[locale]/page.tsx` and case study `src/app/[locale]/proyectos/[slug]/page.tsx`, judged against PRODUCT.md, root DESIGN.md ("The Open Engineering Notebook") and the direction contract `.impeccable/surfaces/src-app-locale-page-tsx.md`.

Evidence:
- Screenshots in `.orchestration/audit/after/` at 1440, 768 and 390, ES home and PWA case.
- My own Playwright runs against http://localhost:3100. Scripts and captures are in `/tmp/claude-1000/-home-dragodeidad-Documents-portafolio/83e24e5e-c945-4d92-8d26-77714e609aeb/scratchpad/critiqueA2/`. They covered:
  - keyboard tab order and focus styles at 1440
  - touch targets and horizontal overflow at 360 and 390
  - the mobile menu: open, Esc, focus return
  - the active nav state
  - the EN home
  - the Secure Transfer and Classroom cases
  - the contact section at 390

No detector was run and no form was submitted. `/api/contact/config` returns `{"siteKey":null}`, so the contact form does not render, which matches the contract ("no form for now").

---

## 1. Design-specificity verdict

**Verdict: authored and specific in the first viewport. The world thins out below the fold and is almost gone on the case pages.**

- **The fold belongs to this product.** It is an open notebook spread with a sewn spine, a red margin and a quad grid, and every mark carries content:
  - "backend" is circled in ink.
  - The single highlighter swipe sits on the 1Degree Holdings internship.
  - Ticks and a ○ separate completed from pending.
  - A real PWA UTT screenshot is taped in and captioned "Captura con datos sintéticos".

  The metaphor matches the thesis ("the notebook where he reasons through his projects"), and it shows candour as a visual system instead of a disclaimer. Another candidate could reuse the look, but not these marks: they only make sense with this content. Nothing of the dark-neon, HUD or mono-kicker kit remains.
- **Below the hero the world drops to "cards on grid paper".** Projects, experience, about and contact are all the same bordered sheet with a red rule. The ink marks are reduced to small ticks, and the hero's vocabulary of arrows, circles, the highlighter and tape barely returns. A competent template could produce the stack and contact sheets unchanged.
- **The case pages are documentation on graph paper.** They have:
  - one sheet;
  - generic bordered tech chips;
  - a full-width stack of boxes as the diagram;
  - plain H2 + prose, capped at 65ch inside a 1240 px page, which leaves the right ~40 % empty.

  The contract's STORY promised that a tech lead "follows the annotated real project into a case that reads as notebook pages: decision, trade-off, limit, next step". There is no annotation, mark or decision/trade-off structure on any case page.
- **Personality is still absent.** The "young, curious, loves games" commitment is still a single sentence ("Fuera del código, disfruto los videojuegos."). The notebook expresses care and precision, not youth or play. That is acceptable under "professional first", but the brief asks for restrained personality, and right now there is none.

## 2. Nielsen heuristic scores

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | The active section gets a drawn ink underline (`nav-active.png`), the selected language is underlined, and copy-email has done/failed feedback. Case pages give no sense of position on a 4,300–5,200 px page: no in-page index, and every nav link leaves the case. |
| 2 | Match System / Real World | 3 | Plain, first-person headings now ("Proyectos y decisiones", "Cómo trabajo", "Hablemos de una oportunidad"). Remaining friction: self-awarded "Verificado:" stamps in the hero, "Validación documentada", "Diagrama · Entrada a plan de issues", and repository-auditor phrasing in Secure Transfer ("El repositorio implementa…", "operaciones descritas por el código"). |
| 3 | User Control and Freedom | 3 | "Volver a proyectos", previous/next, Esc closes the menu and returns focus to the toggle (verified), and the language switch keeps the page. No traps. On mobile case pages the only way back is a long scroll or leaving the page. |
| 4 | Consistency and Standards | 3 | One ink, one primary style, one focus ring everywhere. Remaining inconsistencies: <ul><li>Nav labels don't match the section headings ("Trayectoria" → "Formación y experiencia", "Sobre mí" → "Cómo trabajo").</li><li>Secondary actions still come in four looks (§6, issue 5).</li><li>The CV is a pen-underlined button in the hero but a small inline link in contact.</li></ul> |
| 5 | Error Prevention | 3 | The CV labels its language and format, which is good. However, "Abrir aplicación" (the PWA case's filled primary) opens a login wall with no warning beside it. External links (`target=_blank`: Ver código, GitHub, LinkedIn, the demo) carry no ↗ cue, although DESIGN.md requires drawn ↗/↓ arrows. |
| 6 | Recognition Rather Than Recall | 3 | Labelled navigation, named previous/next. The hero's taped screenshot and ink notes look like the entry to the PWA case but are not links. Readers must map nav labels to headings that use different words. |
| 7 | Flexibility and Efficiency | n/a | A portfolio is a one-time read. (A skip link exists and works.) |
| 8 | Aesthetic and Minimalist Design | 3 | Large improvement: one accent, one highlighter per screen, no glow, no glass, no kicker labels. Remaining noise: <ul><li>PWA UTT is told twice in a row, with the same two annotations.</li><li>The stack has 7 muted rows, including a hosting caveat presented as a skill ("Vercel — … abre en la pantalla de acceso").</li><li>Case pages are visually sparse at 1440 but very long on mobile.</li></ul> |
| 9 | Error Recovery | 3 | The form isn't rendered. Copy-email failure falls back to showing the address. The form code keeps the message on failure and has field-level errors. Unknown locale or slug returns 404. Scored as before for comparability. |
| 10 | Help and Documentation | n/a | Not applicable to a portfolio. |
| **Total** | | **24/32 (75 %)** | **Good** (previous run: 21/32, 66 %, Acceptable). Gains in Match (+1), Consistency (+1) and Aesthetic (+1). |

## 3. Cognitive load

The page fails 2 of the 8 checklist items, which counts as moderate load at the low end.

- **Single focus: pass.** At 1440 the left page holds identity and three actions. The right page is supporting proof, not a competing widget.
- **Chunking: fail (marginal).** "Con evidencia en proyectos" is one ungrouped list of 7 tech + context rows. The hero (3 evidence lines, 4 notes) is fine.
- **Grouping: pass.**
- **Visual hierarchy: pass.** The name, then the circled role, then the filled CTA, then the highlighted internship read in that order.
- **One thing at a time: pass.**
- **Minimal choices (≤4): fail (marginal).** See the decision points below.
- **Working memory: pass,** with one caveat: the nav label ≠ heading mismatch makes readers translate "Trayectoria" into "Formación y experiencia" after the jump.
- **Progressive disclosure: pass.** Depth lives in the cases.

Decision points with more than 4 visible options:

- **Contact sheet: 5 routes.** Escríbeme, Copiar correo, CV, GitHub, LinkedIn, plus the plain email. The footer repeats GitHub and LinkedIn immediately below, so the final screen at 390 shows **7 links** (`contact-390.png`).
- **Desktop header: 7 targets.** Brand, 4 sections, ES, EN. Only 4 are section choices, so this is acceptable. It is down from 10 in the previous run, and the duplicate "Contacto"/"Contactar" pair is gone.

## 4. Emotional journey

1. **Arrival (peak):** warm, crafted, unexpected for a developer portfolio. Name, circled "backend", highlighted internship and a CV button are all visible before any scroll at 1440 and 390. Competent and honest within seconds.
2. **Hero right page:** a real app, credible. But the screenshot is too dense to read at ~500 px, and the ink arrows are bullets that point into empty space rather than at the screenshot's facts.
3. **Projects (small dip):** the featured PWA card repeats the hero's right page: another screenshot and the same two notes. At 390 the two blocks are consecutive and read as déjà vu. The Secure Transfer and Classroom cards are honest diagrams, but flat: identical stacks of boxes.
4. **Formación y experiencia (recovery):** the strongest mid-page moment. The internship gets real detail (Node.js, Express, TypeScript, PostgreSQL/Supabase, documented endpoints).
5. **Cómo trabajo (valley):** three short sentences, then a muted list. The Vercel row ("abre en la pantalla de acceso") is a small negative note in a place that should build confidence.
6. **End:** "Hablemos de una oportunidad", with a clear filled "Escríbeme" and the visible address. Warm and direct, a clear improvement on the previous flat ending. It is still impersonal: no portrait (pending, correctly omitted) and no sign-off with any personality.
7. **Case page:** it opens well, with contribution and stack first, but the world is gone, so the arrival from the vivid hero feels like moving from a notebook to a README. On PWA UTT the reader passes ~1,100 px of diagram and screenshots before "Problema y alcance". The page now ends on "Límites y siguiente paso" with a concrete next step, so the low point has been turned into a reasoning moment. Secure Transfer still stacks three negatives ("base de datos eliminada, no hay demo, no hay revisión de seguridad") right before the contact prompt.

## 5. Strengths

1. **The first viewport does the recruiter's job.** Role fit, the 2025 backend internship (the single highlighter swipe), the CV and contact are all in view at 1440, 768 and 390.
   - State is written as marks plus words (✓ completed, ○ in progress), and synthetic data is labelled.
   - Candour has become the visual system, which is exactly PRODUCT.md's positioning.
   - Evidence: `hero.tsx:96-143`, `home-es-390-fold.webp`.
2. **Disciplined tokens and solid accessibility:**
   - One ink colour acts.
   - Every tab stop (22 checked) shows the same 3 px Pressed Ink outline offset 4 px, including the rotated primary CTA (`focus-cta.png`).
   - All interactive targets are ≥44 px at 360 and 390; the only exception is the dev-only Next.js tools button.
   - No horizontal overflow at 360.
   - The mobile menu has 4 items, closes on Esc and returns focus to its toggle.
   - Headings follow a clean H1 → H2 → H3 order.
3. **Case content now leads with contribution and closes with a next step.**
   - "Mi aportación" and the technologies sit directly under the title.
   - "Límites y siguiente paso" pairs each limit with what he would do next.
   - PWA UTT shows three real, captioned screenshots.
   - The engineering substance (idempotent frozen requests, explicit version conflicts, AES-256-GCM with RSA-OAEP/PSS) is intact.

## 6. Priority issues

### 1. [P1] Case-study pages abandon the notebook world and bury the reasoning under visuals

- **What:**
  - The case page is one plain sheet with generic bordered chips, a full-width box-stack diagram, then five prose sections capped at 65ch.
  - At 1440 the right ~40 % of the page is empty grid.
  - On PWA UTT, the diagram and three screenshots (~1,100 px) come before "Problema y alcance".
  - There are no ink annotations linking screenshots to decisions, no ✓/○ marks, no highlighter, and no decision/trade-off structure. "Decisiones técnicas" is a plain bullet list.
- **Why it matters:** The tech lead is half of the primary audience, and the case is where hiring decisions are made. The contract's STORY ("a case that reads as notebook pages: decision, trade-off, limit, next step") is not delivered. The jump from the vivid hero to a README-like page also undercuts the "authored" impression the home page earns.
- **Fix:**
  - At ≥1024 px, lay the case out as a spread:
    - Left page: problem → decisions → limits and next step.
    - Right page: the taped screenshots and diagram, with ink arrows pointing at the specific UI that proves each decision, e.g. the "Sincronización" queue screen next to the idempotency decision.
  - Write each decision as "Decisión · Alternativa descartada · Por qué", with a tick, and use the page's single highlighter on the strongest decision.
  - Put the problem statement before the visuals.
  - Replace the bordered chips with an ink-ticked line.
  - Below 768 px, keep the left page first.
- **Command:** `/impeccable layout`, then `/impeccable bolder` (or `/impeccable shape` to settle the "Case-study page layout" item the contract left unresolved).
- **Evidence:** `src/app/[locale]/proyectos/[slug]/page.tsx:17-40, 109-178`; `case-es-1440-full.webp` (visual band before "Problema y alcance", empty right column); `st-1440-full.png` (three-box diagram spanning 1,090 px).

### 2. [P2] The PWA case's filled primary action leads to a login wall without warning

- **What:** "Abrir aplicación" is the only filled button on the PWA case. It opens https://pwa-utt.vercel.app/, which lands on a sign-in screen with no credentials or guest path. The content model has the honest note `status: "Proyecto académico · la demo requiere iniciar sesión"`, but it is not rendered anywhere. The only hints are buried in the "Validación" prose (`/login`) and in the Vercel stack row on the home page.
- **Why it matters:** The strongest call to action produces a dead end. A recruiter or lead who clicks it concludes "the demo is broken". That contradicts PRODUCT.md's principle "Hide what's pending instead of faking it" and its candour positioning.
- **Fix:**
  - Render the status line as a ○ pending note directly beside the button: "La demo pide iniciar sesión; las capturas muestran el flujo."
  - Or demote "Abrir aplicación" to a pen-underlined secondary and make "Ver código" or the screenshots the primary path.
  - Add the drawn ↗ external cue.
- **Command:** `/impeccable clarify`, `/impeccable harden`.
- **Evidence:** `src/content/projects.ts:63-66` (unused `status`); `src/app/[locale]/proyectos/[slug]/page.tsx:133-156`; `src/content/profile.ts:202-205`.

### 3. [P2] PWA UTT is told twice in a row, and the hero proof is a dead end

- **What:** The hero's right page and the featured project card both show a PWA UTT screenshot, and both repeat "Una cola envía cambios al volver la conexión" and "Conflictos de versión explícitos". At 390 they are consecutive blocks. Meanwhile, the hero's taped print and ink notes, which look like the way into the case, are not links. The only route to the case is the featured card's "Ver caso", one screen later.
- **Why it matters:**
  - The repetition costs mobile readers a screen of déjà vu and dilutes the "one notebook" story.
  - The unlinked hero proof misses the one moment when a lead is most curious.
  - The contract asked for "ink arrows to facts", but the arrows are list bullets pointing at empty space, not at the screenshot.
- **Fix:**
  - Link the hero right page to the case: wrap the caption or title, or add "Ver caso →" in ink.
  - Make the arrows point at regions of the print (queue, conflict badge).
  - In the projects section, give PWA UTT different content: the decisions or a different screen, with no repeated notes. Alternatively, present it as an equal-weight card that refers back to the hero.
- **Command:** `/impeccable distill`.
- **Evidence:** `src/components/hero/hero.tsx:145-171`; `src/components/projects/projects-section.tsx:69-99`; `messages/es.json:40-52`; `home-es-390-full.webp` (two consecutive PWA blocks).

### 4. [P2] Candour still slips into an auditor's voice in places

- **What:**
  - **Hero:** the evidence lines start with a self-awarded "Verificado:" ("Verificado: estadía…", "Verificado: implementación principal…").
  - **Secure Transfer:** "El repositorio implementa un flujo…", "El recorrido representado aquí refleja las operaciones presentes en el código de carga", "Estas son operaciones descritas por el código".
  - **Home card:** the Secure Transfer card says "comprobaciones criptográficas descritas en el código".
  - **Case headings:** "Validación documentada" is used as a heading.
- **Why it matters:**
  - "Verificado" raises the question "verified by whom?" and reads like a background check, not a person.
  - The third-person repository voice is the residue of the previous run's main voice complaint. A lead wants to read "I decided…", not "the repository describes…".
  - The Experience section already shows the better pattern: "Completado" / "En curso".
- **Fix:**
  - Replace "Verificado:" with the state the mark already encodes plus a date ("Completada · 2025"), or with no prefix at all. The tick carries "verified".
  - Rewrite the Secure Transfer copy in first person: "Implementé un flujo que…"; "No es una auditoría de seguridad: …".
  - Rename "Validación documentada" to "Cómo lo probé".
- **Command:** `/impeccable clarify`.
- **Evidence:** `messages/es.json:33-37`; `src/content/projects.ts:160, 191, 204, 133`; `home-es-1440-fold.webp`.

### 5. [P2] Secondary actions still use four styles, and the external/download cues are missing

- **What:** DESIGN.md defines primary (ink fill) and secondary (pen underline). The build ships four secondary looks:
  - the pen-underlined graphite button in the hero;
  - "Ver caso" with both a text underline and the 2 px pen bar, a visible double underline (`projects-section.tsx:17-18` adds `underline decoration-2` on top of the outline variant's `border-b-2`; `vercaso.png`);
  - ghost ink text for "Copiar correo" (`copy-email-button.tsx:76`);
  - thin-underlined inline ink links ("Descargar CV" in contact, "Volver a proyectos", "Más formas de contacto"; `profile-sections.tsx:34`).

  The CV changes from a button to a small link between hero and contact. None of the external or download actions carry the drawn ↗/↓ arrows that DESIGN.md requires.
- **Why it matters:** Users learn one pattern per action type. This is much better than before, but still makes the same action look different in different places. Opening new tabs and starting a download with no warning is also an accessibility gap (WCAG 3.2.5 advisory) and a contract miss.
- **Fix:**
  - Use two secondary types only: the pen underline for actions, the inline ink link inside prose.
  - Remove the extra underline on "Ver caso".
  - Make "Copiar correo" and the contact CV pen-underlined actions.
  - Add drawn ↗/↓ ink arrows plus visually hidden "(se abre en otra pestaña)" / "(descarga PDF)".
- **Command:** `/impeccable polish`.
- **Evidence:** the files and lines above; `contact-390.png`; `case-es-1440-fold.webp`.

## 7. Persona red flags

**Jordan (first-timer):**

- "Verificado: …": verified by whom?
- The taped screenshot looks like something to open, but clicking it does nothing.
- "Trayectoria" in the nav lands on a heading called "Formación y experiencia".
- The case pages use unexplained terms: "idempotencia", "solicitud congelada", "dry-run", "ZIP starter", "RLS", "issues". This is fine for a lead, opaque for a recruiter, and there is no plain-language one-line summary at the top of the reasoning.

**Riley (stress tester):**

- "Abrir aplicación" → sign-in wall, with no credentials and no warning (issue 2).
- Five external links open new tabs with no indication.
- The EN visitor's only CV is Spanish. It is labelled honestly ("Spanish · PDF"), but Spanish and English are still not equals.
- The form code still mounts after a client fetch (`contact-form.tsx:73-90, 189`). If the site key is configured later, the form will appear below the links after load (latent reflow).
- "Ver caso" shows a double underline.

**Casey (mobile, 360/390):**

- Good: the CTA, CV and highlighted internship are all in the first viewport, and every target is ≥44 px.
- Red flags:
  - The home page is 7,461 px at 390 (7,925 px at 360), and the PWA UTT blocks repeat back to back.
  - The hero screenshot is ~310 px wide and unreadable.
  - Case pages are ~5,200 px with no in-page jump to "Mi aportación", "Decisiones" or "Límites".
  - The last screen holds 7 links.
  - The primary actions sit at the top of the hero, not in the thumb zone. That is acceptable for a reading page.

**Recruiter with 30 seconds:**

- Gets the name, the role with "backend" circled, the internship (highlighted), studies (in progress) and "Descargar CV", all without scrolling. This is a clear win.
- Red flags:
  - The highlighted line opens with "Verificado:" and names a vague role ("estadía en desarrollo backend y transformación digital"). The specific technologies are only in the Experience section, one long scroll away.
  - There is no face. This is correct for now, but the first viewport is all text plus a screenshot of someone else's UI.

**Tech lead reading a case:**

- Gets contribution and stack first, plus real decisions and a stated next step.
- Red flags:
  - ~1,100 px of visuals before the problem.
  - The diagrams are 3–4 full-width boxes that say less than one sentence of the prose.
  - Decisions don't name the alternatives he rejected, so the trade-offs can't be judged.
  - The Secure Transfer narrative is still about "the repository", not about his choices.
  - Claims don't link to the files or commits that prove them, although the product's promise is "every claim traceable". Linking the key decision to the actual module would be the strongest possible signal.

## 8. Minor observations

- Nav labels differ from the section headings in both languages: Trayectoria/Formación y experiencia, Sobre mí/Cómo trabajo, Experience/…, About/…. Either align them or rename the headings.
- In EN the "backend" ellipse nearly touches the "a" before it ("with a backend focus", `en-1440.png`). Give it 4–6 px more horizontal room.
- The signature interaction is a one-time load sweep. The contract says the highlighter "sweeps behind evidence on hover or focus", and the evidence items are not focusable. Either implement it or update the contract.
- "Diagrama · Cliente a almacenamiento" is a small bold label above every diagram. It works like a kicker line; the visible caption could carry it instead.
- The stack's Vercel row is a caveat about the demo, not a skill. Remove it or move the caveat to issue 2's note.
- The footer repeats GitHub/LinkedIn right under the contact sheet's identical links.
- Case header chips (`page.tsx:26`) are the one stock UI component left in the world.
- "Cómo trabajo" is three short sentences. It is the natural place for the restrained personality note: for example, what kind of games, and how that shows up in his work, if he confirms it.
- The hero description ("Construyo aplicaciones, APIs y automatizaciones con JavaScript y TypeScript.") is generic next to the specific evidence below it.

## 9. Previous findings: status

| | Previous finding | Status | Note |
|---|---|---|---|
| a | "IA" read as AI | **Resolved** | Monogram removed. "IA" now appears only in the internship description, where it correctly means AI. |
| b | Generic HUD look | **Resolved** (caveat) | Distinctive notebook world. Depth below the hero and on case pages is thin (issue 1). |
| c | Internship/CV not visible in 30 s | **Resolved** | Both in the first viewport at 1440/768/390; the internship carries the highlighter. |
| d | Real PWA screenshots unused | **Resolved** | Used in the hero, the featured card and three on the case page, all labelled synthetic. Placement is now duplicated (issue 3). |
| e | Auditor voice / "SIN CASO PUBLICADO" | **Partial** | The badges are gone ("También conozco: …"), and limits are now paired with a next step. "Verificado:" stamps and the Secure Transfer repository voice remain (issue 4). |
| f | Inconsistent action styles | **Partial** | One primary style and a shared focus ring. Four secondary looks remain, plus the double underline on "Ver caso" (issue 5). |
| g | Dead ◀ ▶ hints | **Resolved** | Removed. The new non-link affordance is the hero's taped print (issue 3), which is milder. |
| h | Weak focus on primary CTA | **Resolved** | 3 px Pressed Ink outline offset 4 px on "Ver proyectos" and on all 22 tab stops (`focus-cta.png`). |
| i | Touch targets under 44 px | **Resolved** | All targets ≥44 px at 360/390 (CTAs 48–51 px, nav and ES/EN 44 px). The only exception is the dev-only Next.js tools button. |
| j | Contact form reflow / empty column | **Resolved for the current config** (latent) | Single-column contact, no form rendered. The fetch-then-mount path still exists and would reflow if a site key is configured. |
