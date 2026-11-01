import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Lock,
  ArrowUpDown
} from 'lucide-react';
import { TopBankerPick } from '../types.ts';

export const DailyTop20View: React.FC = () => {
  const {
    dailyTop20Picks,
    days,
    selectedDate,
    setSelectedDate,
    setSelectedMatchId,
    setDrawerOpen,
    addAccaLeg,
    accumulatorLegs
  } = useApp();

  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('probability');
  const [showDisqualified, setShowDisqualified] = useState<boolean>(false);

  const marketOptions = [
    { id: 'all', label: 'All Safe Markets' },
    { id: 'WINNERS_DC', label: '1X2 / Double Chance' },
    { id: 'HALF_MARKETS', label: 'Highest Scoring Half' },
    { id: 'GOAL_OVERS_UNDERS', label: 'Over / Under Goals' },
    { id: 'CORNERS', label: 'Corners' },
    { id: 'BOOKINGS', label: 'Cards & Bookings' },
    { id: 'BTTS', label: 'BTTS' },
  ];

  const filteredPicks = useMemo(() => {
    let list = dailyTop20Picks;
    if (marketFilter !== 'all') {
      list = list.filter(p => {
        if (marketFilter === 'HALF_MARKETS') {
          return p.marketCategory === 'HALF_MARKETS' || (p.market && p.market.toLowerCase().includes('half'));
        }
        return p.marketCategory === marketFilter || (p.market && p.market.toLowerCase().includes(marketFilter.toLowerCase()));
      });
    }
    const sorted = [...list];
    if (sortBy === 'odds') {
      sorted.sort((a, b) => b.odds - a.odds);
    } else if (sortBy === 'modelAgreement') {
      sorted.sort((a, b) => b.modelAgreement - a.modelAgreement);
    } else if (sortBy === 'bankerScore') {
      sorted.sort((a, b) => b.bankerScore - a.bankerScore);
    } else {
      sorted.sort((a, b) => b.probability - a.probability);
    }
    return sorted;
  }, [dailyTop20Picks, marketFilter, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Top Hero Banner: Strict Vetting Directive */}
      <div className="relative rounded-2xl border border-amber-500/40 bg-gradient-to-r from-[#17130A] via-[#0E131F] to-[#0A121A] p-5 sm:p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black">
                Zero-Risk Protocol
              </span>
              <span className="text-xs text-amber-300/80 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" /> Mandatory ≥78.5% Threshold Floor Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Daily Top 20 Banker Predictions
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Autonomous 17-Model Consensus Stack with Layer 18 Calendar Fatigue & Rotation Dampeners. Every candidate must strictly surpass empirical calibration, Shin de-vigged fair price utility, and zero-derby risk filters.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="px-4 py-2.5 rounded-xl border border-[#222E46] bg-[#0A0E17]/80 flex flex-col items-center sm:items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400">Vetted Picks</span>
              <span className="text-xl font-bold font-num text-amber-400">{filteredPicks.length} Qualified</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col items-center sm:items-end">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Target Accuracy</span>
              <span className="text-xl font-bold font-num text-emerald-300">80.4% Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Carousel & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Date Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {days.slice(0, 7).map(day => {
            const isSelected = selectedDate === day.key;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDate(day.key)}
                className={`shrink-0 px-3 py-2 rounded-xl border text-xs transition-all flex flex-col items-center min-w-[76px] cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/20 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)] font-bold'
                    : 'border-[#222E46] bg-[#0E131F] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <span className="font-display uppercase tracking-wider">{day.label}</span>
                <span className="text-[10px] opacity-80 font-num">{day.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-200 font-medium focus:outline-none focus:border-amber-500/50"
          >
            {marketOptions.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-200 font-medium focus:outline-none focus:border-amber-500/50"
          >
            <option value="probability">Sort by Probability</option>
            <option value="bankerScore">Sort by Banker Score</option>
            <option value="modelAgreement">Sort by Model Agreement</option>
            <option value="odds">Sort by Highest Odds</option>
          </select>
        </div>
      </div>

      {/* Bankers Cards Grid */}
      {filteredPicks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Fixtures Qualified Under Strict Directive</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Our strict zero-guessing filter rejected matches with win probabilities under 78.5% or excessive schedule congestion to preserve bankroll safety.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPicks.map((pick) => {
            const isAlreadyInAcca = accumulatorLegs.some(l => l.matchId === pick.matchId && l.selection === pick.selection);

            return (
              <div
                key={pick.id}
                onClick={() => {
                  setSelectedMatchId(pick.matchId);
                  setDrawerOpen(true);
                }}
                className="group relative rounded-2xl border border-[#222E46] bg-[#0E131F] hover:border-amber-500/50 hover:bg-[#121929] transition-all p-4 sm:p-5 flex flex-col justify-between gap-4 cursor-pointer shadow-lg"
              >
                {/* Header: Rank + League + Time */}
                <div className="flex items-center justify-between gap-2 border-b border-[#222E46]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-xs text-amber-400 tracking-wide">
                      {pick.rankLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-[#222E46] bg-[#0A0E17] text-slate-300">
                      {pick.league.flag} {pick.league.name}
                    </span>
                  </div>

                  <span className="text-[11px] font-num text-slate-400 font-semibold">
                    {pick.kickoffTime}
                  </span>
                </div>

                {/* Match & Teams */}
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {pick.home.logo ? (
                        <img src={pick.home.logo} alt="" className="w-5 h-5 object-contain" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold">
                          {pick.home.name.substring(0, 2)}
                        </div>
                      )}
                      <span className="font-display font-bold text-sm text-white truncate">
                        {pick.home.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {pick.away.logo ? (
                        <img src={pick.away.logo} alt="" className="w-5 h-5 object-contain" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold">
                          {pick.away.name.substring(0, 2)}
                        </div>
                      )}
                      <span className="font-display font-bold text-sm text-slate-300 truncate">
                        {pick.away.name}
                      </span>
                    </div>
                  </div>

                  {/* Probability Ring / Badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-xl sm:text-2xl font-black font-num text-emerald-400">
                      {pick.probability.toFixed(1)}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      17-Model Consensus
                    </span>
                  </div>
                </div>

                {/* Selection & Market Pill */}
                <div className="p-3 rounded-xl border border-amber-500/25 bg-amber-500/5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-amber-400/80">
                      {pick.market}
                    </div>
                    <div className="font-display font-black text-sm text-amber-200 truncate">
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

                {/* Footer: Multi-Odds + Model Agreement + Add to Acca + 20-Layer Button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#222E46]/60">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-num">
                    <span>HW: {pick.allOdds?.hollywoodbets || pick.odds}</span>
                    <span>·</span>
                    <span>BW: {pick.allOdds?.betway || pick.odds}</span>
                    <span>·</span>
                    <span>EB: {pick.allOdds?.easybet || pick.odds}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAlreadyInAcca) {
                          addAccaLeg({
                            id: `acca-${pick.matchId}`,
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-display font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                        isAlreadyInAcca
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-[#1A2234] text-amber-300 border border-amber-500/40 hover:bg-amber-500/20'
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
