# DESIGN.md — Portafolio de Imanol Antonio De la Cruz

## 1. Propósito y alcance

Diseñar un portafolio para conseguir empleo como desarrollador full-stack con enfoque en backend. El público principal son reclutadores y líderes técnicos. La experiencia debe comunicar personalidad, criterio técnico y cuidado por el detalle mediante proyectos reales y decisiones explicables.

Este documento es el brief de diseño para Google Stitch y la guía para una implementación posterior. No representa un sitio ya construido. La fase actual es diseño; la construcción se revisará por partes.

**Dirección elegida:** Perfil HUD + System Playground.

**Sensaciones:** joven, apasionado, fresco, curioso y con gusto por los videojuegos.

## 2. Identidad y contenido

- Nombre completo: Imanol Antonio De la Cruz.
- Rol: Desarrollador full-stack con enfoque en backend.
- Especialidad: JavaScript/TypeScript, aplicaciones, APIs y automatizaciones.
- Stack declarado: NestJS, Hono, React, SvelteKit y herramientas cloud-native.
- Idiomas: español principal e inglés equivalente.
- GitHub: https://github.com/Draggodeidad
- LinkedIn: https://www.linkedin.com/in/imanol-antonio-de-la-cruz-1a1281370/
- Fotografía: pendiente; debe aparecer en el hero cuando se proporcione.
- Correo: pendiente.
- CV descargable: pendiente.

No inventar empleos, años de experiencia, métricas, clientes, premios, credenciales ni resultados. La trayectoria académica y laboral se completará con datos confirmados para publicación. No usar porcentajes de dominio del stack.

## 3. Lenguaje visual

Referencias elegidas por el usuario:

| Referencia                       | Traducción visual                                                     |
| -------------------------------- | --------------------------------------------------------------------- |
| Halo                             | Precisión geométrica, paneles translúcidos y conexiones tecnológicas. |
| Call of Duty Black Ops 3 Zombies | Energía que recorre conexiones y destellos contenidos.                |
| Gears of War                     | Titulares con peso, estructura firme y contraste.                     |

La influencia gamer se expresa en interacción, ritmo y composición. No reproducir logos, personajes ni interfaces de estos videojuegos. No convertir el portafolio en una pantalla de combate.

Usar marcas geométricas pequeñas, conexiones finas y superficies oscuras diferenciadas. Los detalles HUD deben apoyar una función o jerarquía. Evitar estadísticas ficticias, retículas que tapen texto, barras de experiencia y etiquetas técnicas sin significado.

## 4. Tokens de diseño propuestos

### Color

| Token          | Valor                  | Uso                                    |
| -------------- | ---------------------- | -------------------------------------- |
| background     | #101214                | Fondo principal grafito.               |
| surface        | #1B2024                | Tarjetas y paneles.                    |
| surface-raised | #252C31                | Elementos elevados y hover.            |
| text-primary   | #F2F3ED                | Titulares y cuerpo principal.          |
| text-secondary | #ABB3B8                | Descripciones y etiquetas secundarias. |
| accent         | #C4F564                | CTA, foco y conexiones activas.        |
| accent-ink     | #101214                | Texto sobre botones lima.              |
| border         | rgba(242,243,237,0.14) | Separadores y contornos decorativos.   |
| error          | #FF9B9B                | Errores, acompañados de texto/icono.   |

El lima es el único acento dominante. Reservar el brillo para interacciones puntuales. Los bordes decorativos no sustituyen contornos con contraste suficiente en controles. Validar los colores sobre las superficies finales, incluido el vidrio.

### Tipografía

Propuesta: Space Grotesk para titulares, una sans-serif legible como Inter para cuerpo y JetBrains Mono para etiquetas breves. Son elecciones de diseño propuestas, no una dependencia obligatoria.

- Hero: escala fluida aproximada de 40 a 80 px, ajustada para el nombre completo.
- Títulos de sección: 28 a 48 px.
- Texto: 16 a 18 px; interlineado de 1.5 a 1.7.
- Etiquetas: 12 a 14 px; no usar tamaño pequeño para información esencial.
- No aplicar estilo monoespaciado a todo el sitio.

### Espaciado y forma

- Escala: 4, 8, 12, 16, 24, 32, 48, 64 y 96 px.
- Contenedor de contenido: aproximadamente 1200 px de ancho máximo.
- Márgenes laterales: 20 px móvil; 32–48 px desktop.
- Separación entre secciones: 64–80 px móvil; 96–128 px desktop.
- Radios: 10–14 px controles; 20–24 px paneles.
- Preferir geometría limpia a recortes complejos en todas las tarjetas.

## 5. Arquitectura de información

Página principal con anclas:

1. Inicio / Hero.
2. Proyectos destacados.
3. Sobre mí.
4. Stack.
5. Trayectoria.
6. Contacto.
7. Footer.

Casos de estudio separados para cada proyecto. Propuesta de rutas bilingües: `/es`, `/en` y `/{idioma}/proyectos/{slug}`. El selector conserva la página equivalente cuando exista. No mostrar ambas traducciones simultáneamente.

El blog no está incluido en el alcance actual. La sección Trayectoria queda pendiente de contenido confirmado.

## 6. Navbar

Navbar fija con identidad compacta IA, enlaces de sección, indicador activo y selector ES/EN. Vidrio oscuro, contorno tenue y separación visual del fondo. En móvil, identidad, idioma y botón de menú; el panel abierto debe permitir navegar cómodamente.

- Estado activo distinguible por forma/subrayado además de color.
- Foco visible y controles táctiles de aproximadamente 44 × 44 px como mínimo de diseño.
- Anclas con desplazamiento que compense la altura de la navbar.
- Scroll suave desactivado si se solicita movimiento reducido.
- Si el menú es modal: foco contenido, cierre con Escape y devolución del foco al botón.
- Al elegir un enlace móvil, cerrar el menú.
- No colocar información esencial detrás del cristal con baja opacidad.

## 7. Hero — Perfil HUD

Desktop: texto a la izquierda y retrato HUD a la derecha. Móvil: contenido textual y CTA primero; composición visual debajo.

**Contenido inicial:**

- Nombre: Imanol Antonio De la Cruz.
- Rol: Desarrollador full-stack con enfoque en backend.
- Descripción: Construyo aplicaciones, APIs y automatizaciones con JavaScript y TypeScript.
- CTA principal: Ver proyectos.
- CTA secundario: Contactar.
- Enlace adicional: Descargar CV.

El nombre completo debe permitir saltos de línea naturales, sin reducirse hasta perder protagonismo.

### Retrato y playground

Reservar un retrato con encuadre asimétrico dentro de un marco translúcido. Hasta tener fotografía, usar una pieza gráfica con iniciales IA; no generar una persona ficticia ni simular una fotografía real.

Alrededor del marco, colocar tres nodos: API, datos y cloud. Representan áreas de trabajo, no infraestructura activa ni indicadores de disponibilidad.

- Hover, foco o toque selecciona un nodo.
- Una señal breve recorre su conexión y muestra una explicación concisa.
- El estado inicial permanece atractivo sin interacción.
- Texto y botones permanecen HTML legible, fuera de efectos que los distorsionen.
- En móvil simplificar la red y permitir selección mediante botones.
- La fotografía real debe tener tratamiento de color sobrio y conservar un tono de piel natural.

## 8. Proyectos destacados

### PWA UTT — pieza principal

Aplicación académica para inspecciones de laboratorios, con persistencia offline, sincronización, resolución de conflictos y permisos.

- Tecnologías documentadas: Next.js, TypeScript, Supabase e IndexedDB.
- Aportación declarada: implementación principal y arquitectura, con colaboración del equipo en pruebas y documentación.
- Demo proporcionada: https://pwa-utt.vercel.app/
- Código: https://github.com/Draggodeidad/pwa-utt
- Acciones: Explorar caso, Abrir aplicación y Ver código.
- Usar captura real cuando esté disponible; no inventar una pantalla del producto.

La demo fue indicada como funcional por el usuario; verificar disponibilidad antes de publicar el portafolio. Los commits no se utilizarán como medida de calidad ni como porcentaje de autoría.

### Secure Transfer — caso backend

Proyecto de transferencia de archivos con cifrado y verificación de integridad.

- Tecnologías documentadas: Node.js, TypeScript, Express y Supabase.
- Código: https://github.com/Draggodeidad/secureTransferBack
- Estado: demo no disponible; el usuario indicó que la base de datos fue eliminada.
- Acciones: Explorar caso y Ver código.
- Visual: recorrido del archivo y esquema de arquitectura, claramente presentado como explicación.
- Confirmar aportación individual antes de publicar el caso.
- No publicar cifras de cobertura ni afirmar seguridad auditada o preparación para producción sin evidencia adicional.

### Classroom → GitHub — automatización

Workflow n8n para transformar actividades académicas en planificación de issues con integración de servicios y validación.

- Código: https://github.com/Draggodeidad/automation-classrom
- Presentarlo como automatización, no como aplicación con interfaz propia.
- Acciones: Explorar flujo y Ver código.
- Visual: entradas, validación y salida mediante un flujo explicativo.
- No afirmar que funciona actualmente en producción ni ofrecer una demo pública no confirmada.
- Confirmar aportación individual y resultados antes de publicarlos.

### Composición

La PWA ocupa una pieza amplia; los otros proyectos tienen composiciones complementarias. Evitar tres tarjetas idénticas con una lista de logos. Cada pieza contiene problema, aportación, estado y enlaces claros.

## 9. Plantilla de caso de estudio

1. Título, resumen, estado y enlaces.
2. Problema y alcance real.
3. Aportación personal y contribuciones del equipo.
4. Arquitectura y recorrido principal.
5. Decisiones: alternativa considerada, elección y coste.
6. Capturas o diagramas relevantes.
7. Validación realizada y límites.
8. Aprendizajes y siguiente mejora.

No inventar desafíos, resultados o métricas para completar el diseño. En Stitch usar placeholders explícitos para apartados pendientes. Incluir retorno a Proyectos y navegación al caso siguiente.

## 10. Sobre mí, stack y trayectoria

Sobre mí: párrafo breve sobre el enfoque backend y el interés por construir aplicaciones completas. El gusto gamer puede aparecer como detalle personal confirmado, sin dominar el discurso profesional.

Stack agrupado en backend, frontend y herramientas. Añadir contexto de uso cuando esté confirmado; los proyectos deben demostrar las tecnologías. Evitar porcentajes, estrellas de dominio y carruseles interminables de logos.

Trayectoria: diseño preparado para educación y experiencia real, sin rellenar cargos ni fechas. En producción, ocultar campos pendientes en lugar de publicar texto ficticio.

## 11. Contacto y CV

Formulario con nombre, correo y mensaje; labels persistentes y mensajes de validación asociados. Diseñar estados vacío, foco, error, enviando, éxito y fallo recuperable. Conservar el mensaje si falla el envío.

El éxito debe corresponder a una confirmación real del servicio, nunca a un temporizador visual. La elección del proveedor de envío queda pendiente para implementación.

Contacto directo por correo, GitHub y LinkedIn. Correo y archivo CV pendientes: usar marcadores en el diseño; no publicar enlaces rotos ni correo ficticio. Cuando exista CV, indicar formato e idioma.

## 12. Vidrio y movimiento

El liquid glass se concentra en navbar, marco del retrato y controles seleccionados. Las tarjetas de lectura larga usan superficies mayormente opacas.

- Base: transparencia oscura, `backdrop-filter`, contorno claro tenue y brillo interior sutil.
- Fallback: superficie opaca con la misma jerarquía y legibilidad.
- Refracción SVG opcional, solo decorativa y tras comprobar compatibilidad y rendimiento.
- Evitar desenfoque de pantalla completa y filtros anidados.
- Transiciones de controles: aproximadamente 160–240 ms.
- Señales de nodos: aproximadamente 400–700 ms por interacción.
- Tilt opcional leve en dispositivos con puntero preciso; no obligatorio.
- Sin audio automático, intro de carga, cursor personalizado ni scroll secuestrado.
- Con `prefers-reduced-motion`: eliminar pulsos, parallax y tilt; mantener selección inmediata y foco.

## 13. Fuentes de componentes

Revisión documental realizada el 13 de octubre de 2026. Las librerías son recursos posibles, no requisitos para todas las secciones.

| Fuente                | Candidatos             | Compatibilidad y uso                                                                   |
| --------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| https://iconiqui.com/ | Button                 | React; CTA, enlaces y estado de envío. Código editable mediante registro shadcn.       |
| https://canvasui.dev/ | Glass Object o Magnify | Variantes React y Svelte; elegir como máximo un efecto experimental opcional del hero. |
| https://bencho.dev/   | Action node, Tilt card | Catálogo React; referencia para nodos y microinteracciones.                            |

Instalación documentada de Iconiq Button: `npx shadcn@latest add @iconiq/b-button`. Después adaptar tokens, revisar dependencias y usar semántica de enlace para navegación y botón para acciones.

Canvas UI distribuye componentes mediante registro shadcn y ofrece WebGL/WebGPU. Seleccionar framework y componente en su documentación antes de copiar el comando correspondiente. Algunas capacidades HTML-in-canvas son experimentales: conservar HTML funcional y verificar fallback. No asumir que efectos GPU garantizan buen rendimiento.

No se confirmó un comando de instalación específico para Bencho durante el brainstorm. Revisar código, dependencias y condiciones del componente elegido antes de integrarlo.

React es la recomendación preliminar por compatibilidad directa con las tres fuentes; el framework definitivo no está aprobado. Si se elige SvelteKit, sustituir o adaptar Iconiq/Bencho con componentes Svelte propios. Para los nodos principales, SVG + CSS es una alternativa ligera en ambos frameworks.

Fuentes consultadas: https://iconiqui.com/installation, https://iconiqui.com/buttons-and-actions/button, https://canvasui.dev/docs, https://canvasui.dev/components y https://bencho.dev/.

## 14. Calidad y criterios de aceptación

- Responsive desde 360 px; probar móvil, tablet y desktop sin scroll horizontal accidental.
- Contraste WCAG AA: 4.5:1 en texto normal y 3:1 en texto grande; revisar controles y foco sobre fondos reales.
- Navegación completa por teclado, landmarks, encabezados ordenados y enlace para saltar al contenido.
- Todas las interacciones tienen alternativa a hover y movimiento.
- Optimizar imágenes, reservar dimensiones y evitar saltos de layout.
- Cargar efectos opcionales de forma diferida y pausarlos fuera de vista.
- Mantener contenido principal accesible sin animaciones o canvas.
- Lighthouse 90+ como objetivo a verificar en producción, no como resultado prometido por el diseño.
- Metadatos por idioma y caso, Open Graph y textos alternativos relevantes.
- TypeScript, componentes pequeños y tokens reutilizables en la implementación futura.
- Ningún botón promete una demo inexistente ni un envío simulado.

## 15. Entregables para Google Stitch

Diseñar página principal completa en desktop y móvil, plantilla de caso aplicada a PWA UTT, navbar móvil abierta/cerrada, hero inicial/nodo seleccionado, formulario con estados y una guía de tokens.

Solicitar una composición memorable y viable de implementar. La inspiración en librerías no implica que Stitch las haya instalado. Conservar contenido verificable y placeholders visibles solo en el diseño para foto, CV, correo, trayectoria y aportaciones pendientes.

## 16. Revisión posterior

Una vez generado el diseño, revisar jerarquía del hero, legibilidad, carácter visual y visibilidad de proyectos. Después concretar arquitectura técnica y despliegue. Construir por partes: navbar → hero → proyectos → resto de secciones, mostrando cada parte al usuario antes de continuar.

Pendientes para publicación: fotografía, correo, CV, trayectoria confirmada, capturas reales, aportaciones de Secure Transfer/Classroom y comprobación de demo/enlaces.
