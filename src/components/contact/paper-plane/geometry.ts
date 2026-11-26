/*
 * Paper plane geometry. Pure functions only: no DOM, no Motion, so the
 * folding can be checked without a browser.
 *
 * The letter sheet lives in local units: 180 × 240, origin at its centre,
 * nose N at the top. One `fold` value runs 0 → 5:
 *
 *   0 → 1  shrink   the visible form block becomes the letter sheet
 *   1 → 2  fold 1   top corners to the centre line (hinge N–E1, 45°)
 *   2 → 3  fold 2   the new edges to the centre again (hinge N–E2, 22.5°)
 *   3 → 4  fold 3   in half: the right half turns behind the left
 *   4 → 5  fold 4   the wing opens into the plane's profile (hinge N–WING)
 *
 * Every point of a folding layer follows P(f) = P + (R(P) − P)·f, where R
 * reflects across the hinge. That is the orthographic view of paper turning
 * about the hinge, so a linear morph between two polygons with the same
 * points is physically right. At f = 0.5 the layer is seen edge-on, which
 * is where its face changes from the front (paper, grid, margin rule) to the
 * back (a darker tone) without anyone seeing the swap.
 */

export type Point = readonly [x: number, y: number];
/** SVG matrix(a b c d e f): x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type Matrix = readonly [
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
];
type Hinge = { readonly a: Point; readonly n: Point };

export const SHEET_WIDTH = 180;
export const SHEET_HEIGHT = 240;
/** Half extent of the square canvas that holds the sheet once it is small. */
export const PLANE_BOX = 160;
const SHEET_ASPECT = SHEET_WIDTH / SHEET_HEIGHT;
/** The red margin rule: 20 units in from the sheet's left edge. */
const MARGIN_X = -SHEET_WIDTH / 2 + 20;
/**
 * How far the wing turns: 0.8 of a flat fold, about 127°. The keel is wider
 * and the wing narrower than on a real dart, so the profile reads as a plane
 * (wing above, keel below) instead of a single needle.
 */
export const WING_FOLD = 0.8;
/** The plane leaves heading 35° above the horizon (screen y points down). */
export const LAUNCH_HEADING = -35;

/** The group's rotation at the end of each stage, in degrees. */
const STAGE_ROTATION = [0, 0, -3, 2, -2, 90 + LAUNCH_HEADING] as const;

const N: Point = [0, -120];
const TL: Point = [-90, -120];
const BL: Point = [-90, 120];
const BC: Point = [0, 120];
const E1: Point = [-90, -30];
const C1: Point = [0, -30];
const TAN_22_5 = Math.tan(Math.PI / 8);
const E2: Point = [-90, -120 + 90 / TAN_22_5];
/** Fold 2's hinge crosses flap 1's lower edge (y = −30) here. */
const K: Point = [-90 * TAN_22_5, -30];
const WING: Point = [-55, 120];

function hingeThrough(a: Point, b: Point): Hinge {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  return { a, n: [dy / length, -dx / length] };
}

function signedDistance(p: Point, hinge: Hinge) {
  return (p[0] - hinge.a[0]) * hinge.n[0] + (p[1] - hinge.a[1]) * hinge.n[1];
}

/** Moves `p` a fraction `f` of the way to its reflection across `hinge`. */
export function foldPoint(p: Point, hinge: Hinge, f: number): Point {
  const k = 2 * f * signedDistance(p, hinge);
  return [p[0] - k * hinge.n[0], p[1] - k * hinge.n[1]];
}

/** The same fold as an affine map, for the grid pattern of a folding face. */
export function foldMatrix(hinge: Hinge, f: number): Matrix {
  const [nx, ny] = hinge.n;
  const offset = 2 * f * (nx * hinge.a[0] + ny * hinge.a[1]);
  return [
    1 - 2 * f * nx * nx,
    -2 * f * nx * ny,
    -2 * f * nx * ny,
    1 - 2 * f * ny * ny,
    offset * nx,
    offset * ny,
  ];
}

function multiply(m: Matrix, n: Matrix): Matrix {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

const scaleMatrix = (s: number): Matrix => [s, 0, 0, s, 0, 0];

/** Where a hinge line crosses the vertical line `x`. */
function crossAtX(hinge: Hinge, x: number): Point {
  const [nx, ny] = hinge.n;
  return [x, hinge.a[1] - (nx * (x - hinge.a[0])) / ny];
}

/** Where segment p–q crosses a hinge line. */
function crossSegment(p: Point, q: Point, hinge: Hinge): Point {
  const dp = signedDistance(p, hinge);
  const t = dp / (dp - signedDistance(q, hinge));
  return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
}

const H1 = hingeThrough(N, E1);
const H2 = hingeThrough(N, E2);
const H4 = hingeThrough(N, WING);
const C2 = foldPoint(E1, H2, 1);
const Q = crossSegment(C2, E2, H4);
const MARGIN_ON_H1 = crossAtX(H1, MARGIN_X);
const MARGIN_ON_H2 = crossAtX(H2, MARGIN_X);
const SPINE = hingeThrough(N, BC);

export const POINTS = { N, TL, BL, BC, E1, C1, E2, C2, K, WING, Q } as const;

/* Layers */

export type LayerId =
  | "R.base"
  | "R.flap1"
  | "R.flap2"
  | "R.flap2Inner"
  | "L.base"
  | "L.flap1"
  | "L.flap2"
  | "L.flap2Inner"
  | "L.wing"
  | "L.wingInner";

/** Bottom to top. The right half sits under the left so it can pass behind. */
export const LAYER_ORDER: readonly LayerId[] = [
  "R.base",
  "R.flap1",
  "R.flap2",
  "R.flap2Inner",
  "L.base",
  "L.flap1",
  "L.flap2",
  "L.flap2Inner",
  "L.wing",
  "L.wingInner",
];

/** Points per layer: fixed, so every pose of a layer morphs into the next. */
export const LAYER_POINTS: Readonly<Record<LayerId, number>> = {
  "R.base": 4,
  "R.flap1": 3,
  "R.flap2": 3,
  "R.flap2Inner": 3,
  "L.base": 4,
  "L.flap1": 3,
  "L.flap2": 3,
  "L.flap2Inner": 3,
  "L.wing": 4,
  "L.wingInner": 3,
};

/** The tone a layer shows when its back faces the viewer (1 lightest). */
export const LAYER_TONE: Readonly<Record<LayerId, 1 | 2 | 3>> = {
  "R.base": 1,
  "R.flap1": 1,
  "R.flap2": 2,
  "R.flap2Inner": 1,
  "L.base": 1,
  "L.flap1": 1,
  "L.flap2": 2,
  "L.flap2Inner": 1,
  "L.wing": 3,
  "L.wingInner": 2,
};

export type Face = {
  visible: boolean;
  points: Point[];
  /** Front: paper, grid and margin rule. Back: the layer's tone only. */
  back: boolean;
  /** The fold applied to the grid on the front, before the grid's scale. */
  fold: Matrix | null;
  /** The red margin rule on this face (left half only), already folded. */
  margin: readonly [Point, Point] | null;
};

const hidden = (count: number): Face => ({
  visible: false,
  points: Array.from({ length: count }, () => N),
  back: false,
  fold: null,
  margin: null,
});

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * One half of the sheet at fold value `p` (1 ≤ p ≤ 5), in flat coordinates
 * before fold 3. `side` 1 is the left half as defined above, −1 its mirror.
 */
function halfLayers(side: 1 | -1, p: number) {
  const m = (point: Point): Point => [point[0] * side, point[1]];
  const h1 = hingeThrough(m(N), m(E1));
  const h2 = hingeThrough(m(N), m(E2));
  const h4 = hingeThrough(m(N), m(WING));
  const stage = p < 2 ? 1 : p < 3 ? 2 : p < 4 ? 3 : 4;
  const f1 = clamp01(p - 1);
  const f2 = clamp01(p - 2);
  const f4 = clamp01(p - 4) * WING_FOLD;
  const left = side === 1;
  const margin = (from: Point, to: Point) =>
    left ? ([from, to] as const) : null;

  const base: Face = {
    visible: true,
    points:
      stage === 1
        ? [m(N), m(E1), m(BL), m(BC)]
        : stage === 4
          ? [m(N), m(WING), m(BC), m(BC)]
          : [m(N), m(E2), m(BL), m(BC)],
    back: false,
    fold: null,
    margin:
      stage === 1
        ? margin(MARGIN_ON_H1, [MARGIN_X, 120])
        : stage === 4
          ? null
          : margin(MARGIN_ON_H2, [MARGIN_X, 120]),
  };

  let flap1 = hidden(3);
  if (stage === 1)
    flap1 = {
      visible: true,
      points: [m(N), foldPoint(m(TL), h1, f1), m(E1)],
      back: f1 >= 0.5,
      fold: foldMatrix(h1, f1),
      margin: margin(foldPoint([MARGIN_X, -120], h1, f1), MARGIN_ON_H1),
    };
  else if (stage === 2)
    // What stays of flap 1 right of fold 2's hinge; fold 2 covers it.
    flap1 = {
      visible: true,
      points: [m(N), m(C1), m(K)],
      back: true,
      fold: null,
      margin: null,
    };

  let flap2 = hidden(3);
  let flap2Inner = hidden(3);
  if (stage === 2) {
    flap2 = {
      visible: true,
      points: [m(N), foldPoint(m(E1), h2, f2), m(E2)],
      back: f2 >= 0.5,
      fold: foldMatrix(h2, f2),
      margin: margin(
        foldPoint(MARGIN_ON_H1, h2, f2),
        foldPoint(MARGIN_ON_H2, h2, f2),
      ),
    };
    // The part of flap 1 that fold 2 carries along, seen until it turns.
    flap2Inner = {
      visible: f2 < 0.5,
      points: [m(N), m(K), foldPoint(m(E1), h2, f2)],
      back: true,
      fold: null,
      margin: null,
    };
  } else if (stage >= 3) {
    flap2 = {
      visible: true,
      points: stage === 3 ? [m(N), m(C2), m(E2)] : [m(N), m(C2), m(Q)],
      back: true,
      fold: null,
      margin: null,
    };
  }

  let wing = hidden(4);
  let wingInner = hidden(3);
  if (left && stage === 4) {
    wing = {
      visible: true,
      points: [N, foldPoint(E2, h4, f4), foldPoint(BL, h4, f4), WING],
      back: f4 >= 0.5,
      fold: foldMatrix(h4, f4),
      margin: [
        foldPoint(MARGIN_ON_H2, h4, f4),
        foldPoint([MARGIN_X, 120], h4, f4),
      ],
    };
    wingInner = {
      visible: f4 < 0.5,
      points: [N, Q, foldPoint(E2, h4, f4)],
      back: true,
      fold: null,
      margin: null,
    };
  }

  return { base, flap1, flap2, flap2Inner, wing, wingInner };
}

/** Fold 3 turns the whole right half about the spine, behind the left. */
function turnBehind(face: Face, f3: number): Face {
  if (f3 <= 0) return face;
  const turn = foldMatrix(SPINE, f3);
  return {
    ...face,
    // Past edge-on it is behind the left half, which covers it whole.
    visible: face.visible && f3 < 0.5,
    points: face.points.map((point) => foldPoint(point, SPINE, f3)),
    fold: face.fold ? multiply(turn, face.fold) : turn,
  };
}

function rawLayers(p: number): Record<LayerId, Face> {
  const left = halfLayers(1, p);
  const right = halfLayers(-1, p);
  const f3 = clamp01(p - 3);
  const behind = (face: Face) => turnBehind(face, p >= 4 ? 1 : f3);
  return {
    "R.base": behind(right.base),
    "R.flap1": behind(right.flap1),
    "R.flap2": behind(right.flap2),
    "R.flap2Inner": behind(right.flap2Inner),
    "L.base": left.base,
    "L.flap1": left.flap1,
    "L.flap2": left.flap2,
    "L.flap2Inner": left.flap2Inner,
    "L.wing": left.wing,
    "L.wingInner": left.wingInner,
  };
}

function visibleBounds(layers: Record<LayerId, Face>) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const id of LAYER_ORDER) {
    const face = layers[id];
    if (!face.visible) continue;
    for (const [x, y] of face.points) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  return { minX, minY, maxX, maxY };
}

/** Moves each stage's end pose so what is visible stays centred. */
const STAGE_OFFSET: readonly Point[] = [0, 1, 2, 3, 4, 5].map((stage) => {
  if (stage <= 1) return [0, 0] as Point;
  const { minX, minY, maxX, maxY } = visibleBounds(rawLayers(stage));
  return [-(minX + maxX) / 2, -(minY + maxY) / 2] as Point;
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPoint = (a: Point, b: Point, t: number): Point => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
];

/* Shrink */

/** The visible form block, in pixels relative to the sheet's centre. */
export type SheetLayout = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  /** The grid's scale once the block is letter sized. */
  gridScale: number;
};

/**
 * The scale that takes the grid from the page to the letter sheet: the
 * block is cropped to the letter's 3:4 shape, then scaled to 180 × 240.
 */
export function letterGridScale(width: number, height: number) {
  return SHEET_WIDTH / Math.min(width, height * SHEET_ASPECT);
}

export type Pose = {
  /** The shrinking sheet (stage 0); the halves take over at p = 1. */
  sheet: {
    visible: boolean;
    points: Point[];
    grid: Matrix;
    /** Edge and margin rule fade in as the block becomes a sheet. */
    edge: number;
    margin: readonly [Point, Point];
  };
  layers: Record<LayerId, Face>;
  /** Grid pattern matrix per layer front (fold, then the grid's scale). */
  grid: Record<LayerId, Matrix>;
  rotate: number;
  translate: Point;
};

export function pose(p: number, layout: SheetLayout): Pose {
  const value = Math.min(5, Math.max(0, p));
  const shrink = clamp01(value);
  const left = lerp(layout.left, -SHEET_WIDTH / 2, shrink);
  const top = lerp(layout.top, -SHEET_HEIGHT / 2, shrink);
  const right = lerp(layout.right, SHEET_WIDTH / 2, shrink);
  const bottom = lerp(layout.bottom, SHEET_HEIGHT / 2, shrink);
  const sheetGrid = lerp(1, layout.gridScale, shrink);

  const layers = rawLayers(Math.max(1, value));
  const scale = scaleMatrix(layout.gridScale);
  const grid = {} as Record<LayerId, Matrix>;
  for (const id of LAYER_ORDER) {
    const fold = layers[id].fold;
    grid[id] = fold ? multiply(fold, scale) : scale;
  }
  if (value < 1)
    for (const id of LAYER_ORDER)
      layers[id] = { ...layers[id], visible: false };

  const stage = Math.min(4, Math.floor(value));
  const t = value - stage;
  const from = Math.max(stage, 0);
  const to = Math.min(stage + 1, 5);
  return {
    sheet: {
      visible: value < 1,
      points: [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
      ],
      grid: scaleMatrix(sheetGrid),
      edge: shrink,
      margin: [
        [left + 20, top],
        [left + 20, bottom],
      ],
    },
    layers,
    grid,
    rotate: lerp(STAGE_ROTATION[from], STAGE_ROTATION[to], t),
    translate: lerpPoint(STAGE_OFFSET[from], STAGE_OFFSET[to], t),
  };
}

/* Timing (ms) and curves */

export const TIMING = {
  collect: 200,
  shrink: 300,
  folds: [170, 170, 160, 180] as const,
  hold: 30,
  unfold: 140,
  grow: 260,
  anticipation: 130,
  throw: 720,
  /** The success card starts entering this long after take-off, as the
   * plane leaves the screen (about 90% of the way). */
  cardCue: 520,
  cardEnter: 250,
  /** One full bob (±4 px) and one full sway (±2°) while the plane waits;
   * different lengths, so the two never fall into step. */
  hoverBob: 3200,
  hoverSway: 4400,
  hoverSettle: 140,
  trailFade: 300,
  /** The trail starts fading at this share of the flight. */
  trailFadeAt: 0.75,
} as const;

export type Bezier = readonly [number, number, number, number];

export const EASE = {
  /** `--ease-out-ui`: the shrink and the sheet growing back. */
  ui: [0.23, 1, 0.32, 1],
  /** Each fold: a quick start that settles on the crease. */
  fold: [0.32, 0.72, 0, 1],
  /** The wind-up before the throw. */
  anticipation: [0.45, 0, 0.55, 1],
  /** The throw: released fast, losing speed as it goes. */
  throw: [0.33, 1, 0.68, 1],
} as const satisfies Record<string, Bezier>;

/** Click to the success card fully in, when the server answers in time. */
export function successBudget() {
  const folds = TIMING.folds.reduce((sum, fold) => sum + fold, 0);
  return (
    TIMING.collect +
    TIMING.shrink +
    folds +
    TIMING.hold * TIMING.folds.length +
    TIMING.cardCue +
    TIMING.cardEnter
  );
}

/** CSS cubic-bezier(x1, y1, x2, y2) as a function of time 0–1. */
export function cubicBezier([x1, y1, x2, y2]: Bezier) {
  const sample = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  const slope = (a: number, b: number, t: number) =>
    3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const error = sample(x1, x2, t) - x;
      const d = slope(x1, x2, t);
      if (Math.abs(error) < 1e-6) break;
      if (Math.abs(d) < 1e-6) break;
      t -= error / d;
    }
    if (t < 0 || t > 1 || Math.abs(sample(x1, x2, t) - x) > 1e-4) {
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 30; i++) {
        if (sample(x1, x2, t) < x) lo = t;
        else hi = t;
        t = (lo + hi) / 2;
      }
    }
    return sample(y1, y2, t);
  };
}

/* Flight */

export type Flight = {
  /** Offsets from the start, in pixels, for the plane's wrapper. */
  x: number[];
  y: number[];
  /** Degrees added to the pose's launch rotation; 0 at the start. */
  rotate: number[];
  scale: number[];
  times: number[];
  /** Total duration in ms: wind-up plus throw. */
  duration: number;
  /** The trail in viewport pixels, and how much of it is drawn per key. */
  trail: string;
  trailLength: number[];
  /** Per segment: the wind-up eased, then linear between the samples
   * (their spacing already carries the throw's curve). */
  ease: (Bezier | "linear")[];
};

type Cubic = readonly [Point, Point, Point, Point];

function bezierAt([p0, p1, p2, p3]: Cubic, u: number): Point {
  const v = 1 - u;
  const a = v * v * v;
  const b = 3 * v * v * u;
  const c = 3 * v * u * u;
  const d = u * u * u;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

function bezierTangent([p0, p1, p2, p3]: Cubic, u: number): Point {
  const v = 1 - u;
  return [
    3 * v * v * (p1[0] - p0[0]) +
      6 * v * u * (p2[0] - p1[0]) +
      3 * u * u * (p3[0] - p2[0]),
    3 * v * v * (p1[1] - p0[1]) +
      6 * v * u * (p2[1] - p1[1]) +
      3 * u * u * (p3[1] - p2[1]),
  ];
}

const degrees = (radians: number) => (radians * 180) / Math.PI;

/**
 * Samples the throw by arc length, so the plane, its rotation and the trail
 * are keyed to the same distances and stay together.
 */
export function flightPath({
  start,
  viewport,
  samples = 24,
}: {
  start: Point;
  viewport: { width: number; height: number };
  samples?: number;
}): Flight {
  const heading = (LAUNCH_HEADING * Math.PI) / 180;
  const direction: Point = [Math.cos(heading), Math.sin(heading)];
  const reach = Math.min(220, viewport.width * 0.3);
  const curve: Cubic = [
    start,
    [start[0] + direction[0] * reach, start[1] + direction[1] * reach],
    [
      Math.max(start[0] + reach, viewport.width * 0.92),
      Math.min(start[1] - reach * 0.6, start[1] * 0.3),
    ],
    [viewport.width + 140, -140],
  ];

  // Arc-length table, then invert it.
  const steps = 256;
  const lengths = [0];
  let previous = bezierAt(curve, 0);
  for (let i = 1; i <= steps; i++) {
    const point = bezierAt(curve, i / steps);
    lengths.push(
      lengths[i - 1] +
        Math.hypot(point[0] - previous[0], point[1] - previous[1]),
    );
    previous = point;
  }
  const total = lengths[steps];
  const atLength = (share: number) => {
    const target = share * total;
    let lo = 0;
    let hi = steps;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (lengths[mid] < target) lo = mid;
      else hi = mid;
    }
    const span = lengths[hi] - lengths[lo] || 1;
    return (lo + (target - lengths[lo]) / span) / steps;
  };

  const duration = TIMING.anticipation + TIMING.throw;
  const windUp = TIMING.anticipation / duration;
  const ease = cubicBezier(EASE.throw);
  const launch = degrees(heading);
  // The trail ends behind the plane's tail, not under its body.
  const lag = 36 / total;

  const x = [0, -direction[0] * 10];
  const y = [0, -direction[1] * 10];
  const rotate = [0, -4];
  const scale = [1, 1];
  const times = [0, windUp];
  const trailLength = [0, 0];
  let last = 0;
  for (let i = 1; i <= samples; i++) {
    const share = ease(i / samples);
    const u = atLength(share);
    const [px, py] = bezierAt(curve, u);
    const [tx, ty] = bezierTangent(curve, u);
    let angle = degrees(Math.atan2(ty, tx)) - launch;
    // Unwrap, so the plane never spins the long way round.
    while (angle - last > 180) angle -= 360;
    while (angle - last < -180) angle += 360;
    last = angle;
    x.push(px - start[0]);
    y.push(py - start[1]);
    rotate.push(angle);
    scale.push(1 - 0.15 * share);
    times.push(windUp + (1 - windUp) * (i / samples));
    trailLength.push(Math.max(0, share - lag));
  }

  const f = (value: number) => Math.round(value * 10) / 10;
  const [p0, p1, p2, p3] = curve;
  return {
    x,
    y,
    rotate,
    scale,
    times,
    duration,
    trail: `M${f(p0[0])} ${f(p0[1])}C${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])} ${f(p3[0])} ${f(p3[1])}`,
    trailLength,
    ease: [
      EASE.anticipation,
      ...Array.from({ length: samples }, () => "linear" as const),
    ],
  };
}

/** Points as an SVG `points` attribute. */
export function pointsAttribute(points: readonly Point[]) {
  return points
    .map(
      ([x, y]) => `${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`,
    )
    .join(" ");
}

export function matrixAttribute(m: Matrix) {
  return `matrix(${m.map((value) => Math.round(value * 10000) / 10000).join(" ")})`;
}
