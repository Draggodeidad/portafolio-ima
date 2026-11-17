export const sectionIds = [
  "inicio",
  "proyectos",
  "sobre-mi",
  "stack",
  "trayectoria",
  "contacto",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const navSectionIds = [
  "proyectos",
  "trayectoria",
  "sobre-mi",
  "contacto",
] as const;

export type NavSectionId = (typeof navSectionIds)[number];
