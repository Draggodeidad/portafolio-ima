import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { routing } from "@/i18n/routing";
import { sectionIds } from "@/lib/i18n/sections";
import { cn } from "@/lib/cn";

const styles = {
  main: "pt-[var(--nav-height)]",
  section: "min-h-[220px] border-b border-border-subtle py-12 pt-[76px]",
  home: "min-h-[300px] pt-[100px]",
} as const;

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Navigation.sections" });

  return (
    <main id="contenido" className={styles.main}>
      {sectionIds.map((id, index) => (
        <section
          className={cn(styles.section, index === 0 && styles.home)}
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
