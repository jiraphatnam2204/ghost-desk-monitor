import {
  boxCorners,
  corners,
  cylinder,
  depthOf,
  fitProjection,
  insetPlan,
  iso,
  onTop,
  pathOf,
  planOutline,
  ring,
  sideRing,
  sideSeam,
  slabOf,
  type Flat,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";
import type { DeskState } from "@/lib/session";
import type { Link } from "@/lib/signal-path";

// A diorama of one corner of the reading room, in centimetres: one desk with its sensor node,
// a chair, the gateway and Wi-Fi router on a cabinet, the librarian's counter with the dashboard,
// and the owner's phone on a stand.
export const WIDTH = 760;
export const HEIGHT = 500;
export const AZIMUTH = 40;

export const BASE: Plan = { x: -96, y: -86, w: 420, d: 212, r: 8 };
const BASE_H = 7;

// Desk: top 72–76, a back panel, a front apron that carries the radar.
export const DESK: Plan = { x: -70, y: -40, w: 140, d: 65, r: 1.2 };
const DESK_TOP = 72;
export const TOP = 76;
const APRON: Plan = { x: -58, y: 21.6, w: 116, d: 2.4, r: 0.4 };
const APRON_FACE = APRON.y + APRON.d;
// right of the seat on the apron, so it stays in view; its ±60° field still covers the chair
const RADAR_X = 50;
const RADAR: Plan = { x: RADAR_X - 8, y: APRON_FACE, w: 16, d: 1.2, r: 0.3 };
const RADAR_FACE = RADAR.y + RADAR.d;

// Sign: plinth, two cheeks, the prism between them and the servo outside the right cheek.
const PLINTH: Plan = { x: -8, y: -37, w: 54, d: 20, r: 1.2 };
const PLINTH_TOP = TOP + 3;
const CHEEK_L: Plan = { x: -4, y: -33, w: 3.4, d: 12, r: 0.6 };
const CHEEK_R: Plan = { x: 34.6, y: -33, w: 3.4, d: 12, r: 0.6 };
const PRISM_X0 = CHEEK_L.x + CHEEK_L.w;
const PRISM_X1 = CHEEK_R.x;
const PRISM_Y = -27;
const PRISM_Z = PLINTH_TOP + 12;
const PRISM_R = 7.2;
const SERVO: Plan = { x: 38, y: -32.5, w: 6, d: 11, r: 0.6 };

// Mast clamped to the back-left corner, arm, camera head looking down at the desk.
const MAST: [number, number] = [-62, -37];
const ARM_Z = 150;
const HEAD: Plan = { x: -36, y: -42, w: 24, d: 12, r: 1.2 };
const HEAD_Z = 137;
const HEAD_FACE = HEAD.y + HEAD.d;
export const LENS_AT: Point3 = [-27, HEAD_FACE + 1.6, 143];

// Chair, facing the desk.
const SIT = 24; // the chair and the person sit right of the desk's middle, clear of the radar
const SEAT: Plan = { x: -22 + SIT, y: 34, w: 44, d: 42, r: 2 };
const SEAT_Z = 44;
const CHAIR_BACK: Plan = { x: -20 + SIT, y: 76, w: 40, d: 3, r: 0.8 };
const CHAIR_BACK_Z = 66;

// Cabinet with the gateway and router on top.
const CABINET: Plan = { x: 118, y: -64, w: 76, d: 46, r: 1 };
const CABINET_TOP = 85;
const CABINET_FACE = CABINET.y + CABINET.d;
const GATEWAY: Plan = { x: 126, y: -52, w: 28, d: 17, r: 1.4 };
const GATEWAY_TOP = CABINET_TOP + 10;
const ROUTER: Plan = { x: 162, y: -57, w: 25, d: 16, r: 1.6 };
const ROUTER_TOP = CABINET_TOP + 4.5;

// A partition wall behind the cabinet carries the room's dashboard screen and a socket.
const WALL: Plan = { x: 100, y: -82, w: 224, d: 4, r: 0.4 };
const WALL_TOP = 162;
const WALL_FACE = WALL.y + WALL.d;
const PANEL: Plan = { x: 210, y: WALL_FACE + 1.6, w: 84, d: 3.4, r: 0.8 };
const PANEL_Z = 102;
const PANEL_TOP = 148;
const PANEL_FACE = PANEL.y + PANEL.d;
const SOCKET: Plan = { x: 122, y: WALL_FACE, w: 9, d: 0.8, r: 0.4 };

// The owner's phone on a stand at the front left: it is wherever the owner went.
const STAND: Plan = { x: -86, y: 90, w: 24, d: 15, r: 2 };
const PHONE: Plan = { x: -81, y: 97, w: 14, d: 1.6, r: 0.5 };
const PHONE_Z = 3.2;
const PHONE_TOP = 32;
const PHONE_FACE = PHONE.y + PHONE.d;

// Where the radio links start and end (antenna tips, the monitor, the phone).
const NODE_ANT: Point3 = [-14, -36, 152.6];
const GATEWAY_ANT: Point3 = [150, -40, 110];
const ROUTER_ANT: Point3 = [183, -54, 114];
const SCREEN_AT: Point3 = [252, PANEL.y + 1.7, PANEL_TOP];
const PHONE_AT: Point3 = [-74, PHONE.y + 0.8, PHONE_TOP];

export const P = fitProjection(
  [...boxCorners(BASE, -BASE_H - 5, 0), [-62, -42, 160], [60, 30, 168], ...boxCorners(WALL, 0, WALL_TOP), [215, 20, 190]],
  WIDTH,
  HEIGHT,
  { pad: 18, azimuth: AZIMUTH },
);

export const at = (point: Point3) => iso(point, P);
const slab = (plan: Plan, z: number, h: number, steps = 3, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
const round = (x: number, y: number, r: number, z: number, h: number, steps = 24, bevel = 0) => cylinder(x, y, r, z, h, P, steps, bevel);
const seg = (a: Point3, b: Point3) => pathOf([at(a), at(b)]);
const join = (paths: string[]) => paths.filter(Boolean).join("");
const byDepth = <T>(list: T[], of: (item: T) => Point3) => [...list].sort((a, b) => depthOf(of(a), P) - depthOf(of(b), P));

// A closed quad on a face that faces +y (y fixed).
const quadY = (y: number, x0: number, z0: number, x1: number, z1: number) => pathOf([at([x0, y, z0]), at([x1, y, z0]), at([x1, y, z1]), at([x0, y, z1])], true);
// The same on a face that faces +x.
const quadX = (x: number, y0: number, z0: number, y1: number, z1: number) => pathOf([at([x, y0, z0]), at([x, y1, z0]), at([x, y1, z1]), at([x, y0, z1])], true);

/* ---------- base ---------- */

const GROOVE = insetPlan(BASE, 6);
const LABEL: Plan = { x: 150, y: BASE.y + BASE.d - 14, w: 84, d: 8, r: 1 };

function tileSeams() {
  const lines: string[] = [];
  for (let x = -80; x < GROOVE.x + GROOVE.w; x += 40)
    if (x > GROOVE.x + 1)
      lines.push(
        onTop(
          [
            [x, GROOVE.y],
            [x, GROOVE.y + GROOVE.d],
          ],
          0,
          P,
        ),
      );
  for (let y = -40; y < GROOVE.y + GROOVE.d; y += 40)
    if (y > GROOVE.y + 1)
      lines.push(
        onTop(
          [
            [GROOVE.x, y],
            [GROOVE.x + GROOVE.w, y],
          ],
          0,
          P,
        ),
      );
  return join(lines);
}

export const BASE_ART = {
  halo: slab(BASE, -BASE_H - 5, BASE_H).fill,
  feet: byDepth(corners(BASE, 22), ([x, y]) => [x, y, 0]).map(([x, y]) => [round(x, y, 7, -BASE_H - 5, 1.4, 28), round(x, y, 5.6, -BASE_H - 3.6, 3.6, 28)]),
  plate: slab(BASE, -BASE_H, BASE_H, 8, 1.6),
  groove: planOutline(GROOVE, 0, P, 6),
  seams: tileSeams(),
  screws: corners(BASE, 10).map(([x, y]) => at([x, y, 0])),
  screwRings: join(corners(BASE, 10).map(([x, y]) => ring(x, y, 2.4, 0, P, 16))),
  label: slab(LABEL, 0, 0.8, 3),
  labelLines: join(
    [2.4, 4, 5.6].map((y) =>
      onTop(
        [
          [LABEL.x + 4, LABEL.y + y],
          [LABEL.x + (y === 2.4 ? 60 : 44), LABEL.y + y],
        ],
        0.8,
        P,
      ),
    ),
  ),
  labelScrews: [at([LABEL.x + 2, LABEL.y + 4, 0.8]), at([LABEL.x + LABEL.w - 2, LABEL.y + 4, 0.8])],
};

/* ---------- desk ---------- */

const LEG = 4.4;
const legAt = ([x, y]: [number, number]) => slab({ x: x - LEG / 2, y: y - LEG / 2, w: LEG, d: LEG, r: 0.4 }, 0, DESK_TOP, 2);
const DESK_LEGS = corners(DESK, 4.6) as [number, number][];
const BACK_LEGS = DESK_LEGS.filter(([, y]) => y < 0);
const FRONT_LEGS = DESK_LEGS.filter(([, y]) => y > 0);

export const DESK_ART = {
  backLegs: byDepth(BACK_LEGS, ([x, y]) => [x, y, 0]).map(legAt),
  frontLegs: byDepth(FRONT_LEGS, ([x, y]) => [x, y, 0]).map(legAt),
  glides: DESK_LEGS.map(([x, y]) => at([x, y, 0.4])),
  panel: slab({ x: -64, y: -37, w: 128, d: 1.8, r: 0.3 }, 30, DESK_TOP - 30, 2),
  panelSeam: seg([-64, -35.2, 46], [64, -35.2, 46]),
  apron: slab(APRON, 62, DESK_TOP - 62, 2),
  top: slab(DESK, DESK_TOP, TOP - DESK_TOP, 4, 0.8),
  topSeam: sideSeam(DESK, DESK_TOP + 1.4, P, 4),
  // a cable grommet the node's lead drops through
  grommet: [ring(-46, -30, 3.2, TOP, P, 24), ring(-46, -30, 2, TOP, P, 20)].join(""),
  // an open book where the hands rest
  book: slab({ x: SIT - 16, y: -6, w: 32, d: 22, r: 0.5 }, TOP, 1.6, 2),
  bookSpine: onTop(
    [
      [SIT, -5.4],
      [SIT, 15.4],
    ],
    TOP + 1.6,
    P,
  ),
  bookLines: join(
    [-2, 1, 4, 7, 10].flatMap((y) => [
      onTop(
        [
          [SIT - 13, y],
          [SIT - 3, y],
        ],
        TOP + 1.6,
        P,
      ),
      onTop(
        [
          [SIT + 3, y],
          [SIT + 13, y],
        ],
        TOP + 1.6,
        P,
      ),
    ]),
  ),
};

/* ---------- the sensor node ---------- */

export const RADAR_ART = {
  board: slab(RADAR, 63.4, 7.4, 2),
  // two receive patches and one transmit patch, etched on the face
  patches: join([-5.2, -1.4, 3.6].map((x) => quadY(RADAR_FACE + 0.05, RADAR_X + x, 65.2, RADAR_X + x + 2.4, 68.8))),
  pins: [-6, -4.4, -2.8, -1.2, 0.4].map((x) => at([RADAR_X + x, RADAR_FACE, 64.4])),
};

// Radar wavefronts in a level plane at the board's height, fanned toward the seat: arcs that fade out at both ends.
export const RADAR_WAVES: Flat[][] = [7, 14, 21].map((r) =>
  Array.from({ length: 25 }, (_, index) => {
    const a = ((-80 + (index / 24) * 100) * Math.PI) / 180;
    return at([RADAR_X + r * Math.sin(a), RADAR_FACE + r * Math.cos(a), 67]);
  }),
);

export const SIGN_ART = {
  plinth: slab(PLINTH, TOP, PLINTH_TOP - TOP, 3, 0.5),
  plinthScrews: corners(PLINTH, 2.4).map(([x, y]) => at([x, y, PLINTH_TOP])),
  cheekL: slab(CHEEK_L, PLINTH_TOP, PRISM_Z + 8.4 - PLINTH_TOP, 2, 0.3),
  cheekR: slab(CHEEK_R, PLINTH_TOP, PRISM_Z + 8.4 - PLINTH_TOP, 2, 0.3),
  bossL: sideRing([PRISM_X0, PRISM_Y, PRISM_Z], 2, "x", P, 20),
  shaft: sideRing([CHEEK_R.x + CHEEK_R.w, PRISM_Y, PRISM_Z], 1.4, "x", P, 16),
  servo: slab(SERVO, PRISM_Z - 6, 12, 2, 0.3),
  servoEars: slab({ x: SERVO.x, y: SERVO.y - 2.4, w: SERVO.w, d: SERVO.d + 4.8, r: 0.3 }, PRISM_Z + 2.6, 1.2, 2),
  servoLabel: quadX(SERVO.x + SERVO.w + 0.05, SERVO.y + 2, PRISM_Z - 3.6, SERVO.y + SERVO.d - 2, PRISM_Z + 0.6),
  stand: slab({ x: SERVO.x - 0.4, y: SERVO.y + 1.5, w: 6.8, d: 8, r: 0.4 }, PLINTH_TOP, PRISM_Z - 6 - PLINTH_TOP, 2),
  // the 1000 µF capacitor beside the servo
  cap: round(50, -24, 2.6, PLINTH_TOP, 8.4, 20, 0.4),
  capBand: ring(50, -24, 2.6, PLINTH_TOP + 6.6, P, 20),
  capTop: [ring(50, -24, 1.2, PLINTH_TOP + 8.4, P, 12)].join(""),
};

const LIGHT: Point3 = (() => {
  const v: Point3 = [-0.35, 0.45, 0.82];
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
})();
const A = (AZIMUTH * Math.PI) / 180;
const E = (30 * Math.PI) / 180;
const VIEW: Point3 = [Math.cos(A) * Math.cos(E), Math.sin(A) * Math.cos(E), Math.sin(E)];
const FRONT = Math.atan2(VIEW[2], VIEW[1]);
export const FACES: DeskState[] = ["inUse", "away", "free"];
const prismPoint = (x: number, angle: number, r = PRISM_R): Point3 => [x, PRISM_Y + r * Math.cos(angle), PRISM_Z + r * Math.sin(angle)];

// The prism at a servo angle: 0° shows "in use", 120° "away", 240° "free".
export function prismFrame(servoDegrees: number) {
  const turn = (-servoDegrees * Math.PI) / 180;
  const half = Math.PI / 3;
  const faces = FACES.map((state, index) => {
    const normal = FRONT + turn + (index * 2 * Math.PI) / 3;
    const facing = Math.cos(normal) * VIEW[1] + Math.sin(normal) * VIEW[2];
    const lit = Math.max(0, Math.cos(normal) * LIGHT[1] + Math.sin(normal) * LIGHT[2]);
    const a = normal - half;
    const b = normal + half;
    const apothem = PRISM_R * Math.cos(half);
    const reach = PRISM_R * Math.sin(half) - 1.2;
    const mid = (x: number, s: number): Point3 => [
      x,
      PRISM_Y + apothem * Math.cos(normal) - s * Math.sin(normal),
      PRISM_Z + apothem * Math.sin(normal) + s * Math.cos(normal),
    ];
    return {
      state,
      d: pathOf([prismPoint(PRISM_X0, a), prismPoint(PRISM_X1, a), prismPoint(PRISM_X1, b), prismPoint(PRISM_X0, b)].map(at), true),
      print: pathOf([mid(PRISM_X0 + 1.2, -reach), mid(PRISM_X1 - 1.2, -reach), mid(PRISM_X1 - 1.2, reach), mid(PRISM_X0 + 1.2, reach)].map(at), true),
      shade: Math.round((1 - lit) * 100) / 100,
      visible: facing > 1e-3,
    };
  });
  const ends = [0, 1, 2].flatMap((index) => {
    const angle = FRONT + turn + (index * 2 * Math.PI) / 3 + half;
    return [at(prismPoint(PRISM_X0, angle)), at(prismPoint(PRISM_X1, angle))];
  });
  return { faces, outline: pathOf(hull(ends), true) };
}

function hull(points: Flat[]) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Flat[]) => {
    const out: Flat[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    return out.slice(0, -1);
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}

export const MAST_ART = {
  clamp: slab({ x: MAST[0] - 5, y: DESK.y - 1.8, w: 10, d: 9, r: 0.8 }, DESK_TOP - 6, 13, 2, 0.4),
  clampScrew: round(MAST[0], DESK.y + 3, 1.6, DESK_TOP - 9, 3, 14),
  mast: round(MAST[0], MAST[1], 1.6, TOP + 1, ARM_Z - TOP - 1, 18),
  collar: round(MAST[0], MAST[1], 2.4, ARM_Z - 4, 4, 20, 0.3),
  arm: slab({ x: MAST[0] - 2, y: -39, w: 44, d: 4, r: 0.8 }, ARM_Z - 1, 3, 2, 0.3),
  hanger: slab({ x: -27, y: -38.6, w: 4, d: 3.2, r: 0.3 }, HEAD_Z + 12, ARM_Z - 1 - HEAD_Z - 12, 2),
  head: slab(HEAD, HEAD_Z, 12, 3, 0.6),
  headSeam: sideSeam(HEAD, HEAD_Z + 6, P, 3),
  lens: [sideRing(LENS_AT, 3, "y", P, 24), sideRing(LENS_AT, 1.8, "y", P, 20)].join(""),
  lensHood: quadY(HEAD_FACE + 0.05, -31.4, 138.6, -22.6, 147.4),
  tof: slab({ x: -18, y: HEAD_FACE, w: 5, d: 1, r: 0.2 }, 141, 5, 2),
  tofEye: [at([-15.5, HEAD_FACE + 1, 143.5])],
  antenna: round(NODE_ANT[0], NODE_ANT[1], 0.9, HEAD_Z + 12, NODE_ANT[2] - HEAD_Z - 12, 12),
  led: [at([-34.2, HEAD_FACE, 139.4])],
  // the lead from the head down the mast to the grommet
  lead: pathOf([at([-36, -38, 143]), at([-60, -38, 143]), at([-60, -38, 78]), at([-46, -32, 76.4])]),
};

// What the camera and the VL53L1X look at: a patch of the desk in front of the seat.
const VIEW_PATCH: Plan = { x: -62, y: -14, w: 104, d: 37, r: 0 };
export const VIEW_ART = {
  patch: planOutline(VIEW_PATCH, TOP + 0.1, P, 1),
  rays: join(corners(VIEW_PATCH, 0).map(([x, y]) => seg(LENS_AT, [x, y, TOP + 0.1]))),
  ends: corners(VIEW_PATCH, 0).map(([x, y]) => at([x, y, TOP + 0.1])),
};

/* ---------- bag ---------- */

const BAG: Plan = { x: -58, y: -12, w: 27, d: 15, r: 3 };
export const BAG_ART = {
  body: slab(BAG, TOP, 18, 5, 0.6),
  flap: slab({ x: BAG.x + 1, y: BAG.y + BAG.d - 1, w: BAG.w - 2, d: 1.4, r: 0.4 }, TOP + 8, 10.4, 2),
  buckle: [at([BAG.x + BAG.w / 2, BAG.y + BAG.d + 0.4, TOP + 10])],
  seam: sideSeam(BAG, TOP + 4, P, 5),
  strap: pathOf(
    Array.from({ length: 17 }, (_, index) => {
      const t = (index / 16) * Math.PI;
      return at([BAG.x + 5 + (BAG.w - 10) * (index / 16), BAG.y + BAG.d / 2, TOP + 18 + 7 * Math.sin(t)]);
    }),
  ),
};

/* ---------- chair ---------- */

const CHAIR_LEGS = corners(SEAT, 2.6) as [number, number][];
const chairLeg = ([x, y]: [number, number]) => round(x, y, 1.4, 0, SEAT_Z, 14);
export const CHAIR_ART = {
  legs: byDepth(CHAIR_LEGS, ([x, y]) => [x, y, 0]).map(chairLeg),
  rail: slab({ x: SEAT.x + 2, y: SEAT.y + 2, w: SEAT.w - 4, d: SEAT.d - 4, r: 1 }, SEAT_Z - 5, 3, 2),
  seat: slab(SEAT, SEAT_Z, 4, 6, 1),
  posts: byDepth([SEAT.x + 3, SEAT.x + SEAT.w - 3], (x) => [x, CHAIR_BACK.y + 1.5, 0]).map((x) =>
    round(x, CHAIR_BACK.y + 1.5, 1.4, SEAT_Z + 4, CHAIR_BACK_Z - SEAT_Z - 2, 14),
  ),
  back: slab(CHAIR_BACK, CHAIR_BACK_Z, 12, 3, 0.6),
  backSeam: sideSeam(CHAIR_BACK, CHAIR_BACK_Z + 6, P, 3),
};

/* ---------- the person: a jointed drawing mannequin ---------- */

const limb = (x: number, y: number, w: number, d: number, z: number, h: number) => slab({ x, y, w, d, r: Math.min(w, d) / 2.4 }, z, h, 4, 0.6);
export const PERSON_ART = {
  feet: [limb(-14.5 + SIT, 15, 10, 15, 0, 5), limb(4.5 + SIT, 15, 10, 15, 0, 5)],
  shins: [limb(-14 + SIT, 22, 9, 9, 5, 39), limb(5 + SIT, 22, 9, 9, 5, 39)],
  knees: [round(-9.5 + SIT, 26.5, 4.6, 44, 3, 20, 0.6), round(9.5 + SIT, 26.5, 4.6, 44, 3, 20, 0.6)],
  thighs: [limb(-15 + SIT, 22, 11, 44, SEAT_Z + 4, 11), limb(4 + SIT, 22, 11, 44, SEAT_Z + 4, 11)],
  hips: limb(-17 + SIT, 52, 34, 20, SEAT_Z + 4, 14),
  belly: limb(-14 + SIT, 56, 28, 15, SEAT_Z + 18, 20),
  chest: limb(-18 + SIT, 54, 36, 19, SEAT_Z + 38, 24),
  // left arm (far side) and right arm (near side): upper arm, elbow, forearm on the desk
  upperL: limb(-26 + SIT, 55, 8, 9, 82, 22),
  upperR: limb(18 + SIT, 55, 8, 9, 82, 22),
  elbowL: round(-22 + SIT, 55.5, 4, TOP + 0.5, 6, 18, 0.5),
  elbowR: round(22 + SIT, 55.5, 4, TOP + 0.5, 6, 18, 0.5),
  foreL: limb(-25.5 + SIT, 6, 7, 50, TOP + 1.6, 5.6),
  foreR: limb(18.5 + SIT, 6, 7, 50, TOP + 1.6, 5.6),
  handL: limb(-24 + SIT, 0, 6, 8, TOP + 1.6, 3.4),
  handR: limb(18 + SIT, 0, 6, 8, TOP + 1.6, 3.4),
  neck: round(0 + SIT, 63, 3.8, SEAT_Z + 62, 7, 20),
  head: round(0 + SIT, 63, 8.4, SEAT_Z + 69, 16, 32, 5.5),
  headRing: ring(0 + SIT, 63, 8.4, SEAT_Z + 75, P, 32),
  joints: [at([-20 + SIT, 55, 104]), at([20 + SIT, 64, 104])],
};

/* ---------- cabinet, gateway, router ---------- */

export const CABINET_ART = {
  kick: slab(
    {
      x: CABINET.x + 3,
      y: CABINET.y + 3,
      w: CABINET.w - 6,
      d: CABINET.d - 4,
      r: 0.4,
    },
    0,
    6,
    2,
  ),
  body: slab(CABINET, 6, CABINET_TOP - 9, 2),
  top: slab(
    {
      x: CABINET.x - 1.6,
      y: CABINET.y - 1.6,
      w: CABINET.w + 3.2,
      d: CABINET.d + 3.2,
      r: 1.2,
    },
    CABINET_TOP - 3,
    3,
    3,
    0.6,
  ),
  drawers: join([10, 44].map((z) => quadY(CABINET_FACE + 0.05, CABINET.x + 3, z, CABINET.x + CABINET.w - 3, z + 30))),
  handles: [27, 61].map((z) =>
    slab(
      {
        x: CABINET.x + CABINET.w / 2 - 9,
        y: CABINET_FACE,
        w: 18,
        d: 1.6,
        r: 0.6,
      },
      z + 14,
      2.2,
      2,
    ),
  ),
  labels: join([27, 61].map((z) => quadY(CABINET_FACE + 0.05, CABINET.x + CABINET.w / 2 - 6, z + 18, CABINET.x + CABINET.w / 2 + 6, z + 22.6))),
  // the gateway's USB lead across the top to the charger in the wall socket
  cable: pathOf([
    at([GATEWAY.x + 4, GATEWAY.y, CABINET_TOP + 2.4]),
    at([GATEWAY.x + 4, GATEWAY.y - 5, CABINET_TOP + 0.6]),
    at([SOCKET.x + 4.5, GATEWAY.y - 5, CABINET_TOP + 0.6]),
    at([SOCKET.x + 4.5, WALL_FACE + 4, CABINET_TOP + 6]),
    at([SOCKET.x + 4.5, WALL_FACE + 3, CABINET_TOP + 12]),
  ]),
  cableEnds: [at([GATEWAY.x + 4, GATEWAY.y, CABINET_TOP + 2.4])],
};

export const GATEWAY_ART = {
  box: slab(GATEWAY, CABINET_TOP, GATEWAY_TOP - CABINET_TOP, 3, 0.6),
  lid: sideSeam(GATEWAY, GATEWAY_TOP - 2.4, P, 3),
  vents: join(
    [0, 1, 2, 3, 4].map((index) =>
      quadY(GATEWAY.y + GATEWAY.d + 0.05, GATEWAY.x + 4 + index * 3.6, CABINET_TOP + 2.4, GATEWAY.x + 5.6 + index * 3.6, CABINET_TOP + 6),
    ),
  ),
  sideVents: join(
    [0, 1, 2].map((index) =>
      quadX(GATEWAY.x + GATEWAY.w + 0.05, GATEWAY.y + 3 + index * 3.8, CABINET_TOP + 2.4, GATEWAY.y + 4.6 + index * 3.8, CABINET_TOP + 6),
    ),
  ),
  feet: corners(GATEWAY, 2.4).map(([x, y]) => at([x, y, CABINET_TOP])),
  screws: corners(GATEWAY, 2.2).map(([x, y]) => at([x, y, GATEWAY_TOP])),
  led: [at([GATEWAY.x + 24, GATEWAY.y + GATEWAY.d, CABINET_TOP + 4.2])],
  antennaBase: round(GATEWAY_ANT[0], GATEWAY_ANT[1], 1.8, GATEWAY_TOP, 2.4, 18, 0.3),
  antenna: round(GATEWAY_ANT[0], GATEWAY_ANT[1], 1, GATEWAY_TOP + 2.4, GATEWAY_ANT[2] - GATEWAY_TOP - 2.4, 14),
};

export const ROUTER_ART = {
  box: slab(ROUTER, CABINET_TOP, ROUTER_TOP - CABINET_TOP, 4, 1),
  grille: join(
    [3, 6, 9, 12].map((y) =>
      onTop(
        [
          [ROUTER.x + 5, ROUTER.y + y],
          [ROUTER.x + ROUTER.w - 9, ROUTER.y + y],
        ],
        ROUTER_TOP,
        P,
      ),
    ),
  ),
  leds: [0, 1, 2, 3].map((index) => at([ROUTER.x + 6 + index * 3.4, ROUTER.y + ROUTER.d, CABINET_TOP + 2.4])),
  antennas: [ROUTER.x + 4, ROUTER_ANT[0]].map((x) => round(x, ROUTER_ANT[1], 1.1, ROUTER_TOP - 1, ROUTER_ANT[2] - ROUTER_TOP + 1, 14, 0.4)),
  hinges: [ROUTER.x + 4, ROUTER_ANT[0]].map((x) => round(x, ROUTER_ANT[1], 1.8, ROUTER_TOP - 1, 3, 16, 0.3)),
};

/* ---------- partition wall, socket and the dashboard screen ---------- */

export const WALL_ART = {
  wall: slab(WALL, 0, WALL_TOP, 2),
  skirting: slab({ x: WALL.x, y: WALL_FACE, w: WALL.w, d: 1.4, r: 0.2 }, 0, 8, 2),
  cap: slab(
    {
      x: WALL.x - 0.8,
      y: WALL.y - 0.8,
      w: WALL.w + 1.6,
      d: WALL.d + 1.6,
      r: 0.4,
    },
    WALL_TOP,
    2.4,
    2,
  ),
  // panel joints of the partition, floor to cap
  joints: join([156, 212, 268].map((x) => seg([x, WALL_FACE + 0.05, 8], [x, WALL_FACE + 0.05, WALL_TOP]))),
  socket: slab(SOCKET, CABINET_TOP + 8, 9, 2, 0.2),
  plug: slab({ x: SOCKET.x + 1.6, y: SOCKET.y + SOCKET.d, w: 5.8, d: 3.6, r: 0.6 }, CABINET_TOP + 10, 5, 2, 0.3),
  // the wall bracket's two arms show under the screen
  bracket: slab({ x: 246, y: WALL_FACE, w: 12, d: 1.6, r: 0.3 }, PANEL_Z - 3, 4, 2),
  panel: slab(PANEL, PANEL_Z, PANEL_TOP - PANEL_Z, 2, 0.5),
  screen: quadY(PANEL_FACE + 0.05, PANEL.x + 2.6, PANEL_Z + 2.6, PANEL.x + PANEL.w - 2.6, PANEL_TOP - 2.6),
  power: [at([PANEL.x + PANEL.w - 4, PANEL_FACE + 0.05, PANEL_Z + 1.3])],
};

// The room map on the monitor: 6 columns × 4 rows with an aisle, like the Overview seating plan.
const CELL_W = 9.4;
const CELL_H = 6.4;
const cellAt = (index: number) => {
  const column = index % 6;
  const row = Math.floor(index / 6);
  const x = PANEL.x + 8 + column * (CELL_W + 1.6) + (column >= 3 ? 4 : 0);
  const z = PANEL_TOP - 11 - row * (CELL_H + 1.8);
  return quadY(PANEL_FACE + 0.1, x, z - CELL_H, x + CELL_W, z);
};
// This desk is D07, row 2 column 1.
export const THIS_DESK = 6;
export const SCREEN_ART = {
  cells: Array.from({ length: 24 }, (_, index) => cellAt(index)),
  title: seg([PANEL.x + 8, PANEL_FACE + 0.1, PANEL_TOP - 6], [PANEL.x + 34, PANEL_FACE + 0.1, PANEL_TOP - 6]),
};
// The other desks' states, fixed, so the map reads as a busy room.
export const OTHER_DESKS: Record<number, DeskState> = {
  0: "inUse",
  1: "inUse",
  3: "away",
  4: "inUse",
  8: "inUse",
  10: "free",
  13: "inUse",
  15: "inUse",
  16: "away",
  19: "inUse",
  21: "inUse",
  22: "inUse",
};

/* ---------- the owner's phone ---------- */

export const PHONE_ART = {
  stand: slab(STAND, 0, 3.2, 4, 0.6),
  lip: slab({ x: STAND.x + 2, y: PHONE_FACE, w: STAND.w - 4, d: 2.4, r: 0.6 }, 3.2, 3, 2, 0.3),
  back: slab({ x: STAND.x + 4, y: PHONE.y - 3, w: STAND.w - 8, d: 3, r: 0.6 }, 3.2, 16, 2, 0.3),
  phone: slab(PHONE, PHONE_Z, PHONE_TOP - PHONE_Z, 2, 0.4),
  screen: quadY(PHONE_FACE + 0.05, PHONE.x + 1.1, PHONE_Z + 3, PHONE.x + PHONE.w - 1.1, PHONE_TOP - 2.2),
  speaker: seg([PHONE.x + 5, PHONE_FACE + 0.05, PHONE_TOP - 1.1], [PHONE.x + 9, PHONE_FACE + 0.05, PHONE_TOP - 1.1]),
  bubble: quadY(PHONE_FACE + 0.1, PHONE.x + 2, PHONE_TOP - 13, PHONE.x + PHONE.w - 2, PHONE_TOP - 5),
  bubbleLines: join(
    [PHONE_TOP - 7.2, PHONE_TOP - 9.4, PHONE_TOP - 11.4].map((z, index) =>
      seg([PHONE.x + 3.4, PHONE_FACE + 0.15, z], [PHONE.x + (index === 0 ? 10 : 11.6), PHONE_FACE + 0.15, z]),
    ),
  ),
};

/* ---------- radio links ---------- */

// A link is a quadratic arc through the air, from one antenna to the next, sampled for drawing and for the packet.
function arc(from: Point3, to: Point3, lift: number, steps = 40): Flat[] {
  const control: Point3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, Math.max(from[2], to[2]) + lift];
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const u = 1 - t;
    return at([0, 1, 2].map((k) => u * u * from[k] + 2 * u * t * control[k] + t * t * to[k]) as Point3);
  });
}

export const LINKS: Record<Link, Flat[]> = {
  "espnow-up": arc(NODE_ANT, GATEWAY_ANT, 44),
  "espnow-down": arc(GATEWAY_ANT, NODE_ANT, 44),
  wifi: arc(GATEWAY_ANT, ROUTER_ANT, 16, 16),
  "to-screen": arc(ROUTER_ANT, SCREEN_AT, 64),
  "to-phone": arc(ROUTER_ANT, PHONE_AT, 120, 60),
};
