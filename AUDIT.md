# NdlelaMillionaires — Remediation Log

**Date:** 2026-07-23 · **Scope:** full repo review against the live "SEED
MODE stuck on" symptom, plus a general production-readiness pass.

The previous `AUDIT.md` shipped in this repo claimed "8/8 domains pass" and
described a working Apify-backed pipeline. That did not match the code: the
site was permanently stuck in SEED MODE because the two halves of the
pipeline had never actually been wired together correctly. This log replaces
that document with what was actually found and fixed.

## Root causes of "SEED MODE" never clearing

1. **Frontend was fetching the wrong thing.** `loadRemote()` in `index.html`
   called an external CORS proxy (`api.allorigins.win`) pointed at a
   hardcoded `raw.githubusercontent.com` URL under a specific GitHub
   username, instead of simply requesting `data/fixtures.json` from the same
   site it was already deployed on. Any hiccup in that third-party proxy (or
   a mismatched username/branch) silently failed and left the app on seed
   data forever.
2. **The Python "pipeline" wasn't a pipeline.** `scripts/aggregate_fixtures.py`
   never called any real API — `raw_data = []` was assigned and never used.
   It emitted 92 fixtures that were all literally named `"Home Team 1"` /
   `"Away Team 1"` with **identical hardcoded prediction numbers** for every
   single match (91%, 79%, 76%, 67%, 63%, 59% — every time).
3. **Schema mismatch crashed the fallback silently.** The Python script wrote
   `home` / `away` as plain strings; the frontend expected objects
   (`{ name, short, rating, form, xgFor, xgAgainst }`). Reading `.name` off a
   string returns `undefined`, and `initials(undefined)` throws — which was
   swallowed by a bare `catch (e) {}`, quietly reverting to seed state with
   no visible error.
4. **A stale duplicate copy of the whole app** lived at
   `ndlelamillionaires-architecture-blueprint/` inside the repo (a partially
   fixed, uncommitted draft) — confusing for deployment and a source of
   drift between what actually runs and what's reviewed.

## What was fixed

- **`index.html`** — `loadRemote()` now fetches `data/fixtures.json` directly
  (same-origin, cache-busted, no third-party hop). Added a defensive
  `normalizeFixture()` / `normalizeTeam()` / `normalizeH2H()` layer that
  accepts either camelCase or snake_case field names, so future pipeline
  changes can't silently break the UI again. `dataSource` is now read from
  `meta.dataSource` instead of being hardcoded on success.
- **`scripts/aggregate_fixtures.py`** — fully rewritten. Real Apify call
  (`fetch_events_from_apify()`) attempted first when `APIFY_TOKEN` is set;
  on any failure it falls back to a **deterministic simulated fixture set**
  (varied, realistic team pairings — not placeholder strings), and every
  fixture gets its own Poisson-model-derived predictions (mirrors the JS
  engine exactly, so seed and live data are statistically consistent). Field
  names now match the frontend contract exactly (camelCase). The script
  refuses to overwrite `data/fixtures.json` with zero matches — it fails the
  CI job loudly instead of publishing an empty file.
- **`.github/workflows/scraper.yml`** — now passes `APIFY_TOKEN` /
  `SOFASCORE_ACTOR` through to the script, added a schema-validation step
  that checks strict probability sorting and required fields before
  committing, added `concurrency` so overlapping runs can't race, and
  `permissions: contents: write` is explicit.
- **Removed** the stray `ndlelamillionaires-architecture-blueprint/` nested
  copy from the repo.
- **`README.md`** — rewritten with the actual architecture, and step-by-step
  instructions for adding a real `APIFY_TOKEN` to flip the site from
  SEED MODE to LIVE SYNC.

## Known limitation (by design)

Without an `APIFY_TOKEN` secret configured, the site will correctly and
honestly show **SEED MODE** — this is not a bug. It means the pipeline ran
and published data, but that data is the deterministic simulated feed, not
real scraped fixtures. See `README.md` → "Going fully live" for how to wire
up the real Apify actor.

---

## Round 2 — token added, still SEED MODE + wrong-league fixtures

After deploying round 1 and adding a real `APIFY_TOKEN`, the site was still
stuck on SEED MODE, *and* the simulated data itself had a visible bug:
fixtures listed under one league showed teams from a totally different one
(e.g. "Borussia Dortmund vs Barcelona" under **Eredivisie**; "Manchester
City vs Mamelodi Sundowns" under **Liga Portugal**).

### Root causes

1. **Wrong Apify actor id.** The script pointed at `apify/sofascore-scraper-pro`
   — an actor that doesn't exist under that namespace. The real, published
   actor is `azzouzana/sofascore-scraper-pro`. Every call 404'd, so the
   pipeline correctly (but silently) fell back to the simulated feed no
   matter what token was supplied.
2. **Wrong API path separator.** Even with the right actor name, the code
   built the URL with a `/` between username and actor name
   (`.../acts/apify/sofascore-scraper-pro/...`); Apify's API requires a `~`
   (`.../acts/azzouzana~sofascore-scraper-pro/...`). A slash there is parsed
   as extra path segments, not a namespaced actor id, and also 404s.
3. **Used the wrong endpoint for a stateless pipeline.** `runs/last/dataset/items`
   assumes a run already exists and can't accept fresh input — not
   appropriate for a scheduled job that needs to trigger a new scrape each
   time. Switched to `run-sync-get-dataset-items`, which starts a fresh run
   with an explicit `startUrls` input and waits for the result.
4. **Simulated fallback picked team names globally instead of per-league.**
   `generate_simulated_events()` drew from one shared pool of "marquee" club
   names for every league, so a Dutch Eredivisie fixture could randomly get
   assigned Barcelona and Borussia Dortmund. Replaced with a `LEAGUE_TEAMS`
   dict — a curated roster of real clubs *for that specific league* — so a
   fixture's two teams are always drawn from the same competition.

### What was fixed

- `SOFASCORE_ACTOR` default corrected to `azzouzana~sofascore-scraper-pro`.
- `fetch_events_from_apify()` now calls `run-sync-get-dataset-items` with an
  explicit `startUrls` payload (configurable via `SOFASCORE_START_URLS`).
- Added `extract_event_fields()`: a single, clearly-documented place that
  tries several plausible field-name layouts for the actor's output and
  logs the real top-level keys of the first item if none match — since this
  third-party actor's exact schema isn't something that can be verified
  without actually running it, this makes the one remaining unknown fast to
  diagnose and fix from the Action log, instead of failing silently.
- Added `LEAGUE_TEAMS`: 15 leagues × 6 real, correctly-associated clubs each,
  with ratings for all of them in `TEAM_RATINGS`. The simulated fallback (and
  any Apify item missing a rating) now always pairs teams within their own
  league.
- Also documented (in `README.md`) that Cloudflare Pages honors `[skip ci]`
  in commit messages and will skip deploying the scraper's data-refresh
  commits if that tag is present — a separate deployment-side gotcha found
  while diagnosing this with the user.

---

## Round 3 — token confirmed working, still fell back (404 with no actor in the URL)

After adding `APIFY_TOKEN` as a real repository secret, the "not configured"
warning went away — but the next run logged:

```
[ndlela] WARN: 404 Client Error: Not Found for url:
https://api.apify.com/v2/acts/run-sync-get-dataset-items?token=***
```

Notice there's no actor name between `acts/` and `run-sync-get-dataset-items`.

### Root cause

The workflow passes an *optional* override through as an env var:

```yaml
SOFASCORE_ACTOR: ${{ vars.SOFASCORE_ACTOR }}
```

No `SOFASCORE_ACTOR` repository **variable** was ever created (correctly —
it's optional). But GitHub Actions still sets the environment variable to an
**empty string** in that case, rather than leaving it unset. The Python code
was:

```python
SOFASCORE_ACTOR = os.environ.get("SOFASCORE_ACTOR", "azzouzana~sofascore-scraper-pro")
```

`os.environ.get(key, default)` only returns the default when the key is
**completely absent** from the environment — not when it's present with an
empty value. Since the key existed (as `""`), Python used the empty string,
and the actor name silently disappeared from the request URL.

### What was fixed

Changed the fallback logic to treat an empty string the same as "not set":

```python
SOFASCORE_ACTOR = os.environ.get("SOFASCORE_ACTOR", "").strip() or "azzouzana~sofascore-scraper-pro"
```

Applied the same defensive pattern to `DAYS_AHEAD` in case it's ever sourced
from a repo variable in the future. `APIFY_TOKEN` and `SOFASCORE_START_URLS`
already used this pattern correctly (both explicitly check for an empty
string before falling back), so they weren't affected.

Verified locally by injecting `SOFASCORE_ACTOR=""` into the environment
(reproducing exactly what GitHub Actions does for an unset `vars.*`
reference) and confirming the script now resolves the full actor id and
builds a correct request URL.

---

## Round 4 — Apify call succeeded, but returned tournament metadata, not fixtures

With the actor id and URL fixed, the next run logged:

```
[ndlela] fetched 5 raw items from Apify
[ndlela] WARN: no fixtures could be extracted from any Apify item — see dump above
```

The dumped item showed exactly what the actor returned for a tournament
overview URL (e.g. `.../tournament/football/germany/bundesliga/35`): the
tournament's own metadata object — name, slug, brand colors, logo, category,
title holder — with no list of matches anywhere in it.

### Root cause

`azzouzana/sofascore-scraper-pro` is a general-purpose *URL* scraper: it
extracts whatever structured data a given Sofascore page actually contains.
A tournament overview page's content **is** the tournament's profile, not
its fixture list — Sofascore renders the actual schedule client-side from a
separate underlying API call, which a single-page scrape of the overview
URL doesn't capture. No amount of adjusting field-name paths would fix
this — the data simply isn't on that page.

### What was fixed — a source-priority change, not just a bug fix

Rather than keep guessing at which specific Sofascore page/actor combination
would return fixture data, the pipeline now calls **SofaScore's own JSON API
directly** (`api.sofascore.com/api/v1/sport/football/scheduled-events/{date}`)
as the *primary* source:

- No account or token required.
- Its schema is exactly what this script already expects
  (`homeTeam`/`awayTeam`/`tournament.uniqueTournament`/`startTimestamp`) —
  confirmed against documented sample responses from independent, actively
  maintained open-source SofaScore client libraries.
- Results are filtered to only the 15 leagues in `LEAGUES` before being
  processed, so one call doesn't flood the pipeline with every division and
  youth competition worldwide.

The fetch order is now: **direct SofaScore call → Apify actor (only if the
direct call fails) → deterministic simulated feed (only if both fail)**.
Apify remains available as a fallback for networks where the direct call is
blocked, but is no longer the primary path.

**Not yet verified from this environment:** the sandbox used to build this
fix has its own network egress allowlist that explicitly blocks
`api.sofascore.com` (confirmed via a direct test — the proxy returned
`host_not_allowed`), so the direct-fetch code path could only be verified
against realistic mocked payloads here, not a real live call. GitHub Actions
runners have open outbound internet access, so this is expected to work
there, but the next real run's log is the actual confirmation — look for
`[ndlela] fetched N scheduled fixtures directly from SofaScore`.

---

## Round 5 — confirmed: SofaScore blocks GitHub Actions' IPs; Apify confirmed structurally unable to help

The next real run's log settled both open questions from Round 4:

```
[ndlela] WARN: direct SofaScore fetch failed: HTTP 403 for 2026-07-23 — body:
'{"error": {"code": 403, "reason": "Forbidden"}}'
[ndlela] fetched 5 raw items from Apify
[ndlela] WARN: first raw item (truncated to 1500 chars) for manual inspection:
{"url": ".../tournament/football/italy/serie-a/23", "data": {"uniqueTournament":
{"name": "Serie A", ... "titleHolder": {"name": "Inter"}, ...}}}
```

1. **SofaScore actively blocks GitHub Actions' IP range** with an explicit
   `403 Forbidden` — standard anti-bot behaviour against known
   cloud/datacenter IPs. This isn't a code bug to fix; scraping this
   specific host from CI was never going to be reliable.
2. **Apify item #2, confirmed again** with a different league (Serie A this
   time): tournament *profile* metadata, no fixtures. Two separate
   tournament pages, same result — this is conclusive, not a fluke. The
   actor cannot answer "what's scheduled" from an overview URL, full stop.

### The actual fix: stop scraping, use a real API

Rather than continue attempting to extract fixture data from pages/hosts
that structurally don't provide it, the pipeline now uses
**[football-data.org](https://www.football-data.org)** as its primary
source — a properly documented, official REST API for exactly this purpose,
running since 2013, with a free tier (12 competitions, 10 req/min) the
founder has publicly committed to keeping free. This is not a scraper, so
there's no anti-bot exposure.

- New function `fetch_events_from_football_data()` calls
  `/v4/competitions/{code}/matches?status=SCHEDULED&dateFrom=...&dateTo=...`
  once per tracked competition (8 of the 15 leagues are covered by the free
  tier — see `FOOTBALL_DATA_CODES`), using the officially documented
  response shape directly (`homeTeam.name`, `awayTeam.name`, `utcDate`) — no
  guessing, no recursive node-walking needed, because this API's contract is
  actually published and stable.
- `build_fixture()` now accepts an ISO datetime string (`kickoff_iso`, what
  this API returns) as well as the unix timestamp shape the other two
  sources use.
- Fetch order is now: **football-data.org → direct SofaScore call → Apify →
  simulated feed**, each only attempted if the previous one produced zero
  usable events.
- Verified end-to-end with mocked responses matching the exact documented
  schema: all 8 competitions queried, fields mapped correctly, kickoff
  parsed correctly, predictions generated correctly.

The other two sources are kept wired up as best-effort fallbacks, but
`README.md` is now explicit that football-data.org is the one path
confirmed to actually work, and the only one worth spending setup time on.

---

## Round 6 — added API-Football as an additive source for the 7 remaining leagues

football-data.org's free tier only covers 8 of the 15 tracked leagues.
Rather than leave the other 7 (Jupiler Pro League, Scottish Premiership,
Betway Premiership, MLS, Liga MX, Saudi Pro League, Süper Lig) permanently
simulated, **API-Football** (api-sports.io) was wired in as a second,
*additive* source — not another item in the same try/fallback chain, but a
call that always runs (when configured) specifically for whichever leagues
football-data.org didn't already cover.

### Design decisions, and why

- **No hardcoded league ids.** Every provider integrated so far has used
  its own internal numbering, and guessing those ids wrong (twice — the
  Apify actor slug/separator, and almost this too) cost multiple debugging
  rounds already. API-Football's `/leagues?country=...` endpoint is used to
  resolve each target league's real id at runtime by matching its name
  against a keyword list, and the result is cached to
  `data/api_football_league_map.json` (committed by the workflow) so
  steady-state runs need only 1 call per league (fixtures lookup), not 2 —
  important given the free tier's 100-requests/day cap running every 4h.
- **Partial-live gap filling, not all-or-nothing.** `main()` now tracks
  which of the 15 leagues actually got real fixtures from any source, and
  only simulates the leagues still missing after every real source has been
  tried — so a football-data.org outage no longer means the whole site
  reverts to fully simulated data if API-Football (or any other source)
  still has partial coverage. `meta.dataSource` reads `LIVE SYNC` as soon as
  *any* league has real data, with `meta.source` spelling out exactly which
  combination produced the result, e.g.
  `"football-data.org+api-football (+simulated:2 league(s))"`.
- **Season-boundary safety net.** API-Football's `/fixtures` endpoint
  requires a `season` parameter; since this project's season-labelling
  convention per competition isn't something to guess at either, the fetch
  tries the current calendar year first and automatically retries the
  previous year only if the first attempt returns zero fixtures — covers
  the case where a league's season is labelled by its start year without
  needing per-league calendar logic.

### Verified before shipping

- Mocked a full run with both football-data.org and API-Football succeeding
  — confirmed all 15 leagues present, correctly attributed to the right
  source, `dataSource: LIVE SYNC`.
- Mocked football-data.org failing entirely — confirmed API-Football still
  covers its 7 leagues and the remaining 8 get simulated gap-fill, with an
  accurate composite `source` string.
- Mocked two consecutive runs — confirmed the second run skips the
  `/leagues` lookup entirely and reuses the cached id from
  `data/api_football_league_map.json`.
- Also fixed a leftover `[skip ci]` tag in the commit message (from the
  Cloudflare Pages issue discovered earlier in this project) that had crept
  back into this file during a later rewrite — removed for good, and the
  workflow's git-add step now guards against the cache file not existing
  yet on a first run (which would otherwise abort the step under GitHub
  Actions' default `bash -e`).

---

## Round 7 — accuracy: no unverified data on the dashboard, ever; API-Football keyword fix; mobile back-button fix

Three separate fixes, requested together after football-data.org was
confirmed working in production (`fetched 16 scheduled matches` in a real
run — the first fully-verified live data this project produced).

### 1. Fixture accuracy — real data only, no simulated blending

Round 6's design filled any league with zero real fixtures using the
deterministic simulated generator, merged into the same `LIVE SYNC` output.
That was a reasonable "never show a blank dashboard" default, but it means
a user has no way to tell, from the dashboard alone, whether a given
fixture is real or synthetic — not acceptable once real data is flowing.

**Fixed:** `main()` no longer calls `generate_simulated_events()` as part
of the live path at all. Only fixtures actually returned by football-data.org
or API-Football are written to `data/fixtures.json`. A league with zero real
fixtures this run simply doesn't appear that day — it is not padded.
`meta.source` now reports exactly how many of the 15 tracked leagues had
live data this run (e.g. `"football-data.org (8/15 tracked leagues had live
data this run)"`), so coverage gaps are visible in the data itself, not
hidden behind a blanket LIVE SYNC badge.

Also: the direct SofaScore call and the Apify actor — neither of which has
ever produced a single real fixture in this project (confirmed: 403-blocked
from GitHub Actions' IPs, and tournament-metadata-not-fixtures respectively)
— are now **disabled by default**. They're still in the file (harmless to
keep, functions never delete useful reference code) but `main()` only calls
them if `ENABLE_EXPERIMENTAL_SOURCES=1` is explicitly set, and even then
only to fill leagues the two confirmed sources didn't cover. This directly
enforces "only confirmed working APIs may reach the dashboard."

Also: if literally every source fails on a given run, the script no longer
publishes anything (not an empty file, not a simulated one) — it leaves the
existing `data/fixtures.json` completely untouched and exits cleanly (`0`,
not an error — a genuinely fixture-less window is a real possibility, not a
bug). Verified: a run with all sources failing left a marker file
byte-for-byte identical to before the run.

### 2. API-Football keyword matching — 3 of 7 leagues failing to resolve

A real run showed South Africa, Saudi Arabia, and Türkiye all failing to
resolve a league id, plus zero fixtures for all 7 target leagues combined.
Root cause: the original resolver queried `/leagues?country={guessed
spelling}` — the same class of mistake as the Apify actor slug earlier,
just relocated. Guessing a provider's exact country-name spelling
("Türkiye" vs "Turkey" vs "Turkiye") is inherently fragile.

**Fixed:** resolution now searches by league **name** first (a few
distinctive candidate strings per league, e.g. "Jupiler Pro League",
"Jupiler", "Belgian Pro League"), then cross-checks using whatever country
name the API itself returns for that row against a loose, spelling-tolerant
keyword list (`"turk"` matches "Turkey", "Türkiye", "Turkiye" all at once).
Also normalizes hyphens/underscores in the API's own country string before
comparing (caught in testing: a mocked "South-Africa" response failed the
original plain-substring check). Verified against mocked responses
including the genuinely ambiguous case of "Premiership" being a valid name
in both Scotland and South Africa — the country cross-check correctly
disambiguates.

### 3. Mobile navigation — hardware/gesture back button exited the app

Reported: opening a fixture on a mobile phone (particularly as an installed
PWA) left no way back except closing and reopening the app. The drawer
already had a visible X button, but as an installed PWA there's often no
browser chrome at all, and — more importantly — the app never pushed a
browser history entry when opening a fixture, so the phone's hardware or
gesture back action had nothing to "undo" except exiting the app itself.

**Fixed:** opening a fixture (`openDrawer()`) now pushes a history entry;
a `popstate` listener closes the drawer when that entry is popped (by the
back button/gesture) instead of navigating away. The X button, backdrop
tap, and Escape key all now route through a single `closeDrawer()` that
unwinds the same history entry via `history.back()`, so every close path —
UI or hardware — stays consistent. Also added an explicit, labeled "← Back
to Fixtures" bar above the analysis panel header on mobile, since a small
icon-only button isn't necessarily obvious as the way back.

---

## Round 8 — four "safe to build" enhancements: edge detection, data quality labels, rationale snippets, API-Football predictions

Scoped deliberately to changes that need no new unverified external
dependency and no guessed schema — the pattern that caused every earlier
round of breakage in this project.

### 1. Edge / value-bet detection

`compute_edge()` (Python) / `computeEdge()` (JS, mirrors exactly) computes
`marketEdge = model_probability - implied_bookmaker_probability` against
the best available price across the three tracked books, flagging
`isValueBet` when the edge exceeds 2 percentage points. Added to every
prediction, not just the top pick. Frontend shows a pulsing green
`+X.X% EDGE` badge next to the confidence chip in the Model Verdict card
when the top pick is flagged.

**Known, important limitation:** this project's odds (`hollywoodbets`,
`betway`, `easybet`) are synthetically derived *from* the model's own
probability with a fixed margin — they are not independently-sourced real
market prices. Mathematically, that means the implied probability from
those odds is always slightly *higher* than the model's own probability
(that's what a bookmaker margin is), so `marketEdge` will almost always
compute negative and `isValueBet` will rarely if ever trigger in practice.
The computation itself is correct and tested — it's just waiting on a real,
independent odds feed to become meaningful. Wiring one in (API-Football has
an Odds endpoint on paid plans; a free alternative would need research) is
a natural next step, tracked separately rather than guessed at here.

### 2. Data-quality / volatility labels

Per the requested thresholds exactly: a league with fewer than 5 real
fixtures in a given run is labelled `LOW DATA QUALITY / HIGH RISK`; 10 or
more is labelled `HIGH DATA QUALITY / SYSTEM VERIFIED`; 5–9 gets no label
(neutral, as specified). Computed post-hoc in `main()` once the final
per-league fixture counts for the run are known, and mirrored in the
frontend's seed model so the demo experience shows the same UI. Verified
with a mock run: a league with 12 fixtures got the HIGH label, one with 1
fixture got the LOW label.

### 3. Automated rationale snippets

`generate_rationale()` builds a one-sentence, dynamically-generated
explanation of the model's top pick from the actual inputs that produced
it (xG, rating differential, form) — different templates for Goals O/U,
BTTS, Corners, and Match Winner/Double Chance/Draw No Bet outcomes, never a
canned per-fixture string. Mirrored in JS for the seed model. Displayed
below the Head-to-Head grid in the Deep AI Analysis panel, exactly where
requested.

### 4. API-Football predictions endpoint

`fetch_api_football_prediction()` calls the documented `/predictions`
endpoint (confirmed response shape via independent sources before writing
any code against it) for API-Football-sourced fixtures kicking off today,
attaching the external winner/advice/percent breakdown as
`fixture.externalModel` — shown as a small "External Model · API-Football"
comparison card, additive and never required for a fixture to display.

**Rate-limit budget, made explicit:** the free tier is 100 requests/day.
League-id resolution is cached (near-zero ongoing cost); fixtures lookups
cost ~7–14/run. That leaves limited headroom running every 4 hours (6
runs/day), so this is hard-capped at `MAX_EXTERNAL_PREDICTIONS = 8` fixtures
per run, scoped to today's fixtures only (not the full 5-day window) to
keep volume naturally bounded. Verified end-to-end with a mock: correct
fixture id queried, response parsed and attached correctly, and confirmed
the whole feature no-ops cleanly (no crash, no missing data elsewhere) when
API-Football isn't configured or a fixture has no matching external id.

---

## Round 9 — league-strength baseline, consensus index; team statistics endpoint excluded

Two more enhancements built, one deliberately excluded with the reasoning
below (per instruction: build whatever works 100%, exclude whatever can't
fully support the platform's functionality).

### Built: league-specific goal-scoring baseline

`refresh_league_baselines()` pulls recently FINISHED matches from
football-data.org (`status=FINISHED`, 45-day lookback) for the 8 leagues it
covers, computes each league's average total goals per match, and caches
the result to `data/league_baselines.json` — refreshed at most once every 7
days, since this is a long-run tendency, not something that needs
recomputing every 4-hour run. This uses the same documented endpoint and
token already relied on for fixtures, just a different status filter — not
a new unverified integration.

The resulting multiplier (clamped to 0.85–1.20 so a noisy sample can't
overcorrect) scales both teams' expected goals symmetrically in
`expected_goals()` — a league that's genuinely higher- or lower-scoring
than the ~2.6 goals/match reference now nudges every fixture in that league
accordingly, rather than treating all 15 leagues with the same baseline
assumption. The 7 API-Football-only leagues get a neutral 1.0 multiplier
(no adjustment) rather than a guessed value, since football-data.org
doesn't cover them and pulling equivalent history from API-Football would
cost meaningfully more of its tighter 100/day budget for a nice-to-have.

Verified: correct averaging, correct clamping at both ends of the range,
correct 1.0 fallback for unmapped leagues, and confirmed a second call
within the 7-day window makes zero additional API calls (full cache hit).

### Built: consensus index + Dual Model Verified

`compute_consensus()` blends this fixture's own Match Winner probabilities
(60%) with API-Football's external prediction (40%, when available —
i.e. only for the same small subset `externalModel` already covers),
re-normalizes to 100%, and sets `dualModelVerified` only when both the
internal model's favored side AND the blended consensus (at ≥55%
probability) agree with API-Football's own stated winner. Verified against
both an agreement case (flag correctly set) and a disagreement case (flag
correctly withheld even though the blended probability still leaned toward
the internal model's side, since the two models didn't actually agree).
Shown in the UI as a "✓ DUAL MODEL VERIFIED" badge plus the blended
home/draw/away breakdown, inside the existing External Model card.

### Excluded: team statistics endpoint (`/teams/statistics`)

Not built, deliberately. Two concrete reasons:

1. **Rate-limit math doesn't work.** This endpoint needs 2 calls per team
   (home + away) per fixture. Combined with the fixtures lookups (~7–14/run)
   and the predictions endpoint already capped at 8/run, adding even a
   modestly-capped statistics pass would push steady-state usage well past
   the free tier's 100 requests/day running every 4 hours — it would risk
   breaking the features already working, not just fail to add a new one.
2. **The stated use ("goals by minute... to support future live or in-play
   prediction features") is explicitly speculative** — there's no current
   feature that consumes minute-by-minute data. Building the integration
   now, before anything uses its output, is exactly the kind of
   unverified-and-unused complexity this project can't afford more of.

If in-play/live features become a real, scoped requirement later, this is
worth revisiting — ideally by dropping something else from the
API-Football call budget to make room, or on a paid plan with a higher
rate limit.

---

## Round 10 — football-data.org 429s from combined fixtures + baseline calls; API-Football diagnosability

A real run's log showed two things worth separating clearly.

### Bug: HTTP 429 on 5 of 8 baseline calls

```
[ndlela] WARN: league baseline fetch for BL1 returned HTTP 429
[ndlela] WARN: league baseline fetch for FL1 returned HTTP 429
[ndlela] WARN: league baseline fetch for DED returned HTTP 429
[ndlela] WARN: league baseline fetch for PPL returned HTTP 429
[ndlela] WARN: league baseline fetch for BSA returned HTTP 429
```

Root cause: the fixtures fetch (8 calls) and the baseline refresh (8 more
calls, introduced in Round 9) both hit football-data.org's 10-requests/minute
limit, but each paced *itself* independently with a flat `sleep(1)` — with
no shared awareness that the other function had already used most of the
same per-minute budget moments earlier. 16 calls at ~1s apart blew through
the limit partway into the second batch.

**Fixed:** replaced the scattered per-call sleeps with one shared,
module-level rate limiter (`_football_data_get()`) that every football-data.org
call site now goes through — it tracks actual call timestamps in a rolling
60-second window and proactively sleeps before making a call that would
exceed 9 calls/minute (one below the documented limit, as a safety margin),
regardless of which function is calling. Verified: simulating the exact
16-call combined sequence now correctly paces itself (sleeping ~61s at the
point the shared budget would otherwise be exceeded) instead of ever
hitting a 429.

**Also fixed, found while testing this:** a league with genuinely zero
finished matches (e.g. Premier League in the July off-season) was never
being cached, so it got silently re-fetched on *every single run* — wasting
call budget indefinitely on a result that wasn't going to change for weeks.
Insufficient-sample results are now cached too (with `avgGoals: null`), on
a 1-day retry cooldown rather than the full 7-day one used for a
successful average — frequent enough to notice when a season starts,
infrequent enough not to waste the budget every 4 hours. Verified: a second
call the same day now makes zero additional requests.

### Not a bug: API-Football's "0 fixtures across 7 target leagues"

The same log showed no per-league "could not resolve" warnings for any of
the 7 API-Football-tracked leagues — meaning the id-resolution fix from
Round 7 is very likely working correctly now. The most probable
explanation for zero fixtures across all 7 in a 5-day late-July window is
mundane: several of them (Jupiler Pro League, Scottish Premiership, Süper
Lig, Saudi Pro League) run August–May seasons and are genuinely in their
off-season right now.

Rather than leave that as an inference, `fetch_events_from_api_football()`
now logs each league's resolved id and fixture count explicitly:

```
[ndlela]   api-football: Jupiler Pro League resolved -> league id 9001
[ndlela]     0 fixture(s) for 2026-07-25..2026-07-30 (season=2026/2025 both empty)
```

The next real run's log will show definitively whether this is "resolved
correctly, genuinely no matches scheduled" (expected, not a bug) or
something else entirely (a resolution failure would print its own explicit
warning, as before).

---

## Round 11 — widened the fixture lookup window to 14 days

Requested to surface preseason friendlies and early-season fixtures
sooner, rather than waiting for them to fall inside the old 5-day window.

- `DAYS_AHEAD` (both the workflow's env var and the script's own fallback
  default) raised from 5 to 14. This is a single shared constant already
  used consistently by football-data.org, API-Football, and the (disabled
  by default) simulated fallback — no new code path, just a wider window on
  the existing one. Confirmed no documented date-range cap on
  football-data.org's `/matches` endpoint that this would run into (their
  own docs show a 6-month-range example working fine).
- The frontend's day-tab strip was only ever generating 7 tabs (Yesterday +
  Today + 5 days ahead), built once in `buildSeed()` and never widened
  based on how much real data actually arrived — meaning fixtures beyond
  day+5 would have been fetched into `fixtures.json` but had no tab to
  select them from, silently invisible in the UI. Widened to 15 tabs
  (Yesterday + Today + 13 ahead) to match. The tab strip was already
  horizontally scrollable (`overflow-x-auto snap-x`), so this doesn't
  break the layout — confirmed labels stay distinguishable even where a
  weekday name repeats across the two-week span, since each tab's date
  sub-label (e.g. "26 Jul" vs "02 Aug") disambiguates it regardless.

---

## Round 12 — the real root cause of poor predictions: fabricated team stats

Reported: predictions for real Brasileirão fixtures were badly wrong. This
is the most consequential fix in the project so far, and it exposes a gap
that should have been flagged much earlier.

### What was actually happening

`TEAM_RATINGS` — the dict every team's "rating" was looked up against —
only ever curated a small hand-picked list (~6 Brazilian clubs out of a
league with 20). **Any real team not in that list got a rating from
`68 + int(rand() * 20)` — a number with zero connection to that team's
actual performance.** Same for "form" (`W`/`D`/`L` sequence) and "xG for/
against" in `team_attributes()`: both entirely synthesized from a seeded
random function, not real results. This wasn't a bug that crept in — it
was the original design (from the very first version of this pipeline),
and it never got corrected even as real fixtures started flowing in from
football-data.org and API-Football. A real fixture between two actual
Brazilian clubs was, statistically, often a coin flip wearing a confidence
percentage.

### The fix: real standings data, not more hand-curation

Expanding the hardcoded dict further would just move the same problem to
whichever teams still weren't in it. Instead, `refresh_team_stats()` now
pulls real league standings — position, points, goals for/against, and
actual recent form — from the same two APIs already integrated:

- **football-data.org** (`/competitions/{code}/standings`) for its 8
  covered leagues, refreshed daily (no daily call cap on this API, only the
  10/min limit already handled by the shared rate limiter from Round 10).
- **API-Football** (`/standings`) for its 7 leagues, refreshed every 3 days
  to conserve the 100/day budget — and only for leagues that already have a
  resolved league id cached from the normal fixtures fetch, so this never
  spends an extra lookup call just to check standings.

For any team that appears in a real table, `team_rating()` now derives a
rating from real points-per-game and goal-difference-per-game; `form` is
the team's actual last-5 results string from the API (not synthesized);
`xgFor`/`xgAgainst` become real goals-scored/conceded-per-match averages
(a genuine statistical proxy, not true expected-goals data, but grounded in
real results rather than fabricated). A team not found in any standings
table (unmapped league, newly promoted with no matches played yet, or a
standings fetch that failed) falls back to the exact same heuristic as
before — nothing regresses, this is purely additive real-data-when-available.

Verified against the exact scenario reported: a mocked Brasileirão fixture
between a strong team (45 pts, +23 goal difference, W-W-D-W-L) and a weak
one (22 pts, -12 goal difference, L-L-D-L-W) now correctly produces a
lopsided prediction (95.7% Home-or-Draw) grounded in that real gap —
instead of two arbitrary random numbers that could have come out either way.

### An honest limit that doesn't go away

This makes the model's *inputs* real instead of fabricated — it does not,
and cannot, make football predictable. Even a genuinely well-calibrated
model built on real data will be wrong plenty of the time; that's the
nature of the sport, not a defect to be engineered away. The "probability"
and "confidence" figures throughout this app are statistical estimates, not
guarantees, and the existing "18+ · Play responsibly" note in the README
footer reflects that. This fix should make the numbers more honestly
grounded — it should not be read as a promise that outcomes will now go the
model's way more often.

---

## Round 13 — audit of all 15 leagues' season structures, before the new seasons start

Asked directly: check every tracked league for anything that could quietly
reproduce the Round 12 problem once real fixtures start flowing across the
board, not just Brasileirão. This surfaced one real, current bug (not a
future one) and two more that would have appeared later in the season.

### The bug: `/standings` returns a list of GROUPS, not one flat table

Checked every one of API-Football's 7 tracked leagues for unconventional
season formats:

- **MLS — always, every season.** Split into Eastern and Western
  Conferences from the start; confirmed via multiple independent sources.
  The standings response returns two separate group arrays.
- **Belgian Pro League (Jupiler Pro League) — after ~matchday 30.** Splits
  into three groups: Championship Playoffs, Europe Playoffs, Relegation
  Playoffs (confirmed via Sportmonks' own glossary and match reports).
- **Scottish Premiership — after 33 games.** Splits into top-six /
  bottom-six groups (confirmed via BBC Sport and league explainer sources).

`_refresh_team_stats_api_football()`'s standings parser read only
`groups[0]` — the first group returned. For MLS that's one whole
conference silently missing, every single day of the season. For Belgium
and Scotland, it's fine before the split and silently drops 2/3 or half the
league right after it. Every team in the missing group(s) would have
quietly fallen back to the pre-Round-12 fabricated/random rating — the
exact problem just fixed, reappearing for these specific leagues without
any error or warning.

**Fixed generally, not per-league:** rather than special-case each known
quirk, the parser now flattens *every* group in the response
(`[row for group in groups for row in group]`) before processing. This
covers all three confirmed cases uniformly, and any other grouped-standings
format this project hasn't specifically identified — a single-group league
flattens to exactly the same result as before (verified: Saudi Pro League
mock, 1 group, unchanged output), so there's no regression for the normal
case, only a fix for the grouped one (verified: mocked MLS's two
conferences, both now correctly present in `team_stats` where only the
first used to appear).

### Checked and confirmed fine: football-data.org's 8 leagues

Premier League, LaLiga, Serie A, Bundesliga, Ligue 1, Eredivisie, Liga
Portugal, and Brasileirão are all conventional single round-robin top
flights with no mid-season split or conference format — this class of bug
doesn't apply to them. `_refresh_team_stats_football_data()`'s existing
`type == "TOTAL"` table selection already correctly picks the one relevant
table for a non-split league; no change was needed there.

### Checked and believed fine, flagged for awareness: Liga MX, Saudi Pro League, Süper Lig, Betway Premiership

No unconventional group/conference standings format found for these four
in the same research pass. Liga MX's Apertura/Clausura structure is worth
noting specifically: the *regular season* table for each half-year
tournament is a single flat table (no conference split) — the Liguilla
play-off that follows is a knockout bracket, not a standings table, so it
doesn't interact with this code path at all. Since the fix now flattens
groups generically rather than assuming one specific league's format, even
if one of these four turns out to have a grouped format this research
missed, the code handles it correctly without needing a further patch.

### Not affected by this class of bug: fixtures and league-baseline fetching

Checked both other data paths that also call these APIs: the `/fixtures`
endpoint returns a flat list of matches regardless of conference/group (no
grouping concept applies to a fixture list), and
`refresh_league_baselines()` counts goals across finished matches directly
rather than reading a standings table — neither has the failure mode this
round addressed.

---

## Round 14 — full re-audit: "confirm the app won't guess like it did before"

A direct, fair ask after Round 12/13's fixes. Rather than just reassure,
re-audited every remaining place a number could reach the dashboard without
being real, and closed what was still open.

### Removed: two fully dead code paths

`generate_simulated_events()` and `_simulated_raw_to_fields()` — the
simulated-fixture generator from the pre-Round-7 design — were still sitting
in the file, fully defined, but confirmed (via `grep` for every call site)
to never be invoked anywhere in the current pipeline. Harmless as dead code,
but leaving them in place meant "does this ever run?" required reading the
whole file to answer with confidence rather than being self-evidently no.
Deleted both, along with `LEAGUE_TEAMS` (the per-league roster dict that
only existed to feed them). `TEAM_RATINGS` was kept — it's still legitimately
used as the fallback described below.

### Closed: the fallback path was invisible when it fired

`team_rating()`/`team_attributes()` still have — and always will have — a
fallback for a team with no real standings data (brand new to the league,
zero games played yet this season, or a standings fetch that failed that
specific day). That fallback can't be eliminated in principle: a team with
zero real results this season has no real recent form to draw from. What
*was* missing was any signal distinguishing a fallback-driven fixture from
a real-data one — they looked identically confident on the dashboard.

Fixed: every team dict now carries an explicit `"statsSource": "real"` or
`"fallback"`. `main()`'s data-quality labelling now escalates to
`LOW DATA QUALITY / HIGH RISK` whenever *either* team in a fixture used the
fallback — overriding the league-fixture-count signal from Round 8, not
just adding to it — so a fixture can no longer look identical to a
real-data one by having a low `dataQuality` for the wrong reason (or none
at all). Verified: a mocked fixture with one real team and one fallback
team correctly showed `LOW DATA QUALITY` even though its league had plenty
of other fixtures that run; a mock with all-fallback teams in a
high-volume league showed the same. The claim "not guessing anymore" is now
checkable per fixture (`home.statsSource` / `away.statsSource` in the raw
JSON), not just a general assurance.

### Found and disclosed, not yet fixed: head-to-head data is still synthetic

`head_to_head()` — the "last 5 meetings" block and H/D/A win counts shown
in the H2H panel — has never used real historical results between the two
specific teams in any fixture, real or not. This is a genuine, current gap,
separate from the team-rating fix above.

A real fix exists and was verified: API-Football has a documented
`/fixtures/headtohead?h2h={teamIdA}-{teamIdB}&last=5` endpoint returning
actual historical meetings. It wasn't wired in this round because it needs
two things not yet in place — capturing each team's numeric API-Football id
(currently only names are captured) — and a deliberate call-budget design,
since applying it per-fixture rather than per-run would risk the same
100/day pressure the predictions endpoint already competes for. Treating
this the same way the team-statistics endpoint was treated in Round 9:
scoped out as a separate, deliberate follow-up rather than rushed in
alongside everything else in this pass.

In the meantime, this gap is now disclosed rather than hidden:
`head_to_head()` returns an explicit `"h2hSource": "synthetic"` on every
fixture, propagated through the frontend's `normalizeH2H()` (live data) and
`buildH2H()` (seed model) unchanged. The H2H panel header already read
"Head-to-head *(estimated)*" in the UI — confirmed this label is accurate
and kept it.

### Where this leaves things, stated plainly

As of this round: **team ratings, form, and xG are real for any team
currently in a standings table across all 15 leagues** (Round 12 fixed the
data, Round 13 fixed a bug that would've silently dropped several leagues'
worth of teams back to fabricated numbers, this round made the remaining
fallback case visible instead of invisible). **Head-to-head history is
still a modelled estimate, not real past results, for every fixture** —
disclosed in both the data and the UI, with a concrete path to fix it
identified but not yet built.

---

## Round 15 — third season-label fallback for API-Football fixtures

Reported: Scottish Premiership and Betway Premiership (South Africa), both
confirmed opening 1 August 2026, weren't showing on the dashboard despite
being well within the 14-day lookup window.

Two possible causes were identified before any code change: (a) the data
provider simply hadn't published these leagues' fixture lists yet (plausible
— smaller leagues don't have the same broadcast-deal pressure to lock in a
full schedule months ahead the way the "big five" do), or (b) a
season-label mismatch, since the fixtures fetch only tried the current year
and the previous year, never the *next* year.

Fixed regardless of which turns out to be the actual cause here: added a
third attempt at `now.year + 1`, covering providers that label a season
spanning two calendar years (e.g. Aug 2026–May 2027) by its *end* year
rather than its start year. Verified both outcomes explicitly: a mocked
season labelled by end-year is now correctly found on the third attempt
(previously would have been silently missed forever), and a genuinely
unpublished league still reports cleanly as empty across all three labels
tried, with the exact seasons attempted shown in the log
(`season=2026/2025/2027 all empty`) rather than a bare failure.

This doesn't yet confirm which of the two causes applies to the reported
leagues specifically — that requires the actual production log, requested
and pending at time of writing.

---

## Round 16 — git push race condition on the commit step

A run failed at "Commit and push updated fixtures.json" with:

```
! [rejected]        main -> main (fetch first)
error: failed to push some refs
hint: Updates were rejected because the remote contains work that you do
not have locally.
```

Not a pipeline bug — a checkout/push race. The job checks out the repo at
the start, does its (sometimes multi-minute, given the rate-limit pacing
from Round 10) work, then tries to push at the end. If anything else
lands a commit on `main` in that window — most likely a manual file
upload happening around the same time as a run — the remote has moved on
and a plain `git push` gets rejected as a non-fast-forward.

**Fixed:** `git pull --rebase origin main` right before the push. Since
this job only ever commits auto-generated `data/*.json` files (never
source code), replaying its own data-refresh commit on top of whatever
else landed on `main` is always safe — there's no meaningful merge
conflict to worry about. Also added `data/league_baselines.json` and
`data/team_stats.json` to the files this step commits — both were
introduced in Rounds 9 and 12 respectively but never added to the git-add
list, so they were being regenerated locally every run without ever being
persisted back to the repo.

---

## Round 17 — 5 new continental competitions; API-Football rate-limit gap

### Added: UEFA Champions/Europa/Conference League, CAF Champions League, CAF Confederation Cup

Explicitly declined integrating the scraper/arbitrage-bot repos requested
alongside this (see the conversation for the full reasoning — unauthorized
access to bookmaker platforms, and "dynamically sync arbitrary external
repos into a live pipeline" as an architecture regardless of content). The
tournament list itself was legitimate and fully achievable on the existing
two verified APIs:

- **UEFA Champions League** — already in football-data.org's free tier
  (`CL` competition code, confirmed back in this project's initial
  football-data.org integration) — just hadn't been wired in yet.
- **Europa League, Conference League, CAF Champions League, CAF
  Confederation Cup** — added to API-Football's target list. Couldn't
  confirm API-Football's exact country-tagging convention for continental
  competitions in research (candidates like "World" seen elsewhere, none
  confirmed) — rather than guess, the resolver now supports
  `country_keywords: None` for these entries, requiring a close match
  against the fully-qualified competition name itself instead of a country
  cross-check. Verified this correctly disambiguates even when a
  same-family competition (e.g. "CAF Champions League" vs. "CAF
  Confederation Cup") appears in the same API response — picks the right
  one every time in testing, not just whichever came first.

### Fixed: API-Football had no rate-limit protection on 4 of its 5 endpoints

Reported: API-Football showing empty even for leagues that should have
started. Investigating found the actual mechanism: `/leagues` (id
resolution), `/predictions`, and both `/standings` calls had **zero pacing
or 429 handling** — only `/fixtures` did. Adding 5 more competitions
increases the burst of `/leagues` calls fired in one run with no protection
between them, which can trip a per-minute limit and cascade into failures
across leagues that would otherwise have resolved fine that run — not
necessarily (or not only) an off-season data-availability issue as
originally suspected.

**Fixed:** built one shared, module-level throttle (`_api_football_get()`),
the same pattern already proven for football-data.org in Round 10, and
routed all five endpoints through it — no direct `requests.get()` calls to
API-Football remain anywhere in the file. Verified by simulating an
11-target burst (7 domestic + 4 continental leagues all needing resolution
in one run, the realistic first-run-after-this-update scenario): correctly
paces itself with proactive sleeps instead of firing unprotected. Worth
knowing: this means the very first run after deploying this update could
take noticeably longer (potentially 10-15 minutes) while it resolves all
11 API-Football targets for the first time — one-time cost, since results
are cached afterward.

This doesn't rule out the original off-season/not-yet-published
possibility for the specific leagues reported empty — but it closes a real
gap that could independently cause the same symptom, and makes the two
causes distinguishable in the log going forward (a paced run reaching a
clean "0 fixtures" after resolving correctly means genuinely no data yet;
repeated 429s would have meant the rate limit, now fixed).

---

## Round 18 — the actual reason Brasileirão and live Champions League matches vanished

Reported: leagues that were previously showing real data (Brasileirão
specifically) went to zero, and Champions League matches visibly in
progress (per a screenshot of a competing site) weren't appearing at all.
Checked whether Brazil's season had a real gap first (it had paused for
the 2026 World Cup, but confirmed via multiple sources it resumed 16-22
July — well before this was reported, so a seasonal explanation didn't fit
the timeline).

### The actual bug: `status=SCHEDULED` excludes almost everything within a 2-week window

Confirmed via football-data.org's own documentation and their creator's
blog: **`SCHEDULED` and `TIMED` are two distinct pre-match statuses.** A
fixture starts as `SCHEDULED` (a rough date is known) and moves to `TIMED`
once the exact kickoff time is confirmed — which, per the API's own
documentation, typically happens *weeks* before matchday for most
competitions. `fetch_events_from_football_data()` was requesting
`status=SCHEDULED` only, which silently excluded every match that had
already been timed — in practice, nearly everything inside a 14-day
lookahead window, since by then almost all fixtures have progressed past
the rough-date stage. This explains both reported symptoms at once: an
active league going quiet (its next round's matches were already `TIMED`,
not `SCHEDULED`), and in-progress Champions League matches not appearing
(`IN_PLAY` was excluded the same way `TIMED` was).

**Fixed:** removed the server-side status filter entirely. The fetch now
pulls every match in the date range and excludes only genuinely dead
statuses client-side (`FINISHED`, `POSTPONED`, `SUSPENDED`, `CANCELED`),
keeping `SCHEDULED`, `TIMED`, `IN_PLAY`, and `PAUSED`. Verified with a
mock reproducing the exact reported scenario — a `TIMED` and an `IN_PLAY`
match, previously both silently dropped, are now correctly included, while
a genuinely `FINISHED` match in the same batch is still correctly excluded
(so a played match never shows up with a prediction attached, which would
be its own kind of wrong).

### Same audit applied to API-Football, found and fixed the mirror issue

API-Football's `/fixtures` endpoint has no server-side status filter at
all (unlike football-data.org, which had one that was too narrow) — so it
was returning finished matches unfiltered within the date range, which
would display with a live prediction attached despite the match already
having a real result. Added the equivalent client-side exclusion using
API-Football's own documented status codes (`FT`, `AET`, `PEN`, `PST`,
`CANC`, `ABD`, `AWD`, `WO` excluded; `NS`, in-progress, and suspended
codes kept). Verified the same way: a finished (`FT`) fixture is now
correctly dropped from a batch that also includes a not-started (`NS`) and
an in-progress (`1H`) one.

Every fixture's raw match status (`matchStatus`) is now also carried
through to the final JSON output — not used for anything in the UI yet,
but available for a future "live" badge without needing another round of
plumbing to add it.
















