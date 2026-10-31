"use client";

import * as React from "react";
import { CURRENT_PHASE, PHASES, STEP_STATUS_LABEL, statusOf, type Phase, type Step } from "@/lib/workflow";

const phaseOf = new Map(PHASES.flatMap((phase) => phase.steps.map((step) => [step.id, phase.id] as const)));
const firstOpen = CURRENT_PHASE.steps.find((step) => statusOf(step.id) === "in-progress") ?? CURRENT_PHASE.steps.find((step) => statusOf(step.id) !== "done");

// The build, phase by phase. Only the current phase starts open; a step opens to what to do and when it is done.
export function Workflow({ extras = {} }: { extras?: Record<string, React.ReactNode> }) {
  const [phases, setPhases] = React.useState<Set<string>>(() => new Set([CURRENT_PHASE.id]));
  const [open, setOpen] = React.useState<string>(firstOpen?.id ?? "");
  const scrollTo = React.useRef<{ id: string; smooth: boolean } | null>(null);

  const choose = React.useCallback((id: string, smooth = true) => {
    const phase = phaseOf.get(id);
    if (!phase) return;
    setPhases((current) => new Set(current).add(phase));
    setOpen(id);
    scrollTo.current = { id, smooth };
  }, []);

  // scroll once the chosen step has rendered: its phase may have been folded a moment ago
  React.useEffect(() => {
    if (!scrollTo.current) return;
    const { id, smooth } = scrollTo.current;
    document.getElementById(`step-${id}`)?.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
    scrollTo.current = null;
  }, [open, phases]);

  // links like /build-plan/#step-C4 land on a step even when its phase is folded
  React.useEffect(() => {
    const follow = (smooth: boolean) => {
      const match = window.location.hash.match(/^#step-(\w+)$/);
      if (match) choose(match[1], smooth);
    };
    const onHash = () => follow(true);
    // on first load wait for the router to finish its own scroll, or it puts the page back at the top
    const first = window.setTimeout(() => follow(false), 120);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.clearTimeout(first);
      window.removeEventListener("hashchange", onHash);
    };
  }, [choose]);

  const togglePhase = (id: string) =>
    setPhases((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ol className="phases">
      {PHASES.map((phase) => (
        <PhaseRow key={phase.id} phase={phase} expanded={phases.has(phase.id)} onToggle={() => togglePhase(phase.id)}>
          {phase.steps.map((item) => (
            <StepRow key={item.id} step={item} open={item.id === open} extra={extras[item.id]} onToggle={() => setOpen(item.id === open ? "" : item.id)} onJump={choose} />
          ))}
        </PhaseRow>
      ))}
    </ol>
  );
}

function PhaseRow({ phase, expanded, onToggle, children }: { phase: Phase; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  const done = phase.steps.filter((step) => statusOf(step.id) === "done").length;
  return (
    <li className="phase" id={`phase-${phase.id}`} data-current={phase.id === CURRENT_PHASE.id ? "" : undefined}>
      <button type="button" className="phase-head" aria-expanded={expanded} onClick={onToggle}>
        <b className="phase-letter">{phase.id}</b>
        <span className="phase-title">
          <span className="phase-name">{phase.name}</span>
          <span className="phase-goal">{phase.goal}</span>
        </span>
        <span className="phase-meta">
          <span>{phase.week}</span>
          <span>
            เสร็จ {done} / {phase.steps.length}
          </span>
        </span>
      </button>
      {expanded ? <ol className="steps">{children}</ol> : null}
    </li>
  );
}

function StepRow({ step, open, extra, onToggle, onJump }: { step: Step; open: boolean; extra?: React.ReactNode; onToggle: () => void; onJump: (id: string) => void }) {
  const status = statusOf(step.id);
  return (
    <li className="step" id={`step-${step.id}`} data-open={open ? "" : undefined} data-status={status}>
      <button type="button" className="step-head" aria-expanded={open} onClick={onToggle}>
        <span className="step-id">{step.id}</span>
        <span className="step-title">
          <b>{step.title}</b>
          <span className="step-owner">{step.owner}</span>
        </span>
        <span className="step-status" data-status={status}>
          {STEP_STATUS_LABEL[status]}
        </span>
      </button>
      {open ? (
        <div className="step-body">
          <div>
            <span className="field-label">ทำอะไร</span>
            <ul className="step-todo">
              {step.todo.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          {step.code ? <pre className="step-code">{step.code}</pre> : null}
          {step.table ? (
            <div className="scroll-x">
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
            </div>
          ) : null}
          {extra}
          <p className="step-done">
            <span className="field-label">เสร็จเมื่อ</span>
            {step.done}
          </p>
          <dl className="step-meta">
            <div>
              <dt>ทำไม</dt>
              <dd>{step.why}</dd>
            </div>
            <div>
              <dt>เริ่มจาก</dt>
              <dd>{step.start}</dd>
            </div>
            <div>
              <dt>ชิ้นที่ใช้</dt>
              <dd>{step.part}</dd>
            </div>
            {step.needs?.length ? (
              <div>
                <dt>ต้องเสร็จก่อน</dt>
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
        </div>
      ) : null}
    </li>
  );
}
