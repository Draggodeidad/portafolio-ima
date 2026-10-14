import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const styles = {
  root: "mx-auto w-full max-w-[var(--content-width)] px-[var(--page-gutter)]",
} as const;

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className = "", ...props }: ContainerProps) {
  return <div className={cn(styles.root, className)} {...props} />;
}
