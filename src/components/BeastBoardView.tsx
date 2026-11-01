import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Zap,
  TrendingUp,
  ShieldAlert,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const BeastBoardView: React.FC = () => {
  const {
    fixtures,
    setSelectedMatchId,
    setDrawerOpen,
    addAccaLeg,
    accumulatorLegs
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('beastScore');

  const candidates = useMemo(() => {
    return fixtures.map(f => {
      const top = f.topPick || (f.predictions && f.predictions[0]);
      if (!top) return null;

      const pRaw = Number(top.probability) || 75;
      const bMeta: any = f.beastMeta || {};
      const calProb = bMeta.calibratedProbability || pRaw;
      const odds = top.odds ? (typeof top.odds === 'object' ? Number(top.odds.betway || top.odds.hollywoodbets || 1.35) : Number(top.odds)) : 1.35;
      const fairOdds = +(100 / calProb).toFixed(2);
      const evPct = bMeta.expectedValuePct !== undefined ? bMeta.expectedValuePct : +(((calProb / 100) * odds - 1) * 100).toFixed(1);
      const trustScore = bMeta.trustScore || Math.min(99, Math.round(85 + (calProb - 70) * 0.4));
      const beastScore = bMeta.beastScore || +((calProb * 0.42) + (Math.max(0, evPct) * 2.3) + (f.isBig ? 12 : 8)).toFixed(1);
      const volatility = f.isBig ? 'LOW' : 'MEDIUM';

      return {
        matchId: f.id,
        fixture: `${f.home.name} vs ${f.away.name}`,
        home: f.home,
        away: f.away,
        league: f.league,
        kickoff: f.kickoffRsa || f.kickoffTime || '15:30 SAST',
        market: top.market,
        selection: top.selection,
        rawProb: pRaw,
        calibratedProb: calProb,
        fairOdds,
        marketOdds: odds,
        minAcceptableOdds: +(fairOdds * 1.02).toFixed(2),
        expectedValuePct: evPct,
        trustScore,
        volatility,
        beastScore,
        rationale: f.rationale || `Dixon-Coles bivariate goal distribution projects a ${calProb}% true win probability.`,
        mindChanger: `A key striker scratch, sudden 5-man low block rotation, or market drift beyond ${(fairOdds * 1.02).toFixed(2)} triggers model recalibration.`
      };
    }).filter(Boolean) as any[];
  }, [fixtures]);

  const filteredPicks = useMemo(() => {
    let list = [...candidates];
    if (filterType === 'elite') list = list.filter(p => p.beastScore >= 70 || p.expectedValuePct >= 6.0);
    else if (filterType === 'value') list = list.filter(p => p.expectedValuePct >= 2.0);
    else if (filterType === 'high_trust') list = list.filter(p => p.trustScore >= 88);
    else if (filterType === 'low_vol') list = list.filter(p => p.volatility === 'LOW');

    if (sortBy === 'beastScore') list.sort((a, b) => b.beastScore - a.beastScore);
    else if (sortBy === 'ev') list.sort((a, b) => b.expectedValuePct - a.expectedValuePct);
    else if (sortBy === 'prob') list.sort((a, b) => b.calibratedProb - a.calibratedProb);
    else if (sortBy === 'trust') list.sort((a, b) => b.trustScore - a.trustScore);
    else if (sortBy === 'odds') list.sort((a, b) => b.marketOdds - a.marketOdds);

    return list.slice(0, 30);
  }, [candidates, filterType, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#17130A] to-[#0E131F] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-black">
              Beast Engine
            </span>
            <span className="text-xs text-amber-300 font-semibold">
              Algorithmic +EV & Value Opportunities
            </span>
          </div>
          <h1 className="text-2xl font-display font-black text-white">
            The Beast Board
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live sorting of high-conviction mathematical opportunities, evaluating Bivariate Poisson goal dependency, Fair Odds, and Sharp Market consensus.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Opportunities</option>
            <option value="elite">Elite Value (Score ≥ 70)</option>
            <option value="value">Positive Value (+EV ≥ 2%)</option>
            <option value="high_trust">High Trust (≥ 88)</option>
            <option value="low_vol">Low Volatility Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-200 focus:outline-none"
          >
            <option value="beastScore">Sort by Beast Score</option>
            <option value="ev">Sort by Expected Value (+EV)</option>
            <option value="prob">Sort by Win Probability</option>
            <option value="trust">Sort by Trust Score</option>
            <option value="odds">Sort by Market Odds</option>
          </select>
        </div>
      </div>

      {/* Grid of Beast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPicks.map((pick, idx) => {
          const isAccaAdded = accumulatorLegs.some(l => l.matchId === pick.matchId);

          return (
            <div
              key={pick.matchId}
              onClick={() => {
                setSelectedMatchId(pick.matchId);
                setDrawerOpen(true);
              }}
              className="gold-border-card rounded-2xl bg-[#0E131F] p-4 flex flex-col justify-between gap-4 cursor-pointer hover:bg-[#121929] transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b border-[#222E46]/60 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-xs text-amber-400">
                    #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-bold">
                    {pick.league.flag} {pick.league.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-num bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    SCORE {pick.beastScore}
                  </span>
                </div>
              </div>

              {/* Match Names */}
              <div>
                <div className="font-display font-bold text-sm text-white truncate">
                  {pick.home.name}
                </div>
                <div className="font-display font-bold text-sm text-slate-300 truncate">
                  vs {pick.away.name}
                </div>
                <div className="text-[10px] text-slate-400 font-num mt-1">
                  {pick.kickoff}
                </div>
              </div>

              {/* Market Box */}
              <div className="p-3 rounded-xl border border-[#222E46] bg-[#0A0E17] space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {pick.market}
                </div>
                <div className="font-display font-black text-xs text-amber-300 truncate">
                  {pick.selection}
                </div>
                <div className="flex items-center justify-between text-[11px] font-num pt-1 border-t border-[#222E46]/50">
                  <span className="text-slate-400">Market Odds: <strong className="text-white">@{pick.marketOdds.toFixed(2)}</strong></span>
                  <span className="text-slate-400">Fair: <strong className="text-emerald-400">@{pick.fairOdds.toFixed(2)}</strong></span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] p-2 rounded-xl bg-[#141C2E]">
                <div>
                  <div className="text-slate-400">True Prob</div>
                  <div className="font-bold font-num text-emerald-400">{pick.calibratedProb.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Edge (+EV)</div>
                  <div className={`font-bold font-num ${pick.expectedValuePct > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {pick.expectedValuePct > 0 ? `+${pick.expectedValuePct}%` : `${pick.expectedValuePct}%`}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Trust</div>
                  <div className="font-bold font-num text-cyan-400">{pick.trustScore}/100</div>
                </div>
              </div>

              {/* Mind Changer Alert */}
              <div className="text-[10px] text-slate-400 bg-amber-500/5 border border-amber-500/15 p-2 rounded-xl leading-relaxed">
                <span className="text-amber-300 font-bold block mb-0.5">⚡ Recalibration Trigger:</span>
                {pick.mindChanger}
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAccaAdded) {
                    addAccaLeg({
                      id: `acca-${pick.matchId}`,
                      matchId: pick.matchId,
                      fixture: pick.fixture,
                      league: pick.league.name,
                      selection: pick.selection,
                      market: pick.market,
                      probability: pick.calibratedProb,
                      odds: pick.marketOdds
                    });
                  }
                }}
                className={`w-full py-2 rounded-xl text-xs font-display font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isAccaAdded
                    ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                    : 'border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                }`}
              >
                {isAccaAdded ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Added to Acca</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add to Accumulator Studio</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
