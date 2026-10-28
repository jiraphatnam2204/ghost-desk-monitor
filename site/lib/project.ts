// Project facts shown on the site. Source: docs/strategy.md (28 Oct 2026).
// Prices were checked on shop pages on 28 Oct 2026 unless marked as an estimate.

export type Level = "ง่าย" | "กลาง" | "ยาก";

export interface Part {
  id: string;
  name: string;
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
  estimate?: boolean;
  why: string;
  note?: string;
}

export const PARTS: Part[] = [
  {
    id: "firebeetle",
    name: "FireBeetle 2 ESP32-S3 + กล้อง OV2640",
    where: "node",
    role: "สมองของ node: อ่าน sensor ทุกตัว, รันโมเดลภาพบนบอร์ด, ส่งผลให้ gateway, สั่ง servo",
    bus: "กล้องต่อสาย FPC มากับบอร์ด",
    library: "esp32 core 3.x (มี esp_camera) + ไลบรารีที่ Edge Impulse export ให้",
    start: "ตัวอย่าง ESP32 camera ของ Edge Impulse",
    level: "ยาก",
    shop: "arduitronics",
    url: "https://www.arduitronics.com/product/5665/firebeetle-2-esp32-s3-ai-board-with-ov2640-camera-image-recognition-ble-5-%E0%B9%81%E0%B8%97%E0%B9%89%E0%B8%88%E0%B8%B2%E0%B8%81-dfrobot",
    price: 1185,
    qty: 2,
    why: "ESP32-S3 N16R8 มี PSRAM 8 MB พอรันโมเดลภาพบนบอร์ด (E7) · กล้องมากับบอร์ด · ขาว่างเหลือพอสำหรับ 7 ขาที่ต้องใช้ · มีของในไทย",
    note: "ส่วนที่ยากคือ AI ไม่ใช่ตัวบอร์ด: ถ้าไม่ผ่านเส้นตาย 13 พ.ย. ย้ายโมเดลไปรันบนโน้ตบุ๊ก/Pi",
  },
  {
    id: "ld2410",
    name: "HLK-LD2410 mmWave 24 GHz",
    where: "node",
    role: "รู้ว่ามีคนนั่งแม้นั่งนิ่ง เพราะจับการหายใจได้ (PIR ทำไม่ได้)",
    bus: "UART + ขา OUT (ใช้ทำ interrupt)",
    library: "ld2410 (ncmreynolds)",
    start: "ตัวอย่างในไลบรารี ld2410 + ขา OUT แบบ ISR เหมือน Lab 10",
    level: "ง่าย",
    shop: "allnewstep",
    url: "https://www.allnewstep.com/product/5388/%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%99%E0%B8%B8%E0%B8%A9%E0%B8%A2%E0%B9%8C-hlk-ld2410-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%99%E0%B8%A2%E0%B8%B3%E0%B8%AA%E0%B8%B9%E0%B8%87-%E0%B9%82%E0%B8%A1%E0%B8%94%E0%B8%B9%E0%B8%A5%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%AB%E0%B8%A7-fmcw-human-presence-sensor-",
    price: 180,
    qty: 2,
    why: "ขา OUT ให้ทำ E2 (ISR) ได้ทันที · ราคาถูก · มีไลบรารีพร้อมใช้ ไม่ต้องเขียน parser เอง",
  },
  {
    id: "amg8833",
    name: "GY-AMG8833 thermal 8×8",
    where: "node",
    role: "แยกคนจริงกับกระเป๋าด้วยความร้อน",
    bus: "I²C",
    library: "Adafruit AMG88xx",
    start: "ตัวอย่าง pixels_test",
    level: "ง่าย",
    shop: "arduitronics",
    url: "https://www.arduitronics.com/product/4293/gy-amg8833-ir-8x8-camera-array-temperature-sensor-module-%E0%B9%82%E0%B8%A1%E0%B8%94%E0%B8%B9%E0%B8%A5%E0%B8%81%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B8%9F%E0%B8%B2%E0%B9%80%E0%B8%A3%E0%B8%94-%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%99",
    price: 1650,
    qty: 2,
    why: "แพงที่สุดในรายการ จึงขอยืมจากวิชาก่อน · I²C ต่อง่าย 4 สาย",
  },
  {
    id: "servo",
    name: "TD-7120MG servo 0–270°",
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
    name: "YD-ESP32-23 (ESP32-S3 N16R8)",
    where: "gateway",
    role: "สมองของ gateway: state machine, ตัวจับเวลา 2/20/30 นาที, ส่งข้อมูลขึ้น cloud, ส่ง LINE",
    bus: "Wi-Fi + ESP-NOW",
    library: "esp32 core 3.x (ESP-NOW, WiFiClientSecure, HTTPClient)",
    start: "บอร์ดเดียวกับ Lab 10 ตั้งค่า Tools เหมือนเดิม",
    level: "กลาง",
    shop: "มีอยู่แล้วจาก Lab 10",
    price: 0,
    qty: 1,
    why: "ทีมมีบอร์ดนี้และคุ้นกับมันแล้ว ไม่ต้องซื้อเพิ่ม",
  },
  {
    id: "scd41",
    name: "SCD41 CO₂",
    where: "gateway",
    role: "คุณภาพอากาศในห้อง และใช้ประมาณความหนาแน่นของคน",
    bus: "I²C (bus เดียวกับ BH1750)",
    library: "Sensirion I2C SCD4x",
    start: "ตัวอย่าง exampleUsage",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/category/30/modules-sensors/%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%81%E0%B8%81%E0%B9%8A%E0%B8%AA",
    price: 820,
    qty: 1,
    why: "ถูกกว่า MH-Z19C ในร้านที่เช็ก · I²C ไม่เปลืองขา · วัดอุณหภูมิ/ความชื้นในตัว",
  },
  {
    id: "max4466",
    name: "ไมค์อนาล็อก MAX4466",
    where: "gateway",
    role: "ระดับเสียงในห้อง แจ้ง staff ถ้า quiet zone ดังเกิน",
    bus: "ADC 1 ขา",
    library: "ไม่ต้องใช้: analogRead()",
    start: "โค้ดอ่าน ADC แบบ Lab 8 แล้วหาค่า peak-to-peak ทุก 50 ms",
    level: "ง่าย",
    shop: "ยังไม่ได้เช็กร้าน",
    price: 100,
    qty: 1,
    estimate: true,
    why: "อ่านด้วย analogRead ที่ทำมาแล้วใน Lab 8 แทนไมค์ I²S (INMP441) ที่ต้องตั้งค่า I²S เอง",
    note: "ราคาประมาณ ยังไม่เช็ก · ถ้าอยากลอง I²S ใช้ INMP441 (95 บาท) แทนได้",
  },
  {
    id: "bh1750",
    name: "GY-302 BH1750 วัดแสง",
    where: "gateway",
    role: "แสงในห้อง: บอกช่วงเปิด/ปิดไฟ และกัน M1 พลาด",
    bus: "I²C",
    library: "BH1750 (claws)",
    start: "ตัวอย่าง BH1750test",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/product/784/gy-302-%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C-%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%A1%E0%B9%81%E0%B8%AA%E0%B8%87-ambient-light-sensor-module-bh1750fvi",
    price: 50,
    qty: 1,
    why: "ถ้ากรรมการไม่นับกล้องเป็น sensor ก็ยังครบ 5 ชนิด · ถูกที่สุดในรายการ",
  },
  {
    id: "adapter-gw",
    name: "อแดปเตอร์ 5V 2A",
    where: "gateway",
    role: "ไฟเลี้ยง gateway ตลอดการรัน 24 ชม.",
    bus: "USB-C",
    library: "—",
    start: "—",
    level: "ง่าย",
    shop: "cybertice",
    url: "https://www.cybertice.com/product/365/power-adapter-5v-2a-%E0%B8%AD%E0%B8%B0%E0%B9%81%E0%B8%94%E0%B8%9B%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C-5v-%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%AA-2a-%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B9%81%E0%B8%88%E0%B9%87%E0%B8%84-5-5x2-5mm",
    price: 130,
    qty: 1,
    why: "รันต่อเนื่อง 24 ชม. โดยไม่พึ่งโน้ตบุ๊ก",
  },
];

export const SUNDRIES = 400; // jumpers, breadboard, 1000 µF capacitors, enclosure, printing: an estimate
export const LOAN = 3300; // two AMG8833 borrowed from the course

export const lineTotal = (part: Part) => part.price * part.qty;

export const LABS = [
  {
    lab: "Lab 8 · ADC",
    learned: "analogRead() อ่านค่า LDR",
    reuse: "อ่านไมค์ MAX4466 ที่ gateway แล้วคิดเป็นระดับเสียง",
  },
  {
    lab: "Lab 10 · Tasks",
    learned: "xTaskCreate หลาย task พร้อมกัน",
    reuse: "node แยก task: sensor / AI / ส่งข้อมูล / servo (E1)",
  },
  {
    lab: "Lab 10 · Mutex",
    learned: "xSemaphoreCreateMutex กัน Serial ชนกัน",
    reuse: "กันสอง task ใช้ I²C bus หรือ Serial พร้อมกัน · ISR ปลุก task ด้วย semaphore (E2)",
  },
  {
    lab: "Lab 10 · Queue",
    learned: "xQueueCreate ส่งข้อความระหว่าง task",
    reuse: "ส่งผล sensor/AI เข้า queue ให้ task ส่งข้อมูล · buffer ตอนเน็ตหลุด (E4)",
  },
  {
    lab: "Lab 10 · บอร์ด",
    learned: "YD-ESP32-23 + Arduino IDE 2, esp32 core 3.x",
    reuse: "ใช้บอร์ดเดิมเป็น gateway ตั้งค่า Tools เหมือนเดิม",
  },
];

export const DEPTH = [
  { id: "E1", name: "RTOS multitasking", plan: "node มี ≥ 4 task คุยกันด้วย queue (แบบ Lab 10)" },
  { id: "E2", name: "Interrupt-driven I/O", plan: "ขา OUT ของ LD2410 → ISR → semaphore ปลุก task" },
  { id: "E4", name: "Reliable communication", plan: "ESP-NOW ดูผล ack จาก send callback + retry · buffer ใน RAM ตอนเน็ตหลุด" },
  { id: "E5", name: "Security", plan: "HTTPS/TLS ไป Supabase · key อยู่ใน secrets.h ที่ไม่ commit" },
  { id: "E7", name: "On-device AI", plan: "โมเดล Edge Impulse รันบน ESP32-S3 · ตัดสินที่เส้นตาย 13 พ.ย." },
];

export const SPARE_DEPTH = { id: "E6", name: "OTA update", plan: "ตัวอย่าง ArduinoOTA · ใช้แทน E7 ถ้า AI ไม่ผ่านเส้นตาย" };

export const baht = (value: number) => value.toLocaleString("en-US");

// Small and mechanical parts: no single shop price; together they sit in the SUNDRIES estimate.
export interface Misc {
  id: string;
  name: string;
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
    name: "ตัวเก็บประจุ 1000 µF (electrolytic, 16 V)",
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
    where: "both",
    qty: "ตามใช้",
    job: "ทดลองบน breadboard ก่อน แล้วย้ายวงจร node ลง perfboard เมื่อ pin map นิ่ง สายจะไม่หลุดตอนยกโต๊ะ",
    make: "ใช้ header ตัวเมียเสียบบอร์ดและโมดูล จะถอดคืนได้",
    watch: "AMG8833 เป็นของยืม ห้ามบัดกรีตรง ใช้ header",
    step: "F4",
  },
  {
    id: "mast",
    name: "เสาและแขนจับหัวกล้อง",
    where: "node",
    qty: "1 ต่อโต๊ะ",
    job: "ยกกล้องและ AMG8833 ให้สูงพอจะเห็นทั้งพื้นโต๊ะและเก้าอี้ มองลงเฉียง ๆ",
    make: "ต้นแบบ: ขาตั้งมือถือแบบหนีบขอบโต๊ะ ปรับมุมได้ · ตัวจริง: แขนพิมพ์ 3D หรือท่อ PVC + ตัวหนีบ",
    watch: "ปรับความสูงจนภาพจากกล้องเห็นพื้นโต๊ะครบก่อนเริ่มเก็บ dataset ห้ามขยับมุมหลังจากนั้น",
    step: "C5",
  },
  {
    id: "head-box",
    name: "กล่องหัวกล้อง",
    where: "node",
    qty: "1 ต่อโต๊ะ",
    job: "ครอบ FireBeetle 2 ให้เป็นชิ้นเดียวกับเลนส์และ AMG8833 กันฝุ่นและมือ",
    make: "กล่องพิมพ์ 3D หรือกล่องพลาสติกเล็ก เจาะรูเลนส์และช่องเซ็นเซอร์",
    watch: "หน้า AMG8833 ต้องเปิดโล่ง: แผ่นพลาสติก / อะคริลิกบังรังสีความร้อนจนวัดไม่ได้",
    step: "F4",
  },
  {
    id: "radar-mount",
    name: "ที่ยึด LD2410 ใต้ขอบโต๊ะ",
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
    where: "node",
    qty: "1 ต่อโต๊ะ",
    job: "เปิดหน้าสถานะโต๊ะ และลิงก์เพิ่มเพื่อน LINE Official Account",
    make: "พิมพ์การ์ดเคลือบ เสียบในที่ตั้งป้ายอะคริลิกขนาดเล็ก",
    step: "F4",
  },
  {
    id: "gw-box",
    name: "กล่อง gateway + standoff M3",
    where: "gateway",
    qty: "1",
    job: "เก็บ YD-ESP32-23 และ sensor ห้องให้เรียบร้อย ย้ายได้ (Build Quality)",
    make: "แผ่นฐานอะคริลิก + standoff M3 ใต้ทุกบอร์ด แล้วครอบด้วยกล่องพลาสติกหรือกล่องพิมพ์ 3D",
    watch: "ต้องมีช่องระบายอากาศให้ SCD41 (วัด CO₂ จากอากาศที่ไหลผ่าน) · หน้าต่างใสหรือรูให้ BH1750 รับแสง · รูให้ไมค์ · ช่องสาย USB-C",
    step: "F3",
  },
  {
    id: "finish",
    name: "เคเบิลไทร์, ท่อหด, เทปโฟม, ป้ายชื่อสาย, สาย USB-C ที่ส่งข้อมูลได้",
    where: "both",
    qty: "ตามใช้",
    job: "เก็บสายให้เรียบร้อยและรู้ว่าสายไหนไปไหน · สาย USB-C ไว้อัปโหลดโค้ด",
    make: "ติดป้ายที่ปลายสายทุกเส้นตาม pin map",
    watch: "สายชาร์จอย่างเดียวจะไม่เห็น COM port (เหมือนใน Lab 10)",
    step: "F4",
  },
];
