"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import styles from "./hero.module.css";

const classes = {
  root: "@container flex flex-col",
  prompt: "mt-3 flex items-center justify-between gap-3",
  groupLabel:
    "m-0 font-mono text-xs uppercase leading-4 tracking-[0.12em] text-navigation",
  keys: "hidden items-center gap-1 pointer-fine:flex",
  key: "flex size-5 items-center justify-center border border-control-border text-navigation",
  list: "relative m-0 grid list-none gap-2 p-0 @sm:grid-cols-3",
  item: "min-w-0",
  tile: "flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 border border-border bg-surface px-3 py-2 text-left transition-colors hover:border-control-border hover:bg-surface-raised @sm:min-h-[4.75rem] @sm:flex-col @sm:items-start @sm:gap-1 @sm:py-2.5",
  tileSelected: "border-accent/45 bg-surface-raised hover:border-accent/45",
  tileLabel:
    "flex items-center gap-2 font-display text-sm font-semibold leading-5 text-foreground",
  tileCase: "font-mono text-xs leading-4 text-muted-foreground",
  tileCaseSelected: "text-accent",
  panel: "mt-3 border-t border-border-subtle pt-4",
  panelTitle:
    "m-0 font-display text-base font-semibold leading-6 text-foreground",
  panelText:
    "mb-0 mt-1 max-w-[60ch] text-sm leading-6 text-muted-foreground [text-wrap:pretty] @sm:min-h-[3rem]",
  caseLink:
    "mt-2 inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-accent underline-offset-4 hover:underline",
  caseName: "normal-case tracking-normal text-foreground",
} as const;

export type NodeId = "api" | "data" | "automation";

export type NodeInfo = {
  id: NodeId;
  /** Tile label; the full label names the area in the caption. */
  shortLabel: string;
  label: string;
  description: string;
  caseName: string;
  caseHref: string;
};

type NodeSelectorProps = {
  nodes: NodeInfo[];
  label: string;
  caseLinkLabel: string;
};

/** Elbow from the portrait's bottom centre to the centre of tile `index`. */
const connectionPath = (index: number) =>
  `M 150 0 V 12 H ${50 + index * 100} V 28`;

const keyStep: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/**
 * Area selector styled as a stage select: one radio per area of work,
 * a cursor that slides to the chosen area and a caption naming the case
 * study that backs it. Arrow keys move the selection (WAI-ARIA radio
 * group); Tab continues to the case link.
 */
export function NodeSelector({
  nodes,
  label,
  caseLinkLabel,
}: NodeSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tileRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = nodes[activeIndex] ?? nodes[0];

  if (!selected) return null;

  const select = (index: number, moveFocus: boolean) => {
    const next = (index + nodes.length) % nodes.length;
    setActiveIndex(next);
    if (moveFocus) tileRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = keyStep[event.key];
    if (step !== undefined) {
      event.preventDefault();
      select(activeIndex + step, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(nodes.length - 1, true);
    }
  };

  const labelId = "hero-area-label";
  const captionId = "hero-area-caption";

  return (
    <div className={classes.root}>
      <svg
        className={styles.connections}
        viewBox="0 0 300 28"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {nodes.map((node, index) => (
          <path
            key={node.id}
            className={styles.connection}
            d={connectionPath(index)}
          />
        ))}
        {/* Drawn last so it sits above the idle lines; the key remounts it
            so the signal replays on every selection. */}
        <path
          key={selected.id}
          className={cn(styles.connection, styles.connectionActive)}
          d={connectionPath(activeIndex)}
          pathLength={1}
        />
      </svg>

      <ul
        className={cn(classes.list, styles.stageList)}
        role="radiogroup"
        aria-labelledby={labelId}
        style={{ "--stage-index": activeIndex } as CSSProperties}
      >
        <li className={styles.stageCursor} aria-hidden="true" />
        {nodes.map((node, index) => {
          const isSelected = index === activeIndex;
          return (
            <li className={classes.item} key={node.id} role="none">
              <button
                ref={(element) => {
                  tileRefs.current[index] = element;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-controls={captionId}
                tabIndex={isSelected ? 0 : -1}
                className={cn(classes.tile, isSelected && classes.tileSelected)}
                onClick={() => select(index, false)}
                onKeyDown={onKeyDown}
              >
                <span className={classes.tileLabel}>
                  <span
                    className={cn(
                      styles.nodeMark,
                      isSelected && styles.nodeMarkActive,
                    )}
                    aria-hidden="true"
                  />
                  {node.shortLabel}
                </span>
                <span
                  className={cn(
                    classes.tileCase,
                    isSelected && classes.tileCaseSelected,
                  )}
                >
                  {node.caseName}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className={classes.prompt}>
        <p className={classes.groupLabel} id={labelId}>
          {label}
        </p>
        <span className={classes.keys} aria-hidden="true">
          <span className={classes.key}>
            <ArrowLeft size={12} />
          </span>
          <span className={classes.key}>
            <ArrowRight size={12} />
          </span>
        </span>
      </div>

      <div className={classes.panel} id={captionId}>
        <div aria-live="polite" aria-atomic="true">
          <p className={classes.panelTitle}>{selected.label}</p>
          <p className={classes.panelText}>{selected.description}</p>
        </div>
        <Link className={classes.caseLink} href={selected.caseHref}>
          {caseLinkLabel}
          <span className={classes.caseName}>{selected.caseName}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
