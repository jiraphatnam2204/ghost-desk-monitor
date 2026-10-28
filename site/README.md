# Ghost-Desk Monitor — team site

The team's front end for the final project: check how the project stands, see problems as they come up, and keep the formal write-ups for the professor. Next.js 16, static export, deployed to GitHub Pages.

| Page | What it's for |
|---|---|
| Overview | Live desk demo (simulated) and the most serious open problems |
| Equipment | Both devices as isometric figures that come apart, every part with price, library and starting example, and a budget calculator |
| Grading Criteria | The 70-point rubric, M1–M8 and deadlines as a scorecard: status, owner, plan, projected score |
| Build Plan | How to build the project start to finish: which equipment to start with, 8 phases and 26 steps with done-when tests, owners and weeks; the figure lights the part each step uses |
| Problems | Every issue, expected problem and risk, with filters and search |
| Docs | Proposal and final report in English or Thai, printable to PDF |

## Updating the shared data (no backend)

- **Rubric status:** edit `data/progress.json` — set `status` to `not-started`, `in-progress`, `done` or `at-risk`, add an `evidence` link, update `updated`.
- **Problems:** edit `data/problems.json` — copy the template from the Problems page, use the next `P` id and `"type": "issue"`; mark `"status": "fixed"` when solved.
- **Workflow steps:** edit `data/workflow.json` — set each step to `not-started`, `in-progress`, `done` or `blocked`.
- **Docs text:** `lib/docs-content.ts` (every string has an `en` and a `th` version).

Commit and push to `main`; the workflow rebuilds the site in a few minutes.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (one-time setup)

1. Push the project repository to GitHub with this `site/` folder and `.github/workflows/deploy-site.yml`.
2. On GitHub: Settings → Pages → Source: **GitHub Actions**.
3. Every push to `main` that touches `site/` builds and publishes to https://jiraphatnam2204.github.io/ghost-desk-monitor/.

Everything the seating plan and figures animate is a simulation of the planned desk rule, not measured data.
