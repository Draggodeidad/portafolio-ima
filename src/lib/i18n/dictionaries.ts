export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const sectionIds = [
  "inicio",
  "proyectos",
  "sobre-mi",
  "stack",
  "trayectoria",
  "contacto",
] as const;

export type SectionId = (typeof sectionIds)[number];

export type Dictionary = {
  languageName: string;
  navigationLabel: string;
  languageSelectorLabel: string;
  menuLabel: string;
  closeMenuLabel: string;
  switchToSpanish: string;
  switchToEnglish: string;
  contactAction: string;
  profileLabel: string;
  skipToContent: string;
  sections: Record<SectionId, string>;
};

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    languageName: "Español",
    navigationLabel: "Navegación principal",
    languageSelectorLabel: "Selector de idioma",
    menuLabel: "Abrir menú",
    closeMenuLabel: "Cerrar menú",
    switchToSpanish: "Cambiar idioma a español",
    switchToEnglish: "Switch language to English",
    contactAction: "Contactar",
    profileLabel: "Perfil de GitHub de Imanol (abre en una pestaña nueva)",
    skipToContent: "Saltar al contenido",
    sections: {
      inicio: "Inicio",
      proyectos: "Proyectos",
      "sobre-mi": "Sobre mí",
      stack: "Stack",
      trayectoria: "Trayectoria",
      contacto: "Contacto",
    },
  },
  en: {
    languageName: "English",
    navigationLabel: "Main navigation",
    languageSelectorLabel: "Language selector",
    menuLabel: "Open menu",
    closeMenuLabel: "Close menu",
    switchToSpanish: "Cambiar idioma a español",
    switchToEnglish: "Switch language to English",
    contactAction: "Contact",
    profileLabel: "Imanol's GitHub profile (opens in a new tab)",
    skipToContent: "Skip to content",
    sections: {
      inicio: "Home",
      proyectos: "Projects",
      "sobre-mi": "About",
      stack: "Stack",
      trayectoria: "Experience",
      contacto: "Contact",
    },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
