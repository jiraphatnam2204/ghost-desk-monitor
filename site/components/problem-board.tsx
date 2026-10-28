"use client";

import * as React from "react";
import { AREA_LABEL, PROBLEMS, SEVERITY_LABEL, STATUS_LABEL, TYPE_LABEL, byUrgency, type Area, type ProblemStatus, type ProblemType, type Severity } from "@/lib/problems";
import { ProblemRow } from "./problem-row";

const TYPES: ProblemType[] = ["issue", "expected", "risk"];
const SEVERITIES: Severity[] = ["high", "medium", "low"];
const STATUSES: ProblemStatus[] = ["open", "watching", "fixed"];
const AREAS = Object.keys(AREA_LABEL) as Area[];

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

// Every tracked problem, filterable in the browser. The data is data/problems.json.
export function ProblemBoard() {
  const [types, setTypes] = React.useState<ProblemType[]>([]);
  const [severities, setSeverities] = React.useState<Severity[]>([]);
  const [statuses, setStatuses] = React.useState<ProblemStatus[]>(["open", "watching"]);
  const [area, setArea] = React.useState<Area | "">("");
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);

  const needle = query.trim().toLowerCase();
  const shown = PROBLEMS.filter(
    (problem) =>
      (!types.length || types.includes(problem.type)) &&
      (!severities.length || severities.includes(problem.severity)) &&
      (!statuses.length || statuses.includes(problem.status)) &&
      (!area || problem.area === area) &&
      (!needle || [problem.id, problem.title, problem.cause, problem.detail, problem.action, problem.owner].join(" ").toLowerCase().includes(needle)),
  ).sort(byUrgency);

  const count = (pick: (problem: (typeof PROBLEMS)[number]) => boolean) => PROBLEMS.filter(pick).length;
  const reset = () => {
    setTypes([]);
    setSeverities([]);
    setStatuses(["open", "watching"]);
    setArea("");
    setQuery("");
  };

  return (
    <div className="board">
      <div className="board-counts">
        {STATUSES.map((status) => (
          <div key={status}>
            <span className="field-label">{STATUS_LABEL[status]}</span>
            <b>{count((problem) => problem.status === status)}</b>
          </div>
        ))}
        <div>
          <span className="field-label">High · open</span>
          <b>{count((problem) => problem.severity === "high" && problem.status !== "fixed")}</b>
        </div>
      </div>

      <div className="board-filters">
        <label className="search">
          <span className="field-label">Search · ค้นหา</span>
          <input type="search" value={query} placeholder="เช่น servo, LINE, F4" onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="chips" role="group" aria-label="ชนิด">
          <span className="field-label">Type</span>
          {TYPES.map((type) => (
            <button key={type} type="button" className="chip" aria-pressed={types.includes(type)} onClick={() => setTypes(toggle(types, type))}>
              {TYPE_LABEL[type].split(" · ")[0]} {count((problem) => problem.type === type)}
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="ความหนัก">
          <span className="field-label">Severity</span>
          {SEVERITIES.map((severity) => (
            <button key={severity} type="button" className="chip" aria-pressed={severities.includes(severity)} onClick={() => setSeverities(toggle(severities, severity))}>
              {SEVERITY_LABEL[severity]}
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="สถานะ">
          <span className="field-label">Status</span>
          {STATUSES.map((status) => (
            <button key={status} type="button" className="chip" aria-pressed={statuses.includes(status)} onClick={() => setStatuses(toggle(statuses, status))}>
              {STATUS_LABEL[status]}
            </button>
          ))}
        </div>
        <label className="select">
          <span className="field-label">Area</span>
          <select value={area} onChange={(event) => setArea(event.target.value as Area | "")}>
            <option value="">ทุกส่วน</option>
            {AREAS.map((item) => (
              <option key={item} value={item}>
                {AREA_LABEL[item]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="board-bar">
        <span className="filter-count">
          แสดง {shown.length} จาก {PROBLEMS.length}
        </span>
        <button type="button" className="text-button" onClick={() => setExpanded(!expanded)}>
          {expanded ? "พับทั้งหมด" : "เปิดทั้งหมด"}
        </button>
        <button type="button" className="text-button" onClick={reset}>
          ล้างตัวกรอง
        </button>
      </div>

      {shown.length ? (
        <ul className="problem-list" key={expanded ? "open" : "closed"}>
          {shown.map((problem) => (
            <ProblemRow key={problem.id} problem={problem} open={expanded} />
          ))}
        </ul>
      ) : (
        <p className="empty">ไม่มีปัญหาที่ตรงกับตัวกรองนี้ · ลองล้างตัวกรอง</p>
      )}
    </div>
  );
}
