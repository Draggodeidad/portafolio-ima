import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ActionArrow } from "@/components/ui/action-arrow";
import { Button } from "@/components/ui/b-button";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/routing";
import styles from "./hero.module.css";

const classes = {
  section: "mx-auto max-w-[var(--content-width)] pt-[var(--nav-height)]",
  book: "relative grid border border-page-edge bg-paper md:grid-cols-2",
  page: "relative min-w-0",
  heading: "m-0 text-display",
  role: "mt-6 text-h3",
  description: "mt-4 max-w-[450px] text-body",
  actions: "my-[30px] flex flex-wrap items-center gap-x-[10px] gap-y-2",
  evidence: "space-y-2 text-small",
  evidenceItem: "flex items-start gap-[10px]",
  title: "text-h2",
  subtitle: "mb-5 text-small",
  notes: "mt-[30px] space-y-[10px] text-annotation text-ink",
  note: "flex items-center gap-[10px]",
} as const;
function Mark({ pending = false }: { pending?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="mt-0.5 size-5 shrink-0 fill-none stroke-ink"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={
          pending
            ? "M10 2.5 C15 2 18 5.5 17.5 10 C17 15 14 18 9.5 17.5 C5 17 2 14 2.5 9.5 C3 5 5.5 2.5 10 2.5Z"
            : "M2 10 L7 15 L18 3"
        }
      />
    </svg>
  );
}
function Arrow({ animated }: { animated: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 20"
      className="h-5 w-10 shrink-0 fill-none stroke-ink"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        className={animated ? styles.noteDraw : undefined}
        pathLength={1}
        d="M2 15 Q17 14 34 5 M27 3 L35 5 L31 12"
      />
    </svg>
  );
}
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Hero" });
  const evidence = t.raw("evidence") as string[];
  const notes = t.raw("notes") as string[];
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className={classes.section}
    >
      <div className={classes.book}>
        <div className={styles.spine} aria-hidden="true" />
        <div className={`${classes.page} ${styles.page}`}>
          <h1 id="hero-title" className={classes.heading}>
            Imanol Antonio
            <br />
            De la Cruz
          </h1>
          <p className={classes.role}>
            {t("roleStart")}
            <span className={styles.circled}>
              backend
              <svg
                aria-hidden="true"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
              >
                <path
                  className={styles.draw}
                  pathLength={1}
                  d="M4 21 C3 5 30 2 54 3 C85 2 98 10 96 20 C94 33 72 37 47 37 C20 37 5 32 4 21Z"
                />
              </svg>
            </span>
            {t("roleEnd")}
          </p>
          <p className={classes.description}>{t("description")}</p>
          <div className={classes.actions}>
            <Button
              href="#proyectos"
              variant="default"
              className="desktop:px-[10px]"
            >
              {t("projects")}{" "}
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="ml-[10px] size-4 fill-none stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10 H17 M12 5 L17 10 L12 15" />
              </svg>
            </Button>
            {profile.cv && (
              <Button href={profile.cv.href} download variant="outline">
                {t("cv", {
                  language: t(`cvLanguages.${profile.cv.locale}`),
                  format: profile.cv.format,
                })}
                <ActionArrow download />
              </Button>
            )}
            <Button href="#contacto" variant="outline">
              {t("contact")}
            </Button>
          </div>
          <ul className={classes.evidence}>
            {evidence.map((item, index) => (
              <li className={classes.evidenceItem} key={item}>
                <Mark pending={index === 1} />
                <span
                  className={index === 1 ? "text-graphite-soft" : undefined}
                >
                  <span className="sr-only">
                    {item.slice(0, item.indexOf(":") + 2)}
                  </span>
                  {index === 0 ? (
                    <>
                      <strong className={styles.highlight}>
                        {item.slice(item.indexOf(":") + 2, item.indexOf(" · "))}
                      </strong>
                      {item.slice(item.indexOf(" · "))}
                    </>
                  ) : (
                    item.slice(item.indexOf(":") + 2)
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${classes.page} ${styles.page} ${styles.right}`}>
          <h2 className={classes.title}>PWA UTT</h2>
          <p className={classes.subtitle}>{t("subtitle")}</p>
          <figure className={styles.print}>
            <Image
              src="/images/projects/pwa-utt/coordinacion-resumen-800.webp"
              alt={t("imageAlt")}
              width={800}
              height={558}
              sizes="(min-width: 1280px) 500px, (min-width: 768px) 40vw, calc(100vw - 100px)"
              loading="eager"
              fetchPriority="high"
              className={styles.image}
            />
            <figcaption className="pt-[10px] text-small text-graphite-soft">
              {t("caption")}
            </figcaption>
          </figure>
          <ul className={`${classes.notes} ${styles.notes}`}>
            {notes.map((note, index) => (
              <li key={note} className={classes.note}>
                <Arrow animated={index < 3} />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
