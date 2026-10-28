import Link from "next/link";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="masthead">
      <div className="sheet masthead-row">
        <Link href="/" className="masthead-mark" aria-label="Ghost-Desk Monitor หน้าแรก">
          <SeatMark />
          <span>
            Ghost-Desk <b>Monitor</b>
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}

// A seat cell with a highlighter pass through it: the mark of the whole site.
function SeatMark() {
  return (
    <svg className="seat-mark" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="22" height="18" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M1.5 17.5 26.5 12.5" stroke="var(--hl-yellow)" strokeWidth="7" strokeLinecap="round" style={{ mixBlendMode: "multiply" }} />
      <path d="M8 23v3M20 23v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="colophon">
      <div className="sheet colophon-grid">
        <div>
          <span className="field-label">รายวิชา</span>
          <p>Embedded System (CEDT) · Final Project 2026: Smart Devices</p>
        </div>
        <div>
          <span className="field-label">ทีม</span>
          <p>นิสิต 5 คน · ชื่อแต่ละบทบาทยังไม่ได้กรอก</p>
        </div>
        <div>
          <span className="field-label">สถานะเอกสาร</span>
          <p>ร่าง ณ 28 ต.ค. 2026 · ทุกอย่างในหน้านี้เป็นแผน ยังไม่ได้สร้างจริง</p>
        </div>
        <div>
          <span className="field-label">ภาพเคลื่อนไหวในหน้า</span>
          <p>เป็นการจำลองตามกติกา 2 / 20 / 30 นาที ไม่ใช่ข้อมูลที่วัดได้</p>
        </div>
      </div>
    </footer>
  );
}
