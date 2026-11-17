# P01 — Prototipos del hero en 3 direcciones (Fase 2)

## Contexto

- Lee primero: `PRODUCT.md`, `.orchestration/AUDIT.md` y este archivo.
- Es una exploración: **no toques `src/`, `public/`, `messages/` ni ningún archivo versionado**. Todo va en `.impeccable/mocks/decision/`. No hace falta worktree ni rama.
- Es un rediseño libre: el look actual (grafito + lima, HUD, corchetes, mono en exceso) es **anti-referencia**. No reutilices nada de él.

## Objetivo

Construir 3 archivos HTML autocontenidos con el **primer viewport (hero + inicio de la sección siguiente)** del portafolio, uno por dirección. El usuario los comparará en el navegador para elegir. Deben resolver los hallazgos #2, #4, #5 y #7 del AUDIT:

- Nada de monograma "IA".
- Evidencia visible en el primer viewport: rol, la pasantía de 2025, el proyecto principal y el CV como botón real.
- Uso de una captura real de PWA UTT.
- Nombre completo legible.

## Archivos

- PUEDES crear:
  - `.impeccable/mocks/decision/assigned.html` (Dirección A)
  - `.impeccable/mocks/decision/model-pick.html` (Dirección B)
  - `.impeccable/mocks/decision/challenger-hypercard.html` (Dirección C)
  - `.impeccable/mocks/decision/assets/` (copias optimizadas de capturas: webp, ≤1600 px de ancho; usa `magick`)
- Captura fuente principal: `pwa-img/Screenshot From 2026-11-17 14-08-59.png` (Resumen de Coordinación). Puedes usar otra de `pwa-img/` si sirve mejor a la dirección. No modifiques `pwa-img/`.
- Cada HTML: 1440×900 de diseño, autocontenido (CSS en `<style>`, imágenes relativas `assets/...`). Se permite Google Fonts solo en estos prototipos. Debe verse bien también a 390 px (media query); el viewport móvil es secundario.

## Contenido (real; no inventes nada)

- Nombre: **Imanol Antonio De la Cruz**
- Rol: **Desarrollador full-stack con enfoque en backend.**
- Descripción: **Construyo aplicaciones, APIs y automatizaciones con JavaScript y TypeScript.**
- Acciones: **Ver proyectos** (primaria), **Descargar CV (PDF)** y **Contactar**. Máximo 3 acciones en el hero.
- Evidencia que puedes mostrar (solo esto):
  - Estadía de desarrollo backend en 1Degree Holdings Limited · remoto · mayo–agosto 2025
  - Ingeniería en TI, Universidad Tecnológica de Tehuacán, 2025–2027 (previsto)
  - Proyecto principal **PWA UTT — Inspecciones de laboratorios**: PWA offline-first con cola de sincronización y resolución de conflictos; implementación principal y arquitectura. Next.js, TypeScript, Supabase, IndexedDB.
  - Otros proyectos: **Secure Transfer** (API Express que cifra, firma y almacena paquetes de archivos) y **Classroom → GitHub** (workflow n8n).
  - Etiqueta la captura de PWA UTT como datos de prueba si se ve texto ("datos sintéticos").
- Nav: Proyectos · Sobre mí · Trayectoria · Contacto · ES/EN. Una sola entrada de contacto.
- Prohibido: métricas, "disponible", "online", años de experiencia, logos de juegos, emojis como iconos, texto con gradiente, glass cards genéricas, copy vacío.

## Direcciones

### A — "Cuaderno profesional" (`assigned.html`)

El cuaderno cuadriculado de ingeniería (tipo Scribe) donde un estudiante mexicano de TI razona a mano: ese es el mundo.

- **Material:** papel blanco cálido `#F7F6F1` con cuadrícula de 5 mm (20 px, línea `#CFDCE8`), un solo margen rojo vertical `#D2453B`, tinta azul de bolígrafo `#1F3A93` para las marcas y los acentos, grafito `#232323` para el texto, y resaltador `#E6F54A` **solo** detrás de la pieza de evidencia más importante (presupuesto de color: un resaltado por pantalla).
- **Tipo:** todo el texto va tipografiado, sin fuentes manuscritas. Display y cuerpo: una grotesca con carácter que no sea Space Grotesk, Inter, DM Sans, IBM Plex, Plus Jakarta, Outfit ni Instrument Sans; propuesta: "Schibsted Grotesk" o "Familjen Grotesk". La mano aparece solo en **marcas SVG**: círculos, flechas, subrayados y palomitas en tinta azul, con trazo irregular.
- **Composición:** el texto se alinea a la cuadrícula de 20 px. La captura de PWA UTT va "pegada" con dos tiras de cinta semitransparente, rotada ≤1.5° y recortada con decisión. La profundidad sale de la superposición, nunca de sombras difusas.
- **Estados como marcas, no como colores:** ✓ verificado, ○ pendiente, tachado = no disponible.
- **Motion:** las marcas SVG se dibujan una vez al cargar (stroke-dashoffset, 500 ms, ease-out, escalonado 80 ms). Con `prefers-reduced-motion`, aparecen ya dibujadas.
- **Nota gamer (contenida):** como mucho, un pequeño garabato en el margen (p. ej. un mando dibujado a pluma), sin marcas reales.

### B — "Línea de sistema" (`model-pick.html`)

Señalética de transporte (escuela Metro CDMX de los 60–70): cada proyecto es una línea con color propio y cada estación es una pieza de su arquitectura. **No copies los pictogramas de Lance Wyman ni el logo del Metro**: las formas y los pictogramas son originales.

- **Material:** fondo blanco `#FFFFFF`, texto de señalética casi negro `#141414`, líneas de color sólido: PWA UTT naranja `#F08A00`, Secure Transfer verde `#0E8A3E`, Classroom → GitHub azul `#1D5BBF`. Estaciones blancas con anillo negro.
- **Tipo:** una sans de señalética, ancha y robusta ("Archivo" con ancho expandido para el nombre y Archivo normal para el cuerpo), en mayúsculas y minúsculas. Nada de mono.
- **Composición:** el nombre grande arriba a la izquierda. Una línea naranja atraviesa el viewport con estaciones "Dispositivo → Cola local → Sincronización → Supabase". La captura de PWA UTT aparece como un "andén", un panel rectangular junto a una estación. Las otras dos líneas asoman como transbordos hacia la sección de proyectos.
- **Motion:** un punto (tren) recorre la línea naranja una vez al cargar (1.2 s, ease-in-out); con hover o focus en una estación se resalta su andén. Con reduced-motion, sin recorrido.

### C — "Pila de tarjetas" (`challenger-hypercard.html`)

Una pila HyperCard: tarjetas en blanco y negro de 1 bit enlazadas por botones visibles. La herramienta para leer es la misma que para construir.

- **Material:** negro `#000` sobre blanco `#FFF`, grises solo por tramado (dither), sin color. El botón activo se invierte a negro sólido.
- **Tipo:** menús y botones en una pixel font legible ("Silkscreen" o "Pixelify Sans") y el cuerpo en una sans clara ("Public Sans" o "Atkinson Hyperlegible").
- **Composición:** una tarjeta central de proporción fija (marco de 1–2 px con esquinas redondeadas pixeladas) con el nombre, el rol y botones pintados ("Ver proyectos", "CV", "Contactar"). Barra de menú superior estilo sistema clásico (nav). La captura de PWA UTT va en una tarjeta apilada detrás, tramada a 1 bit, con un botón "Ver en color". Las tarjetas de proyectos asoman apiladas.
- **Motion:** al activar un botón, la tarjeta se invierte 80 ms (feedback) y hace un disolve de tarjeta (200 ms). Con reduced-motion, solo la inversión.

## Skills

1. `design-taste-frontend` (reglas anti-slop y copy).
2. `/impeccable` craft-floor (`~/.agents/skills/impeccable/reference/craft-floor.md`) antes de escribir CSS.
3. `emil-design-eng` para las microinteracciones de cada dirección.
4. Verificación: capturas con Playwright (importa desde `/home/dragodeidad/Documents/portafolio/node_modules/@playwright/test/index.mjs`) a 1440×900 y 390×844 de cada archivo, guardadas en `.impeccable/mocks/decision/shots/`.

## Criterios de aceptación

- [ ] 3 HTML autocontenidos que abren sin errores de consola.
- [ ] Cada dirección comprometida al 100 % con su mundo: un hero genérico pintado con su paleta no vale.
- [ ] Primer viewport a 1440: nombre, rol, 3 acciones como máximo con una primaria inequívoca, la pasantía 2025 visible y la captura de PWA UTT.
- [ ] Contraste AA del texto y foco visible en los enlaces y botones.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Sin contenido inventado.
- [ ] Capturas en `shots/` revisadas por ti antes de reportar.

## Al terminar

No hagas commit (es exploración). Reporta con `hc send t10` en este formato:

```
[P01] DONE | BLOCKED
Archivos: <lista>
Criterios: <✓/✗ por criterio>
Skills usadas: <lista>
Dudas / riesgos: <si hay>
```
