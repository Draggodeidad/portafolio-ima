import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { routing } from "@/i18n/routing";
import { sectionIds } from "@/lib/i18n/sections";

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Navigation.sections" });

  return (
    <main id="contenido" className="portfolio-main">
      {sectionIds.map((id, index) => (
        <section
          className={`portfolio-section${index === 0 ? " portfolio-section--home" : ""}`}
          id={id}
          aria-labelledby={`heading-${id}`}
          key={id}
        >
          <Container>
            <SectionHeading
              id={`heading-${id}`}
              eyebrow={`// 0${index + 1} — ${t(id).toLocaleUpperCase(locale)}`}
              title={t(id)}
            />
          </Container>
        </section>
      ))}
    </main>
  );
}
