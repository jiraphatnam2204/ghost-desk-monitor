# Ghost-Desk Monitor

A desk sign that knows whether a library seat is really in use. Each desk has a sensor node (mmWave radar, 8×8 thermal array and an on-board camera classifier) and a three-face prism sign turned by a servo. A gateway owns the desk rule (away after 2 minutes, LINE warning at 20, release at 30; a clean desk is released at once), stores data in Supabase and drives a web room map.

Final project for **Embedded System (CEDT) 2026: Smart Devices** · second-year computer engineering · team of 5.

**Team site:** https://jiraphatnam2204.github.io/ghost-desk-monitor/ — overview, equipment, grading scorecard, build plan, problems and the formal docs (proposal and report, English and Thai).

## Repository

| Path | What's there |
|---|---|
| `site/` | The team site (Next.js, static export, deployed to GitHub Pages) |
| `site/data/` | Shared status the team edits: `progress.json` (rubric), `problems.json`, `workflow.json` (build steps) |
| `docs/strategy.md` | Product strategy session: positioning, problem framing, roadmap, decisions |
| `PRODUCT.md`, `DESIGN.md` | Product context and the site's design system |

Firmware for the node and the gateway goes in its own folders as the build plan reaches it. Never commit `secrets.h` (Wi-Fi password, Supabase key, LINE token); `.gitignore` already blocks it.

## AI tools

Claude (Anthropic) was used to draft the project strategy, the team site and the formal documents. Each member lists any other tools in the final report, as section 4.6 of the course brief requires.
