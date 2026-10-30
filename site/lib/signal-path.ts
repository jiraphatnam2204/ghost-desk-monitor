// What happens once someone sits down, hop by hop. One list drives the room figure,
// the timeline beside it and the theory sections below, so they never disagree.
import type { DeskState } from "./session";

// Parts of the room figure a step can light.
export type RoomPart = "person" | "radar" | "head" | "prism" | "gateway" | "router" | "screen" | "phone";
// Links a packet can travel along.
export type Link = "espnow-up" | "espnow-down" | "wifi" | "to-screen" | "to-phone";
// Lanes of the timeline, left to right.
export type Lane = "desk" | "node" | "gateway" | "cloud" | "screens";

export const LANES: { id: Lane; label: string; en: string }[] = [
  { id: "desk", label: "ที่โต๊ะ", en: "Desk" },
  { id: "node", label: "Sensor node", en: "ESP32-S3" },
  { id: "gateway", label: "Gateway", en: "ESP32-S3" },
  { id: "cloud", label: "Cloud", en: "Supabase · LINE" },
  { id: "screens", label: "หน้าจอ", en: "Dashboard · Phone" },
];

export interface SignalStep {
  id: string;
  at: string; // time since the person sat down
  title: string;
  text: string;
  // what the hop carries, as it would show on a logic analyser or in a log
  wire: string;
  from: Lane;
  to: Lane;
  // room figure state
  present: boolean;
  bag: boolean;
  sign: DeskState;
  screen: DeskState;
  lit: RoomPart[];
  links: Link[];
  waves?: boolean;
  view?: boolean;
  theory: string; // id of the theory section that explains it
}

export const SIGNAL_STEPS: SignalStep[] = [
  {
    id: "sit",
    at: "0 s",
    title: "มีคนนั่งลง",
    text: "เรดาร์ LD2410 ใต้ขอบโต๊ะส่งคลื่น 24 GHz ออกไปตลอดเวลา คลื่นสะท้อนจากตัวคนกลับมา และแม้คนจะนั่งนิ่ง การหายใจทำให้หน้าอกขยับไม่กี่มิลลิเมตร เรดาร์จึงรายงานพลังงาน “เป้านิ่ง” ที่ช่วงระยะของเก้าอี้ได้ ส่วน VL53L1X บนหัวกล้องวัดระยะลงไปสั้นลงจากเบาะ ~90 cm เหลือ ~45 cm",
    wire: "LD2410 → UART 256000 baud · โหมด engineering ~10 เฟรม/วินาที · VL53L1X → I²C 0x29, ระยะ mm",
    from: "desk",
    to: "node",
    present: true,
    bag: true,
    sign: "free",
    screen: "free",
    lit: ["person", "radar", "head"],
    links: [],
    waves: true,
    view: true,
    theory: "sense",
  },
  {
    id: "pack",
    at: "+0.1 s",
    title: "Node อ่านค่าและรวมเป็นชุด",
    text: "ขา OUT ของเรดาร์เปลี่ยนเป็น HIGH และปลุก interrupt บน ESP32-S3 task ของเรดาร์และ ToF อ่านค่า 10 ครั้งต่อวินาทีแล้วส่งผ่าน queue ไปให้ task สื่อสาร ซึ่งรวม 10 ค่าเป็น struct ชุดละ 210 ไบต์",
    wire: "ISR → semaphore → radar / tof task → queue → radio task · node_batch_t 210 bytes",
    from: "node",
    to: "node",
    present: true,
    bag: true,
    sign: "free",
    screen: "free",
    lit: ["head", "radar"],
    links: [],
    theory: "mcu",
  },
  {
    id: "espnow",
    at: "+0.1 s",
    title: "ส่งข้อมูลทาง ESP-NOW",
    text: "Node ส่งชุดข้อมูลตรงถึง gateway ด้วย ESP-NOW ทุก 1 วินาที ไม่ต้องต่อ Wi-Fi router ใช้เวลาบนอากาศไม่ถึง 1 ms แล้ว gateway ตอบ ACK กลับในระดับฮาร์ดแวร์ ถ้าไม่ได้ ACK node จะส่งซ้ำ (สูงสุด 3 ครั้ง)",
    wire: "ESP-NOW · 210 B payload (สูงสุด 250 B) · ACK ใน send callback · retry ≤ 3",
    from: "node",
    to: "gateway",
    present: true,
    bag: true,
    sign: "free",
    screen: "free",
    lit: ["head", "gateway"],
    links: ["espnow-up"],
    theory: "radio",
  },
  {
    id: "count",
    at: "0–60 s",
    title: "AI บน gateway ตัดสิน แล้วจับเวลา 1 นาที",
    text: "ทุกวินาที gateway ป้อนข้อมูลย้อนหลัง 5 วินาทีของโต๊ะนี้เข้าโมเดล AI (Edge Impulse) ที่ตอบ person / empty / nearby แล้วเก็บ state machine แยกต่อโต๊ะ ถ้าโมเดลตอบ person ครบ 1 นาทีติดกัน จึงเปลี่ยนโต๊ะเป็น “ใช้งาน” คนที่แค่เดินผ่านหรือนั่งโต๊ะข้าง ๆ โมเดลตอบ nearby โต๊ะจึงไม่เปลี่ยน",
    wire: "AI local: person 0.94 · state: free → (person ≥ 1 min) → inUse",
    from: "gateway",
    to: "gateway",
    present: true,
    bag: true,
    sign: "free",
    screen: "free",
    lit: ["gateway"],
    links: ["espnow-up"],
    theory: "fsm",
  },
  {
    id: "sign",
    at: "60 s",
    title: "สั่งป้ายหมุนเป็นสีชมพู",
    text: "Gateway ส่งคำสั่ง SET_SIGN กลับไปที่ node ผ่าน ESP-NOW node สร้างสัญญาณ PWM 50 Hz ความกว้างพัลส์ 0.5 ms ให้ servo หมุนไปที่ 0° ป้ายปริซึมจึงหันหน้าสีชมพู “ใช้งาน” ออกมา",
    wire: "ESP-NOW {cmd = SET_SIGN, face = 0} → LEDC PWM 50 Hz, pulse 500 µs",
    from: "gateway",
    to: "node",
    present: true,
    bag: true,
    sign: "inUse",
    screen: "free",
    lit: ["gateway", "prism"],
    links: ["espnow-down"],
    theory: "actuate",
  },
  {
    id: "cloud",
    at: "60.5 s",
    title: "ขึ้น cloud และขึ้นจอ",
    text: "Gateway ต่อ Wi-Fi ห้องสมุดอยู่แล้ว จึงส่งแถวข้อมูล JSON ขึ้น Supabase ผ่าน HTTPS (เข้ารหัส TLS) Supabase เก็บลง Postgres แล้วดันการเปลี่ยนแปลงผ่าน Realtime (WebSocket) ไปที่ dashboard ทำให้จอ dashboard บนผนังห้องเปลี่ยนสีในไม่ถึงวินาที",
    wire: "HTTPS POST /rest/v1/desk_events · JSON · Realtime WebSocket → dashboard",
    from: "gateway",
    to: "screens",
    present: true,
    bag: true,
    sign: "inUse",
    screen: "inUse",
    lit: ["gateway", "router", "screen"],
    links: ["wifi", "to-screen"],
    theory: "cloud",
  },
  {
    id: "leave",
    at: "+2 min หลังลุก",
    title: "ลุกไป แต่ทิ้งกระเป๋าไว้",
    text: "AI บน gateway ไม่เห็นคนนั่งครบ 2 นาที จึงสั่ง SNAP ให้ node ถ่ายภาพหนึ่งภาพส่งมาทาง Wi-Fi แล้ว gateway ส่งภาพไปถาม cloud AI ซึ่งตอบว่า items_only (มีของ ไม่มีคน) โต๊ะจึงเป็น “ไม่อยู่” และป้ายหมุนไปหน้าสีเหลืองที่ 120° · ภาพไม่ถูกเก็บ",
    wire: "AI local ≠ person for 2 min → SNAP → JPEG → HTTPS vision API → items_only → SET_SIGN face = 120°",
    from: "node",
    to: "gateway",
    present: false,
    bag: true,
    sign: "away",
    screen: "away",
    lit: ["head", "gateway", "router", "prism"],
    links: ["espnow-up", "wifi", "espnow-down"],
    view: true,
    theory: "sense",
  },
  {
    id: "line",
    at: "+20 min",
    title: "LINE เตือนเจ้าของโต๊ะ",
    text: "ถ้าครบ 20 นาทีแล้วยังไม่กลับ gateway ส่ง LINE Messaging API ไปที่โทรศัพท์ของเจ้าของ บอกว่าโต๊ะจะถูกปล่อยในอีก 10 นาที ถ้าครบ 30 นาทีโต๊ะจะกลับเป็น “ว่าง” และหน้า staff ขึ้นธงว่ามีของค้าง",
    wire: "HTTPS POST api.line.me/v2/bot/message/broadcast · Bearer token ใน secrets.h",
    from: "gateway",
    to: "screens",
    present: false,
    bag: true,
    sign: "away",
    screen: "away",
    lit: ["gateway", "router", "phone"],
    links: ["wifi", "to-phone"],
    theory: "cloud",
  },
];
