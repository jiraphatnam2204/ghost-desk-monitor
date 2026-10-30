"use client";

import * as React from "react";

// A pretend logic analyser on the four kinds of wire in the project. Every number on it is computed
// from the bus settings the firmware will use, so changing a control changes the trace honestly.
type Bus = "uart" | "i2c" | "pwm" | "adc";
const BUSES: { id: Bus; label: string; part: string }[] = [
  { id: "uart", label: "UART", part: "LD2410 → node" },
  { id: "i2c", label: "I²C", part: "VL53L1X ↔ node" },
  { id: "pwm", label: "PWM", part: "node → servo" },
  { id: "adc", label: "ADC", part: "MAX4466 → gateway" },
];

const W = 640;
const H = 150;
const PAD = 14;
const hi = 30;
const lo = 92;
const tenth = (value: number) => Math.round(value * 10) / 10;

// A digital trace from a list of levels, one per slot.
function stepPath(levels: number[], x0: number, slot: number, high = hi, low = lo) {
  let d = "";
  levels.forEach((level, index) => {
    const y = level ? high : low;
    const x = x0 + index * slot;
    d += index === 0 ? `M${tenth(x)} ${y}` : `L${tenth(x)} ${y}`;
    d += `L${tenth(x + slot)} ${y}`;
  });
  return d;
}

function Uart() {
  const [byte, setByte] = React.useState(0xf4);
  const bits = Array.from({ length: 8 }, (_, index) => (byte >> index) & 1);
  const levels = [1, 0, ...bits, 1, 1];
  const names = ["idle", "S", ...bits.map((_, index) => `b${index}`), "P", "idle"];
  const slot = (W - PAD * 2) / levels.length;
  return (
    <>
      <div className="widget-bar">
        <span className="field-label">ไบต์ที่ส่ง · ต้นเฟรมรายงานของ LD2410</span>
        <span className="chips">
          {[0xf4, 0xf3, 0xf2, 0xf1].map((value) => (
            <button key={value} type="button" className="chip" aria-pressed={byte === value} onClick={() => setByte(value)}>
              0x{value.toString(16).toUpperCase()}
            </button>
          ))}
        </span>
      </div>
      <svg className="scope" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`UART ส่ง 0x${byte.toString(16)} บิตต่ำสุดก่อน`}>
        {levels.map((_, index) => (
          <line key={index} className="scope-grid" x1={PAD + index * slot} x2={PAD + index * slot} y1={18} y2={104} />
        ))}
        <path className="scope-trace" d={stepPath(levels, PAD, slot)} />
        {names.map((name, index) => (
          <g key={index}>
            <text className="scope-label" x={PAD + index * slot + slot / 2} y={122}>
              {name}
            </text>
            {index >= 1 && index <= 9 ? (
              <text className="scope-bit" x={PAD + index * slot + slot / 2} y={142}>
                {levels[index]}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <p className="widget-read">
        256000 baud → 1 บิต = <b>3.9 µs</b> · 1 ไบต์ = start + 8 บิต + stop = 10 บิต = <b>39 µs</b> · ส่งบิตต่ำสุด (b0) ก่อน · 0x
        {byte.toString(16).toUpperCase()} = {byte.toString(2).padStart(8, "0")}₂
      </p>
    </>
  );
}

function I2c() {
  // START, address 0x29 (VL53L1X default), W, ACK from the sensor
  const address = 0x29;
  const bits = Array.from({ length: 7 }, (_, index) => (address >> (6 - index)) & 1);
  const sda = [1, 0, ...bits, 0, 0, 0];
  const names = ["", "S", "A6", "A5", "A4", "A3", "A2", "A1", "A0", "W", "ACK", ""];
  const slot = (W - PAD * 2) / sda.length;
  // SCL: high at rest and through START; then one pulse per bit, high in the middle of each slot
  let scl = `M${PAD} 20L${tenth(PAD + slot * 1.6)} 20L${tenth(PAD + slot * 1.6)} 52`;
  for (let index = 2; index <= 10; index++) {
    const x = PAD + index * slot;
    scl += `L${tenth(x + slot * 0.25)} 52L${tenth(x + slot * 0.25)} 20L${tenth(x + slot * 0.75)} 20L${tenth(x + slot * 0.75)} 52`;
  }
  scl += `L${tenth(W - PAD)} 52`;
  return (
    <>
      <div className="widget-bar">
        <span className="field-label">ไบต์แรกของการอ่าน · ที่อยู่ 0x29 + เขียน</span>
      </div>
      <svg className="scope" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="I2C: start, ที่อยู่ 0x29, บิตเขียน, ACK">
        {sda.map((_, index) => (
          <line key={index} className="scope-grid" x1={PAD + index * slot} x2={PAD + index * slot} y1={14} y2={110} />
        ))}
        <text className="scope-name" x={W - PAD} y={14}>
          SCL
        </text>
        <path className="scope-trace" d={scl} />
        <text className="scope-name" x={W - PAD} y={68}>
          SDA
        </text>
        <path className="scope-trace" d={stepPath(sda, PAD, slot, 72, 104)} />
        {names.map((name, index) => (
          <text key={index} className="scope-label" x={PAD + index * slot + slot / 2} y={128}>
            {name}
          </text>
        ))}
        {sda.slice(2, 11).map((level, index) => (
          <text key={index} className="scope-bit" x={PAD + (index + 2) * slot + slot / 2} y={146}>
            {level}
          </text>
        ))}
      </svg>
      <p className="widget-read">
        2 สาย (SDA ข้อมูล, SCL นาฬิกา) ต่อพ่วงได้หลายตัว แยกด้วยที่อยู่: VL53L1X <b>0x29</b> (node) · SCD41 <b>0x62</b> · BH1750 <b>0x23</b> (gateway) ·
        ข้อมูลเปลี่ยนตอน SCL ต่ำ อ่านตอน SCL สูง · ต่อจากนี้เขียนเลข register 16 บิต แล้วอ่านระยะกลับมา 2 ไบต์ ที่ 400 kHz ใช้เวลาราว <b>0.15 ms</b>
      </p>
    </>
  );
}

const FACE_STOPS = [
  { angle: 0, label: "0° ใช้งาน" },
  { angle: 120, label: "120° ไม่อยู่" },
  { angle: 240, label: "240° ว่าง" },
];

function Pwm() {
  const [angle, setAngle] = React.useState(0);
  const pulse = Math.round(500 + (angle / 270) * 2000);
  const period = 20000;
  const scale = (W - PAD * 2) / (period * 2.2);
  let d = `M${PAD} ${lo}`;
  for (let k = 0; k < 3; k++) {
    const start = PAD + (k * period + 1500) * scale;
    if (start > W - PAD) break;
    const end = Math.min(W - PAD, start + pulse * scale);
    d += `L${tenth(start)} ${lo}L${tenth(start)} ${hi}L${tenth(end)} ${hi}L${tenth(end)} ${lo}`;
  }
  d += `L${W - PAD} ${lo}`;
  const first = PAD + 1500 * scale;
  return (
    <>
      <div className="widget-bar">
        <span className="field-label">มุม servo · หน้าป้าย</span>
        <span className="chips">
          {FACE_STOPS.map((stop) => (
            <button key={stop.angle} type="button" className="chip" aria-pressed={angle === stop.angle} onClick={() => setAngle(stop.angle)}>
              {stop.label}
            </button>
          ))}
        </span>
        <input
          className="scope-range"
          type="range"
          min={0}
          max={270}
          step={5}
          value={angle}
          onChange={(event) => setAngle(Number(event.target.value))}
          aria-label="มุม servo"
        />
      </div>
      <svg className="scope" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`PWM 50 Hz พัลส์กว้าง ${pulse} ไมโครวินาที`}>
        <line className="scope-grid" x1={first} x2={first} y1={18} y2={110} />
        <line className="scope-grid" x1={first + period * scale} x2={first + period * scale} y1={18} y2={110} />
        <path className="scope-trace" d={d} />
        <text className="scope-label" x={first + (period * scale) / 2} y={128}>
          คาบ 20 ms (50 Hz)
        </text>
        <text className="scope-bit" x={first + (pulse * scale) / 2} y={20}>
          {pulse} µs
        </text>
      </svg>
      <p className="widget-read">
        มุม {angle}° → พัลส์ <b>{pulse} µs</b> (500 µs = 0°, 2500 µs = 270°) · duty {((pulse / period) * 100).toFixed(1)}% · LEDC 14 บิต: duty ={" "}
        <b>{Math.round((pulse / period) * 16384)}</b> จาก 16384 · servo วัดแค่ความกว้างพัลส์ ไม่สนความถี่เป๊ะ
      </p>
    </>
  );
}

function Adc() {
  const [loud, setLoud] = React.useState(false);
  const amplitude = loud ? 0.9 : 0.08;
  const bias = 1.65;
  const volts = (t: number) => bias + amplitude * (0.7 * Math.sin(t * 2 * Math.PI * 3) + 0.3 * Math.sin(t * 2 * Math.PI * 7.3 + 1));
  const x = (t: number) => PAD + t * (W - PAD * 2);
  const y = (v: number) => 110 - (v / 3.3) * 96;
  const wave = Array.from({ length: 241 }, (_, index) => `${index ? "L" : "M"}${tenth(x(index / 240))} ${tenth(y(volts(index / 240)))}`).join("");
  const samples = Array.from({ length: 33 }, (_, index) => index / 32);
  const values = samples.map(volts);
  const peak = Math.max(...values);
  const trough = Math.min(...values);
  const code = (v: number) => Math.round((v / 3.3) * 4095);
  return (
    <>
      <div className="widget-bar">
        <span className="field-label">เสียงในห้อง</span>
        <span className="chips">
          <button type="button" className="chip" aria-pressed={!loud} onClick={() => setLoud(false)}>
            เงียบ
          </button>
          <button type="button" className="chip" aria-pressed={loud} onClick={() => setLoud(true)}>
            มีคนคุยกัน
          </button>
        </span>
      </div>
      <svg className="scope" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="สัญญาณไมค์และจุดที่ ADC สุ่มอ่าน">
        <line className="scope-grid" x1={PAD} x2={W - PAD} y1={y(bias)} y2={y(bias)} />
        <line className="scope-grid" x1={PAD} x2={W - PAD} y1={y(3.3)} y2={y(3.3)} />
        <line className="scope-grid" x1={PAD} x2={W - PAD} y1={y(0)} y2={y(0)} />
        <text className="scope-name" x={W - PAD} y={y(bias) - 4}>
          1.65 V
        </text>
        <text className="scope-name" x={W - PAD} y={y(3.3) - 4}>
          3.3 V = 4095
        </text>
        <path className="scope-trace scope-analog" d={wave} />
        {samples.map((t, index) => (
          <circle key={index} className="scope-sample" cx={tenth(x(t))} cy={tenth(y(values[index]))} r={2.6} />
        ))}
        <text className="scope-label" x={W / 2} y={132}>
          จุด = ค่าที่ ADC อ่าน · เส้น = แรงดันจริงจากไมค์
        </text>
      </svg>
      <p className="widget-read">
        ADC 12 บิตแบ่ง 0–3.3 V เป็น 4096 ขั้น (ขั้นละ ~0.8 mV) · ไมค์ยก bias ไว้ที่ครึ่งไฟ 1.65 V ≈ <b>{code(bias)}</b> · ช่วงนี้อ่านได้{" "}
        <b>
          {code(trough)}–{code(peak)}
        </b>{" "}
        ยิ่งกว้างยิ่งดัง · ใช้ขา ADC1 เพราะ ADC2 ใช้ไม่ได้ตอน Wi-Fi ทำงาน
      </p>
    </>
  );
}

export function WireScope() {
  const [bus, setBus] = React.useState<Bus>("uart");
  return (
    <figure className="widget">
      <div className="scope-tabs" role="tablist" aria-label="ชนิดของสาย">
        {BUSES.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={bus === item.id} className="scope-tab" onClick={() => setBus(item.id)}>
            <b>{item.label}</b>
            <span>{item.part}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel">{bus === "uart" ? <Uart /> : bus === "i2c" ? <I2c /> : bus === "pwm" ? <Pwm /> : <Adc />}</div>
    </figure>
  );
}
