import ink from "./project-visual.module.css";
import type { Project } from "@/content/projects";
import type { Locale } from "@/i18n/routing";

const styles = {
  figure: "min-w-0",
  caption: "mb-5 text-label text-graphite-soft",
  flow: "flex flex-col items-stretch gap-2",
  node: "relative min-w-0 px-5 py-4 text-body text-graphite [overflow-wrap:anywhere]",
  arrow: "ml-5 h-6 w-6 text-ink",
} as const;

export function ProjectVisual({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const labels =
    project.visual.kind === "offline-sync"
      ? locale === "es"
        ? ["Inspección local", "Cola durable", "Red disponible", "Supabase"]
        : ["Local inspection", "Durable queue", "Network restored", "Supabase"]
      : project.visual.kind === "secure-transfer"
        ? locale === "es"
          ? [
              "Archivo y clave pública",
              "Servidor: cifrar, hash, firmar y empaquetar",
              "Supabase Storage",
            ]
          : [
              "File and public key",
              "Server: encrypt, hash, sign and package",
              "Supabase Storage",
            ]
        : locale === "es"
          ? [
              "Classroom y Drive",
              "Validar datos y ZIP",
              "Registro y GitHub",
              "Plan de issues",
            ]
          : [
              "Classroom and Drive",
              "Validate data and ZIP",
              "Registry and GitHub",
              "Issue plan",
            ];
  const direction =
    project.visual.kind === "offline-sync"
      ? locale === "es"
        ? "Local a servidor"
        : "Local to server"
      : project.visual.kind === "secure-transfer"
        ? locale === "es"
          ? "Cliente a almacenamiento"
          : "Client to storage"
        : locale === "es"
          ? "Entrada a plan de issues"
          : "Input to issue plan";
  return (
    <figure className={styles.figure} aria-label={project.visual.alt[locale]}>
      <figcaption className={styles.caption}>
        {locale === "es" ? "Diagrama" : "Diagram"} · {direction}
      </figcaption>
      <div className={`${styles.flow} ${ink.flow}`}>
        {labels.map((label, index) => (
          <div key={label}>
            {index > 0 && (
              <svg
                className={styles.arrow}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className={ink.inkStroke}
                  pathLength={1}
                  d="M11.2 2.5c1.1 5.7-.7 10.6.8 18M6 15.2c2.1 1.1 4.2 3.5 6 5.3 2-2.1 4-4.2 6.2-5.9"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div className={styles.node}>
              <svg
                className={ink.frame}
                viewBox="0 0 300 60"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  pathLength={1}
                  d="M4 5 Q75 2 150 4 T296 5 L295 55 Q220 58 150 56 T5 55 Z"
                />
              </svg>
              {label}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
