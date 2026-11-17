# P02-final-polish — QA final y polish de todo el sitio (Fase 7)

## Contexto
- Lee `.orchestration/tasks/_COMMON.md` y todo lo que enumera, más `.orchestration/AUDIT.md` (hallazgos originales y decisiones del GATE 1).
- Worktree: `/home/dragodeidad/Documents/portafolio-P02` · Rama: `ux/P02-final-polish` · Dev: puerto 3207 · e2e: `PLAYWRIGHT_PORT=3217`.
- Las secciones, la nav, el hero, los proyectos, los casos y el motion ya están en `main`. Esta es la última pasada sobre **todo el sitio** (home ES/EN y los 3 casos ES/EN). Es refinamiento, no rediseño: conserva la identidad, el copy aprobado y el comportamiento.

## Pasos (en orden; un commit por paso cuando haya cambios)
1. **`break-ui`:** contenido extremo en todo el sitio (títulos y organizaciones largos, muchas tecnologías, correo de 75 caracteres, textos EN más largos), simulado en el navegador sin dejar toggles en el código. Arregla lo que se rompa.
2. **`mobile-native`:** tap highlight, hover pegajoso, `100dvh`, zoom en inputs (font-size ≥ 16 px en el formulario condicional), `touch-action` y safe areas, a 360/390.
3. **`/impeccable harden`:** estados vacíos o ausentes (proyecto sin demo, sin CV, sin foto), errores, i18n (atributos `lang`, fechas) y foco. Sin JS: el contenido sigue legible y navegable.
4. **`/impeccable optimize`:**
   - Mide con build de producción (`pnpm build && pnpm start -p 3207`). Reporta LCP, CLS y JS total de la home a 390 con throttling (Lighthouse CLI si está disponible con `pnpm dlx`; no lo agregues como dependencia) y el peso de imágenes.
   - Ajusta `sizes`, `priority`, `fetchpriority` y el formato de imágenes.
   - Revisa que el botón Iconiq no infle el JS de páginas que no lo necesitan.
5. **`/impeccable polish`:**
   - Las páginas de Trayectoria, Sobre mí y Contacto deben llevar el margen rojo como las de proyectos, para que todo sea un solo cuaderno.
   - Ritmo vertical consistente sobre la celda de 20 px y una sola regla de espaciado entre secciones.
   - Alineación del borde izquierdo del contenido en todas las páginas.
   - Advisory del detector: `src/app/[locale]/proyectos/[slug]/page.tsx:21` usa un font-size fuera de la escala; usa un rol tipográfico.
   - **Retira los alias legacy** de `src/styles/tokens.css` (bloques `/* legacy aliases … */` en `:root` y en `@theme`), después de migrar los 3 usos restantes en `src/app/globals.css` y `src/components/ui/inline-code.tsx` a los nombres semánticos. Busca con `grep` que no quede ningún `portfolio-`, `bg-background`, `text-foreground`, `bg-surface`, `text-muted-foreground`, `border-border`, `*-accent*`, `font-mono`, `rounded-control`, `rounded-panel` ni `project-canvas`.
   - Actualiza `docs/styling.md` en consecuencia.
6. **Verificación final:** `impeccable detect --json src/app src/components` (si no te funciona el comando, usa `~/.agents/skills/impeccable/scripts/impeccable detect`) sin hallazgos nuevos. Capturas full-page en `.orchestration/audit/P02/` (webp) de `/es`, `/en` y `/es/proyectos/{pwa-utt,secure-transfer,classroom-github}` a 1440, 768, 390 y 360.

## Alcance
- PUEDES tocar: `src/**`, `messages/*.json` (solo para errores mecánicos; **no cambies el copy aprobado**), `docs/styling.md`, `docs/component-sources.md` y `tests/e2e/**` (comportamiento).
- PROHIBIDO: `DESIGN.md`, `PRODUCT.md`, `AGENTS.md`, `package.json` y `pnpm-lock.yaml` (sin dependencias nuevas), infra y despliegue (`wrangler.jsonc`, `vite.config.mts`, `.github/`, `workers/`) y la lógica de envío del contacto (`src/lib/contact/**`, `src/app/api/**`).

## Criterios de aceptación
- [ ] Sin roturas con contenido extremo a 360–1440 (lista lo que probaste).
- [ ] Todas las páginas del cuaderno comparten margen rojo, cuadrícula y alineación.
- [ ] Sin alias legacy; tokens solo semánticos.
- [ ] Métricas de rendimiento reportadas (antes y después de tus cambios), sin afirmar Lighthouse de producción.
- [ ] Checks de `_COMMON.md` en verde, con la suite e2e completa.
