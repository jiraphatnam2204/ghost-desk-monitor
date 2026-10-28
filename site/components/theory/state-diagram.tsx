import { AWAY_AFTER, RELEASE_AT, SEATED_AFTER, WARN_AT } from "@/lib/session";

// The gateway's per-desk state machine, drawn from the same constants the Overview demo runs on.
const STATES = [
  { id: "free", label: "ว่าง", en: "free", ink: "green", x: 110, y: 168 },
  { id: "inUse", label: "ใช้งาน", en: "inUse", ink: "pink", x: 360, y: 58 },
  { id: "away", label: "ไม่อยู่", en: "away", ink: "yellow", x: 610, y: 168 },
] as const;

const EDGES = [
  {
    d: "M140 138 Q170 62 282 54",
    label: `เห็นคนครบ ${SEATED_AFTER} นาที`,
    at: [128, 84],
    anchor: "start",
  },
  {
    d: "M300 86 Q262 150 190 164",
    label: "โต๊ะโล่ง",
    sub: "กล้อง: empty",
    at: [262, 128],
    anchor: "start",
  },
  {
    d: "M420 86 Q458 150 530 164",
    label: "มีของค้าง",
    sub: "กล้อง: items_only",
    at: [458, 128],
    anchor: "end",
  },
  {
    d: "M580 138 Q550 62 438 54",
    label: "กลับมานั่ง",
    at: [592, 84],
    anchor: "end",
  },
  {
    d: "M590 198 Q360 300 130 198",
    label: `ครบ ${RELEASE_AT} นาที · ปล่อยโต๊ะ`,
    sub: "ธงให้เจ้าหน้าที่มาเก็บของ",
    at: [360, 236],
    anchor: "middle",
  },
] as const;

export function StateDiagram() {
  return (
    <figure className="widget fsm">
      <div className="fsm-window" data-enlarge-window="">
        <svg viewBox="0 0 720 290" role="img" aria-label="State machine ของโต๊ะหนึ่งตัวที่ gateway: ว่าง ใช้งาน ไม่อยู่ และเงื่อนไขที่ทำให้เปลี่ยน">
          <defs>
            <marker id="fsm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10Z" className="fsm-head" />
            </marker>
          </defs>
          {EDGES.map((edge) => (
            <g key={edge.d}>
              <path className="fsm-edge" d={edge.d} markerEnd="url(#fsm-arrow)" />
              <text className="fsm-label" x={edge.at[0]} y={edge.at[1]} textAnchor={edge.anchor}>
                {edge.label}
              </text>
              {"sub" in edge ? (
                <text className="fsm-sub" x={edge.at[0]} y={edge.at[1] + 16} textAnchor={edge.anchor}>
                  {edge.sub}
                </text>
              ) : null}
            </g>
          ))}
          {STATES.map((state) => (
            <g key={state.id} className="fsm-state" data-ink={state.ink}>
              <rect x={state.x - 70} y={state.y - 26} width={140} height={52} />
              <text className="fsm-name" x={state.x} y={state.y + 2} textAnchor="middle">
                {state.label}
              </text>
              <text className="fsm-en" x={state.x} y={state.y + 19} textAnchor="middle">
                {state.en}
              </text>
            </g>
          ))}
          <text className="fsm-sub" x={360} y={104} textAnchor="middle">
            {`ไม่เห็นคน ${AWAY_AFTER} นาที → ถามกล้อง`}
          </text>
          <text className="fsm-sub" x={610} y={214} textAnchor="middle">
            {`นาทีที่ ${WARN_AT}: LINE เตือนเจ้าของ`}
          </text>
        </svg>
      </div>
      <figcaption>
        ตัวเลขทุกตัวในรูปมาจากค่าคงที่ชุดเดียวกับเดโมในหน้า Overview (lib/session.ts) · ถ้า AI ล่ม gateway ใช้กติกาเดียวคือไม่เห็นคนครบ {RELEASE_AT}{" "}
        นาทีแล้วปล่อยโต๊ะ
      </figcaption>
    </figure>
  );
}
