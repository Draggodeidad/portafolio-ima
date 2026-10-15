import type { Locale } from "@/i18n/routing";

type LocalizedCopy = Record<Locale, string>;

export type ProjectVisualKind =
  "offline-sync" | "secure-transfer" | "classroom-flow";

export type StudyBlock = {
  title: LocalizedCopy;
  paragraphs: LocalizedCopy[];
  points?: LocalizedCopy[];
};

export type Project = {
  id: string;
  slug: string;
  order: number;
  featured: boolean;
  name: string;
  summary: LocalizedCopy;
  type: LocalizedCopy;
  status: LocalizedCopy;
  technologies: string[];
  repository: string;
  demo?: string;
  visual: {
    kind: ProjectVisualKind;
    alt: LocalizedCopy;
    label: LocalizedCopy;
  };
  contribution?: LocalizedCopy;
  study: {
    description: LocalizedCopy;
    problem: StudyBlock;
    architecture: StudyBlock;
    decisions: StudyBlock;
    validation: StudyBlock;
    limitations: StudyBlock;
  };
};

export const projects = [
  {
    id: "pwa-utt",
    slug: "pwa-utt",
    order: 1,
    featured: true,
    name: "PWA UTT — Inspecciones de laboratorios",
    summary: {
      es: "Aplicación académica para registrar inspecciones de laboratorio, conservar cambios sin conexión y sincronizarlos cuando vuelve la red.",
      en: "An academic application for recording lab inspections, keeping changes while offline, and syncing them when the network returns.",
    },
    type: {
      es: "Aplicación web progresiva",
      en: "Progressive web application",
    },
    status: {
      es: "Proyecto académico · la demo abre en acceso",
      en: "Academic project · the demo opens at sign-in",
    },
    technologies: ["Next.js", "TypeScript", "Supabase", "IndexedDB"],
    repository: "https://github.com/Draggodeidad/pwa-utt",
    demo: "https://pwa-utt.vercel.app/",
    visual: {
      kind: "offline-sync",
      label: { es: "Modelo de sincronización", en: "Sync model" },
      alt: {
        es: "Diagrama explicativo: una inspección se guarda en el dispositivo y su cola espera conexión para sincronizarse con el servidor.",
        en: "Explanatory diagram: an inspection is saved on the device and its queue waits for connectivity before syncing with the server.",
      },
    },
    contribution: {
      es: "Implementación principal y arquitectura; el equipo colaboró en las pruebas y la documentación.",
      en: "Primary implementation and architecture; the team collaborated on testing and documentation.",
    },
    study: {
      description: {
        es: "Una PWA académica de inspecciones que conserva capturas locales y administra cambios pendientes antes de confirmarlos en el servidor.",
        en: "An academic inspection PWA that preserves local captures and manages pending changes before confirming them on the server.",
      },
      problem: {
        title: { es: "Problema y alcance", en: "Problem and scope" },
        paragraphs: [
          {
            es: "El proyecto aborda el registro de inspecciones en laboratorios donde la conectividad puede ser intermitente. El alcance incluye capturar y consultar información localmente y coordinar su envío posterior.",
            en: "The project addresses recording lab inspections where connectivity can be intermittent. Its scope includes capturing and viewing information locally, then coordinating a later submission.",
          },
          {
            es: "La aplicación es un proyecto académico y sus datos de muestra son sintéticos; no representa un despliegue institucional validado.",
            en: "The application is an academic project and its sample data is synthetic; it does not represent a validated institutional deployment.",
          },
        ],
      },
      architecture: {
        title: { es: "Arquitectura y recorrido", en: "Architecture and flow" },
        paragraphs: [
          {
            es: "IndexedDB separa los registros locales, la cola de sincronización y los conflictos. Cada operación queda asociada a una cuenta y conserva un identificador estable para que un reintento pueda reconocer una solicitud ya recibida.",
            en: "IndexedDB separates local records, the sync queue, and conflicts. Each operation is associated with an account and keeps a stable identifier so a retry can recognize a request already received.",
          },
          {
            es: "Al recuperar conexión, la cola procesa dependencias y envía cambios a las rutas del servidor. Supabase Auth, Postgres y RLS participan en la sesión, los datos y la autorización por rol. Las rutas distinguen los permisos de técnico y coordinador.",
            en: "When connectivity returns, the queue processes dependencies and sends changes to server routes. Supabase Auth, Postgres, and RLS participate in sessions, data, and role-based authorization. Routes distinguish technician and coordinator permissions.",
          },
        ],
      },
      decisions: {
        title: { es: "Decisiones técnicas", en: "Technical decisions" },
        paragraphs: [
          {
            es: "La política conserva una copia local y una intención de sincronización en una transacción IndexedDB. Las operaciones usan una solicitud congelada e idempotencia para que una pérdida de respuesta no duplique escrituras.",
            en: "The policy stores a local copy and a sync intent in one IndexedDB transaction. Operations use a frozen request and idempotency so a lost response does not duplicate writes.",
          },
        ],
        points: [
          {
            es: "Los fallos transitorios se reintentan con espera creciente y un máximo documentado; los datos locales permanecen si se agotan los intentos.",
            en: "Transient failures retry with increasing delay and a documented limit; local data remains if attempts are exhausted.",
          },
          {
            es: "Una discrepancia de versión abre un conflicto explícito. La persona puede conservar su captura o adoptar una versión remota autorizada; no hay sobrescritura silenciosa.",
            en: "A version mismatch opens an explicit conflict. The user can keep their capture or adopt an authorized remote version; changes are not silently overwritten.",
          },
        ],
      },
      validation: {
        title: { es: "Validación documentada", en: "Documented validation" },
        paragraphs: [
          {
            es: "El repositorio describe pruebas automatizadas con IndexedDB en memoria y transporte simulado para persistencia, pérdida de ACK, reintentos, aislamiento por cuenta y resolución de conflictos.",
            en: "The repository documents automated tests using in-memory IndexedDB and simulated transport for persistence, lost acknowledgements, retries, account isolation, and conflict resolution.",
          },
          {
            es: "La URL de demo responde y redirige a `/login`. Eso confirma que la ruta está disponible, no el funcionamiento de flujos autenticados; la última documentación tampoco acredita validación contra Supabase remoto.",
            en: "The demo URL responds and redirects to `/login`. That confirms the route is available, not that authenticated flows work; the latest project documentation also does not claim validation against remote Supabase.",
          },
        ],
      },
      limitations: {
        title: { es: "Límites conocidos", en: "Known limits" },
        paragraphs: [
          {
            es: "Los tests simulados no reproducen la red física, concurrencia real entre navegadores ni políticas remotas. Esas validaciones y una sesión de demo con acceso autorizado siguen pendientes.",
            en: "Simulated tests do not reproduce physical network conditions, real cross-browser concurrency, or remote policies. Those checks and an authorized demo session remain pending.",
          },
        ],
      },
    },
  },
  {
    id: "secure-transfer",
    slug: "secure-transfer",
    order: 2,
    featured: false,
    name: "Secure Transfer",
    summary: {
      es: "Backend para empaquetar transferencias de archivos con cifrado de contenido y comprobaciones criptográficas descritas en el código.",
      en: "A backend for packaging file transfers with encrypted content and cryptographic checks described in the code.",
    },
    type: { es: "API de transferencia de archivos", en: "File transfer API" },
    status: {
      es: "Demo no disponible · base de datos eliminada",
      en: "Demo unavailable · database deleted",
    },
    technologies: ["Node.js", "TypeScript", "Express", "Supabase"],
    repository: "https://github.com/Draggodeidad/secureTransferBack",
    visual: {
      kind: "secure-transfer",
      label: { es: "Recorrido del archivo", en: "File path" },
      alt: {
        es: "Diagrama: el cliente envía el archivo y la clave pública del receptor; el servidor prepara un paquete y lo almacena en Supabase.",
        en: "Diagram: the client sends a file and recipient public key; the server prepares a package and stores it in Supabase.",
      },
    },
    study: {
      description: {
        es: "Una API Express que crea un paquete cifrado para transferir archivos y lo guarda mediante Supabase Storage.",
        en: "An Express API that creates an encrypted package for file transfer and stores it through Supabase Storage.",
      },
      problem: {
        title: { es: "Problema y alcance", en: "Problem and scope" },
        paragraphs: [
          {
            es: "El repositorio implementa un flujo de backend para recibir un archivo, construir un paquete con material criptográfico y guardarlo en almacenamiento. El recorrido representado aquí refleja las operaciones presentes en el código de carga.",
            en: "The repository implements a backend flow that receives a file, builds a package with cryptographic material, and stores it. The flow shown here reflects the upload operations present in the code.",
          },
        ],
      },
      architecture: {
        title: { es: "Arquitectura y recorrido", en: "Architecture and flow" },
        paragraphs: [
          {
            es: "El cliente entrega el archivo y la clave pública del destinatario a la API. En el servidor se calcula un hash SHA-256, se genera una clave AES-256-GCM para el archivo, se envuelve la clave de sesión con RSA-OAEP y se firma el hash con RSA-PSS antes de preparar el ZIP y subirlo a Supabase.",
            en: "The client sends the file and recipient public key to the API. On the server, the code calculates a SHA-256 hash, creates an AES-256-GCM key for the file, wraps the session key with RSA-OAEP, and signs the hash with RSA-PSS before preparing the ZIP and uploading it to Supabase.",
          },
          {
            es: "Estas son operaciones descritas por el código; no equivalen a una auditoría independiente del diseño de seguridad.",
            en: "These are operations described by the code; they do not amount to an independent security audit.",
          },
        ],
      },
      decisions: {
        title: { es: "Decisiones técnicas", en: "Technical decisions" },
        paragraphs: [
          {
            es: "El contenido usa cifrado autenticado AES-GCM; la clave de sesión se cifra para el receptor y el paquete guarda hash y firma junto con los metadatos. El manejo de claves queda del lado servidor durante la creación del paquete.",
            en: "The content uses authenticated AES-GCM encryption; the session key is encrypted for the recipient, and the package stores a hash and signature alongside metadata. Key handling stays server-side while the package is created.",
          },
        ],
      },
      validation: {
        title: { es: "Validación documentada", en: "Documented validation" },
        paragraphs: [
          {
            es: "Hay utilidades y pruebas manuales locales para las primitivas criptográficas, además de una demo de flujo en el repositorio. No se ejecutaron aquí; la demo pública no está disponible.",
            en: "The repository includes local utilities and manual checks for cryptographic primitives, plus a flow demo. They were not run here; the public demo is unavailable.",
          },
        ],
      },
      limitations: {
        title: { es: "Límites conocidos", en: "Known limits" },
        paragraphs: [
          {
            es: "La función de extracción completa del ZIP declara que aún no está implementada y lanza un error. La base de datos fue eliminada, no hay demo disponible y no se confirma una revisión de seguridad. La autoría individual tampoco está confirmada.",
            en: "The complete ZIP extraction function is explicitly unimplemented and throws an error. The database was deleted, no demo is available, and no security review is confirmed. Individual authorship is also unconfirmed.",
          },
        ],
      },
    },
  },
  {
    id: "classroom-github",
    slug: "classroom-github",
    order: 3,
    featured: false,
    name: "Classroom → GitHub",
    summary: {
      es: "Workflow n8n que convierte actividades de Classroom y materiales de Drive en un plan validado de GitHub Issues.",
      en: "An n8n workflow that turns Classroom assignments and Drive materials into a validated GitHub Issues plan.",
    },
    type: { es: "Automatización n8n", en: "n8n automation" },
    status: {
      es: "Workflow importable · inactivo y orientado a dry-run",
      en: "Importable workflow · inactive and designed for dry runs",
    },
    technologies: ["n8n", "Google Classroom API", "Google Drive", "GitHub API"],
    repository: "https://github.com/Draggodeidad/automation-classrom",
    visual: {
      kind: "classroom-flow",
      label: {
        es: "Etapas verificadas del workflow",
        en: "Verified workflow stages",
      },
      alt: {
        es: "Flujo: actividades de Classroom y starter de Drive pasan por validación e idempotencia antes de planificar Issues de GitHub.",
        en: "Flow: Classroom assignments and a Drive starter pass through validation and idempotency before GitHub issues are planned.",
      },
    },
    study: {
      description: {
        es: "Automatización self-hosted en n8n para seleccionar actividades académicas, contrastar materiales y preparar issues con dependencias.",
        en: "A self-hosted n8n automation for selecting academic assignments, checking materials, and preparing issues with dependencies.",
      },
      problem: {
        title: { es: "Problema y alcance", en: "Problem and scope" },
        paragraphs: [
          {
            es: "El flujo organiza la conversión de actividades académicas en trabajo planificado en GitHub. No es una aplicación web: se compone de workflows n8n, módulos de código y documentación de operación.",
            en: "The workflow organizes the conversion of academic assignments into planned work in GitHub. It is not a web application: it consists of n8n workflows, code modules, and operational documentation.",
          },
        ],
      },
      architecture: {
        title: {
          es: "Entradas, validación y salida",
          en: "Inputs, validation, and output",
        },
        paragraphs: [
          {
            es: "Las entradas son actividades publicadas de Classroom y, cuando existe, un ZIP starter de Drive; el flujo también consulta el estado del repositorio GitHub. Los datos pasan por normalización, análisis del ZIP y validación del plan antes de llegar a la preparación de Issues.",
            en: "Inputs are published Classroom assignments and, when present, a Drive starter ZIP; the workflow also reads the GitHub repository state. Data passes through normalization, ZIP inspection, and plan validation before issue preparation.",
          },
          {
            es: "La salida prepara Issues con metadatos de origen, etiquetas y dependencias. El workflow incluye un modo dry-run para revisar lo que se crearía.",
            en: "The output prepares issues with source metadata, labels, and dependencies. The workflow includes a dry-run mode to review what would be created.",
          },
        ],
      },
      decisions: {
        title: { es: "Decisiones técnicas", en: "Technical decisions" },
        paragraphs: [
          {
            es: "La selección excluye actividades fuera de alcance y falla de forma cerrada si faltan datos de semana o identidad. Un registro por actividad y las claves de issue permiten reconocer ejecuciones anteriores y evitar recrear el conjunto ya procesado.",
            en: "Selection excludes out-of-scope assignments and fails closed when week or identity data is missing. A per-assignment registry and issue keys recognize prior runs and avoid recreating an already processed set.",
          },
          {
            es: "El análisis trata los ZIP como entrada no confiable y aplica límites antes de extraerlos; la planificación ordena las issues según sus dependencias.",
            en: "ZIP analysis treats archives as untrusted input and applies limits before extraction; planning orders issues according to their dependencies.",
          },
        ],
      },
      validation: {
        title: { es: "Validación documentada", en: "Documented validation" },
        paragraphs: [
          {
            es: "El repositorio contiene pruebas de artefactos, selección, asignación, validación de ZIP y escenarios dry-run. La documentación indica que el workflow importado permanece inactivo y la configuración recomendada conserva dry-run.",
            en: "The repository contains artifact, selection, assignment, ZIP validation, and dry-run scenario tests. Its documentation states that the imported workflow remains inactive and the recommended configuration keeps dry-run enabled.",
          },
        ],
      },
      limitations: {
        title: { es: "Límites conocidos", en: "Known limits" },
        paragraphs: [
          {
            es: "No se confirma ejecución actual en producción ni credenciales reales. Pasar a operaciones que escriben en GitHub requiere configuración y revisión en la instancia n8n. La aportación individual no está confirmada.",
            en: "No current production run or real credentials are confirmed. Enabling GitHub write operations requires configuration and review in the n8n instance. Individual contribution is unconfirmed.",
          },
        ],
      },
    },
  },
] satisfies Project[];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
