import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { routing } from "@/i18n/routing";
import { sectionIds } from "@/lib/i18n/sections";
import { Hero } from "@/components/hero/hero";

const styles = {
  section: "min-h-[220px] border-b border-border-subtle py-12 pt-[76px]",
} as const;

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Navigation.sections" });

  return (
    <main id="contenido">
      <Hero locale={locale} />
      {sectionIds.slice(1).map((id, index) => (
        <section
          className={styles.section}
          id={id}
          aria-labelledby={`heading-${id}`}
          key={id}
        >
          <Container>
            <SectionHeading
              id={`heading-${id}`}
              eyebrow={`// 0${index + 2} — ${t(id).toLocaleUpperCase(locale)}`}
              title={t(id)}
            />
          </Container>
        </section>
      ))}
    </main>
  );
}
