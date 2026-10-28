"use client";

import * as React from "react";
import { LOAN, PARTS, SUNDRIES, baht, lineTotal, type Level, type Part } from "@/lib/project";

type Where = "all" | Part["where"];
const WHERE: { id: Where; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "node", label: "Sensor node × 2" },
  { id: "gateway", label: "Gateway" },
];
const LEVELS: Level[] = ["ง่าย", "กลาง", "ยาก"];
const TEAM = 5;

// The bill of materials with filters and a budget that answers "what do we each pay?"
export function PartsRegister() {
  const [where, setWhere] = React.useState<Where>("all");
  const [level, setLevel] = React.useState<Level | null>(null);
  const [borrow, setBorrow] = React.useState(true);
  const [sundries, setSundries] = React.useState(true);

  const shown = PARTS.filter((part) => (where === "all" || part.where === where) && (!level || part.level === level));
  const parts = PARTS.reduce((sum, part) => sum + lineTotal(part), 0);
  const total = parts - (borrow ? LOAN : 0) + (sundries ? SUNDRIES : 0);

  return (
    <div className="register-tool">
      <div className="budget" aria-live="polite">
        <div className="budget-sum">
          <span className="field-label">Budget · งบรวม (ประมาณ)</span>
          <b>~{baht(total)} บาท</b>
          <span className="budget-each">
            หาร {TEAM} คน ≈ <b>{baht(Math.round(total / TEAM))}</b> บาท/คน
          </span>
        </div>
        <div className="budget-switches">
          <label className="switch">
            <input type="checkbox" checked={borrow} onChange={(event) => setBorrow(event.target.checked)} />
            <span>ยืม AMG8833 × 2 จากวิชา (−{baht(LOAN)})</span>
          </label>
          <label className="switch">
            <input type="checkbox" checked={sundries} onChange={(event) => setSundries(event.target.checked)} />
            <span>รวมของจิปาถะ สาย กล่อง ตัวเก็บประจุ (~{baht(SUNDRIES)})</span>
          </label>
        </div>
      </div>

      <div className="filters" role="group" aria-label="กรองรายการ">
        <div className="chips">
          {WHERE.map((option) => (
            <button key={option.id} type="button" className="chip" aria-pressed={where === option.id} onClick={() => setWhere(option.id)}>
              {option.label}
            </button>
          ))}
        </div>
        <div className="chips">
          <span className="field-label">ความยาก</span>
          {LEVELS.map((option) => (
            <button key={option} type="button" className="chip" aria-pressed={level === option} onClick={() => setLevel(level === option ? null : option)}>
              {option}
            </button>
          ))}
        </div>
        <span className="filter-count">{shown.length} รายการ</span>
      </div>

      <ol className="parts">
        {shown.map((part) => {
          const borrowed = borrow && part.id === "amg8833";
          return (
            <li className="part" id={part.id} key={part.id}>
              <div className="part-name">
                <h3>{part.name}</h3>
                <span className="part-tags">
                  <span className="level" data-level={part.level}>
                    {part.level}
                  </span>
                  <span className="part-where">{part.where === "node" ? "Sensor node" : "Gateway"}</span>
                </span>
              </div>
              <dl className="part-facts">
                <div>
                  <dt className="field-label">หน้าที่ · Job</dt>
                  <dd>{part.role}</dd>
                </div>
                <div>
                  <dt className="field-label">ต่อผ่าน · Bus</dt>
                  <dd>{part.bus}</dd>
                </div>
                <div>
                  <dt className="field-label">Library</dt>
                  <dd>{part.library}</dd>
                </div>
                <div>
                  <dt className="field-label">เริ่มจาก · Start from</dt>
                  <dd>{part.start}</dd>
                </div>
                <div className="wide">
                  <dt className="field-label">ทำไมตัวนี้ · Why</dt>
                  <dd>
                    {part.why}
                    {part.note ? <span className="part-note"> · {part.note}</span> : null}
                  </dd>
                </div>
              </dl>
              <div className="part-price">
                <span className="field-label">{part.estimate ? "ราคาประมาณ" : "ราคา"}</span>
                <b className={borrowed ? "struck-price" : undefined}>{part.price === 0 ? "มีแล้ว" : `${baht(part.price)} × ${part.qty}`}</b>
                <span className="part-line">{borrowed ? "ยืมจากวิชา · 0 บาท" : part.price === 0 ? "0 บาท" : `${baht(lineTotal(part))} บาท`}</span>
                {part.url ? (
                  <a href={part.url} target="_blank" rel="noreferrer">
                    {part.shop}
                  </a>
                ) : (
                  <span className="part-shop">{part.shop}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="note gap">ราคาเช็กจากหน้าร้าน 28 ต.ค. 2026 ยังไม่รวมค่าส่ง · ไมค์ MAX4466 และของจิปาถะเป็นราคาประมาณ</p>
    </div>
  );
}
