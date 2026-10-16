import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/hero/hero";
import { ProjectsSection } from "@/components/projects/projects-section";
import {
  AboutSection,
  ContactSection,
  ExperienceSection,
  SiteFooter,
  StackSection,
} from "@/components/sections/profile-sections";
import { publishedExperienceEntries } from "@/content/profile";

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <>
      <main id="contenido">
        <Hero locale={locale} />
        <ProjectsSection locale={locale} />
        <AboutSection locale={locale} />
        <StackSection locale={locale} />
        {publishedExperienceEntries.length ? (
          <ExperienceSection locale={locale} />
        ) : null}
        <ContactSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
