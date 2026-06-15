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

## Project status — all 11 milestones complete

**M11 (polish)** adds: route-level **code-splitting** (recharts and Leaflet load on demand —
initial bundle ~316 KB vs ~916 KB), a **loading fallback** for lazy routes, reduced-motion
support, and this demo script.

**M10 (Share & Invite)** adds: a native **share sheet** (Web Share API + WhatsApp / Telegram /
Facebook / X / email fallbacks + copy link), an on-brand **language-aware preview card**, and
deep links — wired into issues (share, "We fixed it!" celebrate, thank the office), mobilization
plans (rally), fix-it days (invite), the adoption dashboard (adopter recognition), and the home
header (invite a neighbour).

## 5-minute demo walkthrough

Live: **https://abhilashyes.github.io/FIX/**. Use the header **place switcher** (Nayanagar
metro / Devarahalli town / Hosakere village) and **language switcher** (English / हिन्दी /
ಕನ್ನಡ, plus Tamil/Telugu stubs) throughout — everything is config- and i18n-driven.

1. **Home & map (M2)** — land on Nayanagar; toggle **Map** to see severity-coloured pins;
   tap a card's **"affects me too"** to join the affected community.
2. **Report + Show the fix (M3)** — **Report** tab: category → photo → drop a pin →
   countermeasure → **Show the fix** ("Generating your vision…" → before/after slider) →
   submit; the new issue opens.
3. **Issue detail (M2/M4/M5/M6)** — open issue #1: before/after, status timeline; vote a
   **countermeasure** and post a threaded **comment**; see the **Responsible panel** + escalation
   ladder; open **Accountability** for the commitment + engagement log and generate a letter.
4. **Dashboard (M7)** — **Top priorities** with the transparent formula, funnel, trends,
   locality hotspots; flip **Civic Body View** for SLA aging + CSV export; scoreboard below.
5. **Mobilize (M8)** — on issue #3, **View mobilization plan**: pledge to a need, RSVP the
   fix-it day.
6. **Adopt a Street (M9)** — open the **GreenCore** adoption: metrics, before/after gallery,
   log hours, export the CSR report; the badge shows on issue #3.
7. **Share (M10)** — hit **Share** on an issue or **Invite a neighbour** in the header to see
   the on-brand, language-aware card and network options.
8. **Switch place to Hosakere** to see the rural three-tier panchayat hierarchy and a
   Tamil-default UI — proving the platform works at any settlement scale.

## Out of scope for the prototype (mocked/stubbed, ready to make real)

Real payments / CSR-fund escrow, SMS/email/push, real geolocation, content moderation, a real
AI image backend (behind `imageService`), real OG-image rendering + share analytics (behind
`shareService`), verified live official data, and the native mobile app. See the roadmap below.

## Earlier milestones

**M9 (Adopt a Street / CSR)** adds: organization accounts adopting a street/junction/park/
stretch, a browse + create flow, an **adoption dashboard** (funds deployed vs committed,
employee hours, issues fixed, before/after gallery), a **CSR impact report** export (mock CSV),
employee-hours logging, and a tasteful **"Adopted by …" badge** on issues in an adopted area.

**M8 (mobilization)** adds: on an issue, a **mobilization plan** with a needs list
(volunteers / materials / funds / tools) and progress bars, **pledges** (time / money /
resources), and **fix-it day** events with a meeting-point map and RSVP.

**M7 (prioritization dashboard)** builds out the Dashboard with **recharts**: a transparent
**Top priorities** list (per-component score breakdown + visible formula), a **status funnel**,
**reported-vs-resolved trends** (6 months), **locality hotspots** (heatmap-style), filters by
category / locality / status, and a **Civic Body View** toggle with an SLA-aging report and a
mock CSV **export** — alongside the shared scoreboard.

**M6 (accountability)** adds, on each issue: an **engagement log** (meetings, calls, letters,
requests with dates + outcomes), a **commitment tracker** with neutral statuses (Completed /
On track / Needs attention) and history, and a **respectful letter generator** that pre-fills
request/follow-up/thanks/escalation templates from the issue's data. A **shared scoreboard**
(per department and per locality, with responsiveness) appears on the Dashboard.

**M5 (Who's Responsible + escalation)** adds: a browsable **hierarchy directory** for the
place's state — both the **administrative** and **elected** chains as official profile cards
(clearly-labelled sample office-holders), filterable by locality. Each **issue** now shows a
**Responsible panel** with the matched office-holders for that location and a respectful
**escalation ladder** ("if unresolved, the next person is…") with one-tap "keep the next
office informed" that logs to the engagement record.

**M4 (discussion, countermeasures & voting)** adds: first-class **countermeasure proposals**
on each issue with **"Would work / Wouldn't work" + reason** voting (tally bars, "community
choice" badge) and a **threaded comment thread** with replies — all wired into the issue
detail page. The **Discuss** tab ranks issues by community engagement.

**M3 (report flow + "Show the fix")** adds: an end-to-end **Report an issue** flow — category,
severity, title/description, photo (sample picker or upload with preview), drop-a-pin location
(or "use my location"), and an optional countermeasure. The signature **"Show the fix"**
feature generates an AI "after" image behind the `imageService` mock — a realistic
"Generating your vision…" state, then a before/after reveal. Submitting creates the issue in
the in-memory store (auto-routed to the nearest locality) and opens its detail page.

**M2 (map, list, issue detail)** adds: a Leaflet/OpenStreetMap home with severity-coloured
pins and popups, a List/Map view toggle, rich issue cards (category, severity, status,
transparent priority score, "affects me too" upvote, "Show the fix" thumbnail), and a full
issue detail page — before/after comparison slider, location map, status timeline, reporter +
affected-community panel, and a responsible-officials teaser (full hierarchy lands in M5).

Built in earlier milestones:

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
