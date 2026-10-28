import {
  corners,
  cylinder,
  depthOf,
  insetPlan,
  onTop,
  pathOf,
  planOutline,
  ring,
  sideRing,
  sideSeam,
  slabOf,
  type Flat,
  type Plan,
  type Plane,
  type Point3,
} from "@/components/iso/iso-kit";
import {
  APRON,
  APRON_FACE,
  APRON_Z,
  ARM,
  ARM_Z,
  BLOCK,
  BOOK,
  CAP,
  CHEEK_L,
  CHEEK_R,
  CHEEK_TOP,
  CLAMP,
  DESK,
  FLOOR,
  FLOOR_Z,
  HEAD,
  HEAD_FACE,
  HEAD_Z,
  LEG,
  LEGS,
  LEG_TOP,
  LENS,
  LENS_TOP,
  LENS_Z,
  MAST,
  MAST_R,
  P,
  PLINTH,
  PLINTH_TOP,
  PRISM_Y,
  PRISM_Z,
  QR_BASE,
  QR_CARD,
  QR_TOP,
  QR_Z,
  RADAR,
  RADAR_TOP,
  RADAR_Z,
  SERVO,
  SERVO_TOP,
  SERVO_Z,
  THERMAL,
  TOP,
  at,
} from "./view";

const slab = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
const seg = (a: Point3, b: Point3) => pathOf([at(a), at(b)]);
const join = (paths: string[]) => paths.filter(Boolean).join("");
const byDepth = <T extends { at: Point3 }>(list: T[]) => [...list].sort((a, b) => depthOf(a.at, P) - depthOf(b.at, P));

// A closed quad on a vertical face that faces +y (y fixed), for printing and board traces.
const quadY = (y: number, x0: number, z0: number, x1: number, z1: number) =>
  pathOf([at([x0, y, z0]), at([x1, y, z0]), at([x1, y, z1]), at([x0, y, z1])], true);
// The same on a face that faces +x.
const quadX = (x: number, y0: number, z0: number, y1: number, z1: number) =>
  pathOf([at([x, y0, z0]), at([x, y1, z0]), at([x, y1, z1]), at([x, y0, z1])], true);

/* ---------- bench ---------- */

const FEET = corners(FLOOR, 24).map(([x, y]) => ({ at: [x, y, FLOOR_Z] as Point3 }));
const FLOOR_PLATE: Plan = { x: FLOOR.x + 26, y: FLOOR.y + FLOOR.d - 15, w: 70, d: 10, r: 1.5 };

export const BENCH = {
  halo: slab(FLOOR, FLOOR_Z - 4, 4).fill,
  feet: byDepth(FEET).map(({ at: [x, y] }) => [cylinder(x, y, 7, FLOOR_Z - 5, 1.6, P, 28), cylinder(x, y, 5.4, FLOOR_Z - 3.4, 3.4, P, 28)]),
  plate: slab(FLOOR, FLOOR_Z, -FLOOR_Z, 8, 1.6),
  groove: planOutline(insetPlan(FLOOR, 5), 0, P),
  screws: corners(FLOOR, 10).map(([x, y]) => at([x, y, 0])),
  screwRings: join(corners(FLOOR, 10).map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  label: slab(FLOOR_PLATE, 0, 0.8, 3),
  labelLine: planOutline(insetPlan(FLOOR_PLATE, 1.6), 0.8, P, 3),
  labelRules: join(
    [0, 1, 2].map((row) =>
      onTop(
        [
          [FLOOR_PLATE.x + 8, FLOOR_PLATE.y + 2.6 + row * 2.4],
          [FLOOR_PLATE.x + [52, 38, 46][row], FLOOR_PLATE.y + 2.6 + row * 2.4],
        ],
        0.8,
        P,
      ),
    ),
  ),
  labelScrews: [at([FLOOR_PLATE.x + 3.4, FLOOR_PLATE.y + FLOOR_PLATE.d / 2, 0.8]), at([FLOOR_PLATE.x + FLOOR_PLATE.w - 3.4, FLOOR_PLATE.y + FLOOR_PLATE.d / 2, 0.8])],
};

/* ---------- desk ---------- */

const legPlan = ([x, y]: [number, number]): Plan => ({ x, y, w: LEG, d: LEG, r: 1 });
const BACK_LEGS = LEGS.filter(([, y]) => y < 0);
const FRONT_LEGS = LEGS.filter(([, y]) => y > 0);
const glide = ([x, y]: [number, number]) => cylinder(x + LEG / 2, y + LEG / 2, 6.2, 0, 2.4, P, 24);
const legSolid = (leg: [number, number]) => slab(legPlan(leg), 2.4, LEG_TOP - 2.4, 3, 0.4);

export const DESK_ART = {
  backLegs: BACK_LEGS.map((leg) => ({ glide: glide(leg), leg: legSolid(leg) })),
  frontLegs: FRONT_LEGS.map((leg) => ({ glide: glide(leg), leg: legSolid(leg) })),
  apron: slab(APRON, APRON_Z, LEG_TOP - APRON_Z, 2, 0),
  // the rail the apron hangs from, under the top
  apronScrews: [-110, -60, 60, 110].map((x) => at([x, APRON_FACE, LEG_TOP - 3])),
  top: slab(DESK, LEG_TOP, TOP - LEG_TOP, 4, 1.2),
  banding: sideSeam(DESK, LEG_TOP + 2, P, 4),
  grommet: ring(110, -58, 7, TOP, P, 32),
  grommetInner: ring(110, -58, 4.8, TOP, P, 28),
};

// Desk number plate on the front edge, the drawing's one engraved label.
const TAG: Plan = { x: 104, y: DESK.y + DESK.d, w: 26, d: 0.8, r: 0.2 };
export const TAG_ART = {
  plate: slab(TAG, LEG_TOP + 1.6, 5, 2),
  screws: [at([TAG.x + 2.2, TAG.y + TAG.d, LEG_TOP + 4.1]), at([TAG.x + TAG.w - 2.2, TAG.y + TAG.d, LEG_TOP + 4.1])],
  // a matrix that puts text on the +y face of the tag
  text: (() => {
    const o = at([TAG.x + 5, TAG.y + TAG.d, LEG_TOP + 2.7]);
    const ex = at([TAG.x + 6, TAG.y + TAG.d, LEG_TOP + 2.7]);
    const ez = at([TAG.x + 5, TAG.y + TAG.d, LEG_TOP + 3.7]);
    const f = (v: number) => Math.round(v * 1000) / 1000;
    return `matrix(${f(ex[0] - o[0])} ${f(ex[1] - o[1])} ${f(o[0] - ez[0])} ${f(o[1] - ez[1])} ${f(o[0])} ${f(o[1])})`;
  })(),
};

/* ---------- HLK-LD2410 on the apron ---------- */

const RF = RADAR.y + RADAR.d;
export const RADAR_ART = {
  board: slab(RADAR, RADAR_Z, RADAR_TOP - RADAR_Z, 2),
  // two receive patches and one transmit patch, etched on the face
  patches: join([
    quadY(RF, RADAR.x + 3, RADAR_Z + 4.4, RADAR.x + 7, RADAR_Z + 8.4),
    quadY(RF, RADAR.x + 9, RADAR_Z + 4.4, RADAR.x + 13, RADAR_Z + 8.4),
    quadY(RF, RADAR.x + 18.5, RADAR_Z + 4.4, RADAR.x + 22.5, RADAR_Z + 8.4),
  ]),
  feed: join([seg([RADAR.x + 5, RF, RADAR_Z + 4.4], [RADAR.x + 5, RF, RADAR_Z + 2.2]), seg([RADAR.x + 11, RF, RADAR_Z + 4.4], [RADAR.x + 11, RF, RADAR_Z + 2.2]), seg([RADAR.x + 5, RF, RADAR_Z + 2.2], [RADAR.x + 11, RF, RADAR_Z + 2.2])]),
  chip: quadY(RF, RADAR.x + 15, RADAR_Z + 1.4, RADAR.x + 17.4, RADAR_Z + 3.4),
  pins: [0, 1, 2, 3, 4].map((index) => at([RADAR.x + 7 + index * 2.6, RF, RADAR_TOP - 1])),
  presence: [0, 1, 2, 3, 4, 5].map((index) => at([RADAR.x + 4 + index * 4, RF, RADAR_Z + 9.6])),
  screws: [at([RADAR.x + 1.4, RF, RADAR_TOP - 1.4]), at([RADAR.x + RADAR.w - 1.4, RF, RADAR_TOP - 1.4])],
};

// Its cable runs along the apron face to the left front leg.
const LEFT_FRONT_LEG = FRONT_LEGS[0];
// A cable that comes apart with a part: its first `follow` points ride on that part's layer.
export interface Cable {
  id: string;
  layer: string;
  follow: number;
  points: Point3[];
}

export const RADAR_CABLE: Cable = {
  id: "radar-lead",
  layer: "radar",
  follow: 1,
  points: [
    [RADAR.x + 7, RF + 0.6, RADAR_TOP],
    [RADAR.x + 7, APRON_FACE + 0.8, LEG_TOP - 1.2],
    [LEFT_FRONT_LEG[0] + LEG + 2, APRON_FACE + 0.8, LEG_TOP - 1.2],
    [LEFT_FRONT_LEG[0] + LEG, APRON_FACE + 0.8, LEG_TOP - 1.2],
  ],
};

/* ---------- sign: plinth, cheeks, servo, capacitor, terminal block ---------- */

export const SIGN_ART = {
  plinth: slab(PLINTH, TOP, PLINTH_TOP - TOP, 4, 0.8),
  plinthSeam: sideSeam(PLINTH, TOP + 2.2, P, 4),
  plinthScrews: corners(PLINTH, 4.5).map(([x, y]) => at([x, y, PLINTH_TOP])),
  cheekL: slab(CHEEK_L, PLINTH_TOP, CHEEK_TOP - PLINTH_TOP, 3, 0.4),
  cheekR: slab(CHEEK_R, PLINTH_TOP, CHEEK_TOP - PLINTH_TOP, 3, 0.4),
  // the bearing boss on the left cheek's inner face shows behind the prism
  bossL: sideRing([CHEEK_L.x + CHEEK_L.w, PRISM_Y, PRISM_Z], 4, "x", P, 24),
  cheekScrewsR: [
    at([CHEEK_R.x + CHEEK_R.w, CHEEK_R.y + 4, PLINTH_TOP + 4]),
    at([CHEEK_R.x + CHEEK_R.w, CHEEK_R.y + CHEEK_R.d - 4, PLINTH_TOP + 4]),
    at([CHEEK_R.x + CHEEK_R.w, CHEEK_R.y + 4, CHEEK_TOP - 4]),
    at([CHEEK_R.x + CHEEK_R.w, CHEEK_R.y + CHEEK_R.d - 4, CHEEK_TOP - 4]),
  ],
  // the servo shaft passes through the right cheek here; seen once the servo slides off
  shaftBore: join([3.2, 1.6].map((r) => sideRing([CHEEK_R.x + CHEEK_R.w, PRISM_Y, PRISM_Z], r, "x", P, 24))),
  cheekScrewsL: [at([CHEEK_L.x + CHEEK_L.w, CHEEK_L.y + CHEEK_L.d - 4, PLINTH_TOP + 4]), at([CHEEK_L.x + CHEEK_L.w, CHEEK_L.y + CHEEK_L.d - 4, CHEEK_TOP - 4])],
  // a stop pin under the prism: the mechanical end stop the safety rule asks for
  stop: cylinder(CHEEK_L.x + CHEEK_L.w + 6, PRISM_Y + 9, 1.6, PLINTH_TOP, 6, P, 16),
  servo: slab(SERVO, SERVO_Z, SERVO_TOP - SERVO_Z, 2, 0.4),
  servoEars: slab({ x: SERVO.x, y: SERVO.y - 5, w: 2.4, d: SERVO.d + 10, r: 0.5 }, SERVO_TOP - 6, 2, 2),
  servoEarScrews: [at([SERVO.x + 2.4, SERVO.y - 2.5, SERVO_TOP - 5]), at([SERVO.x + 2.4, SERVO.y + SERVO.d + 2.5, SERVO_TOP - 5])],
  servoLabel: quadX(SERVO.x + SERVO.w, SERVO.y + 4, SERVO_Z + 6, SERVO.y + SERVO.d - 4, SERVO_Z + 14),
  servoRules: join([0, 1].map((row) => seg([SERVO.x + SERVO.w, SERVO.y + 6, SERVO_Z + 8.6 + row * 3], [SERVO.x + SERVO.w, SERVO.y + (row ? 14 : 18), SERVO_Z + 8.6 + row * 3]))),
  cap: cylinder(CAP[0], CAP[1], 4.4, PLINTH_TOP, 13, P, 28),
  capSleeve: join([PLINTH_TOP + 3, PLINTH_TOP + 10.5].map((z) => sideSeamCircle(CAP[0], CAP[1], 4.4, z))),
  capTop: ring(CAP[0], CAP[1], 3.4, PLINTH_TOP + 13, P, 24),
  capVent: onTop(
    [
      [CAP[0] - 2, CAP[1]],
      [CAP[0] + 2, CAP[1]],
    ],
    PLINTH_TOP + 13,
    P,
  ),
  block: slab(BLOCK, PLINTH_TOP, 6, 2, 0.3),
  blockScrews: join([BLOCK.y + 5, BLOCK.y + 13].map((y) => ring(BLOCK.x + 5, y, 2, PLINTH_TOP + 6, P, 16))),
  blockSlots: join(
    [BLOCK.y + 5, BLOCK.y + 13].map((y) =>
      onTop(
        [
          [BLOCK.x + 3.6, y],
          [BLOCK.x + 6.4, y],
        ],
        PLINTH_TOP + 6,
        P,
      ),
    ),
  ),
};

function sideSeamCircle(cx: number, cy: number, r: number, z: number) {
  const points: Flat[] = [];
  const toward = Math.atan2(Math.sin((58 * Math.PI) / 180), Math.cos((58 * Math.PI) / 180));
  for (let step = 0; step <= 20; step++) {
    const angle = toward - Math.PI / 2 + (step / 20) * Math.PI;
    points.push(at([cx + r * Math.cos(angle), cy + r * Math.sin(angle), z]));
  }
  return pathOf(points);
}

// Servo lead and the cable from the head both land on the terminal block.
export const SERVO_CABLE: Cable = {
  id: "servo-lead",
  layer: "servo",
  follow: 2,
  points: [
    [SERVO.x + SERVO.w / 2, SERVO.y + SERVO.d, SERVO_Z + 2],
    [SERVO.x + SERVO.w / 2, SERVO.y + SERVO.d + 1.4, SERVO_Z - 2],
    [SERVO.x + SERVO.w / 2, PLINTH.y + PLINTH.d - 1.6, PLINTH_TOP + 0.6],
    [BLOCK.x + BLOCK.w / 2, PLINTH.y + PLINTH.d - 1.6, PLINTH_TOP + 0.6],
    [BLOCK.x + BLOCK.w / 2, BLOCK.y + BLOCK.d, PLINTH_TOP + 2.4],
  ],
};

/* ---------- mast, arm, head ---------- */

export const MAST_ART = {
  clamp: slab(CLAMP, TOP, 12, 3, 0.5),
  clampScrews: [at([CLAMP.x + 3, CLAMP.y + 3, TOP + 12]), at([CLAMP.x + CLAMP.w - 3, CLAMP.y + CLAMP.d - 3, TOP + 12])],
  // the jaw under the desk top, seen on the back edge
  jaw: slab({ x: CLAMP.x, y: CLAMP.y, w: CLAMP.w, d: 6, r: 1 }, LEG_TOP - 6, 6, 2),
  thumb: cylinder(CLAMP.x + CLAMP.w / 2, CLAMP.y + 3, 3, LEG_TOP - 14, 8, P, 20),
  collar: cylinder(MAST[0], MAST[1], 5.4, TOP + 12, 5, P, 28),
  collarKnurl: "",
  post: cylinder(MAST[0], MAST[1], MAST_R, TOP + 17, ARM_Z - TOP - 17, P, 24),
  postSeams: join([TOP + 60, TOP + 100].map((z) => sideSeamCircle(MAST[0], MAST[1], MAST_R, z))),
  arm: slab(ARM, ARM_Z, 6, 3, 0.5),
  armCap: cylinder(MAST[0], MAST[1], 3, ARM_Z + 6, 1.6, P, 20),
  armScrews: [at([ARM.x + ARM.w - 6, ARM.y + ARM.d / 2, ARM_Z + 6])],
  head: slab(HEAD, HEAD_Z, ARM_Z - HEAD_Z, 3, 0.6),
  headSeam: sideSeam(HEAD, HEAD_Z + 6, P, 3),
  // vent slots on the right face
  vents: join([0, 1, 2, 3].map((index) => quadX(HEAD.x + HEAD.w, HEAD.y + 5 + index * 3.4, HEAD_Z + 10, HEAD.y + 6.6 + index * 3.4, HEAD_Z + 19))),
  headScrews: [at([HEAD.x + 3, HEAD_FACE, HEAD_Z + 3]), at([HEAD.x + HEAD.w - 3, HEAD_FACE, HEAD_Z + 3])],
  led: [at([HEAD.x + HEAD.w - 5, HEAD_FACE, ARM_Z - 4])],
  lens: slab(LENS, LENS_Z, LENS_TOP - LENS_Z, 3, 0.4),
  lensRings: join(
    [5.2, 3.8, 2.2].map((r, index) => sideRing([LENS.x + LENS.w / 2, LENS.y + LENS.d, (LENS_Z + LENS_TOP) / 2], r - index * 0.1, "y", P, 32)),
  ),
  lensGlint: [at([LENS.x + LENS.w / 2 - 1, LENS.y + LENS.d, (LENS_Z + LENS_TOP) / 2 + 1])],
  thermal: slab(THERMAL, LENS_Z + 1, 10, 2),
  thermalCan: slab({ x: THERMAL.x + 2.4, y: THERMAL.y + THERMAL.d, w: 5.2, d: 2.6, r: 0.6 }, LENS_Z + 3.6, 5, 2),
  thermalEye: sideRing([THERMAL.x + 5, THERMAL.y + THERMAL.d + 2.6, LENS_Z + 6.1], 1.5, "y", P, 20),
};

// From the head, under the arm, down the mast, across the desk top to the terminal block.
export const HEAD_CABLE = {
  from: at([-63, -73.8, ARM_Z - 3]),
  via: [
    at([MAST[0] + MAST_R + 1.4, -73.8, ARM_Z - 3]),
    at([MAST[0] + MAST_R + 1.4, MAST[1] + 2, TOP + 20]),
    at([MAST[0] + MAST_R + 1.4, MAST[1] + 2, TOP + 0.8]),
    at([BLOCK.x - 4, BLOCK.y + 5, TOP + 0.8]),
  ],
  to: at([BLOCK.x, BLOCK.y + 5, PLINTH_TOP + 3]),
};

/* ---------- book and QR stand ---------- */

const COVER: Plan = { x: BOOK.x - 1.2, y: BOOK.y - 1.2, w: BOOK.w + 2.4, d: BOOK.d + 2.4, r: 1.2 };
export const BOOK_ART = {
  back: slab(COVER, TOP, 1.2, 3),
  pages: slab(BOOK, TOP + 1.2, 7, 2),
  pageLines: join([2.6, 4.2, 5.8].map((dz) => sideSeam(insetPlan(BOOK, 0), TOP + 1.2 + dz, P, 2))),
  cover: slab(COVER, TOP + 8.2, 1.4, 3, 0.5),
  title: planOutline({ x: COVER.x + 10, y: COVER.y + 9, w: 28, d: 10, r: 0.5 }, TOP + 9.6, P, 2),
};

const CARD_FACE = QR_CARD.y + QR_CARD.d;
// A 9 × 9 pattern with the three finder squares a phone needs; it stands for the printed QR.
const QR_BITS = [
  "111010111",
  "101001101",
  "111011111",
  "000110000",
  "110101011",
  "001011010",
  "111000101",
  "101110010",
  "111001011",
];
const QR_X = QR_CARD.x + 4;
const QR_Z0 = QR_Z + 9;
const CELL = 2;
export const QR_ART = {
  base: slab(QR_BASE, TOP, QR_Z - TOP, 3, 0.5),
  slot: planOutline({ x: QR_CARD.x - 0.6, y: QR_CARD.y - 0.6, w: QR_CARD.w + 1.2, d: QR_CARD.d + 1.2, r: 0.3 }, QR_Z, P, 2),
  card: slab(QR_CARD, QR_Z, QR_TOP - QR_Z, 2),
  modules: join(
    QR_BITS.flatMap((row, r) =>
      [...row].map((bit, c) => (bit === "1" ? quadY(CARD_FACE, QR_X + c * CELL, QR_Z0 + (8 - r) * CELL, QR_X + (c + 1) * CELL, QR_Z0 + (9 - r) * CELL) : "")),
    ),
  ),
  rule: seg([QR_X, CARD_FACE, QR_Z0 - 3], [QR_X + 14, CARD_FACE, QR_Z0 - 3]),
};

export type { Plane };

/* ---------- inside the head: what the housing hides ---------- */

const PCB_FACE = -69;
export const INSIDE_ART = {
  backPlate: slab({ x: -63, y: -75, w: 36, d: 2.4, r: 0.4 }, 148, 22, 2),
  pcb: slab({ x: -61, y: -70.6, w: 32, d: 1.6, r: 0.4 }, 150, 17, 2),
  pcbScrews: [at([-59.4, PCB_FACE, 165.4]), at([-30.6, PCB_FACE, 165.4]), at([-59.4, PCB_FACE, 151.6]), at([-30.6, PCB_FACE, 151.6])],
  module: slab({ x: -58, y: PCB_FACE, w: 14, d: 2.2, r: 0.3 }, 152.6, 10, 2, 0.3),
  moduleSeam: sideSeam({ x: -58, y: PCB_FACE, w: 14, d: 2.2, r: 0.3 }, 160.4, P, 2),
  antenna: slab({ x: -58, y: PCB_FACE, w: 14, d: 0.6, r: 0.2 }, 162.6, 3.4, 2),
  antennaTrace: join([0, 1, 2].map((k) => seg([-56 + k * 4, PCB_FACE + 0.6, 163.2], [-56 + k * 4, PCB_FACE + 0.6, 165.4]))),
  camera: slab({ x: -41, y: PCB_FACE, w: 9, d: 2.6, r: 0.4 }, 154, 9, 2, 0.3),
  cameraLens: join([2.8, 1.5].map((r) => sideRing([-36.5, PCB_FACE + 2.6, 158.5], r, "y", P, 24))),
  ribbon: quadY(PCB_FACE + 0.05, -38.4, 151, -34.6, 154),
  usb: slab({ x: -49, y: -71.4, w: 7, d: 3, r: 1 }, 147.6, 2.4, 3),
  pins: [0, 1, 2, 3, 4, 5, 6, 7].map((k) => at([-57 + k * 3.4, PCB_FACE, 167 - 1.2])),
};
