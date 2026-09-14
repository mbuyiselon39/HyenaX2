# NdlelaMillionaires

AI-consensus football predictions, ranked market probabilities and bookmaker
odds intelligence, delivered as an installable PWA.

## How it works

```
scripts/aggregate_fixtures.py  (runs every 4h via GitHub Actions)
        │
        ▼
   data/fixtures.json   (the only "database" — committed to the repo)
        │
        ▼
   index.html            (fetches ./data/fixtures.json at runtime, same origin)
```

If `data/fixtures.json` is missing, empty, or malformed for any reason, the
site never breaks — it falls back to a fully-featured, locally-computed seed
model so there's always something on screen. The status pill in the top bar
tells you which one you're looking at:

- **LIVE SYNC** (green) — real scheduled fixtures for at least some leagues,
  sourced only from confirmed working APIs (football-data.org,
  API-Football). A league with no live data on a given run simply doesn't
  appear that day — it is never padded with simulated data under this
  badge. Check `meta.source` for exactly how many of the 15 tracked leagues
  had live data this run, e.g. `"football-data.org (8/15 tracked leagues
  had live data this run)"`.
- **SEED MODE** (amber) — no live source returned anything at all; the
  frontend's own built-in demo data is showing instead (this only happens
  if `data/fixtures.json` is missing or unreachable — see below).

## Setup — two free API keys, ~5 minutes total

### 1. football-data.org (primary — 8 of 15 leagues)

1. Register free at **[football-data.org/client/register](https://www.football-data.org/client/register)**
   (no card needed).
2. Repo → **Settings → Secrets and variables → Actions → New repository
   secret** → name `FOOTBALL_DATA_TOKEN` → paste the key you're emailed.

Covers: Premier League, LaLiga, Serie A, Bundesliga, Ligue 1, Eredivisie,
Liga Portugal, Brasileirão Série A.

### 2. API-Football (additive — the remaining 7 leagues)

1. Register free at **[dashboard.api-football.com/register](https://dashboard.api-football.com/register)**
   (100 requests/day free tier, no card needed).
2. Repo → **Settings → Secrets and variables → Actions → New repository
   secret** → name `API_FOOTBALL_TOKEN` → paste the key.

Covers: Jupiler Pro League, Scottish Premiership, Betway Premiership, MLS,
Liga MX, Saudi Pro League, Süper Lig.

This source's league ids are **resolved dynamically at runtime** (via the
documented `/leagues?country=...` lookup), not hardcoded — the result is
cached to `data/api_football_league_map.json` (committed automatically) so
steady-state runs only need 1 API call per league, comfortably inside the
100/day free-tier cap even running every 4 hours.

### 3. Run it

Go to **Actions → Fixture Scraper (every 4h) → Run workflow**, then check
the log for lines like:

```
[ndlela] fetched 8 scheduled matches from football-data.org
[ndlela] fetched 7 scheduled matches from api-football (7 target league(s))
[ndlela] wrote 15 fixtures -> .../data/fixtures.json (source: football-data.org+api-football)
```

Your live site should now show **LIVE SYNC**.

## Why not just scrape SofaScore?

This project went through several rounds of trying exactly that before
landing on the two APIs above — worth knowing if you're extending this:

- **Direct scrape of `api.sofascore.com`** — free, keyless, but confirmed
  (from a real GitHub Actions run) to return `HTTP 403` — standard anti-bot
  blocking of cloud/datacenter IP ranges. Kept as a best-effort attempt in
  the fetch chain in case it ever works from your network, but don't rely
  on it.
- **Apify `azzouzana/sofascore-scraper-pro` actor** — a general-purpose
  *page* scraper. Pointed at a Sofascore tournament overview URL it returns
  that tournament's *profile* (colours, logo, slug) — confirmed twice by
  inspecting real output — not a fixture list. Kept wired up (`APIFY_TOKEN`
  secret) as a last-resort attempt, but structurally can't deliver what this
  site needs from the default configuration.

football-data.org and API-Football are both official, documented REST APIs
built for exactly this use case, so they don't have either problem.

## Prediction engine enhancements

Each fixture and prediction now carries a few extra fields beyond the core
market/selection/probability/odds:

- **`marketEdge` / `isValueBet`** (per prediction) — edge vs. the best
  available price across the three tracked books. ⚠️ Currently those odds
  are synthetically derived from the model's own probability (not real
  independent market prices), so edge is almost always negative in
  practice — the math is correct and ready, it's waiting on a real odds
  feed to become actionable.
- **`dataQuality`** (per fixture) — `"LOW DATA QUALITY / HIGH RISK"` if
  that league had fewer than 5 real fixtures this run, `"HIGH DATA QUALITY
  / SYSTEM VERIFIED"` if 10 or more, otherwise unset.
- **`rationale`** (per fixture) — a one-sentence, dynamically-generated
  explanation of the top pick, built from the actual xG/rating/form inputs.
- **`externalModel`** (per fixture, optional) — API-Football's own
  `/predictions` output (advice + home/draw/away percent split), attached
  only for API-Football-sourced fixtures kicking off today, capped at 8
  fixtures/run to protect the 100-requests/day free tier. Purely additive —
  absent for any fixture it wasn't fetched for.
- **`consensusIndex`** (per fixture, optional) — blends this fixture's own
  Match Winner probabilities (60%) with `externalModel`'s (40%) when both
  are available, re-normalized to 100%. `dualModelVerified` is only true
  when both models actually agree on the favored side AND the blended
  probability is ≥55% — only ever present for the same small subset of
  fixtures `externalModel` covers.
- **League goal-scoring baseline** — not a per-fixture field, but a
  behind-the-scenes calibration: `data/league_baselines.json` (auto-created,
  refreshed weekly) tracks each football-data.org-covered league's average
  goals/match from recent finished matches, nudging that league's expected
  goals up or down accordingly (clamped 0.85×–1.20×). The 7 API-Football-only
  leagues use a neutral 1.0 multiplier.

**Not built:** the API-Football `/teams/statistics` endpoint. Two calls per
team per fixture would push the free tier's 100-requests/day budget well
past what the fixtures + predictions calls already use running every 4
hours — it would risk breaking what's already working. Its stated use
(minute-by-minute goals for future live/in-play features) is also
speculative — nothing currently consumes that data. Worth revisiting if
live/in-play prediction becomes a real, scoped requirement.

## Fetch order

For each of the 15 tracked leagues, the pipeline tries **football-data.org →
API-Football**, stopping as soon as a league has real fixtures. Only these
two are enabled by default — both are official, documented REST APIs, and
neither has the reliability problems below.

The direct SofaScore call and the Apify actor are **disabled by default** —
set `ENABLE_EXPERIMENTAL_SOURCES=1` (repo variable) to re-enable them as
best-effort attempts for whichever leagues the two confirmed sources didn't
cover. They're kept in the codebase for reference, but neither has ever
produced a real fixture in this project (see "Why not just scrape
SofaScore?" above) — enabling them doesn't risk showing wrong data (they
either return nothing or fail outright), it just adds two more calls that
are very unlikely to help.

**Leagues with zero real data on a given run are simply omitted from that
day's dashboard, not simulated.** If literally every source fails, the
pipeline leaves the existing `data/fixtures.json` untouched rather than
publish an empty or synthetic file — your site keeps showing its last known
good real data until the next successful run.

## Local development

```bash
python3 -m http.server 8080   # serve the folder — file:// breaks the service worker
# then open http://localhost:8080
```

To regenerate `data/fixtures.json` locally:

```bash
pip install requests
export FOOTBALL_DATA_TOKEN=your-key-here
export API_FOOTBALL_TOKEN=your-key-here
python3 scripts/aggregate_fixtures.py
```

## Deployment

This is a fully static site — any static host works (Cloudflare Pages,
GitHub Pages, Netlify, Vercel). Point the host at the repo root; no build
step is required.

**Cloudflare Pages specifically:** the scraper's commit message must **not**
contain `[skip ci]` — Cloudflare Pages honors that tag too and will skip
deploying that commit entirely, leaving your live site frozen on stale data
even though the pipeline ran successfully. This repo's workflow doesn't use
that tag.

## Adding the `.github` folder via the GitHub web UI

GitHub's drag-and-drop uploader sometimes silently skips folders whose name
starts with a dot (like `.github`), depending on your browser/OS. If it
doesn't show up after uploading, create the workflow file directly instead:

1. In your repo, click **Add file → Create new file**.
2. In the filename box, type the **full path including folders**:
   `.github/workflows/scraper.yml` — GitHub will automatically create the
   `.github` and `workflows` folders for you as soon as you type the `/`.
3. Paste in the contents of `scraper.yml` from this package.
4. Scroll down and click **Commit changes**.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | The entire frontend (Alpine.js store, Tailwind, markup) |
| `sw.js` | Service worker — app-shell caching + offline fallback |
| `manifest.webmanifest` | PWA manifest (installable on Android/iOS) |
| `scripts/aggregate_fixtures.py` | The backend: fetch → model → write JSON |
| `data/fixtures.json` | Generated output the frontend consumes |
| `data/api_football_league_map.json` | Cached league-id lookups (auto-created) |
| `data/league_baselines.json` | Cached per-league goal-scoring baselines (auto-created, weekly) |
| `.github/workflows/scraper.yml` | Schedules the pipeline + validates schema |

18+ · Play responsibly. Predictions are statistical estimates, not guarantees.
