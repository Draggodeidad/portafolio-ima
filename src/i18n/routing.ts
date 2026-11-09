import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  localeDetection: false,
  // Page metadata owns canonical/hreflang URLs. Middleware headers would
  // otherwise capture the temporary prerender server origin in snapshots.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
