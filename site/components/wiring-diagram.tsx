// Breadboard-style wiring drawn from the real parts: every header pin in its true order with its silkscreen name,
// numbered jumper wires, and the breadboard power rails. Pin orders come from the makers' pinouts and the shop photos
// (DFRobot DFR0975, Waveshare ESP32-S3-DEV-KIT-N8R8, Hi-Link LD2410 manual, cybertice WCMCU-531, GY-302, MAX4466,
// TD-7120MG page). The SCD41 board came from Shopee: its pin order is the common one and must be checked on the board.
import type { ReactNode } from "react";

type Side = "left" | "right";
type Point = { x: number; y: number; dx: number; dy: number };

interface Header {
  side: Side;
  x: number;
  y0: number;
  pitch: number;
  pins: [key: string, label: string][];
}

interface Part {
  id: string;
  headers: Header[];
}

const C = {
  green: "#2e9e5b",
  orange: "#e8892b",
  violet: "#7a5cc7",
  red: "#d1453b",
  black: "#2b2b2b",
  amber: "#e0a800",
  blue: "#2f6fb0",
  teal: "#16a3a3",
  pink: "#d6458a",
  white: "#ffffff",
} as const;

type WireColor = keyof typeof C;

interface Wire {
  n: number;
  from: Point;
  to: Point;
  color: WireColor;
}

export interface WireRow {
  n: number;
  from: string;
  to: string;
  color: WireColor;
}

/* ---------- geometry helpers ---------- */

function pin(part: Part, key: string): Point {
  for (const header of part.headers) {
    const i = header.pins.findIndex(([k]) => k === key);
    if (i >= 0) return { x: header.x, y: header.y0 + i * header.pitch, dx: header.side === "left" ? -1 : 1, dy: 0 };
  }
  throw new Error(`no pin ${key} on ${part.id}`);
}

// a hole on a breadboard rail: wires arrive from above
const rail = (x: number, y: number): Point => ({ x, y, dx: 0, dy: -1 });
// a loose wire end (servo cable, DC jack lead) leaving in a direction
const end = (x: number, y: number, dx: number, dy: number): Point => ({ x, y, dx, dy });

const labels = (keys: string[]): [string, string][] => keys.map((k) => [k, k]);

function wirePath(a: Point, b: Point) {
  const reach = Math.max(50, Math.min(110, Math.hypot(b.x - a.x, b.y - a.y) * 0.45));
  return `M${a.x} ${a.y} C${a.x + a.dx * reach} ${a.y + a.dy * reach} ${b.x + b.dx * reach} ${b.y + b.dy * reach} ${b.x} ${b.y}`;
}

/* ---------- drawing pieces ---------- */

function Headers({ part, used, reserved = [] }: { part: Part; used: Set<string>; reserved?: string[] }) {
  return (
    <>
      {part.headers.map((header) =>
        header.pins.map(([key, label], i) => {
          const y = header.y0 + i * header.pitch;
          const state = used.has(`${part.id}:${key}`) ? "rw-on" : reserved.includes(key) ? "rw-cam" : "rw-off";
          const left = header.side === "left";
          return (
            <g key={`${header.side}-${i}`} className={state}>
              <rect x={header.x - 5} y={y - 5} width={10} height={10} className="rw-pin" />
              <rect x={header.x - 2} y={y - 2} width={4} height={4} className="rw-pin-hole" />
              <text x={left ? header.x + 13 : header.x - 13} y={y} textAnchor={left ? "start" : "end"} dominantBaseline="central" className="rw-silk">
                {label}
              </text>
            </g>
          );
        }),
      )}
    </>
  );
}

function Wires({ wires }: { wires: Wire[] }) {
  return (
    <>
      {wires.map((wire) => (
        <g key={wire.n}>
          {wire.color === "white" ? <path d={wirePath(wire.from, wire.to)} className="rw-wire-edge" /> : null}
          <path d={wirePath(wire.from, wire.to)} className="rw-wire" stroke={C[wire.color]} />
        </g>
      ))}
      {wires.map((wire) => (
        <g key={`e${wire.n}`}>
          <circle cx={wire.from.x} cy={wire.from.y} r={3.2} className="rw-end" />
          <circle cx={wire.to.x} cy={wire.to.y} r={3.2} className="rw-end" />
        </g>
      ))}
    </>
  );
}

// each wire's number, just outside the pin it starts from
function Tags({ wires }: { wires: Wire[] }) {
  return (
    <>
      {wires.map((wire) => {
        const x = wire.from.x + wire.from.dx * 22 + (wire.from.dy ? 14 : 0);
        const y = wire.from.y + wire.from.dy * 22;
        return (
          <g key={wire.n} className="rw-tag">
            <circle cx={x} cy={y} r={9} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
              {wire.n}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Rails({ x, w, y, top, bottom }: { x: number; w: number; y: number; top: string; bottom: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={60} rx={4} className="rw-breadboard" />
      <line x1={x + 8} y1={y + 6} x2={x + w - 8} y2={y + 6} className="rw-rail-plus" />
      <line x1={x + 8} y1={y + 54} x2={x + w - 8} y2={y + 54} className="rw-rail-minus" />
      {Array.from({ length: Math.floor((w - 70) / 14) }, (_, i) => (
        <g key={i}>
          <rect x={x + 62 + i * 14} y={y + 14} width={4} height={4} className="rw-hole" />
          <rect x={x + 62 + i * 14} y={y + 42} width={4} height={4} className="rw-hole" />
        </g>
      ))}
      <text x={x + 10} y={y + 17} dominantBaseline="central" className="rw-rail-label rw-plus">
        {top}
      </text>
      <text x={x + 10} y={y + 45} dominantBaseline="central" className="rw-rail-label rw-minus">
        {bottom}
      </text>
    </g>
  );
}

function Board({ x, y, w, h, fill, children }: { x: number; y: number; w: number; h: number; fill: string; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} className="rw-board" />
      {children}
    </g>
  );
}

function Silk({ x, y, children, size = "md", anchor = "start" }: { x: number; y: number; children: ReactNode; size?: "sm" | "md" | "lg"; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" className={`rw-silk-${size}`}>
      {children}
    </text>
  );
}

/* ---------- the node: FireBeetle 2 + LD2410 + VL53L1X + servo ---------- */

const FB: Part = {
  id: "fb",
  headers: [
    {
      side: "left",
      x: 396,
      y0: 180,
      pitch: 24,
      pins: [
        ["RST", "RST"],
        ["3V3", "3V3"],
        ["NC", "NC"],
        ["GND", "GND"],
        ["NC2", "NC"],
        ["17", "17 SCK"],
        ["15", "15 MO"],
        ["16", "16 MI"],
        ["2", "2 SCL"],
        ["1", "1 SDA"],
        ["0", "0 D9"],
        ["9", "9 D7"],
        ["18", "18 D6"],
        ["7", "7 D5"],
        ["38", "38 D3"],
        ["3", "3 D2"],
        ["43", "43 TX"],
        ["44", "44 RX"],
      ],
    },
    {
      side: "right",
      x: 564,
      y0: 276,
      pitch: 24,
      pins: [
        ["VCC", "VCC"],
        ["D+", "D+"],
        ["D-", "D−"],
        ["47", "47 D14"],
        ["11", "11 A5"],
        ["10", "10 A4"],
        ["8", "8 A3"],
        ["6", "6 A2"],
        ["5", "5 A1"],
        ["4", "4 A0"],
        ["21", "21 D13"],
        ["12", "12 D12"],
        ["13", "13 D11"],
        ["14", "14 D10"],
      ],
    },
  ],
};

const LD: Part = { id: "ld", headers: [{ side: "right", x: 250, y0: 140, pitch: 24, pins: labels(["OUT", "TX", "RX", "GND", "VCC"]) }] };
const TOF: Part = { id: "tof", headers: [{ side: "right", x: 250, y0: 322, pitch: 24, pins: [...labels(["VCC", "GND", "SCL", "SDA", "GPIO1"]), ["XSHUT", "ไม่ต่อ · XSHUT"]] }] };

const NODE_RAIL = { plus: 676, minus: 704 };

const NODE_WIRES: Wire[] = [
  { n: 1, from: pin(LD, "TX"), to: pin(FB, "17"), color: "green" },
  { n: 2, from: pin(LD, "RX"), to: pin(FB, "18"), color: "orange" },
  { n: 3, from: pin(LD, "OUT"), to: pin(FB, "16"), color: "violet" },
  { n: 4, from: pin(LD, "VCC"), to: rail(290, NODE_RAIL.plus), color: "red" },
  { n: 5, from: pin(LD, "GND"), to: rail(276, NODE_RAIL.minus), color: "black" },
  { n: 6, from: pin(TOF, "VCC"), to: pin(FB, "3V3"), color: "amber" },
  { n: 7, from: pin(TOF, "GND"), to: rail(306, NODE_RAIL.minus), color: "black" },
  { n: 8, from: pin(TOF, "SCL"), to: pin(FB, "2"), color: "blue" },
  { n: 9, from: pin(TOF, "SDA"), to: pin(FB, "1"), color: "teal" },
  { n: 10, from: pin(TOF, "GPIO1"), to: pin(FB, "15"), color: "pink" },
  { n: 11, from: pin(FB, "VCC"), to: rail(612, NODE_RAIL.plus), color: "red" },
  { n: 12, from: pin(FB, "GND"), to: rail(338, NODE_RAIL.minus), color: "black" },
  { n: 13, from: end(660, 433, -1, 0), to: pin(FB, "12"), color: "white" },
  { n: 14, from: end(660, 455, -1, 0), to: rail(640, NODE_RAIL.plus), color: "red" },
  { n: 15, from: end(660, 477, -1, 0), to: rail(662, NODE_RAIL.minus), color: "black" },
  { n: 16, from: end(866, 172, 0, 1), to: rail(866, NODE_RAIL.plus), color: "red" },
  { n: 17, from: end(890, 172, 0, 1), to: rail(890, NODE_RAIL.minus), color: "black" },
];

export const NODE_ROWS: WireRow[] = [
  { n: 1, from: "LD2410 · TX", to: "FireBeetle · 17", color: "green" },
  { n: 2, from: "LD2410 · RX", to: "FireBeetle · 18", color: "orange" },
  { n: 3, from: "LD2410 · OUT", to: "FireBeetle · 16", color: "violet" },
  { n: 4, from: "LD2410 · VCC", to: "ราง + 5V", color: "red" },
  { n: 5, from: "LD2410 · GND", to: "ราง − GND", color: "black" },
  { n: 6, from: "VL53L1X · VCC", to: "FireBeetle · 3V3", color: "amber" },
  { n: 7, from: "VL53L1X · GND", to: "ราง − GND", color: "black" },
  { n: 8, from: "VL53L1X · SCL", to: "FireBeetle · 2", color: "blue" },
  { n: 9, from: "VL53L1X · SDA", to: "FireBeetle · 1", color: "teal" },
  { n: 10, from: "VL53L1X · GPIO1", to: "FireBeetle · 15", color: "pink" },
  { n: 11, from: "FireBeetle · VCC", to: "ราง + 5V", color: "red" },
  { n: 12, from: "FireBeetle · GND", to: "ราง − GND", color: "black" },
  { n: 13, from: "Servo · สายขาว", to: "FireBeetle · 12", color: "white" },
  { n: 14, from: "Servo · สายแดง", to: "ราง + 5V", color: "red" },
  { n: 15, from: "Servo · สายดำ", to: "ราง − GND", color: "black" },
  { n: 16, from: "แจ็ก DC · ขา +", to: "ราง + 5V", color: "red" },
  { n: 17, from: "แจ็ก DC · ขา −", to: "ราง − GND", color: "black" },
];

const NODE_USED = new Set([
  ...["17", "18", "16", "3V3", "2", "1", "15", "VCC", "GND", "12"].map((k) => `fb:${k}`),
  ...["OUT", "TX", "RX", "GND", "VCC"].map((k) => `ld:${k}`),
  ...["VCC", "GND", "SCL", "SDA", "GPIO1"].map((k) => `tof:${k}`),
]);

export function NodeWiring() {
  return (
    <svg className="rw-svg" viewBox="0 0 960 740" role="img" aria-label="ภาพการต่อสาย node ตามของจริง: FireBeetle 2 ESP32-S3 กับ LD2410, VL53L1X, servo, ตัวเก็บประจุ และแจ็ก DC บนรางไฟ breadboard สายมีหมายเลข 1 ถึง 17 ตามตาราง">
      {/* FireBeetle 2 ESP32-S3, front side, USB-C at the top */}
      <Board x={380} y={110} w={200} h={520} fill="#1a1c22">
        <rect x={462} y={98} width={36} height={22} rx={5} className="rw-usb" />
        <Silk x={480} y={146} anchor="middle" size="lg">
          FireBeetle 2
        </Silk>
        <Silk x={480} y={162} anchor="middle" size="sm">
          ESP32-S3
        </Silk>
        <rect x={461} y={186} width={38} height={38} rx={3} className="rw-cam-body" />
        <circle cx={480} cy={205} r={11} className="rw-cam-lens" />
        <Silk x={480} y={236} anchor="middle" size="sm">
          OV2640
        </Silk>
      </Board>
      <Headers part={FB} used={NODE_USED} reserved={["4", "5", "6", "7", "8"]} />

      {/* LD2410 on its 2.54 mm adapter board */}
      <Board x={40} y={168} w={162} h={36} fill="#1f4fa3">
        <Silk x={56} y={186}>
          HLK-LD2410
        </Silk>
      </Board>
      <Board x={202} y={124} w={62} h={128} fill="#2e7d4f" />
      <text x={233} y={114} textAnchor="middle" className="rw-note">
        บอร์ดแปลงขา
      </text>
      <Headers part={LD} used={NODE_USED} />

      {/* VL53L1X (WCMCU-531) */}
      <Board x={70} y={300} w={194} h={190} fill="#141619">
        <circle cx={92} cy={322} r={9} className="rw-hole-mount" />
        <circle cx={92} cy={468} r={9} className="rw-hole-mount" />
        <rect x={130} y={372} width={16} height={16} className="rw-tof-eye" />
        <rect x={130} y={396} width={16} height={16} className="rw-tof-eye" />
        <Silk x={112} y={462} size="sm">
          WCMCU-531
        </Silk>
        <Silk x={112} y={478}>
          VL53L1X
        </Silk>
      </Board>
      <Headers part={TOF} used={NODE_USED} />

      {/* adapter, its barrel plug and the female DC jack */}
      <rect x={808} y={34} width={112} height={50} rx={6} className="rw-brick" />
      <text x={864} y={54} textAnchor="middle" className="rw-brick-text">
        อแดปเตอร์
      </text>
      <text x={864} y={70} textAnchor="middle" className="rw-brick-text">
        5V 2A
      </text>
      <path d="M864 84 V122" className="rw-cable" />
      <rect x={846} y={122} width={60} height={50} rx={5} className="rw-jack" />
      <text x={876} y={147} textAnchor="middle" dominantBaseline="central" className="rw-brick-text">
        แจ็ก DC
      </text>

      {/* servo: its cable leaves on the left */}
      <rect x={646} y={428} width={14} height={54} rx={3} className="rw-servo" />
      <rect x={660} y={420} width={140} height={70} rx={6} className="rw-servo" />
      <rect x={800} y={428} width={14} height={54} rx={3} className="rw-servo" />
      <circle cx={770} cy={455} r={16} className="rw-horn" />
      <text x={674} y={444} className="rw-brick-text">
        Servo
      </text>
      <text x={674} y={462} className="rw-brick-sub">
        TD-7120MG
      </text>

      {/* capacitor standing on the rails: the stripe marks the minus leg */}
      <rect x={760} y={560} width={34} height={60} rx={8} className="rw-cap" />
      <rect x={784} y={560} width={10} height={60} rx={4} className="rw-cap-stripe" />
      <text x={744} y={590} textAnchor="end" dominantBaseline="central" className="rw-note">
        1000 µF
      </text>
      <path d={`M770 620 V${NODE_RAIL.plus}`} className="rw-leg" />
      <path d={`M789 620 V${NODE_RAIL.minus}`} className="rw-leg" />

      <Rails x={30} w={900} y={NODE_RAIL.plus - 16} top="+ 5V" bottom="− GND" />
      <circle cx={770} cy={NODE_RAIL.plus} r={3.2} className="rw-end" />
      <circle cx={789} cy={NODE_RAIL.minus} r={3.2} className="rw-end" />
      <Wires wires={NODE_WIRES} />
      <Tags wires={NODE_WIRES} />
    </svg>
  );
}

/* ---------- the gateway: Waveshare ESP32-S3 + BH1750 + SCD41 + MAX4466 ---------- */

const WS: Part = {
  id: "ws",
  headers: [
    { side: "left", x: 396, y0: 150, pitch: 22, pins: labels(["3V3", "3V3", "RST", "4", "5", "6", "7", "15", "16", "17", "18", "8", "3", "46", "9", "10", "11", "12", "13", "14", "5V", "GND"]) },
    { side: "right", x: 564, y0: 150, pitch: 22, pins: labels(["GND", "TX", "RX", "1", "2", "42", "41", "40", "39", "38", "37", "36", "35", "0", "45", "48", "47", "21", "20", "19", "GND", "GND"]) },
  ],
};

const LUX: Part = { id: "lux", headers: [{ side: "right", x: 250, y0: 140, pitch: 24, pins: [...labels(["VCC", "GND", "SCL", "SDA"]), ["ADDR", "ไม่ต่อ · ADDR"]] }] };
const CO2: Part = { id: "co2", headers: [{ side: "right", x: 250, y0: 324, pitch: 24, pins: labels(["VCC", "GND", "SCL", "SDA"]) }] };
const MIC: Part = { id: "mic", headers: [{ side: "right", x: 250, y0: 508, pitch: 24, pins: labels(["OUT", "GND", "VCC"]) }] };

const GW_RAIL = { plus: 676, minus: 704 };
// the board's last left-hand pin is the GND used here; pin() returns the first match, which is on the right
const WS_GND: Point = { x: 396, y: 150 + 21 * 22, dx: -1, dy: 0 };

const GATEWAY_WIRES: Wire[] = [
  { n: 1, from: pin(LUX, "VCC"), to: rail(292, GW_RAIL.plus), color: "amber" },
  { n: 2, from: pin(LUX, "GND"), to: rail(278, GW_RAIL.minus), color: "black" },
  { n: 3, from: pin(LUX, "SCL"), to: pin(WS, "9"), color: "blue" },
  { n: 4, from: pin(LUX, "SDA"), to: pin(WS, "8"), color: "teal" },
  { n: 5, from: pin(CO2, "VCC"), to: rail(312, GW_RAIL.plus), color: "amber" },
  { n: 6, from: pin(CO2, "GND"), to: rail(300, GW_RAIL.minus), color: "black" },
  { n: 7, from: pin(CO2, "SCL"), to: pin(WS, "9"), color: "blue" },
  { n: 8, from: pin(CO2, "SDA"), to: pin(WS, "8"), color: "teal" },
  { n: 9, from: pin(MIC, "OUT"), to: pin(WS, "4"), color: "violet" },
  { n: 10, from: pin(MIC, "GND"), to: rail(322, GW_RAIL.minus), color: "black" },
  { n: 11, from: pin(MIC, "VCC"), to: rail(334, GW_RAIL.plus), color: "amber" },
  { n: 12, from: pin(WS, "3V3"), to: rail(356, GW_RAIL.plus), color: "amber" },
  { n: 13, from: WS_GND, to: rail(372, GW_RAIL.minus), color: "black" },
];

export const GATEWAY_ROWS: WireRow[] = [
  { n: 1, from: "BH1750 · VCC", to: "ราง + 3.3V", color: "amber" },
  { n: 2, from: "BH1750 · GND", to: "ราง − GND", color: "black" },
  { n: 3, from: "BH1750 · SCL", to: "Waveshare · 9", color: "blue" },
  { n: 4, from: "BH1750 · SDA", to: "Waveshare · 8", color: "teal" },
  { n: 5, from: "SCD41 · VCC", to: "ราง + 3.3V", color: "amber" },
  { n: 6, from: "SCD41 · GND", to: "ราง − GND", color: "black" },
  { n: 7, from: "SCD41 · SCL", to: "Waveshare · 9", color: "blue" },
  { n: 8, from: "SCD41 · SDA", to: "Waveshare · 8", color: "teal" },
  { n: 9, from: "MAX4466 · OUT", to: "Waveshare · 4", color: "violet" },
  { n: 10, from: "MAX4466 · GND", to: "ราง − GND", color: "black" },
  { n: 11, from: "MAX4466 · VCC", to: "ราง + 3.3V", color: "amber" },
  { n: 12, from: "Waveshare · 3V3", to: "ราง + 3.3V", color: "amber" },
  { n: 13, from: "Waveshare · GND (ขาล่างสุดซ้าย)", to: "ราง − GND", color: "black" },
];

const GW_USED = new Set([
  ...["3V3", "4", "8", "9"].map((k) => `ws:${k}`),
  ...["VCC", "GND", "SCL", "SDA"].flatMap((k) => [`lux:${k}`, `co2:${k}`]),
  ...["OUT", "GND", "VCC"].map((k) => `mic:${k}`),
]);

export function GatewayWiring() {
  return (
    <svg className="rw-svg" viewBox="0 0 960 740" role="img" aria-label="ภาพการต่อสาย gateway ตามของจริง: Waveshare ESP32-S3-DEV-KIT-N8R8 กับ BH1750, SCD41 และ MAX4466 บนรางไฟ 3.3V ของ breadboard สายมีหมายเลข 1 ถึง 13 ตามตาราง">
      {/* Waveshare ESP32-S3-DEV-KIT-N8R8: antenna at the top, USB-C at the bottom */}
      <Board x={380} y={60} w={200} h={600} fill="#15171c">
        <rect x={420} y={66} width={120} height={22} rx={2} className="rw-antenna" />
        <rect x={420} y={88} width={120} height={48} rx={2} className="rw-can" />
        <Silk x={480} y={112} anchor="middle" size="sm">
          ESP32-S3-WROOM-1
        </Silk>
        <Silk x={480} y={400} anchor="middle" size="lg">
          Waveshare
        </Silk>
        <Silk x={480} y={416} anchor="middle" size="sm">
          ESP32-S3 N8R8
        </Silk>
        <rect x={462} y={646} width={36} height={22} rx={5} className="rw-usb" />
      </Board>
      <Headers part={WS} used={GW_USED} />
      <g className="rw-on">
        <rect x={WS_GND.x - 5} y={WS_GND.y - 5} width={10} height={10} className="rw-pin" />
      </g>

      {/* GY-302 BH1750 */}
      <Board x={70} y={120} w={194} h={150} fill="#1f5fbf">
        <rect x={120} y={170} width={30} height={30} rx={2} className="rw-chip" />
        <Silk x={96} y={248}>
          GY-302 BH1750
        </Silk>
      </Board>
      <Headers part={LUX} used={GW_USED} />

      {/* SCD41 board from Shopee */}
      <Board x={70} y={304} w={194} h={124} fill="#20563d">
        <rect x={118} y={330} width={40} height={40} rx={3} className="rw-can" />
        <Silk x={96} y={408}>
          SCD41
        </Silk>
      </Board>
      <Headers part={CO2} used={GW_USED} />

      {/* MAX4466 */}
      <Board x={70} y={480} w={194} h={110} fill="#7b3fb3">
        <circle cx={130} cy={534} r={30} className="rw-mic" />
        <Silk x={174} y={576} size="sm">
          MAX4466
        </Silk>
      </Board>
      <Headers part={MIC} used={GW_USED} />

      {/* phone charger on the USB-C port */}
      <path d="M480 668 C480 712 600 712 640 690" className="rw-cable" />
      <rect x={640} y={662} width={150} height={52} rx={6} className="rw-brick" />
      <text x={715} y={682} textAnchor="middle" className="rw-brick-text">
        ที่ชาร์จมือถือ 5V
      </text>
      <text x={715} y={700} textAnchor="middle" className="rw-brick-sub">
        สาย USB-C
      </text>

      <Rails x={30} w={392} y={GW_RAIL.plus - 16} top="+ 3.3V" bottom="− GND" />
      <Wires wires={GATEWAY_WIRES} />
      <Tags wires={GATEWAY_WIRES} />
    </svg>
  );
}

export function WireTable({ rows }: { rows: WireRow[] }) {
  return (
    <table className="register rw-table">
      <thead>
        <tr>
          <th>สาย</th>
          <th>จาก</th>
          <th>ไป</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.n}>
            <td>
              <span className="rw-swatch" style={{ background: C[row.color] }} />
              <b>{row.n}</b>
            </td>
            <td>{row.from}</td>
            <td>{row.to}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
