# T03-hero — Hero «cuaderno abierto» + botón Iconiq reestilizado

## Contexto
- Lee `.orchestration/tasks/_COMMON.md` y todo lo que enumera. **El prototipo aprobado `.impeccable/mocks/decision/assigned.html` es el contrato del primer viewport** (FIRST VIEWPORT en el surface brief).
- Worktree: `/home/dragodeidad/Documents/portafolio-T03-hero` · Rama: `ux/T03-hero` · Dev server: puerto 3203 · e2e: `PLAYWRIGHT_PORT=3213`.

## Objetivo
Construir el hero como un cuaderno abierto con lomo cosido, siguiendo el prototipo y DESIGN.md:
- **Página izquierda:** nombre (display), rol con «backend» rodeado en tinta, descripción, 3 acciones (Ver proyectos como primaria de tinta rotada −1°; Descargar CV y Contactar subrayadas a pluma) y la lista de evidencia con marcas SVG (✓ estadía 2025 con el único resaltado; ○ Ingeniería en TI en curso; ✓ PWA UTT).
- **Página derecha:** notas de PWA UTT con la captura real `public/images/projects/pwa-utt/coordinacion-resumen-*.webp` pegada con cinta (+1°), el pie «Captura con datos sintéticos» y las 4 anotaciones aprobadas con flechas de tinta.
- Debajo arranca la sección siguiente (ya existente).
- Resuelve los hallazgos #2, #4 (hero), #5 (hero), #7, #11, #12 y #13 (CTA) del AUDIT.

Además:
- **Retira lo que DESIGN.md prohíbe:** `hud-visual.tsx`, `hud-disclosure.tsx`, `node-selector.tsx`, el marco HUD, `src/components/canvasui/` completo, `public/images/hud-glass-ring.svg`, el flag `NEXT_PUBLIC_ENABLE_HUD_GLASS` (en `.env.example` y en `next.config.ts` si aparece) y las dependencias `three` y `@types/three` (`pnpm remove three @types/three`; es una eliminación, no una dependencia nueva).
- Actualiza `docs/component-sources.md`: Glass Object, Bencho Action node y Tilt quedan como «Sustituido — rediseño Cuaderno 2026-11-17, contradicen DESIGN.md (Overlap Rule)». Iconiq Button queda como «Integrado, reestilizado».
- **Reestiliza `src/components/ui/b-button.tsx` en el lugar, sin renombrar variantes** (otras secciones las usan en paralelo):
  - `default` = relleno de tinta, texto print, 48 px, rotación −1°, press a 0.97 conservando la rotación.
  - `outline` y `secondary` = subrayado a pluma de 2 px en tinta, texto graphite que pasa a tinta en hover.
  - `link` = enlace de tinta.
  - Radio 0, sin ripple ni sombras, todo con tokens.
  - La API de props no cambia.
- **Imágenes:** usa `next/image` con dimensiones reservadas, `sizes` correcto y `priority` solo para la captura del hero.

## Alcance
- PUEDES tocar: `src/components/hero/**`, `src/components/canvasui/**` (eliminar), `src/components/ui/b-button.tsx`, `public/images/hud-glass-ring.svg` (eliminar), `package.json` y `pnpm-lock.yaml` (solo para quitar three), `.env.example`, `next.config.ts` (solo el flag), `docs/component-sources.md`, el namespace `Hero` de `messages/*.json`, `tests/e2e/hero-glass.spec.ts` y `tests/e2e/hero-nodes.spec.ts` (elimínalos o reemplázalos por `hero.spec.ts` con pruebas de comportamiento: acciones, CV descargable, foco y reduced-motion).
- PROHIBIDO: todo lo demás (incluidos `page.tsx`, `profile.ts` y `projects.ts`). El hero puede **leer** de `profile.ts` y `projects.ts`.

## Skills (en orden)
1. `/impeccable typeset` y `/impeccable layout` (primer viewport a 1440 y adaptación a 390/360: las páginas se apilan, la izquierda primero).
2. `animate` (dibujo de trazos y entrada del resaltador) y `emil-design-eng` (press y hover).
3. `/impeccable harden` (foco, reduced motion, sin JS) y `/impeccable audit` + capturas comparadas con `shots/assigned-1440.png`.

## Criterios de aceptación
- [ ] El primer viewport a 1440 corresponde al prototipo aprobado: cuaderno abierto, lomo, evidencia, captura con cinta y anotaciones.
- [ ] Sin «IA», sin HUD, sin three/GlassObject en el bundle; `pnpm why three` vacío.
- [ ] Las marcas son SVG (sin glifos) y hay un único resaltado.
- [ ] Ver proyectos es inequívocamente la primaria, y CV descarga el PDF existente.
- [ ] Trazos dibujados una vez; con reduced-motion, estáticos y visibles.
- [ ] b-button reestilizado sin romper las otras secciones (revisa visualmente proyectos, caso y contacto).
- [ ] Copia literal aprobada (ES/EN). Checks de `_COMMON.md` en verde.
