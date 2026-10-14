import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { dictionaries, isLocale, sectionIds } from "@/lib/i18n/dictionaries";

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = dictionaries[locale];

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
              eyebrow={`// 0${index + 1} — ${copy.sections[id].toLocaleUpperCase(locale)}`}
              title={copy.sections[id]}
            />
          </Container>
        </section>
      ))}
    </main>
  );
}
