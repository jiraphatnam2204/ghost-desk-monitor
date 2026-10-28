"use client";

import * as React from "react";

// What the AMG8833 reports: 8 × 8 temperatures, 0.25 °C steps. The scenes are modelled, not measured:
// room air near 24.5 °C, a seated person 29–32 °C through clothes at about 60 cm, a bag at room temperature.
type Scene = "empty" | "person" | "bag";
const SCENES: { id: Scene; label: string }[] = [
  { id: "empty", label: "โต๊ะว่าง" },
  { id: "person", label: "มีคนนั่ง" },
  { id: "bag", label: "มีแต่กระเป๋า" },
];
const HOT = 30;
const quarter = (value: number) => Math.round(value * 4) / 4;
// a fixed ripple so the empty desk is not perfectly flat, as a real sensor never is
const ripple = (x: number, y: number) => ((x * 7 + y * 13) % 5) * 0.1 - 0.2;

function frameOf(scene: Scene) {
  return Array.from({ length: 64 }, (_, index) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    let t = 24.5 + ripple(x, y) + y * 0.08;
    if (scene === "person") {
      const d = Math.hypot((x - 3.6) / 1.9, (y - 4.4) / 2.6);
      t += Math.max(0, 7.4 * Math.exp(-d * d * 0.9));
    }
    if (scene === "bag" && x >= 1 && x <= 3 && y >= 3 && y <= 5) t += 0.6;
    return quarter(t);
  });
}

export function ThermalGrid() {
  const [scene, setScene] = React.useState<Scene>("person");
  const frame = frameOf(scene);
  const max = Math.max(...frame);
  const hot = frame.filter((t) => t > HOT).length;
  return (
    <figure className="widget thermal">
      <div className="widget-bar">
        <span className="field-label">AMG8833 · 8 × 8 pixels</span>
        <span className="chips" role="group" aria-label="เลือกฉาก">
          {SCENES.map((item) => (
            <button key={item.id} type="button" className="chip" aria-pressed={scene === item.id} onClick={() => setScene(item.id)}>
              {item.label}
            </button>
          ))}
        </span>
      </div>
      <div className="thermal-body">
        <div className="thermal-grid" role="img" aria-label={`ภาพความร้อน 8 × 8 สูงสุด ${max.toFixed(2)} องศา ร้อนกว่า ${HOT} องศา ${hot} พิกเซล`}>
          {frame.map((t, index) => {
            const k = Math.min(1, Math.max(0, (t - 24) / 9));
            return (
              <span
                key={index}
                className="thermal-cell"
                data-hot={t > HOT ? "" : undefined}
                data-dark={k > 0.5 ? "" : undefined}
                style={{ "--k": k.toFixed(2) } as React.CSSProperties}
              >
                {t.toFixed(1)}
              </span>
            );
          })}
        </div>
        <dl className="thermal-out">
          <div>
            <dt className="field-label">th_max_c10 · ร้อนสุด × 10</dt>
            <dd>{Math.round(max * 10)}</dd>
          </div>
          <div>
            <dt className="field-label">th_hot_px · พิกเซลที่เกิน {HOT} °C</dt>
            <dd>{hot}</dd>
          </div>
          <div>
            <dt className="field-label">แปลว่า</dt>
            <dd className="thermal-say">{hot >= 3 ? "มีวัตถุอุ่นขนาดคน" : scene === "bag" ? "มีของ แต่ไม่อุ่น" : "ไม่มีอะไรอุ่น"}</dd>
          </div>
        </dl>
      </div>
      <figcaption>
        ค่าในตารางจำลองตามสเปก (ช่วง 0–80 °C ละเอียด 0.25 °C, 10 เฟรม/วินาที) ยังไม่ใช่ค่าที่วัดจริง · กระเป๋ามีอุณหภูมิเท่าห้อง AMG8833 จึงแยก “คน” กับ “ของ”
        ได้ แม้เรดาร์จะเห็นทั้งคู่ไม่ชัด
      </figcaption>
    </figure>
  );
}
