"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function InkViewport({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
      element.dataset.inkDraw = "";
    }
  }, []);

  return <div ref={ref}>{children}</div>;
}
