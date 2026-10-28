"use client";

import * as React from "react";
import { iso, pathOf, translateAlong, type Point3 } from "@/components/iso/iso-kit";
import { follow, useInView, useLoop, useReadout, useStillness } from "@/components/iso/react/live";
import { FOCUS_EVENT, type FocusDetail } from "@/components/part-list";
import { MODULES, P, type Lead, type ModuleId } from "./geometry";

export interface GatewayLayer {
  id: string;
  node?: React.ReactNode;
  lift?: { move: Point3; at: number };
  leads?: Lead[];
}

export const GATEWAY_EXPLODE_EVENT = "gateway-explode";

const TOUR_MS = 3200;
const OPEN = 0.5;
const SPAN = 0.55;
const ease = (t: number) => t * t * (3 - 2 * t);
const stage = (k: number, at: number) => ease(Math.min(1, Math.max(0, (k - at) / SPAN)));
const scaled = ([x, y, z]: Point3, s: number): Point3 => [x * s, y * s, z * s];
const plus = ([x, y, z]: Point3, [dx, dy, dz]: Point3): Point3 => [x + dx, y + dy, z + dz];
const tenth = (value: number) => Math.round(value * 10) / 10;
const NONE: Point3 = [0, 0, 0];

function leadAt(lead: Lead, offsets: Partial<Record<ModuleId, Point3>>) {
  const last = lead.points.length - 2;
  const flat = lead.points.map((point, index) => {
    const rider = index < 2 ? lead.head : index >= last ? lead.tail : null;
    return iso(rider ? plus(point, offsets[rider] ?? NONE) : point, P);
  });
  return { d: pathOf(flat), from: flat[0], to: flat[flat.length - 1] };
}

export function GatewayLive({ layers }: { layers: GatewayLayer[] }) {
  const { anchor, say } = useReadout<SVGGElement>();
  const inView = useInView(anchor);
  const still = useStillness();
  const [picked, setPicked] = React.useState<ModuleId[] | null>(null);
  const [toured, setToured] = React.useState(0);
  const [apart, setApart] = React.useState(false);
  const lit = React.useMemo<ModuleId[]>(() => picked ?? [MODULES[toured % MODULES.length].id], [picked, toured]);
  const moverRefs = React.useRef<Record<string, SVGGElement | null>>({});
  const leadRefs = React.useRef<Record<string, SVGGElement | null>>({});
  const opened = React.useRef(0);

  React.useEffect(() => {
    const onFocus = (event: Event) => {
      const { figure, part } = (event as CustomEvent<FocusDetail>).detail;
      if (figure === "gateway") setPicked(part ? (part.split(" ") as ModuleId[]) : null);
    };
    const onExplode = (event: Event) => setApart((event as CustomEvent<boolean>).detail);
    window.addEventListener(FOCUS_EVENT, onFocus);
    window.addEventListener(GATEWAY_EXPLODE_EVENT, onExplode);
    return () => {
      window.removeEventListener(FOCUS_EVENT, onFocus);
      window.removeEventListener(GATEWAY_EXPLODE_EVENT, onExplode);
    };
  }, []);

  // Idle tour: step through the boards while nobody points at one.
  React.useEffect(() => {
    if (picked || !inView || still) return;
    const timer = window.setInterval(() => setToured((n) => n + 1), TOUR_MS);
    return () => window.clearInterval(timer);
  }, [picked, inView, still]);

  React.useEffect(() => {
    const root = anchor.current;
    if (!root) return;
    root.querySelectorAll("[data-module]").forEach((el) => el.toggleAttribute("data-on", lit.includes(el.getAttribute("data-module") as ModuleId)));
    say(apart ? "ถอดประกอบ · 4 บอร์ดยกออกจากเสา สายจัมเปอร์ยังต่ออยู่" : (MODULES.find((module) => module.id === lit[0])?.readout ?? ""));
  }, [anchor, lit, say, apart]);

  const place = React.useCallback(
    (k: number) => {
      const offsets: Partial<Record<ModuleId, Point3>> = {};
      for (const layer of layers) {
        if (!layer.lift) continue;
        const offset = scaled(layer.lift.move, stage(k, layer.lift.at));
        const board = layer.id.replace(/-.*/, "") as ModuleId;
        offsets[board] = offset;
        moverRefs.current[layer.id]?.setAttribute("transform", translateAlong(P, offset));
      }
      for (const layer of layers) {
        if (!layer.leads) continue;
        const group = leadRefs.current[layer.id];
        if (!group) continue;
        layer.leads.forEach((lead, index) => {
          const el = group.children[index];
          const { d, from, to } = leadAt(lead, offsets);
          el?.querySelector("path")?.setAttribute("d", d);
          const [start, end] = el ? Array.from(el.querySelectorAll("circle")) : [];
          start?.setAttribute("cx", String(tenth(from[0])));
          start?.setAttribute("cy", String(tenth(from[1])));
          end?.setAttribute("cx", String(tenth(to[0])));
          end?.setAttribute("cy", String(tenth(to[1])));
        });
      }
    },
    [layers],
  );

  const goal = apart ? 1 : 0;
  const kick = useLoop((dt, calm) => {
    opened.current = follow(opened.current, goal, dt, OPEN, calm);
    place(opened.current);
    return opened.current !== goal;
  }, inView);

  React.useEffect(() => {
    if (inView) kick();
  }, [inView, goal, kick]);

  const pick = (event: React.SyntheticEvent) => {
    const target = (event.target as Element).closest("[data-module]");
    const id = target?.getAttribute("data-module") as ModuleId | null;
    setPicked(id ? [id] : null);
  };

  return (
    <g
      ref={anchor}
      className="gw"
      data-apart={apart ? "" : undefined}
      onPointerOver={pick}
      onPointerLeave={() => setPicked(null)}
      onClick={pick}
      onKeyDown={(event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const index = MODULES.findIndex((module) => module.id === lit[0]);
        const step = event.key === "ArrowRight" ? 1 : MODULES.length - 1;
        setPicked([MODULES[(index + step) % MODULES.length].id]);
      }}
      tabIndex={0}
      role="group"
      aria-label="บอร์ดใน gateway ใช้ปุ่มลูกศรซ้ายขวาเพื่อเลือกบอร์ด"
    >
      {layers.map((layer) => {
        if (layer.leads) {
          return (
            <g key={layer.id} ref={(el) => void (leadRefs.current[layer.id] = el)}>
              {layer.leads.map((lead, index) => {
                const rest = leadAt(lead, {});
                return (
                  <g key={index} className="iso-wire" data-tone="mid">
                    <path className="iso-line" data-tone="mid" d={rest.d} />
                    <circle className="iso-wire-end" cx={tenth(rest.from[0])} cy={tenth(rest.from[1])} r={0.8} />
                    <circle className="iso-wire-end" cx={tenth(rest.to[0])} cy={tenth(rest.to[1])} r={0.8} />
                  </g>
                );
              })}
            </g>
          );
        }
        if (!layer.lift) return <React.Fragment key={layer.id}>{layer.node}</React.Fragment>;
        return (
          <g key={layer.id} ref={(el) => void (moverRefs.current[layer.id] = el)}>
            {layer.node}
          </g>
        );
      })}
    </g>
  );
}
