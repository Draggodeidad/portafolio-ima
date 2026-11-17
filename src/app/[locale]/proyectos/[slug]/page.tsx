import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/b-button";
import { InlineCode } from "@/components/ui/inline-code";
import { Container } from "@/components/layout/container";
import { ProjectVisual } from "@/components/projects/project-visual";
import { ProjectScreenshots } from "@/components/projects/project-screenshots";
import { profile } from "@/content/profile";
import { getProject, projects, type StudyBlock } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const styles = {
  main: "bg-desk pb-20 pt-[calc(var(--nav-height)+40px)] text-graphite",
  page: "relative border border-page-edge bg-paper py-8 pl-12 pr-5 [background-image:var(--paper-grid)] [background-size:var(--grid-cell)_var(--grid-cell)] before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-margin-red sm:py-10 sm:pl-16 sm:pr-10 sm:before:left-8",
  back: "inline-flex min-h-12 items-center text-label text-ink underline underline-offset-4",
  header: "mt-8 border-b border-ruled-line pb-10",
  title:
    "max-w-[22ch] text-display [overflow-wrap:anywhere] max-sm:text-[2rem]",
  description: "mt-5 max-w-[65ch] text-body text-graphite-soft",
  contribution: "mt-8 max-w-[65ch]",
  label: "mb-2 text-label text-graphite",
  text: "max-w-[65ch] text-body text-graphite-soft [overflow-wrap:anywhere]",
  technologies: "mt-6 flex flex-wrap gap-2",
  technology: "border border-page-edge px-3 py-1 text-small text-graphite",
  actions: "mt-7 flex flex-wrap gap-3",
  button: "min-h-12",
  evidence: "my-10 grid gap-10",
  content: "mx-auto max-w-[70ch]",
  block: "border-t border-page-edge py-8",
  blockTitle: "mb-4 text-h2",
  paragraph:
    "mb-4 max-w-[65ch] text-body text-graphite-soft last:mb-0 [overflow-wrap:anywhere]",
  points: "mt-4 grid list-disc gap-3 pl-5 text-body text-graphite-soft",
  related: "mt-10 grid gap-4 border-t border-ruled-line pt-8 sm:grid-cols-2",
  relatedLink:
    "flex min-h-12 flex-col justify-center border border-page-edge p-4 text-label text-ink [overflow-wrap:anywhere]",
  cta: "mt-10 border-t border-ruled-line py-10",
} as const;

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, params.locale)) return [];
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();

  const title = `${project.name[locale]} — ${locale === "es" ? "Caso de estudio" : "Case study"}`;
  const description = project.study.description[locale];
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/proyectos/${project.slug}`,
      languages: {
        es: `/es/proyectos/${project.slug}`,
        en: `/en/proyectos/${project.slug}`,
        "x-default": `/es/proyectos/${project.slug}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_MX",
    },
  };
}

export default async function ProjectStudyPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();
  const language = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Studies" });
  const index = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(index + projects.length - 1) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main className={styles.main} id="contenido">
      <Container>
        <div className={styles.page}>
          <Link
            className={styles.back}
            href={{ pathname: "/", hash: "#proyectos" }}
          >
            {t("back")}
          </Link>
          <header className={styles.header}>
            <h1 className={styles.title}>{project.name[language]}</h1>
            <p className={styles.description}>
              {project.study.description[language]}
            </p>
            {project.contribution && (
              <aside
                className={styles.contribution}
                aria-label={t("contribution")}
              >
                <h2 className={styles.label}>{t("contribution")}</h2>
                <p className={styles.text}>{project.contribution[language]}</p>
              </aside>
            )}
            <div className="mt-6">
              <h2 className={styles.label}>{t("technologies")}</h2>
              <ul className={styles.technologies}>
                {project.technologies.map((technology) => (
                  <li className={styles.technology} key={technology}>
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.actions}>
              {project.demo && (
                <Button
                  className={styles.button}
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  variant="default"
                  disableRipple
                >
                  {t("demo")}
                </Button>
              )}
              <Button
                className={styles.button}
                href={project.repository}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                disableRipple
              >
                {t("repository")}
              </Button>
            </div>
          </header>
          <div className={styles.evidence} data-ink-draw>
            <ProjectVisual project={project} locale={language} />
            {project.id === "pwa-utt" && (
              <ProjectScreenshots locale={language} />
            )}
          </div>
          <article className={styles.content}>
            {[
              project.study.problem,
              project.study.architecture,
              project.study.decisions,
              project.study.validation,
              project.study.limitations,
            ].map((block) => (
              <StudySection
                key={block.title[language]}
                block={block}
                locale={language}
              />
            ))}
          </article>
          <nav className={styles.related} aria-label={t("moreProjects")}>
            {[
              { project: previous, label: t("previous") },
              { project: next, label: t("next") },
            ].map(({ project: related, label }) => (
              <Link
                className={styles.relatedLink}
                key={related.slug}
                href={`/proyectos/${related.slug}`}
              >
                <span>{label}</span>
                <span>{related.name[language]}</span>
              </Link>
            ))}
          </nav>
          <section className={styles.cta} aria-labelledby="case-contact-title">
            <h2 className={styles.blockTitle} id="case-contact-title">
              {t("contactTitle")}
            </h2>
            <p className={styles.text}>{t("contactText")}</p>
            <div className={styles.actions}>
              {profile.email && (
                <Button
                  className={styles.button}
                  href={`mailto:${profile.email}`}
                  variant="default"
                  disableRipple
                >
                  {t("contactEmail")}
                </Button>
              )}
              <Link
                className={styles.back}
                href={{ pathname: "/", hash: "#contacto" }}
              >
                {t("contactMore")}
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}

function StudySection({
  block,
  locale,
}: {
  block: StudyBlock;
  locale: Locale;
}) {
  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>{block.title[locale]}</h2>
      {block.paragraphs.map((paragraph) => (
        <p className={styles.paragraph} key={paragraph[locale]}>
          <InlineCode text={paragraph[locale]} />
        </p>
      ))}
      {block.points && (
        <ul className={styles.points}>
          {block.points.map((point) => (
            <li key={point[locale]}>
              <InlineCode text={point[locale]} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
