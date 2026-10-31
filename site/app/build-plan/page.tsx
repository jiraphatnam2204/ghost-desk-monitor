import type { Metadata } from "next";
import { Enlarge } from "@/components/enlarge";
import { PowerDiagram } from "@/components/power-diagram";
import { Workflow } from "@/components/workflow";
import { PHASES, STEPS } from "@/lib/workflow";
import "../pages.css";
import "./build-plan.css";

export const metadata: Metadata = {
  title: "Build Plan",
  description: "ทำโปรเจกต์อย่างไรตั้งแต่ต้นจนจบ: แต่ละช่วงทำสัปดาห์ไหน แต่ละขั้นทำอะไร ใครทำ และเสร็จเมื่อไร",
};

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
          ทำอะไรก่อนหลัง ตั้งแต่วันแรกถึงวัน demo · {PHASES.length} ช่วง {STEPS.length} ขั้น · กดช่วงเพื่อดูขั้นในช่วงนั้น แล้วกดขั้นเพื่อดูว่าต้องทำอะไรและเสร็จเมื่อไร
        </p>
      </header>

      <section className="sheet section" aria-labelledby="workflow">
        <div className="section-head">
          <h2 id="workflow">All steps · ทุกขั้น</h2>
          <span className="ref">กดชื่อช่วงเพื่อเปิด / ปิด</span>
        </div>
        <Workflow extras={{ C4: power }} />
      </section>
    </>
  );
}
