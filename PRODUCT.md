# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Team site: Next.js 16 (App Router, TypeScript, plain CSS), static export (`output: "export"`) deployed to GitHub Pages by `.github/workflows/deploy-site.yml`. No backend: shared data lives in `site/data/progress.json` (grading scorecard) and `site/data/problems.json` (problem board); teammates edit and push, and Pages rebuilds. Isometric figures use the anatomy kit in `site/components/iso/`. Routes: Overview, Equipment, Grading Criteria, Build Plan, Problems, Docs.

The device's own dashboard (M5) is separate: one static HTML + JS page with supabase-js.

## Users

- **The project team (5 second-year CE students, CEDT Embedded Systems Y2S1):** the site's main readers. They check in on the project: rubric status, open problems, how each part works and is built. Often on a phone. They must be able to build every part with what they learned in the course labs.
- **The professor and TAs:** read the Docs page (proposal, then final report) in English or Thai, printed to PDF.
- **End users of the device (in the product story):** students looking for a library seat during exams, students who step away from a desk, and library staff who need to know which desks hold abandoned belongings.

## Product Purpose

Ghost-Desk Monitor is a smart-device final project (course "Embedded System (CEDT) Final Project 2026: Smart Devices"). Each desk gets a sensor node that checks whether someone is really sitting there and a 3-face prism sign (in use / away / free) turned by a servo. Desks abandoned for 30 minutes are released automatically. Success for the course means meeting M1–M8, two physical nodes, the chosen E-items, and measured metrics by the final presentation on Tue 8 Dec 2026.

## Positioning

QR seat-booking systems only know that a desk was booked. This system verifies presence at the desk (mmWave LD2410 + AMG8833 thermal + on-device camera AI) and never sends images off the board.

## Operating Context

- Sensor node per desk: FireBeetle 2 ESP32-S3 + OV2640, LD2410, AMG8833, TD-7120MG 270° servo turning a 3-face prism sign, printed QR code opening the desk's read-only status page and the LINE Official Account add-friend link. No LIFF, no check-in.
- Gateway: the team's YD-ESP32-23 (ESP32-S3, from Lab 10) with SCD41 CO₂, MAX4466 analog mic (read with `analogRead`, Lab 8), BH1750; owns the state machine and timers; links to nodes over ESP-NOW.
- Cloud: Supabase (Postgres + REST + Realtime only, no Edge Functions); the gateway sends LINE alerts itself with the Messaging API broadcast endpoint.
- Desk rule: seen ≥ 60 s → in use; nobody seen 2 min → camera says `empty` → free at once, `items_only` → away; 20 min → LINE warning; 30 min → released and flagged on the staff page. If AI is unavailable, the plain 30-min rule applies.
- Main test site is a team member's bedroom (24 h run); a short session with real users is a stretch goal.
- Course milestones: proposal Fri 30 Oct, checkpoint video Fri 20 Nov, presentation Tue 8 Dec 2026.

## Capabilities and Constraints

- Everything is planned, not built yet. Board choice, CO₂ sensor model and cloud are recommendations awaiting team decision.
- Must be buildable by second-year CE students: Arduino IDE 2 + esp32 core 3.x like the labs, only parts with a well-known Arduino library and example, every hard item has a fallback, no custom protocols or parsers, one cloud service, no app login.
- If on-device AI fails the 13 Nov go/no-go gate, inference moves to a Raspberry Pi.
- Team member names per role are not filled in yet.
- Content language: English and Thai mixed naturally on the team pages (English nav and headings, Thai explanations); the Docs page has full English and full Thai versions.

## Evidence on Hand

- Course brief: `Embedded System (CEDT) - Final Project 2026.pdf`.
- Strategy source: `docs/strategy.md` (product-strategy-session template, 28 Oct 2026). Formal write-ups: `site/lib/docs-content.ts` (proposal and report, EN/TH).
- Problem evidence is anecdotal only ("commonly seen in university libraries"). The ghost-desk count and Google Form survey have not been done; never present numbers from them.
- Prices were checked on shop pages on 28 Oct 2026 except the MAX4466 (~100 baht, estimate) and sundries (~400). Total ~8,670 baht, or ~5,370 if the course lends two AMG8833.

## Product Principles

- Verify presence, don't trust bookings.
- Images stay on the board.
- Hit every minimum requirement before adding features.
- Every plan item has an owner, a date and a done-when test.
