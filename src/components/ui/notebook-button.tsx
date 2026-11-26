import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import button from "./notebook-button.module.css";

type Variant = "primary" | "secondary";

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};
type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

export type NotebookButtonProps = (AnchorProps | NativeButtonProps) & {
  variant?: Variant;
  /** Marks the button busy; it stays focusable and announces its state. */
  loading?: boolean;
};

// A busy button keeps focus but ignores activation (and form submission).
function ignoreActivation(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

/**
 * The notebook's button. Renders `<a>` when given `href`, otherwise
 * `<button>`, with identical styles and states for both (DESIGN.md, Buttons).
 * Server-safe: it holds no state of its own.
 */
export function NotebookButton({
  variant = "primary",
  loading = false,
  className,
  children,
  ...props
}: NotebookButtonProps) {
  const classes = cn(button.root, button[variant], className);

  if (props.href !== undefined) {
    return (
      <a {...(props as AnchorProps)} className={classes}>
        {children}
      </a>
    );
  }

  const { type = "button", onClick, ...rest } = props as NativeButtonProps;
  return (
    <button
      {...rest}
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || rest["aria-disabled"] || undefined}
      onClick={loading ? ignoreActivation : onClick}
    >
      {children}
    </button>
  );
}

/**
 * Stacks every label in one grid cell and shows the active one, so a button
 * keeps the width of its widest label whatever its state. Inactive labels are
 * hidden from assistive technology.
 */
export function SwapLabel<Key extends string>({
  active,
  labels,
}: {
  active: Key;
  labels: Record<Key, ReactNode>;
}) {
  return (
    <span className={button.swap}>
      {(Object.keys(labels) as Key[]).map((key) => (
        <span
          key={key}
          className={button.label}
          data-active={key === active}
          aria-hidden={key === active ? undefined : true}
        >
          {labels[key]}
        </span>
      ))}
    </span>
  );
}

export function ButtonSpinner() {
  return <span className={button.spinner} aria-hidden="true" />;
}

export function CheckIcon() {
  return (
    <svg
      className={button.icon}
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
  );
}
