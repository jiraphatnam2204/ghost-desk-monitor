"use client";

import * as React from "react";

// node_report_t, byte by byte, as it leaves the node one second after someone sat at D07.
// ESP32 is little-endian, so a uint16 goes low byte first.
interface Field {
  name: string;
  size: number;
  value: number;
  signed?: boolean;
  says: string;
}

const FIELDS: Field[] = [
  {
    name: "ver",
    size: 1,
    value: 1,
    says: "รุ่นของรูปแบบข้อความ ถ้าเปลี่ยน struct ให้เพิ่มเลขนี้ gateway จะได้ไม่อ่านผิด",
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
    says: "เวลานับจากบอร์ดเปิด (ms) 3 723 000 = 1 ชม. 2 นาที ถ้าค่านี้ลดลง แปลว่าบอร์ดเพิ่งรีเซ็ต",
  },
  {
    name: "mmw_state",
    size: 1,
    value: 2,
    says: "ผลเรดาร์: 0 ไม่มี, 1 เป้าเคลื่อนที่, 2 เป้านิ่ง, 3 ทั้งสอง · คนนั่งนิ่งจึงเป็น 2",
  },
  {
    name: "mmw_dist_cm",
    size: 2,
    value: 62,
    says: "ระยะเป้าจากเรดาร์ 62 cm พอดีระยะเก้าอี้",
  },
  {
    name: "mmw_energy",
    size: 1,
    value: 54,
    says: "ความแรงของสัญญาณสะท้อน 0–100 ใช้ตั้งเกณฑ์ว่าแรงพอจะนับว่าเป็นคน",
  },
  {
    name: "th_max_c10",
    size: 2,
    value: 318,
    signed: true,
    says: "พิกเซลที่ร้อนที่สุด × 10 = 31.8 °C ใช้ × 10 เพื่อเก็บทศนิยมในจำนวนเต็ม",
  },
  {
    name: "th_hot_px",
    size: 1,
    value: 5,
    says: "จำนวนพิกเซลที่เกิน 30 °C · คนนั่งได้หลายพิกเซล กระเป๋าได้ 0",
  },
  {
    name: "ai_class",
    size: 1,
    value: 1,
    says: "ผลจากกล้อง: 0 ว่าง, 1 มีคน, 2 มีแต่ของ (items_only)",
  },
  {
    name: "ai_conf",
    size: 1,
    value: 93,
    says: "ความมั่นใจของตัวจำแนก 0–100 · ต่ำกว่าเกณฑ์ gateway จะไม่เชื่อ",
  },
  {
    name: "sign_face",
    size: 1,
    value: 2,
    says: "ป้ายหันหน้าไหนอยู่: 0 ใช้งาน, 1 ไม่อยู่, 2 ว่าง · ตอนนี้ยังเป็นว่าง จนกว่า gateway จะสั่ง",
  },
];

const bytesOf = (field: Field) => {
  const raw = field.signed && field.value < 0 ? field.value + 2 ** (field.size * 8) : field.value;
  return Array.from({ length: field.size }, (_, index) => (raw >> (index * 8)) & 0xff);
};
const hex = (value: number) => value.toString(16).toUpperCase().padStart(2, "0");
// where each field starts in the 18 bytes
const STARTS = FIELDS.map((_, index) => FIELDS.slice(0, index).reduce((sum, item) => sum + item.size, 0));

export function PacketMap() {
  const [picked, setPicked] = React.useState(7);
  const field = FIELDS[picked];
  return (
    <figure className="widget packet">
      <div className="widget-bar">
        <span className="field-label">node_report_t · 18 ไบต์ · แตะช่องเพื่อดูความหมาย</span>
      </div>
      <div className="packet-strip" role="group" aria-label="ไบต์ของรายงาน">
        {FIELDS.map((item, index) => {
          const start = STARTS[index];
          return (
            <button
              key={item.name}
              type="button"
              className="packet-field"
              style={{ flexGrow: item.size }}
              aria-pressed={picked === index}
              onClick={() => setPicked(index)}
              onPointerEnter={() => setPicked(index)}
              onFocus={() => setPicked(index)}
            >
              <span className="packet-bytes">
                {bytesOf(item).map((byte, k) => (
                  <code key={k}>{hex(byte)}</code>
                ))}
              </span>
              <span className="packet-name">{item.name}</span>
              <span className="packet-at">{item.size > 1 ? `${start}–${start + item.size - 1}` : start}</span>
            </button>
          );
        })}
      </div>
      <div className="packet-say" aria-live="polite">
        <b>
          {field.name} = {field.value}
        </b>{" "}
        <span>
          ({field.size} ไบต์{field.size > 1 ? ", ไบต์ต่ำก่อน" : ""}) {field.says}
        </span>
      </div>
      <figcaption>
        ESP32 เป็น little-endian: seq = 1042 = 0x0412 จึงส่ง 12 แล้วตามด้วย 04 · <code>__attribute__((packed))</code> กันไม่ให้ compiler
        แทรกช่องว่างระหว่างฟิลด์ ทั้งสองฝั่งจึงตีความไบต์ตรงกัน
      </figcaption>
    </figure>
  );
}
