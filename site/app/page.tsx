import Link from "next/link";
import { NodeFigure } from "@/components/figures/node/figure";
import { ProblemRow } from "@/components/problem-row";
import { SeatingPlan } from "@/components/seating-plan";
import { PROBLEMS, PROBLEMS_UPDATED, byUrgency } from "@/lib/problems";
import "@/components/figure-side.css";
import "@/components/problem-row.css";
import "@/components/seating-plan.css";
import "./home.css";

const OPEN = PROBLEMS.filter((problem) => problem.status !== "fixed").sort(byUrgency);
const SHOWN = OPEN.filter((problem) => problem.severity === "high").slice(0, 6);

export default function Home() {
  const issues = OPEN.filter((problem) => problem.type === "issue").length;
  const high = OPEN.filter((problem) => problem.severity === "high").length;
  return (
    <>
      <section className="sheet notice" aria-labelledby="title">
        <div className="notice-title">
          <h1 id="title">
            Ghost-Desk
            <br />
            Monitor
          </h1>
          <p className="notice-sub">
            ป้ายบนโต๊ะห้องสมุดที่รู้จริงว่ามีคนนั่งไหม และ<b>ปล่อยโต๊ะที่ถูกทิ้งไว้เกิน 30 นาที</b>คืนให้คนที่ต้องการนั่งจริง · team front end สำหรับเช็กความคืบหน้าและปัญหา
          </p>
        </div>
        <dl className="notice-fields">
          <div>
            <dt className="field-label">Course</dt>
            <dd>Embedded System (CEDT) · Final Project 2026</dd>
          </div>
          <div>
            <dt className="field-label">Team</dt>
            <dd>5 คน · 5 roles</dd>
          </div>
          <div>
            <dt className="field-label">Final demo</dt>
            <dd>อ. 8 ธ.ค. 2026</dd>
          </div>
          <div>
            <dt className="field-label">Open problems</dt>
            <dd>
              <a href="#problems">
                {OPEN.length} open · {high} high
              </a>
            </dd>
          </div>
          <div className="notice-stamp">
            <span className="stamp">
              Planning
              <small>ยังไม่ได้สร้าง</small>
            </span>
          </div>
        </dl>
      </section>

      <section className="sheet plan-sheet" aria-labelledby="demo">
        <h2 id="demo" className="visually-hidden">
          Live device demo
        </h2>
        <SeatingPlan />
        <p className="note plan-rule">
          Desk rule: เห็นคนนั่งครบ 1 นาที → <span className="hl" data-ink="pink">ใช้งาน</span> · ไม่เห็นคน 2 นาที แล้วกล้องเห็นโต๊ะโล่ง →{" "}
          <span className="hl" data-ink="green">ว่าง</span> ทันที · ถ้ายังมีของ → <span className="hl">ไม่อยู่</span> · 20 นาที LINE เตือน · 30 นาที ปล่อยโต๊ะ
        </p>
      </section>

      <section className="sheet section" aria-labelledby="device">
        <div className="section-head">
          <h2 id="device">The sign follows the desk</h2>
          <span className="ref">Fig 1 ตามโต๊ะที่เลือกในผังด้านบน</span>
        </div>
        <div className="figure-row">
          <NodeFigure />
          <div className="device-notes">
            <p className="lede">เลือกโต๊ะในผัง แล้วดูป้ายปริซึมหมุนตาม: ชมพู = ใช้งาน, เหลือง = ไม่อยู่, เขียว = ว่าง</p>
            <p className="note">ทุกอย่างในผังและรูปเป็นการจำลองตามกติกาที่ gateway จะรัน ยังไม่ใช่ข้อมูลจากเครื่องจริง</p>
            <div className="actions">
              <Link className="action" data-primary="" href="/equipment">
                ดูอุปกรณ์ทุกชิ้น · Equipment
              </Link>
              <Link className="action" href="/build-plan">
                Build Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sheet section" id="problems" aria-labelledby="problems-title">
        <div className="section-head">
          <h2 id="problems-title">Open problems</h2>
          <span className="ref">
            {issues ? `${issues} issues · ` : ""}
            updated {PROBLEMS_UPDATED}
          </span>
        </div>
        <p className="lede problems-lede">
          {SHOWN.length} เรื่องหนักที่สุดตอนนี้ จากทั้งหมด {OPEN.length} เรื่องที่ยังเปิดอยู่ แตะเพื่อดูว่ามาจากไหนและรับมืออย่างไร
        </p>
        <ul className="problem-list">
          {SHOWN.map((problem) => (
            <ProblemRow key={problem.id} problem={problem} />
          ))}
        </ul>
        <p className="more">
          <Link href="/problems">ดูปัญหาทั้งหมด · All problems</Link>
          <Link href="/grading">Grading Criteria scorecard</Link>
        </p>
      </section>
    </>
  );
}
