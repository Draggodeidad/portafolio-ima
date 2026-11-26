"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  animate,
  useMotionValue,
  type AnimationPlaybackControls,
} from "motion/react";
import {
  EASE,
  LAYER_ORDER,
  LAYER_POINTS,
  LAYER_TONE,
  PLANE_BOX,
  SHEET_HEIGHT,
  SHEET_WIDTH,
  TIMING,
  flightPath,
  letterGridScale,
  matrixAttribute,
  pointsAttribute,
  pose,
  type LayerId,
  type Point,
  type SheetLayout,
} from "./geometry";
import css from "./paper-plane.module.css";

export type PlaneOutcome = "sent" | "failed";

export type PaperPlaneProps = {
  /** The real form: measured once, then hidden by its owner. */
  form: HTMLFormElement;
  /** Null until the server answers. The plane only takes off on "sent". */
  outcome: PlaneOutcome | null;
  /** Development time scale: 0.25 plays four times slower. */
  speed?: number;
  /** The plane has left the sheet's place: the success card may enter. */
  onCardCue: () => void;
  /** The sheet lies over the form again: show the form, then the error. */
  onRestore: () => void;
  /** Nothing is left to draw: unmount the overlay. */
  onFinish: () => void;
};

type Phase =
  | "collect"
  | "shrink"
  | "fold-1"
  | "fold-2"
  | "fold-3"
  | "fold-4"
  | "hover"
  | "takeoff"
  | "unfold"
  | "grow"
  | "done";

type Measure = {
  /** The letter sheet's centre, in viewport pixels. */
  center: Point;
  layout: SheetLayout;
  /** The page grid's origin relative to the centre, and its cell. */
  grid: { x: number; y: number; cell: number };
  viewport: { width: number; height: number };
};

const mod = (value: number, cell: number) => ((value % cell) + cell) % cell;
/**
 * Where the browser paints a box edge: its page position rounded to the
 * nearest device pixel, halves down. Returned in viewport pixels.
 */
function paintedEdge(viewport: number, scroll: number) {
  const ratio = window.devicePixelRatio;
  return Math.ceil((viewport + scroll) * ratio - 0.5) / ratio - scroll;
}

/**
 * The part of the form the visitor can see (a phone shows only some of it),
 * below the fixed navigation bar, and where the page grid's lines fall.
 */
function measure(form: HTMLFormElement, center?: Point): Measure {
  const rect = form.getBoundingClientRect();
  const visual = window.visualViewport;
  const viewLeft = visual?.offsetLeft ?? 0;
  const viewTop = visual?.offsetTop ?? 0;
  const viewWidth = visual?.width ?? window.innerWidth;
  const viewHeight = visual?.height ?? window.innerHeight;
  const header = document.querySelector("header");
  const navBottom =
    header && getComputedStyle(header).position === "fixed"
      ? header.getBoundingClientRect().bottom
      : 0;
  const ceiling = Math.max(viewTop, navBottom);
  const left = Math.max(rect.left, viewLeft);
  let right = Math.min(rect.right, viewLeft + viewWidth);
  const top = Math.max(rect.top, ceiling);
  let bottom = Math.min(rect.bottom, viewTop + viewHeight);
  if (right - left < 1) right = left + 1;
  if (bottom - top < 1) bottom = top + 1;

  let cx = (left + right) / 2;
  let cy = (top + bottom) / 2;
  // Keep the whole letter sheet inside the visible area.
  const margin = SHEET_HEIGHT / 2 + 20;
  const minY = ceiling + margin;
  const maxY = viewTop + viewHeight - margin;
  if (minY <= maxY) cy = Math.min(maxY, Math.max(minY, cy));
  // On whole pixels, so the sheet's grid lines start exactly over the
  // page's and stay crisp.
  cx = Math.round(cx);
  cy = Math.round(cy);
  if (center) [cx, cy] = center;

  const sheet = form.closest<HTMLElement>("[data-grid-sheet]");
  const cell =
    parseFloat(
      getComputedStyle(sheet ?? document.documentElement).getPropertyValue(
        "--grid-cell",
      ),
    ) || 20;
  let gridX = 0;
  let gridY = 0;
  if (sheet) {
    // GridSnap moves the page grid by --grid-x; its rows start at the top.
    const box = sheet.getBoundingClientRect();
    gridX =
      paintedEdge(box.left, window.scrollX) +
      sheet.clientLeft +
      (parseFloat(sheet.style.getPropertyValue("--grid-x")) || 0);
    gridY = paintedEdge(box.top, window.scrollY) + sheet.clientTop;
  }

  return {
    center: [cx, cy],
    layout: {
      left: left - cx,
      top: top - cy,
      right: right - cx,
      bottom: bottom - cy,
      gridScale: letterGridScale(right - left, bottom - top),
    },
    grid: {
      x: mod(gridX - cx, cell),
      y: mod(gridY - cy, cell),
      cell,
    },
    viewport: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    },
  };
}

/** Half extents of the canvas: the whole block, or the small plane box. */
function blockCanvas({ layout }: Measure): Point {
  return [
    Math.ceil(Math.max(-layout.left, layout.right, SHEET_WIDTH / 2 + 20) + 2),
    Math.ceil(Math.max(-layout.top, layout.bottom, SHEET_HEIGHT / 2 + 20) + 2),
  ];
}

type LayerNodes = {
  group: SVGGElement;
  fill: SVGPolygonElement;
  grid: SVGPolygonElement;
  outline: SVGPolygonElement;
  margin: SVGLineElement;
  pattern: SVGPatternElement;
};

const setPoints = (element: Element, points: string) =>
  element.setAttribute("points", points);

/**
 * The sheet that becomes a paper plane. All motion is driven from here:
 * one `fold` value (0 → 5) shapes the paper; the plane's wrappers carry the
 * hover and the flight as transforms.
 */
export default function PaperPlane({
  form,
  outcome,
  speed = 1,
  onCardCue,
  onRestore,
  onFinish,
}: PaperPlaneProps) {
  const id = `plane-${useId().replace(/[^\w-]/g, "")}`;
  const patternId = (layerId: LayerId) => `${id}-${layerId.replace(".", "")}`;
  const [initial] = useState(() => measure(form));
  const measured = useRef(initial);
  const [canvas] = useState(() => blockCanvas(initial));
  const fold = useMotionValue(0);

  const root = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGSVGElement>(null);
  const trailPath = useRef<SVGPathElement>(null);
  const trailMask = useRef<SVGPathElement>(null);
  const flight = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const paper = useRef<SVGSVGElement>(null);
  const poseGroup = useRef<SVGGElement>(null);
  const sheetGroup = useRef<SVGGElement>(null);
  const sheetPattern = useRef<SVGPatternElement>(null);
  const tilePattern = useRef<SVGPatternElement>(null);
  const layers = useRef(new Map<LayerId, LayerNodes>());

  // The latest props, read by the running choreography.
  const latest = useRef({ outcome, onCardCue, onRestore, onFinish });
  useLayoutEffect(() => {
    latest.current = { outcome, onCardCue, onRestore, onFinish };
  });
  const director = useRef<{ settle: (outcome: PlaneOutcome) => void }>(null);
  useEffect(() => {
    if (outcome) director.current?.settle(outcome);
  }, [outcome]);

  useEffect(() => {
    const nodes = {
      root: root.current,
      trail: trail.current,
      trailPath: trailPath.current,
      trailMask: trailMask.current,
      flight: flight.current,
      float: float.current,
      paper: paper.current,
      pose: poseGroup.current,
      sheet: sheetGroup.current,
      sheetPattern: sheetPattern.current,
      tile: tilePattern.current,
    };
    if (Object.values(nodes).some((node) => !node)) return;
    const n = nodes as {
      [K in keyof typeof nodes]: NonNullable<(typeof nodes)[K]>;
    };
    const sheetFill = n.sheet.querySelector<SVGPolygonElement>(`.${css.fill}`)!;
    const sheetGrid = n.sheet.querySelector<SVGPolygonElement>(`.${css.grid}`)!;
    const sheetOutline = n.sheet.querySelector<SVGPolygonElement>(
      `.${css.outline}`,
    )!;
    const sheetMargin = n.sheet.querySelector<SVGLineElement>(
      `.${css.margin}`,
    )!;

    const seconds = (ms: number) => ms / 1000 / speed;
    const running = new Set<AnimationPlaybackControls>();
    const timers = new Set<number>();
    let current: AnimationPlaybackControls | null = null;
    let hovering: AnimationPlaybackControls[] = [];
    let phase: Phase = "collect";
    let disposed = false;
    let instant = false;

    const setPhase = (next: Phase) => {
      phase = next;
      n.root.setAttribute("data-phase", next);
    };
    const track = (controls: AnimationPlaybackControls) => {
      running.add(controls);
      return controls;
    };
    const later = (ms: number, run: () => void) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (!disposed) run();
      }, ms / speed);
      timers.add(timer);
    };

    const setCanvas = ([halfWidth, halfHeight]: Point) => {
      n.paper.setAttribute("width", String(halfWidth * 2));
      n.paper.setAttribute("height", String(halfHeight * 2));
      n.paper.setAttribute(
        "viewBox",
        `${-halfWidth} ${-halfHeight} ${halfWidth * 2} ${halfHeight * 2}`,
      );
    };
    const setGrid = ({ grid }: Measure) => {
      n.tile.setAttribute("x", String(grid.x));
      n.tile.setAttribute("y", String(grid.y));
      n.tile.setAttribute("width", String(grid.cell));
      n.tile.setAttribute("height", String(grid.cell));
    };

    const render = (value: number) => {
      const next = pose(value, measured.current.layout);
      const { sheet } = next;
      n.sheet.setAttribute("display", sheet.visible ? "inline" : "none");
      if (sheet.visible) {
        const points = pointsAttribute(sheet.points);
        setPoints(sheetFill, points);
        setPoints(sheetGrid, points);
        setPoints(sheetOutline, points);
        sheetOutline.setAttribute("stroke-opacity", String(sheet.edge));
        sheetMargin.setAttribute("opacity", String(sheet.edge));
        sheetMargin.setAttribute("x1", String(sheet.margin[0][0]));
        sheetMargin.setAttribute("y1", String(sheet.margin[0][1]));
        sheetMargin.setAttribute("x2", String(sheet.margin[1][0]));
        sheetMargin.setAttribute("y2", String(sheet.margin[1][1]));
        n.sheetPattern.setAttribute(
          "patternTransform",
          matrixAttribute(sheet.grid),
        );
      }
      for (const layerId of LAYER_ORDER) {
        const face = next.layers[layerId];
        const nodes = layers.current.get(layerId);
        if (!nodes) continue;
        nodes.group.setAttribute("display", face.visible ? "inline" : "none");
        if (!face.visible) continue;
        const points = pointsAttribute(face.points);
        setPoints(nodes.fill, points);
        setPoints(nodes.outline, points);
        nodes.group.setAttribute("data-face", face.back ? "back" : "front");
        if (face.back) continue;
        setPoints(nodes.grid, points);
        nodes.pattern.setAttribute(
          "patternTransform",
          matrixAttribute(next.grid[layerId]),
        );
        nodes.margin.setAttribute("display", face.margin ? "inline" : "none");
        if (face.margin) {
          nodes.margin.setAttribute("x1", String(face.margin[0][0]));
          nodes.margin.setAttribute("y1", String(face.margin[0][1]));
          nodes.margin.setAttribute("x2", String(face.margin[1][0]));
          nodes.margin.setAttribute("y2", String(face.margin[1][1]));
        }
      }
      n.pose.setAttribute(
        "transform",
        `rotate(${next.rotate}) translate(${next.translate[0]} ${next.translate[1]})`,
      );
    };

    const finish = () => {
      if (phase === "done") return;
      setPhase("done");
      latest.current.onFinish();
    };

    // Jump straight to the end (the page is being left, or put away).
    const settleInstantly = (result: PlaneOutcome | null) => {
      instant = true;
      for (const controls of running) controls.stop();
      n.root.style.visibility = "hidden";
      if (!result) return;
      if (result === "sent") latest.current.onCardCue();
      else latest.current.onRestore();
      finish();
    };

    const stopHover = () => {
      for (const controls of hovering) controls.stop();
      hovering = [];
      track(
        animate(
          n.float,
          { y: 0, rotate: 0 },
          { duration: seconds(TIMING.hoverSettle), ease: EASE.ui },
        ),
      );
    };

    const hover = () => {
      setPhase("hover");
      hovering = [
        track(
          animate(
            n.float,
            { y: [0, -4, 0, 4, 0] },
            {
              duration: seconds(TIMING.hoverBob),
              ease: "easeInOut",
              repeat: Infinity,
            },
          ),
        ),
        track(
          animate(
            n.float,
            { rotate: [0, 2, 0, -2, 0] },
            {
              duration: seconds(TIMING.hoverSway),
              ease: "easeInOut",
              repeat: Infinity,
            },
          ),
        ),
      ];
    };

    const takeOff = () => {
      setPhase("takeoff");
      stopHover();
      const { center, viewport } = measured.current;
      const path = flightPath({ start: center, viewport });
      n.trailPath.setAttribute("d", path.trail);
      n.trailMask.setAttribute("d", path.trail);
      const timing = {
        duration: seconds(path.duration),
        times: path.times,
        ease: path.ease,
      };
      track(
        animate(
          n.flight,
          { x: path.x, y: path.y, rotate: path.rotate, scale: path.scale },
          timing,
        ),
      );
      track(animate(n.trailMask, { pathLength: path.trailLength }, timing));
      track(
        animate(
          n.trail,
          { opacity: 0 },
          {
            delay: seconds(path.duration * TIMING.trailFadeAt),
            duration: seconds(TIMING.trailFade),
            ease: EASE.ui,
            onComplete: () => {
              if (!disposed) finish();
            },
          },
        ),
      );
      later(TIMING.cardCue, () => latest.current.onCardCue());
    };

    const grow = () => {
      // The page may have scrolled: grow back to where the form is now.
      measured.current = measure(form, measured.current.center);
      setGrid(measured.current);
      setCanvas(blockCanvas(measured.current));
      render(fold.get());
      setPhase("grow");
      current = track(
        animate(fold, 0, {
          duration: seconds(TIMING.grow * fold.get()),
          ease: EASE.ui,
          onComplete: () => {
            if (disposed) return;
            latest.current.onRestore();
            finish();
          },
        }),
      );
    };

    // Back down the same keyframes, one fold at a time, each settling.
    const unfold = () => {
      current?.stop();
      if (hovering.length) stopHover();
      setPhase("unfold");
      const value = fold.get();
      if (value <= 1) return grow();
      const target = Math.ceil(value) - 1;
      current = track(
        animate(fold, target, {
          duration: seconds(TIMING.unfold * (value - target)),
          ease: EASE.fold,
          onComplete: () => {
            if (!disposed) unfold();
          },
        }),
      );
    };

    const folded = () => {
      const result = latest.current.outcome;
      if (result === "sent") takeOff();
      else if (result === "failed") unfold();
      else hover();
    };

    const steps = [
      { to: 1, ms: TIMING.shrink, ease: EASE.ui, phase: "shrink" },
      { to: 2, ms: TIMING.folds[0], ease: EASE.fold, phase: "fold-1" },
      { to: 3, ms: TIMING.folds[1], ease: EASE.fold, phase: "fold-2" },
      { to: 4, ms: TIMING.folds[2], ease: EASE.fold, phase: "fold-3" },
      { to: 5, ms: TIMING.folds[3], ease: EASE.fold, phase: "fold-4" },
    ] as const;

    const foldFrom = (index: number) => {
      if (latest.current.outcome === "failed") return unfold();
      const step = steps[index];
      if (!step) return folded();
      setPhase(step.phase);
      // Letter sized now: drop to a small canvas, so the layer stays small.
      if (index === 1) setCanvas([PLANE_BOX, PLANE_BOX]);
      current = track(
        animate(fold, step.to, {
          duration: seconds(step.ms),
          delay: index > 0 ? seconds(TIMING.hold) : 0,
          ease: step.ease,
          onComplete: () => {
            if (!disposed) foldFrom(index + 1);
          },
        }),
      );
    };

    director.current = {
      settle(result) {
        if (instant) return settleInstantly(result);
        if (result === "failed") {
          if (phase.startsWith("fold") || phase === "shrink") unfold();
          else if (phase === "hover") unfold();
        } else if (phase === "hover") takeOff();
        // Otherwise the running step picks the outcome up when it ends.
      },
    };

    const unsubscribe = fold.on("change", render);
    const onPageHide = () => settleInstantly(latest.current.outcome);
    window.addEventListener("pagehide", onPageHide);

    setGrid(measured.current);
    fold.set(0);
    render(0);
    setPhase("collect");
    // The form's content fades first (its own CSS); then the blank sheet,
    // drawn on the same grid, takes its place.
    later(TIMING.collect, () => {
      n.root.style.visibility = "visible";
      foldFrom(0);
    });

    return () => {
      disposed = true;
      director.current = null;
      unsubscribe();
      window.removeEventListener("pagehide", onPageHide);
      for (const timer of timers) window.clearTimeout(timer);
      for (const controls of running) controls.stop();
    };
  }, [fold, form, speed]);

  const register = (layerId: LayerId) => (group: SVGGElement | null) => {
    if (!group) {
      layers.current.delete(layerId);
      return;
    }
    const nodes = {
      group,
      fill: group.querySelector<SVGPolygonElement>(`.${css.fill}`)!,
      grid: group.querySelector<SVGPolygonElement>(`.${css.grid}`)!,
      outline: group.querySelector<SVGPolygonElement>(`.${css.outline}`)!,
      margin: group.querySelector<SVGLineElement>(`.${css.margin}`)!,
      pattern: group.ownerSVGElement!.querySelector<SVGPatternElement>(
        `#${patternId(layerId)}`,
      )!,
    };
    layers.current.set(layerId, nodes);
  };

  const [halfWidth, halfHeight] = canvas;
  const [cx, cy] = initial.center;
  const empty = (count: number) =>
    pointsAttribute(Array.from({ length: count }, () => [0, 0] as Point));

  return createPortal(
    <div
      ref={root}
      className={css.root}
      data-paper-plane=""
      data-phase="collect"
      aria-hidden="true"
      style={{ visibility: "hidden" }}
    >
      <svg ref={trail} className={css.trail}>
        <defs>
          <mask id={`${id}-trail`} maskUnits="userSpaceOnUse">
            {/* Drawn by Motion's pathLength; nothing shows before it starts. */}
            <path
              ref={trailMask}
              className={css.trailMask}
              pathLength={1}
              strokeDasharray="0 1"
            />
          </mask>
        </defs>
        <path
          ref={trailPath}
          className={css.trailPath}
          mask={`url(#${id}-trail)`}
        />
      </svg>
      <div ref={flight} className={css.flight} style={{ left: cx, top: cy }}>
        <div ref={float} className={css.float}>
          <svg
            ref={paper}
            className={css.paper}
            width={halfWidth * 2}
            height={halfHeight * 2}
            viewBox={`${-halfWidth} ${-halfHeight} ${halfWidth * 2} ${halfHeight * 2}`}
          >
            <defs>
              <pattern
                ref={tilePattern}
                id={`${id}-tile`}
                patternUnits="userSpaceOnUse"
                width={20}
                height={20}
              >
                <rect className={css.tile} width={20} height={1} />
                <rect className={css.tile} width={1} height={20} />
              </pattern>
              <pattern
                ref={sheetPattern}
                id={`${id}-sheet`}
                href={`#${id}-tile`}
              />
              {LAYER_ORDER.map((layerId) => (
                <pattern
                  key={layerId}
                  id={patternId(layerId)}
                  href={`#${id}-tile`}
                />
              ))}
            </defs>
            <g ref={poseGroup}>
              <g ref={sheetGroup}>
                <polygon className={css.fill} points={empty(4)} />
                <polygon
                  className={css.grid}
                  points={empty(4)}
                  fill={`url(#${id}-sheet)`}
                />
                <line className={css.margin} />
                <polygon className={css.outline} points={empty(4)} />
              </g>
              {LAYER_ORDER.map((layerId) => (
                <g
                  key={layerId}
                  ref={register(layerId)}
                  className={css.layer}
                  display="none"
                  style={
                    {
                      "--back": `var(--tone-${LAYER_TONE[layerId]})`,
                    } as CSSProperties
                  }
                >
                  <polygon
                    className={css.fill}
                    points={empty(LAYER_POINTS[layerId])}
                  />
                  <polygon
                    className={css.grid}
                    points={empty(LAYER_POINTS[layerId])}
                    fill={`url(#${patternId(layerId)})`}
                  />
                  <line className={css.margin} display="none" />
                  <polygon
                    className={css.outline}
                    points={empty(LAYER_POINTS[layerId])}
                  />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>,
    document.body,
  );
}
