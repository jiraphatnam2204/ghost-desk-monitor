// The desk rule, as the gateway will run it. Minutes are counted from the moment
// the node stops seeing anyone at the desk.
export const AWAY_AFTER = 2;
export const WARN_AT = 20;
export const RELEASE_AT = 30;

export type DeskState = "free" | "inUse" | "away";

export const STATE_LABEL: Record<DeskState, string> = {
  free: "ว่าง",
  inUse: "ใช้งาน",
  away: "ไม่อยู่",
};

// Prism faces, in servo degrees (TD-7120MG, 0–270°).
export const FACE_ANGLE: Record<DeskState, number> = { inUse: 0, away: 120, free: 240 };

export interface Moment {
  state: DeskState;
  // minutes since presence was lost; null while someone is seated or the desk is free
  awayFor: number | null;
  warned: boolean;
}

// No check-in: a desk turns "in use" once someone has been seen there for SEATED_AFTER.
export const SEATED_AFTER = 1;

// How one desk's day goes, in minutes. Someone sits for `stay` and steps out.
// - back: they return after that many minutes (before the release), sit `stay / 2` more and leave.
// - items: when they leave for good, do they leave belongings behind?
//   No belongings: after AWAY_AFTER the camera sees an empty desk and the desk is free at once.
//   Belongings: the desk stays "away", LINE warns at WARN_AT and the desk is released at RELEASE_AT.
// The desk then stays free for `gap` before the next person.
export interface Profile {
  stay: number;
  back: number | null;
  items: boolean;
  gap: number;
}

// The demo desk: sit at 0, step out at 8 leaving a bag, never come back.
export const DEMO: Profile = { stay: 7, back: null, items: true, gap: 8 };
export const STEP_OUT = SEATED_AFTER + DEMO.stay;

const tailOf = (p: Profile) => (p.items ? RELEASE_AT : AWAY_AFTER);
const secondOf = (p: Profile) => (p.back === null ? 0 : p.back + p.stay / 2);
export const lengthOf = (p: Profile) => SEATED_AFTER + p.stay + secondOf(p) + tailOf(p) + p.gap;

const FREE: Moment = { state: "free", awayFor: null, warned: false };
const SEATED: Moment = { state: "inUse", awayFor: null, warned: false };

export function leaving(gone: number, items: boolean): Moment {
  if (gone < AWAY_AFTER) return { state: "inUse", awayFor: gone, warned: false };
  if (!items || gone >= RELEASE_AT) return FREE;
  return { state: "away", awayFor: gone, warned: gone >= WARN_AT };
}

export function momentAt(minute: number, p: Profile = DEMO): Moment {
  const length = lengthOf(p);
  const t = ((minute % length) + length) % length;
  if (t < SEATED_AFTER) return FREE;
  const out = SEATED_AFTER + p.stay;
  if (t < out) return SEATED;
  if (p.back === null) return leaving(t - out, p.items);
  if (t < out + p.back) return leaving(t - out, true);
  const second = out + secondOf(p);
  if (t < second) return SEATED;
  return leaving(t - second, p.items);
}

// A desk driven by hand in the demo: what people do, in room minutes.
export type ManualKind = "sit" | "leave-items" | "leave-clean";
export interface ManualEvent {
  at: number;
  kind: ManualKind;
}

// Replays the events up to `now` through the same rule the gateway runs.
// Sitting back down while the desk is still held (away, or within the 2-minute grace) resumes it at once.
export function manualMoment(events: ManualEvent[], now: number): Moment {
  let sitAt: number | null = null;
  let leftAt: number | null = null;
  let items = false;
  let held = false;
  for (const event of [...events].sort((a, b) => a.at - b.at)) {
    if (event.at > now) break;
    if (event.kind === "sit") {
      held = sitAt !== null && leftAt !== null && event.at - leftAt < (items ? RELEASE_AT : AWAY_AFTER);
      sitAt = event.at;
      leftAt = null;
    } else if (sitAt !== null && leftAt === null) {
      leftAt = event.at;
      items = event.kind === "leave-items";
    }
  }
  if (sitAt === null) return FREE;
  if (leftAt === null) return held || now - sitAt >= SEATED_AFTER ? SEATED : FREE;
  if (!held && leftAt - sitAt < SEATED_AFTER) return FREE;
  return leaving(now - leftAt, items);
}

// Session minutes at which something visible happens on a desk.
export function eventsOf(p: Profile) {
  const out = SEATED_AFTER + p.stay;
  const tail = (from: number, items: boolean, limit = Infinity) =>
    (items ? [AWAY_AFTER, WARN_AT, RELEASE_AT] : [AWAY_AFTER]).filter((at) => at < limit).map((at) => from + at);
  if (p.back === null) return [SEATED_AFTER, out, ...tail(out, p.items)];
  const second = out + secondOf(p);
  return [SEATED_AFTER, out, ...tail(out, true, p.back), out + p.back, second, ...tail(second, p.items)];
}

export const clock = (minutes: number) => {
  const whole = Math.max(0, minutes);
  const m = Math.floor(whole);
  const s = Math.floor((whole - m) * 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export function describe(moment: Moment) {
  if (moment.state === "away") {
    return moment.warned ? `ไม่อยู่ ${clock(moment.awayFor ?? 0)} · ส่ง LINE เตือนแล้ว` : `ไม่อยู่ ${clock(moment.awayFor ?? 0)}`;
  }
  if (moment.state === "inUse" && moment.awayFor !== null) return `ใช้งาน · ไม่เห็นคน ${clock(moment.awayFor)}`;
  return STATE_LABEL[moment.state];
}
