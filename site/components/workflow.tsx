"use client";

import * as React from "react";
import { FOCUS_EVENT, type FocusDetail } from "./part-list";
import { PHASES, START_HERE, STEPS, STEP_STATUS_LABEL, statusOf, type Step } from "@/lib/workflow";

const byId = new Map(STEPS.map((step) => [step.id, step]));

// The build, start to finish. Opening a step lights the part it works on in the figure beside the list.
export function Workflow({ nodeFigure, gatewayFigure }: { nodeFigure: React.ReactNode; gatewayFigure: React.ReactNode }) {
  const [open, setOpen] = React.useState<string>(START_HERE.step);
  const step = byId.get(open);
  const [figure, setFigure] = React.useState<"node" | "gateway">("gateway");
  const shown = step?.figure ?? figure;

  // light the step's part; a step without a part keeps the last figure on screen
  React.useEffect(() => {
    if (!step?.figure) return;
    const other = step.figure === "node" ? "gateway" : "node";
    window.dispatchEvent(new CustomEvent<FocusDetail>(FOCUS_EVENT, { detail: { figure: other, part: null } }));
    window.dispatchEvent(new CustomEvent<FocusDetail>(FOCUS_EVENT, { detail: { figure: step.figure, part: step.focus ?? null } }));
  }, [step]);

  const choose = (id: string) => {
    const next = byId.get(id);
    if (next?.figure) setFigure(next.figure);
    setOpen(id);
    window.requestAnimationFrame(() => document.getElementById(`step-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };

  const done = STEPS.filter((item) => statusOf(item.id) === "done").length;

  return (
    <div className="workflow">
      <div className="workflow-figure">
        <div className="workflow-figure-sticky">
          <p className="field-label">
            {shown === "node" ? "Sensor node" : "Gateway"} · {step ? `ขั้น ${step.id}: ${step.part}` : ""}
          </p>
          <div hidden={shown !== "node"}>{nodeFigure}</div>
          <div hidden={shown !== "gateway"}>{gatewayFigure}</div>
          <div className="workflow-progress" aria-label={`เสร็จ ${done} จาก ${STEPS.length} ขั้น`}>
            <span className="field-label">
              Progress · เสร็จ {done} / {STEPS.length} ขั้น
            </span>
            <span className="workflow-cells" aria-hidden="true">
              {STEPS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  tabIndex={-1}
                  className="workflow-cell"
                  data-status={statusOf(item.id)}
                  data-open={item.id === open ? "" : undefined}
                  title={`${item.id} ${item.title}`}
                  onClick={() => choose(item.id)}
                />
              ))}
            </span>
          </div>
        </div>
      </div>

      <ol className="phases">
        {PHASES.map((phase) => (
          <li key={phase.id} className="phase" id={`phase-${phase.id}`}>
            <div className="phase-head">
              <b className="phase-letter">{phase.id}</b>
              <div>
                <h3>{phase.name}</h3>
                <p className="phase-goal">{phase.goal}</p>
              </div>
              <span className="phase-week">{phase.week}</span>
            </div>
            <ol className="steps">
              {phase.steps.map((item) => (
                <StepRow key={item.id} step={item} open={item.id === open} onToggle={() => (item.id === open ? setOpen("") : choose(item.id))} onJump={choose} />
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepRow({ step, open, onToggle, onJump }: { step: Step; open: boolean; onToggle: () => void; onJump: (id: string) => void }) {
  const status = statusOf(step.id);
  return (
    <li className="step" id={`step-${step.id}`} data-open={open ? "" : undefined} data-status={status} data-start={step.id === START_HERE.step ? "" : undefined}>
      <button type="button" className="step-head" aria-expanded={open} onClick={onToggle}>
        <span className="step-id">{step.id}</span>
        <span className="step-title">
          <b>{step.title}</b>
          <span className="step-part">{step.part}</span>
        </span>
        {step.id === START_HERE.step ? <span className="step-start">เริ่มที่นี่</span> : null}
        <span className="step-status" data-status={status}>
          {STEP_STATUS_LABEL[status]}
        </span>
      </button>
      {open ? (
        <div className="step-body">
          <p className="step-why">
            <span className="field-label">ทำไมขั้นนี้ตอนนี้ · Why now</span>
            {step.why}
          </p>
          <div>
            <span className="field-label">ทำอะไร · Do</span>
            <ul className="step-todo">
              {step.todo.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          {step.code ? <pre className="step-code">{step.code}</pre> : null}
          {step.table ? (
            <table className="register step-table">
              <thead>
                <tr>
                  {step.table.head.map((cell) => (
                    <th key={cell}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {step.table.rows.map((row) => (
                  <tr key={row.join("|")}>
                    {row.map((cell, index) => (
                      <td key={index}>{index === 0 ? <code>{cell}</code> : cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          <dl className="step-facts">
            <div>
              <dt className="field-label">เริ่มจาก · Start from</dt>
              <dd>{step.start}</dd>
            </div>
            <div>
              <dt className="field-label">Owner</dt>
              <dd>{step.owner}</dd>
            </div>
            {step.needs?.length ? (
              <div>
                <dt className="field-label">ต้องเสร็จก่อน · Needs</dt>
                <dd className="step-needs">
                  {step.needs.map((id) => (
                    <button key={id} type="button" className="step-link" onClick={() => onJump(id)}>
                      {id}
                    </button>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="step-done">
            <span className="field-label">เสร็จเมื่อ · Done when</span>
            {step.done}
          </p>
        </div>
      ) : null}
    </li>
  );
}
