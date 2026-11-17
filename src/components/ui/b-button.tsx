"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  cloneElement,
  type FocusEventHandler,
  forwardRef,
  isValidElement,
  type KeyboardEvent,
  type KeyboardEventHandler,
  memo,
  type PointerEvent,
  type PointerEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "group/button relative inline-flex min-h-12 shrink-0 cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-none font-bold text-label outline-offset-4 transition-[background-color,color,transform] duration-[var(--motion-press-out)] focus-visible:outline-3 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "-rotate-1 bg-ink px-5 text-print hover:bg-ink-deep",
        outline:
          "border-b-2 border-ink bg-transparent px-0 text-graphite hover:text-ink",
        secondary:
          "border-b-2 border-ink bg-transparent px-0 text-graphite hover:text-ink",
        ghost: "bg-transparent px-0 text-graphite hover:text-ink",
        destructive: "bg-error px-5 text-print",
        link: "bg-transparent px-0 text-ink underline underline-offset-4 hover:text-ink-deep",
      },
      linkUnderline: { motion: "", static: "" },
      size: {
        default: "min-h-12",
        xs: "min-h-12",
        sm: "min-h-12",
        lg: "min-h-12",
        icon: "size-12",
        "icon-xs": "size-12",
        "icon-sm": "size-12",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      linkUnderline: "static",
    },
  },
);

const linkUnderlineFillTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.65,
};

const MAX_RIPPLES = 3;
const REL_TOKEN_SPLIT = /\s+/;

const LinkUnderlineLabel = memo(function LinkUnderlineLabel({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <span className="relative inline-block pb-px font-medium text-[1em] leading-[inherit]">
      <span className="relative z-10" data-link-label>
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-muted-foreground/50"
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-foreground"
        transition={linkUnderlineFillTransition}
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
      />
    </span>
  );
});

const buttonContentClassName =
  "relative z-10 inline-flex items-center justify-center [gap:inherit] whitespace-nowrap text-inherit";

type Ripple = { id: string; x: number; y: number; size: number };

type AnchorHTMLAttributesForMotion = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

type ButtonHTMLAttributesForMotion = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

type ButtonRenderProps = React.HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function useMeasure<T extends HTMLElement = HTMLElement>(
  enabled: boolean,
): [(node: T | null) => void, { width: number; height: number }] {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!(enabled && element && typeof ResizeObserver !== "undefined")) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setBounds((current) => {
        const next = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };

        if (current.width === next.width && current.height === next.height) {
          return current;
        }

        return next;
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, enabled]);

  return [ref, enabled ? bounds : { width: 0, height: 0 }];
}

const MotionAnchor = motion.create("a");

const buttonTransition = {
  scale: {
    type: "spring",
    stiffness: 640,
    damping: 38,
    mass: 0.85,
  },
  width: {
    type: "spring",
    stiffness: 420,
    damping: 34,
    mass: 0.9,
  },
  opacity: {
    type: "spring",
    stiffness: 380,
    damping: 32,
    mass: 0.8,
  },
  y: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
} as const;

const loadingIconTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 0.76,
};

const loadingLabelExitTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 38,
  mass: 0.84,
};

const loadingLabelEnterTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.98,
};

const loadingLayoutTransition = {
  type: "spring" as const,
  stiffness: 360,
  damping: 36,
  mass: 0.94,
};

const loadingLabelVariants = {
  animate: {
    opacity: 1,
    scale: 1,
    transition: loadingLabelEnterTransition,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: loadingLabelExitTransition,
    y: -4,
  },
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 4,
  },
} as const;

function getLabelMotionKey(children: ReactNode, loading: boolean) {
  if (typeof children === "string" || typeof children === "number") {
    return `${loading ? "busy" : "idle"}:${children}`;
  }

  return loading ? "busy" : "idle";
}

function withLoadingSpin(node: ReactNode, spinning: boolean) {
  if (!(spinning && isValidElement<{ className?: string }>(node))) {
    return node;
  }

  return cloneElement(node, {
    className: cn(node.props.className, "animate-spin"),
  });
}

function getButtonAnimate(
  canAnimate: boolean,
  isPressed: boolean,
  animatedWidth: number | undefined,
  reduceMotion: boolean | null,
) {
  const shouldReduceMotion = reduceMotion === true;
  const pressScale = canAnimate && isPressed && !shouldReduceMotion ? 0.96 : 1;

  if (animatedWidth) {
    return {
      scale: pressScale,
      width: animatedWidth,
    };
  }

  return {
    scale: pressScale,
  };
}

function omitLinkMotionConflicts<T extends Record<string, unknown>>(props: T) {
  /* eslint-disable @typescript-eslint/no-unused-vars -- These legacy event props are intentionally excluded from the remaining spread. */
  const {
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ...rest
  } = props;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return rest;
}

function resolvePrimitiveButtonProps(buttonProps: ButtonRenderProps) {
  /* eslint-disable @typescript-eslint/no-unused-vars -- Primitive props are separated from the remaining forwarded props here. */
  const {
    children: _buttonChildren,
    className: primitiveClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: primitiveRef,
    style: primitiveStyle,
    ...resolvedButtonProps
  } = buttonProps;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return {
    primitiveClassName,
    primitiveRef,
    primitiveStyle,
    resolvedButtonProps,
  };
}

function resolveAnchorRel(target?: string, rel?: string) {
  if (!target?.includes("_blank")) {
    return rel;
  }

  const tokens = new Set((rel ?? "").split(REL_TOKEN_SPLIT).filter(Boolean));
  tokens.add("noopener");
  tokens.add("noreferrer");
  return [...tokens].join(" ");
}

function isIconOnlySize(
  size:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined,
) {
  return (
    size === "icon" ||
    size === "icon-xs" ||
    size === "icon-sm" ||
    size === "icon-lg"
  );
}

function useIconOnlyA11yWarning(
  size:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined,
  children: ReactNode,
  iconLabel: string | undefined,
  ariaLabel: string | undefined,
  loading: boolean,
) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const hasVisibleLabel =
      children != null && children !== false && children !== "";
    const needsAccessibleName =
      isIconOnlySize(size) || (loading && !hasVisibleLabel);

    if (!needsAccessibleName || iconLabel || ariaLabel) {
      return;
    }

    console.warn(
      "[Button] Icon-only and loading-only buttons need `iconLabel` or `aria-label` for accessibility.",
    );
  }, [ariaLabel, children, iconLabel, loading, size]);
}

function getIconIdleAnimate(showSpinner: boolean, noMotion: boolean) {
  if (noMotion) {
    return { opacity: showSpinner ? 0 : 1 };
  }

  return {
    opacity: showSpinner ? 0 : 1,
    rotate: showSpinner ? -56 : 0,
    scale: showSpinner ? 0.82 : 1,
  };
}

function getIconSpinnerAnimate(showSpinner: boolean, noMotion: boolean) {
  if (noMotion) {
    return { opacity: showSpinner ? 1 : 0 };
  }

  return {
    opacity: showSpinner ? 1 : 0,
    rotate: showSpinner ? 0 : 56,
    scale: showSpinner ? 1 : 0.82,
  };
}

function buildMotionSurfaceProps({
  canAnimate,
  isPressed,
  motionAnimate,
  reduceMotion,
  useLinkMotionUnderline,
  variant,
}: {
  canAnimate: boolean;
  isPressed: boolean;
  motionAnimate: ReturnType<typeof getButtonAnimate>;
  reduceMotion: boolean | null;
  useLinkMotionUnderline: boolean;
  variant: VariantProps<typeof buttonVariants>["variant"];
}) {
  const shouldReduceMotion = reduceMotion === true;
  const surfaceTransition = shouldReduceMotion
    ? { duration: 0 }
    : buttonTransition;
  const shared = {
    animate: motionAnimate,
    "data-pressed": isPressed ? "true" : "false",
    transition: surfaceTransition,
  };

  if (useLinkMotionUnderline) {
    return {
      ...shared,
      initial: shouldReduceMotion ? (false as const) : ("rest" as const),
      variants: shouldReduceMotion ? undefined : { rest: {}, hover: {} },
      whileHover: shouldReduceMotion ? undefined : ("hover" as const),
    };
  }

  const hoverLift =
    canAnimate && variant !== "link" && !shouldReduceMotion
      ? { y: -1 }
      : undefined;

  return {
    ...shared,
    initial: false as const,
    whileHover: hoverLift,
  };
}

const ButtonIconSlot = memo(function ButtonIconSlot({
  accessibleName,
  dataIcon,
  hasIcon,
  hasLabel,
  icon,
  iconTransition,
  layoutTransition,
  noMotion,
  showSpinner,
  spinner,
}: {
  accessibleName?: string;
  dataIcon: "inline-start" | "inline-end";
  hasIcon: boolean;
  hasLabel: boolean;
  icon?: ReactNode;
  iconTransition: { duration: number } | typeof loadingIconTransition;
  layoutTransition: { duration: number } | typeof loadingLayoutTransition;
  noMotion: boolean;
  showSpinner: boolean;
  spinner: ReactNode;
}) {
  return (
    <motion.span
      aria-hidden={hasLabel || accessibleName ? true : undefined}
      className="relative inline-flex size-[1em] shrink-0 items-center justify-center"
      data-icon={dataIcon}
      layout={noMotion ? false : "position"}
      transition={layoutTransition}
    >
      {hasIcon ? (
        <motion.span
          animate={getIconIdleAnimate(showSpinner, noMotion)}
          className="absolute inset-0 inline-flex items-center justify-center"
          initial={false}
          transition={iconTransition}
        >
          {icon}
        </motion.span>
      ) : null}
      <motion.span
        animate={getIconSpinnerAnimate(showSpinner, noMotion)}
        className="absolute inset-0 inline-flex items-center justify-center"
        initial={false}
        transition={iconTransition}
      >
        {withLoadingSpin(spinner, showSpinner && !noMotion)}
      </motion.span>
    </motion.span>
  );
});

const ButtonLoadingLabel = memo(function ButtonLoadingLabel({
  children,
  layoutTransition,
  linkUnderlineEnabled,
  loading,
  noMotion,
}: {
  children: ReactNode;
  layoutTransition: { duration: number } | typeof loadingLayoutTransition;
  linkUnderlineEnabled: boolean;
  loading: boolean;
  noMotion: boolean;
}) {
  return (
    <motion.span
      className="relative inline-grid min-w-0 items-center leading-[inherit] [grid-template-columns:max-content] [grid-template-rows:minmax(0,1.25em)]"
      layout="position"
      transition={layoutTransition}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={noMotion ? { opacity: 1 } : "animate"}
          className="col-start-1 row-start-1 inline-flex min-w-0 items-center whitespace-nowrap"
          exit={noMotion ? { opacity: 0 } : "exit"}
          initial={noMotion ? false : "initial"}
          key={getLabelMotionKey(children, loading)}
          layout="position"
          transition={{ layout: layoutTransition }}
          variants={noMotion ? undefined : loadingLabelVariants}
        >
          <LinkUnderlineLabel enabled={linkUnderlineEnabled}>
            {children}
          </LinkUnderlineLabel>
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

const ButtonSpinnerPresence = memo(function ButtonSpinnerPresence({
  iconSlot,
  layoutTransition,
  noMotion,
  visible,
}: {
  iconSlot: ReactNode;
  layoutTransition: { duration: number } | typeof loadingLayoutTransition;
  noMotion: boolean;
  visible: boolean;
}) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {visible ? (
        <motion.span
          animate={noMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          className="inline-flex shrink-0"
          exit={
            noMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 0.86,
                  transition: loadingLabelExitTransition,
                }
          }
          initial={noMotion ? false : { opacity: 0, scale: 0.86 }}
          key="loading-spinner"
          layout="position"
          transition={layoutTransition}
        >
          {iconSlot}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
});

const defaultLoadingIcon = <Loader2 aria-hidden strokeWidth={2.25} />;

const ButtonLoadingContent = memo(function ButtonLoadingContent({
  accessibleName,
  children,
  contentRef,
  icon,
  iconPosition,
  linkUnderlineEnabled,
  loading,
  loadingIcon,
  reduceMotion,
}: {
  accessibleName?: string;
  children: ReactNode;
  contentRef?: React.Ref<HTMLSpanElement>;
  icon?: ReactNode;
  iconPosition: "start" | "end";
  linkUnderlineEnabled: boolean;
  loading: boolean;
  loadingIcon?: ReactNode;
  reduceMotion: boolean | null;
}) {
  const hasIcon = Boolean(icon);
  const hasLabel = children != null && children !== false && children !== "";
  const noMotion = reduceMotion === true;
  const iconTransition = noMotion ? { duration: 0 } : loadingIconTransition;
  const layoutTransition = noMotion ? { duration: 0 } : loadingLayoutTransition;
  const spinner = loadingIcon ?? defaultLoadingIcon;

  const iconAtStart = loading || (hasIcon && iconPosition === "start");
  const iconAtEnd = hasIcon && !loading && iconPosition === "end";
  const spinnerOnlyAtStart = loading && !hasIcon;

  const iconSlotProps = {
    accessibleName,
    hasLabel,
    iconTransition,
    layoutTransition,
    noMotion,
    spinner,
  };

  return (
    <motion.span
      animate={loading && !noMotion ? { opacity: 0.96 } : { opacity: 1 }}
      className={buttonContentClassName}
      initial={false}
      layout={!noMotion}
      ref={contentRef}
      transition={layoutTransition}
    >
      <ButtonSpinnerPresence
        iconSlot={
          <ButtonIconSlot
            {...iconSlotProps}
            dataIcon="inline-start"
            hasIcon={hasIcon}
            icon={icon}
            showSpinner
          />
        }
        layoutTransition={layoutTransition}
        noMotion={noMotion}
        visible={spinnerOnlyAtStart}
      />
      {hasIcon && iconAtStart ? (
        <ButtonIconSlot
          {...iconSlotProps}
          dataIcon="inline-start"
          hasIcon={hasIcon}
          icon={icon}
          showSpinner={loading}
        />
      ) : null}
      {hasLabel ? (
        <ButtonLoadingLabel
          layoutTransition={layoutTransition}
          linkUnderlineEnabled={linkUnderlineEnabled}
          loading={loading}
          noMotion={noMotion}
        >
          {children}
        </ButtonLoadingLabel>
      ) : null}
      {hasIcon && iconAtEnd ? (
        <ButtonIconSlot
          {...iconSlotProps}
          dataIcon="inline-end"
          hasIcon={hasIcon}
          icon={icon}
          showSpinner={loading}
        />
      ) : null}
    </motion.span>
  );
});

const rippleTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
  opacity: {
    duration: 0.65,
    ease: [0.4, 0, 0.2, 1] as const,
    times: [0, 0.2, 1] as const,
  },
} as const;

const RippleLayer = memo(function RippleLayer({
  onRippleComplete,
  ripples,
}: {
  ripples: Ripple[];
  onRippleComplete: (id: string) => void;
}) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      {ripples.map((ripple) => (
        <motion.span
          animate={{ opacity: [0.36, 0.2, 0], scale: 1 }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--button-ripple)]"
          initial={{ opacity: 0.36, scale: 0 }}
          key={ripple.id}
          onAnimationComplete={() => onRippleComplete(ripple.id)}
          style={{
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
          }}
          transition={rippleTransition}
        />
      ))}
    </span>
  );
});

type ButtonInteractionElement = HTMLButtonElement | HTMLAnchorElement;

type ButtonInteractionHandlers = {
  onBlur?: FocusEventHandler<ButtonInteractionElement>;
  onKeyDown?: KeyboardEventHandler<ButtonInteractionElement>;
  onKeyUp?: KeyboardEventHandler<ButtonInteractionElement>;
  onPointerCancel?: PointerEventHandler<ButtonInteractionElement>;
  onPointerDown?: PointerEventHandler<ButtonInteractionElement>;
  onPointerLeave?: PointerEventHandler<ButtonInteractionElement>;
  onPointerUp?: PointerEventHandler<ButtonInteractionElement>;
};

export type ButtonProps = Omit<
  ButtonHTMLAttributesForMotion,
  keyof ButtonInteractionHandlers
> &
  ButtonInteractionHandlers &
  VariantProps<typeof buttonVariants> & {
    animateSize?: boolean;
    children?: ReactNode;
    disableRipple?: boolean;
    href?: string;
    icon?: ReactNode;
    iconLabel?: string;
    iconPosition?: "start" | "end";
    loading?: boolean;
    loadingIcon?: ReactNode;
  } & Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    | "download"
    | "hrefLang"
    | "media"
    | "ping"
    | "referrerPolicy"
    | "rel"
    | "target"
  >;

const ButtonInner = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      animateSize = false,
      "aria-label": ariaLabel,
      children,
      className,
      disabled,
      disableRipple = true,
      href,
      icon,
      iconLabel,
      iconPosition = "start",
      linkUnderline,
      loading = false,
      loadingIcon,
      onBlur,
      onKeyDown,
      onKeyUp,
      onPointerCancel,
      onPointerDown,
      onPointerLeave,
      onPointerUp,
      rel,
      size,
      style,
      target,
      type = "button",
      variant,
      ...props
    },
    ref,
  ) => {
    const isLocked = Boolean(disabled || loading);
    const accessibleName = iconLabel ?? ariaLabel;
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const updatePreference = () => setReduceMotion(media.matches);

      updatePreference();
      media.addEventListener("change", updatePreference);
      return () => media.removeEventListener("change", updatePreference);
    }, []);

    useIconOnlyA11yWarning(size, children, iconLabel, ariaLabel, loading);
    const buttonNodeRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(
      null,
    );
    const rippleIdRef = useRef(0);
    const wasLoadingRef = useRef(loading);
    const [horizontalInset, setHorizontalInset] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const shouldAnimateSize = animateSize && style?.width == null;
    const [contentRef, bounds] = useMeasure<HTMLSpanElement>(shouldAnimateSize);
    const lastContentWidthRef = useRef(0);
    const resolvedLinkUnderline =
      variant === "link" ? (linkUnderline ?? "static") : undefined;
    const useLinkMotionUnderline = resolvedLinkUnderline === "motion";

    const canAnimate = !isLocked && reduceMotion !== true;
    void disableRipple;
    const allowsRipple = false;
    useLayoutEffect(() => {
      if (bounds.width > 0) {
        lastContentWidthRef.current = bounds.width;
      }
    }, [bounds.width]);

    const contentWidth =
      bounds.width > 0 ? bounds.width : lastContentWidthRef.current; // eslint-disable-line react-hooks/refs -- Preserve the registry's last measured width until ResizeObserver reports again.
    const animatedWidth =
      shouldAnimateSize && contentWidth > 0
        ? Math.ceil(contentWidth + horizontalInset)
        : undefined;

    const setButtonRef = useCallback(
      (node: HTMLButtonElement | HTMLAnchorElement | null) => {
        buttonNodeRef.current = node;
        setRef(ref, node);
      },
      [ref],
    );

    const measureHorizontalInset = useCallback(
      (measuredContentWidth: number) => {
        if (!(measuredContentWidth > 0)) {
          return;
        }

        const buttonNode = buttonNodeRef.current;
        if (!(buttonNode && animateSize)) {
          return;
        }

        const styles = window.getComputedStyle(buttonNode);
        const next =
          (Number.parseFloat(styles.borderLeftWidth) || 0) +
          (Number.parseFloat(styles.borderRightWidth) || 0) +
          (Number.parseFloat(styles.paddingLeft) || 0) +
          (Number.parseFloat(styles.paddingRight) || 0);

        setHorizontalInset((current) => (current === next ? current : next));
      },
      [animateSize],
    );

    useLayoutEffect(() => {
      measureHorizontalInset(contentWidth);
    }, [contentWidth, measureHorizontalInset]); // eslint-disable-line react-hooks/refs -- The callback reads the anchor ref during the post-layout measurement.

    const handleRippleComplete = useCallback((id: string) => {
      setRipples((current) => {
        if (!current.some((item) => item.id === id)) {
          return current;
        }

        return current.filter((item) => item.id !== id);
      });
    }, []);

    useEffect(() => {
      if (isLocked) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsPressed(false);
      }
    }, [isLocked]);

    useLayoutEffect(() => {
      const wasLoading = wasLoadingRef.current;
      if (loading || wasLoading) {
        setRipples([]);
      }
      if (loading) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsPressed(false);
      }
      wasLoadingRef.current = loading;
    }, [loading]);

    const handlePointerDown = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      onPointerDown?.(e);

      if (e.defaultPrevented || isLocked) {
        return;
      }

      setIsPressed(true);

      if (!(allowsRipple && e.button === 0)) {
        return;
      }

      if (e.pointerType === "mouse" && e.buttons !== 1) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleSize =
        2 *
        Math.max(
          Math.hypot(x, y),
          Math.hypot(rect.width - x, y),
          Math.hypot(x, rect.height - y),
          Math.hypot(rect.width - x, rect.height - y),
        );
      rippleIdRef.current += 1;
      const id = `ripple-${rippleIdRef.current}`;

      setRipples((current) => {
        const next = [...current, { id, x, y, size: rippleSize }];
        return next.length > MAX_RIPPLES
          ? next.slice(next.length - MAX_RIPPLES)
          : next;
      });
    };

    const handlePointerUp = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      onPointerUp?.(e);
      setIsPressed(false);
    };

    const handlePointerLeave = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      onPointerLeave?.(e);
      setIsPressed(false);
    };

    const handlePointerCancel = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      onPointerCancel?.(e);
      setIsPressed(false);
    };

    const handleKeyDown = (e: KeyboardEvent<ButtonInteractionElement>) => {
      onKeyDown?.(e);

      if (
        e.defaultPrevented ||
        isLocked ||
        e.repeat ||
        (e.key !== " " && e.key !== "Enter")
      ) {
        return;
      }

      setIsPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent<ButtonInteractionElement>) => {
      onKeyUp?.(e);

      if (e.key === " " || e.key === "Enter") {
        setIsPressed(false);
      }
    };

    const rootClassName = cn(
      buttonVariants({
        className,
        linkUnderline: resolvedLinkUnderline,
        size,
        variant,
      }),
      isLocked && "pointer-events-none",
      disabled && "opacity-50",
    );

    const buildButtonSurface = (labelContent: ReactNode) => (
      <>
        {allowsRipple ? (
          <RippleLayer
            onRippleComplete={handleRippleComplete}
            ripples={ripples}
          />
        ) : null}
        <ButtonLoadingContent
          accessibleName={accessibleName}
          contentRef={shouldAnimateSize ? contentRef : undefined}
          icon={icon}
          iconPosition={iconPosition}
          linkUnderlineEnabled={resolvedLinkUnderline === "motion"}
          loading={loading}
          loadingIcon={loadingIcon}
          reduceMotion={reduceMotion}
        >
          {labelContent}
        </ButtonLoadingContent>
      </>
    );

    const buttonSurface = buildButtonSurface(children);

    const motionAnimate = useMemo(
      () =>
        getButtonAnimate(canAnimate, isPressed, animatedWidth, reduceMotion),
      [animatedWidth, canAnimate, isPressed, reduceMotion],
    );

    const motionSurfaceProps = useMemo(
      () =>
        buildMotionSurfaceProps({
          canAnimate,
          isPressed,
          motionAnimate,
          reduceMotion,
          useLinkMotionUnderline,
          variant,
        }),
      [
        canAnimate,
        isPressed,
        motionAnimate,
        reduceMotion,
        useLinkMotionUnderline,
        variant,
      ],
    );

    const sharedRootProps = {
      "aria-busy": loading || undefined,
      "aria-label": accessibleName,
      className: rootClassName,
      "data-slot": "button" as const,
    };

    if (href?.trim()) {
      const safeHref = href.trim();
      const {
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Anchor rendering intentionally removes the button-only type prop.
        type: _type,
        ...anchorProps
      } = omitLinkMotionConflicts(props as AnchorHTMLAttributesForMotion);
      const safeRel = resolveAnchorRel(target, rel);

      return (
        <MotionAnchor
          {...motionSurfaceProps}
          {...anchorProps}
          {...sharedRootProps}
          aria-disabled={isLocked || undefined}
          href={safeHref}
          onBlur={(e) => {
            onBlur?.(e);
            setIsPressed(false);
          }}
          onClick={(e) => {
            if (isLocked) {
              e.preventDefault();
            }
            onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);

            if (
              e.defaultPrevented ||
              isLocked ||
              e.repeat ||
              e.key !== "Enter"
            ) {
              return;
            }

            setIsPressed(true);
          }}
          onKeyUp={(e) => {
            onKeyUp?.(e);

            if (e.key === "Enter") {
              setIsPressed(false);
            }
          }}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onPointerUp={handlePointerUp}
          ref={setButtonRef}
          rel={safeRel}
          style={style}
          tabIndex={isLocked ? -1 : undefined}
          target={target}
        >
          {buttonSurface}
        </MotionAnchor>
      );
    }

    return (
      <ButtonPrimitive
        {...sharedRootProps}
        disabled={isLocked}
        onBlur={(e) => {
          onBlur?.(e);
          setIsPressed(false);
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
        render={(buttonProps) => {
          const {
            primitiveClassName,
            primitiveRef,
            primitiveStyle,
            resolvedButtonProps,
          } = resolvePrimitiveButtonProps(buttonProps);

          return (
            <motion.button
              {...resolvedButtonProps}
              {...motionSurfaceProps}
              className={primitiveClassName}
              ref={(node) => {
                setButtonRef(node);
                setRef(primitiveRef, node);
              }}
              style={primitiveStyle}
              type={type}
            >
              {buttonSurface}
            </motion.button>
          );
        }}
        style={style}
        type={type}
        {...props}
      />
    );
  },
);

ButtonInner.displayName = "Button";

const Button = memo(ButtonInner);

export { Button, buttonVariants };
