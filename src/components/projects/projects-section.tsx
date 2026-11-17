import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/b-button";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/routing";
import { ProjectVisual } from "./project-visual";
import { ProjectScreenshots } from "./project-screenshots";

const styles = {
  section:
    "scroll-mt-[calc(var(--nav-height)+20px)] bg-paper py-20 text-graphite",
  title: "mb-10 text-h2",
  feature:
    "grid min-w-0 gap-8 border-y border-ruled-line py-10 lg:grid-cols-2 lg:items-center",
  heading: "mb-4 text-h3 [overflow-wrap:anywhere]",
  body: "max-w-[65ch] text-body text-graphite-soft",
  action: "mt-5 min-h-12 text-ink",
  secondary: "grid gap-10 pt-10 md:grid-cols-2",
  card: "flex min-w-0 flex-col gap-5 border-b border-page-edge pb-8",
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
          <div>
            <h3 className={styles.heading} id={`project-${featured.id}`}>
              {featured.name[locale]}
            </h3>
            <p className={styles.body}>{featured.summary[locale]}</p>
            <Button
              className={styles.action}
              variant="link"
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
                </div>
                <ProjectVisual project={project} locale={locale} />
                <div className="mt-auto">
                  <Button
                    className={styles.action}
                    variant="link"
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
