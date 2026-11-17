# T04-projects — Proyectos y casos de estudio como páginas del cuaderno

## Contexto

- Lee `.orchestration/tasks/_COMMON.md` y todo lo que enumera.
- Worktree: `/home/dragodeidad/Documents/portafolio-T04-projects` · Rama: `ux/T04-projects` · Dev server: puerto 3204 · e2e: `PLAYWRIGHT_PORT=3214`.

## Objetivo

Rehacer la sección de proyectos de la home y la página de caso `/[locale]/proyectos/[slug]` en el mundo del cuaderno. Resuelve los hallazgos #5, #8 (casos), #10, #17 y #18 del AUDIT:

**Home:**

- PWA UTT como proyecto principal, con su captura real (`public/images/projects/pwa-utt/*.webp`) pegada con cinta y etiquetada como datos sintéticos.
- Secure Transfer y Classroom → GitHub como hojas secundarias con su diagrama.
- Un solo estilo de acción «Ver caso». Sin kickers ni avisos repetidos. Título «Proyectos y decisiones».

**Caso:**

- Lectura de cuaderno: título; «Mi aportación» y tecnologías justo debajo del título (antes del diagrama); en PWA UTT, una galería de 2–3 capturas pertinentes (sincronización, nueva inspección, inspecciones activas) con pies honestos.
- Diagramas redibujados como flujo direccional con flechas de tinta, siguiendo el orden real, y etiqueta breve «Diagrama».
- Secciones en primera persona según el copy aprobado. «Límites y siguiente paso» cierra con el siguiente paso aprobado.
- Medida de lectura ≤ 70 caracteres por línea.
- El CTA final no aterriza en el punto más bajo: pon el siguiente paso antes del CTA.

**Datos:** actualiza `src/content/projects.ts` con el copy aprobado (validation, limitations y títulos) **literal** en ES/EN. No inventes ni cambies hechos.

Usa `Button` de `@/components/ui/b-button` con las variantes existentes (`default`, `outline`, `link`). T03 lo está reestilizando en paralelo: no lo edites.

## Alcance

- PUEDES tocar: `src/components/projects/**`, `src/app/[locale]/proyectos/[slug]/page.tsx`, `src/content/projects.ts`, los namespaces `Projects` y `Studies` de `messages/*.json`, `docs/project-content-sources.md` (solo si cambias la forma de citar) y `tests/e2e/projects.spec.ts`.
- PROHIBIDO: todo lo demás (incluidos `b-button.tsx`, `page.tsx` de la home y `profile.ts`).

## Skills (en orden)

1. `/impeccable layout` y `/impeccable typeset` (jerarquía del caso, medida de lectura, ritmo de la cuadrícula).
2. `/impeccable clarify`, solo para aplicar el copy aprobado sin alterarlo.
3. `break-ui` con títulos largos, muchas tecnologías y un proyecto sin demo (simúlalo en el navegador; no dejes toggles en el código).
4. `/impeccable audit` + capturas de la home (sección de proyectos) y de los 3 casos a 1440/768/390/360.

## Criterios de aceptación

- [ ] Captura real de PWA UTT en la home y galería en su caso, todas etiquetadas como datos sintéticos, con `next/image` y dimensiones reservadas.
- [ ] «Mi aportación» antes del diagrama; diagramas con flujo direccional.
- [ ] Copy aprobado literal; sin «No se ejecutaron aquí» ni voz de auditor.
- [ ] Un solo estilo por tipo de acción; demo y código claramente distinguibles.
- [ ] Locale/slug desconocidos siguen devolviendo 404; metadatos por página intactos.
- [ ] Checks de `_COMMON.md` en verde.
