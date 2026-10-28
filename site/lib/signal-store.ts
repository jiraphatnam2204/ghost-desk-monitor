// Which step of the sit-down story is showing. The room figure, the timeline and the theory
// sections all read it, so a click on any one of them moves the others.
import * as React from "react";
import { SIGNAL_STEPS } from "./signal-path";

export interface SignalSnapshot {
  step: number;
  // the idle tour stops for good once someone picks a step
  touched: boolean;
}

let snapshot: SignalSnapshot = { step: 0, touched: false };
const listeners = new Set<() => void>();
const set = (next: SignalSnapshot) => {
  snapshot = next;
  listeners.forEach((listener) => listener());
};
const wrap = (step: number) => (step + SIGNAL_STEPS.length) % SIGNAL_STEPS.length;

export const signalControls = {
  go: (step: number) => set({ step: wrap(step), touched: true }),
  next: () => set({ step: wrap(snapshot.step + 1), touched: true }),
  previous: () => set({ step: wrap(snapshot.step - 1), touched: true }),
  tour: () => set({ ...snapshot, step: wrap(snapshot.step + 1) }),
  resume: () => set({ ...snapshot, touched: false }),
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const SERVER: SignalSnapshot = { step: 0, touched: false };

export function useSignalStep() {
  return React.useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => SERVER,
  );
}
