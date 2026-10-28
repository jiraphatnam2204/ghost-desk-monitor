import type { Metadata } from "next";
import { Scorecard } from "@/components/scorecard";
import { PROGRESS } from "@/lib/rubric";
import "../pages.css";
import "./grading.css";

export const metadata: Metadata = {
  title: "Grading Criteria",
  description: "เกณฑ์ให้คะแนน 70 คะแนนของ Final Project พร้อมสถานะของทีม เป้าคะแนน และสิ่งที่ยังเสี่ยงโดนหัก",
};

const STATUSES = ["not-started", "in-progress", "done", "at-risk"];

export default function GradingPage() {
  return (
    <>
      <header className="sheet page-head">
        <h1>Grading Criteria</h1>
        <p className="lede">
          70 คะแนนตาม marking guide ของวิชา · เป้าของทีมคือ ~{PROGRESS.target} · แต่ละเกณฑ์บอกสถานะ ใครดูแล และแผนที่จะได้คะแนนนั้น คะแนน “มีหลักฐานแล้ว” นับเฉพาะเกณฑ์ที่ทำเสร็จและโชว์ได้จริง
        </p>
        <p className="note">updated {PROGRESS.updated}</p>
      </header>

      <section className="sheet section" aria-labelledby="score">
        <div className="section-head">
          <h2 id="score">Scorecard</h2>
          <span className="ref">กรองตามสถานะหรือ role</span>
        </div>
        <Scorecard />
      </section>

      <section className="sheet section" aria-labelledby="update">
        <div className="section-head">
          <h2 id="update">How to update · อัปเดตสถานะ</h2>
          <span className="ref">ไม่มี backend · แก้ไฟล์แล้ว push</span>
        </div>
        <div className="howto">
          <ol className="howto-steps">
            <li>
              เปิด <code>site/data/progress.json</code> ใน repo
            </li>
            <li>
              แก้ <code>status</code> ของเกณฑ์ที่เปลี่ยน เป็นหนึ่งใน {STATUSES.map((status) => `"${status}"`).join(" · ")}
            </li>
            <li>
              ใส่ลิงก์หลักฐานใน <code>evidence</code> เช่นวิดีโอ, commit หรือ log · แก้ <code>updated</code> เป็นวันนี้
            </li>
            <li>commit แล้ว push · GitHub Pages สร้างหน้าใหม่ให้เองในไม่กี่นาที</li>
          </ol>
          <pre className="howto-code">{`"E2": {
  "status": "done",
  "aim": 2,
  "owner": "Sensor Node",
  "plan": "ขา OUT ของ LD2410 → ISR → semaphore",
  "evidence": "https://…/commit/…"
}`}</pre>
        </div>
      </section>
    </>
  );
}
