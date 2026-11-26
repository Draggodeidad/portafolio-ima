"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  NotebookButton,
  SwapLabel,
} from "@/components/ui/notebook-button";
import { cn } from "@/lib/cn";

const RESET_AFTER_MS = 2000;

const styles = {
  root: "inline-flex max-w-full flex-col",
  status: "m-0 max-w-full break-all select-text text-small text-graphite-soft",
} as const;

type CopyState = "idle" | "done" | "failed";

type CopyEmailButtonProps = {
  email: string;
  /** `done` is announced; `doneShort` is the visible label. */
  copy: { idle: string; done: string; doneShort: string; failed: string };
  className?: string;
};

export function CopyEmailButton({
  email,
  copy,
  className,
}: CopyEmailButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (reset.current) clearTimeout(reset.current);
    },
    [],
  );

  async function copyEmail() {
    if (reset.current) clearTimeout(reset.current);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setState("done");
      reset.current = setTimeout(() => setState("idle"), RESET_AFTER_MS);
    } catch {
      setState("failed");
    }
  }

  return (
    <div className={cn(styles.root, className)}>
      <NotebookButton variant="secondary" onClick={copyEmail}>
        <SwapLabel
          active={state === "done" ? "done" : "idle"}
          labels={{
            idle: copy.idle,
            done: (
              <>
                <CheckIcon />
                {copy.doneShort}
              </>
            ),
          }}
        />
      </NotebookButton>
      <p
        className={cn(styles.status, state !== "failed" && "sr-only")}
        role="status"
        aria-live="polite"
      >
        {state === "failed" ? copy.failed : state === "done" ? copy.done : ""}
      </p>
    </div>
  );
}
