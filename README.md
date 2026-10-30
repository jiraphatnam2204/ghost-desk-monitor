# Ghost-Desk Monitor

A desk sign that knows whether a library seat is really in use. Each desk has a sensor node (mmWave radar, VL53L1X time-of-flight sensor and a camera) and a three-face prism sign turned by a servo. A gateway runs a small AI model on the radar and distance data to tell whether someone is seated, asks a cloud vision model about a desk photo when a desk has been empty for 2 minutes, owns the desk rule (away after 2 minutes, LINE warning at 20, release at 30; a clean desk is released at once), stores data in Supabase and drives a web room map.

Final project for **Embedded System (CEDT) 2026: Smart Devices** · second-year computer engineering · team of 5.

**Team site:** https://jiraphatnam2204.github.io/ghost-desk-monitor/ — overview, equipment, grading scorecard, build plan, problems and the formal docs (proposal and report, English and Thai).

## Getting started (for teammates)

### 1. Get push access

Anyone can clone a public repo, but only collaborators can push. Send the owner (jiraphatnam2204) your GitHub username; they add you at **Settings → Collaborators → Add people**. Accept the invite from the email or from https://github.com/jiraphatnam2204/ghost-desk-monitor/invitations.

### 2. Install once

- [Git](https://git-scm.com/downloads)
- [Node.js 22 LTS](https://nodejs.org/) (the site's build uses Node 22)
- Optional: [VS Code](https://code.visualstudio.com/), or [GitHub Desktop](https://desktop.github.com/) if you'd rather click than type

### 3. Clone

```bash
git clone https://github.com/jiraphatnam2204/ghost-desk-monitor.git
cd ghost-desk-monitor
```

GitHub Desktop: **File → Clone repository → URL**, paste the link above.

The first time you push, Git opens a browser to sign in to GitHub: sign in with **your own** account.

### 4. Run the site on your machine

```bash
cd site
npm ci
npm run dev
```

Open http://localhost:3000. Pages reload as you edit. Stop it with `Ctrl + C`.

### 5. Every time you work

```bash
git pull                                  # get everyone else's changes first
# ...edit files...
git add .
git commit -m "chore(data): update P1 after team meeting"
git push
```

Every push to `main` rebuilds the live site in about 2 minutes; watch it in the repo's **Actions** tab. If `git push` is rejected because someone pushed first, run `git pull --rebase` and push again.

### Common edits

| To change | Edit |
|---|---|
| A problem or the AI decision (P1) | `site/data/problems.json` |
| Rubric scorecard status | `site/data/progress.json` |
| Build plan step status | `site/data/workflow.json` |
| Proposal / report text | `site/lib/docs-content.ts` |

Optional check before pushing: `npm run build` inside `site/` (it fails on a broken JSON file, so the live site never breaks).

### Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `type(scope): summary`.

- **type:** `feat` (new feature or page), `fix` (bug fix), `docs` (README, docs, proposal or report text), `style` (formatting only), `refactor` (no behaviour change), `chore` (tooling, dependencies, status data), `ci` (GitHub Actions).
- **scope** (optional): `site`, `data`, `node`, `gateway`, `cloud`, `docs`, `readme`.
- **summary:** imperative mood starting with a lower-case verb (`add`, `fix`, `update`), no full stop, about 72 characters at most.
- Add a body after a blank line when the why isn't obvious. Mark a breaking change with `!` after the type, for example `feat(node)!: change node_report_t layout`.

```text
feat(site): add enlarge view to every figure
fix(site): keep the frame fixed when zooming to 200%
chore(data): mark P1 decided after team meeting
docs(readme): add clone instructions
feat(node): read LD2410 frames over UART
```

## Repository

| Path | What's there |
|---|---|
| `site/` | The team site (Next.js, static export, deployed to GitHub Pages) |
| `site/data/` | Shared status the team edits: `progress.json` (rubric), `problems.json`, `workflow.json` (build steps) |
| `docs/strategy.md` | Product strategy session: positioning, problem framing, roadmap, decisions |
| `docs/order-list.md` | What to buy, from which shop, with links and a check before paying |
| `docs/proposal-overleaf/` | The proposal as submitted on 30 Oct (Thai, LaTeX for Overleaf, compile with XeLaTeX), without student IDs; the copy with IDs and the PDF stay in a git-ignored `private/` folder |
| `PRODUCT.md`, `DESIGN.md` | Product context and the site's design system |

Firmware for the node and the gateway goes in its own folders as the build plan reaches it. Never commit `secrets.h` (Wi-Fi password, Supabase key, LINE token); `.gitignore` already blocks it.

## AI tools

Claude (Anthropic) was used to draft the project strategy, the team site and the formal documents. Each member lists any other tools in the final report, as section 4.6 of the course brief requires.
