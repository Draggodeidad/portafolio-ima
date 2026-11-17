# F04-design-drift — Corregir los desvíos registrados por el documentador

## Contexto

- Lee `.orchestration/tasks/_COMMON.md` (incluye los checks de Workers) y `DESIGN.md` (regenerado: Cell Rule, One Swipe por página, Empty Space Rule, Measured Reading, referencias numeradas).
- Worktree: `/home/dragodeidad/Documents/portafolio-F04` · Rama: `ux/F04-design-drift` (sale de `ux/redesign-cuaderno`, la rama del PR #15) · Dev: 3211 · e2e: `PLAYWRIGHT_PORT=3221`.
- **Sin texto nuevo** ni cambios de copy. Conserva hero, layout aprobado y comportamiento.

## Desvíos a corregir

1. **Diagramas que nunca se dibujan:** `src/components/projects/project-visual.tsx` usa las clases `ink.flow` e `ink.inkStroke`, pero `project-visual.module.css` no las define, y la regla vigente es `:global([data-ink-draw]) .flow > :nth-child(-n + 5) .inkStroke`. Reconcilia nombres y selectores para que:
   - en la página de caso, el diagrama dibuje sus trazos una vez (máximo 4 animados) **solo si está en el primer viewport**; si no, que se vea estático;
   - en la home queden estáticos;
   - con reduced-motion se vean completos.
   - Con `pathLength="1"`, cuida que el estado inicial nunca oculte el trazo cuando no hay animación.
2. **Columna derecha vacía junto a «Arquitectura»** en Secure Transfer y Classroom → GitHub a ≥1280 px. Aplica la regla Empty Space: mueve contenido ya publicado de ese caso (su diagrama, o la nota de demo/estado si existe) junto a Arquitectura, o cierra el spread en ese tramo y usa una sola página de lectura. Que no quede una columna vacía.
3. **Tachado de «Demo»** (Secure Transfer): debe ser una marca de tinta, un trazo SVG irregular en `ink` sobre la palabra, no un `line-through` de texto. Mantén la razón en palabras y que el estado sea legible para lectores de pantalla (el texto ya existente; no agregues palabras).
4. **Hover sin gate:** los enlaces de contacto y footer en `src/components/sections/profile-sections.tsx` usan `hover:` sin el gate `(hover:hover) and (pointer:fine)`. Gatéalos como en `b-button.tsx`.
5. **Espaciado fuera de la celda:** en proyectos y casos (`src/components/projects/**`, `src/app/[locale]/proyectos/[slug]/page.tsx`) hay pasos de 4 px de Tailwind (`py-8`, `pl-12/16`, `gap-8`, `mb-4`, la regla del margen en `left-5/left-8`). El padding móvil del hero usa 25 px y la referencia numerada 28 px con gap de 8 px. Llévalos a la celda (múltiplos de 10/20 px, salvo trazos de 1–2 px y objetivos de 48 px). La referencia numerada puede quedar en 30 px.

## Verificación

- Todos los checks de `_COMMON.md`, **incluidos** `pnpm build:workers:production` y `pnpm test:e2e:workers:production`, y también `CONTACT_E2E_MOCK=1 pnpm exec playwright test tests/e2e/contact-provider.spec.ts` (con `PLAYWRIGHT_PORT=3221`).
- `impeccable detect` sin hallazgos nuevos.
- Capturas de producción en `.orchestration/audit/F04/` (webp): `/es` 1440 y 390; los 3 casos a 1440 y 390.
- No hagas push. Reporta con hc send t10.

## Alcance

`src/components/projects/**`, `src/app/[locale]/proyectos/[slug]/page.tsx`, `src/components/sections/profile-sections.tsx` (y su módulo), `src/components/hero/hero.module.css` (solo el padding móvil) y `tests/e2e/**`.
