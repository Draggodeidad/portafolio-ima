import type { Locale } from "@/i18n/routing";

type LocalizedCopy = Record<Locale, string>;

/** Set only after a real portrait is added under public/. */
export const profilePhotoSrc: string | null = null;

export const profile = {
  name: "Imanol Antonio De la Cruz",
  role: {
    es: "Desarrollador full-stack con enfoque en backend",
    en: "Full-stack developer focused on backend engineering",
  } satisfies LocalizedCopy,
  email: null as string | null,
  github: "https://github.com/Draggodeidad",
  linkedIn: "https://www.linkedin.com/in/imanol-antonio-de-la-cruz-1a1281370/",
  cv: null as { href: string; locale: Locale; format: "PDF" } | null,
};

export type ExperienceKind = "education" | "employment" | "personal-project";

export type ExperienceEntry = {
  id: string;
  kind: ExperienceKind;
  organization: string;
  period: string;
  description: LocalizedCopy;
};

/** Add only complete entries backed by information confirmed for publication. */
export const experienceEntries: ExperienceEntry[] = [];

export const publishedExperienceEntries = experienceEntries.filter(
  (entry) =>
    entry.id.trim() &&
    entry.organization.trim() &&
    entry.period.trim() &&
    entry.description.es.trim() &&
    entry.description.en.trim(),
);

export type SkillGroupId = "backend" | "frontend" | "data" | "tools";

export type Skill = {
  name: string;
  group: SkillGroupId;
  context: LocalizedCopy;
  evidence: "declared" | "project";
};

export const skills: Skill[] = [
  {
    name: "JavaScript + TypeScript",
    group: "backend",
    context: {
      es: "Lenguajes principales declarados y presentes en los proyectos documentados.",
      en: "Declared primary languages, also present in the documented projects.",
    },
    evidence: "project",
  },
  {
    name: "NestJS",
    group: "backend",
    context: {
      es: "Tecnología declarada para desarrollo backend.",
      en: "Declared technology for backend development.",
    },
    evidence: "declared",
  },
  {
    name: "Hono",
    group: "backend",
    context: {
      es: "Tecnología declarada para desarrollo backend.",
      en: "Declared technology for backend development.",
    },
    evidence: "declared",
  },
  {
    name: "Node.js + Express",
    group: "backend",
    context: {
      es: "API de transferencia de archivos descrita en el caso Secure Transfer.",
      en: "File-transfer API described in the Secure Transfer case study.",
    },
    evidence: "project",
  },
  {
    name: "React",
    group: "frontend",
    context: {
      es: "Tecnología declarada para interfaces web.",
      en: "Declared technology for web interfaces.",
    },
    evidence: "declared",
  },
  {
    name: "SvelteKit",
    group: "frontend",
    context: {
      es: "Tecnología declarada para aplicaciones web.",
      en: "Declared technology for web applications.",
    },
    evidence: "declared",
  },
  {
    name: "Next.js + TypeScript",
    group: "frontend",
    context: {
      es: "Usados en la PWA UTT, con persistencia local y sincronización.",
      en: "Used in PWA UTT with local persistence and synchronization.",
    },
    evidence: "project",
  },
  {
    name: "Supabase + PostgreSQL",
    group: "data",
    context: {
      es: "Autenticación, datos y autorización por rol en PWA UTT.",
      en: "Authentication, data, and role-based authorization in PWA UTT.",
    },
    evidence: "project",
  },
  {
    name: "IndexedDB",
    group: "data",
    context: {
      es: "Registros locales, cola de sincronización y conflictos en PWA UTT.",
      en: "Local records, sync queue, and conflicts in PWA UTT.",
    },
    evidence: "project",
  },
  {
    name: "n8n",
    group: "tools",
    context: {
      es: "Workflow de automatización Classroom → GitHub, presentado como proyecto.",
      en: "Classroom → GitHub automation workflow, presented as a project.",
    },
    evidence: "project",
  },
  {
    name: "Vercel",
    group: "tools",
    context: {
      es: "Aloja la demo pública de PWA UTT, que actualmente abre en la pantalla de acceso.",
      en: "Hosts the public PWA UTT demo, which currently opens at the sign-in screen.",
    },
    evidence: "project",
  },
  {
    name: "Herramientas cloud-native",
    group: "tools",
    context: {
      es: "Interés y herramientas declaradas; sin atribuir servicios adicionales no confirmados.",
      en: "Declared interest and tools; no additional unconfirmed services are attributed.",
    },
    evidence: "declared",
  },
];

export const skillGroups: SkillGroupId[] = [
  "backend",
  "frontend",
  "data",
  "tools",
];
