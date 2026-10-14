# AGENTS.md — Portafolio de Imanol Antonio De la Cruz

## Alcance

Estas instrucciones aplican a todo el repositorio, junto con instrucciones de mayor prioridad y las solicitudes del usuario.

Construir un portafolio ES/EN para conseguir empleo como desarrollador full-stack con enfoque en backend. Público: reclutadores y líderes técnicos. Dirección: Perfil HUD + System Playground, grafito y lima eléctrico, influencia gamer contenida y liquid glass legible.

Completar cada etapa autorizada y verificarla. Detenerse en los puntos de revisión acordados antes de construir la siguiente. No pedir aprobación para decisiones rutinarias dentro de la etapa. No publicar, cambiar infraestructura, fusionar PRs ni enviar correos reales de prueba sin autorización específica.

## Fuentes de verdad

- Leer docs/DESIGN.md. Si existe únicamente DESIGN.md en raíz, usarlo y conservarlo al organizar documentación.
- Figma: https://www.figma.com/design/ioLPZ28yV1QWAd1J8BdLOF/Untitled?node-id=12-2701
- Figma define composición y apariencia; DESIGN.md y datos confirmados definen contenido.
- Registrar diferencias importantes en docs/implementation-plan.md.
- No convertir textos decorativos del diseño en datos reales: coordenadas, transmisión, promesas de respuesta en 24 horas o especialización no demostrada.
- No inventar métricas, cargos, clientes, experiencia, resultados, certificaciones ni aportaciones.

## Stack de implementación

- Next.js App Router, React y TypeScript estricto.
- Tailwind CSS + variables CSS para tokens.
- pnpm, un único lockfile.
- ESLint y Prettier; Playwright para recorridos importantes.
- Contenido local tipado; Zod para contacto cuando corresponda.
- CSS/SVG primero para HUD y conexiones; Motion para interacciones que lo requieran.
- Vercel como destino propuesto; despliegue solo autorizado.

Verificar versiones estables compatibles y documentación actual. Inspeccionar proyecto y dependencias antes de instalar. No añadir monorepo, CMS, base de datos, autenticación, service worker, backend separado o estado global sin una necesidad concreta aprobada.

## Convenciones de estilos

- Mantener Tailwind en la versión mayor instalada; en este repositorio usar Tailwind CSS 4 y `@theme`.
- Centralizar tokens reutilizables en `src/styles/tokens.css` (o la ubicación existente equivalente) y exponerlos al tema de Tailwind. No repetir colores, tipografías, radios o medidas compartidas entre componentes.
- Agrupar clases completas y detectables estáticamente en un objeto local `styles`, fuera del componente cuando no dependa de props. Usar nombres semánticos (`root`, `title`, `active`, `disabled`); no crear nombres dinámicos de clases ni estilos globales por sitio.
- Usar `cn()` para combinar clases condicionales y permitir `className` externo al final. Mantener una sola utilidad basada en `clsx` y `tailwind-merge`; no añadir implementaciones equivalentes.
- Usar CVA solo cuando exista un componente reutilizable con variantes reales y derivar el tipo de variante de su definición. No añadir CVA por adelantado ni duplicar sus clases en `styles`.
- Usar CSS Modules para efectos complejos y específicos de componente (HUD, vidrio, pseudoelementos, animaciones y fallbacks). Mantener layout, espaciado y responsive en utilidades Tailwind; evitar trasladar utilidades a `@apply` sin una razón concreta.
- Mantener estilos estáticos fuera de componentes cliente; los objetos `styles` por sí solos no justifican `"use client"`. Respetar foco, teclado, `prefers-reduced-motion`, fallback opaco del vidrio y compatibilidad SSR.
- Documentar cambios a esta convención en `docs/styling.md`.

## Inicio de cada etapa

1. Leer instrucciones; inspeccionar Git, estructura, componentes, assets y scripts.
2. Identificar elementos reutilizables antes de crear otros.
3. Cargar la habilidad Figma design-to-code si está disponible antes de get_design_context; obtener screenshot y contexto del nodo correspondiente.
4. Si Figma responde con metadata sparse, solicitar subnodos visibles de la sección. No implementar desde una respuesta incompleta.
5. Actualizar el plan y ejecutar únicamente la etapa autorizada.

La navbar puede estar fuera del nodo Main: localizarla sin inventar IDs. Si Figma está bloqueado, avanzar con fundamentos independientes y comunicar qué recurso falta. No afirmar fidelidad sin inspección visual.

## Componentes de las tres fuentes

El usuario solicita usar componentes de Iconiq UI, Canvas UI y Bencho. Incorporar piezas concretas en sus etapas, adaptadas a Figma. No instalar catálogos enteros ni introducir efectos ajenos al diseño.

Documentación revisada inicialmente el 2026-10-14. Revalidar API al instalar. Crear docs/component-sources.md con componente, URL oficial, método, dependencias, condiciones de licencia, adaptación y estado: integrado, pendiente o sustituido con motivo. Nunca presentar un componente propio como código de una fuente externa.

### Iconiq UI: Button

Fuente: https://iconiqui.com/buttons-and-actions/button

Usar Button para CTA y envío de contacto. Es React; aislar su interactividad sin convertir toda la página en cliente.

Si no existe configuración shadcn, inicializarla una sola vez:

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add @iconiq/b-button
```

El comando oficial documentado usa npx shadcn@latest. El import documentado es @/components/ui/b-button; verificar ubicación generada. Dependencias declaradas: @base-ui/react, motion, class-variance-authority y lucide-react.

Adaptar tokens embebidos al tema. Usar href para navegación y type="submit" para formulario. Aprovechar loading/aria-busy; desactivar ripple si compite visualmente. Verificar integración con Next Link sin anidar anchors. Mantener el contenido estático como Server Components.

### Canvas UI: Glass Object

Fuentes:

- https://canvasui.dev/docs/installation
- https://canvasui.dev/docs/components/glass-object
- https://canvasui.dev/docs/rendering

Integrar una mejora decorativa acotada del hero después de construir y revisar su versión estática. No reemplazar fotografía, nombre, texto o CTA. Glass Object utiliza Three.js; la variante WebGL de objeto no depende de HTML-in-canvas experimental.

```bash
pnpm dlx shadcn@latest add @canvas-ui/glass-object-react
```

El registro añade dependencias; la instalación manual declara three y @types/three. Verificar archivo/export generado: la API documenta GlassObject con src para un asset.

Usar wrapper cliente e import dinámico, fallback estático y espacio reservado. WebGL primero. Desactivar orbit/zoom si interfiere con scroll o tacto. Pausar fuera de vista, limpiar recursos y usar fallback con movimiento reducido o fallo de GPU/asset.

Medir coste del bundle y renderizado. No añadir otro efecto GPU simultáneo. Si obliga a alterar la composición aprobada o degrada rendimiento, documentar el problema y conservar la base ligera hasta decidir alternativa. El vidrio funcional de navbar sigue siendo CSS con fallback opaco.

### Bencho: Action node y Tilt card

Fuente: https://bencho.dev/

Action node encaja con los nodos API/datos/cloud. Tilt card es un candidato secundario para una tarjeta destacada. El catálogo está orientado a React.

Obtener código oficial desde el panel Code/Copy del bloque; revisar sus dependencias y condiciones de reutilización. No hay comando npm/registro verificado en este brief: no inventar paquetes, imports, URLs de instalación ni APIs.

Guardar el código incorporado en componentes locales y registrar procedencia. Instalar solo dependencias reales de ese código; reutilizar Motion si ya existe.

Si no se logra obtener el código, comunicar la limitación y pedir el export del bloque concreto para completar esa integración. Continuar partes independientes con una alternativa propia identificada explícitamente.

Convertir interacción exclusivamente hover a foco y toque. Nodos semánticos con explicación visible. Tilt leve solo con puntero preciso, desactivado con movimiento reducido; conservar links y texto legibles.

### Compatibilidad

Las tres fuentes tienen orientación o variantes React; comprobar el componente concreto con versiones instaladas, SSR y CSS. Browser APIs solo en límites cliente. No añadir use client al layout raíz.

Canvas UI ofrece también Svelte. Si el usuario cambia a SvelteKit, Iconiq/Bencho necesitan adaptación o alternativas nativas. No cambiar framework unilateralmente.

## Arquitectura

```text
src/
  app/
    [locale]/
      layout.tsx
      page.tsx
      proyectos/[slug]/page.tsx
    api/contact/route.ts
    globals.css
    sitemap.ts
    robots.ts
  components/
    ui/
    layout/
    sections/
    hero/
    projects/
    contact/
    canvasui/
  content/
    projects/
    profile.ts
  lib/
    i18n/
    contact/
    site-config.ts
  styles/tokens.css
public/
  images/
  fonts/
  cv/
tests/e2e/
docs/
  DESIGN.md
  implementation-plan.md
  component-sources.md
```

Adaptar a convenciones existentes y crear archivos cuando se necesiten. Páginas/casos prerenderizados cuando sea posible. Cliente para menú, indicador activo, nodos, efectos y formulario. Contacto en servidor. Contenido separado de presentación.

## Diseño y responsive

- Traducir Figma con Grid/Flexbox y medidas fluidas; no copiar anchos fijos o nowrap de su exportación.
- Absolute solo para decoraciones dentro de contenedores delimitados.
- Centralizar tokens; conservar valores específicos de una pieza cuando sea necesario.
- Descargar assets por el mecanismo indicado por Figma. No usar URLs temporales ni screenshots como página implementada.
- Respetar assets, proporciones y slots; no sustituir imágenes arbitrariamente.
- Foto pendiente: monograma IA. Correo y CV pendientes: no inventar enlaces ni descargas.
- Navbar fija, anclas y menú móvil; IntersectionObserver para sección activa.
- Compensar navbar con scroll-margin-top.
- Liquid glass con @supports y fallback opaco. Evitar blur de grandes superficies/filtros anidados.
- Probar 360/390, 768 y 1280 px. El desktop de Figma requiere una adaptación móvil deliberada.
- Sin cursor personalizado, audio automático, intro obligatoria ni scroll secuestrado.

## Idiomas y contenido

ES principal y EN equivalente con diccionarios tipados. Selector conserva la página equivalente. Validar locale/slug y devolver 404 para desconocidos. Metadatos, canonical, alternates, sitemap y Open Graph por página.

Proyectos:

- PWA UTT: https://github.com/Draggodeidad/pwa-utt
  Demo indicada por el usuario: https://pwa-utt.vercel.app/
  Aportación: implementación principal y arquitectura, con colaboración en pruebas/documentación.
- Secure Transfer: https://github.com/Draggodeidad/secureTransferBack
  Demo no disponible. Confirmar aportación y evitar cifras de cobertura no verificadas.
- Classroom → GitHub: https://github.com/Draggodeidad/automation-classrom
  Workflow n8n; no simular una app ni afirmar funcionamiento productivo actual.

Casos: problema, alcance, aportación, arquitectura, decisiones, validación y límites. No usar commits como medida de calidad o porcentaje de autoría. Trayectoria y resultados solo con datos confirmados.

## Contacto

- Validación servidor con límites de tamaño.
- Secretos solo servidor; .env.example con nombres sin valores reales.
- Proveedor pendiente: no simular éxito ni enviar pruebas externas automáticamente.
- Protección antispam y límite de frecuencia adecuados al despliegue; un Map en memoria no es persistente entre instancias serverless.
- Estados reales idle/submitting/success/error. Aceptación del proveedor no equivale a entrega garantizada.
- Conservar mensaje si falla; errores asociados a campos y región de estado accesible.
- No publicar selector manual de estados del mockup.

## Calidad y verificación

TypeScript estricto; no any por comodidad, ts-ignore para ocultar errores ni desactivar reglas globalmente. Semántica HTML, encabezados ordenados, labels persistentes, foco visible, contraste AA y controles táctiles cómodos.

Respetar prefers-reduced-motion y alternativas a hover. Optimizar imágenes/fuentes, reservar dimensiones y mantener contenido accesible sin efectos.

Definir scripts reales lint, typecheck, format:check, build y pruebas según versiones instaladas. Ejecutar comprobaciones pertinentes. Playwright para menú/teclado, idioma, anclas, casos y formulario con proveedor controlado. Evitar tests que repitan clases CSS.

Comparar la sección implementada con Figma mediante capturas. Lighthouse 90+ es un objetivo a medir sobre producción, no un resultado asumido. Registrar qué no pudo comprobarse. Revisar licencias y conservar avisos requeridos al copiar componentes.

## Etapas

1. Fundamentos, tokens, rutas ES/EN y navbar.
2. Hero estático, CTA Iconiq y nodos Bencho; revisión visual.
3. Mejora Canvas UI con medición, accesibilidad y fallback.
4. Proyectos y casos.
5. Sobre mí, stack, trayectoria confirmada, contacto y CV disponible.
6. SEO, accesibilidad, rendimiento y despliegue autorizado.

Cerrar cada etapa con qué cambió, por qué, comprobaciones ejecutadas y límites reales. Mostrar preview/capturas cuando sea posible y esperar revisión antes de avanzar donde se haya acordado. No inventar resultados.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
