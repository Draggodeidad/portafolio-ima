# M01-motion — Pasada de motion (Fase 5)

Plan generado con `improve-animations` sobre el commit `ba917e0`. Son 4 planes pequeños en una sola tarea y en serie: un commit por plan.

## Contexto

- Lee `.orchestration/tasks/_COMMON.md`, `DESIGN.md` (motion: tinta 500 ms, escalonado 80 ms, resaltador 400 ms, press 120/160 ms, escala 0.97) y `.impeccable/design.json` (sección motion).
- Worktree: `/home/dragodeidad/Documents/portafolio-M01` · Rama: `ux/M01-motion` · Dev: puerto 3206 · e2e: `PLAYWRIGHT_PORT=3216`.
- Curva ease-out de referencia para UI: `cubic-bezier(0.23, 1, 0.32, 1)`. Si necesitas un token nuevo, solo puedes agregar `--ease-out-ui` en `src/styles/tokens.css`; no cambies los existentes.
- Solo `transform` y `opacity` (más `stroke-dashoffset` en los trazos). Nada de `transition: all`, `scale(0)` ni `ease-in` en UI.

## Plan 001 [MEDIUM · Accesibilidad] — Sustituir el apagado global de reduced-motion

- **Dónde:** `src/app/globals.css:69-77`. Hoy, con `prefers-reduced-motion: reduce`, fuerza `animation-duration: 0.01ms` y `transition-duration: 0.01ms` con `!important` en todo `*`. Eso también mata transiciones útiles de color y opacidad (hallazgo #15 del AUDIT).
- **Cambio:** deja en ese bloque solo `scroll-behavior: auto`. Cada componente ya trae su propia alternativa. Verifícalo antes de quitar el bloque:
  - `hero.module.css:161`
  - `project-visual.module.css:13`
  - `profile-sections.module.css:17`
  - `b-button.tsx`, que usa `useReducedMotion`
  - `navbar-client`, después del plan 004
- **Mismo archivo:** el bloque `/* Legacy focus override … */` con `:focus-visible { … !important }`. Las secciones ya migraron: elimínalo si, tras quitarlo, el foco sigue visible en todos los controles (navbar, hero, proyectos, caso, contacto y footer). Compruébalo tabulando a 1440 y 390. Si algún control pierde el foco visible, corrige ese control y no restaures el override.
- **Commit:** `fix(a11y): replace global reduced-motion kill with component alternatives`

## Plan 002 [MEDIUM · Propósito] — Trazos que se dibujan donde nadie los ve

- **Dónde:**
  - `src/components/projects/project-visual.module.css:1-26`: `.inkStroke` anima `stroke-dashoffset` al cargar la página.
  - `src/components/sections/profile-sections.module.css:1-20`: `.mark` hace lo mismo.
- **Problema:** en la home, Proyectos, Trayectoria y Sobre mí están bajo el pliegue. Las animaciones terminan antes de que el visitante llegue, así que es coste sin propósito. La firma de dibujo vive en el hero (máximo 4 trazos por vista).
- **Cambio:**
  - `profile-sections.module.css`: quita la animación; la marca se ve ya dibujada (sin `stroke-dasharray` ni `animation`).
  - `project-visual.module.css`: el dibujo solo ocurre en la página de caso, donde el diagrama aparece en el primer o segundo viewport. Haz que la regla de animación aplique solo bajo un ancestro `[data-ink-draw]` y agrega `data-ink-draw` al contenedor del diagrama en `src/app/[locale]/proyectos/[slug]/page.tsx`. En la home, las flechas aparecen estáticas. Respeta el máximo de 4 trazos animados: si el diagrama tiene más flechas, anima las 4 primeras y deja el resto estáticas.
  - Mantén el bloque de reduced-motion: estático y visible.
- **Commit:** `refactor(motion): draw ink strokes only where they are seen`

## Plan 003 [MEDIUM · Cohesión] — Feedback de press según DESIGN.md

- **Dónde:**
  - `src/components/ui/b-button.tsx:293`: `pressScale` es `0.96`.
  - `src/components/ui/b-button.tsx:485-488`: `hoverLift = { y: -1 }` en todas las variantes salvo `link`.
- **Cambio:**
  - `pressScale` pasa a `0.97`, con entrada de 120 ms y salida de 160 ms (`--motion-press-in` / `--motion-press-out`), curva ease-out UI.
  - El press debe **conservar** la rotación −1° de la variante `default`. Verifica que la escala de motion no borre el `rotate` de la clase; si lo hace, pasa la rotación por el `style`/`animate` de motion (`rotate: -1`).
  - Elimina `hoverLift`: en el cuaderno, el hover cambia el color de la tinta y no levanta el papel.
  - Hover solo con `(hover: hover) and (pointer: fine)`.
- **Dónde también:** `src/components/sections/profile-sections.tsx:36`. `styles.primary` es un botón propio con `active:translate-y-px`, inconsistente con el sistema. Sustitúyelo por `Button` de `@/components/ui/b-button` (variante `default`) con la misma acción `mailto:`.
- **Commit:** `fix(motion): align press feedback with notebook tokens`

## Plan 004 [Oportunidad · Consistencia espacial] — El menú móvil aparece de golpe

- **Dónde:** `src/components/layout/navbar-client.styles.ts:23-29`.
  - `mobileNav` alterna `invisible` ↔ `visible` sin transición.
  - Las líneas del icono rotan sin transición.
- **Cambio:**
  - Panel abierto: `opacity 0→1` y `translateY(-8px)→0`, 200 ms, curva ease-out UI.
  - Cierre: 150 ms, misma curva.
  - Usa transiciones CSS, no keyframes, para que abrir y cerrar rápido retarguee sin saltos. `visibility` debe cambiar al final del cierre (`transition-behavior` o retraso de `visibility`) para no romper el `inert` ni el foco.
  - Icono: `transition-transform` de 200 ms con la misma curva.
  - Reduced-motion: solo opacidad, 150 ms.
  - No cambies la lógica (trap, Escape, `inert`, `aria-expanded`).
- **Commit:** `feat(motion): bridge the mobile menu open and close`

## Verificación

- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm build`, y e2e de `navbar-mobile`, `hero`, `projects` y `stage-5-profile-contact`, todo en verde.
- **Revisión de sensación:**
  - Graba en Playwright a 0.25× (`page.clock` o `emulateMedia` + capturas por frame) la apertura y el cierre del menú, y el press del botón primario.
  - Comprueba que la rotación −1° se mantiene durante el press.
  - Con `reducedMotion: 'reduce'`, todo aparece estático y legible.
- **Performance:** en Chrome Performance (`page.tracing` o el CDP de Playwright), sin layout ni paint en cada frame durante la apertura del menú; solo composite.
- Capturas en `.orchestration/audit/M01/` (webp).

## Alcance

PUEDES tocar:

- `src/app/globals.css`
- `src/styles/tokens.css` (solo para agregar `--ease-out-ui`)
- `src/components/projects/project-visual.module.css`
- `src/app/[locale]/proyectos/[slug]/page.tsx` (solo el atributo)
- `src/components/sections/profile-sections.module.css`
- `src/components/sections/profile-sections.tsx` (solo el botón primario de contacto)
- `src/components/ui/b-button.tsx`
- `src/components/layout/navbar-client.styles.ts`
- `src/components/layout/navbar-client.tsx` (solo clases de transición, si hace falta)
- tests e2e de comportamiento afectados

PROHIBIDO: todo lo demás.

Reporte con el formato de `_COMMON.md`, incluyendo los resultados de la revisión de sensación.
