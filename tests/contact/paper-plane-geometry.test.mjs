import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LAYER_ORDER,
  LAYER_POINTS,
  POINTS,
  SHEET_HEIGHT,
  SHEET_WIDTH,
  TIMING,
  cubicBezier,
  flightPath,
  foldMatrix,
  foldPoint,
  letterGridScale,
  pose,
  successBudget,
} from "../../src/components/contact/paper-plane/geometry.ts";

const layout = {
  left: -350,
  top: -300,
  right: 350,
  bottom: 300,
  gridScale: letterGridScale(700, 600),
};
const close = (actual, expected, message) =>
  assert.ok(
    Math.abs(actual - expected) < 1e-3,
    `${message}: ${actual} ≠ ${expected}`,
  );

test("every layer keeps the same number of points in every pose", () => {
  for (let p = 0; p <= 5; p += 0.05)
    for (const id of LAYER_ORDER)
      assert.equal(
        pose(p, layout).layers[id].points.length,
        LAYER_POINTS[id],
        `${id} at ${p.toFixed(2)}`,
      );
  for (let p = 0; p <= 1; p += 0.05)
    assert.equal(pose(p, layout).sheet.points.length, 4);
});

test("the shrink starts on the form block and ends on the letter sheet", () => {
  const start = pose(0, layout).sheet;
  assert.deepEqual(start.points, [
    [-350, -300],
    [350, -300],
    [350, 300],
    [-350, 300],
  ]);
  assert.equal(start.edge, 0);
  assert.deepEqual(start.grid, [1, 0, 0, 1, 0, 0]);
  const end = pose(0.999999, layout).sheet;
  close(end.points[2][0], SHEET_WIDTH / 2, "letter width");
  close(end.points[2][1], SHEET_HEIGHT / 2, "letter height");
  // 700 × 600 crops to 450 × 600, then scales to 180 × 240.
  close(layout.gridScale, 0.4, "grid scale");
});

test("the halves take over from the sheet at the start of fold 1", () => {
  const at = pose(1, layout);
  assert.equal(at.sheet.visible, false);
  assert.equal(at.layers["L.base"].visible, true);
  assert.equal(at.layers["L.flap1"].back, false);
  // Unfolded, flap 1 is still the corner it is about to lift.
  assert.deepEqual(at.layers["L.flap1"].points[1], POINTS.TL);
});

test("each fold lands on its reflection and turns its face at edge-on", () => {
  const { N, TL, E1, C1, E2, C2 } = POINTS;
  const fold1 = pose(1.999999, layout).layers["L.flap1"];
  close(fold1.points[1][0], C1[0], "corner x");
  close(fold1.points[1][1], C1[1], "corner y");
  assert.equal(pose(1.49, layout).layers["L.flap1"].back, false);
  assert.equal(pose(1.5, layout).layers["L.flap1"].back, true);

  const fold2 = pose(2.999999, layout).layers["L.flap2"];
  close(fold2.points[1][0], C2[0], "fold 2 x");
  close(fold2.points[1][1], C2[1], "fold 2 y");
  // The edge N–E1 lies on the centre line after fold 2: |N C2| = |N E1|.
  close(
    Math.hypot(C2[0] - N[0], C2[1] - N[1]),
    Math.hypot(E1[0] - N[0], E1[1] - N[1]),
    "edge length",
  );
  assert.ok(E2[1] > 90 && E2[1] < 100, "fold 2 ends near the bottom");
  assert.ok(TL[0] < 0);
});

test("the fold matrix moves the grid exactly like the layer's points", () => {
  const hinge = { a: POINTS.N, n: [Math.SQRT1_2, Math.SQRT1_2] };
  for (const f of [0, 0.3, 0.5, 1]) {
    const [a, b, c, d, e, g] = foldMatrix(hinge, f);
    for (const point of [POINTS.TL, POINTS.E2, [13, 57]]) {
      const moved = foldPoint(point, hinge, f);
      close(a * point[0] + c * point[1] + e, moved[0], `x at ${f}`);
      close(b * point[0] + d * point[1] + g, moved[1], `y at ${f}`);
    }
  }
});

test("fold 3 hides the right half behind the left", () => {
  assert.equal(pose(3.4, layout).layers["R.base"].visible, true);
  assert.equal(pose(3.5, layout).layers["R.base"].visible, false);
  assert.equal(pose(4.5, layout).layers["R.base"].visible, false);
  // The visible half is moved back to the middle.
  close(pose(4, layout).translate[0], 45, "half recentred");
});

test("the folded plane points along the launch heading", () => {
  assert.equal(pose(5, layout).rotate, 55);
  assert.equal(pose(0, layout).rotate, 0);
});

test("the success card is fully in within the 2.2 s budget", () => {
  assert.ok(successBudget() <= 2200, `${successBudget()} ms`);
});

test("the flight leaves the viewport up and to the right", () => {
  const viewport = { width: 390, height: 844 };
  const start = [195, 450];
  const flight = flightPath({ start, viewport });
  const keys = flight.x.length;
  for (const track of [flight.y, flight.rotate, flight.scale, flight.times])
    assert.equal(track.length, keys);
  assert.equal(flight.duration, TIMING.anticipation + TIMING.throw);
  // Wind-up: back and down, nose up.
  assert.ok(flight.x[1] < 0 && flight.y[1] > 0 && flight.rotate[1] < 0);
  const endX = start[0] + flight.x[keys - 1];
  const endY = start[1] + flight.y[keys - 1];
  assert.ok(endX > viewport.width && endY < 0, `ends at ${endX}, ${endY}`);
  assert.ok(flight.scale[keys - 1] < flight.scale[0]);
  for (let i = 1; i < keys; i++) {
    assert.ok(flight.times[i] > flight.times[i - 1], "times increase");
    assert.ok(
      flight.trailLength[i] >= flight.trailLength[i - 1],
      "trail only grows",
    );
    assert.ok(
      Math.abs(flight.rotate[i] - flight.rotate[i - 1]) < 90,
      "no spin between keys",
    );
  }
  assert.ok(
    flight.trailLength[keys - 1] < 1 && flight.trailLength[keys - 1] > 0.9,
  );
});

test("cubicBezier matches the curve's end points and monotony", () => {
  const ease = cubicBezier([0.23, 1, 0.32, 1]);
  assert.equal(ease(0), 0);
  assert.equal(ease(1), 1);
  let previous = 0;
  for (let x = 0.05; x < 1; x += 0.05) {
    const y = ease(x);
    assert.ok(y >= previous, `monotonic at ${x}`);
    previous = y;
  }
  // A strong ease-out is past half way well before half the time.
  assert.ok(ease(0.2) > 0.5);
});

test("the wind-up is eased and every other flight segment is linear", () => {
  const flight = flightPath({
    start: [700, 500],
    viewport: { width: 1440, height: 900 },
  });
  assert.equal(flight.ease.length, flight.times.length - 1);
  assert.notEqual(flight.ease[0], "linear");
  assert.ok(flight.ease.slice(1).every((ease) => ease === "linear"));
});
