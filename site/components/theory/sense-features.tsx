"use client";

import * as React from "react";

// What the gateway's model sees from one desk: LD2410 energy per 0.75 m gate (engineering mode) and the VL53L1X
// distance to the seat. The scenes are modelled, not measured: a seated person breathes at gates 0–1 and is
// about 45 cm from the ToF, an empty seat is about 90 cm away, a bag on the seat is still and does not breathe.
type Scene = "empty" | "person" | "bag" | "neighbour";
type Says = "person" | "empty" | "nearby";
const SCENES: { id: Scene; label: string; still: number[]; move: number[]; breath: "near" | "far" | null; tof: number; says: Says }[] = [
  { id: "empty", label: "เก้าอี้ว่าง", still: [12, 3, 2, 1, 1, 0, 0, 0, 0], move: [2, 1, 1, 0, 0, 0, 0, 0, 0], breath: null, tof: 900, says: "empty" },
  { id: "person", label: "มีคนนั่งนิ่ง", still: [58, 37, 6, 3, 2, 1, 0, 0, 0], move: [9, 6, 2, 1, 0, 0, 0, 0, 0], breath: "near", tof: 452, says: "person" },
  { id: "bag", label: "กระเป๋าบนเก้าอี้", still: [21, 4, 2, 1, 1, 0, 0, 0, 0], move: [2, 1, 1, 0, 0, 0, 0, 0, 0], breath: null, tof: 610, says: "empty" },
  { id: "neighbour", label: "คนโต๊ะข้าง ๆ", still: [12, 4, 45, 25, 3, 1, 0, 0, 0], move: [2, 2, 8, 4, 1, 0, 0, 0, 0], breath: "far", tof: 900, says: "nearby" },
];
const SAYS: Record<Says, string> = { person: "person · มีคนนั่ง", empty: "empty · ไม่มีคนนั่ง", nearby: "nearby · มีคนใกล้ ๆ แต่ไม่ได้นั่ง" };
const SEAT = 900;
const TOF_MAX = 1000;

export function SenseFeatures() {
  const [id, setId] = React.useState<Scene>("bag");
  const scene = SCENES.find((item) => item.id === id) ?? SCENES[0];
  const nearStill = (scene.still[0] + scene.still[1]) / 2;
  // the kind of rule the model has to beat: strong near reflection or a short distance means someone is there
  const rule = nearStill > 18 || scene.tof < 650 ? "person" : "empty";
  const ruleRight = (rule === "person") === (scene.says === "person");
  return (
    <figure className="widget sense">
      <div className="widget-bar">
        <span className="field-label">LD2410 + VL53L1X · สิ่งที่โมเดลบน gateway เห็น</span>
        <span className="chips" role="group" aria-label="เลือกฉาก">
          {SCENES.map((item) => (
            <button key={item.id} type="button" className="chip" aria-pressed={id === item.id} onClick={() => setId(item.id)}>
              {item.label}
            </button>
          ))}
        </span>
      </div>
      <div className="sense-body">
        <div className="sense-plots">
          <div
            className="gate-chart"
            role="img"
            aria-label={`พลังงานเรดาร์ 9 ช่วงระยะ เป้านิ่ง ${scene.still.join(", ")} เป้าขยับ ${scene.move.join(", ")}`}
          >
            {scene.still.map((still, gate) => (
              <div className="gate-col" key={gate} data-zone={gate < 2 ? "seat" : gate < 4 ? "next" : undefined}>
                <span className="gate-bars">
                  <span className="gate-bar" style={{ height: `${still}%` }} data-breath={(scene.breath === "near" && gate < 2) || (scene.breath === "far" && gate >= 2 && gate < 4) ? "" : undefined} />
                  <span className="gate-bar" data-kind="move" style={{ height: `${scene.move[gate]}%` }} />
                </span>
                <span className="gate-x">{String(gate * 0.75)}</span>
              </div>
            ))}
          </div>
          <div className="gate-zones" aria-hidden="true">
            <span>เก้าอี้โต๊ะนี้</span>
            <span>โต๊ะข้าง ๆ</span>
            <span>ไกลออกไป (m)</span>
          </div>
          <p className="gate-key">
            <span className="gate-swatch" /> เป้านิ่ง (ลมหายใจ) <span className="gate-swatch" data-kind="move" /> เป้าขยับ · แถบที่สั่นคือมีจังหวะหายใจ
          </p>
          <div className="tof" role="img" aria-label={`ระยะ ToF ${scene.tof} มิลลิเมตร เบาะเก้าอี้อยู่ที่ ${SEAT}`}>
            <span className="field-label">VL53L1X · ระยะลงไปที่เบาะ</span>
            <div className="tof-track">
              <span className="tof-fill" style={{ width: `${(scene.tof / TOF_MAX) * 100}%` }} />
              <span className="tof-seat" style={{ left: `${(SEAT / TOF_MAX) * 100}%` }} />
            </div>
            <span className="tof-scale">
              <span>0</span>
              <span>เบาะ {SEAT} mm</span>
            </span>
          </div>
        </div>
        <dl className="sense-out">
          <div>
            <dt className="field-label">tof_mm</dt>
            <dd>{scene.tof}</dd>
          </div>
          <div>
            <dt className="field-label">จังหวะหายใจที่เก้าอี้</dt>
            <dd className="sense-say">{scene.breath === "near" ? "มี" : "ไม่มี"}</dd>
          </div>
          <div>
            <dt className="field-label">AI local ตอบ</dt>
            <dd className="sense-say">{SAYS[scene.says]}</dd>
          </div>
          <div>
            <dt className="field-label">if-else (เรดาร์ใกล้ &gt; 18 หรือ ToF &lt; 650)</dt>
            <dd className="sense-say" data-wrong={ruleRight ? undefined : ""}>
              {rule}
              {ruleRight ? " · ถูก" : " · ผิด"}
            </dd>
          </div>
        </dl>
      </div>
      <figcaption>
        ค่าจำลอง ยังไม่ใช่ค่าที่วัดจริง · กระเป๋าสะท้อนเรดาร์และทำให้ระยะสั้นลงเหมือนคน กติกา if-else จึงพลาด แต่กระเป๋าไม่หายใจ
        โมเดลที่ดูข้อมูลย้อนหลัง 5 วินาทีจึงแยกได้ · คนโต๊ะข้าง ๆ หายใจในช่วงระยะที่ไกลกว่า และ ToF ยังเห็นเบาะว่าง
      </figcaption>
    </figure>
  );
}
