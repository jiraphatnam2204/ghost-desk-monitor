---
version: 1
slug: "site-app-page-tsx"
primary_target: "site/app/page.tsx"
related_targets: ["site/app/system/page.tsx","site/app/parts/page.tsx","site/app/strategy/page.tsx"]
---

## Scope

The Ghost-Desk Monitor team site, a Next.js static export in `site/` deployed to GitHub Pages. Routes: `/` Overview (live seating plan, sign figure, open problems), `/equipment` (both figures that come apart, parts and budget), `/grading` (rubric scorecard), `/build-plan` (start-to-finish build workflow with the figures lighting each step's part), `/problems` (problem board), `/docs` (proposal and report, EN/TH). Shared data lives in `site/data/*.json`. Mode: **Experience** (the device and its behaviour lead; the interface recedes). Replaces the old `docs/strategy.html` world (engineering computation pad), which is retired; its look is evidence only.

## Audience and job

Examiners and TAs at the 8 Dec 2026 presentation, classmates, and the 5-person team. They should understand within one viewport what the device does (verifies a person is really at the desk, releases abandoned desks after 30 min, images never leave the board), then explore how each part works. Thai running text with English technical terms. Everything is planned, not built: every live demo is labelled as a simulation; no invented measurements, names or quotes.

## Direction contract

THESIS: The site is an exam-season seating plan pinned up in a library reading room: every desk is a numbered seat cell, and highlighter passes mark which seats are really taken. Refuses the dark product landing with a device render over a grid of feature cards.

OWN-WORLD: Cool photocopy-white sheets, toner-black ruled seat grids and official-notice header fields, Sarabun throughout (the Thai official-document face). Three highlighter inks are the whole state system: pink = in use, yellow = away (a second yellow pass at 20 min), green = free. One violet rubber-stamp mark for status. Ghost desks are dashed cells holding a belongings mark. No cards, shadows, gradients or rounded panels; sections are ruled sheets.

STORY: The visitor watches a desk turn ghost and get released on the plan, believes the device checks presence rather than bookings, then opens the device itself (node and gateway figures), the data path, the parts list and the plan.

FIRST VIEWPORT: Notice header across the top: project name lettered huge left, ruled header fields right (course, presentation date, status stamp). Beneath, the full-width reading-room plan: 4 rows × 6 seat cells with a front-of-room marker; one desk plays its session on a shared minute axis (0 · 2 · 20 · 30) under the plan. Primary action under the plan: open the device; secondary: read the plan.

FORM: Exam seating plan, position 4 of 7 on the grounded list, seed key 8b8db0bd. Raises: color stays on state marks only, text field achromatic (iridescent cloud edge); the demo moves only through legal state transitions (shareware wizard); absence is drawn deliberately, ghost desks and blank name fields are designed empty cells (seven-segment); urgency stacks highlighter passes (silkscreen poster); every time event sits on one shared minute axis (rain-night city); seat numbers set at full scale against tiny field labels (shader portal).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

Clicking a seat fast-forwards its session: pink, then a yellow pass at 2 min, a second yellow pass and a LINE slip at 20 min, then the green release at 30 min, while the prism sign in the device figure turns to match.

## Unresolved

Team member names per role are blank; show them as empty ruled fields, never invented. Problem-evidence numbers (ghost-desk count, survey) do not exist yet; show the plan to collect them, never figures.
