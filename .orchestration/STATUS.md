# STATUS — Rediseño UX/UI

Orquestador: Claude Code (terminal hc `t10`) · Implementador: Codex (`codex --no-daemon`, vía `hc`)
Prompt maestro: pegado en la sesión del 2026-11-17 (no guardado en el repo)
Última actualización: 2026-11-17

## Tareas

| ID  | Título                                                                  | Fase | Estado                  | Rama            | Terminal hc  | Notas                                                                            |
| --- | ----------------------------------------------------------------------- | ---- | ----------------------- | --------------- | ------------ | -------------------------------------------------------------------------------- |
| F0  | Setup y contexto                                                        | 0    | aprobado                | main            | —            | PRODUCT.md actualizado; Impeccable v4.9.1                                        |
| F1  | Auditoría (critique, audit, motion, break-ui, capturas)                 | 1    | aprobado                | main            | —            | AUDIT.md: 20 hallazgos; critique 21/32, audit 14/20                              |
| F2  | Dirección visual                                                        | 2    | aprobado                | main            | —            | A "Cuaderno profesional"; DESIGN.md aprobado; commit d7b94a5                     |
| P01 | Prototipos del hero (3 direcciones, HTML en .impeccable/mocks/decision) | 2    | terminado               | — (sin commits) | —            | 1 ronda de correcciones                                                          |
| T01 | Fundaciones (tokens, fuentes, base, assets PWA)                         | 3    | merged (c0dbe15)        | —               | —            | 1 ronda de correcciones; checks verdes                                           |
| C01 | Propuesta de copy ES/EN                                                 | 4    | aprobada                | main            | —            | Aprobada con las 3 frases de siguiente paso                                      |
| T02 | Navbar del cuaderno                                                     | 4    | merged (f4be7e2)        | —               | —            | 1 ronda (alineación al ancho del spread)                                         |
| T03 | Hero cuaderno abierto + b-button + retiro de three/HUD                  | 4    | merged                  | —               | —            | 1 ronda (flecha, acciones en una fila); main: lint/typecheck/format/build verdes |
| T04 | Proyectos y casos                                                       | 4    | ronda 1 de correcciones | ux/T04-projects | t04-projects | Más mundo cuaderno, galería más grande                                           |
| T05 | Trayectoria, Sobre mí + stack, contacto, footer, orden de la home       | 4    | en curso                | ux/T05-profile  | t05-profile  | dev 3205 / e2e 3215                                                              |

## Decisiones

- 2026-11-17 — Rediseño libre: el mundo "Perfil HUD, grafito + lima" y el Figma pasan a ser evidencia y anti-referencia.
- 2026-11-17 — Producción: sitio en Cloudflare Workers (imanolantonio.dev). El formulario de contacto NO se muestra en producción (`/api/contact/config` → `siteKey: null`); el usuario creía que estaba en vivo.
- 2026-11-17 — Assets: 8 capturas reales de PWA UTT en `pwa-img/` (datos sintéticos). La foto personal sigue pendiente (monograma IA).

- 2026-11-17 — GATE 1: entran los 4 grupos del AUDIT (jerarquía y evidencia; copy y franqueza; consistencia y a11y; motion). Condición del copy (#8): se le propone el texto al usuario y él lo aprueba antes de implementar. No inventar logros, métricas, fechas ni tecnologías que no estén ya en el sitio o en el CV.
- 2026-11-17 — Contacto: se diseña sin formulario (correo + CV + redes, sin hueco vacío). El formulario queda como mejora opcional; la config de producción está fuera de alcance.
- 2026-11-17 — Se borró `.gemini/` (creado por la actualización de Impeccable; no se usa Gemini CLI).

- 2026-11-17 — Dirección elegida: A "Cuaderno profesional" (seed:744984c2da4ede9a).

- 2026-11-17 — GATE 2 aprobado. Se retiran Glass Object, el vidrio de la navbar y Bencho (Tilt/Action node); Iconiq Button se queda, reestilizado. Actualizar `docs/component-sources.md` cuando se elimine el código.
- Nunca hacer push a `main` sin autorización: el push despliega a producción.

## Sustituciones de herramientas

- Taste (tasteskill 2.5.1) no incluye `draw.mjs`, `inspect.mjs` ni `assets.mjs`. Equivalentes: `start.mjs deal` (paletas y tipografías), `shoot.mjs` (capturas por ancho) y `photos.mjs` (imágenes con licencia).
