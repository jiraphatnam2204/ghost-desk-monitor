"use client";

import * as React from "react";

// node_batch_t, byte by byte, as it leaves the node one second after someone sat at D07.
// ESP32 is little-endian, so a uint16 goes low byte first. Only the first of the ten samples is spelled out.
interface Field {
  name: string;
  size: number;
  value: number | number[] | null;
  says: string;
}

const FIELDS: Field[] = [
  {
    name: "ver",
    size: 1,
    value: 2,
    says: "รุ่นของรูปแบบข้อความ ถ้าเปลี่ยน struct ให้เพิ่มเลขนี้ gateway จะได้ไม่อ่านผิด · รุ่น 2 คือแบบส่งเป็นชุด",
  },
  { name: "node_id", size: 1, value: 7, says: "node หมายเลข 7 = โต๊ะ D07" },
  {
    name: "seq",
    size: 2,
    value: 1042,
    says: "เลขลำดับข้อความ gateway ใช้ทิ้งข้อความซ้ำจากการ retry และนับว่าข้อความหายไปกี่เปอร์เซ็นต์",
  },
  {
    name: "uptime_ms",
    size: 4,
    value: 3723000,
    says: "เวลาของค่าแรกในชุด นับจากบอร์ดเปิด (ms) 3 723 000 = 1 ชม. 2 นาที ถ้าค่านี้ลดลง แปลว่าบอร์ดเพิ่งรีเซ็ต",
  },
  {
    name: "sign_face",
    size: 1,
    value: 2,
    says: "ป้ายหันหน้าไหนอยู่: 0 ใช้งาน, 1 ไม่อยู่, 2 ว่าง · ตอนนี้ยังเป็นว่าง จนกว่า gateway จะสั่ง",
  },
  { name: "n", size: 1, value: 10, says: "จำนวนค่าในชุดนี้ · อ่าน 10 ครั้งต่อวินาที แล้วส่งรวม 1 ข้อความต่อวินาที" },
  {
    name: "s[0].move_e",
    size: 9,
    value: [9, 6, 2, 1, 0, 0, 0, 0, 0],
    says: "พลังงานการขยับจากเรดาร์ แยก 9 ช่วงระยะ ช่วงละ 0.75 m (0–100) · คนนั่งนิ่งขยับน้อย ค่าจึงต่ำ",
  },
  {
    name: "s[0].still_e",
    size: 9,
    value: [58, 37, 6, 3, 2, 1, 0, 0, 0],
    says: "พลังงานเป้านิ่ง (การหายใจ) แยก 9 ช่วงระยะ · ช่วง 0–1 (0–1.5 m) คือเก้าอี้ของโต๊ะนี้ ค่านี้ขึ้นลงเป็นจังหวะตามลมหายใจ ซึ่งเป็น feature หลักของโมเดล AI",
  },
  {
    name: "s[0].tof_mm",
    size: 2,
    value: 452,
    says: "ระยะจาก VL53L1X ลงไป 452 mm · เก้าอี้ว่างวัดได้ถึงเบาะราว 900 mm มีคนนั่งระยะจึงสั้นลง",
  },
  {
    name: "s[1]…s[9]",
    size: 180,
    value: null,
    says: "อีก 9 ค่าในรูปแบบเดียวกัน ห่างกัน 100 ms · gateway เก็บย้อนหลังไว้ 5 วินาทีต่อโต๊ะ แล้วป้อนเข้าโมเดล",
  },
];

const bytesOf = (field: Field) => {
  if (field.value === null) return [];
  if (Array.isArray(field.value)) return field.value;
  const raw = field.value;
  return Array.from({ length: field.size }, (_, index) => (raw >> (index * 8)) & 0xff);
};
const hex = (value: number) => value.toString(16).toUpperCase().padStart(2, "0");
const TOTAL = FIELDS.reduce((sum, item) => sum + item.size, 0);
// where each field starts in the batch
const STARTS = FIELDS.map((_, index) => FIELDS.slice(0, index).reduce((sum, item) => sum + item.size, 0));

export function PacketMap() {
  const [picked, setPicked] = React.useState(7);
  const field = FIELDS[picked];
  const shown = Array.isArray(field.value) ? `[${field.value.join(", ")}]` : field.value === null ? "…" : field.value;
  return (
    <figure className="widget packet">
      <div className="widget-bar">
        <span className="field-label">node_batch_t · {TOTAL} ไบต์ · แตะช่องเพื่อดูความหมาย</span>
      </div>
      <div className="packet-strip" role="group" aria-label="ไบต์ของรายงาน">
        {FIELDS.map((item, index) => {
          const start = STARTS[index];
          const bytes = bytesOf(item);
          return (
            <button
              key={item.name}
              type="button"
              className="packet-field"
              style={{ flexGrow: Math.min(item.size, 9) }}
              aria-pressed={picked === index}
              onClick={() => setPicked(index)}
              onPointerEnter={() => setPicked(index)}
              onFocus={() => setPicked(index)}
            >
              <span className="packet-bytes">
                {bytes.length ? bytes.map((byte, k) => <code key={k}>{hex(byte)}</code>) : <code>× 9</code>}
              </span>
              <span className="packet-name">{item.name}</span>
              <span className="packet-at">{item.size > 1 ? `${start}–${start + item.size - 1}` : start}</span>
            </button>
          );
        })}
      </div>
      <div className="packet-say" aria-live="polite">
        <b>
          {field.name} = {shown}
        </b>{" "}
        <span>
          ({field.size} ไบต์{field.size === 2 || field.size === 4 ? ", ไบต์ต่ำก่อน" : ""}) {field.says}
        </span>
      </div>
      <figcaption>
        ESP32 เป็น little-endian: seq = 1042 = 0x0412 จึงส่ง 12 แล้วตามด้วย 04 · <code>__attribute__((packed))</code> กันไม่ให้ compiler
        แทรกช่องว่างระหว่างฟิลด์ ทั้งสองฝั่งจึงตีความไบต์ตรงกัน · ค่าในรูปจำลอง ยังไม่ใช่ค่าที่วัดจริง
      </figcaption>
    </figure>
  );
}
