import { boxCorners, corners, cylinder, depthOf, fitProjection, insetPlan, iso, onTop, pathOf, planOutline, ring, sideSeam, slabOf, type Flat, type Plan, type Point3 } from "@/components/iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 350;
const AZIMUTH = 52;

// An acrylic base plate on feet; boards stand on brass standoffs.
const BASE: Plan = { x: -132, y: -74, w: 262, d: 150, r: 6 };
const BASE_H = 5;
const FEET_H = 5;
const STAND = 6;
const PCB = 1.6;

export const P = fitProjection([...boxCorners(BASE, -BASE_H - FEET_H, 0), [-122, -54, 44], [-2, -54, 44], [70, -64, 50], [116, -6, 46]], WIDTH, HEIGHT, { pad: 10, azimuth: AZIMUTH });
const at = (point: Point3) => iso(point, P);
const slab = (plan: Plan, z: number, h: number, steps = 3, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
const join = (list: string[]) => list.filter(Boolean).join("");
const BOARD_Z = STAND;
const BOARD_TOP = STAND + PCB;

export interface Module {
  id: string;
  plan: Plan;
}

// Waveshare ESP32-S3-DEV-KIT-N8R8 (DevKitC-1 layout, as the Lab 10 YD-ESP32-23): an ESP32-S3 module (can + PCB antenna) on a dev board with two USB-C ports.
export const ESP: Plan = { x: -122, y: -54, w: 120, d: 44, r: 1.5 };
export const SCD: Plan = { x: 34, y: -64, w: 36, d: 36, r: 1.2 };
export const LUX: Plan = { x: 86, y: -6, w: 30, d: 36, r: 1.2 };
export const MIC: Plan = { x: -70, y: 24, w: 30, d: 40, r: 1.2 };

const standoffs = (plan: Plan) => corners(plan, 3).map(([x, y]) => cylinder(x, y, 1.8, 0, STAND, P, 14));
const pcb = (plan: Plan) => slab(plan, BOARD_Z, PCB, 2, 0.3);
const holes = (plan: Plan) => join(corners(plan, 3).map(([x, y]) => ring(x, y, 1.5, BOARD_TOP, P, 14)));
const pinRow = (x0: number, y: number, count: number, pitch: number, axis: "x" | "y" = "x") =>
  Array.from({ length: count }, (_, index) => at(axis === "x" ? [x0 + index * pitch, y, BOARD_TOP + 2.4] : [y, x0 + index * pitch, BOARD_TOP + 2.4]));
const header = (x0: number, y: number, count: number, pitch: number, axis: "x" | "y" = "x") => {
  const length = (count - 1) * pitch + 3;
  const plan: Plan = axis === "x" ? { x: x0 - 1.5, y: y - 1.5, w: length, d: 3, r: 0.3 } : { x: y - 1.5, y: x0 - 1.5, w: 3, d: length, r: 0.3 };
  return slab(plan, BOARD_TOP, 2.4, 2);
};

const byDepth = (feet: [number, number][]) => [...feet].sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));

export const BASE_ART = {
  halo: slab(BASE, -BASE_H - FEET_H, BASE_H).fill,
  feet: byDepth(corners(BASE, 16)).map(([x, y]) => [cylinder(x, y, 6.4, -BASE_H - FEET_H, 1.4, P, 24), cylinder(x, y, 5, -BASE_H - FEET_H + 1.4, FEET_H - 1.4, P, 24)]),
  plate: slab(BASE, -BASE_H, BASE_H, 6, 1.2),
  groove: planOutline(insetPlan(BASE, 4), 0, P, 6),
  screws: corners(BASE, 8).map(([x, y]) => at([x, y, 0])),
  // a cable clip at the back edge that holds the USB-C lead
  clip: slab({ x: -126, y: 0, w: 8, d: 12, r: 1 }, 0, 5, 2, 0.3),
  clipScrew: [at([-122, 6, 5])],
};

export const ESP_ART = {
  standoffs: standoffs(ESP),
  pcb: pcb(ESP),
  holes: holes(ESP),
  // the ESP32-S3-WROOM can and its PCB antenna at the board's right end
  modulePcb: slab({ x: ESP.x + ESP.w - 48, y: ESP.y + 7, w: 44, d: 24, r: 0.5 }, BOARD_TOP, 1, 2),
  can: slab({ x: ESP.x + ESP.w - 47, y: ESP.y + 8, w: 30, d: 22, r: 0.6 }, BOARD_TOP + 1, 3, 2, 0.4),
  canSeam: sideSeam({ x: ESP.x + ESP.w - 47, y: ESP.y + 8, w: 30, d: 22, r: 0.6 }, BOARD_TOP + 2, P, 2),
  antenna: onTop(
    [
      [ESP.x + ESP.w - 14, ESP.y + 9],
      [ESP.x + ESP.w - 14, ESP.y + 27],
      [ESP.x + ESP.w - 11, ESP.y + 27],
      [ESP.x + ESP.w - 11, ESP.y + 11],
      [ESP.x + ESP.w - 8, ESP.y + 11],
      [ESP.x + ESP.w - 8, ESP.y + 27],
      [ESP.x + ESP.w - 5.5, ESP.y + 27],
    ],
    BOARD_TOP + 1,
    P,
  ),
  usb: [ESP.y + 9, ESP.y + 23].map((y) => slab({ x: ESP.x - 1.5, y, w: 8, d: 7, r: 1.4 }, BOARD_TOP, 3.2, 3, 0.3)),
  buttons: [ESP.y + 4, ESP.y + 30].map((y) => ({ body: slab({ x: ESP.x + 12, y, w: 5, d: 4, r: 0.4 }, BOARD_TOP, 1.8, 2), cap: cylinder(ESP.x + 14.5, y + 2, 1.1, BOARD_TOP + 1.8, 0.8, P, 12) })),
  chip: slab({ x: ESP.x + 24, y: ESP.y + 13, w: 9, d: 9, r: 0.3 }, BOARD_TOP, 1.1, 2),
  led: [at([ESP.x + 40, ESP.y + 18, BOARD_TOP + 0.4])],
  headerBack: header(ESP.x + 7, ESP.y + 2.5, 22, 4.8),
  headerFront: header(ESP.x + 7, ESP.y + ESP.d - 2.5, 22, 4.8),
  pinsBack: pinRow(ESP.x + 7, ESP.y + 2.5, 22, 4.8),
  pinsFront: pinRow(ESP.x + 7, ESP.y + ESP.d - 2.5, 22, 4.8),
  silk: planOutline({ x: ESP.x + 20, y: ESP.y + 9, w: 17, d: 20, r: 0.5 }, BOARD_TOP, P, 2),
};

export const SCD_ART = {
  standoffs: standoffs(SCD),
  pcb: pcb(SCD),
  holes: holes(SCD),
  sensor: slab({ x: SCD.x + 10, y: SCD.y + 8, w: 13, d: 13, r: 0.6 }, BOARD_TOP, 6, 2, 0.4),
  sensorPort: ring(SCD.x + 16.5, SCD.y + 14.5, 2.4, BOARD_TOP + 6, P, 20),
  header: header(SCD.y + 6, SCD.x + 3, 5, 4, "y"),
  pins: pinRow(SCD.y + 6, SCD.x + 3, 5, 4, "y"),
};

export const LUX_ART = {
  standoffs: standoffs(LUX),
  pcb: pcb(LUX),
  holes: holes(LUX),
  chip: slab({ x: LUX.x + 9, y: LUX.y + 12, w: 6, d: 4, r: 0.3 }, BOARD_TOP, 1.2, 2),
  window: planOutline({ x: LUX.x + 10.5, y: LUX.y + 12.8, w: 3, d: 2.4, r: 0.4 }, BOARD_TOP + 1.2, P, 2),
  header: header(LUX.x + 4, LUX.y + 3, 5, 4),
  pins: pinRow(LUX.x + 4, LUX.y + 3, 5, 4),
};

export const MIC_ART = {
  standoffs: standoffs(MIC),
  pcb: pcb(MIC),
  holes: holes(MIC),
  capsule: cylinder(MIC.x + 12, MIC.y + 22, 5, BOARD_TOP, 5, P, 32),
  felt: ring(MIC.x + 12, MIC.y + 22, 3.6, BOARD_TOP + 5, P, 28),
  pot: cylinder(MIC.x + 17, MIC.y + 9, 2.4, BOARD_TOP, 2.6, P, 18),
  potSlot: onTop(
    [
      [MIC.x + 15.6, MIC.y + 9],
      [MIC.x + 18.4, MIC.y + 9],
    ],
    BOARD_TOP + 2.6,
    P,
  ),
  amp: slab({ x: MIC.x + 5, y: MIC.y + 7, w: 5, d: 5, r: 0.3 }, BOARD_TOP, 1, 2),
  header: header(MIC.x + 6, MIC.y + 3, 3, 4),
  pins: pinRow(MIC.x + 6, MIC.y + 3, 3, 4),
};

// Jumper leads: up off the pin, down to the plate, along the plate, up onto the other pin.
const PIN_TOP = BOARD_TOP + 2.4;
const FLOOR = 0.6;
// A jumper lead as world points. The first two points ride on the `head` board and the last two
// on the `tail` board when the gateway comes apart; the run along the plate stays put.
export interface Lead {
  points: Point3[];
  head: ModuleId | null;
  tail: ModuleId | null;
}

const lead = (head: ModuleId, tail: ModuleId, from: Point3, to: Point3, turns: Point3[]): Lead => ({
  points: [from, [from[0], from[1], from[2] + 4], ...turns, [to[0], to[1], to[2] + 4], to],
  head,
  tail,
});

const espFront = (index: number): Point3 => [ESP.x + 7 + index * 4.8, ESP.y + ESP.d - 2.5, PIN_TOP];
const scdPin = (index: number): Point3 => [SCD.x + 3, SCD.y + 6 + index * 4, PIN_TOP];
const luxPin = (index: number): Point3 => [LUX.x + 4 + index * 4, LUX.y + 3, PIN_TOP];
const micPin = (index: number): Point3 => [MIC.x + 6 + index * 4, MIC.y + 3, PIN_TOP];

// I²C: SDA and SCL from the dev board to the SCD41, then on to the BH1750.
export const LEADS = {
  i2c: [0, 1].map((k) => {
    const from = espFront(14 + k);
    const to = scdPin(2 + k);
    return lead("esp", "scd", from, to, [
      [from[0], ESP.y + ESP.d + 4 + k * 3, FLOOR],
      [SCD.x - 6 - k * 3, ESP.y + ESP.d + 4 + k * 3, FLOOR],
      [SCD.x - 6 - k * 3, to[1], FLOOR],
    ]);
  }),
  chain: [0, 1].map((k) => {
    const from = scdPin(2 + k);
    const to = luxPin(2 + k);
    return lead("scd", "lux", [from[0] + 0.01, from[1], from[2]], to, [
      [SCD.x + 8 + k * 3, SCD.y + SCD.d + 4, FLOOR],
      [to[0], SCD.y + SCD.d + 4 + k * 3, FLOOR],
    ]);
  }),
  mic: [0, 1, 2].map((k) => {
    const from = espFront(3 + k);
    const to = micPin(k);
    return lead("esp", "mic", from, to, [
      [from[0], ESP.y + ESP.d + 6 + k * 2.6, FLOOR],
      [to[0], ESP.y + ESP.d + 6 + k * 2.6, FLOOR],
    ]);
  }),
  usb: {
    points: [
      [ESP.x - 1.5, ESP.y + 12.5, BOARD_TOP + 1.6],
      [ESP.x - 6, ESP.y + 12.5, BOARD_TOP + 1.6],
      [ESP.x - 6, ESP.y + 12.5, FLOOR + 0.8],
      [ESP.x - 6, 6, FLOOR + 0.8],
      [-126, 6, 2.5],
    ],
    head: "esp",
    tail: null,
  } as Lead,
};

export const STANDOFFS = [ESP, SCD, LUX, MIC].flatMap(standoffs);
export const SEATS = join([ESP, SCD, LUX, MIC].map((plan) => join(corners(plan, 3).map(([x, y]) => ring(x, y, 1.8, STAND, P, 14)))));

// Each board's way off its standoffs, in world units, and when in the stagger (0–1) it lifts.
export const LIFT: Record<ModuleId, { move: Point3; at: number }> = {
  esp: { move: [0, 0, 26], at: 0 },
  scd: { move: [0, 0, 32], at: 0.15 },
  lux: { move: [0, 0, 28], at: 0.3 },
  mic: { move: [0, 0, 24], at: 0.45 },
};

export const MODULES = [
  { id: "esp", label: "ESP32-S3 DevKitC-1", readout: "ESP32-S3 DevKitC-1 · Wi-Fi + ESP-NOW ต้องอยู่ช่องเดียวกัน", key: "Waveshare ESP32-S3 N8R8" },
  { id: "scd", label: "SCD41", readout: "SCD41 · I²C 0x62 · ค่า CO₂ ใหม่ทุก 5 วิ", key: "CO₂ + อุณหภูมิ + ความชื้น" },
  { id: "lux", label: "BH1750", readout: "BH1750 · I²C 0x23 · bus เดียวกับ SCD41", key: "แสงในห้อง (lux)" },
  { id: "mic", label: "MAX4466", readout: "MAX4466 · analogRead บนขา ADC1 (ADC2 ใช้ไม่ได้ตอนเปิด Wi-Fi)", key: "ระดับเสียง" },
] as const;

export type ModuleId = (typeof MODULES)[number]["id"];
export type { Flat };
export { pathOf };
