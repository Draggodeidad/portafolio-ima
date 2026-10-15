"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./hero.module.css";

const glassEffectEnabled = process.env.NEXT_PUBLIC_ENABLE_HUD_GLASS === "true";

const GlassObject = dynamic(
  () => import("../canvasui/GlassObject").then((module) => module.GlassObject),
  { ssr: false },
);

type HudVisualProps = {
  children: ReactNode;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError: () => void;
};

class GlassErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function HudVisual({ children }: HudVisualProps) {
  const [glassAccent, setGlassAccent] = useState("");
  const [nearViewport, setNearViewport] = useState(false);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!glassEffectEnabled) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(media.matches);
    const syncPageVisibility = () =>
      setPageVisible(document.visibilityState === "visible");

    syncMotionPreference();
    syncPageVisibility();
    media.addEventListener("change", syncMotionPreference);
    document.addEventListener("visibilitychange", syncPageVisibility);

    return () => {
      media.removeEventListener("change", syncMotionPreference);
      document.removeEventListener("visibilitychange", syncPageVisibility);
    };
  }, []);

  useEffect(() => {
    if (!glassEffectEnabled) return;

    const root = rootRef.current;
    if (!root) return;

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearViewport(entry.isIntersecting);
        if (entry.isIntersecting) setHasEnteredViewport(true);
      },
      { rootMargin: "64px", threshold: 0.01 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!glassEffectEnabled) return;

    const frame = requestAnimationFrame(() => {
      setGlassAccent(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--portfolio-accent")
          .trim(),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!glassEffectEnabled || !nearViewport || reducedMotion !== false) return;

    const frame = requestAnimationFrame(() => {
      const probe = document.createElement("canvas");
      try {
        const context = probe.getContext("webgl2", {
          alpha: true,
          antialias: true,
        });
        setWebglAvailable(Boolean(context));
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        setWebglAvailable(false);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [nearViewport, reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (
      !glassEffectEnabled ||
      !root ||
      webglAvailable !== true ||
      reducedMotion !== false ||
      failed
    )
      return;

    let canvas: HTMLCanvasElement | null = null;
    const onContextLost = () => setFailed(true);
    const observeCanvas = () => {
      const nextCanvas = root.querySelector("canvas");
      if (nextCanvas === canvas) return;
      canvas?.removeEventListener("webglcontextlost", onContextLost);
      canvas = nextCanvas;
      canvas?.addEventListener("webglcontextlost", onContextLost, {
        once: true,
      });
    };
    const observer = new MutationObserver(observeCanvas);
    observer.observe(root, { childList: true, subtree: true });
    observeCanvas();

    return () => {
      observer.disconnect();
      canvas?.removeEventListener("webglcontextlost", onContextLost);
    };
  }, [failed, reducedMotion, webglAvailable]);

  const shouldRenderGlass =
    glassEffectEnabled &&
    hasEnteredViewport &&
    webglAvailable === true &&
    reducedMotion !== null &&
    !failed &&
    glassAccent.length > 0;
  const effectReady =
    glassEffectEnabled &&
    loaded &&
    !failed &&
    reducedMotion === false &&
    nearViewport;
  return (
    <span
      className={styles.hudVisual}
      ref={rootRef}
      data-effect={effectReady ? "ready" : "fallback"}
    >
      <svg
        className={styles.glassFallback}
        data-testid="hud-glass-fallback"
        aria-hidden="true"
        viewBox="0 0 512 512"
        fill="none"
        focusable="false"
      >
        <path
          d="M256 32 400 96 480 256 400 416 256 480 112 416 32 256 112 96Z M256 104 148 152 104 256 148 360 256 408 364 360 408 256 364 152Z"
          fillRule="evenodd"
        />
        <circle cx="256" cy="256" r="198" />
        <circle cx="256" cy="256" r="148" />
      </svg>
      {shouldRenderGlass ? (
        <span
          className={styles.glassLayer}
          data-testid="hud-glass-layer"
          aria-hidden="true"
        >
          <GlassErrorBoundary fallback={null} onError={() => setFailed(true)}>
            <GlassObject
              className={styles.glassCanvas}
              src="/images/hud-glass-ring.svg"
              ior={1.35}
              roughness={0.32}
              dispersion={0.18}
              tint={glassAccent}
              tintDensity={0.28}
              highlight={glassAccent}
              environmentIntensity={0.65}
              scale={2.25}
              floatIntensity={0.12}
              rotationIntensity={0.08}
              floatSpeed={0.45}
              orbit={false}
              zoom={false}
              autoRotate={false}
              active={pageVisible && nearViewport && !reducedMotion}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          </GlassErrorBoundary>
        </span>
      ) : null}
      <span className={effectReady ? styles.monogramGlass : undefined}>
        {children}
      </span>
    </span>
  );
}
