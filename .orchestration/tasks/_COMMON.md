# Reglas comunes de las tareas de sección (Fase 4)

- **Lee primero:** `DESIGN.md`, `.impeccable/design.json`, `.impeccable/surfaces/src-app-locale-page-tsx.md` (contrato de dirección), `PRODUCT.md`, `AGENTS.md` (la sección «Rediseño 2026-11-17» manda), `docs/styling.md`, `.orchestration/copy/COPY-PROPUESTA.md` (**copy aprobado**: úsalo literal en ES y EN) y tu spec.
- **Referencia visual:** `.impeccable/mocks/decision/assigned.html` y `shots/assigned-1440.png`, el prototipo aprobado del hero. Es una referencia de mundo, no un layout para copiar en otras secciones.
- **Next 16 + vinext:** lee la guía relevante en `node_modules/next/dist/docs/` antes de tocar APIs de Next.
- **Tokens:** usa solo los de `src/styles/tokens.css` (nombres semánticos: `paper`, `ink`, `graphite`, `text-display`, `text-h2`…, celda de 20 px). En tus archivos, migra de los alias legacy a los nombres semánticos. No edites `tokens.css` ni `globals.css`; si necesitas un token nuevo, pídelo con `hc send t10`.
- **Convenciones:** objeto `styles` local, `cn()`, CSS Modules solo para efectos (trazos de tinta, cinta, cuadrícula). No uses `"use client"` salvo que haga falta interactividad real.
- **Trazos de tinta:** SVG irregulares en `ink`, de 2–2.5 px, con extremos redondeados. Se dibujan una sola vez (stroke-dashoffset, `--motion-ink-draw`, `--ease-ink`, escalonado `--motion-ink-stagger`, máximo 4 por vista). Con `prefers-reduced-motion`, ya dibujados. Nunca uses glifos de fuente (✓, ↗, ↓) como iconos.
- **Prohibido:** mono, eyebrows/kickers en mayúsculas, glass, blur, sombras difusas, gradientes en texto, monograma «IA», indicadores de disponibilidad, métricas inventadas y más de un resaltador por pantalla.
- **Accesibilidad:** AA, foco visible (el anillo global ya existe), objetivos táctiles ≥ 44 px (48 px para botones), teclado completo y headings en orden.
- **Messages:** edita solo tu namespace en `messages/es.json` y `messages/en.json`. Borra las claves que dejes de usar en tu namespace.
- **Tests:** puedes actualizar los tests e2e de tu sección para que prueben comportamiento, no clases CSS.
- **Verificación:** levanta tu propio dev server en el puerto de tu spec y toma capturas con Playwright (`node_modules/@playwright/test/index.mjs`) a 1440, 768, 390 y 360 en `.orchestration/audit/<ID>/` (webp, calidad ~72). Corre `/impeccable audit` sobre tus archivos y `impeccable detect`, y corrige lo mecánico.
- **Calidad:** `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm build` y tus specs e2e (`pnpm exec playwright test <archivo>`) en verde. Commits convencionales. **Nunca hagas push.** No agregues dependencias.
- **Reporte:** con `hc send t10`:

```
[<ID>] DONE | BLOCKED
Rama: ux/<ID> · Commits: <hashes>
Cambios: <archivos + 1 línea c/u>
Criterios: <✓/✗ por criterio>
Skills usadas: <lista>
Dudas / riesgos: <si hay>
```
