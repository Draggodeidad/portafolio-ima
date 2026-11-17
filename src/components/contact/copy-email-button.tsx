"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/b-button";
import { cn } from "@/lib/cn";

const styles = {
  root: "inline-flex flex-col gap-1.5",
  button: "min-h-12 !rounded-none px-4 text-sm font-semibold text-navigation",
  done: "!text-accent",
  status: "m-0 max-w-xs select-text text-sm leading-5 text-muted-foreground",
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
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )
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
