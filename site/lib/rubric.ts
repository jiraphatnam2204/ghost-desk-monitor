// The course marking guide (Embedded System (CEDT) Final Project 2026, section 5) and its deductions.
// Points and wording follow the brief; the team's status lives in data/progress.json.
import progress from "@/data/progress.json";

export type Status = "not-started" | "in-progress" | "done" | "at-risk";

export const STATUS_LABEL: Record<Status, string> = {
  "not-started": "ยังไม่เริ่ม",
  "in-progress": "กำลังทำ",
  done: "มีหลักฐานแล้ว",
  "at-risk": "เสี่ยง",
};

export interface Criterion {
  id: string;
  name: string;
  max: number;
  what: string;
  levels?: string[];
}

export interface Category {
  id: string;
  roman: string;
  name: string;
  max: number;
  items: Criterion[];
}

export const CATEGORIES: Category[] = [
  {
    id: "I",
    roman: "I",
    name: "Problem Definition",
    max: 5,
    items: [
      { id: "I.1", name: "Relevance and Impact", max: 3, what: "ปัญหาจริงที่กระทบคนกลุ่มใหญ่ บอกว่าทำไมเร่งด่วน ขอบเขตพอดีกับโปรเจกต์ embedded" },
      { id: "I.2", name: "Evidence and Detail", max: 2, what: "หลักฐาน: ข้อมูล, สัมภาษณ์, การสังเกต หรือเจ้าของปัญหาตัวจริง" },
    ],
  },
  {
    id: "II",
    roman: "II",
    name: "System Architecture & Scalability",
    max: 5,
    items: [
      { id: "II.1", name: "Architecture and Data Flow", max: 2, what: "diagram ชัด, message format ระหว่าง node / gateway / cloud, ประมวลผล real-time ที่ gateway" },
      {
        id: "II.2",
        name: "Scalability",
        max: 3,
        what: "รองรับหลาย node",
        levels: ["1: format และโค้ด gateway รองรับหลาย node (มี node id)", "2: node จริง 1 + จำลอง ≥ 2 พร้อมกัน", "3: node จริง ≥ 2 พร้อมกัน"],
      },
    ],
  },
  {
    id: "II'",
    roman: "II′",
    name: "Embedded Engineering Depth",
    max: 10,
    items: [
      { id: "E1", name: "E1 RTOS multitasking", max: 2, what: "FreeRTOS ≥ 3 task มีเหตุผลเรื่อง priority คุยกันด้วย queue / semaphore / event group" },
      { id: "E2", name: "E2 Interrupt-driven I/O", max: 2, what: "input อย่างน้อย 1 ตัวผ่าน ISR + deferred processing ไม่ busy poll" },
      { id: "E4", name: "E4 Reliable communication", max: 2, what: "ack / retry ระหว่าง node กับ gateway และ store-and-forward ตอนเน็ตหรือ cloud ล่ม" },
      { id: "E5", name: "E5 Security", max: 2, what: "ต่อ cloud แบบเข้ารหัสและยืนยันตัวตน ไม่มี secret ใน repo" },
      { id: "E7", name: "E7 On-device AI", max: 2, what: "โมเดลรันบน MCU เอง (ESP32-S3 + Edge Impulse)" },
    ],
  },
  {
    id: "III",
    roman: "III",
    name: "Implementation",
    max: 20,
    items: [
      { id: "III.1", name: "Functionality", max: 8, what: "core features ทำได้และ demo ได้ (≤ 4) + ทุก feature ที่ออกแบบทำงานครบ (+4)" },
      {
        id: "III.2",
        name: "Field Testing",
        max: 3,
        what: "ทดสอบในสภาพจริง",
        levels: ["1: ทดสอบสั้นในที่ของเราเอง", "2: รันต่อเนื่อง ≥ 24 ชม. เก็บข้อมูลตลอด", "3: ทดสอบกับผู้ใช้จริงหรือสถานที่จริง"],
      },
      {
        id: "III.3",
        name: "Robustness",
        max: 3,
        what: "ทำงานได้ทุกครั้ง",
        levels: ["1: ทำงานบางครั้ง", "2: ทำงานเกือบทุกครั้ง", "3: ทำงานทุกครั้งในทุกเงื่อนไขที่ทดสอบ และกลับมาเองหลังไฟดับ / Wi-Fi หลุด"],
      },
      {
        id: "III.4",
        name: "Build Quality",
        max: 3,
        what: "ความเรียบร้อย ความสวย การขนย้าย",
        levels: ["1: แค่ prototype ที่ใช้ได้", "2: อยู่ในกล่องหรือโมเดล ย้ายได้ถ้าระวัง", "3: สายเรียบร้อย กล่องสวย ขนย้ายและตั้งได้ง่าย"],
      },
      {
        id: "III.5",
        name: "User Experience",
        max: 3,
        what: "dashboard / app และการแจ้งเตือน",
        levels: ["1: พยายามให้ดูดีและใช้ได้", "2: ชัดเจน จัดวางดี", "3: ใช้ง่ายโดยแทบไม่ต้องอธิบาย การแจ้งเตือนชัดและมีประโยชน์"],
      },
    ],
  },
  {
    id: "IV",
    roman: "IV",
    name: "Testing & Analysis",
    max: 10,
    items: [
      { id: "IV.1", name: "Test Plan and Procedure", max: 3, what: "ขั้นตอนทดสอบที่ครอบคลุมใช้งานปกติ, กรณีขอบ และกรณีล้มเหลว พร้อมผล" },
      { id: "IV.2", name: "Quantitative Metrics", max: 4, what: "วัด ≥ 3 metric ด้วยข้อมูลจริงและบอกวิธีวัด (ตัวละ 1) + วัดซ้ำรายงาน mean / min / max (+1)" },
      { id: "IV.3", name: "Analysis and Comparison", max: 3, what: "เทียบกับเป้าของเรา และกับระบบที่มีอยู่ โดยใช้ตัวเลขที่วัดได้" },
    ],
  },
  {
    id: "V",
    roman: "V",
    name: "Presentation",
    max: 10,
    items: [
      { id: "V.1", name: "Clarity and Organization", max: 2, what: "เล่าเป้าหมาย การออกแบบ และผลอย่างเป็นลำดับ" },
      { id: "V.2", name: "Delivery", max: 2, what: "เสียงชัด ท่าทางเหมาะ อ่านสไลด์น้อย" },
      { id: "V.3", name: "Slides", max: 1, what: "สไลด์จัดดี ช่วยการนำเสนอ" },
      { id: "V.4", name: "Demonstration", max: 2, what: "demo สด มีแผนและอธิบายการตั้งค่า" },
      { id: "V.5", name: "Individual Q&A", max: 3, what: "กรรมการสุ่มถามแต่ละคนเรื่องส่วนของตัวเอง" },
    ],
  },
  {
    id: "VI",
    roman: "VI",
    name: "Video & Documentation",
    max: 10,
    items: [
      { id: "VI.1", name: "Video content", max: 2, what: "บอกทีมและมหาวิทยาลัย ภาพรวม ระบบทำงานจริง อธิบายชิ้นสำคัญ" },
      { id: "VI.2", name: "Video quality", max: 2, what: "ผลิตดี ภาพชัด อัปโหลดสาธารณะ (unlisted ได้)" },
      { id: "VI.3", name: "Report", max: 6, what: "≤ 10 หน้า ครบ 6 ส่วน ส่วนละ 1 คะแนน" },
    ],
  },
];

export interface Gate {
  id: string;
  name: string;
  penalty: string;
  what: string;
}

// Pass/fail items: each one missing costs points instead of earning them.
export const MINIMUMS: Gate[] = [
  { id: "M1", name: "Sensors", penalty: "−2", what: "≥ 5 ชนิด, node ≥ 2, gateway ≥ 2" },
  { id: "M2", name: "Actuator", penalty: "−2", what: "≥ 1 ตัวที่เคลื่อนที่จริง (LED, buzzer, จอ ไม่นับ)" },
  { id: "M3", name: "Node → gateway", penalty: "−2", what: "ส่งข้อมูลจาก sensor node ถึง gateway" },
  { id: "M4", name: "AI closed loop", penalty: "−2", what: "ผล AI สั่ง actuator หรือตัดสินใจในระบบ" },
  { id: "M5", name: "Cloud + dashboard", penalty: "−2", what: "raw data ขึ้น cloud ≥ 1 ที่ และมี dashboard" },
  { id: "M6", name: "Notification", penalty: "−2", what: "แจ้งเหตุสำคัญผ่าน LINE / email / Discord / Telegram" },
  { id: "M7", name: "Safety", penalty: "−2", what: "ทำตามกฎ 4.3 (ชิ้นที่ขยับต้องหยุดได้อย่างปลอดภัย)" },
  { id: "M8", name: "Git", penalty: "−2", what: "repo เปิดได้จากอินเทอร์เน็ต ทุกคนมี commit" },
];

export const MILESTONES: Gate[] = [
  { id: "proposal", name: "Proposal · ศ. 30 ต.ค.", penalty: "−2", what: "1–2 หน้า ส่งก่อน 23:59" },
  { id: "checkpoint", name: "Checkpoint video · ศ. 20 พ.ย.", penalty: "−2", what: "≤ 2 นาที เห็นข้อมูลไหล node → gateway → cloud → dashboard" },
  { id: "final", name: "Final · อ. 8 ธ.ค.", penalty: "−5 / วัน", what: "slide, report, วิดีโอ, source code, peer evaluation · ไม่หักถ้าส่งก่อน 06:00 วันพุธ" },
];

export interface Entry {
  status: Status;
  aim: number;
  owner: string;
  plan: string;
  evidence?: string;
}

export interface Progress {
  updated: string;
  target: number;
  items: Record<string, Entry>;
}

export const PROGRESS = progress as Progress;
export const TOTAL = CATEGORIES.reduce((sum, category) => sum + category.max, 0);
