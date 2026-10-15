import type { Project } from "@/content/projects";
import type { Locale } from "@/i18n/routing";
import type { ReactNode } from "react";

const styles = {
  frame:
    "relative flex min-h-64 flex-col justify-between overflow-hidden border border-border-subtle bg-background p-5 font-mono text-[11px] text-navigation sm:p-6",
  topLine:
    "flex items-center justify-between gap-3 border-b border-border-subtle pb-3 text-[10px] uppercase tracking-[0.12em]",
  node: "flex min-h-16 flex-col justify-center gap-1 border border-control-border bg-control-surface px-2 py-3",
  nodeAccent: "border-accent/60 text-accent",
  arrow: "text-accent",
  footer:
    "flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-3 text-[10px] uppercase tracking-[0.1em]",
  secureLanes: "my-6 grid gap-3 sm:grid-cols-2",
  lane: "flex min-h-36 flex-col gap-3 border border-control-border bg-control-surface p-3",
  laneTitle: "text-[10px] uppercase tracking-[0.12em] text-accent",
  flow: "my-8 grid grid-cols-2 gap-2 sm:grid-cols-4",
} as const;

type ProjectVisualProps = {
  project: Project;
  locale: Locale;
  compact?: boolean;
};

export function ProjectVisual({
  project,
  locale,
  compact = false,
}: ProjectVisualProps) {
  const alt = project.visual.alt[locale];
  const label = project.visual.label[locale];
  const kind = project.visual.kind;

  return (
    <figure className={styles.frame} aria-label={`${label}: ${alt}`}>
      <div className={styles.topLine}>
        <span>{label}</span>
        <span className="text-accent" aria-hidden="true">
          {compact ? "// 01–03" : locale === "es" ? "// FLUJO" : "// FLOW"}
        </span>
      </div>
      {kind === "offline-sync" && <OfflineDiagram locale={locale} />}
      {kind === "secure-transfer" && <TransferDiagram locale={locale} />}
      {kind === "classroom-flow" && <ClassroomDiagram locale={locale} />}
      <figcaption className={styles.footer}>
        <span>
          {kind === "offline-sync"
            ? locale === "es"
              ? "LOCAL → SERVIDOR"
              : "LOCAL → SERVER"
            : kind === "secure-transfer"
              ? locale === "es"
                ? "CLIENTE → API → ALMACENAMIENTO"
                : "CLIENT → API → STORAGE"
              : locale === "es"
                ? "ENTRADA → VALIDACIÓN → PLAN"
                : "INPUT → VALIDATION → PLAN"}
        </span>
        <span className="text-muted-foreground">
          {locale === "es" ? "Esquema explicativo" : "Explanatory diagram"}
        </span>
      </figcaption>
    </figure>
  );
}

function OfflineDiagram({ locale }: { locale: Locale }) {
  const words =
    locale === "es"
      ? [
          "Dispositivo",
          "Inspección local",
          "Cola durable",
          "Sin conexión",
          "Red disponible",
          "Supabase",
        ]
      : [
          "Device",
          "Local inspection",
          "Durable queue",
          "Offline",
          "Network restored",
          "Supabase",
        ];

  return (
    <div
      className="my-8 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
      role="group"
      aria-label={
        locale === "es"
          ? "Guardado local y sincronización posterior"
          : "Local save and later synchronization"
      }
    >
      <div className="grid gap-2">
        <DiagramNode>{words[0]}</DiagramNode>
        <DiagramNode accent>{words[1]}</DiagramNode>
        <DiagramNode>{words[2]}</DiagramNode>
      </div>
      <span className="text-center text-accent" aria-hidden="true">
        {locale === "es" ? "···›" : "···›"}
      </span>
      <div className="grid gap-2">
        <DiagramNode>{words[3]}</DiagramNode>
        <DiagramNode accent>{words[4]}</DiagramNode>
        <DiagramNode>{words[5]}</DiagramNode>
      </div>
    </div>
  );
}

function TransferDiagram({ locale }: { locale: Locale }) {
  const labels =
    locale === "es"
      ? {
          client: "CLIENTE",
          send: "Archivo + clave pública",
          server: "SERVIDOR · EXPRESS",
          encrypt: "Cifrar · hash · firmar · empaquetar",
          storage: "Supabase Storage",
        }
      : {
          client: "CLIENT",
          send: "File + public key",
          server: "SERVER · EXPRESS",
          encrypt: "Encrypt · hash · sign · package",
          storage: "Supabase Storage",
        };

  return (
    <div
      className={styles.secureLanes}
      role="group"
      aria-label={
        locale === "es"
          ? "Operaciones de cliente y servidor"
          : "Client and server operations"
      }
    >
      <div className={styles.lane}>
        <span className={styles.laneTitle}>{labels.client}</span>
        <DiagramNode>{labels.send}</DiagramNode>
        <span className={styles.arrow} aria-hidden="true">
          ↓
        </span>
      </div>
      <div className={styles.lane}>
        <span className={styles.laneTitle}>{labels.server}</span>
        <DiagramNode accent>{labels.encrypt}</DiagramNode>
        <span className={styles.arrow} aria-hidden="true">
          ↓
        </span>
        <DiagramNode>{labels.storage}</DiagramNode>
      </div>
    </div>
  );
}

function ClassroomDiagram({ locale }: { locale: Locale }) {
  const labels =
    locale === "es"
      ? [
          "Classroom + Drive",
          "Validar datos y ZIP",
          "Registro + GitHub",
          "Plan de Issues",
        ]
      : [
          "Classroom + Drive",
          "Validate data and ZIP",
          "Registry + GitHub",
          "Issue plan",
        ];

  return (
    <div
      className={styles.flow}
      role="group"
      aria-label={
        locale === "es"
          ? "Flujo simplificado de entrada a planificación"
          : "Simplified input-to-planning flow"
      }
    >
      {labels.map((label, index) => (
        <div className="flex min-w-0 items-center gap-2" key={label}>
          <DiagramNode accent={index === 1 || index === 3}>
            <span className="text-[9px] text-muted-foreground">
              0{index + 1}
            </span>
            {label}
          </DiagramNode>
          {index < labels.length - 1 && (
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function DiagramNode({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`${styles.node} ${accent ? styles.nodeAccent : ""}`}>
      {children}
    </div>
  );
}
