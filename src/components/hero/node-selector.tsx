"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./hero.module.css";

const nodeClasses = {
  list: "m-0 grid list-none grid-cols-3 gap-2 p-0 md:block",
  button:
    "min-h-11 w-full cursor-pointer border border-border bg-surface px-2 py-2 font-mono text-[10px] leading-4 tracking-[0.04em] text-foreground transition-colors hover:border-accent hover:bg-surface-raised focus-visible:outline-accent md:w-auto md:px-3 md:text-[11px]",
  selected: "border-accent text-accent",
  description:
    "min-h-[4.5rem] border-t border-border-subtle pt-4 text-sm leading-6 text-muted-foreground md:mx-auto md:max-w-[28rem] md:text-center",
  descriptionTitle:
    "mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-navigation",
} as const;

type NodeId = "api" | "data" | "cloud";

type NodeInfo = {
  id: NodeId;
  label: string;
  description: string;
};

type NodeSelectorProps = {
  nodes: NodeInfo[];
  label: string;
  descriptionLabel: string;
};

export function NodeSelector({
  nodes,
  label,
  descriptionLabel,
}: NodeSelectorProps) {
  const [activeNode, setActiveNode] = useState<NodeId>("api");
  const selected = nodes.find((node) => node.id === activeNode) ?? nodes[0];

  return (
    <div className={styles.selector}>
      <svg
        className={styles.connections}
        viewBox="0 0 480 500"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className={cn(
            styles.connection,
            activeNode === "api" && styles.connectionActive,
          )}
          d="M 98 24 L 44 58 L 44 88"
        />
        <path
          className={cn(
            styles.connection,
            activeNode === "data" && styles.connectionActive,
          )}
          d="M 116 472 L 52 430 L 52 398"
        />
        <path
          className={cn(
            styles.connection,
            activeNode === "cloud" && styles.connectionActive,
          )}
          d="M 382 250 L 434 250 L 434 220"
        />
      </svg>
      <div className={styles.nodeLayer} role="group" aria-label={label}>
        <ul className={nodeClasses.list}>
          {nodes.map((node) => (
            <li className={cn(styles.nodeItem, styles[node.id])} key={node.id}>
              <button
                type="button"
                className={cn(
                  nodeClasses.button,
                  activeNode === node.id && nodeClasses.selected,
                )}
                aria-pressed={activeNode === node.id}
                onClick={() => setActiveNode(node.id)}
              >
                <span className={styles.nodeMark} aria-hidden="true" />
                {node.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p
        className={nodeClasses.description}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className={nodeClasses.descriptionTitle}>{descriptionLabel}</span>
        {selected?.description}
      </p>
    </div>
  );
}
