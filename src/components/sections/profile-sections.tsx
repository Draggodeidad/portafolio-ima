import {
  ArrowUpRight,
  Braces,
  Database,
  Download,
  Layers3,
  Mail,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { ContactForm } from "@/components/sections/contact-form";
import { CopyEmailButton } from "@/components/contact/copy-email-button";
import { Button } from "@/components/ui/b-button";
import type { Locale } from "@/i18n/routing";
import {
  getSkillName,
  profile,
  publishedExperienceEntries,
  skillGroups,
  skills,
  type SkillGroupId,
} from "@/content/profile";

const styles = {
  section:
    "scroll-mt-[calc(var(--nav-height)+24px)] border-b border-border-subtle py-16 md:py-24",
  sectionInner: "space-y-10",
  aboutGrid:
    "grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16",
  aboutLead:
    "max-w-xl text-xl font-medium leading-8 text-foreground sm:text-2xl sm:leading-9",
  aboutBody: "max-w-2xl space-y-4 text-base leading-7 text-muted-foreground",
  personalNote:
    "inline-flex items-center gap-2 border-l border-accent pl-4 text-sm text-navigation",
  skillGrid: "grid gap-4 sm:grid-cols-2",
  skillCard: "min-w-0 border border-border-subtle bg-surface p-5 sm:p-6",
  skillHeader: "mb-5 flex items-center gap-3",
  skillIcon:
    "grid size-10 shrink-0 place-items-center border border-control-border bg-control-surface text-accent",
  skillTitle: "m-0 font-display text-lg font-semibold text-foreground",
  skillList: "space-y-4",
  skill: "border-t border-border-subtle pt-4 first:border-0 first:pt-0",
  skillNameRow: "flex flex-wrap items-center justify-between gap-2",
  skillName: "font-medium text-foreground",
  evidence: "font-mono text-xs uppercase tracking-[0.08em] text-navigation",
  skillContext: "mt-1.5 text-sm leading-6 text-muted-foreground",
  timeline: "relative ml-2 space-y-8 border-l border-border-subtle pl-7",
  timelineEntry:
    "relative grid gap-2 md:grid-cols-[minmax(10rem,0.35fr)_minmax(0,1fr)] md:gap-8",
  timelineMark:
    "absolute -left-[2.05rem] top-1.5 size-3 border border-accent bg-background",
  timelineKind: "font-mono text-xs uppercase tracking-[0.08em] text-accent",
  timelineTitle: "m-0 text-lg font-semibold text-foreground",
  timelineRole: "m-0 mt-1 text-sm leading-6 text-foreground",
  timelinePeriod: "font-mono text-xs text-navigation",
  timelineDescription: "m-0 text-sm leading-6 text-muted-foreground",
  contactGrid:
    "grid gap-10 lg:gap-12 lg:has-[form]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]",
  contactDirect: "flex max-w-2xl flex-col items-start gap-8",
  contactLead: "m-0 max-w-lg text-lg leading-8 text-muted-foreground",
  emailRow: "flex flex-wrap items-start gap-x-2 gap-y-3",
  emailAction: "min-h-12 max-w-full !rounded-none px-5 text-base font-semibold",
  cvAction: "min-h-11 !rounded-none px-4 text-sm font-semibold",
  socialList: "flex flex-wrap gap-x-6 gap-y-1",
  socialLink:
    "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-navigation underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
  footer: "py-8",
  footerInner:
    "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between",
  footerName:
    "m-0 font-mono text-xs uppercase tracking-[0.08em] text-navigation",
  footerLinks: "flex flex-wrap gap-x-5 gap-y-3",
  footerLink:
    "inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
  copyright: "m-0 font-mono text-xs text-muted-foreground",
} as const;

const groupIcons = {
  backend: Braces,
  frontend: Layers3,
  data: Database,
  tools: Wrench,
} satisfies Record<SkillGroupId, typeof Braces>;

type ProfileSectionsProps = {
  locale: Locale;
};

export async function AboutSection({ locale }: ProfileSectionsProps) {
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <section
      id="sobre-mi"
      className={styles.section}
      aria-labelledby="about-heading"
    >
      <Container className={styles.sectionInner}>
        <SectionHeading
          id="about-heading"
          eyebrow={t("eyebrow")}
          title={t("heading")}
        />
        <div className={styles.aboutGrid}>
          <p className={styles.aboutLead}>{t("lead")}</p>
          <div className={styles.aboutBody}>
            <p>{t("paragraph")}</p>
            <p className={styles.personalNote}>{t("personalNote")}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export async function StackSection({ locale }: ProfileSectionsProps) {
  const t = await getTranslations({ locale, namespace: "Stack" });

  return (
    <section
      id="stack"
      className={styles.section}
      aria-labelledby="stack-heading"
    >
      <Container className={styles.sectionInner}>
        <SectionHeading
          id="stack-heading"
          eyebrow={t("eyebrow")}
          title={t("heading")}
        />
        <div className={styles.skillGrid}>
          {skillGroups.map((group) => {
            const Icon = groupIcons[group];
            const groupSkills = skills.filter((skill) => skill.group === group);
            return (
              <article className={styles.skillCard} key={group}>
                <header className={styles.skillHeader}>
                  <span className={styles.skillIcon} aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <h3 className={styles.skillTitle}>{t(`groups.${group}`)}</h3>
                </header>
                <ul className={styles.skillList}>
                  {groupSkills.map((skill) => (
                    <li
                      className={styles.skill}
                      key={getSkillName(skill, "es")}
                    >
                      <div className={styles.skillNameRow}>
                        <span className={styles.skillName}>
                          {getSkillName(skill, locale)}
                        </span>
                        <span className={styles.evidence}>
                          {t(`evidence.${skill.evidence}`)}
                        </span>
                      </div>
                      <p className={styles.skillContext}>
                        {skill.context[locale]}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export async function ExperienceSection({ locale }: ProfileSectionsProps) {
  if (!publishedExperienceEntries.length) return null;

  const t = await getTranslations({ locale, namespace: "Experience" });

  return (
    <section
      id="trayectoria"
      className={styles.section}
      aria-labelledby="experience-heading"
    >
      <Container className={styles.sectionInner}>
        <SectionHeading
          id="experience-heading"
          eyebrow={t("eyebrow")}
          title={t("heading")}
        />
        <ol className={styles.timeline}>
          {publishedExperienceEntries.map((entry) => (
            <li className={styles.timelineEntry} key={entry.id}>
              <span className={styles.timelineMark} aria-hidden="true" />
              <div>
                <p className={styles.timelineKind}>
                  {t(`kinds.${entry.kind}`)}
                </p>
                <h3 className={styles.timelineTitle}>{entry.organization}</h3>
                <p className={styles.timelineRole}>{entry.title[locale]}</p>
                <p className={styles.timelinePeriod}>{entry.period[locale]}</p>
              </div>
              <p className={styles.timelineDescription}>
                {entry.description[locale]}
              </p>
            </li>
          ))}
        </ol>
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
      <Container className={styles.sectionInner}>
        <SectionHeading
          id="contact-heading"
          eyebrow={t("eyebrow")}
          title={t("heading")}
        />
        <div className={styles.contactGrid}>
          <div className={styles.contactDirect}>
            <p className={styles.contactLead}>{t("intro")}</p>
            {profile.email ? (
              <div className={styles.emailRow}>
                <Button
                  className={styles.emailAction}
                  disableRipple
                  href={`mailto:${profile.email}`}
                  icon={<Mail size={18} aria-hidden="true" />}
                  size="lg"
                >
                  {profile.email}
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
            ) : null}
            {cv ? (
              <Button
                className={styles.cvAction}
                disableRipple
                download
                href={cv.href}
                icon={<Download size={16} aria-hidden="true" />}
                size="lg"
                variant="outline"
              >
                {t("cvLink", {
                  language: t(`cvLanguages.${cv.locale}`),
                  format: cv.format,
                })}
              </Button>
            ) : null}
            <nav className={styles.socialList} aria-label={t("socialLabel")}>
              <a
                className={styles.socialLink}
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a
                className={styles.socialLink}
                href={profile.linkedIn}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </nav>
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
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.footerInner}>
        <p className={styles.footerName}>{profile.name}</p>
        <nav className={styles.footerLinks} aria-label={t("linksLabel")}>
          <a
            className={styles.footerLink}
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className={styles.footerLink}
            href={profile.linkedIn}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </nav>
        <p className={styles.copyright}>{t("copyright", { year })}</p>
      </Container>
    </footer>
  );
}
