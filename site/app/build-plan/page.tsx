import type { Metadata } from "next";
import { Enlarge } from "@/components/enlarge";
import { PowerDiagram } from "@/components/power-diagram";
import { Workflow } from "@/components/workflow";
import { CURRENT_PHASE, PHASES, STEPS, STEP_STATUS_LABEL, WORKFLOW_UPDATED, statusOf } from "@/lib/workflow";
import "../pages.css";
import "./build-plan.css";

export const metadata: Metadata = {
  title: "Build Plan",
  description: "ทำโปรเจกต์อย่างไรตั้งแต่ต้นจนจบ: ตอนนี้อยู่ช่วงไหน ขั้นไหนต้องทำ ใครทำ และเสร็จเมื่อไร",
};

const done = STEPS.filter((step) => statusOf(step.id) === "done").length;
const left = CURRENT_PHASE.steps.filter((step) => statusOf(step.id) !== "done");
const next = PHASES[PHASES.indexOf(CURRENT_PHASE) + 1];

// C4 is easier to follow with the wiring in front of you
const power = (
  <Enlarge openOnClick title="ไฟเลี้ยงต่อโต๊ะ">
    <figure className="power-figure">
      <div data-enlarge-window="">
        <PowerDiagram />
      </div>
      <figcaption>อแดปเตอร์ตัวเดียวต่อโต๊ะ แยกไฟไปบอร์ดและ servo · ตัวเก็บประจุคร่อมไฟ servo ใกล้ขั้ว servo · GND ทุกจุดต่อถึงกัน</figcaption>
    </figure>
  </Enlarge>
);

export default function BuildPlanPage() {
  return (
    <>
      <header className="sheet page-head">
        <h1>Build Plan</h1>
        <p className="lede">
          ทำอะไรก่อนหลัง ตั้งแต่วันแรกถึงวัน demo · {PHASES.length} ช่วง {STEPS.length} ขั้น · กดขั้นเพื่อดูว่าต้องทำอะไรและเสร็จเมื่อไร
        </p>
      </header>

      <section className="sheet now" aria-labelledby="now">
        <div className="now-box">
          <h2 id="now">
            ตอนนี้: ช่วง {CURRENT_PHASE.id} · {CURRENT_PHASE.name}
          </h2>
          <p className="now-meta">
            {CURRENT_PHASE.week} · {CURRENT_PHASE.goal}
          </p>
          <ol className="now-steps">
            {left.map((step) => {
              const status = statusOf(step.id);
              return (
                <li key={step.id}>
                  <a href={`#step-${step.id}`}>
                    <span className="step-id">{step.id}</span>
                    <span className="step-title">
                      <b>{step.title}</b>
                      <span className="step-owner">{step.owner}</span>
                    </span>
                    <span className="step-status" data-status={status}>
                      {STEP_STATUS_LABEL[status]}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
          <p className="now-foot">
            {next ? (
              <>
                ช่วงถัดไป: <a href={`#step-${next.steps[0].id}`}>{next.id} · {next.name}</a> ({next.week}) ·{" "}
              </>
            ) : null}
            เสร็จแล้ว {done} จาก {STEPS.length} ขั้น
          </p>
        </div>
      </section>

      <section className="sheet section" aria-labelledby="workflow">
        <div className="section-head">
          <h2 id="workflow">ทุกขั้น · All steps</h2>
          <span className="ref">กดชื่อช่วงเพื่อเปิด / ปิด</span>
        </div>
        <Workflow extras={{ C4: power }} />
        <p className="note gap">อัปเดตสถานะ {WORKFLOW_UPDATED} · แก้สถานะได้ที่ site/data/workflow.json แล้ว push</p>
      </section>
    </>
  );
}
