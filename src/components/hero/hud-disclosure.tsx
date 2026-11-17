"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const classes = {
  toggle:
    "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 text-left font-mono text-xs uppercase tracking-[0.12em] text-navigation transition-colors hover:text-foreground lg:hidden",
  toggleLabel: "flex min-w-0 items-center gap-2",
  toggleDot: "size-1.5 shrink-0 bg-accent",
  chevron:
    "shrink-0 text-accent transition-transform duration-(--motion-fast) motion-reduce:transition-none",
  chevronOpen: "rotate-180",
  region: "flex-col lg:mt-0 lg:flex",
  regionOpen: "mt-4 flex",
  regionClosed: "hidden",
} as const;

type HudDisclosureProps = {
  label: string;
  children: ReactNode;
};

/**
 * Below the two-column hero (lg), the HUD collapses to one row so the
 * projects follow the call to action without a long detour. From lg up the
 * toggle is hidden and the content is always shown.
 */
export function HudDisclosure({ label, children }: HudDisclosureProps) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <>
      <button
        type="button"
        className={classes.toggle}
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={classes.toggleLabel}>
          <span className={classes.toggleDot} aria-hidden="true" />
          {label}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn(classes.chevron, open && classes.chevronOpen)}
        />
      </button>
      <div
        id={regionId}
        className={cn(
          classes.region,
          open ? classes.regionOpen : classes.regionClosed,
        )}
      >
        {children}
      </div>
    </>
  );
}
