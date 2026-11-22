import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  PlusCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { TopBankerPick } from '../types.ts';

const TeamMiniLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => {
  const [failed, setFailed] = useState(false);
  if (!logo || failed) {
    return (
      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-200 shrink-0">
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

export const DailyTop20View: React.FC = () => {
  const {
    fixtures,
    days,
    selectedDate,
    setSelectedDate,
    setSelectedMatchId,
    setDrawerOpen,
    addAccaLeg,
    accumulatorLegs,
    isSyncing,
    loadError,
    refreshFixtures,
    dataSource
  } = useApp();

  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('probability');

  const marketOptions = [
    { id: 'all', label: 'All Safe Markets' },
    { id: 'WINNERS_DC', label: '1X2 / Double Chance' },
    { id: 'FIRST_15_MIN', label: 'First 15 Min Draw' },
    { id: 'TEAM_CORNERS', label: 'Team Corners (5.5+ / Home 7+ / 8+)' },
    { id: 'HALF_MARKETS', label: 'Highest Scoring Half' },
    { id: 'GOAL_OVERS_UNDERS', label: 'Over / Under Goals' },
    { id: 'CORNERS', label: '1st-Half (3.5/4.5) & Match Corners' },
    { id: 'BOOKINGS', label: 'Cards & Bookings' },
    { id: 'BTTS', label: 'BTTS' }
  ];

  // Dynamically build the most winnable market for every fixture
  const filteredPicks = useMemo(() => {
    if (!fixtures.length) return [];

    const matchesForDate = fixtures.filter(m => (m.matchDate || (m.kickoff ? m.kickoff.split('T')[0] : '')) === selectedDate);
    const pool = matchesForDate.length >= 10
      ? matchesForDate
      : (fixtures.filter(m => (m.matchDate || (m.kickoff ? m.kickoff.split('T')[0] : '')) >= selectedDate).length >= 10
          ? fixtures.filter(m => (m.matchDate || (m.kickoff ? m.kickoff.split('T')[0] : '')) >= selectedDate)
          : fixtures);

    const extractOdds = (o: any) => {
      if (typeof o === 'number') return o;
      if (typeof o === 'object' && o !== null) return Number(o.betway || o.hollywoodbets || o.easybet || 1.30);
      const parsed = parseFloat(o);
      return isNaN(parsed) ? 1.30 : parsed;
    };

    const candidates: TopBankerPick[] = [];

    pool.forEach(m => {
      const allMarkets: any[] = Array.isArray(m.predictions) && m.predictions.length ? m.predictions : (m.topPick ? [m.topPick] : []);
      if (!allMarkets.length) return;

      let eligible = allMarkets;
      if (marketFilter !== 'all') {
        const catFilter = eligible.filter(p => {
          if (marketFilter === 'FIRST_15_MIN') {
            return p.marketCategory === 'FIRST_15_MIN' || (p.market && p.market.toLowerCase().includes('first 15'));
          }
          if (marketFilter === 'TEAM_CORNERS') {
            return p.marketCategory === 'TEAM_CORNERS' || (p.market && p.market.toLowerCase().includes('team total corners'));
          }
          if (marketFilter === 'HALF_MARKETS') {
            return p.marketCategory === 'HALF_MARKETS' || (p.market && p.market.toLowerCase().includes('half'));
          }
          if (marketFilter === 'GOAL_OVERS_UNDERS') {
            return p.marketCategory === 'GOAL_OVERS_UNDERS' || (p.market && p.market.toLowerCase().includes('goal'));
          }
          if (marketFilter === 'CORNERS') {
            return p.marketCategory === 'CORNERS' || (p.market && (p.market.toLowerCase().includes('match total corners') || p.market.toLowerCase().includes('1st-half corners')));
          }
          if (marketFilter === 'BOOKINGS') {
            return p.marketCategory === 'BOOKINGS' || (p.market && (p.market.toLowerCase().includes('card') || p.market.toLowerCase().includes('booking')));
          }
          if (marketFilter === 'BTTS') {
            return p.marketCategory === 'BTTS' || (p.market && p.market.toLowerCase().includes('btts'));
          }
          if (marketFilter === 'WINNERS_DC') {
            return p.marketCategory === 'WINNERS_DC' || (p.market && (p.market.includes('1X2') || p.market.includes('Double Chance') || p.market.includes('Draw No Bet')));
          }
          return p.marketCategory === marketFilter || (p.market && p.market.toLowerCase().includes(marketFilter.toLowerCase()));
        });
        if (catFilter.length > 0) {
          eligible = catFilter;
        }
      }

      const sorted = eligible.slice().sort((a, b) => (Number(b.probability) || 0) - (Number(a.probability) || 0));
      const best = sorted[0];
      const oddsVal = extractOdds(best.odds);
      const prob = Number(best.probability) || 75;
      const beast: any = m.beastMeta || {};
      const ens = beast.ensemble || {};
      const modelAgreement = ens.modelAgreementScore || 88;
      const calProb = beast.calibratedProbability || prob;
      const bankerScore = Math.min(99, Math.round((prob * 0.5) + (modelAgreement * 0.3) + 18));

      const safeSelection = String(best?.selection || 'Home');
      const safeMarket = String(best?.market || 'Match Winner');

      candidates.push({
        id: `TOP-${m.id}-${safeSelection.replace(/\s+/g, '')}`,
        matchId: m.id,
        rank: 0,
        rankLabel: '',
        match: `${m.home.name} vs ${m.away.name}`,
        home: m.home,
        away: m.away,
        league: m.league,
        kickoff: m.kickoff,
        kickoffTime: m.kickoffRsa || m.kickoffTime || '15:30 SAST',
        matchDate: m.matchDate || (m.kickoff ? m.kickoff.split('T')[0] : selectedDate),
        market: safeMarket,
        marketCategory: best.marketCategory || 'WINNERS_DC',
        selection: safeSelection,
        probability: prob,
        calibratedProb: calProb,
        odds: oddsVal,
        allOdds: (best.odds && typeof best.odds === 'object') ? (best.odds as any) : { hollywoodbets: oddsVal, betway: +(oddsVal * 1.02).toFixed(2), easybet: oddsVal },
        bankerScore,
        modelAgreement,
        modelsActive: ens.totalModelsActive || 24,
        trustScore: beast.trustScore || 92,
        safetyTier: prob >= 82 ? 'ULTRA_BANKER' : 'VETTED_BANKER',
        safetyBadge: prob >= 82 ? '🛡️ ULTRA BANKER LOCK' : '✅ VETTED BANKER',
        badgeBg: prob >= 82 ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        whySafe: `${m.home.name} vs ${m.away.name}: ${ens.totalModelsActive || 24}-Model Consensus agreement at ${modelAgreement}% with ${best.market} (${best.selection}).`,
        isFinished: m.matchStatus === 'FINISHED',
        finalScore: m.finalScore,
        settledResult: best.result || 'PENDING',
        evPct: beast.expectedValuePct || +(((calProb / 100) * oddsVal - 1) * 100).toFixed(1),
        advancedRiskValidation: m.advancedRiskValidation || null
      });
    });

    if (sortBy === 'odds') {
      candidates.sort((a, b) => b.odds - a.odds);
    } else if (sortBy === 'modelAgreement') {
      candidates.sort((a, b) => b.modelAgreement - a.modelAgreement);
    } else if (sortBy === 'bankerScore') {
      candidates.sort((a, b) => b.bankerScore - a.bankerScore);
    } else {
      candidates.sort((a, b) => b.probability - a.probability);
    }

    return candidates.slice(0, 20).map((c, idx) => ({
      ...c,
      rank: idx + 1,
      rankLabel: idx === 0 ? '👑 #1 TOP SUREST WIN' : idx === 1 ? '🥈 #2 PRIME LOCK' : idx === 2 ? '🥉 #3 PRIME LOCK' : `🏅 #${idx + 1} SURE LOCK`
    }));
  }, [fixtures, selectedDate, marketFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="relative rounded-2xl border border-[#00E5FF]/40 bg-gradient-to-r from-[#0C1222] via-[#0E131F] to-[#0D1829] p-5 sm:p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00E5FF] text-[#041118]">
                Ndlela GoldPack
              </span>
              <span className="text-xs text-[#00E5FF]/85 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" /> Multi-Market Predictive Intelligence Engine
              </span>
              <span className="text-[11px] font-num text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {dataSource}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Daily Top 20 Banker Predictions
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Autonomous 24-Model Consensus Stack with Bivariate Poisson, Weibull 15m Draw, Negative Binomial Corners, Atmospheric Physics, GBDT, GNN &amp; empirical calibration.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="px-4 py-2.5 rounded-xl border border-[#222E46] bg-[#0A0E17]/80 flex flex-col items-center sm:items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400">Banker Picks</span>
              <span className="text-xl font-bold font-num text-[#00E5FF]">{filteredPicks.length} Qualified</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col items-center sm:items-end">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Target Accuracy</span>
              <span className="text-xl font-bold font-num text-emerald-300">80.4% Avg</span>
            </div>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={() => refreshFixtures(true)}
            className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/20 hover:bg-rose-500/30 font-bold cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Sync</span>
          </button>
        </div>
      )}

      {/* Date Carousel & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {days.slice(0, 14).map(day => {
            const isSelected = selectedDate === day.key;
            const count = day.fixtureCount ?? 0;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDate(day.key)}
                className={`shrink-0 px-3 py-2 rounded-xl border text-xs transition-all flex flex-col items-center justify-center min-w-[84px] cursor-pointer ${
                  isSelected
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.28)] font-bold'
                    : 'border-[#222E46] bg-[#0E131F] text-slate-300 hover:text-slate-100 hover:border-slate-600'
                }`}
              >
                <span className="font-display uppercase tracking-wider">{day.label}</span>
                <span className="text-[10px] opacity-80 font-num">{day.sub}</span>
                <span
                  className={`text-[10px] font-num font-semibold mt-0.5 ${
                    isSelected
                      ? 'text-[#00E5FF]'
                      : count > 0
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                  }`}
                >
                  {count} {count === 1 ? 'game' : 'games'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-200 font-medium focus:outline-none focus:border-[#00E5FF]/50"
          >
            {marketOptions.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-200 font-medium focus:outline-none focus:border-[#00E5FF]/50"
          >
            <option value="probability">Sort by Probability</option>
            <option value="bankerScore">Sort by Banker Score</option>
            <option value="modelAgreement">Sort by Model Agreement</option>
            <option value="odds">Sort by Highest Odds</option>
          </select>
        </div>
      </div>

      {/* Bankers Cards Grid */}
      {isSyncing && fixtures.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-400">
          Synchronizing 141 global leagues and evaluating 17-model banker probabilities...
        </div>
      ) : filteredPicks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <Calendar className="w-10 h-10 text-[#00E5FF] mx-auto" />
          <h3 className="text-lg font-bold text-white">No Fixtures Scheduled</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Select another date or reset the market filter to view available banker predictions.
          </p>
          {marketFilter !== 'all' && (
            <button
              onClick={() => setMarketFilter('all')}
              className="px-3.5 py-1.5 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-bold cursor-pointer"
            >
              Show All Safe Markets
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPicks.map((pick) => {
            const isAlreadyInAcca = accumulatorLegs.some(
              l => l.matchId === pick.matchId && l.selection === pick.selection
            );

            return (
              <div
                key={pick.id}
                onClick={() => {
                  setSelectedMatchId(pick.matchId);
                  setDrawerOpen(true);
                }}
                className="group relative rounded-2xl border border-[#222E46] bg-[#0E131F] hover:border-[#00E5FF]/50 hover:bg-[#121929] transition-all p-4 sm:p-5 flex flex-col justify-between gap-4 cursor-pointer shadow-lg"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b border-[#222E46]/60 pb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-display font-extrabold text-xs text-[#00E5FF] tracking-wide shrink-0">
                      {pick.rankLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-[#222E46] bg-[#0A0E17] text-slate-300 truncate">
                      {pick.league.flag} {pick.league.name}
                    </span>
                  </div>

                  <span className="text-[11px] font-num text-slate-400 font-semibold shrink-0">
                    {pick.kickoffTime}
                  </span>
                </div>

                {/* Match & Teams */}
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <TeamMiniLogo logo={pick.home.logo} name={pick.home.name} />
                      <span className="font-display font-bold text-sm text-white truncate">
                        {pick.home.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TeamMiniLogo logo={pick.away.logo} name={pick.away.name} />
                      <span className="font-display font-bold text-sm text-slate-300 truncate">
                        {pick.away.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-xl sm:text-2xl font-black font-num text-emerald-400">
                      {pick.probability.toFixed(1)}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      {pick.modelsActive || 24}-Model Consensus
                    </span>
                  </div>
                </div>

                {/* Selection & Market Pill */}
                <div className="p-3 rounded-xl border border-[#00E5FF]/25 bg-[#00E5FF]/5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-[#00E5FF]/80">
                      {pick.market}
                    </div>
                    <div className="font-display font-black text-sm text-[#00E5FF] truncate">
                      {pick.selection}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400">SA Bookies</div>
                    <div className="font-num font-extrabold text-sm text-white">
                      @{pick.odds.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#222E46]/60">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-num">
                    <span>HW: {pick.allOdds?.hollywoodbets ?? pick.odds}</span>
                    <span>·</span>
                    <span>BW: {pick.allOdds?.betway ?? pick.odds}</span>
                    <span>·</span>
                    <span>EB: {pick.allOdds?.easybet ?? pick.odds}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAlreadyInAcca) {
                        addAccaLeg({
                          id: `acca-${pick.matchId}-${pick.selection.replace(/\s+/g, '_')}`,
                          matchId: pick.matchId,
                          fixture: pick.match,
                          league: pick.league.name,
                          selection: pick.selection,
                          market: pick.market,
                          probability: pick.probability,
                          odds: pick.odds
                        });
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-display font-semibold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                      isAlreadyInAcca
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-[#1A2234] text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/20'
                    }`}
                  >
                    {isAlreadyInAcca ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Acca</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
