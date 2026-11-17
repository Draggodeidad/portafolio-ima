import { getTranslations } from "next-intl/server";
import { ActionArrow } from "@/components/ui/action-arrow";
import { Button } from "@/components/ui/b-button";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { ContactForm } from "@/components/sections/contact-form";
import { CopyEmailButton } from "@/components/contact/copy-email-button";
import type { Locale } from "@/i18n/routing";
import {
  getSkillName,
  profile,
  publishedExperienceEntries,
  skills,
} from "@/content/profile";
import ink from "./profile-sections.module.css";

const styles = {
  section: "py-[40px]",
  page: "relative border border-page-edge bg-paper bg-[image:var(--paper-grid)] bg-size-[length:var(--grid-cell)_var(--grid-cell)] py-[40px] pl-12 pr-5 before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-margin-red sm:pl-16 sm:pr-10 sm:before:left-8",
  narrow: "mx-auto max-w-[70ch]",
  content: "max-w-[70ch] space-y-[20px] [&>h2+p]:pt-[10px]",
  timeline: "mt-[40px] space-y-[40px]",
  entry:
    "grid gap-[10px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-[40px]",
  mark: "size-[20px] shrink-0 text-ink",
  status: "sr-only",
  note: "flex items-start gap-x-[10px] text-small text-graphite-soft lg:col-start-2 lg:row-start-1",
  entryBody: "max-w-[70ch] lg:col-start-1 lg:row-start-1",
  entryTitle: "text-h3 text-graphite",
  detail: "mt-[10px] max-w-[52ch] text-body text-graphite",
  muted: "text-body text-graphite-soft",
  stack: "mt-[40px] border-t border-ruled-line pt-[40px]",
  stackTitle: "text-h3 text-graphite",
  skills: "mt-[20px] grid gap-x-[40px] gap-y-[20px] md:grid-cols-2",
  skill: "min-w-0 border-t border-grid-line pt-[10px]",
  skillName: "text-label text-graphite",
  contactLayout: "grid gap-[20px] lg:grid-cols-2 lg:gap-[40px]",
  contact: "space-y-[20px]",
  actions: "flex flex-wrap items-center gap-[10px]",
  link: "inline-flex min-h-12 items-center text-label text-ink underline decoration-1 underline-offset-4 hover:text-ink-deep",
  email: "max-w-full break-all text-body text-graphite",
  footer: "py-[40px]",
  footerInner: "flex flex-wrap items-center justify-between gap-[20px]",
  footerLinks: "flex flex-wrap gap-[20px]",
} as const;

type ProfileSectionsProps = { locale: Locale };

export async function AboutSection({ locale }: ProfileSectionsProps) {
  const t = await getTranslations({ locale, namespace: "About" });
  const stack = await getTranslations({ locale, namespace: "Stack" });
  return (
    <section
      id="sobre-mi"
      className={styles.section}
      aria-labelledby="about-heading"
    >
      <Container>
        <div className={styles.page}>
          <div className={styles.narrow}>
            <div className={styles.content}>
              <SectionHeading id="about-heading" title={t("heading")} />
              <p>{t("lead")}</p>
              <p>{t("paragraph")}</p>
              <p>{t("personalNote")}</p>
            </div>
            <div id="stack" className={styles.stack}>
              <h3 className={styles.stackTitle}>{stack("heading")}</h3>
              <ul className={styles.skills}>
                {skills
                  .filter((skill) => skill.evidence === "project")
                  .map((skill) => (
                    <li
                      className={styles.skill}
                      key={getSkillName(skill, "es")}
                    >
                      <span className={styles.skillName}>
                        {getSkillName(skill, locale)}
                      </span>
                      <p className={styles.muted}>{skill.context[locale]}</p>
                    </li>
                  ))}
              </ul>
              <p className="mt-[40px] max-w-[70ch] text-body text-graphite">
                {stack("declared")}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export async function ExperienceSection({ locale }: ProfileSectionsProps) {
  const t = await getTranslations({ locale, namespace: "Experience" });
  const order = ["1degree-internship", "utt-tsu", "utt-engineering"];
  const entries = order.flatMap((id) =>
    publishedExperienceEntries.filter((entry) => entry.id === id),
  );
  if (!entries.length) return null;
  return (
    <section
      id="trayectoria"
      className={styles.section}
      aria-labelledby="experience-heading"
    >
      <Container>
        <div className={styles.page}>
          <SectionHeading id="experience-heading" title={t("heading")} />
          <ol className={styles.timeline}>
            {entries.map((entry) => {
              const pending = entry.id === "utt-engineering";
              return (
                <li className={styles.entry} key={entry.id}>
                  <div className={styles.note}>
                    <svg
                      className={styles.mark}
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      {pending ? (
                        <path
                          className={ink.mark}
                          d="M10 2.4C5.6 2.2 2.5 5.7 2.7 10.2c.1 4.3 3.1 7.3 7.4 7.1 4.2-.1 7.4-3.2 7.2-7.5-.1-4.3-3.1-7.2-7.3-7.4Z"
                        />
                      ) : (
                        <path
                          className={ink.mark}
                          d="M2.8 10.4 7.5 15.2 17.2 4.5"
                        />
                      )}
                    </svg>
                    <p className={styles.status}>
                      {t(pending ? "inProgress" : "completed")}
                    </p>
                    <span>
                      {entry.period[locale]} · {entry.organization}
                      {entry.modality && ` · ${entry.modality[locale]}`}
                    </span>
                  </div>
                  <div className={styles.entryBody}>
                    <h3 className={styles.entryTitle}>{entry.title[locale]}</h3>
                    <p className={styles.detail}>{entry.description[locale]}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export async function ContactSection({ locale }: ProfileSectionsProps) {
  const t = await getTranslations({ locale, namespace: "Contact" });
  const cv = profile.cv;
  return (
    <section
      id="contacto"
      className={styles.section}
      aria-labelledby="contact-heading"
    >
      <Container>
        <div className={styles.page}>
          <div className={styles.contactLayout}>
            <div className={styles.content}>
              <SectionHeading id="contact-heading" title={t("heading")} />
              <p>{t("intro")}</p>
            </div>
            <div className={styles.contact}>
              {profile.email && (
                <>
                  <div className={styles.actions}>
                    <Button
                      href={`mailto:${profile.email}`}
                      variant="default"
                      disableRipple
                    >
                      {t("emailAction")}
                    </Button>
                    <CopyEmailButton
                      email={profile.email}
                      copy={{
                        idle: t("copyEmail"),
                        done: t("copyEmailDone"),
                        failed: t("copyEmailFailed", { email: profile.email }),
                      }}
                    />
                  </div>
                  <p className={styles.email}>{profile.email}</p>
                </>
              )}
              <div className={styles.actions}>
                {cv && (
                  <Button href={cv.href} download variant="outline">
                    {t("cvLink", {
                      language: t(`cvLanguages.${cv.locale}`),
                      format: cv.format,
                    })}
                    <ActionArrow download />
                  </Button>
                )}
                <a
                  className={styles.link}
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                  <ActionArrow />
                </a>
                <a
                  className={styles.link}
                  href={profile.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                  <ActionArrow />
                </a>
              </div>
            </div>
          </div>
          <ContactForm
            copy={{
              formTitle: t("formTitle"),
              formIntro: t("formIntro"),
              nameLabel: t("nameLabel"),
              emailLabel: t("emailLabel"),
              messageLabel: t("messageLabel"),
              submit: t("submit"),
              submitting: t("submitting"),
              success: t("success"),
              errorGeneric: t("errorGeneric"),
              errorRateLimit: t("errorRateLimit"),
              verification: t("verification"),
              verificationRequired: t("verificationRequired"),
              validation: {
                required: t("validation.required"),
                email: t("validation.email"),
                tooShort: t("validation.tooShort"),
                tooLong: t("validation.tooLong"),
              },
            }}
          />
        </div>
      </Container>
    </section>
  );
}

export async function SiteFooter({ locale }: ProfileSectionsProps) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  return (
    <footer className={styles.footer}>
      <Container className={styles.footerInner}>
        <p className="text-label text-graphite">{profile.name}</p>
        <nav className={styles.footerLinks} aria-label={t("linksLabel")}>
          <a
            className={styles.link}
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ActionArrow />
          </a>
          <a
            className={styles.link}
            href={profile.linkedIn}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
            <ActionArrow />
          </a>
        </nav>
        <p className="text-small text-graphite-soft">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </Container>
    </footer>
  );
}
