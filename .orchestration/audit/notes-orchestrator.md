# Notas del orquestador — Fase 1 (2026-11-17)

## Producción

- `https://imanolantonio.dev/api/contact/config` → `{"siteKey":null}`: el formulario de contacto no se renderiza en producción (`contact-form.tsx:188`). En desktop, la columna derecha de #contacto queda vacía (captura `prod-contact` en el scratchpad de la sesión).

## Código (audit técnico)

- Tokens: centralizados en `src/styles/tokens.css` (`@theme inline`). Hay pocos valores sueltos: sombra `shadow-[0_20px_25px_-5px_rgb(0_0_0/0.1)]` (`projects-section.tsx:22`), `rgb(26 28 30 / 90%)` (`hero.module.css:222`) y `#066aff` (GlassObject, highlight azul ajeno a la paleta).
- Tipografía: hay muchos trackings arbitrarios (0.08/0.09/0.1/0.11/0.12em; -0.03/-0.035em) sin escala. Space Grotesk se usa para display y cuerpo, y JetBrains Mono en exceso: etiquetas, nav, tags, diagramas y CTA secundario.
- Motion: `motion` solo se usa en b-button (ripple, blur del spinner). El kill global de `prefers-reduced-motion` a 0.01ms (`globals.css:75-82`) anula también el feedback útil. Hay un `signal-travel` keyframe en el hero.
- Cliente: 8 archivos con "use client"; el layout raíz está libre. three.js (GlassObject) se importa dinámicamente en `hud-visual.tsx:9`.
- Imágenes: solo `next/image` en el hero (retrato pendiente). No hay capturas reales de proyectos; las de `pwa-img/` están sin usar.

## break-ui (estrés de contenido inyectado en el DOM, sin tocar código)

Probé a 360/768/1440 en /es, /en y /es/proyectos/pwa-utt: títulos de proyecto de 100 caracteres, más de 8 tags extra, organizaciones largas, h1 con apellido compuesto y correo de 75 caracteres.

- 768 y 1440: sin overflow.
- 360: overflow horizontal de 352 px en home y de 257 px en el caso. La causa es el botón Iconiq (`b-button`, texto sin salto) con etiquetas largas (correo), en #contacto y en el CTA "¿Quieres hablar de este proyecto?". El correo real (25 caracteres) cabe; el fallo es la fragilidad del botón.
- Las tags largas, los títulos largos y los nombres compuestos envuelven bien. El h1 del caso no tiene `overflow-wrap` para palabras sin espacios (riesgo bajo).
- Capturas en `.orchestration/audit/break-ui/`.

## Motion — find-animation-opportunities

| #   | Ubicación                                                   | Hoy                                                    | Propósito             | Frecuencia | Motion sugerido                                                                                                           |
| --- | ----------------------------------------------------------- | ------------------------------------------------------ | --------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | `navbar-client.tsx:281` (panel móvil)                       | El panel aparece y desaparece al instante              | Consistencia espacial | Ocasional  | `opacity 0→1` + `translateY(-8px)→0`, 220ms `cubic-bezier(0.23,1,0.32,1)`; salida 160ms; con reduced-motion, solo opacity |
| 2   | `node-selector.tsx` (detalle del área elegida)              | El texto del área cambia de golpe                      | Indicación de estado  | Ocasional  | Crossfade `opacity` + `translateY(4px)`, 160ms ease-out, con retarget por transición                                      |
| 3   | `hud-disclosure.tsx` (disclosure móvil)                     | El contenido se abre de golpe; solo rota el chevron    | Evitar cambio brusco  | Ocasional  | `grid-template-rows 0fr→1fr` + opacity, 240ms `cubic-bezier(0.23,1,0.32,1)`                                               |
| 4   | `copy-email-button.tsx:56`                                  | El icono cambia a "copiado" sin puente                 | Feedback              | Raro       | Icono `scale(0.9)+opacity 0 → 1`, 150ms ease-out; vuelve tras 2 s                                                         |
| 5   | `contact-form.tsx:188`                                      | El formulario aparece tras un fetch y empuja el layout | Evitar cambio brusco  | Raro       | Reservar el espacio primero (layout) y luego un fade de 200ms; no animar la altura                                        |
| 6   | CTAs (`projects-section.tsx:42`, `profile-sections.tsx:68`) | Los enlaces-botón no responden a `:active`             | Feedback              | Decenas    | `:active { transform: scale(0.97) }`, 140ms ease-out; hover gated a `(hover:hover) and (pointer:fine)`                    |

Rechazados:

- Fade-in de secciones al hacer scroll: lo prohíbe el brief y estorba la lectura (función).
- Indicador activo deslizante de la navbar al hacer scroll: se dispara de forma continua y mete ruido de movimiento (frecuencia).
- Stagger en las tablas del stack o en la línea de tiempo: es información que se lee (función).
- Animación continua en los diagramas de proyecto: es decoración sobre contenido explicativo (función).
- Entrada coreografiada del hero: queda pendiente de la dirección de la Fase 2; si entra, una sola entrada de 600ms como máximo y sin bloquear la lectura.

Veredicto: el sitio necesita poco motion. La mayor palanca es dar puente a los estados que hoy cambian de golpe (1–3) y sustituir el kill global de reduced-motion por alternativas suaves. Con el rediseño, este plan se rehace en la Fase 5.
