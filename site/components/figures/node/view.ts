import { boxCorners, fitProjection, iso, type Plan, type Point3 } from "@/components/iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 420;
export const AZIMUTH = 58;

// The bench: a base plate on feet.
export const FLOOR: Plan = { x: -178, y: -104, w: 356, d: 206, r: 7 };
export const FLOOR_Z = -8;

// The test desk.
export const DESK: Plan = { x: -150, y: -80, w: 300, d: 160, r: 3 };
export const LEG_TOP = 44;
export const TOP = 52;
export const LEG = 10;
export const LEGS: [number, number][] = [
  [-142, -72],
  [132, -72],
  [-142, 62],
  [132, 62],
];
export const APRON: Plan = { x: -132, y: 66, w: 264, d: 4, r: 0.8 };
export const APRON_Z = 28;
export const APRON_FACE = APRON.y + APRON.d;

// HLK-LD2410 on the apron, facing the chair.
export const RADAR: Plan = { x: -15, y: APRON_FACE, w: 28, d: 1.6, r: 0.4 };
export const RADAR_Z = 31;
export const RADAR_TOP = 41;

// Sign plinth, cheeks, prism and servo.
export const PLINTH: Plan = { x: -32, y: -78, w: 122, d: 48, r: 3 };
export const PLINTH_TOP = TOP + 8;
export const CHEEK_L: Plan = { x: -18, y: -74, w: 5, d: 40, r: 1.2 };
export const CHEEK_R: Plan = { x: 62, y: -74, w: 5, d: 40, r: 1.2 };
export const CHEEK_TOP = PLINTH_TOP + 46;
export const PRISM_X0 = CHEEK_L.x + CHEEK_L.w;
export const PRISM_X1 = CHEEK_R.x;
export const PRISM_Y = -54;
export const PRISM_Z = PLINTH_TOP + 24;
export const PRISM_R = 17;
export const SERVO: Plan = { x: CHEEK_R.x + CHEEK_R.w, y: -66, w: 12, d: 24, r: 1 };
export const SERVO_Z = PRISM_Z - 12;
export const SERVO_TOP = PRISM_Z + 12;
export const CAP: [number, number] = [82, -37];
export const BLOCK: Plan = { x: -30, y: -62, w: 10, d: 18, r: 1 };

// Mast, arm and the camera head.
export const CLAMP: Plan = { x: -136, y: -79, w: 18, d: 16, r: 2 };
export const MAST: [number, number] = [-127, -71];
export const MAST_R = 3.6;
export const ARM_Z = 170;
export const ARM: Plan = { x: -131, y: -75, w: 98, d: 8, r: 1.5 };
export const HEAD: Plan = { x: -66, y: -82, w: 42, d: 22, r: 2 };
export const HEAD_Z = 146;
export const HEAD_FACE = HEAD.y + HEAD.d;
export const LENS: Plan = { x: -55, y: HEAD_FACE, w: 15, d: 5, r: 1.5 };
export const LENS_Z = 151;
export const LENS_TOP = 163;
export const TOF: Plan = { x: -36, y: HEAD_FACE, w: 10, d: 1.4, r: 0.3 };

// Things on the desk.
export const BOOK: Plan = { x: -120, y: -8, w: 64, d: 46, r: 1 };
export const QR_BASE: Plan = { x: 94, y: 34, w: 32, d: 12, r: 2 };
export const QR_CARD: Plan = { x: 97, y: 40, w: 26, d: 1.2, r: 0.3 };
export const QR_Z = TOP + 3;
export const QR_TOP = QR_Z + 30;

const corners = (plan: Plan, z0: number, z1: number) => boxCorners(plan, z0, z1);

export const P = fitProjection(
  [...corners(FLOOR, FLOOR_Z - 4, 0), ...corners({ x: -136, y: -82, w: 110, d: 20, r: 0 }, TOP, ARM_Z + 6)],
  WIDTH,
  HEIGHT,
  { pad: 30, azimuth: AZIMUTH },
);

export const at = (point: Point3) => iso(point, P);

// Unit vector toward the viewer, in world space.
const A = (AZIMUTH * Math.PI) / 180;
const E = (30 * Math.PI) / 180;
export const VIEW: Point3 = [Math.cos(A) * Math.cos(E), Math.sin(A) * Math.cos(E), Math.sin(E)];
