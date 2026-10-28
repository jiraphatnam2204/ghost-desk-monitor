// Problems the team tracks, read from data/problems.json. Add new ones by editing that file:
// copy an entry, give it the next "P" id, type "issue", and push.
import data from "@/data/problems.json";

export type ProblemType = "issue" | "expected" | "risk";
export type ProblemStatus = "open" | "watching" | "fixed";
export type Severity = "high" | "medium" | "low";
export type Area = "node" | "gateway" | "cloud" | "web" | "ai" | "hardware" | "team";

export interface Problem {
  id: string;
  type: ProblemType;
  title: string;
  status: ProblemStatus;
  severity: Severity;
  area: Area;
  owner: string;
  cause: string;
  detail: string;
  action: string;
  logged: string;
  likelihood?: 1 | 2 | 3;
  impact?: 1 | 2 | 3;
  // for a problem the team has to decide: the ways out, side by side
  options?: { name: string; good: string; bad: string; points: string }[];
  // what to talk over before deciding
  questions?: string[];
  related?: string[];
  updates: { date: string; note: string }[];
}

export const PROBLEMS = (data as { updated: string; problems: Problem[] }).problems;
export const PROBLEMS_UPDATED = (data as { updated: string }).updated;

export const TYPE_LABEL: Record<ProblemType, string> = {
  issue: "Issue · เจอแล้ว",
  expected: "Expected · มาพร้อมแบบที่เลือก",
  risk: "Risk · อาจเกิด",
};

export const STATUS_LABEL: Record<ProblemStatus, string> = { open: "Open", watching: "Watching", fixed: "Fixed" };
export const SEVERITY_LABEL: Record<Severity, string> = { high: "High", medium: "Medium", low: "Low" };
export const AREA_LABEL: Record<Area, string> = {
  node: "Sensor node",
  gateway: "Gateway",
  cloud: "Cloud",
  web: "Dashboard",
  ai: "AI",
  hardware: "Hardware",
  team: "Team",
};

const SEVERITY_ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
const STATUS_ORDER: Record<ProblemStatus, number> = { open: 0, watching: 1, fixed: 2 };

// Real issues first, then by status and severity.
export const byUrgency = (a: Problem, b: Problem) =>
  Number(b.type === "issue") - Number(a.type === "issue") ||
  STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
  SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
  a.id.localeCompare(b.id, "en", { numeric: true });
