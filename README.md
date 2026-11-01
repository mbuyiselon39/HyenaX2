# HyenaX - The Ndlela Millionaires GoldPack

**Predictive Football Intelligence & Quantitative Risk Engine** rewritten as a high-performance **React + TypeScript + Vite** application with an Express mathematical model backend.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │   React 19 + TypeScript + Vite SPA           │
                      │   Tailwind CSS v4 Dark Sports-Analytics UI   │
                      └──────────────────────┬───────────────────────┘
                                             │ HTTP / JSON
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │   Express 4 Server Engine (server.ts)        │
                      │   (Port 3000 on 0.0.0.0 with Vite Middleware)│
                      └──────┬────────────────┬──────────────────────┘
                             │                │
            ┌────────────────┴─────┐   ┌──────┴─────────────────────┐
            │ Mathematical Models  │   │ External & AI Integrations │
            │ - Dixon-Coles (1997) │   │ - @google/genai SDK        │
            │ - 17-Model Consensus │   │ - Google Search Grounding  │
            │ - 64-Step Shin DeVig │   │ - Google Maps Venues       │
            │ - Layer 18 Fatigue   │   │ - 12-Site Syndicate Engine │
            │ - Fractional Kelly   │   │ - Scrapers & Live Ingest   │
            └──────────────────────┘   └────────────────────────────┘
```

---

## Core Features Preserved

1. **⭐ Daily Top 20 Surest Wins**:
   - Zero-Risk Protocol with mandatory &ge;78.5% win threshold floor.
   - 17-Model Unified Consensus Stack (GBDT, GNNs, LSTMs, Transformers, Bradley-Terry, Bivariate Poisson).
   - Strict No-Go Filters: excludes high-risk local derbies, rotation hangovers, and trap lines.
   - Retail odds comparison across South African bookmakers: **Hollywoodbets**, **Betway**, and **EasyBet**.

2. **⚽ Live & Upcoming Fixtures**:
   - Covers 141+ global men's and women's competitions in South African Standard Time (SAST, UTC+2).
   - Dynamic calendar day selector (Yesterday, Today, Tomorrow, Upcoming).
   - Instant search, competition filters, and marquee matchup toggles.

3. **🦁 The Beast Board**:
   - Ranked +EV value opportunities sorted by Beast Score, Expected Value (+EV), True Win Probability, and Trust Index.
   - Dynamic "What Would Change Our Mind" conditions to warn about lineup and weather shocks.

4. **📋 Accumulator Studio & Optimizer**:
   - Multi-leg ticket builder with live mathematical survival probability ($\prod P_i$).
   - Exposes hidden bookmaker compound vig margins ($+14\%$ to $+40\%$).
   - Automatic **Weakest Link** detection: isolates the highest failure-risk leg and shows the probability boost gained by removing it.

5. **🔬 Bet Slip Code X-Ray**:
   - Optical and booking code parser for Hollywoodbets (`HW-...`), Betway (`BW-...`), EasyBet (`EB-...`), and raw text slips.
   - Deconstructs individual match legs and audits independent win probability vs bookmaker overround.

6. **🧪 Statistical Validation Suite**:
   - **Walk-Forward Validation**: 6 chronological folds with certified zero future data leakage.
   - **Closing Line Value (CLV)**: Benchmarking against Pinnacle and Betfair exchanges (+4.79% average margin).
   - **Dynamic Stress Testing**: Interactive Monte Carlo noise simulation with perturbation rounds and base probability sliders.
   - **64-Step Shin De-Vigging**: Numerical routine removing multi-bookmaker vig.
   - **Data Sources Health**: Ingestion monitoring for UnderStat, WhoScored, Transfermarkt, SofaScore, SoccerWiki, and Google Discovery.

7. **🛡️ Reality Check & Ruin Calculator**:
   - Interactive accumulator ruin simulator calculating mathematical bankruptcy rates.
   - 5 Critical Sports Betting Blindspots with detailed explanations.

8. **🤖 HyenaX Beast AI Oracle**:
   - Grounded multi-turn conversational football strategist using the `@google/genai` TypeScript SDK.
   - Supports **Google Search Grounding** (live breaking news/lineups) and **Google Maps Grounding** (stadium location and travel fatigue).
   - Model switching between `gemini-3.8-flash`, `gemini-3.1-flash-lite`, and `gemini-3.1-pro-preview`.

9. **💰 Bankroll Risk Manager**:
   - Fractional Kelly staking engine (Quarter-Kelly $\chi=0.25$, Half-Kelly $\chi=0.50$, Eighth-Kelly $\chi=0.125$).
   - Automatic loss-chasing defense: 50% stake curtailment after 3+ consecutive losses.
   - Immutable, pre-kickoff prediction ledger.

---

## Development & Build

```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Run TypeScript lint check
npm run lint

# Build production assets
npm run build

# Start production server
npm start
```
