import { AREA_LABEL, SEVERITY_LABEL, STATUS_LABEL, type Problem } from "@/lib/problems";

const LEVEL = ["", "ต่ำ", "กลาง", "สูง"];

// One problem as a ruled row; the body folds open. Plain markup, so server and client pages share it.
export function ProblemRow({ problem, open = false }: { problem: Problem; open?: boolean }) {
  return (
    <li className="problem" id={problem.id} data-type={problem.type} data-status={problem.status} data-severity={problem.severity}>
      <details open={open}>
        <summary>
          <span className="problem-id">{problem.id}</span>
          <span className="problem-head">
            <span className="problem-title">{problem.title}</span>
            <span className="problem-meta">
              <span className="sev" data-severity={problem.severity}>
                {SEVERITY_LABEL[problem.severity]}
              </span>
              <span>{AREA_LABEL[problem.area]}</span>
              <span>{problem.owner}</span>
            </span>
          </span>
          <span className="problem-status" data-status={problem.status}>
            {STATUS_LABEL[problem.status]}
          </span>
        </summary>
        <div className="problem-body">
          <p>
            <span className="field-label">{problem.type === "risk" ? "Warning sign · สัญญาณเตือน" : "Cause · มาจาก"}</span>
            {problem.cause}
          </p>
          {problem.detail ? (
            <p>
              <span className="field-label">What it means · หมายความว่า</span>
              {problem.detail}
            </p>
          ) : null}
          {problem.likelihood && problem.impact ? (
            <p className="problem-odds">
              <span className="field-label">Likelihood · Impact (team estimate)</span>
              {LEVEL[problem.likelihood]} · {LEVEL[problem.impact]}
            </p>
          ) : null}
          <p className="problem-action">
            <span className="field-label">{problem.status === "fixed" ? "Fix · แก้แล้วด้วย" : "Plan · รับมือ"}</span>
            {problem.action}
          </p>
          {problem.updates.length ? (
            <ol className="problem-updates">
              {problem.updates.map((update) => (
                <li key={update.date + update.note}>
                  <b>{update.date}</b> {update.note}
                </li>
              ))}
            </ol>
          ) : null}
          <p className="problem-logged">logged {problem.logged}</p>
        </div>
      </details>
    </li>
  );
}
