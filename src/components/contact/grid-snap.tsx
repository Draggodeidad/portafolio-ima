"use client";

import { useLayoutEffect, useRef } from "react";

const mod = (value: number, cell: number) => ((value % cell) + cell) % cell;

/**
 * Keeps blocks on the sheet's quad grid. Text runs on a 24 px leading, so
 * whatever follows a paragraph lands between grid lines. For each
 * `[data-grid-snap]` inside the closest `[data-grid-sheet]`, in document
 * order, this sets `--grid-snap` to the few pixels that move the block's top
 * edge onto the next line, and sets `--grid-x` so the grid's vertical lines
 * meet the content's left edge. Recomputed whenever the sheet resizes
 * (wrapping, fonts, the form arriving, error messages).
 */
export function GridSnap() {
  const marker = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const sheet = marker.current?.closest<HTMLElement>("[data-grid-sheet]");
    if (!sheet) return;
    let frame = 0;

    const snap = () => {
      const style = getComputedStyle(sheet);
      const cell = parseFloat(style.getPropertyValue("--grid-cell")) || 20;
      sheet.style.setProperty(
        "--grid-x",
        `${mod(parseFloat(style.paddingLeft), cell)}px`,
      );

      const targets = Array.from(
        sheet.querySelectorAll<HTMLElement>("[data-grid-snap]"),
      );
      for (const target of targets)
        target.style.setProperty("--grid-snap", "0px");
      const origin = sheet.getBoundingClientRect().top + sheet.clientTop;
      for (const target of targets) {
        // A stuck sticky block is not where the flow puts it; it already
        // starts on the first line of its column.
        if (getComputedStyle(target).position === "sticky") continue;
        const offset = mod(
          Math.round(target.getBoundingClientRect().top - origin),
          cell,
        );
        target.style.setProperty(
          "--grid-snap",
          `${offset ? cell - offset : 0}px`,
        );
      }
    };

    snap();
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(snap);
    });
    observer.observe(sheet);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <span ref={marker} hidden />;
}
