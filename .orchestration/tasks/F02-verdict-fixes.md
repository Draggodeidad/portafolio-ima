# F02-verdict-fixes — Ronda final del finish review

## Contexto

- Lee `.orchestration/tasks/_COMMON.md`. Worktree: `/home/dragodeidad/Documents/portafolio-F02` · Rama: `ux/F02-verdict-fixes` · Puerto: 3209 · e2e: `PLAYWRIGHT_PORT=3219`.
- Es la última ronda. Corrige solo esto, sin rediseñar ni cambiar el copy aprobado.

## Correcciones

1. **[Grave] Texto perdido en móvil.** En `src/components/hero/hero.module.css` (~líneas 85 y 128–135), el resaltado inline (`<strong className={styles.highlight}>`) anima con `clip-path: inset()`. Al partirse en varias líneas, a 390 y 360 px solo se ve la primera («estadía en desarrollo backend y») y desaparece «transformación digital».
   - Sustituye el barrido por `background-image: linear-gradient(var(--highlighter), var(--highlighter))` con `background-size` de `0% 100%` a `100% 100%`, `background-repeat: no-repeat` y `box-decoration-break: clone` (más `-webkit-box-decoration-break`).
   - Con reduced-motion, el resaltado aparece completo y estático.
   - Verifica a 360, 390, 768 y 1440 que todo el texto es visible, también en EN.
2. **Mayúscula inicial.** Al ocultar con `sr-only` los prefijos «Verificado:» y «En curso:», las líneas visibles de evidencia empiezan en minúscula («estadía…», «implementación…»). Capitaliza la primera letra visible solo en CSS (`::first-letter` en el span visible, o `text-transform` en un span de la primera letra), sin cambiar los mensajes. Hazlo en ES y EN.
3. **«Contactar» baja de línea a 1440.** Las tres acciones del hero deben compartir fila desde 1280 px, como antes de F01.
4. **Acciones del caso desalineadas.** La nota de la demo bajo «Abrir aplicación» desplaza «Ver código» unos 10 px. Alinea las dos acciones en la misma línea base y pon la nota debajo del grupo de acciones (no dentro de una sola columna).
5. **Flecha de decisión a evidencia (caso).** La flecha actual es un gancho de ~30 px junto al lomo que no apunta a nada legible. Haz una flecha de tinta legible, con trazo irregular y punta, que vaya desde el bloque «Decisiones técnicas» hasta la captura o el diagrama que la respalda en la página derecha. Si no puede ser legible en desktop, quítala; mejor nada que un gancho sin destino. En móvil no se muestra.
6. **Página derecha en blanco en el caso.** Desde «Validación documentada» hacia abajo, la página derecha queda vacía (~600 px). Cierra el spread donde acaba la evidencia: las secciones siguientes continúan en una sola página a todo el ancho de lectura (≤ 70 caracteres por línea, alineadas al margen), sin una mitad vacía.

## Verificación

- Checks de `_COMMON.md`, la e2e completa y `impeccable detect` sin hallazgos nuevos.
- Capturas **de producción** (`pnpm build && pnpm start -p 3209`) en `.orchestration/audit/F02/` (webp): `/es` y `/en` a 1440, 390 y 360; `/es/proyectos/pwa-utt` a 1440 y 390.
- Copia `/es` 1440 → `.impeccable/review/desktop.png` y 390 → `.impeccable/review/mobile.png` (png).
- Reporta con hc send t10.

## Alcance

`src/components/hero/**`, `src/app/[locale]/proyectos/[slug]/page.tsx`, `src/components/projects/**` y `tests/e2e/**`. Nada más.
