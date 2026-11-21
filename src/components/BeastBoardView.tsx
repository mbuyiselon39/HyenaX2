import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';

const TeamMiniLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => {
  const [failed, setFailed] = useState(false);
  if (!logo || failed) {
    return (
      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[9px] flex items-center justify-center font-bold text-slate-200 shrink-0">
        {name.substring(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={logo}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="w-5 h-5 object-contain shrink-0"
    />
  );
};

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
        matchDate: f.matchDate || (f.kickoff ? f.kickoff.split('T')[0] : ''),
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
      <div className="rounded-2xl border border-[#00E5FF]/30 bg-gradient-to-r from-[#0C1222] via-[#0E131F] to-[#0D1829] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#00E5FF] text-[#041118]">
              Beast Engine
            </span>
            <span className="text-xs text-[#00E5FF] font-semibold">
              Algorithmic +EV &amp; Value Opportunities
            </span>
          </div>
          <h1 className="text-2xl font-display font-black text-white">
            The Beast Board
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live sorting of high-conviction mathematical opportunities, evaluating Bivariate Poisson goal dependency, Fair Odds, and Sharp Market consensus.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-200 focus:outline-none focus:border-[#00E5FF]/50"
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
            className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-200 focus:outline-none focus:border-[#00E5FF]/50"
          >
            <option value="beastScore">Sort by Beast Score</option>
            <option value="ev">Sort by Expected Value (+EV)</option>
            <option value="prob">Sort by Win Probability</option>
            <option value="trust">Sort by Trust Score</option>
            <option value="odds">Sort by Market Odds</option>
          </select>
        </div>
      </div>

      {/* Empty State or Grid */}
      {filteredPicks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <Zap className="w-10 h-10 text-[#00E5FF] mx-auto opacity-75" />
          <h3 className="text-base font-bold text-white">No Picks Match Active Filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Relax the +EV or Volatility threshold to display qualified algorithmic opportunities across scheduled fixtures.
          </p>
          <button
            onClick={() => {
              setFilterType('all');
              setSortBy('beastScore');
            }}
            className="px-4 py-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPicks.map((pick, idx) => {
            const isAccaAdded = accumulatorLegs.some(
              l => l.matchId === pick.matchId && l.selection === pick.selection
            );

            return (
              <div
                key={pick.matchId}
                onClick={() => {
                  setSelectedMatchId(pick.matchId);
                  setDrawerOpen(true);
                }}
                className="glass-card rounded-2xl bg-[#0E131F] p-4 flex flex-col justify-between gap-4 cursor-pointer hover:bg-[#121929] transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b border-[#222E46]/60 pb-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-display font-black text-xs text-[#00E5FF] shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-bold truncate">
                      {pick.league.flag} {pick.league.name}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-num bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 shrink-0">
                    SCORE {pick.beastScore}
                  </span>
                </div>

                {/* Match Names with Crests & Date */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <TeamMiniLogo logo={pick.home.logo} name={pick.home.name} />
                    <span className="font-display font-bold text-sm text-white truncate">
                      {pick.home.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TeamMiniLogo logo={pick.away.logo} name={pick.away.name} />
                    <span className="font-display font-bold text-sm text-slate-300 truncate">
                      vs {pick.away.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-num pt-0.5">
                    {pick.matchDate ? `${pick.matchDate} · ` : ''}{pick.kickoff}
                  </div>
                </div>

                {/* Market Box */}
                <div className="p-3 rounded-xl border border-[#222E46] bg-[#0A0E17] space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    {pick.market}
                  </div>
                  <div className="font-display font-black text-xs text-[#00E5FF] truncate">
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
                    <div className={`font-bold font-num ${pick.expectedValuePct > 0 ? 'text-[#00E5FF]' : 'text-slate-400'}`}>
                      {pick.expectedValuePct > 0 ? `+${pick.expectedValuePct}%` : `${pick.expectedValuePct}%`}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Trust</div>
                    <div className="font-bold font-num text-cyan-400">{pick.trustScore}/100</div>
                  </div>
                </div>

                {/* Mind Changer Alert */}
                <div className="text-[10px] text-slate-400 bg-[#00E5FF]/5 border border-[#00E5FF]/15 p-2 rounded-xl leading-relaxed">
                  <span className="text-[#00E5FF] font-bold block mb-0.5">⚡ Recalibration Trigger:</span>
                  {pick.mindChanger}
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAccaAdded) {
                      addAccaLeg({
                        id: `acca-${pick.matchId}-${String(pick.selection || 'pick').replace(/\s+/g, '_')}`,
                        matchId: pick.matchId,
                        fixture: pick.fixture,
                        league: pick.league.name,
                        selection: String(pick.selection || 'Home'),
                        market: String(pick.market || 'Match Winner'),
                        probability: pick.calibratedProb,
                        odds: pick.marketOdds
                      });
                    }
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-display font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isAccaAdded
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20'
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
      )}
    </div>
  );
};
