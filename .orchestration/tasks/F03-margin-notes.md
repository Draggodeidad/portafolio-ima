# F03-margin-notes — Notas al margen y referencias numeradas (decisión del usuario, GATE FINAL)

## Contexto
- Lee `.orchestration/tasks/_COMMON.md`. Worktree: `/home/dragodeidad/Documents/portafolio-F03` · Rama: `ux/F03-margin-notes` · Puerto: 3210 · e2e: `PLAYWRIGHT_PORT=3220`.
- Regla del usuario (cita): «El espacio vacío no se rellena con decoración. Si una columna queda vacía, se reacomoda contenido ya publicado (notas al margen) o se angosta el layout. Las relaciones entre elementos se marcan con referencias numeradas legibles, no con flechas que dependan de la posición.»
- **Sin texto nuevo.** Solo reacomodas contenido ya publicado. Si algo necesitara texto nuevo (palabras, no números), no lo hagas y anótalo como «requiere copy» en el reporte.
- Se mantiene la medida de lectura del texto principal (≤ 70 caracteres por línea).

## Cambios
1. **Trayectoria** (`src/components/sections/profile-sections.tsx` y su módulo):
   - Desde 1024 px: texto principal a la izquierda (≤ 70 caracteres) y, en la columna derecha, **notas al margen alineadas con cada entrada**: fechas, lugar/modalidad y el estado ✓/○ (con su texto `sr-only`, como hoy). Todo sale de los datos ya publicados en `profile.ts`.
   - En móvil, las notas van encima o debajo del título de cada entrada, en una línea.
   - No dupliques la información: lo que pasa al margen sale del cuerpo.
2. **Contacto:** desde 1024 px, el texto (título e intro) a la izquierda y, a la derecha, **el bloque principal de acciones**: correo con «Escríbeme» como primaria, copiar correo, CV, GitHub y LinkedIn. En móvil, texto primero y acciones después. El formulario condicional (si hay siteKey) sigue debajo de todo.
3. **Cómo trabajo + stack:** si no hay contenido publicado que sirva como nota al margen, la página usa un ancho más angosto y centrado (sin columna vacía). No inventes notas.
4. **Casos: referencias numeradas en lugar de flechas** (`src/app/[locale]/proyectos/[slug]/page.tsx`, `src/components/projects/**`).
   - Marca con un número en círculo de tinta (①, ②… dibujado en SVG o tipografiado con borde circular, no un glifo Unicode suelto) la decisión o afirmación en la página izquierda y el **mismo número** junto a la evidencia (captura o paso del diagrama) en la derecha.
   - **Empareja solo cuando la evidencia muestra realmente esa decisión.** Por ejemplo, en PWA UTT la cola de sincronización ↔ la captura «Sincronización». Si una decisión no tiene evidencia visual, no lleva número. Máximo 3 por caso.
   - Accesibilidad: el número es texto real (lectores de pantalla leen «1»), con el mismo tamaño y legibilidad a 390 px. No depende del color (va con forma y número) ni de la posición (en móvil, donde todo se apila, el número sigue presente en ambos lados).
   - Sin texto nuevo: no agregues frases como «Ver evidencia». Si crees que hace falta un `aria-label` con palabras, anótalo como «requiere copy» y no lo agregues.
5. Revisa que siga habiendo **un solo resaltado por página** (decisión del usuario: hero en la home y «Mi aportación» en cada caso).

## Verificación
- Checks de `_COMMON.md`, la e2e completa y `impeccable detect` sin hallazgos nuevos.
- Capturas **de producción** (`pnpm build && pnpm start -p 3210`) en `.orchestration/audit/F03/` (webp): `/es` y `/en` a 1440, 1024, 390 y 360 (full page); los 3 casos ES a 1440 y 390 (full page).
- Copia `/es` 1440 full → `.impeccable/review/desktop.png` y 390 full → `.impeccable/review/mobile.png` (png, **full page**).
- Reporta con hc send t10.

## Alcance
`src/components/sections/**`, `src/components/contact/**`, `src/components/projects/**`, `src/app/[locale]/proyectos/[slug]/page.tsx`, `src/content/profile.ts` y `src/content/projects.ts` (solo estructura o metadatos de emparejamiento, sin texto nuevo) y `tests/e2e/**`.
