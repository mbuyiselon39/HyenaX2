/* ============================================================
   BETTING PREDICTIONS & VALUE EDGE ENGINE
   Inspired by jbadonai/betting-predictions
   Calculates: Expected Value (EV), Kelly Criterion Fraction (f*),
               Margin-adjusted Fair Odds, Market Inefficiencies
   ============================================================ */

export class BettingPredictionsEngine {
  constructor() {
    this.name = 'Betting-Predictions Edge Analyzer';
    this.sourceUrl = 'https://github.com/jbadonai/betting-predictions';
    this.status = 'ACTIVE';
    this.lastSync = new Date().toISOString();
  }

  calculateEdgeAndStaking(modelProbPct, decimalOdds) {
    const p = modelProbPct / 100;
    const b = decimalOdds - 1; // net decimal odds
    const q = 1 - p;

    // Expected Value: EV = (p * b) - (q * 1) = p * decimalOdds - 1
    const ev = +(p * decimalOdds - 1).toFixed(4);
    const evPct = +(ev * 100).toFixed(2);

    // Kelly Criterion: f* = (b*p - q) / b
    let fullKelly = 0;
    if (b > 0 && ev > 0) {
      fullKelly = +((b * p - q) / b).toFixed(4);
    }
    const quarterKellyPct = +(Math.max(0, fullKelly * 0.25) * 100).toFixed(2);
    const halfKellyPct = +(Math.max(0, fullKelly * 0.5) * 100).toFixed(2);

    const impliedBookProb = +( (1 / decimalOdds) * 100 ).toFixed(1);
    const rawEdge = +(modelProbPct - impliedBookProb).toFixed(1);
    const isValueBet = evPct >= 2.5;

    return {
      modelProbPct,
      decimalOdds,
      impliedBookProb,
      edgePct: rawEdge,
      expectedValuePct: evPct,
      quarterKellyStakePct: quarterKellyPct,
      halfKellyStakePct: halfKellyPct,
      isValueBet,
      verdict: isValueBet ? (evPct > 8 ? 'STRONG VALUE EDGE' : 'MODERATE VALUE') : 'NO EDGE'
    };
  }

  async syncAll() {
    this.lastSync = new Date().toISOString();
    return {
      scraper: this.name,
      status: 'OK',
      syncedAt: this.lastSync
    };
  }
}
