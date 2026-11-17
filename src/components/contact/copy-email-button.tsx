"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/b-button";
import { cn } from "@/lib/cn";

const styles = {
  root: "inline-flex max-w-full flex-col gap-[10px]",
  button: "min-h-12 !rounded-none px-[10px] text-label text-ink",
  done: "!text-ink",
  status: "m-0 max-w-full break-all select-text text-small text-graphite-soft",
} as const;

type CopyState = "idle" | "done" | "failed";

type CopyEmailButtonProps = {
  email: string;
  copy: { idle: string; done: string; failed: string };
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
      reset.current = setTimeout(() => setState("idle"), 2400);
    } catch {
      setState("failed");
    }
  }

  return (
    <div className={cn(styles.root, className)}>
      <Button
        className={cn(styles.button, state === "done" && styles.done)}
        disableRipple
        icon={
          state === "done" ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.8 10.4 7.5 15.2 17.2 4.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : undefined
        }
        onClick={copyEmail}
        size="lg"
        type="button"
        variant="ghost"
      >
        {state === "done" ? copy.done : copy.idle}
      </Button>
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
