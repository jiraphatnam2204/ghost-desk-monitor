import { pathOf, type Point3 } from "@/components/iso/iso-kit";
import type { DeskState } from "@/lib/session";
import { PRISM_R, PRISM_X0, PRISM_X1, PRISM_Y, PRISM_Z, VIEW, at } from "./view";

// The three printed faces, in the order the servo reaches them: 0°, 120°, 240°.
export const FACES: DeskState[] = ["inUse", "away", "free"];

const LIGHT: Point3 = (() => {
  const v: Point3 = [-0.35, 0.45, 0.82];
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

// Normal angle (in the y–z plane) that points at the viewer.
const FRONT = Math.atan2(VIEW[2], VIEW[1]);
const INSET = 2.2;

export interface FaceFrame {
  state: DeskState;
  d: string;
  print: string;
  shade: number;
  visible: boolean;
}

const pointAt = (x: number, angle: number, r = PRISM_R): Point3 => [x, PRISM_Y + r * Math.cos(angle), PRISM_Z + r * Math.sin(angle)];

// servoDegrees: 0 shows "in use", 120 "away", 240 "free". The prism turns the other way round.
export function prismFrame(servoDegrees: number) {
  const turn = (-servoDegrees * Math.PI) / 180;
  const faces: FaceFrame[] = FACES.map((state, index) => {
    const normal = FRONT + turn + (index * 2 * Math.PI) / 3;
    const half = Math.PI / 3;
    const a = normal - half;
    const b = normal + half;
    const n: Point3 = [0, Math.cos(normal), Math.sin(normal)];
    const facing = n[1] * VIEW[1] + n[2] * VIEW[2];
    const lit = Math.max(0, n[1] * LIGHT[1] + n[2] * LIGHT[2]);
    const corners = [pointAt(PRISM_X0, a), pointAt(PRISM_X1, a), pointAt(PRISM_X1, b), pointAt(PRISM_X0, b)];
    // The printed panel, inset from the face edges.
    const apothem = PRISM_R * Math.cos(half);
    const reach = PRISM_R * Math.sin(half) - INSET;
    const mid = (x: number, s: number): Point3 => [x, PRISM_Y + apothem * Math.cos(normal) - s * Math.sin(normal), PRISM_Z + apothem * Math.sin(normal) + s * Math.cos(normal)];
    const print = pathOf([mid(PRISM_X0 + INSET, -reach), mid(PRISM_X1 - INSET, -reach), mid(PRISM_X1 - INSET, reach), mid(PRISM_X0 + INSET, reach)].map(at), true);
    return {
      state,
      d: pathOf(corners.map(at), true),
      print,
      shade: Math.round((1 - lit) * 100) / 100,
      visible: facing > 1e-3,
    };
  });
  // Silhouette: the hull of both end triangles.
  const ends = [0, 1, 2].flatMap((index) => {
    const angle = FRONT + turn + (index * 2 * Math.PI) / 3 + Math.PI / 3;
    return [at(pointAt(PRISM_X0, angle)), at(pointAt(PRISM_X1, angle))];
  });
  const edges = faces
    .filter((face) => face.visible)
    .map((face) => face.d)
    .join("");
  return { faces, outline: pathOf(hull(ends), true), edges };
}

function hull(points: [number, number][]) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (const p of [...sorted].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
