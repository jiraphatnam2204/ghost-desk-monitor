import type { Metadata } from "next";
import Link from "next/link";
import { FigureSide } from "@/components/figure-side";
import { Enlarge } from "@/components/enlarge";
import { GatewayFigure } from "@/components/figures/gateway/figure";
import { NodeFigure } from "@/components/figures/node/figure";
import { AccessoriesTable, Budget, MiscList, PartsList, ToolsTable } from "@/components/equipment";
import { BUDGET, baht } from "@/lib/equipment";
import "@/components/figure-side.css";
import "../pages.css";
import "./equipment.css";

export const metadata: Metadata = {
  title: "Equipment",
  description: "อุปกรณ์ทุกชิ้นของ Ghost-Desk Monitor รวมอุปกรณ์เสริมและเครื่องมือ: ใช้ทำอะไร ราคาเท่าไร สั่งแล้วหรือยัง และประกอบกันอย่างไร",
};

export default function EquipmentPage() {
  return (
    <>
      <header className="sheet page-head">
        <h1>Equipment</h1>
        <p className="lede">ของทั้งหมดสำหรับ 2 โต๊ะ + 1 gateway: ใช้ทำอะไร ราคาเท่าไร สั่งแล้วหรือยัง · กดแถวเพื่อดูรายละเอียด</p>
      </header>

      <section className="sheet section" aria-labelledby="parts">
        <div className="section-head">
          <h2 id="parts">Parts · ชิ้นส่วนหลัก</h2>
          <Link className="ref" href="/how-it-works/#sensors">
            sensor 6 ตัวทำงานอย่างไร
          </Link>
        </div>
        <Budget />
        <PartsList />
        <p className="note gap">ราคาเช็กจากหน้าร้าน 28–31 ต.ค. 2026 · ใบสั่งซื้อเต็มพร้อมรหัสสินค้าอยู่ใน docs/order-list.md</p>
      </section>

      <section className="sheet section" aria-labelledby="accessories">
        <div className="section-head">
          <h2 id="accessories">Accessories · อุปกรณ์เสริม</h2>
          <span className="ref">{baht(BUDGET.accessories)} บาท · สั่งแล้วครบ</span>
        </div>
        <AccessoriesTable />
      </section>

      <section className="sheet section" aria-labelledby="misc">
        <div className="section-head">
          <h2 id="misc">Small parts · ของจิปาถะ</h2>
          <span className="ref">~{baht(BUDGET.misc)} บาท (ประมาณ)</span>
        </div>
        <p className="lede section-lede">ทำต้นแบบจากของถูกก่อน เช่น ฟิวเจอร์บอร์ด ขาตั้งมือถือ แล้วค่อยทำตัวจริงเมื่อขนาดนิ่ง</p>
        <MiscList />
      </section>

      <section className="sheet section" aria-labelledby="tools">
        <div className="section-head">
          <h2 id="tools">Tools · เครื่องมือช่าง</h2>
          <span className="ref">cybertice · {baht(BUDGET.tools)} บาท</span>
        </div>
        <p className="lede section-lede">ต้องมีก่อนของถึง เพราะต้องบัดกรีขา FireBeetle, LD2410 และสายแจ็ก DC เอง · ถ้าในทีมมีอยู่แล้วตัดรายการนั้นออกได้</p>
        <ToolsTable />
      </section>

      <section className="sheet section" aria-labelledby="node">
        <div className="section-head">
          <h2 id="node">Sensor node · ที่โต๊ะ</h2>
          <span className="ref">× 2 · D01, D02</span>
        </div>
        <Enlarge>
          <div className="figure-row">
            <NodeFigure />
            <FigureSide
              figure="node"
              event="node-explode"
              apartLabel="ถอดประกอบดูข้างใน"
              note="ถอดออกเป็น 5 ชิ้นส่วนที่ถอดได้จริง สายไฟยังต่ออยู่และยืดตามชิ้นที่มันต่อ"
              parts={[
                { part: "radar", title: "S1 LD2410 · เรดาร์", text: "ใต้ขอบโต๊ะ จับการหายใจ จึงรู้ว่ามีคนแม้นั่งนิ่ง" },
                { part: "tof", title: "S2 VL53L1X · วัดระยะ", text: "วัดระยะลงที่เบาะเก้าอี้ มีคนนั่งระยะสั้นลง" },
                { part: "head", title: "S3 กล้อง OV2640", text: "ถ่ายภาพเดียวเมื่อ gateway ขอ ส่งไปถาม AI บน cloud · ภาพไม่ถูกเก็บ" },
                { part: "prism", title: "ป้ายปริซึม", text: "สามหน้า ชมพู ใช้งาน / เหลือง ไม่อยู่ / เขียว ว่าง" },
                { part: "servo", title: "Servo TD-7120MG", text: "หมุนป้ายไป 0° / 120° / 240°" },
                { part: "qr", title: "ป้าย QR", text: "เปิดหน้าสถานะโต๊ะและเพิ่มเพื่อน LINE" },
              ]}
              assemblies={[
                { part: "head", title: "ฝาครอบหัวกล้อง", text: "เลื่อนลงจากแผ่นหลังที่ห้อยจากแขน ช่องเลนส์และ VL53L1X อยู่ที่ฝาด้านหน้า" },
                { part: "board", title: "บอร์ด FireBeetle 2 + OV2640", text: "ขันสกรู 4 ตัวบนแผ่นหลัง กล้องต่อสาย FPC เข้าบอร์ด" },
                { part: "prism", title: "ป้ายปริซึม", text: "ยกขึ้นจากระหว่างแผ่นข้าง ปลายซ้ายเข้าบูช ปลายขวาสวมเพลา servo" },
                { part: "servo", title: "Servo TD-7120MG", text: "หูยึดสองข้างขันกับแผ่นข้างขวา" },
                { part: "radar", title: "LD2410", text: "ขันติดแผ่นหน้าโต๊ะใต้ขอบ ถอดลงมาได้" },
                { part: "qr", title: "การ์ด QR", text: "เสียบในร่องของฐาน ยกออกเพื่อเปลี่ยนการ์ด" },
              ]}
            />
          </div>
        </Enlarge>
      </section>

      <section className="sheet section" aria-labelledby="gateway">
        <div className="section-head">
          <h2 id="gateway">Gateway · ที่ห้อง</h2>
          <span className="ref">× 1</span>
        </div>
        <Enlarge>
          <div className="figure-row">
            <GatewayFigure />
            <FigureSide
              figure="gateway"
              event="gateway-explode"
              apartLabel="ถอดประกอบ gateway"
              note="บอร์ดทุกตัวยกขึ้นจากเสา standoff สายจัมเปอร์ยังเสียบอยู่และยืดตามบอร์ด"
              parts={[
                { part: "esp", title: "ESP32-S3 DevKitC-1", text: "Waveshare N8R8 รันโมเดล AI ตัดสินสถานะโต๊ะ ส่งข้อมูลขึ้น Supabase และส่ง LINE" },
                { part: "scd", title: "S4 SCD41 · CO₂", text: "CO₂ ในห้อง แสดงบน dashboard" },
                { part: "lux", title: "S6 BH1750 · วัดแสง", text: "แสงในห้อง แสดงบน dashboard" },
                { part: "mic", title: "S5 MAX4466 · ไมโครโฟน", text: "ระดับเสียง แสดงบน dashboard" },
              ]}
              assemblies={[
                { part: "esp", title: "ESP32-S3 DevKitC-1", text: "วางบนเสา standoff 4 ต้น ขา header ด้านหน้ารับสายจัมเปอร์ทุกเส้น" },
                { part: "scd", title: "SCD41", text: "บนเสา 4 ต้น รับ SDA / SCL จาก ESP32 แล้วต่อพ่วงไป BH1750" },
                { part: "lux", title: "BH1750", text: "บนเสา 4 ต้น ใช้ I²C สองเส้นเดียวกับ SCD41" },
                { part: "mic", title: "MAX4466", text: "บนเสา 4 ต้น ขา OUT เข้าขา ADC1 · ปุ่มหมุนปรับ gain" },
              ]}
            />
          </div>
        </Enlarge>
      </section>
    </>
  );
}
