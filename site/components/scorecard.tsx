"use client";

import * as React from "react";
import { CATEGORIES, MILESTONES, MINIMUMS, PROGRESS, STATUS_LABEL, TOTAL, type Gate, type Status } from "@/lib/rubric";

const STATUSES: Status[] = ["at-risk", "not-started", "in-progress", "done"];
const entry = (id: string) => PROGRESS.items[id];

function StatusTag({ status }: { status: Status }) {
  return (
    <span className="status" data-status={status}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function GateRow({ gate }: { gate: Gate }) {
  const item = entry(gate.id);
  return (
    <li data-status={item?.status}>
      <b>{gate.id.length <= 3 ? gate.id : gate.name}</b>
      <span className="gate-what">
        {gate.id.length <= 3 ? <span className="gate-name">{gate.name}</span> : null}
        {gate.what}
        {item?.plan ? <span className="gate-plan">{item.plan}</span> : null}
      </span>
      <span className="gate-penalty">{gate.penalty}</span>
      {item ? <StatusTag status={item.status} /> : <span />}
    </li>
  );
}

export function Scorecard() {
  const [filter, setFilter] = React.useState<Status | null>(null);
  const [owner, setOwner] = React.useState<string | null>(null);

  const criteria = CATEGORIES.flatMap((category) => category.items);
  const aimed = criteria.reduce((sum, item) => sum + (entry(item.id)?.aim ?? 0), 0);
  const proven = criteria.reduce((sum, item) => sum + (entry(item.id)?.status === "done" ? (entry(item.id)?.aim ?? 0) : 0), 0);
  const openGates = MINIMUMS.filter((gate) => entry(gate.id)?.status !== "done");
  const risky = criteria.filter((item) => entry(item.id)?.status === "at-risk").length + MINIMUMS.filter((gate) => entry(gate.id)?.status === "at-risk").length;
  const owners = [...new Set(criteria.map((item) => entry(item.id)?.owner).filter(Boolean) as string[])].sort();
  const counts = Object.fromEntries(STATUSES.map((status) => [status, criteria.filter((item) => entry(item.id)?.status === status).length])) as Record<Status, number>;

  return (
    <div className="scorecard">
      <div className="score-summary">
        <div className="score-big">
          <span className="field-label">Target · เป้า</span>
          <b>
            {aimed}
            <small> / {TOTAL}</small>
          </b>
        </div>
        <div className="score-big">
          <span className="field-label">Evidence so far · มีหลักฐานแล้ว</span>
          <b>
            {proven}
            <small> / {aimed}</small>
          </b>
        </div>
        <div className="score-big">
          <span className="field-label">M1–M8 ที่ยังไม่ผ่าน</span>
          <b>
            {openGates.length}
            <small> · เสี่ยง −{openGates.length * 2}</small>
          </b>
        </div>
        <div className="score-big">
          <span className="field-label">At risk · เสี่ยง</span>
          <b>{risky}</b>
        </div>
      </div>

      <ol className="score-bars" aria-label="คะแนนแต่ละหมวด">
        {CATEGORIES.map((category) => {
          const aim = category.items.reduce((sum, item) => sum + (entry(item.id)?.aim ?? 0), 0);
          const done = category.items.reduce((sum, item) => sum + (entry(item.id)?.status === "done" ? (entry(item.id)?.aim ?? 0) : 0), 0);
          return (
            <li key={category.id}>
              <a href={`#cat-${category.id}`} className="bar-name">
                <b>{category.roman}</b> {category.name}
              </a>
              <span className="bar" role="img" aria-label={`${category.name}: เป้า ${aim} จาก ${category.max} มีหลักฐาน ${done}`}>
                <span className="bar-aim" style={{ width: `${(aim / category.max) * 100}%` }} />
                <span className="bar-done" style={{ width: `${(done / category.max) * 100}%` }} />
              </span>
              <span className="bar-num">
                {done} · {aim} / {category.max}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="bar-key">
        <span className="key-done" /> มีหลักฐานแล้ว <span className="key-aim" /> เป้าของทีม <span className="key-max" /> คะแนนเต็ม
      </p>

      <h3 className="sub">Pass/fail gates · หักคะแนนถ้าขาด</h3>
      <ul className="gates">
        {MINIMUMS.map((gate) => (
          <GateRow key={gate.id} gate={gate} />
        ))}
      </ul>
      <ul className="gates gates-dates">
        {MILESTONES.map((gate) => (
          <GateRow key={gate.id} gate={gate} />
        ))}
      </ul>

      <h3 className="sub">Every criterion · เกณฑ์ทั้งหมด</h3>
      <div className="filters" role="group" aria-label="กรองเกณฑ์">
        <div className="chips">
          <button type="button" className="chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>
            ทั้งหมด {criteria.length}
          </button>
          {STATUSES.map((status) => (
            <button key={status} type="button" className="chip" aria-pressed={filter === status} onClick={() => setFilter(filter === status ? null : status)}>
              {STATUS_LABEL[status]} {counts[status]}
            </button>
          ))}
        </div>
        <label className="select">
          <span className="field-label">Owner</span>
          <select value={owner ?? ""} onChange={(event) => setOwner(event.target.value || null)}>
            <option value="">ทุก role</option>
            {owners.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {CATEGORIES.map((category) => {
        const items = category.items.filter((item) => (!filter || entry(item.id)?.status === filter) && (!owner || entry(item.id)?.owner === owner));
        if (!items.length) return null;
        return (
          <div className="category" key={category.id} id={`cat-${category.id}`}>
            <div className="category-head">
              <b>{category.roman}</b>
              <h4>{category.name}</h4>
              <span>{category.max} pts</span>
            </div>
            <ul className="criteria">
              {items.map((item) => {
                const progress = entry(item.id);
                return (
                  <li key={item.id} data-status={progress?.status}>
                    <span className="criterion-id">{item.id}</span>
                    <div className="criterion-body">
                      <b>{item.name}</b>
                      <span className="criterion-what">{item.what}</span>
                      {item.levels ? (
                        <details className="levels">
                          <summary>ระดับคะแนน</summary>
                          <ol>
                            {item.levels.map((level) => (
                              <li key={level}>{level}</li>
                            ))}
                          </ol>
                        </details>
                      ) : null}
                      {progress ? (
                        <span className="criterion-plan">
                          <span className="field-label">Plan · {progress.owner}</span>
                          {progress.plan}
                        </span>
                      ) : null}
                      {progress?.evidence ? (
                        <a className="criterion-evidence" href={progress.evidence}>
                          Evidence →
                        </a>
                      ) : null}
                    </div>
                    <span className="criterion-points">
                      <b>{progress?.aim ?? 0}</b> / {item.max}
                    </span>
                    {progress ? <StatusTag status={progress.status} /> : <span />}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
