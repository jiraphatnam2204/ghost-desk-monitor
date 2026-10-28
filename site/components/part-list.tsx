"use client";

import * as React from "react";

export interface PartItem {
  part: string;
  title: string;
  text: React.ReactNode;
}

export const FOCUS_EVENT = "figure-focus";
export type FocusDetail = { figure: string; part: string | null };

// The numbered list beside a figure. Pointing at, focusing or tapping an item lights that part in the drawing.
export function PartList({ figure, items, variant }: { figure: string; items: PartItem[]; variant?: "assembly" }) {
  const [active, setActive] = React.useState<string | null>(null);
  const tell = React.useCallback(
    (part: string | null) => {
      setActive(part);
      window.dispatchEvent(new CustomEvent<FocusDetail>(FOCUS_EVENT, { detail: { figure, part } }));
    },
    [figure],
  );
  return (
    <div className="part-list">
      <p className="part-cue">{variant === "assembly" ? "ชิ้นส่วนที่ถอดออก · ชี้หรือแตะเพื่อดูในรูป" : "ชี้หรือแตะรายการเพื่อดูชิ้นนั้นในรูป"}</p>
      <ol className="senses" data-variant={variant} onPointerLeave={() => tell(null)}>
        {items.map((item) => (
          <li
            key={item.part}
            data-active={active === item.part ? "" : undefined}
            tabIndex={0}
            onPointerEnter={() => tell(item.part)}
            onFocus={() => tell(item.part)}
            onBlur={() => tell(null)}
            onClick={() => tell(active === item.part ? null : item.part)}
          >
            <b>{item.title}</b>
            <span>{item.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
