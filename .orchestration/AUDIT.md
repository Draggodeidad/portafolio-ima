# AUDIT — Estado actual del portafolio (Fase 1)

Fecha: 2026-11-17 · Rama auditada: `main` @ 29f1ec2 · Sin cambios en código.

Fuentes:

- `audit/critique-A.md`: revisión de diseño de un subagente aislado, sin ver el detector.
- `audit/critique-B.md`: detector de Impeccable (CLI + URL + overlay) y comprobaciones en el navegador.
- `audit/notes-orchestrator.md`: audit técnico, find-animation-opportunities, break-ui y comprobación de producción.
- Capturas del estado actual a 1440/768/390: `audit/before/`. Capturas de estrés: `audit/break-ui/`.

Sustituciones: Taste 2.5.1 no trae `inspect.mjs`, así que las capturas se tomaron con un script de Playwright. break-ui se hizo inyectando contenido en el DOM, sin el toggle de demo en código, para no tocar el repo.

## Puntuaciones

| Evaluación               | Resultado                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| Critique (Nielsen)       | **21/32 (66 %, Aceptable)**. Se marcaron n/a la 7 y la 10 (portafolio, una sola lectura) |
| Audit técnico            | **14/20 (Bueno)**: A11y 3 · Performance 3\* · Theming 3 · Responsive 3 · Integridad 2    |
| Detector (código fuente) | 0 hallazgos y 1 aviso (`codex-grid-background`, `hero.module.css:10`)                    |
| Detector (URL)           | Home: 6 avisos a 1440 y 5 a 390. Caso: 2 a 1440                                          |
| Carga cognitiva          | Alta: falla 4 de 8. Header con 10 controles; unos 17 objetivos en el primer viewport     |

\*Performance no se midió con build/Lighthouse. three.js va con import dinámico y detrás de flag (`NEXT_PUBLIC_ENABLE_HUD_GLASS`, apagado).

**Veredicto de especificidad:** el look es intercambiable con cualquier portafolio dev: Space Grotesk + JetBrains Mono, grafito con lima neón, corchetes, eyebrows mono, `[ 01 ]`, `///`, grid de papel y hexágono. Lo auténtico es el contenido (casos honestos y técnicos) y la mecánica de selector de nodos. Ninguna de las dos fuentes encontró fallos de contraste ni de overflow real.

## Hallazgos priorizados

Formato: hallazgo → evidencia → impacto → esfuerzo → skill. Orden: impacto alto y esfuerzo bajo primero. Columna **Cuándo**: D = se resuelve con la dirección de la Fase 2; I = tarea de implementación (Fases 3–5); X = fuera de diseño.

| #   | Hallazgo                                                                                                                                                                                          | Evidencia                                                                                    | Impacto | Esfuerzo | Skill                                                    | Cuándo |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------- | -------- | -------------------------------------------------------- | ------ |
| 1   | **El formulario de contacto no existe en producción**: `siteKey: null` y la columna derecha de #contacto queda vacía                                                                              | `curl https://imanolantonio.dev/api/contact/config`; `contact-form.tsx:188`                  | Alto    | S        | — (configurar Turnstile/Resend; requiere autorización)   | X      |
| 2   | **"IA" se lee como "Inteligencia Artificial"**: el monograma gigante bajo "PERFIL TÉCNICO … IA" contradice el posicionamiento de "todo es mío"                                                    | `hero.tsx:159-199`; `home-es-1440-fold.webp`                                                 | Alto    | S        | /impeccable shape → typeset                              | D      |
| 3   | **El punto lima "online" en la marca** se lee como indicador de disponibilidad, que PRODUCT.md prohíbe                                                                                            | `navbar-client.styles.ts:11`                                                                 | Medio   | S        | /impeccable distill                                      | D/I    |
| 4   | **Orden de evidencia mal para un escaneo de 30 s**: la pasantía 2025 queda en 5.º lugar, debajo del stack; el CV es un enlace mono diminuto; la mitad derecha del hero repite proyectos           | `page.tsx:41-48`; `hero.tsx:140-153`                                                         | Alto    | M        | /impeccable layout + distill                             | D/I    |
| 5   | **Las capturas reales de PWA UTT no se usan**; los diagramas son cajas sin secuencia y llevan avisos "DIAGRAMA, NO CAPTURA"                                                                       | `pwa-img/` (8); `project-visual.tsx`; `case1440`                                             | Alto    | M        | /impeccable layout; Taste (tratamiento de imagen)        | D/I    |
| 6   | **Disfraz HUD genérico** (corchetes, `[01]`, `///`, grid, hexágono, mono en exceso, lima con ~10 roles)                                                                                           | `hero.tsx:24,135-137`; `tokens.css:30-32`; detector `codex-grid-background`                  | Alto    | L        | Fase 2 (nueva dirección) → /impeccable colorize, typeset | D      |
| 7   | **Tracking del H1 a -0.055em en mayúsculas**: "IMANOLANTONIO" se lee pegado, y "DE LA CRUZ" en gris resta peso a la mitad del nombre                                                              | `hero.tsx:24`                                                                                | Medio   | S        | /impeccable typeset                                      | D/I    |
| 8   | **La franqueza suena a déficit y en voz de auditor**: "No se ejecutaron aquí" y "SIN CASO PUBLICADO" ×5; los límites no tienen siguiente paso; el caso termina en su punto más bajo antes del CTA | `projects.ts:226,235`; stack en `profile-sections.tsx`                                       | Alto    | M        | /impeccable clarify                                      | I      |
| 9   | **Exceso de opciones**: el header tiene 10 controles, "Contacto" y "Contactar" llevan al mismo sitio, y el menú móvil tiene 7 items                                                               | navbar a 1440 y 390                                                                          | Medio   | S        | /impeccable distill                                      | I      |
| 10  | **Estilos de acción inconsistentes**: "Ver caso" tiene 3 estilos, conviven botones cuadrados y redondeados, y el CTA del hero mezcla 3 alturas                                                    | `projects-section.tsx:125` vs `:200` vs `node-selector.tsx:200`                              | Medio   | M        | /impeccable polish (tras tokens)                         | I      |
| 11  | **Pistas ◀ ▶ falsas en el HUD**: parecen botones y no hacen nada                                                                                                                                  | `node-selector.tsx:185-192`                                                                  | Medio   | S        | /impeccable distill                                      | I      |
| 12  | **Foco débil en "Ver proyectos"**: anillo lima sobre relleno lima, sin offset                                                                                                                     | `hero.tsx:31` (`focus-visible:!ring-accent`)                                                 | Medio   | S        | /impeccable harden                                       | I      |
| 13  | **Objetivos táctiles menores de 44 px**: ES/EN 36×36, CTAs del hero 40 de alto, marca 42 (cumplen AA 2.5.8, no la meta de PRODUCT.md)                                                             | critique-B, a 390                                                                            | Medio   | S        | /impeccable adapt                                        | I      |
| 14  | **El formulario aparece tarde y desplaza el layout** (CLS). El submit queda deshabilitado sin explicar por qué, y para siempre si Turnstile está bloqueado                                        | `contact-form.tsx:74-85,188`                                                                 | Medio   | M        | /impeccable harden                                       | I      |
| 15  | **Kill global de reduced-motion a 0.01 ms**: elimina también el feedback útil                                                                                                                     | `globals.css:75-82`                                                                          | Medio   | S        | improve-animations / animate                             | I (F5) |
| 16  | **Botón Iconiq frágil con etiquetas largas** (sin salto de línea): 352 px de overflow a 360 con un correo largo                                                                                   | `audit/break-ui/_es-360.webp`; `b-button.tsx`                                                | Bajo    | S        | /impeccable harden; break-ui                             | I      |
| 17  | **Kicker sobre cada heading** (5×) y chip-eyebrow en el caso                                                                                                                                      | detector: `section-heading.tsx:2`, `projects-section.tsx:16`, `proyectos/[slug]/page.tsx:21` | Medio   | S        | /impeccable typeset                                      | D      |
| 18  | **Líneas demasiado largas**: ~119 caracteres en la trayectoria (1440) y ~86 en el cuerpo del caso                                                                                                 | detector: `profile-sections.tsx:58`, `proyectos/[slug]/page.tsx:52`                          | Bajo    | S        | /impeccable layout                                       | I      |
| 19  | **Estados que cambian de golpe**: menú móvil, detalle del selector de nodos, disclosure HUD móvil, "copiado"                                                                                      | notes-orchestrator §Motion (1–4)                                                             | Bajo    | S        | animate / choreograph                                    | I (F5) |
| 20  | **CV solo en español** para visitantes EN; la demo choca con login sin ruta de invitado                                                                                                           | critique-A, persona Riley                                                                    | Bajo    | —        | contenido (decisión del usuario)                         | X      |

## Lo que funciona (conservar)

1. **El contenido de los casos**: idempotencia, conflictos explícitos, AES-256-GCM/RSA, límites declarados. Columna de problema sticky y navegación anterior/siguiente.
2. **El selector de nodos** es un radiogroup real con flechas y `aria-live`, y conecta afirmaciones con pruebas. Es la mecánica gamer con sentido.
3. **Base de accesibilidad sólida**: contraste AA en todos los pares (mínimo 7.68:1), skip link, foco visible en 22 paradas, trap y Esc en el menú, sin overflow real a 360/390, un h1 por página y alt correctos.
4. **Tokens centralizados** en `tokens.css` con `@theme inline`; casi no hay valores sueltos.

## Pendientes sin verificar

- El formulario no se pudo ver en ningún entorno, porque no hay siteKey local ni en producción.
- Ni GlassObject/WebGL ni la performance de build (Lighthouse/bundle) se midieron.
- No se escanearon `/en/proyectos/*` ni las otras dos slugs.

## Decisión GATE 1 (2026-11-17)

- Entran: los hallazgos de dirección (2, 3, 6, 7, 17) vía Fase 2, y los grupos jerarquía y evidencia (4, 5, 9), copy (8), consistencia y a11y (10–14, 16, 18) y motion (15, 19).
- Copy (#8): se propone como texto y se aprueba antes de implementar. Solo hechos ya presentes en el sitio o en el CV.
- #1 y #14: contacto sin formulario; no se reserva un hueco para él. #20 sigue fuera de alcance.
