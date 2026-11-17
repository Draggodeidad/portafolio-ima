import { Fragment } from "react";

const styles = {
  code: "rounded-[3px] border border-border-subtle bg-control-surface px-1 py-px font-mono text-[0.92em] text-foreground",
} as const;

/**
 * Renders content copy where `backticks` mark inline code (routes, file
 * names, identifiers) as <code>. Plain text passes through unchanged.
 */
export function InlineCode({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <code className={styles.code} key={index}>
        {part}
      </code>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
