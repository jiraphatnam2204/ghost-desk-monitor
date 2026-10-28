"use client";

import * as React from "react";
import { AWAY_AFTER, DEMO, RELEASE_AT, SEATED_AFTER, STEP_OUT, WARN_AT, eventsOf, lengthOf, manualMoment, momentAt, type ManualEvent, type ManualKind, type Moment, type Profile } from "./session";
import { STORY, STORY_BASE, STORY_DESKS } from "./story";

// One shared simulated clock for the seating plan and the device figure. Room minutes advance at `speed`
// minutes per second; it never claims to be real data.
export const DESKS = 24;
export const SPEEDS = [
  { value: 1 / 60, label: "เวลาจริง" },
  { value: 1, label: "1 นาที/วิ" },
  { value: 5, label: "5 นาที/วิ" },
];
const STILL_MINUTE = STEP_OUT + 23.5;
const NOTIFY_EVERY = 1 / 12;
const DAY_START = 13 * 60; // room minute 0 is 13:00

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
  speed: number;
  // desks someone is driving by hand (buttons or the story), by desk index
  manual: Record<number, ManualEvent[]>;
  story: number | null;
}

const INITIAL: Snapshot = { minute: START_MINUTE, selected: 0, playing: true, speed: 1, manual: {}, story: null };
let snapshot: Snapshot = INITIAL;
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
    snapshot = { ...snapshot, minute: snapshot.minute + dt * snapshot.speed };
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

const SERVER: Snapshot = INITIAL;

export function useDemoClock() {
  return React.useSyncExternalStore(subscribe, () => snapshot, () => SERVER);
}

export const deskMinute = (minute: number, desk: number) => minute + OFFSETS[desk];

function momentOf(state: Snapshot, minute: number, desk: number): Moment {
  const manual = state.manual[desk];
  return manual ? manualMoment(manual, minute) : momentAt(deskMinute(minute, desk), PROFILES[desk]);
}

export const deskMoment = (minute: number, desk: number, manual: Snapshot["manual"] = snapshot.manual): Moment =>
  momentOf({ ...snapshot, manual }, minute, desk);

export const roomTime = (minute: number) => {
  const total = Math.floor(DAY_START + minute);
  const hours = Math.floor(total / 60) % 24;
  return `${String(hours).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

export const isPresent = (events: ManualEvent[] | undefined, minute: number) => {
  const past = (events ?? []).filter((event) => event.at <= minute);
  return past.length > 0 && past[past.length - 1].kind === "sit";
};

// Upcoming moments worth stopping at on a hand-driven desk.
function manualEvents(events: ManualEvent[]) {
  const times: number[] = [];
  const sorted = [...events].sort((a, b) => a.at - b.at);
  sorted.forEach((event, index) => {
    const next = sorted[index + 1]?.at ?? Infinity;
    const marks = event.kind === "sit" ? [SEATED_AFTER] : event.kind === "leave-items" ? [AWAY_AFTER, WARN_AT, RELEASE_AT] : [AWAY_AFTER];
    for (const mark of marks) if (event.at + mark < next) times.push(event.at + mark);
  });
  return times;
}

// Turn what a desk is doing now into events, so a button press can continue from it.
function seed(desk: number, minute: number): ManualEvent[] {
  const moment = momentOf(snapshot, minute, desk);
  if (moment.state === "free" && moment.awayFor === null) return [];
  const events: ManualEvent[] = [{ at: minute - 60, kind: "sit" }];
  if (moment.awayFor !== null) events.push({ at: minute - moment.awayFor, kind: "leave-items" });
  return events;
}

export const clockControls = {
  toggle() {
    set({ playing: !snapshot.playing });
    run();
  },
  setSpeed(speed: number) {
    set({ speed });
  },
  select(desk: number) {
    set({ selected: desk });
  },
  // Jump the shared clock so the chosen desk reaches its next event; the others move with it.
  next(desk = snapshot.selected) {
    const manual = snapshot.manual[desk];
    if (manual) {
      const upcoming = manualEvents(manual).find((at) => at > snapshot.minute + 0.01);
      if (upcoming !== undefined) set({ minute: upcoming + 0.02 });
      return;
    }
    const profile = PROFILES[desk];
    const length = lengthOf(profile);
    const local = ((deskMinute(snapshot.minute, desk) % length) + length) % length;
    const upcoming = eventsOf(profile).find((at) => at > local + 0.01);
    const step = upcoming === undefined ? length - local + SEATED_AFTER : upcoming - local;
    set({ minute: snapshot.minute + step + 0.02 });
  },
  // Someone at the selected desk sits down or leaves, now.
  act(kind: ManualKind, desk = snapshot.selected) {
    const events = snapshot.manual[desk] ?? seed(desk, snapshot.minute);
    set({ manual: { ...snapshot.manual, [desk]: [...events, { at: snapshot.minute, kind }] }, story: null });
  },
  // Play the use case: each step sets the three story desks, moves the clock there and pauses.
  story(step: number) {
    const target = STORY[Math.max(0, Math.min(STORY.length - 1, step))];
    const manual = Object.fromEntries(Object.entries(STORY_DESKS).map(([desk, events]) => [desk, events.map((event) => ({ ...event, at: event.at + STORY_BASE }))]));
    set({ manual, story: STORY.indexOf(target), minute: STORY_BASE + target.at, selected: target.desk, playing: false });
  },
  reset() {
    snapshot = { ...INITIAL, speed: snapshot.speed };
    emit();
    run();
  },
};

// What the people outside the room have seen so far: LINE messages and the staff list, from hand-driven desks.
export interface Notice {
  at: number;
  desk: number;
  kind: "warn" | "release" | "clean";
}

export function noticesOf(manual: Snapshot["manual"], minute: number): Notice[] {
  const notices: Notice[] = [];
  for (const [key, events] of Object.entries(manual)) {
    const desk = Number(key);
    const sorted = [...events].sort((a, b) => a.at - b.at);
    sorted.forEach((event, index) => {
      if (event.kind === "sit") return;
      const back = sorted.slice(index + 1).find((later) => later.kind === "sit")?.at ?? Infinity;
      const push = (offset: number, kind: Notice["kind"]) => {
        if (event.at + offset <= minute && event.at + offset < back) notices.push({ at: event.at + offset, desk, kind });
      };
      if (event.kind === "leave-items") {
        push(WARN_AT, "warn");
        push(RELEASE_AT, "release");
      } else push(AWAY_AFTER, "clean");
    });
  }
  return notices.sort((a, b) => b.at - a.at);
}
