# fix

**Citizens and civic bodies, fixing together.**

A community-powered platform where the people affected by a civic issue (roads, traffic,
water, waste, streetlights, parks…) come together to get it fixed — by **fixing it
themselves**, by **partnering with the responsible authority**, or both — with shared
accountability for everyone. It works for any settlement scale (metro city, small town,
village panchayat) in any country: **place is configuration, never hardcoded**.

This repository is a **demo-ready prototype** with realistic **mock data** — no real
backend, auth, or payments. The data layer is swappable: a real backend later means
replacing one module.

> ⚠️ All people, offices and contact details in the seed data are **clearly-labelled sample
> data** — representative structure, not real individuals or positions.

## Tech stack

Vite · React · TypeScript (strict) · Tailwind CSS · React Router · Leaflet + OpenStreetMap ·
react-i18next · Zustand · recharts. Mock data behind a thin async API + service interfaces
(`imageService`, `shareService`).

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check (tsc strict) + production build
npm run preview  # preview the production build
```

## Deployment (GitHub Pages + CI)

CI/CD is wired via GitHub Actions (`.github/workflows/deploy.yml`):

- **CI** — on every push and pull request, a `build` job runs `npm ci` + `npm run build`
  (TypeScript strict type-check + Vite production build). This is the merge gate.
- **Deploy** — on pushes to `main` or `claude/prompt-review-5gp1o1`, a `deploy` job publishes
  the built `dist/` to **GitHub Pages**. Pull requests are checked but not deployed.

The build uses a **relative base path** (`base: './'` in `vite.config.ts`) and **HashRouter**,
so it works under the project subpath (`https://<owner>.github.io/FIX/`) with no server-side
rewrite rules.

**One-time setup (repo owner):** in **Settings → Pages → Build and deployment → Source**,
choose **GitHub Actions**. After that, every push to a deploy branch publishes automatically;
the live URL appears in the workflow run's `deploy` job summary.

## Project status — Milestone 1 of 11

This is the scaffold milestone. Built so far:

- **Brand & theme** — Tailwind brand tokens (white UI, red `#D7263D` accent, Baloo 2 + Inter,
  Noto Sans fallback for Indic scripts) and the `fix.` wordmark (the "i" dot is a small red
  person with raised arms; red-and-ink "x"), which doubles as the favicon / app icon.
- **Full type model** (`src/types/`) — every domain entity across all 8 planned features,
  with branded ids for relationship safety, strict mode, no `any` in the data layer.
- **Swappable mock data layer** (`src/data/`) — `api.ts` (the single replace-for-backend
  facade), an in-memory `db.ts` built from rich fixtures at boot (not localStorage),
  `withLatency()` to simulate async, and the `imageService` / `shareService` interfaces.
- **Place & hierarchy config** (`src/config/`) — three fictional demo places (metro
  *Nayanagar*, town *Devarahalli*, village *Hosakere* — believable but not real), plus an
  urban and a rural three-tier panchayati-raj hierarchy, each rolling up to a Chief Minister.
  A **place switcher** in the header swaps all of it.
- **i18n** (`src/i18n/`) — react-i18next with **English, Hindi and Kannada** translated for
  navigation, the report flow and key labels, **Tamil and Telugu** stubbed (falling back to
  English), and a **language switcher**. Default language follows the active place.
- **Responsive shell** — bottom tab navigation on mobile, sidebar + top bar on desktop,
  44px touch targets, all routes wired to pages (Home is a live read-only preview of seeded
  issues; the rest are placeholders that come alive in later milestones).
- **Seed data** — ~25 metro issues across 7 wards + town/village seeds, mixed statuses,
  countermeasures and discussions, 2 mobilization plans, 1 adopted street with an org
  account, engagement logs + commitments (one completed, one on track), before/after AI
  image pairs, the full hierarchy directory, and 5 demo personas.

### How to test Milestone 1

1. `npm run dev` and open the app. You should land on the **Nayanagar** (metro) home with a
   list of seeded issues.
2. Use the **place switcher** (top bar) to change between metro / town / village — the issue
   list, civic-body name and ward counts update, and the **default language follows the
   place** (the village defaults to Tamil).
3. Use the **language switcher** to flip between English / हिन्दी / ಕನ್ನಡ (and the Tamil /
   Telugu stubs) — navigation and key labels re-render in the chosen script.
4. Switch the **persona** (top bar / Profile) to act as a resident, community lead, NGO
   coordinator, civic official or CSR manager.
5. Resize to **360px / 768px / 1280px** — mobile shows bottom tabs, desktop shows the sidebar.
6. `npm run build` should complete with no type errors.

## Architecture

- **One swap boundary.** Components, pages and hooks depend only on `src/data/api.ts`, the
  service interfaces, and `src/types/`. They never import fixtures directly. Swapping in a
  real backend means reimplementing `api.ts` + the two services against HTTP — nothing else
  changes.
- **Place as configuration.** `PlaceConfig` + `HierarchyConfig` drive localities, categories,
  currency, language defaults, civic-body naming and the official hierarchy. Three demo
  configs prove the range.
- **Transparent priority score.** A documented, capped, weighted formula
  (`src/lib/priorityScore.ts`) surfaced to users.

## Roadmap (subsequent milestones)

Map home + issue detail → report flow + "Show the fix" AI vision → discussion & voting →
Who's-Responsible hierarchy & escalation → accountability (engagement log, commitments,
scoreboard) → prioritization dashboard → mobilization & fix-it days → Adopt a Street / CSR →
Share & Invite → polish.

### Path to production (planned)

Real auth · Postgres/PostGIS · image storage + a real AI image model behind `imageService` ·
real OG-image rendering + share analytics behind `shareService` · content moderation ·
payment / CSR-fund escrow · verified sync of official-hierarchy data from government sources ·
integration with existing municipal grievance systems · expanded language coverage with voice
input · and a **native mobile app (iOS + Android)** as the primary field client, reusing this
same swappable data layer.
