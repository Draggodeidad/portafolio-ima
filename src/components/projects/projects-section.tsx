import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  ExternalLink,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { projects } from "@/content/projects";
import { Button } from "@/components/ui/b-button";
import { ProjectVisual } from "./project-visual";

const styles = {
  section:
    "scroll-mt-[calc(var(--nav-height)+16px)] border-y border-border-subtle bg-project-canvas py-16 sm:py-20 lg:py-24",
  headingRow:
    "mb-9 flex flex-col gap-5 border-b border-border-subtle pb-6 lg:mb-8 lg:flex-row lg:items-end lg:justify-between",
  eyebrow: "mb-2 font-mono text-[11px] uppercase tracking-[0.11em] text-accent",
  title:
    "font-display text-[clamp(1.8rem,4vw,2.5rem)] font-bold leading-tight tracking-[-0.035em] text-foreground",
  index:
    "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-navigation",
  feature:
    "relative grid gap-7 border border-border-subtle bg-surface p-5 shadow-[0_20px_25px_-5px_rgb(0_0_0/0.1)] sm:p-7 lg:grid-cols-12 lg:gap-8 lg:p-8",
  featureCopy: "flex min-w-0 flex-col items-start lg:col-span-7",
  badge:
    "mb-4 inline-flex items-center gap-2 border border-border-subtle bg-control-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.09em] text-accent",
  dot: "size-1.5 rounded-full bg-accent",
  projectTitle:
    "mb-3 font-display text-[clamp(1.75rem,4vw,2.55rem)] font-bold leading-tight tracking-[-0.035em] text-foreground",
  body: "max-w-2xl text-[15px] leading-7 text-muted-foreground",
  contribution:
    "mt-5 border-l-2 border-accent bg-background/40 px-4 py-3 text-[13px] leading-6 text-navigation",
  contributionLabel:
    "mb-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-foreground",
  tags: "mt-5 flex flex-wrap gap-2",
  tag: "border border-border-subtle bg-control-surface px-2 py-1 font-mono text-[10px] text-foreground",
  visual: "min-w-0 lg:col-span-5",
  featureActions:
    "mt-6 flex w-full flex-wrap items-center gap-3 border-t border-border-subtle pt-5",
  internalLink:
    "inline-flex min-h-11 items-center gap-2 rounded-control border border-control-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  secondaryButton:
    "!min-h-11 !border-control-border !bg-control-surface !px-4 !text-sm !text-foreground hover:!bg-surface-raised",
  smallGrid: "mt-5 grid gap-4 md:grid-cols-2",
  smallCard:
    "flex min-w-0 flex-col border border-border-subtle bg-surface p-5 sm:p-6",
  smallMeta:
    "mb-3 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.09em] text-navigation",
  smallTitle:
    "mb-2 font-display text-[1.6rem] font-bold tracking-[-0.03em] text-foreground",
  smallBody: "mb-5 text-sm leading-6 text-muted-foreground",
  smallVisual: "mb-5",
  smallFooter:
    "mt-auto flex flex-wrap items-center gap-3 border-t border-border-subtle pt-4",
  smallExplore:
    "inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
} as const;

type ProjectsSectionProps = { locale: Locale };

export async function ProjectsSection({ locale }: ProjectsSectionProps) {
  const t = await getTranslations({ locale, namespace: "Projects" });
  const orderedProjects = [...projects].sort((a, b) => a.order - b.order);
  const featured = orderedProjects.find((project) => project.featured);
  const secondary = orderedProjects.filter((project) => !project.featured);
  if (!featured) return null;

  return (
    <section
      className={styles.section}
      id="proyectos"
      aria-labelledby="projects-heading"
    >
      <Container>
        <div className={styles.headingRow}>
          <div>
            <p className={styles.eyebrow}>{t("eyebrow")}</p>
            <h2 className={styles.title} id="projects-heading">
              {t("heading")}
            </h2>
          </div>
          <p className={styles.index}>
            <span>{t("index")}</span>
            <span aria-hidden="true" className="text-accent">
              {"///"}
            </span>
          </p>
        </div>

        <article
          className={styles.feature}
          aria-labelledby={`project-${featured.id}`}
        >
          <div className={styles.featureCopy}>
            <span className={styles.badge}>
              <span className={styles.dot} aria-hidden="true" />
              {t("featuredLabel")} · {featured.type[locale]}
            </span>
            <h3 className={styles.projectTitle} id={`project-${featured.id}`}>
              {featured.name}
            </h3>
            <p className={styles.body}>{featured.summary[locale]}</p>
            <p className={styles.contribution}>
              <span className={styles.contributionLabel}>
                {t("contribution")}
              </span>
              {featured.contribution?.[locale]}
            </p>
            <ul className={styles.tags} aria-label={t("technologyList")}>
              {featured.technologies.map((technology) => (
                <li className={styles.tag} key={technology}>
                  {technology}
                </li>
              ))}
            </ul>
            <div className={styles.featureActions}>
              <Link
                className={styles.internalLink}
                href={`/proyectos/${featured.slug}`}
              >
                {t("exploreCase")}{" "}
                <ArrowDownRight size={16} aria-hidden="true" />
              </Link>
              {featured.demo && (
                <Button
                  className={cn(
                    styles.secondaryButton,
                    "focus-visible:!outline-accent",
                  )}
                  href={featured.demo}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  size="sm"
                  disableRipple
                  icon={<ExternalLink size={14} aria-hidden="true" />}
                  iconPosition="end"
                >
                  {t("openApp")}
                </Button>
              )}
              <Button
                className={cn(
                  styles.secondaryButton,
                  "focus-visible:!outline-accent",
                )}
                href={featured.repository}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                size="sm"
                disableRipple
                icon={<Code2 size={14} aria-hidden="true" />}
                iconPosition="start"
              >
                {t("viewCode")}
              </Button>
              <span className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-navigation">
                <span className={styles.dot} aria-hidden="true" />
                {featured.status[locale]}
              </span>
            </div>
          </div>
          <div className={styles.visual}>
            <ProjectVisual project={featured} locale={locale} />
          </div>
        </article>

        <div className={styles.smallGrid}>
          {secondary.map((project, index) => (
            <article
              className={styles.smallCard}
              aria-labelledby={`project-${project.id}`}
              key={project.id}
            >
              <div className={styles.smallMeta}>
                <span className="text-accent">{project.type[locale]}</span>
                <span>
                  {t("record", { number: String(index + 2).padStart(2, "0") })}
                </span>
              </div>
              <h3 className={styles.smallTitle} id={`project-${project.id}`}>
                {project.name}
              </h3>
              <p className={styles.smallBody}>{project.summary[locale]}</p>
              <div className={styles.smallVisual}>
                <ProjectVisual project={project} locale={locale} compact />
              </div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.08em] text-navigation">
                {project.status[locale]}
              </p>
              <ul className={styles.tags} aria-label={t("technologyList")}>
                {project.technologies.map((technology) => (
                  <li className={styles.tag} key={technology}>
                    {technology}
                  </li>
                ))}
              </ul>
              <div className={styles.smallFooter}>
                <Link
                  className={cn(styles.smallExplore, "mr-auto")}
                  href={`/proyectos/${project.slug}`}
                >
                  {t("exploreCase")}{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Button
                  className={styles.secondaryButton}
                  href={project.repository}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  size="sm"
                  disableRipple
                  icon={<Code2 size={14} aria-hidden="true" />}
                  iconPosition="start"
                >
                  {t("viewCode")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
