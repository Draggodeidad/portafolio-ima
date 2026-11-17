import ink from "./project-visual.module.css";
import type { Project } from "@/content/projects";
import type { Locale } from "@/i18n/routing";

const styles = {
  figure: "border border-page-edge bg-paper p-5 sm:p-6",
  caption: "mb-5 text-label text-graphite-soft",
  flow: "flex flex-col items-stretch gap-2",
  node: "min-w-0 border border-ruled-line bg-print px-4 py-3 text-body text-graphite [overflow-wrap:anywhere]",
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
  return (
    <figure className={styles.figure} aria-label={project.visual.alt[locale]}>
      <figcaption className={styles.caption}>
        {locale === "es" ? "Diagrama" : "Diagram"}
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
                  d="M12 2c-.5 6 .4 12 0 19m-6-6 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div className={styles.node}>{label}</div>
          </div>
        ))}
      </div>
    </figure>
  );
}
