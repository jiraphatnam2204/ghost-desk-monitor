"use client";

import * as React from "react";
import { DEMO, SEATED_AFTER, STEP_OUT, eventsOf, lengthOf, momentAt, type Moment, type Profile } from "./session";

// One shared simulated clock for the seating plan and the device figure.
// Demo minutes advance at MINUTES_PER_SECOND; it never claims to be real data.
export const MINUTES_PER_SECOND = 1;
export const DESKS = 24;
const STILL_MINUTE = STEP_OUT + 23.5;
const NOTIFY_EVERY = 1 / 12;

// Every desk runs the same rule; only when people sit, how long they stay and whether they come back differ.
// Desk 0 is the demo desk. The rest are made up so the room looks like a room: most desks are in use,
// a few people step out and return, a few never do.
const BACKS = [null, 6, 14, 3, null, 9, 25, 4, null];
export const PROFILES: Profile[] = Array.from({ length: DESKS }, (_, index) =>
  index === 0 ? DEMO : { stay: 24 + ((index * 17) % 41), back: BACKS[index % BACKS.length], items: index % 3 === 1, gap: 2 + ((index * 7) % 9) },
);
// D11 opens the page as a ghost desk already past the 20-minute warning, so the stacked pass shows at once.
const WARNED_DESK = 10;
PROFILES[WARNED_DESK] = { stay: 30, back: null, items: true, gap: 6 };
const START_MINUTE = STEP_OUT - 2;
export const OFFSETS = PROFILES.map((profile, index) => {
  if (index === 0) return 0;
  if (index === WARNED_DESK) return SEATED_AFTER + profile.stay + 20.5 - START_MINUTE;
  return (index * 23.3) % lengthOf(profile);
});

interface Snapshot {
  minute: number;
  selected: number;
  playing: boolean;
}

let snapshot: Snapshot = { minute: START_MINUTE, selected: 0, playing: true };
const listeners = new Set<() => void>();
let frame = 0;
let last = 0;
let sinceNotify = 0;

const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function emit() {
  for (const listener of listeners) listener();
}

function set(next: Partial<Snapshot>) {
  snapshot = { ...snapshot, ...next };
  emit();
}

function tick(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 0;
  last = now;
  if (snapshot.playing && !document.hidden) {
    snapshot = { ...snapshot, minute: snapshot.minute + dt * MINUTES_PER_SECOND };
    sinceNotify += dt;
    if (sinceNotify >= NOTIFY_EVERY) {
      sinceNotify = 0;
      emit();
    }
  }
  frame = listeners.size && snapshot.playing ? requestAnimationFrame(tick) : 0;
}

function run() {
  if (frame || !snapshot.playing || !listeners.size) return;
  last = 0;
  frame = requestAnimationFrame(tick);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1 && still()) snapshot = { ...snapshot, minute: STILL_MINUTE, playing: false };
  run();
  return () => {
    listeners.delete(listener);
    if (!listeners.size && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

const SERVER: Snapshot = snapshot;

export function useDemoClock() {
  return React.useSyncExternalStore(subscribe, () => snapshot, () => SERVER);
}

export const deskMinute = (minute: number, desk: number) => minute + OFFSETS[desk];
export const deskMoment = (minute: number, desk: number): Moment => momentAt(deskMinute(minute, desk), PROFILES[desk]);

export const clockControls = {
  toggle() {
    set({ playing: !snapshot.playing });
    run();
  },
  select(desk: number) {
    set({ selected: desk });
  },
  // Jump the shared clock so the chosen desk reaches its next event; the others move with it.
  next(desk = snapshot.selected) {
    const profile = PROFILES[desk];
    const length = lengthOf(profile);
    const local = ((deskMinute(snapshot.minute, desk) % length) + length) % length;
    const upcoming = eventsOf(profile).find((at) => at > local + 0.01);
    const step = upcoming === undefined ? length - local + SEATED_AFTER : upcoming - local;
    set({ minute: snapshot.minute + step + 0.02 });
  },
};
