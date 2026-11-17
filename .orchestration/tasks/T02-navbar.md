# T02-navbar — Navegación del cuaderno

## Contexto
- Lee `.orchestration/tasks/_COMMON.md` y todo lo que enumera.
- Worktree: `/home/dragodeidad/Documents/portafolio-T02-navbar` · Rama: `ux/T02-navbar` · Dev server: puerto 3202 · e2e: `PLAYWRIGHT_PORT=3212`.

## Objetivo
Rehacer la navbar según DESIGN.md (sección Navigation) y la copia aprobada. Resuelve los hallazgos #3, #9 y #13 (parte de nav) del AUDIT:
- Barra sobre el escritorio (desk), 80 px de alto.
- Marca a la izquierda: texto «Imanol De la Cruz» en peso 800, enlazado al inicio. Sin monograma «IA» ni punto de estado.
- Enlaces Proyectos · Trayectoria · Sobre mí · Contacto. Una sola entrada de contacto. Sin botón GitHub en la barra (GitHub vive en Contacto).
- Selector ES/EN como texto plano que conserva la página equivalente.
- Sección activa con subrayado a pluma de 2 px en tinta (IntersectionObserver).
- Hover gated a `(hover:hover) and (pointer:fine)`.
- Sin vidrio: elimina `navbar-glass.module.css`.

**Móvil:** DESIGN.md propone enlaces con scroll horizontal. Evalúalo frente al menú actual, que ya tiene focus trap, Escape y tests. Elige lo más usable a 360 px con objetivos de 44 px, justifícalo en el reporte y deja los tests de comportamiento correspondientes en verde.

## Alcance
- PUEDES tocar: `src/components/layout/navbar.tsx`, `navbar-client.tsx`, `navbar-client.styles.ts`, `navbar-glass.module.css` (eliminar), `src/lib/i18n/sections.ts` (orden y entradas de la nav; los ids de sección existentes deben seguir existiendo porque `page.tsx` los usa), el namespace `Navigation` de `messages/es.json` y `messages/en.json`, y `tests/e2e/navbar-mobile.spec.ts`.
- PROHIBIDO: todo lo demás.

## Skills (en orden)
1. `/impeccable layout` y `/impeccable adapt` (nav desktop/móvil, 360–1440).
2. `emil-design-eng` y `mobile-native` (estados de press/hover, tap highlight, sticky hover).
3. `/impeccable audit` + capturas.

## Criterios de aceptación
- [ ] Nav con 4 secciones + ES/EN, una sola entrada de contacto, sin «IA», sin punto de estado, sin GitHub y sin vidrio.
- [ ] Estado activo con forma (subrayado) además de color; `aria-current` correcto.
- [ ] Teclado completo; con menú móvil: trap, Escape y devolución del foco. Objetivos ≥ 44 px a 360.
- [ ] El cambio de idioma conserva la página y el ancla.
- [ ] `scroll-margin`/`scroll-padding` correctos con la nav de 80 px.
- [ ] Copia literal de la propuesta aprobada (ES/EN).
- [ ] Checks de `_COMMON.md` en verde.
