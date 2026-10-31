// Formal documents for the course instructor, in English and Thai.
// Sources: docs/strategy.md (28 Oct 2026), lib/project.ts, the course brief; sensor and AI plan changed 29 Oct 2026.
// Nothing here is measured yet: anything that needs data is a `todo` block.
import { STRUCT } from "./message-format";

export type Lang = "en" | "th";
export type Text = Record<Lang, string>;
export type Block =
  | { kind: "p"; text: Text }
  | { kind: "list"; items: Text[]; ordered?: boolean }
  | { kind: "table"; head: Text[]; rows: Text[][]; caption?: Text; numeric?: number[] }
  | { kind: "figure"; figure: "block-diagram" | "state-machine"; caption: Text }
  | { kind: "code"; code: string; caption?: Text }
  | { kind: "todo"; text: Text };
export interface Section { id: string; title: Text; status: "ready" | "draft" | "todo"; blocks: Block[] }
export interface DocMeta { label: Text; value: Text }
export interface Doc { id: "proposal" | "report"; title: Text; subtitle: Text; meta: DocMeta[]; sections: Section[] }

const t = (en: string, th: string): Text => ({ en, th });
const same = (value: string): Text => ({ en: value, th: value });
const dash = same("—");

const COURSE = t("Embedded System (CEDT), Final Project 2026: Smart Devices", "Embedded System (CEDT) Final Project 2026: Smart Devices");

/* ------------------------------------------------------------------ */
/* Proposal                                                            */
/* ------------------------------------------------------------------ */

export const PROPOSAL: Doc = {
  id: "proposal",
  title: t("Ghost-Desk Monitor", "Ghost-Desk Monitor"),
  subtitle: t(
    "Project proposal: a desk sign that verifies whether a library seat is really in use",
    "ข้อเสนอโครงงาน: ป้ายบนโต๊ะที่ตรวจสอบว่าที่นั่งในห้องสมุดมีผู้ใช้งานอยู่จริงหรือไม่",
  ),
  meta: [
    { label: t("Course", "รายวิชา"), value: COURSE },
    { label: t("Group", "กลุ่ม"), value: same("TomyumSea") },
    { label: t("Members", "สมาชิก"), value: t("Five members, see Roles", "สมาชิก 5 คน ดูหัวข้อบทบาท") },
    { label: t("Date", "วันที่"), value: t("30 October 2026 (submitted)", "30 ตุลาคม 2026 (ส่งแล้ว)") },
    { label: t("Repository", "Repository"), value: t("https://github.com/jiraphatnam2204/ghost-desk-monitor", "https://github.com/jiraphatnam2204/ghost-desk-monitor") },
  ],
  sections: [
    {
      id: "problem",
      title: t("1. Problem and target users", "1. ปัญหาและกลุ่มผู้ใช้"),
      status: "ready",
      blocks: [
        {
          kind: "p",
          text: t(
            "During examination periods, many university library desks are reserved with belongings (bags, books) while their owners are absent for long periods. Students who need a seat cannot find one, and library staff have neither the data nor the time to check every desk. Existing QR seat-booking systems record that a desk was **booked**, not whether anyone is **actually sitting** there. Team members see this regularly in the faculty library during exams.",
            "ในช่วงสอบ โต๊ะในห้องสมุดของมหาวิทยาลัยจำนวนมากถูกจองไว้ด้วยสิ่งของ (กระเป๋า หนังสือ) ขณะที่เจ้าของไม่อยู่เป็นเวลานาน นิสิตที่ต้องการที่นั่งจึงหาที่นั่งไม่ได้ และเจ้าหน้าที่ห้องสมุดไม่มีทั้งข้อมูลและเวลาในการตรวจทุกโต๊ะ ระบบจองที่นั่งด้วย QR ที่มีอยู่บันทึกได้เพียงว่าโต๊ะ**ถูกจอง** แต่ไม่รู้ว่ามี**ผู้นั่งอยู่จริง**หรือไม่ สมาชิกในทีมพบเหตุการณ์นี้เป็นประจำในห้องสมุดคณะช่วงสอบ",
          ),
        },
        {
          kind: "p",
          text: t(
            "Ghost-Desk Monitor puts a sensor node on each desk that checks whether a person is really seated and turns a three-face sign (in use / away / free). There is no booking, no check-in and no app login. A desk left with belongings gets a LINE warning at 20 minutes and is released at 30 minutes; a desk left clear is released at once.",
            "Ghost-Desk Monitor ติด sensor node ที่ทุกโต๊ะเพื่อตรวจว่ามีผู้นั่งอยู่จริงหรือไม่ และหมุนป้ายสามหน้า (ใช้งาน / ไม่อยู่ / ว่าง) โดยไม่ต้องจอง ไม่ต้องเช็กอิน และไม่ต้องล็อกอินแอป โต๊ะที่ถูกทิ้งไว้พร้อมสิ่งของจะได้รับข้อความเตือนทาง LINE เมื่อครบ 20 นาที และถูกปล่อยเมื่อครบ 30 นาที ส่วนโต๊ะที่เจ้าของเก็บของไปแล้วจะถูกปล่อยทันที",
          ),
        },
        {
          kind: "table",
          head: [t("User group", "กลุ่มผู้ใช้"), t("Need", "ความต้องการ"), t("What the system provides", "สิ่งที่ระบบให้")],
          rows: [
            [
              t("Students looking for a seat", "นิสิตที่หาที่นั่ง"),
              t("Know at a glance which desks are really free", "รู้ทันทีว่าโต๊ะใดว่างจริง"),
              t("A three-face sign on each desk and a live room map on the web", "ป้ายสามหน้าบนทุกโต๊ะ และผังห้องแบบ real-time บนเว็บ"),
            ],
            [
              t("Students using a desk", "นิสิตที่ใช้โต๊ะอยู่"),
              t("Step away briefly without losing the desk", "ลุกไปชั่วครู่ได้โดยไม่เสียโต๊ะ"),
              t("An “away” state and a LINE warning at 20 minutes", "สถานะ “ไม่อยู่” และข้อความเตือนทาง LINE เมื่อครบ 20 นาที"),
            ],
            [
              t("Library staff", "เจ้าหน้าที่ห้องสมุด"),
              t("Find abandoned belongings, crowding and noise without patrolling", "รู้ว่าโต๊ะใดมีของค้าง ห้องแออัดหรือเสียงดังโดยไม่ต้องเดินตรวจ"),
              t("A staff page with leftover-item flags, CO₂ and sound level", "หน้าเว็บสำหรับเจ้าหน้าที่ แสดงโต๊ะที่มีของค้าง ค่า CO₂ และระดับเสียง"),
            ],
          ],
        },
      ],
    },
    {
      id: "design",
      title: t("2. Block diagram: sensor node, gateway, cloud, dashboard", "2. แผนภาพบล็อก: sensor node, gateway, cloud, dashboard"),
      status: "ready",
      blocks: [
        {
          kind: "list",
          items: [
            t(
              "**Sensor node × 2 (one per desk).** FireBeetle 2 ESP32-S3 with an LD2410 mmWave radar (energy per 0.75 m range gate, OUT pin on an interrupt), a VL53L1X time-of-flight sensor aimed at the seat, an OV2640 camera that takes a photo only when the gateway asks, and a 270° servo that turns the three-face sign. It reads the radar and the distance 10 times a second and sends one 210-byte batch (with its node ID) every second over ESP-NOW.",
              "**Sensor node × 2 (โต๊ะละตัว)** FireBeetle 2 ESP32-S3 พร้อมเรดาร์ mmWave LD2410 (พลังงานแยกตามช่วงระยะ 0.75 m และขา OUT ต่อ interrupt) เซนเซอร์วัดระยะ VL53L1X ที่เล็งไปที่เบาะเก้าอี้ กล้อง OV2640 ที่ถ่ายภาพเฉพาะเมื่อ gateway ขอ และ servo 270° ที่หมุนป้ายสามหน้า อ่านค่าเรดาร์และระยะ 10 ครั้งต่อวินาที แล้วส่งชุดข้อมูล 210 ไบต์ (พร้อมหมายเลข node) ทุก 1 วินาทีผ่าน ESP-NOW",
            ),
            t(
              "**Gateway × 1.** YD-ESP32-23 (ESP32-S3) with an SCD41 CO₂ sensor, a BH1750 light sensor and a MAX4466 microphone. It runs a small Edge Impulse model on the last 5 seconds of radar and distance data from each desk (person / empty / nearby), owns the per-desk state machine and timers, sends SET_SIGN back to the node, asks for a photo when a desk needs checking, and is the only board on the Internet.",
              "**Gateway × 1** YD-ESP32-23 (ESP32-S3) พร้อมเซนเซอร์ CO₂ SCD41 เซนเซอร์แสง BH1750 และไมโครโฟน MAX4466 รันโมเดล Edge Impulse ขนาดเล็กกับข้อมูลเรดาร์และระยะ 5 วินาทีล่าสุดของแต่ละโต๊ะ (person / empty / nearby) ดูแล state machine และตัวจับเวลาของแต่ละโต๊ะ ส่งคำสั่ง SET_SIGN กลับไปที่ node ขอภาพเมื่อต้องตรวจโต๊ะ และเป็นบอร์ดเดียวที่ต่ออินเทอร์เน็ต",
            ),
            t(
              "**Cloud.** Supabase (Postgres + REST + Realtime) stores the raw data sent by the gateway over HTTPS. A cloud vision model receives one desk photo at a decision point and answers empty / person / items_only. LINE Messaging API sends the 20-minute warning.",
              "**Cloud** Supabase (Postgres + REST + Realtime) เก็บข้อมูลดิบที่ gateway ส่งมาผ่าน HTTPS · cloud vision model รับภาพโต๊ะหนึ่งภาพตอนต้องตัดสิน แล้วตอบ empty / person / items_only · LINE Messaging API ส่งข้อความเตือนเมื่อครบ 20 นาที",
            ),
            t(
              "**Dashboard.** A single web page (HTML + JavaScript on GitHub Pages) that shows the live room map, and a staff view with leftover-item flags, CO₂, light and sound level.",
              "**Dashboard** หน้าเว็บหน้าเดียว (HTML + JavaScript บน GitHub Pages) แสดงผังห้องแบบ real-time และหน้าสำหรับเจ้าหน้าที่ที่แสดงโต๊ะที่มีของค้าง ค่า CO₂ ความสว่าง และระดับเสียง",
            ),
          ],
        },
        {
          kind: "figure",
          figure: "block-diagram",
          caption: t(
            "Figure 1. Block diagram: two sensor nodes, one gateway, cloud storage, dashboard and LINE notification.",
            "รูปที่ 1 แผนภาพบล็อก: sensor node 2 ตัว gateway 1 ตัว cloud storage dashboard และการแจ้งเตือนทาง LINE",
          ),
        },
        {
          kind: "p",
          text: t(
            "**Desk rule.** A desk becomes *in use* after the gateway model has reported a seated person for 60 seconds; there is no check-in. When it has not seen one for 2 minutes, the gateway asks the node for a photo and sends it to the cloud vision model: `empty` releases the desk immediately, `items_only` marks it *away*, sends a LINE warning at 20 minutes and releases it at 30 minutes with a leftover-item flag for staff, and `person` keeps it in use. If the cloud model does not answer, the plain 30-minute rule applies.",
            "**กติกาของโต๊ะ** โต๊ะจะเป็นสถานะ *ใช้งาน* เมื่อโมเดลบน gateway ตรวจพบผู้นั่งต่อเนื่อง 60 วินาที โดยไม่ต้องเช็กอิน เมื่อไม่พบผู้นั่ง 2 นาที gateway จะขอภาพจาก node แล้วส่งให้ cloud vision model: `empty` ปล่อยโต๊ะทันที, `items_only` เปลี่ยนเป็น *ไม่อยู่* ส่ง LINE เตือนเมื่อครบ 20 นาที และปล่อยโต๊ะเมื่อครบ 30 นาทีพร้อมแจ้งเจ้าหน้าที่ว่ามีของค้าง, `person` คงสถานะใช้งาน หาก cloud model ไม่ตอบ ระบบใช้กติกา 30 นาทีตามปกติ",
          ),
        },
      ],
    },
    {
      id: "bom",
      title: t("3. Sensors and actuators (bill of materials)", "3. เซนเซอร์และแอคชูเอเตอร์ (รายการอุปกรณ์)"),
      status: "ready",
      blocks: [
        {
          kind: "table",
          head: [t("Part", "อุปกรณ์"), t("Board", "บอร์ด"), t("Qty", "จำนวน"), t("Interface", "การเชื่อมต่อ"), t("Price (THB)", "ราคา (บาท)"), t("Note", "หมายเหตุ")],
          numeric: [2, 4],
          rows: [
            [same("FireBeetle 2 ESP32-S3 + OV2640"), t("Node", "Node"), same("2"), t("Camera on FPC", "กล้องต่อผ่าน FPC"), same("2,370"), t("MCU and camera (sensor 3); photo on request", "MCU และกล้อง (เซนเซอร์ 3) ถ่ายภาพเมื่อได้รับคำสั่ง")],
            [same("HLK-LD2410 mmWave 24 GHz"), t("Node", "Node"), same("2"), same("UART + OUT pin"), same("360"), t("Sensor 1: presence, including still sitting", "เซนเซอร์ 1: ตรวจผู้นั่งแม้นั่งนิ่ง")],
            [same("VL53L1X time-of-flight"), t("Node", "Node"), same("2"), same("I²C"), same("420"), t("Sensor 2: distance to the seat", "เซนเซอร์ 2: ระยะถึงเบาะเก้าอี้")],
            [same("TD-7120MG servo 0–270°"), t("Node", "Node"), same("2"), same("PWM"), same("880"), t("Actuator: turns the three-face sign", "แอคชูเอเตอร์: หมุนป้ายสามหน้า")],
            [same("YD-ESP32-23 (ESP32-S3)"), t("Gateway", "Gateway"), same("1"), same("Wi-Fi + ESP-NOW"), same("0"), t("Already owned (Lab 10 board)", "มีอยู่แล้ว (บอร์ดจาก Lab 10)")],
            [same("SCD41 CO₂"), t("Gateway", "Gateway"), same("1"), same("I²C"), same("820"), t("Sensor 4: CO₂, temperature, humidity (MH-Z19C, 895, if the SCD41 stays out of stock)", "เซนเซอร์ 4: CO₂ อุณหภูมิ ความชื้น (ใช้ MH-Z19C 895 บาท หาก SCD41 ยังขาดตลาด)")],
            [same("MAX4466 analog microphone"), t("Gateway", "Gateway"), same("1"), same("ADC"), same("65"), t("Sensor 5: sound level", "เซนเซอร์ 5: ระดับเสียง")],
            [same("GY-302 BH1750"), t("Gateway", "Gateway"), same("1"), same("I²C"), same("50"), t("Sensor 6: ambient light", "เซนเซอร์ 6: ความสว่าง")],
            [t("5 V 2 A adapters", "อแดปเตอร์ 5 V 2 A"), t("Node", "Node"), same("2"), same("DC jack"), same("260"), t("Stable supply for camera, Wi-Fi and servo; the gateway uses a USB-C phone charger already owned", "จ่ายไฟให้กล้อง Wi-Fi และ servo อย่างเพียงพอ ส่วน gateway ใช้ที่ชาร์จมือถือ USB-C ที่มีอยู่แล้ว")],
            [t("Wires, capacitors, enclosure, printing", "สายไฟ ตัวเก็บประจุ กล่อง งานพิมพ์"), dash, dash, dash, same("~400"), t("Estimate", "ประมาณการ")],
            [t("**Total**", "**รวม**"), dash, dash, dash, same("**~5,625**"), t("About 1,125 per member", "ประมาณคนละ 1,125 บาท")],
          ],
          caption: t(
            "Table 1. Bill of materials. Prices checked on Thai shop pages on 28–29 Oct 2026, excluding shipping; items marked ~ are estimates. Six sensor types: three on the node (radar, time-of-flight, camera, which counts as a sensor under FAQ 6) and three on the gateway.",
            "ตารางที่ 1 รายการอุปกรณ์ ราคาตรวจสอบจากร้านในประเทศไทยเมื่อ 28–29 ต.ค. 2026 ไม่รวมค่าจัดส่ง รายการที่มี ~ เป็นราคาประมาณ มีเซนเซอร์ 6 ชนิด: 3 ชนิดบน node (เรดาร์ เซนเซอร์วัดระยะ และกล้อง ซึ่งนับเป็นเซนเซอร์ตาม FAQ ข้อ 6) และ 3 ชนิดบน gateway",
          ),
        },
      ],
    },
    {
      id: "depth",
      title: t("4. Chosen Embedded Engineering Depth items (Section 5, II′)", "4. หัวข้อ Embedded Engineering Depth ที่เลือก (หัวข้อ 5, II′)"),
      status: "ready",
      blocks: [
        {
          kind: "table",
          head: [t("Item", "หัวข้อ"), t("Implementation plan", "แนวทางการพัฒนา")],
          rows: [
            [t("**E1** RTOS multitasking", "**E1** RTOS multitasking"), t("FreeRTOS on the node with five tasks (radar, time-of-flight, communication, camera, sign) with reasoned priorities, exchanging readings through a queue and protecting the I²C bus with a mutex.", "ใช้ FreeRTOS บน node 5 task (เรดาร์ เซนเซอร์วัดระยะ การสื่อสาร กล้อง และป้าย) กำหนด priority อย่างมีเหตุผล ส่งค่าระหว่าง task ผ่าน queue และใช้ mutex ป้องกันการใช้ I²C bus พร้อมกัน")],
            [t("**E2** Interrupt-driven I/O", "**E2** Interrupt-driven I/O"), t("The LD2410 OUT pin triggers an ISR that gives a semaphore to wake the radar task (deferred processing, no polling).", "ขา OUT ของ LD2410 สร้าง interrupt ที่ ISR ให้ semaphore เพื่อปลุก task ของเรดาร์ (deferred processing ไม่ใช้ busy polling)")],
            [t("**E4** Reliable communication", "**E4** Reliable communication"), t("ESP-NOW acknowledgement from the send callback with up to three retries; the gateway buffers records in RAM and forwards them when the Internet returns.", "ใช้ acknowledgement จาก send callback ของ ESP-NOW พร้อมส่งซ้ำสูงสุด 3 ครั้ง และ gateway เก็บข้อมูลไว้ใน RAM แล้วส่งต่อเมื่ออินเทอร์เน็ตกลับมา (store-and-forward)")],
            [t("**E5** Security", "**E5** Security"), t("HTTPS (TLS) to Supabase, LINE and the vision API; Wi-Fi password, API keys and LINE token kept in an uncommitted `secrets.h`.", "เชื่อมต่อ Supabase, LINE และ vision API ผ่าน HTTPS (TLS) โดยเก็บรหัส Wi-Fi, API key และ LINE token ไว้ใน `secrets.h` ที่ไม่ถูก commit")],
            [t("**E7** On-device AI", "**E7** On-device AI"), t("Edge Impulse classifier (person / empty / nearby) trained on our own radar range-gate and time-of-flight data, running on the gateway ESP32-S3 (allowed by FAQ 4); it must beat a hand-written threshold rule on the same test set. Review on 13 Nov 2026.", "ตัวจำแนกจาก Edge Impulse (person / empty / nearby) ที่เทรนจากข้อมูลเรดาร์แยกช่วงระยะและข้อมูลระยะ ToF ของทีมเอง ทำงานบน gateway ESP32-S3 (อนุญาตตาม FAQ ข้อ 4) และต้องแม่นกว่ากติกา threshold ที่เขียนเองบนชุดทดสอบเดียวกัน ประเมินในวันที่ 13 พ.ย. 2026")],
          ],
        },
      ],
    },
    {
      id: "roles",
      title: t("5. Role of each member", "5. บทบาทของสมาชิกแต่ละคน"),
      status: "ready",
      blocks: [
        {
          kind: "table",
          head: [t("Role", "บทบาท"), t("Members", "สมาชิก")],
          rows: [
            [same("System Architect & Integration"), same("จิรภัทร นามวงศ์")],
            [same("Embedded Developer (Sensor Node)"), same("เขตโสภณ ครองยุติ, ชากิร บากา")],
            [same("Embedded Developer (Gateway & Cloud)"), same("เขตโสภณ ครองยุติ, ชากิร บากา")],
            [same("UI/UX & Dashboard Developer"), same("ธนกฤต สุนทรเวชพงษ์, ก้องภพ แสงแก้ว")],
            [same("Project Manager & Test Lead"), same("ก้องภพ แสงแก้ว")],
          ],
          caption: t(
            "Table 2. Roles as submitted on 30 Oct 2026, using the five roles in the course brief. Student IDs are in the submitted PDF, not on this public page.",
            "ตารางที่ 2 บทบาทตามที่ส่งเมื่อ 30 ต.ค. 2026 ใช้ 5 บทบาทตามเอกสารโจทย์ เลขประจำตัวอยู่ใน PDF ที่ส่ง ไม่แสดงบนหน้าเว็บสาธารณะนี้",
          ),
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Final report skeleton                                               */
/* ------------------------------------------------------------------ */

export const REPORT: Doc = {
  id: "report",
  title: t("Ghost-Desk Monitor", "Ghost-Desk Monitor"),
  subtitle: t("Final report (working draft, at most 10 pages)", "รายงานฉบับสมบูรณ์ (ฉบับร่าง ไม่เกิน 10 หน้า)"),
  meta: [
    { label: t("Course", "รายวิชา"), value: COURSE },
    { label: t("Group", "กลุ่ม"), value: same("TomyumSea") },
    { label: t("Submission", "กำหนดส่ง"), value: t("8 December 2026, 23:59", "8 ธันวาคม 2026 เวลา 23:59 น.") },
    { label: t("Repository", "Repository"), value: t("https://github.com/jiraphatnam2204/ghost-desk-monitor", "https://github.com/jiraphatnam2204/ghost-desk-monitor") },
  ],
  sections: [
    {
      id: "introduction",
      title: t("1. Introduction and problem statement", "1. บทนำและนิยามปัญหา"),
      status: "draft",
      blocks: [
        {
          kind: "p",
          text: t(
            "University libraries become crowded during examination periods, and a share of their desks is held by belongings while the owners are away. This project builds a per-desk sensing system that verifies actual presence, shows each desk's state on a physical sign and a live room map, and releases desks that have been abandoned for 30 minutes.",
            "ห้องสมุดของมหาวิทยาลัยมีผู้ใช้หนาแน่นในช่วงสอบ และโต๊ะส่วนหนึ่งถูกจองไว้ด้วยสิ่งของขณะที่เจ้าของไม่อยู่ โครงงานนี้พัฒนาระบบตรวจวัดรายโต๊ะที่ยืนยันการมีอยู่ของผู้นั่งจริง แสดงสถานะของโต๊ะบนป้ายและผังห้องแบบ real-time และปล่อยโต๊ะที่ถูกทิ้งไว้เกิน 30 นาที",
          ),
        },
        {
          kind: "list",
          items: [
            t("**Objective 1.** Detect presence reliably, including a person sitting still, with a model on the gateway that beats a hand-written threshold rule.", "**วัตถุประสงค์ 1** ตรวจจับผู้นั่งได้อย่างน่าเชื่อถือ รวมถึงผู้ที่นั่งนิ่ง ด้วยโมเดลบน gateway ที่แม่นกว่ากติกา threshold ที่เขียนเอง"),
            t("**Objective 2.** Distinguish an empty desk from one holding only belongings, sending one photo to a cloud vision model only when a desk is checked, and storing none.", "**วัตถุประสงค์ 2** แยกโต๊ะว่างออกจากโต๊ะที่มีแต่สิ่งของ โดยส่งภาพหนึ่งภาพให้ cloud vision model เฉพาะตอนตรวจโต๊ะ และไม่เก็บภาพไว้"),
            t("**Objective 3.** Show desk state within 3 seconds of a change and alert users and staff at the right time.", "**วัตถุประสงค์ 3** แสดงสถานะของโต๊ะภายใน 3 วินาทีหลังการเปลี่ยนแปลง และแจ้งผู้ใช้และเจ้าหน้าที่ในเวลาที่เหมาะสม"),
          ],
        },
        {
          kind: "todo",
          text: t(
            "Add the measured scale of the problem from the ghost-desk count and the survey (number of responses, key percentages).",
            "เพิ่มขนาดของปัญหาจากผลการนับโต๊ะและผลแบบสอบถาม (จำนวนผู้ตอบ และร้อยละที่สำคัญ)",
          ),
        },
      ],
    },
    {
      id: "related",
      title: t("2. Related work and similar solutions", "2. งานที่เกี่ยวข้องและระบบที่คล้ายกัน"),
      status: "todo",
      blocks: [
        {
          kind: "table",
          head: [t("Approach", "แนวทาง"), t("What it knows", "สิ่งที่รู้"), t("Limitation this project addresses", "ข้อจำกัดที่โครงงานนี้แก้")],
          rows: [
            [t("QR seat booking", "การจองที่นั่งด้วย QR"), t("That a desk was booked", "ว่าโต๊ะถูกจอง"), t("Cannot tell whether the booker is still present", "ไม่รู้ว่าผู้จองยังอยู่ที่โต๊ะหรือไม่")],
            [t("PIR desk sensors in offices", "เซนเซอร์ PIR ใต้โต๊ะในสำนักงาน"), t("Recent motion near the desk", "การเคลื่อนไหวล่าสุดใกล้โต๊ะ"), t("Misses a person sitting still; cannot see belongings", "ตรวจไม่พบผู้ที่นั่งนิ่ง และไม่เห็นสิ่งของ")],
            [t("Manual staff patrol", "การเดินตรวจโดยเจ้าหน้าที่"), t("Whatever staff observe on a round", "สิ่งที่เจ้าหน้าที่เห็นขณะเดินตรวจ"), t("Labour-intensive and infrequent", "ใช้แรงงานมากและตรวจได้ไม่บ่อย")],
          ],
        },
        {
          kind: "todo",
          text: t(
            "Find and cite: at least one university library seat-booking system (QR or app based), at least one commercial desk-occupancy sensor product, and at least one paper on mmWave or time-of-flight presence detection. Compare them with this project's measured metrics in section 4.",
            "ค้นหาและอ้างอิง: ระบบจองที่นั่งของห้องสมุดมหาวิทยาลัยอย่างน้อย 1 ระบบ (QR หรือแอป) ผลิตภัณฑ์เซนเซอร์ตรวจการใช้โต๊ะเชิงพาณิชย์อย่างน้อย 1 รายการ และบทความเรื่องการตรวจจับคนด้วย mmWave หรือ time-of-flight อย่างน้อย 1 บทความ แล้วเปรียบเทียบกับค่าที่วัดได้ในหัวข้อที่ 4",
          ),
        },
      ],
    },
    {
      id: "system",
      title: t("3. System design", "3. การออกแบบระบบ"),
      status: "draft",
      blocks: [
        {
          kind: "figure",
          figure: "block-diagram",
          caption: t("Figure 1. System overview.", "รูปที่ 1 ภาพรวมของระบบ"),
        },
        {
          kind: "p",
          text: t(
            "**Sensor node.** A FireBeetle 2 ESP32-S3 with an OV2640 camera reads an HLK-LD2410 radar in engineering mode (UART, energy per 0.75 m range gate, with its OUT pin on an interrupt) and a VL53L1X time-of-flight sensor (I²C) ten times a second, sends one batch of ten readings every second, takes a photo when the gateway asks and posts it to the gateway over the local Wi-Fi, and turns the sign with a TD-7120MG servo. FreeRTOS tasks pass readings through a queue.",
            "**Sensor node** บอร์ด FireBeetle 2 ESP32-S3 พร้อมกล้อง OV2640 อ่านค่าเรดาร์ HLK-LD2410 ในโหมด engineering (UART พลังงานแยกตามช่วงระยะ 0.75 m และใช้ขา OUT เป็น interrupt) และเซนเซอร์วัดระยะ VL53L1X (I²C) 10 ครั้งต่อวินาที ส่งข้อมูลชุดละ 10 ค่าทุก 1 วินาที ถ่ายภาพเมื่อ gateway ขอแล้วส่งให้ gateway ผ่าน Wi-Fi ในวงเดียวกัน และหมุนป้ายด้วย servo TD-7120MG โดย task ของ FreeRTOS ส่งค่าระหว่างกันผ่าน queue",
          ),
        },
        {
          kind: "p",
          text: t(
            "**Gateway.** A Waveshare ESP32-S3 board (N8R8, DevKitC-1 layout) receives node batches over ESP-NOW, runs the Edge Impulse model on the last 5 seconds of each desk every second, runs one state machine per desk, sends a desk photo to the cloud vision API when a decision needs it, reads an SCD41 and a BH1750 on a shared I²C bus and a MAX4466 microphone on an ADC1 pin, uploads to Supabase over HTTPS, buffers records in RAM while offline, and sends LINE broadcasts.",
            "**Gateway** บอร์ด Waveshare ESP32-S3 (N8R8 ผังขาแบบ DevKitC-1) รับชุดข้อมูลจาก node ผ่าน ESP-NOW รันโมเดล Edge Impulse กับข้อมูล 5 วินาทีล่าสุดของแต่ละโต๊ะทุก 1 วินาที ทำงาน state machine แยกต่อโต๊ะ ส่งภาพโต๊ะไปที่ cloud vision API เมื่อต้องตัดสิน อ่านค่า SCD41 และ BH1750 บน I²C bus ร่วมกัน และไมโครโฟน MAX4466 ผ่านขา ADC1 ส่งข้อมูลขึ้น Supabase ผ่าน HTTPS พักข้อมูลไว้ใน RAM ขณะออฟไลน์ และส่ง LINE broadcast",
          ),
        },
        {
          kind: "p",
          text: t(
            "**Cloud and dashboard.** Supabase stores every record in Postgres and pushes changes through Realtime to a single-page HTML/JavaScript dashboard hosted on GitHub Pages, which shows the room map and a staff view.",
            "**Cloud และ dashboard** Supabase เก็บข้อมูลทุกรายการใน Postgres และส่งการเปลี่ยนแปลงผ่าน Realtime ไปยัง dashboard แบบ HTML/JavaScript หน้าเดียวบน GitHub Pages ซึ่งแสดงผังห้องและหน้าสำหรับเจ้าหน้าที่",
          ),
        },
        {
          kind: "code",
          code: STRUCT,
          caption: t(
            "Listing 1. Node-to-gateway message (ESP-NOW, packed, one batch a second). Gateway to node: {ver, node_id, seq, cmd = SET_SIGN | SNAP, face}. Photos go from node to gateway by HTTP on the local Wi-Fi. Gateway to cloud: one JSON row per state change.",
            "รายการที่ 1 ข้อความจาก node ไปยัง gateway (ESP-NOW แบบ packed ชุดละ 1 วินาที) ข้อความจาก gateway ไปยัง node: {ver, node_id, seq, cmd = SET_SIGN | SNAP, face} ภาพส่งจาก node ไปยัง gateway ทาง HTTP บน Wi-Fi วงเดียวกัน และ gateway ส่งข้อมูล JSON หนึ่งแถวต่อการเปลี่ยนสถานะขึ้น cloud",
          ),
        },
        {
          kind: "figure",
          figure: "state-machine",
          caption: t(
            "Figure 2. Desk state machine at the gateway: FREE, IN_USE and AWAY. The gateway model decides presence; the cloud vision model decides after 2 minutes without a person.",
            "รูปที่ 2 state machine ของโต๊ะที่ gateway: FREE, IN_USE และ AWAY โมเดลบน gateway ตัดสินการมีผู้นั่ง และ cloud vision model ตัดสินเมื่อไม่พบผู้นั่ง 2 นาที",
          ),
        },
        {
          kind: "todo",
          text: t(
            "Replace planned values with the implemented ones: final pin map, task priorities, retry timeout, offline threshold and the frozen message format.",
            "แทนค่าที่วางแผนไว้ด้วยค่าที่ใช้งานจริง: pin map, priority ของ task, timeout ของการส่งซ้ำ, เกณฑ์ออฟไลน์ และ message format ฉบับสุดท้าย",
          ),
        },
      ],
    },
    {
      id: "results",
      title: t("4. Test results and performance metrics", "4. ผลการทดสอบและการวัดประสิทธิภาพ"),
      status: "todo",
      blocks: [
        {
          kind: "table",
          head: [t("Metric", "ตัวชี้วัด"), t("Method", "วิธีวัด"), t("Target", "เป้าหมาย"), t("Mean", "ค่าเฉลี่ย"), t("Min / max", "ต่ำสุด / สูงสุด")],
          rows: [
            [t("End-to-end latency", "เวลาแฝงตลอดเส้นทาง"), t("Timestamps at each stage, 20 repetitions", "บันทึกเวลาทุกจุด ทำซ้ำ 20 ครั้ง"), t("≤ 3 s", "≤ 3 วินาที"), dash, dash],
            [t("Packet delivery rate", "อัตราการส่งแพ็กเก็ตสำเร็จ"), t("Missing sequence numbers over 24 h", "นับ seq ที่หายในการทำงาน 24 ชั่วโมง"), t("≥ 99% after retry", "≥ 99% หลังส่งซ้ำ"), dash, dash],
            [t("AI precision / recall", "precision / recall ของ AI"), t("Gateway model on held-out sessions, 3 classes, confusion matrix, compared with the threshold rule", "โมเดลบน gateway กับข้อมูลรอบที่แยกไว้ 3 คลาส confusion matrix และเทียบกับกติกา threshold"), t("≥ 80% per class", "≥ 80% ทุกคลาส"), dash, dash],
            [t("Uptime", "ระยะเวลาทำงานต่อเนื่อง"), t("Heartbeat every minute over 24 h", "heartbeat ทุก 1 นาทีตลอด 24 ชั่วโมง"), t("≥ 99%", "≥ 99%"), dash, dash],
          ],
          caption: t("Table 2. Metrics and methods. Results are filled in after the 24-hour run.", "ตารางที่ 2 ตัวชี้วัดและวิธีวัด ผลจะบันทึกหลังการทดสอบต่อเนื่อง 24 ชั่วโมง"),
        },
        {
          kind: "table",
          head: [t("Group", "กลุ่ม"), t("Cases", "กรณีทดสอบ"), t("Result", "ผล")],
          rows: [
            [t("Normal use", "การใช้งานปกติ"), t("Sit and leave; leave with a bag (warning at 20, release at 30); leave with a clear desk (immediate release)", "นั่งแล้วลุก ลุกโดยทิ้งกระเป๋า (เตือน 20 นาที ปล่อย 30 นาที) และลุกโดยโต๊ะโล่ง (ปล่อยทันที)"), dash],
            [t("Edge cases", "กรณีขอบเขต"), t("Sitting very still; person walking behind; person at the next desk; bag on the chair; dark clothing; lights on/off; return at minute 29; AI reports empty while a person is still", "นั่งนิ่งมาก คนเดินผ่านด้านหลัง คนนั่งโต๊ะข้าง ๆ กระเป๋าวางบนเก้าอี้ เสื้อสีเข้ม เปิด/ปิดไฟ กลับมานาทีที่ 29 และ AI บอกว่าโต๊ะว่างขณะมีผู้นั่งนิ่ง"), dash],
            [t("Failure conditions", "กรณีระบบขัดข้อง"), t("Gateway Wi-Fi lost; node power lost; sensor unplugged; invalid cloud key; cloud vision unavailable", "gateway ขาด Wi-Fi, node ไฟดับ, ถอดสายเซนเซอร์, ใช้ key ของ cloud ผิด และ cloud vision ใช้งานไม่ได้"), dash],
          ],
          caption: t("Table 3. Test plan.", "ตารางที่ 3 แผนการทดสอบ"),
        },
        {
          kind: "todo",
          text: t(
            "Run the 24-hour test, fill both tables with measured values (mean and min/max), add the gateway model's confusion matrix next to the threshold rule's, and the count of false releases.",
            "ทดสอบต่อเนื่อง 24 ชั่วโมง แล้วบันทึกค่าที่วัดได้ลงในทั้งสองตาราง (ค่าเฉลี่ย ค่าต่ำสุดและสูงสุด) พร้อม confusion matrix ของโมเดลบน gateway เทียบกับกติกา threshold และจำนวนครั้งที่ปล่อยโต๊ะผิดพลาด",
          ),
        },
      ],
    },
    {
      id: "discussion",
      title: t("5. Discussion and conclusion", "5. อภิปรายและสรุปผล"),
      status: "todo",
      blocks: [
        {
          kind: "todo",
          text: t(
            "Answer, with measured numbers: Did the system meet each objective and target? How does it compare with QR booking, PIR sensors and manual patrol? What limitations remain (broadcast alerts reach every follower, no desk ownership, relative sound level only)? What would be done differently or next?",
            "ตอบโดยใช้ค่าที่วัดได้: ระบบบรรลุวัตถุประสงค์และเป้าหมายแต่ละข้อหรือไม่ เปรียบเทียบกับการจองด้วย QR เซนเซอร์ PIR และการเดินตรวจอย่างไร ยังมีข้อจำกัดใด (การแจ้งเตือนแบบ broadcast ถึงผู้ติดตามทุกคน ระบบไม่ทราบเจ้าของโต๊ะ และวัดได้เพียงระดับเสียงเชิงเปรียบเทียบ) และหากพัฒนาต่อจะทำอะไร",
          ),
        },
      ],
    },
    {
      id: "contribution",
      title: t("6. Roles, contributions, repository and AI tool declaration", "6. บทบาท ผลงานของสมาชิก repository และการใช้เครื่องมือ AI"),
      status: "draft",
      blocks: [
        {
          kind: "table",
          head: [t("Member", "สมาชิก"), t("Role", "บทบาท"), t("Contribution", "ผลงาน")],
          rows: [
            [same("จิรภัทร นามวงศ์"), same("System Architect & Integration"), t("[contribution]", "[ผลงาน]")],
            [same("เขตโสภณ ครองยุติ"), same("Embedded Developer (Sensor Node), Embedded Developer (Gateway & Cloud)"), t("[contribution]", "[ผลงาน]")],
            [same("ชากิร บากา"), same("Embedded Developer (Sensor Node), Embedded Developer (Gateway & Cloud)"), t("[contribution]", "[ผลงาน]")],
            [same("ธนกฤต สุนทรเวชพงษ์"), same("UI/UX & Dashboard Developer"), t("[contribution]", "[ผลงาน]")],
            [same("ก้องภพ แสงแก้ว"), same("UI/UX & Dashboard Developer, Project Manager & Test Lead"), t("[contribution]", "[ผลงาน]")],
          ],
        },
        {
          kind: "p",
          text: t("**Repository:** https://github.com/jiraphatnam2204/ghost-desk-monitor", "**Repository:** https://github.com/jiraphatnam2204/ghost-desk-monitor"),
        },
        {
          kind: "p",
          text: t(
            "**AI tool declaration.** Claude (Anthropic) was used to draft the project strategy, the team website and these documents. All other AI tools used for code or writing, and the parts of the system they were used for, are listed below.",
            "**การใช้เครื่องมือ AI** ทีมใช้ Claude (Anthropic) ในการร่างแผนกลยุทธ์ของโครงงาน เว็บไซต์ของทีม และเอกสารฉบับนี้ เครื่องมือ AI อื่นที่ใช้ในการเขียนโค้ดหรือเอกสาร และส่วนของระบบที่ใช้ แสดงไว้ด้านล่าง",
          ),
        },
        {
          kind: "todo",
          text: t(
            "Each member lists the AI tools they used (e.g. for firmware or the dashboard) and for which parts, and fills in their contribution above.",
            "สมาชิกแต่ละคนระบุเครื่องมือ AI ที่ใช้ (เช่น สำหรับเฟิร์มแวร์หรือ dashboard) และส่วนที่ใช้ พร้อมกรอกผลงานของตนในตารางด้านบน",
          ),
        },
      ],
    },
  ],
};
