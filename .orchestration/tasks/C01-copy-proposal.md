# C01 — Propuesta de copy (ES/EN) para aprobación del usuario

## Contexto

- Lee primero `PRODUCT.md`, `DESIGN.md`, `.impeccable/surfaces/src-app-locale-page-tsx.md`, `.orchestration/AUDIT.md` (hallazgos #4, #8, #9) y `.orchestration/audit/critique-A.md`.
- Es una tarea **de solo lectura sobre el código**: no edites `src/`, `messages/` ni nada versionado. Solo crea `.orchestration/copy/COPY-PROPUESTA.md`.
- El usuario aprobará este texto **antes** de que se implemente. Condición del usuario: **no inventar logros, métricas, fechas ni tecnologías que no estén ya en el sitio o en su CV** (`public/cv/CV_Imanol_Antonio.pdf`; extráelo con `pdftotext` si está disponible).

## Fuentes de verdad del contenido

`messages/es.json`, `messages/en.json`, `src/content/projects.ts`, `src/content/profile.ts`, `docs/project-content-sources.md`, `docs/profile-content-sources.md` y el CV.

## Objetivo

Proponer el texto nuevo, en ES y EN, para la dirección "Cuaderno profesional": primera persona, voz de quien construyó el proyecto (no de un auditor externo), franqueza con siguiente paso y menos ruido.

## Qué cubrir (tabla antes → después, ES y EN, con la clave o archivo:línea de cada texto)

1. **Navegación:** una sola entrada de contacto (quitar el duplicado Contacto/Contactar) y el orden propuesto (Proyectos, Trayectoria, Sobre mí, Contacto, o el que justifiques para un escaneo de 30 s).
2. **Hero:** quitar el eyebrow redundante. Proponer las líneas de evidencia (estadía 2025, Ingeniería en TI prevista, proyecto principal) con su estado (✓ verificado, ○ pendiente), y las etiquetas de los 3 CTA (Ver proyectos, Descargar CV, Contactar). Quitar "Perfil técnico", "IA" y "API / Gateway".
3. **Anotaciones a tinta** para la captura de PWA UTT: 2–4 notas cortas, cada una respaldada por un hecho de `projects.ts`.
4. **Proyectos y casos:** reescribir en primera persona los textos de "Validación documentada" y "Límites conocidos" de los 3 proyectos. Cada límite va con su siguiente paso, redactado como intención o plan ("Lo siguiente que probaría…", "Para producción necesitaría…"), **nunca como algo ya hecho**. Marca cualquier frase que requiera confirmación del usuario. Reemplaza "No se ejecutaron aquí" y la voz de "el repositorio describe" donde la aportación del usuario esté confirmada.
5. **Stack:** dividirlo en "Con evidencia en proyectos" y "También he trabajado con" (o similar). Elimina las 5 apariciones de "SIN CASO PUBLICADO". Para el segundo grupo, solo tecnologías que estén en el sitio o en el CV.
6. **Sobre mí:** hoy es la sección más delgada. Propón 2–3 frases con personalidad (curiosidad, videojuegos con moderación) **solo con hechos ya presentes** o marcados como "requiere confirmación del usuario".
7. **Contacto:** sin formulario. Texto de cierre, correo, CV y redes. Un solo CTA principal.
8. **Avisos honestos:** "Diagrama, no captura" pasa a ser una etiqueta breve donde aplique; "Captura con datos sintéticos" se mantiene.

## Formato del entregable

`.orchestration/copy/COPY-PROPUESTA.md` con:

- Un resumen de 5 líneas con las decisiones de voz.
- Una sección por área, con tabla `| Clave/ubicación | Actual (ES) | Propuesto (ES) | Propuesto (EN) | Fuente del hecho |`.
- Una lista final "Requiere confirmación del usuario" con cada frase dudosa.

## Al terminar

No hagas commit. Reporta con `hc send t10`:

```
[C01] DONE | BLOCKED
Archivo: .orchestration/copy/COPY-PROPUESTA.md
Resumen: <3 líneas>
Requiere confirmación: <n frases>
```
