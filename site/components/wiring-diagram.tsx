// How every module is wired, drawn like a breadboard: a 5 V rail on top, a GND rail at the bottom,
// signal wires straight from a board pin to a module pin. Pins follow the draft pin map in Build Plan step A4.
import type { ReactNode } from "react";

type Kind = "v5" | "v33" | "sig" | "gnd" | "sda" | "scl" | "ana";

function Wire({ d, kind }: { d: string; kind: Kind }) {
  return <path d={d} className={`wr-wire wr-${kind}`} />;
}

function Box({ x, y, w, h, title, sub }: { x: number; y: number; w: number; h: number; title: string; sub?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} className="wr-box" />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" className="wr-title">
        {title}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + 40} textAnchor="middle" className="wr-text">
          {sub}
        </text>
      ) : null}
    </>
  );
}

// a pin name printed inside a box, beside the wire that meets it
function Pin({ x, y, end, children }: { x: number; y: number; end?: boolean; children: ReactNode }) {
  return (
    <text x={x} y={y} textAnchor={end ? "end" : "start"} dominantBaseline="central" className="wr-pin">
      {children}
    </text>
  );
}

export function NodeWiring() {
  return (
    <svg className="wr-svg" viewBox="0 0 680 520" role="img" aria-label="การต่อสาย node: อแดปเตอร์ 5V เข้าราง 5V เลี้ยง FireBeetle, LD2410 และ servo · VL53L1X ใช้ 3.3V จากบอร์ด · LD2410 ต่อ GPIO17, 18, 16 · VL53L1X ต่อ GPIO1, 2, 15 · servo ต่อ GPIO12 มีตัวเก็บประจุ 1000 µF · GND ทุกชิ้นต่อถึงกัน">
      {/* power in and the two rails */}
      <Box x={40} y={20} w={200} h={54} title="อแดปเตอร์ 5V 2A" sub="แจ็ก DC + terminal block" />
      <Wire d="M140 74 V100" kind="v5" />
      <Wire d="M40 100 H660" kind="v5" />
      <text x={660} y={90} textAnchor="end" className="wr-text">
        ราง 5V
      </text>
      <Wire d="M50 74 V470" kind="gnd" />
      <Wire d="M40 470 H660" kind="gnd" />
      <text x={660} y={490} textAnchor="end" className="wr-text">
        ราง GND (ต่อถึงกันหมด)
      </text>

      {/* the board */}
      <Box x={250} y={135} w={180} h={315} title="FireBeetle 2 ESP32-S3" sub="+ กล้อง OV2640 (สายแพ)" />
      <Pin x={258} y={205}>5V (VCC)</Pin>
      <Pin x={258} y={330}>GPIO12</Pin>
      <Pin x={422} y={215} end>
        GPIO17 (RX)
      </Pin>
      <Pin x={422} y={240} end>
        GPIO18 (TX)
      </Pin>
      <Pin x={422} y={265} end>
        GPIO16
      </Pin>
      <Pin x={422} y={340} end>
        3V3
      </Pin>
      <Pin x={422} y={365} end>
        GPIO1 (SDA)
      </Pin>
      <Pin x={422} y={390} end>
        GPIO2 (SCL)
      </Pin>
      <Pin x={422} y={415} end>
        GPIO15
      </Pin>
      <text x={340} y={438} textAnchor="middle" className="wr-pin">
        GND
      </text>
      <Wire d="M250 205 H230 V100" kind="v5" />
      <Wire d="M340 450 V470" kind="gnd" />

      {/* radar: TX and RX cross over */}
      <Box x={510} y={180} w={120} h={105} title="LD2410" />
      <Pin x={518} y={215}>TX</Pin>
      <Pin x={518} y={240}>RX</Pin>
      <Pin x={518} y={265}>OUT</Pin>
      <Wire d="M600 180 V100" kind="v5" />
      <Wire d="M630 275 H648 V470" kind="gnd" />
      <Wire d="M430 215 H510" kind="sig" />
      <Wire d="M430 240 H510" kind="sig" />
      <Wire d="M430 265 H510" kind="sig" />

      {/* distance sensor on 3.3 V */}
      <Box x={510} y={300} w={120} h={130} title="VL53L1X" />
      <Pin x={518} y={340}>VIN</Pin>
      <Pin x={518} y={365}>SDA</Pin>
      <Pin x={518} y={390}>SCL</Pin>
      <Pin x={518} y={415}>GPIO1</Pin>
      <Wire d="M430 340 H510" kind="v33" />
      <Wire d="M430 365 H510" kind="sig" />
      <Wire d="M430 390 H510" kind="sig" />
      <Wire d="M430 415 H510" kind="sig" />
      <Wire d="M570 430 V470" kind="gnd" />

      {/* servo straight from the 5 V rail, capacitor beside it */}
      <Box x={70} y={290} w={100} h={60} title="Servo" />
      <Pin x={162} y={330} end>
        สัญญาณ
      </Pin>
      <Wire d="M120 290 V100" kind="v5" />
      <Wire d="M250 330 H170" kind="sig" />
      <path d="M120 350 V380" className="wr-wire wr-link" />
      <Box x={70} y={380} w={100} h={54} title="1000 µF" sub="คร่อม + / −" />
      <Wire d="M120 434 V470" kind="gnd" />
    </svg>
  );
}

export function GatewayWiring() {
  return (
    <svg className="wr-svg" viewBox="0 80 680 370" role="img" aria-label="การต่อสาย gateway: ที่ชาร์จมือถือ 5V เข้า USB-C · SCD41 และ BH1750 ใช้ I²C คู่เดียวกัน SDA GPIO8, SCL GPIO9 · MAX4466 ต่อ GPIO4 · sensor ทุกตัวใช้ 3.3V และ GND จากบอร์ด">
      <Box x={40} y={140} w={160} h={60} title="ที่ชาร์จมือถือ 5V" sub="สาย USB-C" />
      <Wire d="M200 170 H250" kind="v5" />

      <Box x={250} y={100} w={180} h={330} title="Waveshare ESP32-S3" sub="DevKitC-1 · N8R8" />
      <Pin x={258} y={170}>USB-C</Pin>
      <Pin x={422} y={190} end>
        GPIO8 (SDA)
      </Pin>
      <Pin x={422} y={215} end>
        GPIO9 (SCL)
      </Pin>
      <Pin x={422} y={395} end>
        GPIO4 (ADC1)
      </Pin>
      <text x={340} y={290} textAnchor="middle" className="wr-pin">
        3V3 + GND
      </text>
      <text x={340} y={310} textAnchor="middle" className="wr-text">
        เลี้ยง sensor ทุกตัว
      </text>

      {/* one I²C pair shared by both sensors */}
      <Box x={510} y={150} w={130} h={90} title="SCD41 (CO₂)" />
      <Pin x={518} y={190}>SDA</Pin>
      <Pin x={518} y={215}>SCL</Pin>
      <Pin x={632} y={230} end>
        3.3V · GND
      </Pin>
      <Box x={510} y={255} w={130} h={90} title="BH1750 (แสง)" />
      <Pin x={518} y={295}>SDA</Pin>
      <Pin x={518} y={320}>SCL</Pin>
      <Pin x={632} y={335} end>
        3.3V · GND
      </Pin>
      <Wire d="M430 190 H510" kind="sda" />
      <Wire d="M465 190 V295 H510" kind="sda" />
      <circle cx={465} cy={190} r={4} className="wr-dot wr-sda" />
      <Wire d="M430 215 H510" kind="scl" />
      <Wire d="M487 215 V320 H510" kind="scl" />
      <circle cx={487} cy={215} r={4} className="wr-dot wr-scl" />

      <Box x={510} y={355} w={130} h={70} title="MAX4466 (เสียง)" />
      <Pin x={518} y={395}>OUT</Pin>
      <Pin x={632} y={418} end>
        3.3V · GND
      </Pin>
      <Wire d="M430 395 H510" kind="ana" />
    </svg>
  );
}

const WIRE_KEY: { kind: Kind; label: string }[] = [
  { kind: "v5", label: "ไฟ 5V" },
  { kind: "v33", label: "ไฟ 3.3V" },
  { kind: "gnd", label: "GND (เส้นประ)" },
  { kind: "sig", label: "สัญญาณ" },
  { kind: "sda", label: "I²C SDA" },
  { kind: "scl", label: "I²C SCL" },
  { kind: "ana", label: "อนาล็อก" },
];

export function WireKey({ kinds }: { kinds: Kind[] }) {
  return (
    <ul className="wr-key">
      {WIRE_KEY.filter((item) => kinds.includes(item.kind)).map((item) => (
        <li key={item.kind}>
          <svg viewBox="0 0 30 10" aria-hidden="true">
            <path d="M1 5 H29" className={`wr-wire wr-${item.kind}`} />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
