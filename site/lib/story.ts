// The use case, told on three desks. Times are room minutes after the story starts; the story clock pauses on each step.
import type { ManualEvent } from "./session";

export type Persona = "seeker" | "user" | "staff";
export const PERSONA_LABEL: Record<Persona, string> = {
  seeker: "ผู้หาที่นั่ง",
  user: "เจ้าของโต๊ะ",
  staff: "เจ้าหน้าที่",
};

export const STORY_BASE = 120; // 15:00 on the room clock

// Desk index → what that person does.
export const STORY_DESKS: Record<number, ManualEvent[]> = {
  6: [
    { at: 0.5, kind: "sit" },
    { at: 10, kind: "leave-items" },
  ],
  14: [
    { at: -60, kind: "sit" },
    { at: 44, kind: "leave-clean" },
  ],
  19: [
    { at: -60, kind: "sit" },
    { at: 50, kind: "leave-items" },
    { at: 58, kind: "sit" },
  ],
};

export interface StoryStep {
  at: number;
  desk: number;
  persona: Persona;
  title: string;
  text: string;
}

export const STORY: StoryStep[] = [
  {
    at: 0.3,
    desk: 6,
    persona: "seeker",
    title: "ช่วงสอบ ห้องเกือบเต็ม",
    text: "นิสิต A เปิดผังห้องจาก QR หรือเว็บ เห็นทันทีว่าโต๊ะไหนว่างจริง (เขียว) ไม่ต้องเดินวนหา · D07 ว่างอยู่",
  },
  {
    at: 2,
    desk: 6,
    persona: "user",
    title: "A นั่งที่ D07",
    text: "AI บน gateway เห็นคนนั่งจากเรดาร์และระยะ ToF ครบ 1 นาที โต๊ะเป็น ใช้งาน เอง ป้ายหมุนเป็นสีชมพู ไม่ต้องเช็กอิน ไม่ต้องจอง",
  },
  {
    at: 13,
    desk: 6,
    persona: "user",
    title: "A ลุกไปกินข้าว ทิ้งกระเป๋าไว้",
    text: "ไม่เห็นคน 2 นาที gateway ขอภาพจากกล้องแล้วถาม cloud AI: มีของบนโต๊ะ → ไม่อยู่ ป้ายหมุนเป็นสีเหลือง โต๊ะยังเป็นของ A ถ้ากลับมาทัน",
  },
  {
    at: 31,
    desk: 6,
    persona: "user",
    title: "นาทีที่ 20: LINE เตือน",
    text: "gateway ส่งข้อความผ่าน LINE Official Account ว่า D07 ไม่มีคนมา 20 นาที และจะปล่อยใน 10 นาที (ทุกคนที่เป็นเพื่อนกับ OA ได้รับ)",
  },
  {
    at: 41,
    desk: 6,
    persona: "staff",
    title: "นาทีที่ 30: ปล่อยโต๊ะ",
    text: "A ไม่กลับมา โต๊ะเป็น ว่าง ให้คนอื่นนั่ง ป้ายหมุนเป็นสีเขียว และหน้าเจ้าหน้าที่ขึ้นว่า D07 มีกระเป๋าค้าง ให้มาเก็บ",
  },
  {
    at: 47,
    desk: 14,
    persona: "seeker",
    title: "B เก็บของกลับบ้าน",
    text: "D15 ไม่เห็นคน 2 นาทีแล้ว cloud AI เห็นโต๊ะโล่งจากภาพ → ว่างทันที ไม่ต้องรอ 30 นาที คนที่หาที่นั่งได้โต๊ะเร็วขึ้น",
  },
  {
    at: 53,
    desk: 19,
    persona: "user",
    title: "C ไปห้องน้ำ ทิ้งของไว้",
    text: "D20 ไม่เห็นคน 2 นาที มีของบนโต๊ะ → ไม่อยู่ เหมือนกรณีของ A",
  },
  {
    at: 59,
    desk: 19,
    persona: "user",
    title: "C กลับมาที่นาทีที่ 8",
    text: "เห็นคนอีกครั้ง → ใช้งาน ทันที ป้ายหมุนกลับเป็นสีชมพู ไม่มี LINE ไม่มีอะไรต้องกด",
  },
];
