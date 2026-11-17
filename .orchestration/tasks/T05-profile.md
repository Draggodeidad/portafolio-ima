# T05-profile — Trayectoria, Sobre mí + stack, contacto, footer y orden de la home

## Contexto
- Lee `.orchestration/tasks/_COMMON.md` y todo lo que enumera.
- Worktree: `/home/dragodeidad/Documents/portafolio-T05-profile` · Rama: `ux/T05-profile` · Dev server: puerto 3205 · e2e: `PLAYWRIGHT_PORT=3215`.
- La navbar nueva (T02) ya está en `main`: Proyectos · Trayectoria · Sobre mí · Contacto. Hero (T03) y proyectos (T04) se rehacen en paralelo; no los toques.

## Objetivo
Llevar al mundo del cuaderno las secciones de perfil y cerrar la home. Resuelve los hallazgos #4 (orden), #8 (stack, sobre mí), #10, #14, #16, #17 y #18 del AUDIT:

- **Orden en `page.tsx`:** Hero → Proyectos → Trayectoria → Sobre mí (con el stack dentro, como subsección) → Contacto → Footer.
- **Trayectoria:** una página de cuaderno con la línea de tiempo marcada a tinta: ✓ estadía 1Degree Holdings 2025, ✓ TSU completado 2023–2025, ○ Ingeniería en TI en curso 2025–2027 (previsto), siempre con palabras junto a cada marca. Medida de lectura ≤ 70 caracteres (hoy son ~119). Corrige los dos h3 idénticos de la «Universidad Tecnológica de Tehuacán» para que se distingan por programa.
- **Sobre mí + stack:** el copy aprobado de «Cómo trabajo» y el stack en dos grupos («Con evidencia en proyectos», con contexto o enlace a su caso, y «También conozco: …» en una sola línea). Sin las 5 etiquetas «SIN CASO PUBLICADO», sin proficiencia ni porcentajes. Actualiza `src/content/profile.ts` según la estructura que necesites, sin cambiar hechos.
- **Contacto:** sección completa sin formulario. «Hablemos de una oportunidad», intro aprobada, CTA principal «Escríbeme» (`mailto:`) mostrando también la dirección, copiar correo (feedback con trazo, no con glifo), Descargar CV (español · PDF), GitHub y LinkedIn. **Sin hueco vacío** a 1440.
  - `ContactForm` sigue renderizándose **solo** cuando `/api/contact/config` devuelve una siteKey (hoy no en producción).
  - Restílalo al mundo (inputs de DESIGN.md: print sobre paper, borde ruled-line, etiqueta persistente, errores en `error` ligados por `aria-describedby`) y colócalo **debajo** del bloque de contacto, para que su aparición no reacomode el contenido de arriba.
  - Que el botón deshabilitado explique el motivo («Completa la verificación para enviar»).
  - No cambies la lógica de envío ni la API.
- **Footer:** sobre el escritorio, nombre y enlaces, sobrio.
- **Anclas:** `globals.css` ya aplica `scroll-padding-top` de 80 px. Quita los `scroll-mt-[...]` de tus secciones, que hoy suman doble desplazamiento.
- **Etiquetas:** `section-heading.tsx` pierde el kicker en mayúsculas (hallazgo #17): el título h2 va solo, opcionalmente con un subrayado a tinta.
- **Contenedor:** puedes adaptar `src/components/layout/container.tsx` al ancho del spread (`--content-width`), sin romper a quienes lo usan.

## Alcance
- PUEDES tocar: `src/components/sections/**`, `src/components/contact/**`, `src/components/layout/container.tsx`, `src/app/[locale]/page.tsx`, `src/content/profile.ts`, `docs/profile-content-sources.md` (solo si cambias la estructura), los namespaces `About`, `Stack`, `Experience`, `Contact` y `Footer` de `messages/*.json`, `tests/e2e/stage-5-profile-contact.spec.ts` y `tests/e2e/contact-provider.spec.ts` (comportamiento, no clases).
- PROHIBIDO: todo lo demás (`hero/**`, `projects/**`, `b-button.tsx`, `layout/navbar*`, `tokens.css`, `globals.css`).

## Skills (en orden)
1. `/impeccable layout` (ritmo entre secciones: una sección densa se gana una quieta; un solo ritmo de espaciado sobre la celda de 20 px) y `/impeccable typeset`.
2. `/impeccable harden` (formulario condicional, copiar correo, errores) y `break-ui` (organizaciones largas, muchas tecnologías, correo largo a 360: hallazgo #16).
3. `emil-design-eng` (feedback de copiar y press) y `/impeccable audit` + capturas.

## Criterios de aceptación
- [ ] Orden de la home y anclas correctas (un solo desplazamiento de 80 px) desde la nav y desde un caso.
- [ ] Trayectoria con marcas ✓/○ en SVG + palabras, h3 distinguibles y medida ≤ 70 caracteres.
- [ ] Stack en dos grupos, sin «SIN CASO PUBLICADO».
- [ ] Contacto completo sin formulario y sin hueco; el formulario condicional aparece debajo, sin reflow arriba, y explica el submit deshabilitado.
- [ ] Sin overflow a 360 con un correo de 75 caracteres (el botón envuelve o el texto rompe).
- [ ] Copia literal aprobada (ES/EN). Checks de `_COMMON.md` en verde, incluidas las dos specs e2e de contacto y perfil.
