// Everything the build needs, what it costs and whether it is ordered: the Equipment page and docs/order-list.md.
// Prices were checked on the shop pages 28–31 Oct 2026; orders were placed on 31 Oct 2026.

export type Level = "ง่าย" | "กลาง" | "ยาก";
export type Order = "ordered" | "partial" | "pending" | "have";

export const ORDER_LABEL: Record<Order, string> = {
  ordered: "สั่งแล้ว",
  partial: "สั่งแล้วบางส่วน",
  pending: "ยังไม่สั่ง",
  have: "มีแล้ว",
};

/* ---------- main parts ---------- */

export interface Part {
  id: string;
  name: string;
  use: string;
  order: Order;
  orderNote?: string;
  where: "node" | "gateway";
  role: string;
  bus: string;
  library: string;
  start: string;
  level: Level;
  shop: string;
  url?: string;
  price: number;
  qty: number;
  why: string;
  note?: string;
}

export const PARTS: Part[] = [
  {
    id: "firebeetle",
    name: "FireBeetle 2 ESP32-S3 + กล้อง OV2640",
    use: "สมองของ node และกล้องถ่ายโต๊ะ",
    order: "partial",
    orderNote: "สั่งแล้ว 1 จาก 2 · ตัวที่ 2 สั่งหลัง PoC ผ่าน ภายใน 13 พ.ย.",
    where: "node",
    role: "สมองของ node: อ่านเรดาร์และ ToF 10 ครั้ง/วินาทีส่งให้ gateway, ถ่ายภาพเมื่อ gateway ขอ, สั่ง servo",
    bus: "กล้องต่อสาย FPC มากับบอร์ด",
    library: "esp32 core 3.x (มี esp_camera และ HTTPClient)",
    start: "ตัวอย่าง CameraWebServer ของ esp32 core (แก้ขากล้องตาม wiki ของ DFRobot)",
    level: "กลาง",
    shop: "arduitronics",
    url: "https://www.arduitronics.com/product/5665/firebeetle-2-esp32-s3-ai-board-with-ov2640-camera-image-recognition-ble-5-%E0%B9%81%E0%B8%97%E0%B9%89%E0%B8%88%E0%B8%B2%E0%B8%81-dfrobot",
    price: 1185,
    qty: 2,
    why: "กล้องมากับบอร์ด (นับเป็น sensor 1 ชนิดตาม FAQ ข้อ 6) · PSRAM 8 MB พอพักภาพ JPEG ก่อนส่ง · ขาว่างเหลือพอ · มีของในไทย",
    note: "ภาพไม่ถูกเก็บ: ถ่ายเฉพาะตอน gateway ขอ แล้วส่งให้ gateway ผ่าน Wi-Fi วงเดียวกัน",
  },
  {
    id: "ld2410",
    name: "HLK-LD2410 mmWave 24 GHz",
    use: "จับว่ามีคนนั่ง แม้นั่งนิ่ง (จากการหายใจ)",
    order: "ordered",
    where: "node",
    role: "รู้ว่ามีคนนั่งแม้นั่งนิ่ง เพราะจับการหายใจได้ (PIR ทำไม่ได้) · โหมด engineering ให้พลังงาน 9 ช่วงระยะ × 2 (ขยับ/นิ่ง) เป็น feature หลักของโมเดล AI ที่ gateway",
    bus: "UART + ขา OUT (ใช้ทำ interrupt)",
    library: "MyLD2410 (iavorvel) อ่านโหมด engineering ได้ · ld2410 (ncmreynolds) ยังอ่านข้อมูลโหมดนี้ไม่ได้",
    start: "ตัวอย่าง sensor_data ในไลบรารี MyLD2410 + ขา OUT แบบ ISR เหมือน Lab 10",
    level: "ง่าย",
    shop: "allnewstep",
    url: "https://www.allnewstep.com/product/5388/%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%99%E0%B8%B8%E0%B8%A9%E0%B8%A2%E0%B9%8C-hlk-ld2410-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%99%E0%B8%A2%E0%B8%B3%E0%B8%AA%E0%B8%B9%E0%B8%87-%E0%B9%82%E0%B8%A1%E0%B8%94%E0%B8%B9%E0%B8%A5%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%AB%E0%B8%A7-fmcw-human-presence-sensor-",
    price: 180,
    qty: 2,
    why: "ขา OUT ให้ทำ E2 (ISR) ได้ทันที · ราคาถูก · มีไลบรารีพร้อมใช้ ไม่ต้องเขียน parser เอง",
  },
  {
    id: "vl53l1x",
    name: "VL53L1X วัดระยะด้วยแสงเลเซอร์ (ToF)",
    use: "วัดระยะลงที่เบาะเก้าอี้ มีคนนั่งระยะจะสั้นลง",
    order: "ordered",
    where: "node",
    role: "วัดระยะจากหัว node ลงไปที่เบาะเก้าอี้: มีคนนั่งระยะจะสั้นลงและขยับตามการหายใจ · ป้อนโมเดล AI ที่ gateway คู่กับเรดาร์",
    bus: "I²C + ขา GPIO1 (data ready)",
    library: "VL53L1X (Pololu) หรือ SparkFun VL53L1X",
    start: "ตัวอย่าง Continuous ในไลบรารี อ่านระยะ 10 ครั้ง/วินาที",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/product/5302/vl53l1x-%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B0%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C-%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%99%E0%B8%A2%E0%B8%B3%E0%B8%AA%E0%B8%B9%E0%B8%87-laser-ranging-sensor-module-%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B0%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A-0-400cm",
    price: 210,
    qty: 2,
    why: "แทน AMG8833 ที่ยืมจากวิชาไม่ได้ (1,650 บาท/ตัว) · วัดได้ไกล 4 m และตั้งกรอบมองให้แคบได้ จึงเล็งเฉพาะเก้าอี้ของโต๊ะนี้ · VL53L0X ถูกกว่า แต่วัดได้ใกล้กว่าและทนแสงแดดน้อยกว่า",
    note: "เสื้อสีดำสะท้อนแสงน้อย: เก็บข้อมูลเทรนให้มีเสื้อหลายสี",
  },
  {
    id: "servo",
    name: "TD-7120MG servo 0–270°",
    use: "หมุนป้ายปริซึม 3 หน้า",
    order: "ordered",
    where: "node",
    role: "หมุนป้ายปริซึม 3 หน้า ไปที่ 0° / 120° / 240°",
    bus: "PWM 1 ขา",
    library: "ESP32Servo (ตั้งช่วงพัลส์ 500–2500 µs ให้ครบ 270°)",
    start: "ตัวอย่าง Sweep ของ ESP32Servo",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/product/5406/td-7120mg-servo-motor-0-270%E0%B8%AD%E0%B8%87%E0%B8%A8%E0%B8%B2-%E0%B9%80%E0%B8%9F%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%82%E0%B8%A5%E0%B8%AB%E0%B8%B0%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94-%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%9A%E0%B8%B4%E0%B8%94%E0%B8%AA%E0%B8%B9%E0%B8%87%E0%B8%AA%E0%B8%B8%E0%B8%94-20kg",
    price: 440,
    qty: 2,
    why: "หมุนถึงหน้าที่ 3 (240°) ได้ ใช้ขาเดียว · servo 180° ธรรมดาไปไม่ถึง",
    note: "กฎ safety: มีหมุดกันหมุนเกิน และ timeout ของคำสั่งหมุน",
  },
  {
    id: "adapter-node",
    name: "อแดปเตอร์ 5V 2A",
    use: "ไฟเลี้ยงโต๊ะละ 1 ตัว",
    order: "ordered",
    where: "node",
    role: "ไฟเลี้ยงโต๊ะละตัว: กล้อง + Wi-Fi + servo กินไฟพร้อมกัน",
    bus: "แจ็ก 5.5×2.5",
    library: "—",
    start: "ใส่ตัวเก็บประจุ 1000 µF ข้าง servo, ต่อ GND ร่วม",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/product/365/power-adapter-5v-2a-%E0%B8%AD%E0%B8%B0%E0%B9%81%E0%B8%94%E0%B8%9B%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C-5v-%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%AA-2a-%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B9%81%E0%B8%88%E0%B9%87%E0%B8%84-5-5x2-5mm",
    price: 130,
    qty: 2,
    why: "ไฟจาก USB โน้ตบุ๊กไม่พอตอน servo หมุน",
  },
  {
    id: "yd-esp32",
    name: "Waveshare ESP32-S3-DEV-KIT-N8R8",
    use: "สมองของ gateway รันโมเดล AI ส่งข้อมูลขึ้น cloud",
    order: "ordered",
    where: "gateway",
    role: "สมองของ gateway: รันโมเดล AI (E7), state machine, ตัวจับเวลา 2/20/30 นาที, ส่งภาพไปถาม cloud AI, ส่งข้อมูลขึ้น cloud, ส่ง LINE",
    bus: "Wi-Fi + ESP-NOW",
    library: "esp32 core 3.x (ESP-NOW, WiFiClientSecure, HTTPClient, WebServer) + ไลบรารีที่ Edge Impulse export ให้",
    start: "ผังขาแบบ DevKitC-1 เหมือน YD-ESP32-23 ของ Lab 10 · Tools: ESP32S3 Dev Module, Flash Size 8MB (ไม่ใช่ 16MB), PSRAM OPI",
    level: "กลาง",
    shop: "arduitronics",
    url: "https://www.arduitronics.com/product/5932/esp32-s3-microcontroller-2-4ghz-wi-fi-development-board-240mhz-dual-core-processor-esp32-s3-wroom-1-",
    price: 685,
    qty: 1,
    why: "Waveshare แท้ มี wiki · ESP32-S3-WROOM-1 N8R8 มี PSRAM 8 MB พอรันโมเดลและพักภาพก่อนส่ง cloud · ผังขา DevKitC-1 ตรงกับ pin map ขั้น A4 · ซื้อเองแทนการยืมบอร์ด Lab 10",
    note: "รหัสสินค้า BA00293 · แพงกว่าบอร์ดไม่มียี่ห้อ (cybertice M1622, 280) แต่รู้ผู้ผลิตและมีเอกสาร · ระหว่างรอของ ใช้บอร์ด Lab 10 ของใครก็ได้ โค้ดเดียวกัน",
  },
  {
    id: "scd41",
    name: "SCD41 CO₂",
    use: "วัด CO₂ ในห้อง แสดงบน dashboard",
    order: "ordered",
    where: "gateway",
    role: "แสดงบน dashboard: คุณภาพอากาศในห้อง และใช้ประมาณความหนาแน่นของคน",
    bus: "I²C (bus เดียวกับ BH1750)",
    library: "Sensirion I2C SCD4x",
    start: "ตัวอย่าง exampleUsage",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/category/30/modules-sensors/%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%81%E0%B8%81%E0%B9%8A%E0%B8%AA",
    price: 820,
    qty: 1,
    why: "ถูกกว่า MH-Z19C ในร้านที่เช็ก · I²C ไม่เปลืองขา · วัดอุณหภูมิ/ความชื้นในตัว",
    note: "cybertice ของหมด · สั่งจาก Shopee แล้ว 31 ต.ค. (P2) · ราคาในรายการยังเป็นของ cybertice",
  },
  {
    id: "max4466",
    name: "ไมค์อนาล็อก MAX4466",
    use: "วัดระดับเสียงในห้อง",
    order: "ordered",
    where: "gateway",
    role: "แสดงบน dashboard: ระดับเสียงในห้อง แจ้ง staff ถ้า quiet zone ดังเกิน",
    bus: "ADC 1 ขา",
    library: "ไม่ต้องใช้: analogRead()",
    start: "โค้ดอ่าน ADC แบบ Lab 8 แล้วหาค่า peak-to-peak ทุก 50 ms",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/product/2057/electret-microphone-sound-sencor-amplifier-max4466-%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%84%E0%B8%A7%E0%B8%AA%E0%B8%B9%E0%B8%87",
    price: 65,
    qty: 1,
    why: "อ่านด้วย analogRead ที่ทำมาแล้วใน Lab 8 แทนไมค์ I²S (INMP441) ที่ต้องตั้งค่า I²S เอง",
    note: "รหัสสินค้า M0571 · ถ้าอยากลอง I²S ใช้ INMP441 (95 บาท) แทนได้",
  },
  {
    id: "bh1750",
    name: "GY-302 BH1750 วัดแสง",
    use: "วัดแสงในห้อง",
    order: "ordered",
    where: "gateway",
    role: "แสดงบน dashboard: แสงในห้อง และบอกช่วงเปิด/ปิดไฟ",
    bus: "I²C",
    library: "BH1750 (claws)",
    start: "ตัวอย่าง BH1750test",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/product/784/gy-302-%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C-%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%A1%E0%B9%81%E0%B8%AA%E0%B8%87-ambient-light-sensor-module-bh1750fvi",
    price: 50,
    qty: 1,
    why: "gateway ต้องมี sensor ของตัวเอง ≥ 2 ชนิด ตัวนี้ทำให้ยังครบถ้าวันหนึ่งตัด SCD41 · ถูกที่สุดในรายการ",
  },
  {
    id: "adapter-gw",
    name: "ที่ชาร์จมือถือ 5V + สาย USB-C",
    use: "ไฟเลี้ยง gateway",
    order: "have",
    where: "gateway",
    role: "ไฟเลี้ยง gateway ตลอดการรัน 24 ชม.",
    bus: "USB-C",
    library: "—",
    start: "—",
    level: "ง่าย",
    shop: "ใช้ของที่มีอยู่",
    price: 0,
    qty: 1,
    why: "รันต่อเนื่อง 24 ชม. โดยไม่พึ่งโน้ตบุ๊ก · บอร์ด gateway รับไฟทาง USB-C อแดปเตอร์หัวกลม 5.5×2.5 ของ node จึงเสียบไม่ได้",
  },
];

export const lineTotal = (item: { price: number; qty: number }) => item.price * item.qty;

/* ---------- accessories: small bought parts, all ordered 31 Oct ---------- */

export interface Accessory {
  code: string;
  name: string;
  use: string;
  shop: string;
  price: number;
  qty: number;
  order: Order;
}

export const ACCESSORIES: Accessory[] = [
  { code: "E0044", name: "ตัวเก็บประจุ 1000 µF 50V", use: "ติดข้าง servo กันบอร์ดรีเซ็ต", shop: "cybertice", price: 6, qty: 2, order: "ordered" },
  { code: "A1121", name: "บอร์ดแปลงขา 8-pin 1.27/2.0 → 2.54 mm", use: "ให้ LD2410 เสียบ breadboard ได้ (ใช้ 2 สำรอง 2)", shop: "allnewstep", price: 7, qty: 4, order: "ordered" },
  { code: "A836", name: "แจ็ก DC ตัวเมีย 5.5×2.5 mm", use: "รับไฟจากอแดปเตอร์ บัดกรีสายเอง", shop: "allnewstep", price: 10, qty: 2, order: "ordered" },
  { code: "A247", name: "Breadboard MB-102", use: "ต่อวงจรทดลอง", shop: "allnewstep", price: 37, qty: 2, order: "ordered" },
  { code: "A2329", name: "สายจัมเปอร์ ผู้-เมีย", use: "ต่อขาบอร์ดกับโมดูล", shop: "allnewstep", price: 2, qty: 20, order: "ordered" },
  { code: "A2331", name: "สายจัมเปอร์ ผู้-ผู้", use: "ต่อบน breadboard · ตัดใช้เป็นสายแจ็ก DC", shop: "allnewstep", price: 2, qty: 20, order: "ordered" },
  { code: "A2330", name: "สายจัมเปอร์ เมีย-เมีย", use: "ต่อขาโมดูลกับขาบอร์ดตรง ๆ", shop: "allnewstep", price: 2, qty: 10, order: "ordered" },
  { code: "A233", name: "Pin header 1×40", use: "บัดกรีขาให้บอร์ดและโมดูล", shop: "allnewstep", price: 5, qty: 3, order: "ordered" },
];

/* ---------- small and mechanical parts: made or bought later, one estimate ---------- */

export const MISC_ESTIMATE = 150; // perfboard, enclosure material, printing

export interface Misc {
  id: string;
  name: string;
  use: string;
  order: Order;
  orderNote?: string;
  where: "node" | "gateway" | "both";
  qty: string;
  job: string;
  make: string;
  watch?: string;
  step: string;
}

export const MISC: Misc[] = [
  {
    id: "cap",
    name: "ตัวเก็บประจุ 1000 µF 50V",
    use: "กันบอร์ดรีเซ็ตตอน servo เริ่มหมุน",
    order: "ordered",
    orderNote: "E0044 × 2 จาก cybertice",
    where: "node",
    qty: "1 ต่อโต๊ะ",
    job: "กันบอร์ดรีเซ็ตตอน servo เริ่มหมุน: servo ดึงกระแสกระชากสูงชั่วขณะ แรงดัน 5 V จึงตกวูบ ตัวเก็บประจุจ่ายกระแสช่วงนั้นแทนอแดปเตอร์",
    make: "ต่อคร่อมสาย + กับ − ของไฟ servo ให้ใกล้ขั้ว servo ที่สุด",
    watch: "มีขั้ว: ขาสั้น / แถบข้างตัว = ขาลบ ต่อกลับขั้วแล้วเสียหรือบวมได้ · เลือกแรงดัน ≥ 10 V",
    step: "C4",
  },
  {
    id: "power-split",
    name: "แจ็ก DC ตัวเมีย 5.5×2.5 + terminal block",
    use: "แยกไฟจากอแดปเตอร์ไปบอร์ดและ servo",
    order: "partial",
    orderNote: "แจ็ก DC สั่งแล้ว · terminal block ยังไม่สั่ง",
    where: "node",
    qty: "1 ชุดต่อโต๊ะ",
    job: "แยกไฟ 5 V จากอแดปเตอร์ไปสองทาง: บอร์ด FireBeetle และ servo โดยใช้ GND ร่วมกัน",
    make: "ขันสายใน terminal block · servo ไม่ดึงไฟผ่านบอร์ด",
    watch: "GND ของ servo, บอร์ด และอแดปเตอร์ต้องต่อถึงกัน ไม่งั้นสัญญาณ PWM เพี้ยน",
    step: "C4",
  },
  {
    id: "perfboard",
    name: "Breadboard → perfboard, header, สายจัมเปอร์",
    use: "ต่อวงจรทดลอง แล้วย้ายลงแผ่นถาวร",
    order: "partial",
    orderNote: "breadboard, header, สายจัมเปอร์สั่งแล้ว · perfboard ยังไม่สั่ง",
    where: "both",
    qty: "ตามใช้",
    job: "ทดลองบน breadboard ก่อน แล้วย้ายวงจร node ลง perfboard เมื่อ pin map นิ่ง สายจะไม่หลุดตอนยกโต๊ะ",
    make: "ใช้ header ตัวเมียเสียบบอร์ดและโมดูล จะถอดคืนได้",
    watch: "ใช้ header ไม่บัดกรีโมดูลตรง จะได้ถอดเปลี่ยนตัวที่เสียได้",
    step: "F4",
  },
  {
    id: "mast",
    name: "เสาและแขนจับหัวกล้อง",
    use: "ยกกล้องและ ToF ให้เห็นโต๊ะและเก้าอี้",
    order: "pending",
    where: "node",
    qty: "1 ต่อโต๊ะ",
    job: "ยกกล้องและ VL53L1X ให้สูงพอจะเห็นทั้งพื้นโต๊ะและเก้าอี้ มองลงเฉียง ๆ · VL53L1X เล็งลงที่เบาะเก้าอี้",
    make: "ต้นแบบ: ขาตั้งมือถือแบบหนีบขอบโต๊ะ ปรับมุมได้ · ตัวจริง: แขนพิมพ์ 3D หรือท่อ PVC + ตัวหนีบ",
    watch: "ปรับจนภาพเห็นพื้นโต๊ะครบและ ToF เห็นเบาะ ก่อนเริ่มเก็บ dataset ห้ามขยับมุมหลังจากนั้น",
    step: "C5",
  },
  {
    id: "head-box",
    name: "กล่องหัวกล้อง",
    use: "ครอบบอร์ดกับกล้องเป็นชิ้นเดียว",
    order: "pending",
    where: "node",
    qty: "1 ต่อโต๊ะ",
    job: "ครอบ FireBeetle 2 ให้เป็นชิ้นเดียวกับเลนส์และ VL53L1X กันฝุ่นและมือ",
    make: "กล่องพิมพ์ 3D หรือกล่องพลาสติกเล็ก เจาะรูเลนส์และช่องเซ็นเซอร์",
    watch: "หน้า VL53L1X ต้องเปิดโล่ง: แผ่นพลาสติก / อะคริลิกสะท้อนเลเซอร์กลับเข้าเซนเซอร์ ระยะจะเพี้ยน",
    step: "F4",
  },
  {
    id: "radar-mount",
    name: "ที่ยึด LD2410 ใต้ขอบโต๊ะ",
    use: "ยึดเรดาร์ใต้ขอบโต๊ะ หันหาเก้าอี้",
    order: "pending",
    where: "node",
    qty: "1 ต่อโต๊ะ",
    job: "ให้เรดาร์หันหาเก้าอี้ระดับอก จับการหายใจของคนที่นั่ง",
    make: "เทปโฟมสองหน้าหรือสกรูเล็กบนแผ่นหน้าโต๊ะ",
    watch: "ห้ามมีโลหะบังด้านหน้า · ทดสอบใหม่ทุกครั้งที่ย้ายตำแหน่ง",
    step: "C5",
  },
  {
    id: "prism",
    name: "ป้ายปริซึม 3 หน้า + แผ่นข้าง + ฐาน",
    use: "ป้าย 3 หน้า ชมพู / เหลือง / เขียว",
    order: "pending",
    where: "node",
    qty: "1 ชุดต่อโต๊ะ",
    job: "หน้าที่คนในห้องเห็น: ชมพู ใช้งาน · เหลือง ไม่อยู่ · เขียว ว่าง",
    make: "ต้นแบบ: ฟิวเจอร์บอร์ด / foam board · ตัวจริง: พิมพ์ 3D หรืออะคริลิก · หน้าพิมพ์สีติดกาว · ปลายหนึ่งยึด horn ของ servo ปลายอีกข้างหมุนบนแกน",
    watch: "ต้องเบาและสมดุล ไม่งั้น servo ต้องออกแรงค้างแล้วมีเสียงหึ่ง · มีหมุดกันหมุนเกิน (M7)",
    step: "C3",
  },
  {
    id: "qr",
    name: "การ์ด QR + ที่ตั้งอะคริลิก",
    use: "เปิดหน้าสถานะโต๊ะ + เพิ่มเพื่อน LINE",
    order: "pending",
    where: "node",
    qty: "1 ต่อโต๊ะ",
    job: "เปิดหน้าสถานะโต๊ะ และลิงก์เพิ่มเพื่อน LINE Official Account",
    make: "พิมพ์การ์ดเคลือบ เสียบในที่ตั้งป้ายอะคริลิกขนาดเล็ก",
    step: "F4",
  },
  {
    id: "gw-box",
    name: "กล่อง gateway + standoff M3",
    use: "กล่องเก็บ gateway และ sensor ห้อง",
    order: "pending",
    where: "gateway",
    qty: "1",
    job: "เก็บบอร์ด gateway และ sensor ห้องให้เรียบร้อย ย้ายได้ (Build Quality)",
    make: "แผ่นฐานอะคริลิก + standoff M3 ใต้ทุกบอร์ด แล้วครอบด้วยกล่องพลาสติกหรือกล่องพิมพ์ 3D",
    watch: "ต้องมีช่องระบายอากาศให้ SCD41 (วัด CO₂ จากอากาศที่ไหลผ่าน) · หน้าต่างใสหรือรูให้ BH1750 รับแสง · รูให้ไมค์ · ช่องสาย USB-C",
    step: "F3",
  },
  {
    id: "finish",
    name: "เคเบิลไทร์, ท่อหด, เทปโฟม, ป้ายชื่อสาย, สาย USB-C ที่ส่งข้อมูลได้",
    use: "เก็บสายให้เรียบร้อย รู้ว่าเส้นไหนไปไหน",
    order: "pending",
    where: "both",
    qty: "ตามใช้",
    job: "เก็บสายให้เรียบร้อยและรู้ว่าสายไหนไปไหน · สาย USB-C ไว้อัปโหลดโค้ด",
    make: "ติดป้ายที่ปลายสายทุกเส้นตาม pin map",
    watch: "สายชาร์จอย่างเดียวจะไม่เห็น COM port (เหมือนใน Lab 10)",
    step: "F4",
  },
];

/* ---------- tools: assume the lab lends nothing; cybertice had every one in stock on 31 Oct ---------- */

export interface Tool {
  code: string;
  name: string;
  job: string;
  order: Order;
  price: number;
  qty: number;
  url?: string;
}

const CYBERTICE_SOLDERING = "https://www.cybertice.com/category/96/accessories/%E0%B8%AD%E0%B8%B8%E0%B8%9B%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9A%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%A3%E0%B8%B5";
const CYBERTICE_PLIERS = "https://www.cybertice.com/search?q=%E0%B8%84%E0%B8%B5%E0%B8%A1";

export const TOOLS: Tool[] = [
  {
    code: "A0559",
    name: "ชุดหัวแร้ง 60W ปรับอุณหภูมิ 200–450 °C (มีที่วาง ฟองน้ำ หัวเปลี่ยน 5 หัว ที่ดูดตะกั่ว)",
    job: "บัดกรีขา header ของ FireBeetle, LD2410 ลงบอร์ดแปลงขา, สายแจ็ก DC",
    order: "pending",
    price: 365,
    qty: 1,
    url: "https://www.cybertice.com/product/4821/%E0%B8%8A%E0%B8%B8%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%9B%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9A%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%A3%E0%B8%B5-60w-%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B9%81%E0%B8%A3%E0%B9%89%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B8%93%E0%B8%AB%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4%E0%B9%84%E0%B8%94%E0%B9%89",
  },
  { code: "A0087", name: "ตะกั่วบัดกรี 60/40 ยาว 2 เมตร", job: "ม้วนละ 2 เมตร เผื่อไว้ 2 ม้วน", order: "pending", price: 40, qty: 2, url: CYBERTICE_SOLDERING },
  {
    code: "A0341",
    name: "มัลติมิเตอร์ DT9205A",
    job: "วัดไฟ 5 V / 3.3 V, หาขั้วบวกของแจ็ก DC ก่อนต่อบอร์ด, หาสายขาด · ใช้ถ่าน 9 V (หน้าร้านไม่บอกว่าแถม)",
    order: "pending",
    price: 270,
    qty: 1,
    url: "https://www.cybertice.com/search?q=%E0%B8%A1%E0%B8%B1%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%A1%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C",
  },
  { code: "A0499", name: "คีมตัด สำหรับงานอิเล็กทรอนิกส์", job: "ตัดขาที่เกินหลังบัดกรี ตัดสาย", order: "pending", price: 40, qty: 1, url: CYBERTICE_PLIERS },
  { code: "A0256", name: "คีมปอกสาย TUOSEN 6 นิ้ว", job: "ปอกสายแจ็ก DC และสายไฟ servo", order: "pending", price: 160, qty: 1, url: CYBERTICE_PLIERS },
  { code: "A0491", name: "ลวดซับตะกั่ว 2.0 mm ยาว 1.5 เมตร", job: "เก็บตะกั่วที่เชื่อมขาติดกันตอนบัดกรีพลาด", order: "pending", price: 40, qty: 1, url: CYBERTICE_SOLDERING },
];

/* ---------- budget ---------- */

const sum = (items: { price: number; qty: number }[]) => items.reduce((total, item) => total + lineTotal(item), 0);

// a part ordered 1 of 2 still owes one unit
const partsLeft = PARTS.reduce((total, part) => total + (part.order === "pending" ? lineTotal(part) : part.order === "partial" ? part.price : 0), 0);
const toolsLeft = sum(TOOLS.filter((tool) => tool.order === "pending"));

export const BUDGET = (() => {
  const parts = sum(PARTS);
  const accessories = sum(ACCESSORIES);
  const tools = sum(TOOLS);
  const total = parts + accessories + MISC_ESTIMATE + tools;
  const left = partsLeft + toolsLeft + MISC_ESTIMATE;
  return { parts, accessories, misc: MISC_ESTIMATE, tools, total, left, ordered: total - left };
})();

export const TEAM_SIZE = 5;

export const baht = (value: number) => value.toLocaleString("en-US");
