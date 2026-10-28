"use client";

import * as React from "react";
import { PartList, type PartItem } from "./part-list";

interface FigureSideProps {
  figure: string;
  // the window event the figure listens to for coming apart
  event: string;
  parts: PartItem[];
  assemblies: PartItem[];
  apartLabel: string;
  note: string;
}

// The column beside a figure: what each part does, or, once the figure is apart,
// the numbered assemblies and how each one is held on.
export function FigureSide({ figure, event, parts, assemblies, apartLabel, note }: FigureSideProps) {
  const [apart, setApart] = React.useState(false);
  const flip = () => {
    const next = !apart;
    setApart(next);
    window.dispatchEvent(new CustomEvent<boolean>(event, { detail: next }));
  };
  return (
    <div className="figure-side">
      {apart ? <PartList key="apart" figure={figure} items={assemblies} variant="assembly" /> : <PartList key="together" figure={figure} items={parts} />}
      <div className="figure-actions">
        <button type="button" className="action" data-primary={apart ? undefined : ""} aria-pressed={apart} onClick={flip}>
          {apart ? "ประกอบกลับ" : apartLabel}
        </button>
        <p className="note">{note}</p>
      </div>
    </div>
  );
}
