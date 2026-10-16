import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, Code2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/b-button";
import { Container } from "@/components/layout/container";
import { ProjectVisual } from "@/components/projects/project-visual";
import { getProject, projects, type StudyBlock } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const styles = {
  main: "pb-20 pt-[calc(var(--nav-height)+32px)] sm:pt-[calc(var(--nav-height)+48px)]",
  back: "mb-8 inline-flex min-h-11 items-center gap-2 rounded-control px-1 text-sm font-semibold text-navigation underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
  hero: "grid gap-8 border-b border-border-subtle pb-10 lg:grid-cols-12 lg:items-end",
  heroCopy: "min-w-0 lg:col-span-8",
  eyebrow: "mb-3 font-mono text-[11px] uppercase tracking-[0.11em] text-accent",
  title:
    "mb-4 font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.045em] text-foreground",
  description:
    "max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8",
  status:
    "mt-5 inline-flex items-start gap-2 border border-border-subtle bg-surface px-3 py-2 font-mono text-[10px] uppercase leading-5 tracking-[0.08em] text-navigation",
  dot: "mt-[7px] size-1.5 shrink-0 rounded-full bg-accent",
  heroActions: "flex flex-wrap gap-3 lg:col-span-4 lg:justify-end",
  button: "!min-h-11 !px-4 !text-sm",
  visual: "my-8 lg:my-10",
  contribution:
    "mb-8 grid gap-2 border-l-2 border-accent bg-surface px-5 py-4 sm:grid-cols-[11rem_1fr] sm:items-start",
  contributionLabel:
    "font-mono text-[10px] uppercase tracking-[0.1em] text-accent",
  contributionText: "text-sm leading-6 text-foreground",
  techPanel:
    "mb-12 flex flex-col gap-3 border-y border-border-subtle py-5 sm:flex-row sm:items-center sm:gap-6",
  techLabel:
    "shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-navigation",
  techList: "flex flex-wrap gap-2",
  tech: "border border-border-subtle bg-control-surface px-2 py-1 font-mono text-[10px] text-foreground",
  content:
    "grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]",
  contentIntro: "lg:sticky lg:top-[calc(var(--nav-height)+24px)] lg:self-start",
  contentTitle:
    "mb-4 font-display text-2xl font-bold tracking-[-0.03em] text-foreground",
  contentLead: "text-sm leading-7 text-muted-foreground",
  blocks: "grid gap-8",
  block: "border-t border-border-subtle pt-5",
  blockTitle: "mb-3 font-display text-xl font-semibold text-foreground",
  paragraph: "mb-3 text-sm leading-7 text-muted-foreground last:mb-0",
  points:
    "mt-4 grid gap-3 pl-5 text-sm leading-6 text-muted-foreground marker:text-accent",
  related: "mt-16 grid gap-3 border-t border-border-subtle pt-6 sm:grid-cols-2",
  relatedLink:
    "flex min-h-20 items-center justify-between gap-4 border border-border-subtle bg-surface px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  relatedLabel:
    "mb-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-navigation",
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

  const title = `${project.name} — ${locale === "es" ? "Caso de estudio" : "Case study"}`;
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
        <Link
          className={styles.back}
          href={{ pathname: "/", hash: "#proyectos" }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t("back")}
        </Link>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              {t("caseLabel")} · {project.type[language]}
            </p>
            <h1 className={styles.title}>{project.name}</h1>
            <p className={styles.description}>
              {project.study.description[language]}
            </p>
            <p className={styles.status}>
              <span className={styles.dot} aria-hidden="true" />
              {project.status[language]}
            </p>
          </div>
          <div className={styles.heroActions}>
            {project.demo && (
              <Button
                className={styles.button}
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                variant="default"
                size="sm"
                disableRipple
                icon={<ExternalLink size={15} aria-hidden="true" />}
                iconPosition="end"
              >
                {t("demo")}
              </Button>
            )}
            <Button
              className={cn(
                styles.button,
                "!border-control-border !bg-control-surface !text-foreground",
              )}
              href={project.repository}
              target="_blank"
              rel="noreferrer"
              variant="outline"
              size="sm"
              disableRipple
              icon={<Code2 size={15} aria-hidden="true" />}
              iconPosition="start"
            >
              {t("repository")}
            </Button>
          </div>
        </header>

        <div className={styles.visual}>
          <ProjectVisual project={project} locale={language} />
        </div>

        {project.contribution && (
          <aside className={styles.contribution} aria-label={t("contribution")}>
            <span className={styles.contributionLabel}>
              {t("contribution")}
            </span>
            <p className={styles.contributionText}>
              {project.contribution[language]}
            </p>
          </aside>
        )}

        <div className={styles.techPanel}>
          <h2 className={styles.techLabel}>{t("technologies")}</h2>
          <ul className={styles.techList}>
            {project.technologies.map((technology) => (
              <li className={styles.tech} key={technology}>
                {technology}
              </li>
            ))}
          </ul>
        </div>

        <article className={styles.content}>
          <div className={styles.contentIntro}>
            <p className={styles.eyebrow}>
              {project.id.toUpperCase().replaceAll("-", "_")}
            </p>
            <h2 className={styles.contentTitle}>
              {project.study.problem.title[language]}
            </h2>
            {project.study.problem.paragraphs.map((paragraph) => (
              <p className={styles.contentLead} key={paragraph[language]}>
                {paragraph[language]}
              </p>
            ))}
          </div>
          <div className={styles.blocks}>
            <StudySection
              block={project.study.architecture}
              locale={language}
            />
            <StudySection block={project.study.decisions} locale={language} />
            <StudySection block={project.study.validation} locale={language} />
            <StudySection block={project.study.limitations} locale={language} />
          </div>
        </article>

        <nav className={styles.related} aria-label={t("moreProjects")}>
          <RelatedProject
            project={previous}
            label={t("previous")}
            direction="previous"
          />
          <RelatedProject project={next} label={t("next")} direction="next" />
        </nav>
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
          {paragraph[locale]}
        </p>
      ))}
      {block.points && (
        <ul className={styles.points}>
          {block.points.map((point) => (
            <li key={point[locale]}>{point[locale]}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RelatedProject({
  project,
  label,
  direction,
}: {
  project: (typeof projects)[number];
  label: string;
  direction: "previous" | "next";
}) {
  return (
    <Link className={styles.relatedLink} href={`/proyectos/${project.slug}`}>
      {direction === "previous" && (
        <ArrowLeft
          className="shrink-0 text-accent"
          size={18}
          aria-hidden="true"
        />
      )}
      <span className="min-w-0">
        <span className={styles.relatedLabel}>{label}</span>
        <span className="block truncate">{project.name}</span>
      </span>
      {direction === "next" && (
        <ArrowRight
          className="shrink-0 text-accent"
          size={18}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
