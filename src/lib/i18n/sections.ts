export const sectionIds = [
  "inicio",
  "proyectos",
  "sobre-mi",
  "stack",
  "trayectoria",
  "contacto",
] as const;

export type SectionId = (typeof sectionIds)[number];
