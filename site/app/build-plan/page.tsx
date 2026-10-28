import type { Metadata } from "next";
import { Enlarge } from "@/components/enlarge";
import { GatewayFigure } from "@/components/figures/gateway/figure";
import { NodeFigure } from "@/components/figures/node/figure";
import { Workflow } from "@/components/workflow";
import { EQUIPMENT_ORDER, PHASES, START_HERE, STEPS, WORKFLOW_UPDATED } from "@/lib/workflow";
import "@/components/figure-side.css";
import "../pages.css";
import "./build-plan.css";

export const metadata: Metadata = {
  title: "Build Plan",
  description: "วิธีทำโปรเจกต์ตั้งแต่ต้นจนจบ: เริ่มจากอุปกรณ์ชิ้นไหน ทำอะไรก่อนหลัง แต่ละขั้นเสร็จเมื่อไร ใครรับผิดชอบ และสัปดาห์ไหน",
};

export default function BuildPlanPage() {
  return (
    <>
      <header className="sheet page-head">
        <h1>Build Plan</h1>
        <p className="lede">
          From the first day to the final demo · ทำโปรเจกต์นี้อย่างไรตั้งแต่ต้นจนจบ {PHASES.length} ช่วง {STEPS.length} ขั้น เริ่มจากอุปกรณ์ชิ้นไหน
          แต่ละขั้นทำอะไร เสร็จเมื่อไร และต้องรออะไรก่อน
        </p>
        <p className="note">status updated {WORKFLOW_UPDATED} · แก้สถานะใน site/data/workflow.json</p>
      </header>

      <section className="sheet start-here" aria-labelledby="start">
        <div className="start-box">
          <span className="field-label">Start here · เริ่มที่</span>
          <h2 id="start">{START_HERE.part}</h2>
          <p>{START_HERE.why}</p>
          <a className="action" data-primary="" href={`#step-${START_HERE.step}`}>
            ไปที่ขั้น {START_HERE.step}
          </a>
        </div>
        <div className="order">
          <span className="field-label">ลำดับการเปิดใช้อุปกรณ์ · Equipment order</span>
          <ol>
            {EQUIPMENT_ORDER.map((item, index) => (
              <li key={item.part}>
                <a href={`#step-${item.step}`}>
                  <b>{index + 1}</b>
                  <span>{item.part}</span>
                  <small>ขั้น {item.step}</small>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sheet section" aria-labelledby="workflow">
        <div className="section-head">
          <h2 id="workflow">Workflow · ทีละขั้น</h2>
          <span className="ref">แตะขั้นเพื่อเปิด · รูปข้าง ๆ ไฮไลต์ชิ้นที่ใช้</span>
        </div>
        <Workflow
          nodeFigure={
            <Enlarge>
              <NodeFigure />
            </Enlarge>
          }
          gatewayFigure={
            <Enlarge>
              <GatewayFigure />
            </Enlarge>
          }
        />
      </section>
    </>
  );
}
