"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import "./enlarge.css";

// Pulls a figure off the notice board and lays it over the whole screen, like an enlarged photocopy.
// The figure itself moves (it is not cloned), so a live drawing keeps its state and its controls
// while enlarged, and anything wrapped with it (a part list, the step panel) comes along.
const ZOOMS = [
  { id: "fit", label: "พอดีจอ", scale: 1 },
  { id: "150", label: "150%", scale: 1.5 },
  { id: "200", label: "200%", scale: 2 },
] as const;
type Zoom = (typeof ZOOMS)[number]["id"];

interface EnlargeProps {
  // the sheet's name in the header; read from the plate's corners when left out
  title?: string;
  // a still diagram opens on a click anywhere on it; a live drawing keeps its clicks and opens from the tab
  openOnClick?: boolean;
  className?: string;
  children: React.ReactNode;
}

const PICTURE = ".iso-plate, [data-enlarge-picture]";
// the window the drawing is seen through: the plate's stage, or a wrapper a still diagram marks
const WINDOW = ".iso-stage, [data-enlarge-window]";
const pictureIn = (root: HTMLElement | null) =>
  root?.querySelector<HTMLElement>(PICTURE) ?? root?.querySelector<HTMLElement>(".enlarge-stage > :not(.enlarge-scan)") ?? null;
const PROBE = 100;
const contentWidth = (el: HTMLElement) => {
  const style = getComputedStyle(el);
  return el.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
};

interface Parts {
  frame: HTMLElement;
  view: HTMLElement;
  svg: SVGSVGElement;
  // the frame plus what hangs under it (the legend), which must fit on screen together
  block: HTMLElement;
}

function partsOf(root: HTMLElement | null): Parts | null {
  const frame = pictureIn(root);
  const view = frame?.querySelector<HTMLElement>(WINDOW);
  const svg = view?.querySelector<SVGSVGElement>("svg");
  if (!frame || !view || !svg) return null;
  return { frame, view, svg, block: (frame.closest(".iso-figure") as HTMLElement | null) ?? frame };
}

// Fit the frame on screen at its fitted size and keep it there. Zoom only grows the drawing
// inside the window, so the frame, its corner labels and the legend never move.
function size(root: HTMLElement, { frame, block, svg }: Parts, scale: number) {
  const head = root.querySelector<HTMLElement>(".enlarge-head");
  const stage = root.querySelector<HTMLElement>(".enlarge-stage");
  if (!head || !stage) return;
  const box = svg.viewBox.baseVal;
  const aspect = box && box.width ? box.width / box.height : 1.5;
  const pad = parseFloat(getComputedStyle(stage).paddingTop) || 0;
  const tall = Math.max(240, window.innerHeight - head.offsetHeight - pad * 2);
  root.style.setProperty("--enlarge-h", `${Math.floor(tall)}px`);
  // probe with a known size to read what the frame and the legend add around the drawing
  const set = (width: number, zoomed: number) => {
    root.style.setProperty("--window-w", `${width}px`);
    root.style.setProperty("--window-h", `${Math.round(width / aspect)}px`);
    root.style.setProperty("--zoom-width", `${zoomed}px`);
  };
  set(PROBE, PROBE);
  const chromeW = frame.offsetWidth - PROBE;
  const wide = block === frame ? contentWidth(frame.parentElement ?? stage) : contentWidth(block);
  // a caption inside the frame wraps by the frame's width, so re-measure its height at each guess until it settles
  let fit = wide - chromeW;
  for (let pass = 0; pass < 3; pass++) {
    set(fit, fit);
    const chromeH = block.offsetHeight - fit / aspect;
    const next = Math.floor(Math.max(160, Math.min(wide - chromeW, (tall - chromeH) * aspect)));
    if (Math.abs(next - fit) < 2) break;
    fit = next;
  }
  set(fit, Math.floor(fit * scale));
}

// Everything outside the open sheet goes inert, so Tab and screen readers stay inside it.
function quietOutside(root: HTMLElement) {
  const quieted: Element[] = [];
  let node: HTMLElement | null = root;
  while (node && node !== document.body) {
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) break;
    for (const sibling of Array.from(parent.children)) {
      if (sibling === node || sibling.hasAttribute("inert")) continue;
      sibling.setAttribute("inert", "");
      quieted.push(sibling);
    }
    node = parent;
  }
  return () => quieted.forEach((el) => el.removeAttribute("inert"));
}

function titleOf(root: HTMLElement | null) {
  const plate = root?.querySelector(".iso-plate");
  const fig = plate?.querySelector('[data-corner="fig"]')?.textContent?.trim();
  const name = plate?.querySelector('[data-corner="title"]')?.textContent?.trim();
  if (fig || name) return [fig, name].filter(Boolean).join(" · ");
  // a still diagram: its caption up to the first colon ("Figure 1. Block diagram")
  const caption = root?.querySelector("figcaption")?.textContent?.trim() ?? "";
  return caption.split(/[:：]/)[0].slice(0, 80);
}

export function Enlarge({ title, openOnClick = false, className, children }: EnlargeProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const close = React.useRef<HTMLButtonElement>(null);
  const tab = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState<Zoom>("fit");
  const [picture, setPicture] = React.useState<HTMLElement | null>(null);
  const [name, setName] = React.useState(title ?? "");
  const headingId = React.useId();

  // the tab is drawn on the picture's own top edge, wherever the picture sits inside the block
  React.useEffect(() => {
    const el = root.current;
    const found = pictureIn(el);
    if (found && getComputedStyle(found).position === "static") found.style.position = "relative";
    setPicture(found);
    if (!title) setName(titleOf(el));
  }, [title]);

  const shut = React.useCallback(() => {
    setOpen(false);
    setZoom("fit");
  }, []);

  React.useEffect(() => {
    const el = root.current;
    if (!open || !el) return;
    const restore = quietOutside(el);
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    close.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        shut();
      }
    };
    window.addEventListener("keydown", onKey);
    const opener = tab.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      restore();
      html.style.overflow = overflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open, shut]);

  // where the middle of the window sits on the drawing (0–1), kept across zoom changes
  const middle = React.useRef({ x: 0.5, y: 0.5 });
  React.useEffect(() => {
    if (open) middle.current = { x: 0.5, y: 0.5 };
  }, [open]);

  // mark the frame, its window and the drawing, size them to the screen and keep them sized
  React.useLayoutEffect(() => {
    const el = root.current;
    const parts = partsOf(el);
    if (!open || !el || !parts) return;
    const { frame, view, svg } = parts;
    frame.setAttribute("data-enlarge-frame", "");
    view.setAttribute("data-enlarge-win", "");
    svg.setAttribute("data-enlarge-svg", "");
    const scale = ZOOMS.find((item) => item.id === zoom)?.scale ?? 1;
    const remember = () => {
      if (view.scrollWidth > view.clientWidth) middle.current.x = (view.scrollLeft + view.clientWidth / 2) / view.scrollWidth;
      if (view.scrollHeight > view.clientHeight) middle.current.y = (view.scrollTop + view.clientHeight / 2) / view.scrollHeight;
    };
    const resize = () => {
      size(el, parts, scale);
      view.scrollLeft = middle.current.x * view.scrollWidth - view.clientWidth / 2;
      view.scrollTop = middle.current.y * view.scrollHeight - view.clientHeight / 2;
    };
    resize();
    window.addEventListener("resize", resize);
    view.addEventListener("scroll", remember, { passive: true });

    // past the fit, a mouse drag pans the drawing in its window; a drag never counts as a click on it
    let start: { x: number; y: number; left: number; top: number } | null = null;
    let dragged = false;
    const down = (event: PointerEvent) => {
      if (scale === 1 || event.pointerType !== "mouse" || event.button !== 0) return;
      start = { x: event.clientX, y: event.clientY, left: view.scrollLeft, top: view.scrollTop };
      dragged = false;
    };
    const move = (event: PointerEvent) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!dragged && Math.hypot(dx, dy) < 5) return;
      dragged = true;
      view.setAttribute("data-panning", "");
      view.scrollLeft = start.left - dx;
      view.scrollTop = start.top - dy;
    };
    const up = () => {
      start = null;
      view.removeAttribute("data-panning");
    };
    const swallow = (event: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };
    view.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    view.addEventListener("click", swallow, true);
    return () => {
      window.removeEventListener("resize", resize);
      view.removeEventListener("scroll", remember);
      view.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      view.removeEventListener("click", swallow, true);
      view.removeAttribute("data-panning");
      frame.removeAttribute("data-enlarge-frame");
      view.removeAttribute("data-enlarge-win");
      svg.removeAttribute("data-enlarge-svg");
      for (const name of ["--zoom-width", "--window-w", "--window-h", "--enlarge-h"]) el.style.removeProperty(name);
    };
  }, [open, zoom]);

  const opener = (
    <button
      ref={tab}
      type="button"
      className="enlarge-tab"
      onClick={(event) => {
        event.stopPropagation();
        setOpen(true);
      }}
      aria-label={`ขยาย${name ? ` ${name}` : "รูป"}`}
      aria-haspopup="dialog"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
      </svg>
      <span>ขยาย</span>
    </button>
  );

  return (
    <div
      ref={root}
      className={className ? `enlarge ${className}` : "enlarge"}
      data-open={open ? "" : undefined}
      data-zoom={zoom}
      data-click={openOnClick && !open ? "" : undefined}
      role={open ? "dialog" : undefined}
      aria-modal={open ? true : undefined}
      aria-labelledby={open ? headingId : undefined}
      onClick={openOnClick && !open ? () => setOpen(true) : undefined}
    >
      {open ? (
        <div className="enlarge-head">
          <p className="enlarge-name">
            <span className="field-label">ขยาย · Enlarged</span>
            <b id={headingId}>{name || "รูป"}</b>
          </p>
          <div className="enlarge-zoom" role="group" aria-label="ขนาด">
            <span className="field-label">ขนาด</span>
            <span className="chips">
              {ZOOMS.map((item) => (
                <button key={item.id} type="button" className="chip" aria-pressed={zoom === item.id} onClick={() => setZoom(item.id)}>
                  {item.label}
                </button>
              ))}
            </span>
          </div>
          <button ref={close} type="button" className="action enlarge-close" onClick={shut}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
            ปิด <kbd>Esc</kbd>
          </button>
        </div>
      ) : null}
      <div className="enlarge-stage">
        {open ? <span className="enlarge-scan" aria-hidden="true" /> : null}
        {children}
      </div>
      {picture ? createPortal(opener, picture) : null}
    </div>
  );
}
