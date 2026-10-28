import type { Metadata } from "next";
import Link from "next/link";
import { Enlarge } from "@/components/enlarge";
import { RoomFigure } from "@/components/figures/room/figure";
import { SignalLadder, SignalStep } from "@/components/signal-story";
import { PacketMap } from "@/components/theory/packet-map";
import { StateDiagram } from "@/components/theory/state-diagram";
import { ThermalGrid } from "@/components/theory/thermal-grid";
import { WireScope } from "@/components/theory/wire-scope";
import "@/components/seating-plan.css";
import "../pages.css";
import "./how.css";

export const metadata: Metadata = {
  title: "How It Works",
  description: "ทฤษฎี embedded system ของ Ghost-Desk Monitor: ตั้งแต่มีคนนั่งลง สัญญาณวิ่งจากเซนเซอร์ผ่าน MCU วิทยุ gateway cloud ไปถึงจออย่างไร",
};

const CHAIN = [
  {
    real: "การเคลื่อนไหวและลมหายใจ",
    part: "LD2410 เรดาร์ 24 GHz",
    signal: "คลื่นสะท้อน → โมดูลประมวลผลเอง",
    bus: "UART 256000 baud + ขา OUT",
    gets: "มี/ไม่มีเป้า, ระยะ, ความแรง",
  },
  {
    real: "ความร้อนจากตัวคน",
    part: "AMG8833 thermopile 8 × 8",
    signal: "แรงดันเล็ก ๆ ต่อพิกเซล → ADC ในชิป",
    bus: "I²C ที่อยู่ 0x69",
    gets: "อุณหภูมิ 64 จุด",
  },
  {
    real: "แสงที่สะท้อนจากโต๊ะ",
    part: "OV2640 กล้อง",
    signal: "พิกเซลทีละไบต์แบบขนาน",
    bus: "DVP: 8 สายข้อมูล + PCLK, VSYNC, HREF",
    gets: "ภาพ JPEG → ตัวจำแนก",
  },
  {
    real: "CO₂ ในห้อง",
    part: "SCD41 (gateway)",
    signal: "วัดการดูดกลืนแสงอินฟราเรด (NDIR)",
    bus: "I²C 0x62",
    gets: "ppm",
  },
  {
    real: "ความสว่าง",
    part: "BH1750 (gateway)",
    signal: "photodiode → ADC ในชิป",
    bus: "I²C 0x23",
    gets: "lux",
  },
  {
    real: "เสียงในห้อง",
    part: "MAX4466 ไมค์ + op-amp (gateway)",
    signal: "แรงดันแอนะล็อกรอบ 1.65 V",
    bus: "ADC1 ของ ESP32-S3, 12 บิต",
    gets: "ระดับเสียง",
  },
  {
    real: "มุมของป้าย (ขาออก)",
    part: "TD-7120MG servo 270°",
    signal: "PWM 50 Hz พัลส์ 0.5–2.5 ms",
    bus: "LEDC ของ ESP32-S3",
    gets: "ป้ายหันหน้าที่ต้องการ",
  },
];

const FUSION = [
  { radar: "เห็น", thermal: "อุ่น", camera: "—", says: "มีคน", ink: "pink" },
  {
    radar: "ไม่เห็น 2 นาที",
    thermal: "ไม่อุ่น",
    camera: "items_only",
    says: "ไม่อยู่ (ทิ้งของ)",
    ink: "yellow",
  },
  {
    radar: "ไม่เห็น 2 นาที",
    thermal: "ไม่อุ่น",
    camera: "empty",
    says: "ว่าง",
    ink: "green",
  },
  {
    radar: "เห็น",
    thermal: "ไม่อุ่น",
    camera: "—",
    says: "สงสัย: พัดลม/ม่านไหว รอกล้องยืนยัน",
    ink: null,
  },
];

const TASKS = [
  {
    name: "sensor",
    when: "10 ครั้ง/วินาที และเมื่อ ISR ปลุก",
    job: "อ่านเฟรม UART ของเรดาร์ และ 64 พิกเซลจาก I²C แล้วใส่ queue",
  },
  {
    name: "vision",
    when: "เมื่อ gateway ขอ (ไม่เห็นคน 2 นาที)",
    job: "ถ่าย 1 ภาพ จำแนก empty / person / items_only · ภาพไม่ถูกเก็บ",
  },
  {
    name: "radio",
    when: "ทุก 2 วินาที และทันทีเมื่อค่าเปลี่ยน",
    job: "รวมค่าจาก queue เป็น node_report_t ส่ง ESP-NOW รอ ACK และ retry",
  },
  {
    name: "sign",
    when: "เมื่อได้คำสั่ง SET_SIGN",
    job: "ตั้ง LEDC duty ให้ servo หมุน แล้วหยุดจ่ายพัลส์หลัง 1.5 วินาที (timeout)",
  },
];

const BUDGET = [
  {
    hop: "เรดาร์เห็นคน → node อ่านค่า",
    time: "~0.1 s",
    why: "เรดาร์ส่งเฟรม ~10 ครั้ง/วินาที",
  },
  {
    hop: "ESP-NOW node → gateway",
    time: "< 1 ms",
    why: "18 ไบต์บนอากาศ (+ retry ถ้าไม่ได้ ACK)",
  },
  {
    hop: "กติกา “เห็นครบ 1 นาที”",
    time: "60 s",
    why: "ตั้งใจรอ กันคนเดินผ่าน",
  },
  { hop: "SET_SIGN → servo หมุนเสร็จ", time: "≤ 0.8 s", why: "servo หมุนราว 0.2 s ต่อ 60° · ไกลสุด 240°" },
  {
    hop: "HTTPS ขึ้น Supabase",
    time: "~0.3–1 s",
    why: "TLS handshake กินเวลามากสุด",
  },
  {
    hop: "Realtime → dashboard",
    time: "~0.1–0.5 s",
    why: "WebSocket ที่เปิดค้างไว้",
  },
];

const GLOSSARY = [
  {
    term: "MCU",
    text: "microcontroller ชิปเดียวที่มี CPU, RAM, flash และขา I/O ในตัว · ที่นี่คือ ESP32-S3",
  },
  {
    term: "GPIO",
    text: "ขาดิจิทัลอเนกประสงค์ อ่านได้ว่าเป็น 0 หรือ 1 หรือสั่งให้เป็น 0/1",
  },
  {
    term: "ISR",
    text: "Interrupt Service Routine ฟังก์ชันสั้น ๆ ที่ฮาร์ดแวร์เรียกทันทีเมื่อขาเปลี่ยน แทนการวนถามซ้ำ (polling)",
  },
  {
    term: "FreeRTOS task",
    text: "งานย่อยที่ทำงานสลับกันบน CPU มีลำดับความสำคัญของตัวเอง ส่งข้อมูลกันผ่าน queue",
  },
  {
    term: "UART",
    text: "สายสื่อสารอนุกรมไม่มีนาฬิกา สองฝั่งต้องตั้ง baud rate ตรงกัน TX ต่อ RX ไขว้กัน",
  },
  {
    term: "I²C",
    text: "บัส 2 สาย (SDA, SCL) ต่อพ่วงหลายอุปกรณ์ แยกกันด้วยที่อยู่ 7 บิต ต้องมีตัวต้านทาน pull-up",
  },
  {
    term: "PWM",
    text: "สัญญาณเปิด-ปิดเป็นจังหวะ ส่งข้อมูลด้วยความกว้างของพัลส์ · servo อ่านความกว้างเป็นมุม",
  },
  { term: "ADC", text: "ตัวแปลงแรงดันแอนะล็อกเป็นตัวเลข 12 บิต = 0–4095" },
  {
    term: "ESP-NOW",
    text: "โปรโตคอลของ Espressif ส่งข้อความสั้นถึงบอร์ดอื่นตรง ๆ ด้วยวิทยุ Wi-Fi โดยไม่ต้องต่อ router",
  },
  {
    term: "Gateway",
    text: "บอร์ดกลางของห้อง รับข้อมูลจาก node ทุกตัว ตัดสินสถานะ และเป็นตัวเดียวที่ต่ออินเทอร์เน็ต",
  },
  {
    term: "TLS / HTTPS",
    text: "การเข้ารหัสระหว่างบอร์ดกับ server ทำให้คนในเครือข่ายเดียวกันอ่านหรือปลอมข้อมูลไม่ได้",
  },
  {
    term: "Realtime",
    text: "บริการของ Supabase ที่ดันแถวข้อมูลใหม่ไปยังหน้าเว็บผ่าน WebSocket ทันที หน้าเว็บไม่ต้องรีเฟรช",
  },
];

const JSON_ROW = `POST https://<project>.supabase.co/rest/v1/desk_events
apikey: <anon key จาก secrets.h>
Content-Type: application/json

{
  "desk": "D07",
  "state": "inUse",
  "at": "2026-11-20T13:01:00Z",
  "mmw_dist_cm": 62,
  "th_max_c": 31.8,
  "ai_class": null,
  "seq": 1042
}`;

const ISR_CODE = `// เรดาร์ดึงขา OUT ขึ้นเมื่อเห็นคน: ปลุก task แทนการวนถาม
void IRAM_ATTR onRadarOut() {
  BaseType_t woke = pdFALSE;
  xSemaphoreGiveFromISR(radarSem, &woke);   // สั้นที่สุด: แค่ส่งสัญญาณ
  portYIELD_FROM_ISR(woke);
}

void sensorTask(void *) {
  for (;;) {
    xSemaphoreTake(radarSem, pdMS_TO_TICKS(100));  // ตื่นเมื่อ ISR ปลุก หรือทุก 100 ms
    Reading r = readRadarFrame();                  // UART
    readThermal(r.pixels);                         // I²C 64 พิกเซล
    xQueueSend(readings, &r, 0);                   // ให้ radio task รวมเป็นรายงาน
  }
}`;

export default function HowItWorksPage() {
  return (
    <>
      <header className="sheet page-head">
        <h1>How It Works</h1>
        <p className="lede">
          ตั้งแต่มีคนนั่งลง จนป้ายบนโต๊ะเปลี่ยนเป็นสีชมพูและจอขึ้นว่าโต๊ะไม่ว่าง ใช้เวลาราว 1 นาที หน้านี้ตามสัญญาณไปทีละ hop: เซนเซอร์แปลงโลกจริงเป็นไฟฟ้า,
          ESP32-S3 อ่านผ่านสายแบบต่าง ๆ, ส่งต่อทางวิทยุ, gateway ตัดสิน แล้วสั่ง servo และขึ้น cloud
        </p>
        <p className="note">
          ทุกรูปและตัวเลขจำลองตามแบบที่วางไว้ ยังไม่ใช่ค่าที่วัดจากเครื่องจริง · AI บนบอร์ดหรือบน cloud ยังรอทีมตัดสินใน <Link href="/problems/#P1">P1</Link>
        </p>
      </header>

      <section className="sheet section" aria-labelledby="hop">
        <div className="section-head">
          <h2 id="hop">นั่งลงแล้วเกิดอะไรขึ้น</h2>
          <span className="ref">Fig 1 · 8 ขั้น</span>
        </div>
        <Enlarge>
          <div className="hop-grid">
            <RoomFigure />
            <SignalStep />
          </div>
        </Enlarge>
        <div className="ladder-wrap">
          <span className="field-label">เส้นเวลาทั้งหมด · แตะแถวเพื่อดูในรูป</span>
          <SignalLadder />
        </div>
      </section>

      <section className="sheet section" aria-labelledby="chain">
        <div className="section-head">
          <h2 id="chain">จากโลกจริงเป็นตัวเลข</h2>
          <span className="ref">sense → signal → bus → data</span>
        </div>
        <p className="lede">
          ระบบ embedded ทุกระบบทำ 4 อย่างวนไป: <b>รับรู้</b> (sensor แปลงปริมาณจริงเป็นสัญญาณไฟฟ้า), <b>อ่าน</b> (MCU รับสัญญาณผ่าน interface ที่ตกลงกันไว้),{" "}
          <b>คิด</b> (โปรแกรมตัดสินจากข้อมูล) และ <b>สั่ง</b> (actuator เปลี่ยนโลกจริงกลับ) ตารางนี้คือทุกเส้นทางเข้าออกของโปรเจกต์
        </p>
        <div className="scroll-x">
          <table className="register chain">
            <thead>
              <tr>
                <th>ปริมาณจริง</th>
                <th>ตัวแปลง (transducer)</th>
                <th>เป็นสัญญาณแบบไหน</th>
                <th>ต่อเข้า MCU ด้วย</th>
                <th>ได้เป็น</th>
              </tr>
            </thead>
            <tbody>
              {CHAIN.map((row) => (
                <tr key={row.part}>
                  <td>{row.real}</td>
                  <td>
                    <b>{row.part}</b>
                  </td>
                  <td>{row.signal}</td>
                  <td>{row.bus}</td>
                  <td>{row.gets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sheet section" id="sense" aria-labelledby="sense-title">
        <div className="section-head">
          <h2 id="sense-title">เซนเซอร์รู้ได้อย่างไรว่ามีคน</h2>
          <span className="ref">ขั้น 1 และ 7</span>
        </div>
        <div className="theory">
          <div className="theory-text">
            <h3>เรดาร์ mmWave: เห็นแม้คนนั่งนิ่ง</h3>
            <p>
              LD2410 ส่งคลื่น 24 GHz ที่ความถี่ไต่ขึ้นเรื่อย ๆ (chirp แบบ FMCW) คลื่นที่สะท้อนตัวคนกลับมาช้ากว่าเดิม <i>t = 2R / c</i>{" "}
              พอเอาคลื่นขาออกกับขาเข้ามาผสมกัน จะได้ความถี่ผลต่าง (beat) ที่แปรตามระยะ R โมดูลทำ FFT เองแล้วแบ่งระยะเป็นช่อง (gate) ละ 0.75 m
            </p>
            <p>
              คนนั่งนิ่งก็ยังหายใจ หน้าอกขยับไม่กี่มิลลิเมตร ทำให้เฟสของคลื่นสะท้อนเปลี่ยนเป็นจังหวะ เรดาร์จึงรายงาน <b>เป้านิ่ง</b> ได้ ซึ่ง PIR ธรรมดาทำไม่ได้
              · ข้อควรระวัง: เรดาร์ทะลุโต๊ะบาง ๆ และเห็นคนโต๊ะข้าง ๆ ต้องตั้ง gate สูงสุดให้ไม่เกินระยะเก้าอี้
            </p>
            <h3>Thermal: แยกคนออกจากของ</h3>
            <p>
              ทุกวัตถุแผ่รังสีอินฟราเรดตามอุณหภูมิ (กำลัง ∝ T⁴) แต่ละพิกเซลของ AMG8833 เป็น thermopile ที่ร้อนขึ้นตามรังสีที่ได้รับ แล้วชิปแปลงเป็นอุณหภูมิให้ ·
              คนผ่านเสื้อผ้าราว 30 °C ส่วนกระเป๋าเท่าห้อง จึงตอบได้ว่าสิ่งที่อยู่บนโต๊ะ <b>เป็นคนหรือเป็นของ</b>
            </p>
            <h3>กล้อง: ใช้เมื่อจำเป็นเท่านั้น</h3>
            <p>
              กล้องถ่ายภาพเดียวตอน gateway ขอ คือเมื่อไม่เห็นคนครบ 2 นาที เพื่อตอบว่าโต๊ะโล่งหรือมีของ ภาพไม่ถูกเก็บ ใช้แล้วทิ้ง
              ประหยัดไฟและรักษาความเป็นส่วนตัว
            </p>
          </div>
          <ThermalGrid />
        </div>
        <div className="scroll-x fusion-wrap">
          <table className="register fusion">
            <caption>Sensor fusion · ไม่มีเซนเซอร์ตัวไหนตอบได้ครบคนเดียว จึงต้องรวมกัน</caption>
            <thead>
              <tr>
                <th>เรดาร์</th>
                <th>Thermal</th>
                <th>กล้อง</th>
                <th>Gateway สรุปว่า</th>
              </tr>
            </thead>
            <tbody>
              {FUSION.map((row) => (
                <tr key={row.says}>
                  <td>{row.radar}</td>
                  <td>{row.thermal}</td>
                  <td>{row.camera}</td>
                  <td>
                    {row.ink ? (
                      <span className="hl" data-ink={row.ink === "yellow" ? undefined : row.ink}>
                        {row.says}
                      </span>
                    ) : (
                      row.says
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sheet section" id="bus" aria-labelledby="bus-title">
        <div className="section-head">
          <h2 id="bus-title">สัญญาณบนสาย</h2>
          <span className="ref">UART · I²C · PWM · ADC</span>
        </div>
        <div className="theory">
          <div className="theory-text">
            <p>
              สายระหว่างบอร์ดส่งได้แค่ไฟสูง (3.3 V = 1) กับไฟต่ำ (0 V = 0) ตามจังหวะ สิ่งที่ต่างกันในแต่ละแบบคือ <b>ใครกำหนดจังหวะ</b> และ <b>ใช้กี่สาย</b>
            </p>
            <ul className="theory-list">
              <li>
                <b>UART</b> ไม่มีสายนาฬิกา (asynchronous) ทั้งสองฝั่งตกลง baud rate กันไว้ แล้วใช้ start bit เป็นจุดเริ่มจับเวลา · TX ของฝั่งหนึ่งต่อเข้า RX
                ของอีกฝั่ง
              </li>
              <li>
                <b>I²C</b> มีสายนาฬิกา (synchronous) ที่ MCU เป็นคนตี อุปกรณ์หลายตัวใช้ 2 สายร่วมกัน แยกด้วยที่อยู่ สายเป็น open-drain จึงต้องมีตัวต้านทาน
                pull-up (โมดูลส่วนใหญ่ใส่มาแล้ว)
              </li>
              <li>
                <b>PWM</b> ส่งค่าด้วยความกว้างพัลส์ ฮาร์ดแวร์ LEDC ของ ESP32 สร้างให้เองโดยไม่กิน CPU
              </li>
              <li>
                <b>ADC</b> อ่านแรงดันแอนะล็อกตรง ๆ เป็นตัวเลข ต้องสุ่มอ่านถี่พอกับสิ่งที่อยากรู้ (เสียงพูดต้องหลายพันครั้งต่อวินาที)
              </li>
            </ul>
            <p className="note">ทุกบอร์ดต้องต่อ GND ร่วมกัน เพราะ “ไฟสูง” วัดเทียบกับ GND ถ้า GND ไม่ร่วม 1 กับ 0 จะเพี้ยน</p>
          </div>
          <WireScope />
        </div>
      </section>

      <section className="sheet section" id="mcu" aria-labelledby="mcu-title">
        <div className="section-head">
          <h2 id="mcu-title">ข้างใน ESP32-S3</h2>
          <span className="ref">ขั้น 2 · interrupt, task, queue</span>
        </div>
        <div className="theory">
          <div className="theory-text">
            <h3>Interrupt แทนการวนถาม</h3>
            <p>
              ถ้าโปรแกรมวนถามขา OUT ของเรดาร์ซ้ำ ๆ (polling) CPU จะเสียเวลาเปล่า และอาจพลาดถ้ากำลังทำอย่างอื่นอยู่ · interrupt ให้ฮาร์ดแวร์เรียกฟังก์ชัน ISR
              ทันทีที่ขาเปลี่ยน ISR ต้องสั้นที่สุด แค่ปลุก task แล้วออก งานหนักไปทำใน task
            </p>
            <h3>แบ่งงานเป็น task</h3>
            <p>
              FreeRTOS สลับหลาย task บน CPU ให้ดูเหมือนทำพร้อมกัน task ส่งข้อมูลให้กันผ่าน <b>queue</b> ไม่ใช้ตัวแปร global ร่วมกัน จึงไม่ชนกัน · ห้ามใช้{" "}
              <code>delay()</code> ยาว ๆ เพราะจะบล็อกทุกอย่าง ใช้ <code>vTaskDelay</code> ที่ยกเวลาให้ task อื่นแทน
            </p>
          </div>
          <figure className="code">
            <figcaption>
              <b>sensor_task.cpp</b> ร่างแนวคิด ยังไม่ใช่โค้ดจริง
            </figcaption>
            <pre>{ISR_CODE}</pre>
          </figure>
        </div>
        <div className="scroll-x">
          <table className="register">
            <caption>Task บน node</caption>
            <thead>
              <tr>
                <th>Task</th>
                <th>ทำงานเมื่อ</th>
                <th>ทำอะไร</th>
              </tr>
            </thead>
            <tbody>
              {TASKS.map((task) => (
                <tr key={task.name}>
                  <td>
                    <code>{task.name}</code>
                  </td>
                  <td>{task.when}</td>
                  <td>{task.job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sheet section" id="radio" aria-labelledby="radio-title">
        <div className="section-head">
          <h2 id="radio-title">ส่งทางวิทยุด้วย ESP-NOW</h2>
          <span className="ref">ขั้น 3 · 18 ไบต์</span>
        </div>
        <div className="theory">
          <div className="theory-text">
            <p>
              ESP-NOW ใช้วิทยุ Wi-Fi ตัวเดิมของ ESP32 ส่งข้อความสั้นถึงบอร์ดอื่นตรง ๆ ด้วย MAC address <b>ไม่ต้องต่อ router และไม่ต้องมี IP</b>{" "}
              ข้อความหนึ่งยาวได้ถึง 250 ไบต์ ของเรามี 18
            </p>
            <ul className="theory-list">
              <li>
                <b>ACK:</b> ผู้รับตอบกลับในระดับฮาร์ดแวร์ทันที send callback บอกฝั่งส่งว่าสำเร็จไหม ไม่สำเร็จก็ส่งซ้ำ (สูงสุด 3 ครั้ง) · seq ช่วยให้ gateway
                ทิ้งข้อความซ้ำ
              </li>
              <li>
                <b>ช่องสัญญาณต้องตรงกัน:</b> gateway ต่อ Wi-Fi ห้องสมุดด้วย วิทยุตัวเดียวจึงอยู่ได้ช่องเดียว node ต้องส่งบนช่องเดียวกับ access point
              </li>
              <li>
                <b>ทางกลับ:</b> gateway สั่ง node ด้วยข้อความสั้นกว่า <code>{"{ver, node_id, seq, cmd = SET_SIGN, face}"}</code>
              </li>
            </ul>
            <p className="note">ตัวอย่างไบต์ด้านขวาคือรายงานหนึ่งวินาทีหลังมีคนนั่งที่ D07 · โครงสร้างเต็มอยู่ใน Docs และ Build Plan ขั้น B2</p>
          </div>
          <PacketMap />
        </div>
      </section>

      <section className="sheet section" id="fsm" aria-labelledby="fsm-title">
        <div className="section-head">
          <h2 id="fsm-title">Gateway ตัดสินด้วย state machine</h2>
          <span className="ref">ขั้น 4 และ 7–8</span>
        </div>
        <div className="theory theory-wide">
          <div className="theory-text">
            <p>
              โต๊ะหนึ่งตัวอยู่ได้ทีละ <b>สถานะ</b> และเปลี่ยนสถานะเมื่อเงื่อนไขครบเท่านั้น gateway เก็บ state machine แยกต่อโต๊ะ พร้อมเวลาที่เห็นคนครั้งล่าสุด
              (จาก <code>millis()</code>) ทุกรายงานที่เข้ามาจะถูกเอามาเทียบกับเงื่อนไขในรูป
            </p>
            <p>
              ทำไมตัดสินที่ gateway ไม่ใช่ที่ node: กติกาอยู่ที่เดียว แก้ทีเดียวได้ทุกโต๊ะ, cloud เห็นความจริงชุดเดียว และ node เหลือหน้าที่แค่วัดกับหมุนป้าย
            </p>
          </div>
          <Enlarge openOnClick title="State machine ของโต๊ะหนึ่งตัวที่ gateway">
            <StateDiagram />
          </Enlarge>
        </div>
      </section>

      <section className="sheet section" id="actuate" aria-labelledby="actuate-title">
        <div className="section-head">
          <h2 id="actuate-title">หมุนป้ายด้วย servo</h2>
          <span className="ref">ขั้น 5 · PWM และไฟเลี้ยง</span>
        </div>
        <div className="theory-cols">
          <div className="theory-text">
            <h3>Servo คือระบบควบคุมแบบป้อนกลับในกล่องเล็ก ๆ</h3>
            <p>
              ข้างใน servo มีมอเตอร์ เฟือง และตัวต้านทานปรับค่าที่หมุนตามแกน วงจรข้างในเทียบมุมที่วัดได้กับมุมที่พัลส์สั่ง แล้วหมุนจนตรงกัน (closed loop) ·
              เราแค่ส่งพัลส์ 500–2500 µs ทุก 20 ms ดูได้ในแท็บ PWM ด้านบน
            </p>
            <p>
              ป้ายมี 3 หน้าห่างกัน 120° จึงต้องใช้ servo 270° · มีหมุดกันหมุนเกินที่ฐาน และหยุดส่งพัลส์หลังหมุนเสร็จ (timeout) servo จะได้ไม่เกร็งค้างจนร้อน
            </p>
          </div>
          <div className="theory-text">
            <h3>ทำไมต้องมีตัวเก็บประจุ 1000 µF</h3>
            <p>
              ตอน servo เริ่มหมุน มันดึงกระแสกระชากสูงชั่วขณะ (ระดับ 1–2 A) อแดปเตอร์ตอบสนองไม่ทัน แรงดัน 5 V จึงตกวูบ ถ้าตกต่ำพอ ESP32 จะ brownout แล้วรีเซ็ต
            </p>
            <p className="formula">
              ΔV = I · Δt / C = 2 A × 0.1 ms / 1000 µF = <b>0.2 V</b>
            </p>
            <p>
              ตัวเก็บประจุที่วางชิดขั้ว servo จ่ายกระแสช่วงสั้น ๆ นั้นแทน แรงดันจึงตกแค่ราว 0.2 V แทนที่จะตกจนบอร์ดดับ (ตัวเลขเป็นค่าประมาณเพื่อดูขนาด) · servo
              รับไฟจาก terminal block ตรงจากอแดปเตอร์ ไม่ผ่านบอร์ด และใช้ GND ร่วมกัน
            </p>
          </div>
        </div>
      </section>

      <section className="sheet section" id="cloud" aria-labelledby="cloud-title">
        <div className="section-head">
          <h2 id="cloud-title">ขึ้น cloud แล้วกลับลงมาที่จอ</h2>
          <span className="ref">ขั้น 6 และ 8</span>
        </div>
        <div className="theory">
          <div className="theory-text">
            <p>
              Gateway เป็นบอร์ดเดียวที่ต่ออินเทอร์เน็ต เมื่อสถานะโต๊ะเปลี่ยน มันส่งข้อมูล 1 แถวเป็น JSON ไปที่ REST API ของ Supabase ผ่าน <b>HTTPS</b>{" "}
              ซึ่งเข้ารหัสด้วย TLS (บอร์ดต้องรู้จัก root certificate ของ server) Supabase เก็บแถวลง Postgres แล้วใช้ <b>Realtime</b> ดันแถวใหม่ผ่าน WebSocket
              ไปที่หน้า dashboard ที่เปิดอยู่
            </p>
            <p>
              LINE ก็ใช้ HTTPS เหมือนกัน: gateway POST ข้อความไปที่ LINE Messaging API พร้อม token แล้ว LINE ส่งต่อถึงโทรศัพท์ · key และ token อยู่ใน{" "}
              <code>secrets.h</code> ที่ไม่ขึ้น GitHub
            </p>
            <p>
              ถ้าเน็ตหลุด gateway ยังตัดสินสถานะและสั่งป้ายได้ตามปกติ (ทุกอย่างในห้องใช้ ESP-NOW) แล้วเก็บแถวไว้ใน RAM ส่งตามทีหลังเมื่อเน็ตกลับมา
              (store-and-forward)
            </p>
          </div>
          <figure className="code">
            <figcaption>
              <b>ขั้น 6</b> แถวที่ gateway ส่ง (ตัวอย่าง)
            </figcaption>
            <pre>{JSON_ROW}</pre>
          </figure>
        </div>
        <div className="scroll-x">
          <table className="register budget">
            <caption>Latency budget · จากนั่งลงถึงจอเปลี่ยนสี (ค่าประมาณ ต้องวัดจริงในขั้น F)</caption>
            <thead>
              <tr>
                <th>ช่วง</th>
                <th className="num">ใช้เวลา</th>
                <th>เพราะ</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET.map((row) => (
                <tr key={row.hop}>
                  <td>{row.hop}</td>
                  <td className="num">{row.time}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>รวม</td>
                <td className="num">~61–63 s</td>
                <td>เกือบทั้งหมดคือการรอ 1 นาทีที่ตั้งใจไว้</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className="sheet section" aria-labelledby="words">
        <div className="section-head">
          <h2 id="words">ศัพท์ที่ใช้ในหน้านี้</h2>
          <span className="ref">Glossary</span>
        </div>
        <dl className="glossary">
          {GLOSSARY.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
        <p className="more">
          <Link href="/equipment">ดูอุปกรณ์ทุกชิ้น · Equipment</Link>
          <Link href="/build-plan">ลำดับการสร้าง · Build Plan</Link>
        </p>
      </section>
    </>
  );
}
