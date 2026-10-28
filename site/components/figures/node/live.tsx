"use client";

import * as React from "react";
import { iso, pathOf, translateAlong, type Point3 } from "@/components/iso/iso-kit";
import { follow, useInView, useLoop, useReadout } from "@/components/iso/react/live";
import { FOCUS_EVENT, type FocusDetail } from "@/components/part-list";
import { clockControls, deskMoment, useDemoClock } from "@/lib/demo-clock";
import { FACE_ANGLE, STATE_LABEL, clock } from "@/lib/session";
import { FACES, prismFrame } from "./frame";
import type { Cable } from "./geometry";
import { P } from "./view";

export interface Layer {
  id: string;
  node?: React.ReactNode;
  // way out when the figure comes apart, in world units, and when in the stagger (0–1) it starts
  move?: Point3;
  at?: number;
  // a cable whose leading points ride on another layer when the figure comes apart
  cable?: Cable;
}

export const EXPLODE_EVENT = "node-explode";

const REST = prismFrame(FACE_ANGLE.inUse);
// The demo runs a minute a second, so the sign turns quickly enough to land before the next readout.
const SWING = 0.1;
const OPEN = 0.55;
const PRISM_OUT: Point3 = [0, 0, 62];
const PRISM_AT = 0.2;
const SPAN = 0.6;

const ease = (t: number) => t * t * (3 - 2 * t);
const stage = (k: number, at = 0) => ease(Math.min(1, Math.max(0, (k - at) / SPAN)));
const scaled = ([x, y, z]: Point3, s: number): Point3 => [x * s, y * s, z * s];
const plus = ([x, y, z]: Point3, [dx, dy, dz]: Point3): Point3 => [x + dx, y + dy, z + dz];
const tenth = (value: number) => Math.round(value * 10) / 10;

function cableAt(cable: Cable, offset: Point3) {
  const flat = cable.points.map((point, index) => iso(index < cable.follow ? plus(point, offset) : point, P));
  return { d: pathOf(flat), from: flat[0], to: flat[flat.length - 1] };
}

export function NodeLive({ layers }: { layers: Layer[] }) {
  const { anchor, say } = useReadout<SVGGElement>();
  const { minute, selected } = useDemoClock();
  const moment = deskMoment(minute, selected);
  const target = FACE_ANGLE[moment.state];
  const present = moment.state === "inUse" && moment.awayFor === null;

  const faceRefs = React.useRef<(SVGPathElement | null)[]>([]);
  const printRefs = React.useRef<(SVGPathElement | null)[]>([]);
  const shadeRefs = React.useRef<(SVGPathElement | null)[]>([]);
  const outlineRef = React.useRef<SVGPathElement>(null);
  const edgesRef = React.useRef<SVGPathElement>(null);
  const prismRef = React.useRef<SVGGElement>(null);
  const moverRefs = React.useRef<Record<string, SVGGElement | null>>({});
  const cableRefs = React.useRef<Record<string, SVGGElement | null>>({});
  const shown = React.useRef(FACE_ANGLE.inUse);
  const opened = React.useRef(0);
  const inView = useInView(anchor);
  const [focus, setFocus] = React.useState<string | null>(null);
  const [apart, setApart] = React.useState(false);
  // the prism is drawn in front of the right cheek once it has lifted clear of it
  const [lifted, setLifted] = React.useState(false);

  React.useEffect(() => {
    const onFocus = (event: Event) => {
      const { figure, part } = (event as CustomEvent<FocusDetail>).detail;
      if (figure === "node") setFocus(part);
    };
    const onExplode = (event: Event) => setApart((event as CustomEvent<boolean>).detail);
    window.addEventListener(FOCUS_EVENT, onFocus);
    window.addEventListener(EXPLODE_EVENT, onExplode);
    return () => {
      window.removeEventListener(FOCUS_EVENT, onFocus);
      window.removeEventListener(EXPLODE_EVENT, onExplode);
    };
  }, []);

  const paint = React.useCallback((degrees: number) => {
    const frame = prismFrame(degrees);
    frame.faces.forEach((face, index) => {
      for (const [list, d] of [
        [faceRefs, face.d],
        [printRefs, face.print],
        [shadeRefs, face.d],
      ] as const) {
        const el = list.current[index];
        if (!el) continue;
        el.setAttribute("d", d);
        el.style.display = face.visible ? "" : "none";
      }
      shadeRefs.current[index]?.setAttribute("fill-opacity", String(Math.min(0.22, face.shade * 0.22)));
    });
    outlineRef.current?.setAttribute("d", frame.outline);
    edgesRef.current?.setAttribute("d", frame.edges);
  }, []);

  const place = React.useCallback(
    (k: number) => {
      const offsets: Record<string, Point3> = {};
      for (const layer of layers) {
        if (!layer.move) continue;
        offsets[layer.id] = scaled(layer.move, stage(k, layer.at));
        moverRefs.current[layer.id]?.setAttribute("transform", translateAlong(P, offsets[layer.id]));
      }
      for (const layer of layers) {
        const cable = layer.cable;
        const el = cableRefs.current[layer.id];
        if (!cable || !el) continue;
        const { d, from } = cableAt(cable, offsets[cable.layer] ?? [0, 0, 0]);
        el.querySelector("path")?.setAttribute("d", d);
        const start = el.querySelector("circle");
        start?.setAttribute("cx", String(tenth(from[0])));
        start?.setAttribute("cy", String(tenth(from[1])));
      }
      prismRef.current?.setAttribute("transform", translateAlong(P, scaled(PRISM_OUT, stage(k, PRISM_AT))));
      const up = stage(k, PRISM_AT) > 0.25;
      setLifted((was) => (was === up ? was : up));
    },
    [layers],
  );

  const goal = apart ? 1 : 0;
  const kick = useLoop((dt, calm) => {
    shown.current = follow(shown.current, target, dt, SWING, calm);
    opened.current = follow(opened.current, goal, dt, OPEN, calm);
    paint(shown.current);
    place(opened.current);
    return shown.current !== target || opened.current !== goal;
  }, inView);

  // restart the loop whenever the sign or the explode has somewhere new to go
  React.useEffect(() => {
    if (inView) kick();
  }, [inView, target, goal, kick]);

  React.useEffect(() => {
    if (apart) {
      say("ถอดประกอบ · 5 ชิ้นส่วนเลื่อนออก");
      return;
    }
    const desk = `D${String(selected + 1).padStart(2, "0")}`;
    const tail = moment.state === "away" ? ` ${clock(moment.awayFor ?? 0)}` : "";
    say(`${desk} · ${STATE_LABEL[moment.state]}${tail} · servo ${target}°`);
  }, [say, apart, selected, moment.state, moment.awayFor, target]);

  const prism = (
    <g key="prism" ref={prismRef} className="gdm-prism">
      {FACES.map((state, index) => {
        const face = REST.faces[index];
        return (
          <g key={state} data-face={state}>
            <path ref={(el) => void (faceRefs.current[index] = el)} className="gdm-face" d={face.d} style={{ display: face.visible ? undefined : "none" }} />
            <path
              ref={(el) => void (shadeRefs.current[index] = el)}
              className="gdm-face-shade"
              d={face.d}
              fillOpacity={Math.min(0.22, face.shade * 0.22)}
              style={{ display: face.visible ? undefined : "none" }}
            />
            <path ref={(el) => void (printRefs.current[index] = el)} className="iso-line gdm-print" data-tone="mid" d={face.print} style={{ display: face.visible ? undefined : "none" }} />
          </g>
        );
      })}
      <path ref={edgesRef} className="iso-line" data-tone="hi" d={REST.edges} />
      <path ref={outlineRef} className="iso-line iso-edge" data-tone="lit" d={REST.outline} />
    </g>
  );

  return (
    <g
      ref={anchor}
      className="gdm-node"
      data-present={present ? "" : undefined}
      data-state={moment.state}
      data-focus={focus ?? undefined}
      data-apart={apart ? "" : undefined}
      tabIndex={0}
      role="button"
      aria-label="ข้ามโต๊ะที่เลือกไปเหตุการณ์ถัดไป"
      onClick={() => clockControls.next()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          clockControls.next();
        }
      }}
    >
      {layers.map((layer) => {
        if (layer.id === "prism") return lifted ? null : prism;
        if (layer.id === "prism-apart") return lifted ? prism : null;
        if (layer.cable) {
          const rest = cableAt(layer.cable, [0, 0, 0]);
          return (
            <g key={layer.id} ref={(el) => void (cableRefs.current[layer.id] = el)} className="iso-wire" data-tone="mid">
              <path className="iso-line" data-tone="mid" d={rest.d} />
              <circle className="iso-wire-end" cx={tenth(rest.from[0])} cy={tenth(rest.from[1])} r={0.9} />
              <circle className="iso-wire-end" cx={tenth(rest.to[0])} cy={tenth(rest.to[1])} r={0.9} />
            </g>
          );
        }
        if (!layer.move) return <React.Fragment key={layer.id}>{layer.node}</React.Fragment>;
        return (
          <g key={layer.id} ref={(el) => void (moverRefs.current[layer.id] = el)}>
            {layer.node}
          </g>
        );
      })}
    </g>
  );
}
