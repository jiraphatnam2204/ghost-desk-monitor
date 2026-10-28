import type { Metadata } from "next";
import Link from "next/link";
import { FigureSide } from "@/components/figure-side";
import { GatewayFigure } from "@/components/figures/gateway/figure";
import { NodeFigure } from "@/components/figures/node/figure";
import { PartsRegister } from "@/components/parts-register";
import { PowerDiagram } from "@/components/power-diagram";
import { MISC, SUNDRIES, baht } from "@/lib/project";
import "@/components/figure-side.css";
import "../pages.css";
import "./equipment.css";

export const metadata: Metadata = {
  title: "Equipment",
  description: "อุปกรณ์ทุกชิ้นของ Ghost-Desk Monitor: sensor node และ gateway แบบถอดประกอบได้ รายการชิ้นส่วน ราคา และงบต่อคน",
};

export default function EquipmentPage() {
  return (
    <>
      <header className="sheet page-head">
        <h1>Equipment</h1>
        <p className="lede">
          ของทั้งหมดที่ต้องมี 2 ชุดโต๊ะ + 1 gateway · แตะรายการข้างรูปเพื่อดูชิ้นนั้นในรูป กดถอดประกอบเพื่อดูว่าประกอบกันอย่างไร แล้วเลื่อนลงไปดูราคาและงบต่อคน
        </p>
      </header>

      <section className="sheet section" aria-labelledby="node">
        <div className="section-head">
          <h2 id="node">Sensor node · ที่โต๊ะ</h2>
          <span className="ref">× 2 · D01, D02</span>
        </div>
        <div className="figure-row">
          <NodeFigure />
          <FigureSide
            figure="node"
            event="node-explode"
            apartLabel="ถอดประกอบดูข้างใน"
            note="ถอดออกเป็น 5 ชิ้นส่วนที่ถอดได้จริง สายไฟยังต่ออยู่และยืดตามชิ้นที่มันต่อ"
            parts={[
              { part: "radar", title: "LD2410", text: "เรดาร์ 24 GHz ใต้ขอบโต๊ะ จับการหายใจ จึงรู้ว่ามีคนแม้นั่งอ่านหนังสือนิ่ง ๆ" },
              { part: "thermal", title: "AMG8833", text: "ภาพความร้อน 8×8 บนหัวกล้อง แยกคนจริงออกจากกระเป๋า" },
              { part: "head", title: "กล้อง + AI บนบอร์ด", text: "จำแนก empty / person / items_only · โต๊ะโล่งปล่อยได้ทันที มีของค้างจึงนับ 30 นาที · ภาพไม่ออกจากบอร์ด" },
              { part: "prism", title: "ป้ายปริซึม", text: "สามหน้า ชมพู / เหลือง / เขียว หมุนรอบแกนเดียวระหว่างแผ่นข้างสองแผ่น มีหมุดกันหมุนเกิน" },
              { part: "servo", title: "Servo TD-7120MG", text: "ยึดนอกแผ่นข้างขวา เพลาผ่านรูเข้าปริซึม หมุนไป 0° / 120° / 240° ข้างกันมีตัวเก็บประจุ 1000 µF" },
              { part: "qr", title: "ป้าย QR", text: "เสียบในฐาน เปิดหน้าสถานะโต๊ะและลิงก์เพิ่มเพื่อน LINE Official Account" },
            ]}
            assemblies={[
              { part: "head", title: "ฝาครอบหัวกล้อง", text: "เลื่อนลงจากแผ่นหลังที่ห้อยจากแขน ช่องเลนส์และ AMG8833 อยู่ที่ฝาด้านหน้า" },
              { part: "board", title: "บอร์ด FireBeetle 2 + OV2640", text: "อยู่กับที่: ขันสกรู 4 ตัวบนแผ่นหลัง กล้องต่อสาย FPC เข้าบอร์ด สายไฟลงตามเสาไปขั้วต่อบนฐานป้าย" },
              { part: "prism", title: "ป้ายปริซึม", text: "ยกขึ้นจากระหว่างแผ่นข้าง ปลายซ้ายเข้าบูช ปลายขวาสวมเพลา servo" },
              { part: "servo", title: "Servo TD-7120MG", text: "หูยึดสองข้างขันกับแผ่นข้างขวา เลื่อนออกด้านข้างแล้วเห็นรูเพลา สายไฟยังต่อไปขั้วต่อ" },
              { part: "radar", title: "LD2410", text: "ขันติดแผ่นหน้าโต๊ะใต้ขอบ ถอดลงมาได้ เห็นรูสกรูที่แผ่นหน้า สายวิ่งตามแผ่นหน้าไปขาโต๊ะ" },
              { part: "qr", title: "การ์ด QR", text: "เสียบในร่องของฐาน ยกออกเพื่อเปลี่ยนการ์ด" },
            ]}
          />
        </div>
      </section>

      <section className="sheet section" aria-labelledby="gateway">
        <div className="section-head">
          <h2 id="gateway">Gateway · ที่ห้อง</h2>
          <span className="ref">× 1</span>
        </div>
        <div className="figure-row">
          <GatewayFigure />
          <FigureSide
            figure="gateway"
            event="gateway-explode"
            apartLabel="ถอดประกอบ gateway"
            note="บอร์ดทุกตัวยกขึ้นจากเสา standoff ที่ยังขันอยู่กับแผ่นฐาน สายจัมเปอร์ยังเสียบอยู่ที่ขาและยืดตามบอร์ด"
            parts={[
              { part: "esp", title: "YD-ESP32-23", text: "บอร์ดจาก Lab 10 เป็นเจ้าของ state machine และเวลา 2 / 20 / 30 นาทีของทุกโต๊ะ รับ ESP-NOW ส่งข้อมูลขึ้น Supabase และส่ง LINE" },
              { part: "scd", title: "SCD41", text: "CO₂ ในห้อง ใช้ดูคุณภาพอากาศและประมาณว่าห้องแน่นแค่ไหน" },
              { part: "lux", title: "BH1750", text: "แสงในห้อง ใช้ I²C สองเส้นเดียวกับ SCD41" },
              { part: "mic", title: "MAX4466", text: "ระดับเสียง อ่านด้วย analogRead แบบ Lab 8 แจ้ง staff ถ้า quiet zone ดังเกิน" },
            ]}
            assemblies={[
              { part: "esp", title: "YD-ESP32-23", text: "วางบนเสา standoff 4 ต้น ถอดสาย USB-C ออกจากคลิปที่ขอบแผ่นได้ ขา header ด้านหน้ารับสายจัมเปอร์ทุกเส้น" },
              { part: "scd", title: "SCD41", text: "บอร์ดเล็กบนเสา 4 ต้น ขา header 5 ขาทางซ้าย รับ SDA / SCL จาก ESP32 แล้วต่อพ่วงไป BH1750" },
              { part: "lux", title: "BH1750", text: "บอร์ดเล็กบนเสา 4 ต้น ขา header 5 ขาด้านหลัง ใช้ I²C สองเส้นเดียวกับ SCD41" },
              { part: "mic", title: "MAX4466", text: "บอร์ดไมค์บนเสา 4 ต้น ขา 3 ขา: OUT เข้าขา ADC1, VCC, GND · ปุ่มหมุนบนบอร์ดปรับ gain" },
            ]}
          />
        </div>
      </section>

      <section className="sheet section" aria-labelledby="power">
        <div className="section-head">
          <h2 id="power">Power per desk · ทำไมต้องมีตัวเก็บประจุ</h2>
          <span className="ref">ขั้น C4 ใน Build Plan</span>
        </div>
        <div className="power">
          <figure className="power-figure">
            <PowerDiagram />
            <figcaption>อแดปเตอร์ตัวเดียวต่อโต๊ะ แยกไฟไปบอร์ดและ servo · ตัวเก็บประจุคร่อมไฟ servo ใกล้ขั้ว servo · GND ทุกจุดต่อถึงกัน</figcaption>
          </figure>
          <div className="power-notes">
            <p className="lede">
              servo กินกระแสกระชากสูงมากในเสี้ยววินาทีที่เริ่มหมุน ถ้าอแดปเตอร์ส่งไม่ทัน ไฟ 5 V จะตกวูบ บอร์ด ESP32 ที่ใช้สายเส้นเดียวกันจะ <b>รีเซ็ต (brown-out)</b> กลางคัน
            </p>
            <ol className="power-points">
              <li>
                <b>ตัวเก็บประจุ 1000 µF</b> เหมือนถังน้ำเล็ก ๆ ข้าง servo: เก็บไฟไว้แล้วจ่ายกระแสช่วงกระชากแทนอแดปเตอร์ แรงดันจึงไม่ตก
              </li>
              <li>
                <b>ต่อคร่อม + กับ −</b> ของไฟ servo ให้ใกล้ขั้ว servo ที่สุด · ขาสั้นหรือแถบข้างตัวคือขาลบ ต่อกลับขั้วแล้วเสีย
              </li>
              <li>
                <b>servo ไม่ดึงไฟผ่านบอร์ด:</b> แยกจาก terminal block ตรงไป servo เลย
              </li>
              <li>
                <b>GND ร่วม:</b> GND ของอแดปเตอร์ บอร์ด และ servo ต้องต่อถึงกัน สัญญาณ PWM จึงอ่านถูก
              </li>
              <li>
                <b>ทดสอบ:</b> สั่งหมุน 0° → 120° → 240° 50 รอบ ขณะกล้องและ Wi-Fi ทำงาน ต้องไม่มีข้อความ brown-out ใน Serial Monitor
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="sheet section" aria-labelledby="misc">
        <div className="section-head">
          <h2 id="misc">Mechanical & small parts · ชิ้นส่วนจิปาถะ</h2>
          <span className="ref">อยู่ในงบจิปาถะ ~{baht(SUNDRIES)} บาท (ประมาณ)</span>
        </div>
        <p className="lede misc-lede">
          ของที่ไม่มีในร้านเป็นชิ้นเดียว แต่ต้องมีให้ครบก่อนประกอบจริง ทำต้นแบบจากของถูก (ฟิวเจอร์บอร์ด ขาตั้งมือถือ) ก่อน แล้วค่อยทำตัวจริงเมื่อขนาดนิ่ง ถ้าพิมพ์ 3D หรือตัดอะคริลิก งบอาจเกิน ~{baht(SUNDRIES)} ให้เช็กราคาก่อน
        </p>
        <ol className="misc">
          {MISC.map((item) => (
            <li key={item.id} id={`misc-${item.id}`}>
              <div className="misc-name">
                <h3>{item.name}</h3>
                <span className="part-where">
                  {item.where === "node" ? "Sensor node" : item.where === "gateway" ? "Gateway" : "ทั้งสองฝั่ง"} · {item.qty}
                </span>
              </div>
              <dl className="misc-facts">
                <div>
                  <dt className="field-label">ไว้ทำอะไร · Job</dt>
                  <dd>{item.job}</dd>
                </div>
                <div>
                  <dt className="field-label">ทำ / ซื้ออย่างไร · Make</dt>
                  <dd>{item.make}</dd>
                </div>
                {item.watch ? (
                  <div className="misc-watch">
                    <dt className="field-label">ระวัง · Watch out</dt>
                    <dd>{item.watch}</dd>
                  </div>
                ) : null}
              </dl>
              <Link className="misc-step" href={`/build-plan/#step-${item.step}`}>
                ขั้น {item.step}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="sheet section" aria-labelledby="bom">
        <div className="section-head">
          <h2 id="bom">Parts & budget</h2>
          <span className="ref">กรองรายการ · ปรับงบ</span>
        </div>
        <PartsRegister />
      </section>
    </>
  );
}
