import Image from "next/image";
import type { Locale } from "@/i18n/routing";

const screenshots = [
  {
    file: "sincronizacion",
    height: 1030,
    es: "Sincronización",
    en: "Synchronization",
  },
  {
    file: "nueva-inspeccion",
    height: 1076,
    es: "Nueva inspección",
    en: "New inspection",
  },
  {
    file: "inspecciones-activas",
    height: 1076,
    es: "Inspecciones activas",
    en: "Active inspections",
  },
] as const;
const styles = {
  gallery: "grid gap-8 sm:grid-cols-2",
  figure: "relative min-w-0 bg-print p-2 pt-3",
  tape: "absolute -top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 -rotate-2 bg-tape",
  image: "h-auto w-full border border-page-edge",
  caption: "mt-2 text-small text-graphite-soft",
} as const;
export function ProjectScreenshots({
  locale,
  featured = false,
}: {
  locale: Locale;
  featured?: boolean;
}) {
  return (
    <div className={featured ? "" : styles.gallery}>
      {(featured ? screenshots.slice(0, 1) : screenshots).map((shot) => (
        <figure className={styles.figure} key={shot.file}>
          <span className={styles.tape} aria-hidden="true" />
          <Image
            className={styles.image}
            src={`/images/projects/pwa-utt/${shot.file}-1544.webp`}
            alt={shot[locale]}
            width={1544}
            height={shot.height}
            sizes={
              featured
                ? "(min-width: 1024px) 45vw, 90vw"
                : "(min-width: 640px) 40vw, 90vw"
            }
          />
          <figcaption className={styles.caption}>
            {shot[locale]} ·{" "}
            {locale === "es"
              ? "Captura con datos sintéticos"
              : "Screenshot with synthetic data"}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
