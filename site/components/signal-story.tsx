"use client";

import * as React from "react";
import { LANES, SIGNAL_STEPS } from "@/lib/signal-path";
import { signalControls, useSignalStep } from "@/lib/signal-store";

const THEORY_LABEL: Record<string, string> = {
  sense: "เซนเซอร์",
  mcu: "ข้างใน MCU",
  radio: "ESP-NOW",
  fsm: "State machine",
  actuate: "PWM และ servo",
  cloud: "Cloud และจอ",
};

// The step under the figure: what happens, what is on the wire, and where the theory is.
export function SignalStep() {
  const { step } = useSignalStep();
  const current = SIGNAL_STEPS[step];
  return (
    <div className="signal-step">
      <div className="signal-dots" role="group" aria-label="ขั้นของสัญญาณ">
        {SIGNAL_STEPS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="story-dot"
            aria-current={index === step ? "step" : undefined}
            data-done={index < step ? "" : undefined}
            onClick={() => signalControls.go(index)}
            title={item.title}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="signal-card" aria-live="polite">
        <span className="field-label">
          ขั้น {step + 1} · {current.at}
        </span>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
        <p className="signal-wire">
          <span className="field-label">บนสาย · on the wire</span>
          <code>{current.wire}</code>
        </p>
      </div>
      <div className="signal-nav">
        <button type="button" className="action" onClick={() => signalControls.previous()}>
          ← ก่อนหน้า
        </button>
        <button type="button" className="action" data-primary="" onClick={() => signalControls.next()}>
          ถัดไป →
        </button>
        <a className="text-button" href={`#${current.theory}`}>
          ทฤษฎี: {THEORY_LABEL[current.theory]} ↓
        </a>
      </div>
    </div>
  );
}

// Every hop on one sheet: time down the side, the five places across the top.
export function SignalLadder() {
  const { step } = useSignalStep();
  const lane = (id: string) => LANES.findIndex((item) => item.id === id);
  return (
    <div className="ladder" role="group" aria-label="เส้นเวลาของสัญญาณ ตั้งแต่นั่งลงจนขึ้นจอ">
      <div className="ladder-head" aria-hidden="true">
        <span />
        {LANES.map((item) => (
          <span key={item.id}>
            <b>{item.label}</b>
            {item.en}
          </span>
        ))}
      </div>
      {SIGNAL_STEPS.map((item, index) => {
        const from = lane(item.from);
        const to = lane(item.to);
        const left = Math.min(from, to);
        const right = Math.max(from, to);
        return (
          <button
            key={item.id}
            type="button"
            className="ladder-row"
            aria-current={index === step ? "step" : undefined}
            onClick={() => signalControls.go(index)}
            aria-label={`${item.at}: ${item.title}`}
          >
            <span className="ladder-time">{item.at}</span>
            <span className="ladder-track" aria-hidden="true">
              {LANES.map((column) => (
                <span key={column.id} className="ladder-lane" />
              ))}
              {from === to ? (
                <span className="ladder-self" style={{ gridColumn: `${from + 1}` }} />
              ) : (
                <span
                  className="ladder-hop"
                  data-back={to < from ? "" : undefined}
                  style={
                    {
                      gridColumn: `${left + 1} / ${right + 2}`,
                      "--span": right - left + 1,
                    } as React.CSSProperties
                  }
                />
              )}
            </span>
            <span className="ladder-title">
              {index + 1}. {item.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
