# F01-finish-fixes — Correcciones de la revisión final (disposición: fix)

## Contexto
- Lee `.orchestration/tasks/_COMMON.md` y todo lo que enumera.
- Lee las tres revisiones: `.orchestration/audit/critique-A-after.md`, `.orchestration/audit/critique-B-after.md` y el resumen del finish reviewer de abajo.
- Worktree: `/home/dragodeidad/Documents/portafolio-F01` · Rama: `ux/F01-finish-fixes` · Dev: 3208 · e2e: `PLAYWRIGHT_PORT=3218`.
- **Conserva el hero tal cual**: spread, lomo, margen, «backend» rodeado, botón rotado, captura con cinta y evidencia ✓/○. Cada corrección **extiende ese mundo hacia abajo**, no lo reemplaza.
- **No cambies el copy aprobado.** Puedes reordenar, ocultar visualmente con `sr-only` (conservando el texto para lectores de pantalla) o resaltar una parte de un texto existente. No reescribas frases. Si una corrección exige texto nuevo, no lo inventes: anótalo en el reporte como «requiere copy».

## Correcciones (en orden de impacto; un commit por grupo)

1. **Casos como spread del cuaderno** (`src/app/[locale]/proyectos/[slug]/page.tsx`, `src/components/projects/**`).
   - Orden de lectura: título, aportación y tecnologías; luego **Problema y alcance antes de los visuales**.
   - Desde 1280 px, el cuerpo es un spread de dos páginas con lomo (reutiliza la gramática del hero). Página izquierda: el razonamiento (problema, arquitectura, decisiones, validación, límites y siguiente paso). Página derecha: el diagrama a tinta y las capturas con cinta, junto al texto que prueban. Agrega flechas de tinta desde 1–2 decisiones hacia la evidencia que las respalda.
   - En móvil, apilado: texto primero y visuales intercalados después de su sección.
   - Los h2 del caso usan `text-h2` (hoy se ven de 14 px).
   - Las chips de tecnologías dejan de ser chips bordeadas: van como una línea de texto con separadores, o como etiquetas a tinta.
2. **Diagramas a tinta** (`project-visual.tsx` / `.module.css`).
   - Nodos como recuadros SVG dibujados a mano en tinta (trazo irregular, sin relleno blanco ni bordes grises de UI, sin panel interior), conectados por las mismas flechas de tinta del hero. Etiquetas en texto tipografiado.
   - Usa `pathLength="1"` con `stroke-dasharray: 1` en lugar de longitudes fijas (aplícalo también a los trazos del hero, que hoy usan 250 y 80 fijos).
   - El dibujo animado solo ocurre si el diagrama está en el primer viewport del caso. Si queda bajo el pliegue, va estático; no agregues JS de observador.
3. **Proyectos en la home como spread** (`projects-section.tsx`).
   - Nada de tarjetas gemelas. PWA UTT va como spread: afirmación y aportación a la izquierda; captura con cinta a la derecha. **Usa una captura distinta a la del hero** (p. ej. `nueva-inspeccion` o `inspecciones-activas`) y **no repitas las anotaciones del hero**: deja la línea de aportación con su ✓, sin las dos notas duplicadas.
   - Secure Transfer y Classroom → GitHub van como una sola página siguiente, con pesos distintos (no dos cajas iguales) y su diagrama a tinta.
   - Secure Transfer: la demo ausente aparece como marca **tachada** «Demo» con su razón en palabras (texto existente: «Demo no disponible · base de datos eliminada» o el equivalente que ya esté en `projects.ts`).
4. **Un resaltado por pantalla** sobre la evidencia más fuerte de cada pantalla (proyectos: la aportación de PWA UTT; trayectoria: la estadía), y nunca dos visibles a la vez.
5. **Evidencia del hero** (`hero.tsx`, `hero.module.css`).
   - Los prefijos «Verificado:» y «En curso:» pasan a `sr-only`: la marca ✓/○ ya lo dice.
   - El resaltado cubre solo la afirmación en negrita (p. ej. «estadía en desarrollo backend y transformación digital»), como trazo inline, con padding vertical de al menos 2–4 px (corrige el `cramped-padding` del detector). El resto de la línea queda en texto normal.
   - La flecha de «Ver proyectos» lleva separación del texto (10 px).
6. **Trayectoria:** quita las etiquetas visibles «Completado» / «En curso» sobre cada h3 (`profile-sections.tsx:~124`). La marca ✓/○ lleva el estado; el texto queda en `sr-only`.
7. **Acciones:** un solo estilo por tipo.
   - «Ver caso» con un único subrayado a pluma (hoy es doble).
   - El CV es el mismo componente en el hero y en contacto.
   - Los enlaces externos (GitHub, LinkedIn, demo y código) llevan una flecha ↗ y la descarga del CV una ↓, siempre como trazos SVG, nunca glifos.
   - «Abrir aplicación» del caso PWA: renderiza junto al botón la nota de estado que ya existe en `projects.ts` (la demo requiere iniciar sesión) y convierte el botón en secundario, porque lleva a un muro de login.
8. **Espaciado:** el h2 «Cómo trabajo» tiene ~8 px hasta su párrafo y las demás secciones ~30 px. Iguálalos sobre la celda.
9. **Alt:** el alt de las capturas no debe repetir el figcaption. Alt breve y descriptivo; el pie conserva «Captura con datos sintéticos».

## Fuera de alcance (no lo hagas)
- Reescribir frases (voz de Secure Transfer, «Validación documentada», heading «Formación y experiencia» frente a la nav «Trayectoria»). Anótalo como «requiere copy».
- Tokens, `DESIGN.md`, `PRODUCT.md`, `AGENTS.md`, dependencias, infra y API de contacto.

## Alcance
- PUEDES tocar: `src/components/**`, `src/app/[locale]/**` (sin tocar metadata ni rutas), `src/content/projects.ts` y `src/content/profile.ts` (solo estructura, sin cambiar texto), `messages/*.json` (solo mover claves; sin texto nuevo) y `tests/e2e/**`.

## Verificación
- Checks de `_COMMON.md` y la suite e2e completa.
- `impeccable detect` sin hallazgos nuevos (`cream-palette` y `repeating-stripes-gradient` son deliberados).
- **Capturas desde build de producción** (`pnpm build && pnpm start -p 3208`), no desde el dev server, en `.orchestration/audit/F01/`:
  - `/es` a 1440 y 390 (full page)
  - `/es/proyectos/pwa-utt` y `/es/proyectos/secure-transfer` a 1440 y 390
  - copia `/es` 1440 → `.impeccable/review/desktop.png` y 390 → `.impeccable/review/mobile.png` (png)
