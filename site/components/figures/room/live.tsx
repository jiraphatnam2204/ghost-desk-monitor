"use client";

import * as React from "react";
import { pathOf, translateAlong, type Flat } from "@/components/iso/iso-kit";
import { follow, useInView, useLoop, useReadout, useStillness } from "@/components/iso/react/live";
import { FACE_ANGLE } from "@/lib/session";
import { SIGNAL_STEPS, type Link } from "@/lib/signal-path";
import { signalControls, useSignalStep } from "@/lib/signal-store";
import { FACES, LINKS, P, prismFrame } from "./geometry";

export interface RoomLayer {
  id: string;
  node?: React.ReactNode;
}

const TOUR_MS = 5200;
const SWING = 0.35;
const WALK = 0.45;
// how far the person stands back from the chair when they are not there
const AWAY_Y = 70;
// one packet trip over the step's links, then a rest
const TRIP_S = 1.5;
const REST_S = 0.7;
const REST = prismFrame(FACE_ANGLE.free);
const tenth = (value: number) => Math.round(value * 10) / 10;

// The chain of links a step's packet rides, as one polyline with its running length.
function routeOf(links: Link[]) {
  const points: Flat[] = links.flatMap((link, index) => (index === 0 ? LINKS[link] : LINKS[link].slice(1)));
  const lengths = [0];
  for (let index = 1; index < points.length; index++)
    lengths.push(lengths[index - 1] + Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]));
  return { points, lengths, total: lengths[lengths.length - 1] ?? 0 };
}

function pointAlong(route: ReturnType<typeof routeOf>, share: number): Flat {
  const want = share * route.total;
  let index = 1;
  while (index < route.points.length - 1 && route.lengths[index] < want) index++;
  const span = route.lengths[index] - route.lengths[index - 1] || 1;
  const t = Math.min(1, Math.max(0, (want - route.lengths[index - 1]) / span));
  const a = route.points[index - 1];
  const b = route.points[index];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function RoomLive({ layers }: { layers: RoomLayer[] }) {
  const { anchor, say } = useReadout<SVGGElement>();
  const inView = useInView(anchor);
  const still = useStillness();
  const { step, touched } = useSignalStep();
  const current = SIGNAL_STEPS[step];
  const target = FACE_ANGLE[current.sign];
  const route = React.useMemo(() => (current.links.length ? routeOf(current.links) : null), [current.links]);

  const faceRefs = React.useRef<(SVGPathElement | null)[]>([]);
  const printRefs = React.useRef<(SVGPathElement | null)[]>([]);
  const shadeRefs = React.useRef<(SVGPathElement | null)[]>([]);
  const outlineRef = React.useRef<SVGPathElement>(null);
  const packetRef = React.useRef<SVGGElement>(null);
  const angle = React.useRef(FACE_ANGLE.free);
  const there = React.useRef(1);
  const clock = React.useRef(0);

  // idle tour: walk the story until someone picks a step
  React.useEffect(() => {
    if (touched || !inView || still) return;
    const timer = window.setInterval(() => signalControls.tour(), TOUR_MS);
    return () => window.clearInterval(timer);
  }, [touched, inView, still]);

  React.useEffect(() => {
    say(`${step + 1}/${SIGNAL_STEPS.length} · ${current.at} · ${current.title}`);
    clock.current = 0;
  }, [say, step, current]);

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
      shadeRefs.current[index]?.setAttribute("fill-opacity", String(Math.min(0.24, face.shade * 0.24)));
    });
    outlineRef.current?.setAttribute("d", frame.outline);
  }, []);

  const goal = current.present ? 1 : 0;
  const kick = useLoop((dt, calm) => {
    angle.current = follow(angle.current, target, dt, SWING, calm);
    there.current = follow(there.current, goal, dt, WALK, calm);
    paint(angle.current);
    const root = anchor.current;
    if (root) {
      const move = translateAlong(P, [0, (1 - there.current) * AWAY_Y, 0]);
      root.querySelectorAll<SVGGElement>(".rm-person").forEach((el) => {
        el.setAttribute("transform", move);
        el.style.opacity = String(there.current);
      });
    }
    const packet = packetRef.current;
    if (packet && route) {
      clock.current += dt;
      const share = calm ? 1 : Math.min(1, (clock.current % (TRIP_S + REST_S)) / TRIP_S);
      const [x, y] = pointAlong(route, share * share * (3 - 2 * share));
      packet.setAttribute("transform", `translate(${tenth(x)} ${tenth(y)})`);
      packet.style.opacity = share >= 1 ? "0.35" : "1";
    }
    return Boolean(route && !calm) || angle.current !== target || there.current !== goal;
  }, inView);

  React.useEffect(() => {
    if (inView) kick();
  }, [inView, target, goal, route, kick]);

  const prism = (
    <g key="prism" className="rm-prism">
      {FACES.map((state, index) => {
        const face = REST.faces[index];
        return (
          <g key={state} data-face={state}>
            <path ref={(el) => void (faceRefs.current[index] = el)} className="gdm-face" d={face.d} style={{ display: face.visible ? undefined : "none" }} />
            <path
              ref={(el) => void (shadeRefs.current[index] = el)}
              className="gdm-face-shade"
              d={face.d}
              fillOpacity={Math.min(0.24, face.shade * 0.24)}
              style={{ display: face.visible ? undefined : "none" }}
            />
            <path
              ref={(el) => void (printRefs.current[index] = el)}
              className="iso-line"
              data-tone="mid"
              d={face.print}
              style={{ display: face.visible ? undefined : "none" }}
            />
          </g>
        );
      })}
      <path ref={outlineRef} className="iso-line iso-edge" data-tone="hi" d={REST.outline} />
    </g>
  );

  const links = (
    <g key="links" className="rm-links">
      {(Object.keys(LINKS) as Link[])
        .filter((link) => link !== "espnow-down")
        .map((link) => {
          const points = LINKS[link];
          const on = current.links.includes(link) || (link === "espnow-up" && current.links.includes("espnow-down"));
          return (
            <g key={link} className="iso-wire rm-link" data-on={on ? "" : undefined} data-tone={on ? "hi" : "lo"}>
              <path className="iso-line" data-tone={on ? "hi" : "lo"} data-dotted={on ? undefined : ""} data-flow={on ? "" : undefined} d={pathOf(points)} />
              <circle className="iso-wire-end" cx={tenth(points[0][0])} cy={tenth(points[0][1])} r={1.3} />
              <circle className="iso-wire-end" cx={tenth(points[points.length - 1][0])} cy={tenth(points[points.length - 1][1])} r={1.3} />
            </g>
          );
        })}
    </g>
  );

  const packet = route ? (
    <g key="packet" ref={packetRef} className="rm-packet" transform={`translate(${tenth(route.points[0][0])} ${tenth(route.points[0][1])})`}>
      <circle r={6.5} className="rm-packet-ring" />
      <circle r={3.4} className="rm-packet-dot" />
    </g>
  ) : null;

  return (
    <g
      ref={anchor}
      className="rm"
      data-lit={current.lit.join(" ")}
      data-waves={current.waves ? "" : undefined}
      data-view={current.view ? "" : undefined}
      data-screen={current.screen}
      data-phone={current.lit.includes("phone") ? "" : undefined}
      tabIndex={0}
      role="button"
      aria-label={`ขั้นที่ ${step + 1} จาก ${SIGNAL_STEPS.length}: ${current.title} กดหรือใช้ลูกศรเพื่อไปขั้นถัดไป`}
      onClick={() => signalControls.next()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
          event.preventDefault();
          signalControls.next();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          signalControls.previous();
        }
      }}
    >
      {layers.map((layer) => {
        if (layer.id === "prism") return prism;
        if (layer.id === "links") return links;
        if (layer.id === "packet") return packet;
        return <React.Fragment key={layer.id}>{layer.node}</React.Fragment>;
      })}
    </g>
  );
}
