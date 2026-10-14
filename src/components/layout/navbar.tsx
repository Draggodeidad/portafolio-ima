import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { sectionIds, type SectionId } from "@/lib/i18n/sections";
import { NavbarClient } from "./navbar-client";

type NavbarProps = {
  locale: Locale;
};

export async function Navbar({ locale }: NavbarProps) {
  const t = await getTranslations({ locale, namespace: "Navigation" });
  const copy = {
    navigationLabel: t("navigationLabel"),
    languageSelectorLabel: t("languageSelectorLabel"),
    menuLabel: t("menuLabel"),
    closeMenuLabel: t("closeMenuLabel"),
    switchToSpanish: t("switchToSpanish"),
    switchToEnglish: t("switchToEnglish"),
    contactAction: t("contactAction"),
    profileLabel: t("profileLabel"),
    skipToContent: t("skipToContent"),
    brandLabel: t("brandLabel"),
    sections: Object.fromEntries(
      sectionIds.map((id) => [id, t(`sections.${id}`)]),
    ) as Record<SectionId, string>,
  };

  return (
    <NextIntlClientProvider locale={locale} messages={{}}>
      <NavbarClient locale={locale} copy={copy} />
    </NextIntlClientProvider>
  );
}
