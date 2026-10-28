// Formal diagrams for the written documents: plain boxes and arrows, drawn in toner.
import type { Lang } from "@/lib/docs-content";

function Box({ x, y, w, h, title, lines, heavy }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; heavy?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className={heavy ? "df-box df-heavy" : "df-box"} />
      <text x={x + 12} y={y + 24} className="df-title">
        {title}
      </text>
      <line x1={x} x2={x + w} y1={y + 34} y2={y + 34} className="df-rule" />
      {lines.map((line, index) => (
        <text key={line} x={x + 12} y={y + 54 + index * 18} className="df-line">
          {line}
        </text>
      ))}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, below }: { x1: number; y1: number; x2: number; y2: number; label: string; below?: boolean }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="df-arrow" markerEnd="url(#df-head)" />
      <text x={mx} y={below ? my + 18 : my - 8} className="df-label" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <marker id="df-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10Z" className="df-head" />
      </marker>
    </defs>
  );
}

export function BlockDiagram({ lang }: { lang: Lang }) {
  const th = lang === "th";
  return (
    <svg className="doc-figure-svg" viewBox="0 0 900 330" role="img" aria-label={th ? "แผนภาพระบบ: sensor node สองตัวส่งข้อมูลไป gateway แล้วขึ้น cloud แสดงบน dashboard และแจ้งเตือนผ่าน LINE" : "Block diagram: two sensor nodes report to a gateway, which stores data in the cloud, drives the dashboard and sends LINE alerts"}>
      <Defs />
      <Box x={10} y={20} w={215} h={190} title={th ? "Sensor node × 2 (ต่อโต๊ะ)" : "Sensor node × 2 (per desk)"} lines={["FireBeetle 2 ESP32-S3", "LD2410 mmWave (UART, OUT)", "AMG8833 thermal (I²C)", "OV2640 + on-device AI", "Servo 270° → prism sign"]} />
      <Box x={365} y={20} w={225} h={190} title="Gateway × 1" heavy lines={["YD-ESP32-23 (ESP32-S3)", "SCD41 CO₂ (I²C)", "BH1750 light (I²C)", "MAX4466 mic (ADC1)", th ? "State machine + ตัวจับเวลา" : "State machine + timers"]} />
      <Box x={680} y={20} w={210} h={110} title="Cloud" lines={["Supabase Postgres", "REST insert + Realtime"]} />
      <Box x={680} y={170} w={210} h={90} title="Dashboard" lines={[th ? "หน้าเว็บผังห้อง (GitHub Pages)" : "Room map web page"]} />
      <Box x={365} y={250} w={225} h={70} title="LINE Official Account" lines={[th ? "broadcast เตือนนาทีที่ 20" : "broadcast at 20 min"]} />
      <Arrow x1={225} y1={95} x2={363} y2={95} label="ESP-NOW report" />
      <Arrow x1={363} y1={145} x2={227} y2={145} label="SET_SIGN, ack" below />
      <Arrow x1={590} y1={80} x2={678} y2={80} label="HTTPS" />
      <Arrow x1={785} y1={130} x2={785} y2={168} label="" />
      <text x={796} y={154} className="df-label">
        Realtime
      </text>
      <Arrow x1={477} y1={210} x2={477} y2={248} label="" />
      <text x={487} y={234} className="df-label">
        Messaging API
      </text>
    </svg>
  );
}

export function StateDiagram({ lang }: { lang: Lang }) {
  const th = lang === "th";
  const t = (en: string, thai: string) => (th ? thai : en);
  return (
    <svg className="doc-figure-svg" viewBox="0 0 900 300" role="img" aria-label={t("Desk state machine: FREE, IN_USE and AWAY with their transitions", "state machine ของโต๊ะ: FREE, IN_USE และ AWAY กับเงื่อนไขการเปลี่ยนสถานะ")}>
      <Defs />
      <Box x={20} y={100} w={190} h={80} title="FREE" lines={[t("sign: free", "ป้าย: ว่าง")]} />
      <Box x={355} y={100} w={190} h={80} title="IN_USE" heavy lines={[t("sign: in use", "ป้าย: ใช้งาน")]} />
      <Box x={690} y={100} w={190} h={80} title="AWAY" lines={[t("sign: away", "ป้าย: ไม่อยู่")]} />
      <Arrow x1={210} y1={125} x2={353} y2={125} label={t("person seen ≥ 60 s", "เห็นคน ≥ 60 วิ")} />
      <Arrow x1={545} y1={125} x2={688} y2={125} label={t("no one 2 min + items", "ไม่เห็นคน 2 นาที + มีของ")} />
      <Arrow x1={688} y1={160} x2={547} y2={160} label={t("person returns", "กลับมานั่ง")} below />
      <path d="M450 100 C450 40 115 40 115 98" className="df-arrow" markerEnd="url(#df-head)" fill="none" />
      <text x={282} y={36} className="df-label" textAnchor="middle">
        {t("no one 2 min + camera: empty", "ไม่เห็นคน 2 นาที + กล้อง: โต๊ะโล่ง")}
      </text>
      <path d="M785 180 C785 262 115 262 115 182" className="df-arrow" markerEnd="url(#df-head)" fill="none" />
      <text x={450} y={286} className="df-label" textAnchor="middle">
        {t("30 min away → released, staff notified (LINE warning at 20 min)", "ไม่อยู่ครบ 30 นาที → ปล่อยโต๊ะ แจ้ง staff (LINE เตือนนาทีที่ 20)")}
      </text>
    </svg>
  );
}
