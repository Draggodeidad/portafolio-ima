import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/b-button";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/routing";
import { ProjectVisual } from "./project-visual";
import { ProjectScreenshots } from "./project-screenshots";

const styles = {
  section: "bg-desk py-10 text-graphite",
  title: "mb-10 text-h2",
  feature:
    "relative grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 border border-page-edge bg-paper py-10 pl-12 pr-5 [background-image:var(--paper-grid)] [background-size:var(--grid-cell)_var(--grid-cell)] before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-margin-red sm:pl-16 sm:pr-10 sm:before:left-8 lg:grid-cols-2 lg:items-center",
  heading: "mb-4 text-h3 [overflow-wrap:anywhere]",
  body: "max-w-[65ch] text-body text-graphite-soft [overflow-wrap:anywhere]",
  contributionText: "min-w-0",
  action: "mt-5 min-h-12",
  secondary:
    "relative mt-10 grid gap-10 border border-page-edge bg-paper py-10 pl-12 pr-5 [background-image:var(--paper-grid)] [background-size:var(--grid-cell)_var(--grid-cell)] before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-margin-red sm:pl-16 sm:pr-10 sm:before:left-8",
  card: "grid min-w-0 gap-5 border-b border-ruled-line pb-10 last:border-0 last:pb-0 md:grid-cols-[3fr_2fr] md:gap-x-10",
} as const;

export async function ProjectsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Projects" });
  const ordered = [...projects].sort((a, b) => a.order - b.order);
  const featured = ordered.find((project) => project.featured);
  if (!featured) return null;
  return (
    <section
      className={styles.section}
      id="proyectos"
      aria-labelledby="projects-heading"
    >
      <Container>
        <h2 className={styles.title} id="projects-heading">
          {t("heading")}
        </h2>
        <article
          className={styles.feature}
          aria-labelledby={`project-${featured.id}`}
        >
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <h3 className={styles.heading} id={`project-${featured.id}`}>
              {featured.name[locale]}
            </h3>
            <p className={styles.body}>{featured.summary[locale]}</p>
            {featured.contribution && (
              <div className="mt-6 flex max-w-[55ch] items-start gap-3 text-body">
                <svg
                  className="mt-1 size-5 shrink-0 text-ink"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 12.5c2 1.4 3.4 3.1 5.5 5C12 12.8 16.2 8.3 21 4.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className={styles.contributionText}>
                  <strong className="bg-highlighter px-1 py-0.5 [box-decoration-break:clone]">
                    {featured.contribution[locale]}
                  </strong>
                </p>
              </div>
            )}
            <Button
              className={styles.action}
              variant="outline"
              href={`/${locale}/proyectos/${featured.slug}`}
              disableRipple
            >
              {t("exploreCase")}
            </Button>
          </div>
          <ProjectScreenshots locale={locale} featured />
        </article>
        <div className={styles.secondary}>
          {ordered
            .filter((project) => !project.featured)
            .map((project) => (
              <article
                className={styles.card}
                key={project.id}
                aria-labelledby={`project-${project.id}`}
              >
                <div>
                  <h3 className={styles.heading} id={`project-${project.id}`}>
                    {project.name[locale]}
                  </h3>
                  <p className={styles.body}>{project.summary[locale]}</p>
                  {project.id === "secure-transfer" && (
                    <p className="mt-5 text-small text-graphite-soft">
                      <s>Demo</s>
                      {project.status[locale].slice(4)}
                    </p>
                  )}
                </div>
                <ProjectVisual project={project} locale={locale} />
                <div className="mt-auto">
                  <Button
                    className={styles.action}
                    variant="outline"
                    href={`/${locale}/proyectos/${project.slug}`}
                    disableRipple
                  >
                    {t("exploreCase")}
                  </Button>
                </div>
              </article>
            ))}
        </div>
      </Container>
    </section>
  );
}
