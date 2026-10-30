import type { Metadata } from "next";
import Link from "next/link";
import { Enlarge } from "@/components/enlarge";
import { RoomFigure } from "@/components/figures/room/figure";
import { SignalLadder, SignalStep } from "@/components/signal-story";
import { PacketMap } from "@/components/theory/packet-map";
import { StateDiagram } from "@/components/theory/state-diagram";
import { SenseFeatures } from "@/components/theory/sense-features";
import { WireScope } from "@/components/theory/wire-scope";
import { SENSORS } from "@/lib/sensors";
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
    gets: "พลังงาน 9 ช่วงระยะ × 2 (ขยับ/นิ่ง) 10 ครั้ง/วินาที",
  },
  {
    real: "ระยะถึงเบาะเก้าอี้",
    part: "VL53L1X ToF เลเซอร์ 940 nm",
    signal: "จับเวลาแสงสะท้อนกลับ → ชิปคำนวณระยะเอง",
    bus: "I²C ที่อยู่ 0x29 + ขา GPIO1",
    gets: "ระยะ mm 10 ครั้ง/วินาที",
  },
  {
    real: "แสงที่สะท้อนจากโต๊ะ",
    part: "OV2640 กล้อง",
    signal: "พิกเซลทีละไบต์แบบขนาน",
    bus: "DVP: 8 สายข้อมูล + PCLK, VSYNC, HREF",
    gets: "ภาพ JPEG → gateway → cloud AI",
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
  { radar: "หายใจที่ช่วง 0–1", tof: "สั้น (~45 cm)", local: "person", camera: "—", says: "มีคน", ink: "pink" },
  {
    radar: "ไม่มีจังหวะหายใจ 2 นาที",
    tof: "สั้นหรือถึงเบาะ",
    local: "empty",
    camera: "items_only",
    says: "ไม่อยู่ (ทิ้งของ)",
    ink: "yellow",
  },
  {
    radar: "ไม่มีจังหวะหายใจ 2 นาที",
    tof: "ถึงเบาะ (~90 cm)",
    local: "empty",
    camera: "empty",
    says: "ว่าง",
    ink: "green",
  },
  {
    radar: "หายใจที่ช่วง 2–3",
    tof: "ถึงเบาะ",
    local: "nearby",
    camera: "—",
    says: "ไม่นับ: คนโต๊ะข้าง ๆ หรือเดินผ่าน",
    ink: null,
  },
];

const TASKS = [
  {
    name: "radar",
    when: "10 ครั้ง/วินาที และเมื่อ ISR ปลุก",
    job: "อ่านเฟรม UART โหมด engineering: พลังงาน 9 ช่วงระยะ × 2 แล้วใส่ queue",
  },
  {
    name: "tof",
    when: "ทุก 100 ms (ขา GPIO1 บอกว่าค่าพร้อม)",
    job: "อ่านระยะจาก VL53L1X ผ่าน I²C แล้วใส่ queue",
  },
  {
    name: "radio",
    when: "ครบ 10 ค่า (ทุก 1 วินาที)",
    job: "รวมค่าจาก queue เป็น node_batch_t ส่ง ESP-NOW รอ ACK และ retry",
  },
  {
    name: "camera",
    when: "เมื่อ gateway สั่ง SNAP",
    job: "ถ่าย 1 ภาพ JPEG แล้ว HTTP POST ให้ gateway ผ่าน Wi-Fi วงเดียวกัน · ภาพไม่ถูกเก็บ",
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
    why: "210 ไบต์บนอากาศ ทุก 1 วินาที (+ retry ถ้าไม่ได้ ACK)",
  },
  {
    hop: "โมเดล AI บน gateway",
    time: "< 0.1 s",
    why: "โครงข่ายเล็กมาก รันทุกวินาทีต่อโต๊ะ",
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
    term: "ToF",
    text: "Time of Flight วัดระยะจากเวลาที่แสงเลเซอร์ใช้วิ่งไปกระทบวัตถุแล้วกลับมา · ที่นี่คือ VL53L1X",
  },
  {
    term: "Edge Impulse",
    text: "เว็บสำหรับเก็บข้อมูล เทรนโมเดล AI ขนาดเล็ก แล้ว export เป็น Arduino library ไปรันบน ESP32 โดยไม่ต้องเขียนโค้ด ML เอง",
  },
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
  "ai_local": "person",
  "ai_conf": 94,
  "ai_cloud": null,
  "tof_mm": 452,
  "seq": 1042
}`;

const ISR_CODE = `// เรดาร์ดึงขา OUT ขึ้นเมื่อเห็นคน: ปลุก task แทนการวนถาม
void IRAM_ATTR onRadarOut() {
  BaseType_t woke = pdFALSE;
  xSemaphoreGiveFromISR(radarSem, &woke);   // สั้นที่สุด: แค่ส่งสัญญาณ
  portYIELD_FROM_ISR(woke);
}

void radarTask(void *) {
  for (;;) {
    xSemaphoreTake(radarSem, pdMS_TO_TICKS(100));  // ตื่นเมื่อ ISR ปลุก หรือทุก 100 ms
    Reading r = readRadarFrame();                  // UART
    readEngineering(r.move_e, r.still_e);          // 9 ช่วงระยะ × 2
    xQueueSend(readings, &r, 0);                   // ให้ radio task รวมเป็นชุดละ 10 ค่า
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
          ทุกรูปและตัวเลขจำลองตามแบบที่วางไว้ ยังไม่ใช่ค่าที่วัดจากเครื่องจริง · AI มีสองตัว: โมเดลบน gateway จากข้อมูลเรดาร์ + ToF และ cloud AI ที่ดูภาพจากกล้อง
          เฉพาะตอนตัดสิน (ดู <Link href="/problems/#P1">P1</Link>)
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
              · ในโหมด engineering เรดาร์บอกพลังงานแยกทีละช่วงระยะ จึงรู้ว่าจังหวะหายใจมาจากเก้าอี้ของโต๊ะนี้ (ช่วง 0–1) หรือจากโต๊ะข้าง ๆ (ช่วง 2–3)
            </p>
            <h3>ToF: วัดระยะลงไปที่เบาะ</h3>
            <p>
              VL53L1X ยิงแสงเลเซอร์อินฟราเรด 940 nm ที่ตามองไม่เห็น แล้วจับเวลาที่แสงสะท้อนกลับมา <i>d = c · t / 2</i> แสงวิ่งเร็วมาก 1 m ใช้แค่ราว 6.7 ns
              ชิปจึงจับเวลาแทนเราแล้วตอบเป็นมิลลิเมตร · เล็งลงที่เบาะ: เก้าอี้ว่างได้ระยะถึงเบาะ มีคนนั่งระยะสั้นลงมาก และขยับเล็กน้อยตามลมหายใจ
            </p>
            <h3>AI สองตัว แบ่งงานกัน</h3>
            <p>
              <b>AI local บน gateway</b> (Edge Impulse) ดูข้อมูลเรดาร์ + ToF ย้อนหลัง 5 วินาทีของแต่ละโต๊ะทุกวินาที แล้วตอบ person / empty / nearby
              ข้อมูลตามเวลาทำให้มันเห็นจังหวะหายใจ ซึ่งกติกา if-else ธรรมดาทำได้ยาก · <b>Cloud AI</b> ดูภาพจากกล้องแค่ตอนที่ต้องตัดสิน
              คือไม่เห็นคนครบ 2 นาที และนาทีที่ 30 เพื่อตอบว่าโต๊ะโล่งหรือมีของค้าง ภาพไม่ถูกเก็บ
            </p>
          </div>
          <SenseFeatures />
        </div>
        <div className="scroll-x fusion-wrap">
          <table className="register fusion">
            <caption>Sensor fusion · ไม่มีเซนเซอร์ตัวไหนตอบได้ครบคนเดียว จึงต้องรวมกัน</caption>
            <thead>
              <tr>
                <th>เรดาร์</th>
                <th>ToF</th>
                <th>AI local</th>
                <th>Cloud AI (ภาพ)</th>
                <th>Gateway สรุปว่า</th>
              </tr>
            </thead>
            <tbody>
              {FUSION.map((row) => (
                <tr key={row.says}>
                  <td>{row.radar}</td>
                  <td>{row.tof}</td>
                  <td>
                    <code>{row.local}</code>
                  </td>
                  <td>{row.camera === "—" ? row.camera : <code>{row.camera}</code>}</td>
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

      <section className="sheet section" id="sensors" aria-labelledby="sensors-title">
        <div className="section-head">
          <h2 id="sensors-title">เซนเซอร์แต่ละตัวทำงานอย่างไร</h2>
          <span className="ref">6 ชนิด · S1–S6 ตามหน้า Equipment</span>
        </div>
        <p className="lede">
          เซนเซอร์ทุกตัวทำสิ่งเดียวกัน: เปลี่ยนปริมาณจริง (คลื่น แสง ก๊าซ เสียง) เป็นไฟฟ้า แล้วแปลงเป็นตัวเลขให้ ESP32-S3 อ่าน การ์ดแต่ละใบบอกหลักการ, ค่าที่บอร์ดได้รับ
          และเรื่องที่ต้องระวังตอนใช้งานจริง
        </p>
        <ol className="sensor-cards">
          {SENSORS.map((sensor) => (
            <li className="sensor-card" key={sensor.no}>
              <div className="sensor-card-head">
                <span className="sensor-no">{sensor.no}</span>
                <div>
                  <h3>{sensor.name}</h3>
                  <p className="sensor-kind">
                    {sensor.kind} · {sensor.where === "node" ? "Sensor node" : "Gateway"}
                  </p>
                </div>
              </div>
              <dl>
                <div>
                  <dt className="field-label">วัดอะไร</dt>
                  <dd>{sensor.measures}</dd>
                </div>
                <div>
                  <dt className="field-label">ทำงานอย่างไร</dt>
                  <dd>{sensor.principle}</dd>
                </div>
                <div>
                  <dt className="field-label">บอร์ดได้อะไร</dt>
                  <dd>{sensor.reads}</dd>
                </div>
                <div>
                  <dt className="field-label">ระวัง</dt>
                  <dd>{sensor.watch}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
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
          <span className="ref">ขั้น 3 · 210 ไบต์ทุก 1 วินาที</span>
        </div>
        <div className="theory">
          <div className="theory-text">
            <p>
              ESP-NOW ใช้วิทยุ Wi-Fi ตัวเดิมของ ESP32 ส่งข้อความสั้นถึงบอร์ดอื่นตรง ๆ ด้วย MAC address <b>ไม่ต้องต่อ router และไม่ต้องมี IP</b>{" "}
              ข้อความหนึ่งยาวได้ถึง 250 ไบต์ ของเรามี 210: node อ่านค่า 10 ครั้งต่อวินาทีแล้วส่งรวมเป็นชุด โมเดลจึงเห็นจังหวะหายใจ (รอบละ 3–5 วินาที)
              ซึ่งการส่งทีละค่าทุก 2 วินาทีจะมองไม่เห็น
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
                <b>ทางกลับ:</b> gateway สั่ง node ด้วยข้อความสั้นกว่า <code>{"{ver, node_id, seq, cmd = SET_SIGN | SNAP, face}"}</code> · ภาพจากคำสั่ง
                SNAP ใหญ่เกิน ESP-NOW จึงส่งทาง HTTP บน Wi-Fi วงเดียวกันแทน
              </li>
            </ul>
            <p className="note">ตัวอย่างไบต์ด้านขวาคือชุดข้อมูลหนึ่งวินาทีหลังมีคนนั่งที่ D07 · โครงสร้างเต็มอยู่ใน Docs และ Build Plan ขั้น B2</p>
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
              (จาก <code>millis()</code>) ทุกวินาทีผลของ AI local จะถูกเอามาเทียบกับเงื่อนไขในรูป และเมื่อต้องตัดสินว่าโต๊ะโล่งหรือมีของ gateway ถามผล cloud AI
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
              Cloud AI ก็ใช้ HTTPS เหมือนกัน: gateway ส่งภาพที่ได้จาก node พร้อมคำสั่งให้ตอบคำเดียว (empty / person / items_only) ไปที่ vision API
              ถ้าไม่ตอบใน 10 วินาทีหรือตอบผิดรูปแบบ gateway ใช้กติกา 30 นาทีแทน
            </p>
            <p>
              ถ้าเน็ตหลุด gateway ยังรันโมเดล ตัดสินสถานะ และสั่งป้ายได้ตามปกติ (ทุกอย่างในห้องใช้ ESP-NOW) แล้วเก็บแถวไว้ใน RAM ส่งตามทีหลังเมื่อเน็ตกลับมา
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
