import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/b-button";
import { Container } from "@/components/layout/container";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { cvHref, profilePhotoSrc } from "@/content/profile";
import { NodeSelector } from "./node-selector";
import { HudVisual } from "./hud-visual";
import styles from "./hero.module.css";

const classes = {
  section:
    "scroll-mt-[calc(var(--nav-height)+24px)] border-b border-border-subtle",
  container:
    "grid items-center gap-12 py-14 md:gap-10 md:py-16 lg:grid-cols-12 lg:gap-10 lg:py-20",
  copy: "flex min-w-0 flex-col items-start gap-6 lg:col-span-7",
  eyebrow:
    "inline-flex items-center gap-2 border border-border-subtle bg-surface px-3 py-1.5 font-mono text-xs font-medium tracking-wide text-accent",
  eyebrowMark: "size-2 bg-accent",
  heading:
    "m-0 max-w-full font-display text-[clamp(2.5rem,5.8vw,3.5rem)] font-bold uppercase leading-[0.98] tracking-[-0.055em] text-foreground",
  headingSecondLine: "block text-navigation",
  role: "m-0 max-w-[40rem] text-lg font-semibold leading-7 text-accent sm:text-xl",
  description:
    "m-0 max-w-[40rem] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-[1.7]",
  actions: "flex w-full flex-wrap items-center gap-3 sm:gap-4",
  primaryAction:
    "!rounded-none !border-accent !bg-accent !text-accent-foreground hover:!bg-accent/90 focus-visible:!ring-accent",
  secondaryAction:
    "!rounded-none !border-border !bg-surface/90 !text-foreground hover:!bg-surface-raised focus-visible:!ring-accent",
  actionCode: "font-mono text-xs tracking-[0.08em] text-navigation",
  hudColumn: "min-w-0 lg:col-span-5",
  figure: "m-0",
  frame:
    "relative aspect-[4/5] overflow-hidden border border-border bg-surface",
  frameCorners: "pointer-events-none absolute inset-2 z-10",
  corner: "absolute size-3 border-accent",
  cornerTopLeft: "left-0 top-0 border-l-2 border-t-2",
  cornerTopRight: "right-0 top-0 border-r-2 border-t-2",
  cornerBottomLeft: "bottom-0 left-0 border-b-2 border-l-2",
  cornerBottomRight: "bottom-0 right-0 border-b-2 border-r-2",
  frameHeader:
    "absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3 border-b border-border-subtle pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-navigation",
  frameHeaderLabel: "flex min-w-0 items-center gap-2",
  frameDot: "size-1.5 shrink-0 bg-accent",
  frameBody:
    "absolute inset-x-4 bottom-12 top-12 flex items-center justify-center overflow-hidden border border-border-subtle bg-background",
  photo: "object-cover",
  monogramWrap:
    "relative z-[1] flex size-28 items-center justify-center border border-border bg-surface-raised shadow-[0_0_0_4px_var(--portfolio-background),0_0_0_5px_var(--portfolio-control-border)] sm:size-32",
  monogram:
    "font-display text-6xl font-bold tracking-[-0.08em] text-foreground sm:text-7xl",
  photoCaption:
    "absolute bottom-[calc(50%-5.75rem)] z-[1] translate-y-full font-mono text-[10px] tracking-[0.12em] text-navigation sm:bottom-[calc(50%-6.25rem)]",
  frameFooter:
    "absolute inset-x-4 bottom-4 z-10 flex items-center justify-between gap-3 border-t border-border-subtle pt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent",
  connection:
    "pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible",
} as const;

type HeroProps = {
  locale: Locale;
};

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "Hero" });
  const nodes = (["api", "data", "cloud"] as const).map((id) => ({
    id,
    label: t(`nodes.${id}.label`),
    description: t(`nodes.${id}.description`),
  }));

  return (
    <section
      id="inicio"
      className={classes.section}
      aria-labelledby="hero-title"
    >
      <Container className={classes.container}>
        <div className={classes.copy}>
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowMark} aria-hidden="true" />
            {t("eyebrow")}
          </p>
          <div>
            <h1 className={classes.heading} id="hero-title">
              Imanol Antonio
              <span className={classes.headingSecondLine}>De la Cruz</span>
            </h1>
            <p className={cn(classes.role, "mt-5")}>{t("role")}</p>
          </div>
          <p className={classes.description}>{t("description")}</p>
          <div className={classes.actions}>
            <Button
              className={classes.primaryAction}
              disableRipple
              href="#proyectos"
              icon={
                <Image
                  src="/icons/project-arrow.svg"
                  alt=""
                  width={15}
                  height={12}
                />
              }
              iconPosition="end"
              size="lg"
              variant="default"
            >
              {t("projects")}
            </Button>
            <Button
              className={classes.secondaryAction}
              disableRipple
              href="#contacto"
              size="lg"
              variant="outline"
            >
              <span className={classes.actionCode} aria-hidden="true">
                [ 01 ]
              </span>
              {t("contact")}
            </Button>
            {cvHref ? (
              <a className={styles.cvLink} href={cvHref} download>
                <Image
                  src="/icons/download-cv.svg"
                  alt=""
                  width={12}
                  height={12}
                />
                {locale === "es" ? "Descargar CV" : "Download CV"}
              </a>
            ) : null}
          </div>
        </div>

        <div className={classes.hudColumn}>
          <figure className={cn(classes.figure, styles.figure)}>
            <div className={cn(classes.frame, styles.glass)}>
              <div className={classes.frameCorners} aria-hidden="true">
                <span className={cn(classes.corner, classes.cornerTopLeft)} />
                <span className={cn(classes.corner, classes.cornerTopRight)} />
                <span
                  className={cn(classes.corner, classes.cornerBottomLeft)}
                />
                <span
                  className={cn(classes.corner, classes.cornerBottomRight)}
                />
              </div>
              <div className={classes.frameHeader}>
                <span className={classes.frameHeaderLabel}>
                  <span className={classes.frameDot} aria-hidden="true" />
                  {t("frameHeader")}
                </span>
                <span>IA</span>
              </div>
              <div className={cn(classes.frameBody, styles.frameGrid)}>
                {profilePhotoSrc ? (
                  <Image
                    src={profilePhotoSrc}
                    alt="Imanol Antonio De la Cruz"
                    className={classes.photo}
                    fill
                    priority
                    sizes="(min-width: 1024px) 34vw, 90vw"
                  />
                ) : (
                  <HudVisual>
                    <span
                      className={classes.monogramWrap}
                      role="img"
                      aria-label="Imanol Antonio De la Cruz"
                    >
                      <span className={classes.monogram} aria-hidden="true">
                        IA
                      </span>
                    </span>
                  </HudVisual>
                )}
                <span className={classes.photoCaption} aria-hidden="true">
                  Imanol Antonio
                </span>
              </div>
              <div className={classes.frameFooter}>
                <span>{t("frameFooter")}</span>
                <span>{t("languages")}</span>
              </div>
            </div>
            <NodeSelector
              nodes={nodes}
              label={t("nodeGroupLabel")}
              descriptionLabel={t("nodeDescriptionLabel")}
            />
          </figure>
        </div>
      </Container>
    </section>
  );
}
