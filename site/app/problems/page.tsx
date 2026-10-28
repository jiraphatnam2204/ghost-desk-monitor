import type { Metadata } from "next";
import { CopyBlock } from "@/components/copy-block";
import { ProblemBoard } from "@/components/problem-board";
import { PROBLEMS_UPDATED, TYPE_LABEL } from "@/lib/problems";
import "@/components/problem-row.css";
import "../pages.css";
import "./problems.css";

export const metadata: Metadata = {
  title: "Problems",
  description: "ปัญหาที่ทีม Ghost-Desk Monitor เจอ ปัญหาที่มาพร้อมแบบที่เลือก และความเสี่ยงที่ต้องคอยดู พร้อมวิธีรับมือและคนรับผิดชอบ",
};

const TEMPLATE = `{
  "id": "P1",
  "type": "issue",
  "title": "อธิบายปัญหาในหนึ่งบรรทัด",
  "status": "open",
  "severity": "high",
  "area": "node",
  "owner": "Sensor Node",
  "cause": "เกิดจากอะไร / เจอตอนไหน",
  "detail": "กระทบอะไร",
  "action": "จะแก้หรือรับมืออย่างไร",
  "logged": "2026-11-02",
  "updates": [{ "date": "2026-11-03", "note": "ลองแล้วได้ผลอย่างไร" }]
}`;

export default function ProblemsPage() {
  return (
    <>
      <header className="sheet page-head">
        <h1>Problems</h1>
        <p className="lede">
          ทุกเรื่องที่อาจทำให้งานสะดุด แบ่งเป็น 3 แบบ: <b>{TYPE_LABEL.issue}</b> · <b>{TYPE_LABEL.expected}</b> · <b>{TYPE_LABEL.risk}</b> · แตะแต่ละเรื่องเพื่อดูว่ามาจากไหน ใครดูแล และรับมืออย่างไร
        </p>
        <p className="note">updated {PROBLEMS_UPDATED}</p>
      </header>

      <section className="sheet section" aria-labelledby="board">
        <div className="section-head">
          <h2 id="board">Problem board</h2>
          <span className="ref">เรียง: issue จริงก่อน แล้วตามความหนัก</span>
        </div>
        <ProblemBoard />
      </section>

      <section className="sheet section" aria-labelledby="add">
        <div className="section-head">
          <h2 id="add">Found a problem? · เจอปัญหาใหม่</h2>
          <span className="ref">ไม่มี backend · แก้ไฟล์แล้ว push</span>
        </div>
        <div className="howto">
          <ol className="howto-steps">
            <li>
              เปิด <code>site/data/problems.json</code> ใน repo
            </li>
            <li>
              copy template นี้ไปวางท้ายรายการ <code>problems</code> · ใช้ id ถัดไป (P1, P2, …) และ <code>&quot;type&quot;: &quot;issue&quot;</code>
            </li>
            <li>
              <code>severity</code>: high · medium · low · <code>area</code>: node · gateway · cloud · web · ai · hardware · team
            </li>
            <li>
              แก้เสร็จเปลี่ยน <code>status</code> เป็น <code>fixed</code> และเขียนว่าแก้อย่างไรใน <code>action</code> · ความคืบหน้าใส่ใน <code>updates</code>
            </li>
            <li>commit แล้ว push · หน้านี้และ Overview อัปเดตเองหลัง GitHub Pages build เสร็จ</li>
          </ol>
          <CopyBlock text={TEMPLATE} label="Template · problems.json" />
        </div>
      </section>
    </>
  );
}
