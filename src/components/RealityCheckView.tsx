import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign,
  Info
} from 'lucide-react';

export const RealityCheckView: React.FC = () => {
  const [legs, setLegs] = useState<number>(5);
  const [avgProb, setAvgProb] = useState<number>(80);
  const [avgOdds, setAvgOdds] = useState<number>(1.45);
  const [openBlindspot, setOpenBlindspot] = useState<number | null>(0);

  // Accumulator Ruin Math
  const p = Math.max(0.1, Math.min(0.99, avgProb / 100));
  const n = Math.max(1, Math.min(15, legs));
  const rOdds = Math.max(1.05, Math.min(10.0, avgOdds));
  const winProb = Math.pow(p, n);
  const bustProb = Math.max(0, 1 - winProb);
  const compoundOdds = Math.pow(rOdds, n);
  const fairOdds = winProb > 0 ? 1 / winProb : 999;
  const houseVigPct = Math.max(0, ((fairOdds - compoundOdds) / fairOdds) * 100);

  const blindspots = [
    {
      title: '1. The Compound House Vig Trap in Accumulators',
      summary: 'Why 10 legs at 1.25 is mathematically lethal to your bankroll.',
      body: 'Every time you add a leg to an accumulator, you multiply not just the odds, but also the bookmaker’s profit margin. An individual 1.25 pick might carry a 5% margin, but a 10-leg slip compounds this house advantage to over 40%, guaranteeing long-term negative expectation regardless of how "safe" the names seem.'
    },
    {
      title: '2. The Fallacy of "Sure Wins" in Domestic Derbies',
      summary: 'Why local rivalries break statistical expected goals models.',
      body: 'In rivalry matches (like Kaizer Chiefs vs Orlando Pirates, or Arsenal vs Tottenham), adrenaline and crowd psychology distort standard form metrics. Red cards increase by 240%, fouls rise by 35%, and favorites fail to cover their opening lines 28% more often than in neutral domestic games.'
    },
    {
      title: '3. Layer 18: The 72-Hour UEFA & Travel Hangover',
      summary: 'Midweek European travel creates silent weekend rotation shocks.',
      body: 'Teams returning from long midweek flights (over 800 km) experience measurable neuromuscular fatigue. When top clubs face domestic underdogs within 72 hours of a Champions League clash, managers frequently rotate key creators, suppressing attacking output by an average of -0.38 xG.'
    },
    {
      title: '4. The Loss-Chasing Gambler’s Ruin Spiral',
      summary: 'Martingale and doubling down after losses guarantee mathematical liquidation.',
      body: 'Doubling stake sizes after consecutive losses guarantees account ruin when encountering inevitable 4-to-6 loss clusters. HyenaX enforces strict Quarter-Kelly sizing with an automatic 50% defensive stake reduction after 3 consecutive losses.'
    },
    {
      title: '5. Bookmaker Trap Lines & Opening Price Drift',
      summary: 'Recognizing when retail bookies intentionally price public favorites too generously.',
      body: 'When a heavy public favorite (e.g., Real Madrid at home) is priced at 1.70 when Poisson models indicate 1.45, retail bettors rush to back it. Frequently, bookmaker risk desks know key starters are benched before public lineups drop. HyenaX freezes bets if opening lines drift more than ±1.5% in the final 4 hours.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-[#1F0A0D] to-[#0E131F] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white">
            Anti-Loss Shield
          </span>
          <span className="text-xs text-rose-300 font-semibold">
            Responsible Quantitative Staking & Ruin Prevention
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Reality Check & Ruin Calculator
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Expose the hidden mathematical traps that bookmakers use to wipe out casual accumulators, and simulate your true bankruptcy probabilities.
        </p>
      </div>

      {/* Ruin Simulator Card */}
      <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-5">
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Interactive Accumulator Ruin Simulator</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Slider 1: Legs */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Ticket Legs:</span>
              <span className="font-bold font-num text-amber-300">{legs} Legs</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={legs}
              onChange={(e) => setLegs(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Average Leg Probability */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Avg Leg Win Probability:</span>
              <span className="font-bold font-num text-amber-300">{avgProb}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={avgProb}
              onChange={(e) => setAvgProb(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Slider 3: Average Leg Odds */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Avg Leg Retail Odds:</span>
              <span className="font-bold font-num text-amber-300">@{avgOdds.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.15"
              max="2.50"
              step="0.05"
              value={avgOdds}
              onChange={(e) => setAvgOdds(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Compound Odds</div>
            <div className="text-xl font-black font-num text-white">@{compoundOdds.toFixed(2)}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 text-center space-y-1">
            <div className="text-[10px] text-rose-400 uppercase font-bold">Ticket Failure Probability</div>
            <div className="text-xl font-black font-num text-rose-400">{(bustProb * 100).toFixed(1)}%</div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-1">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">True Win Probability</div>
            <div className="text-xl font-black font-num text-emerald-300">{(winProb * 100).toFixed(1)}%</div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-center space-y-1">
            <div className="text-[10px] text-amber-400 uppercase font-bold">Compound House Margin</div>
            <div className="text-xl font-black font-num text-amber-300">+{houseVigPct.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* 5 Blindspots Accordions */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
          5 Critical Sports Betting Blindspots
        </h3>

        {blindspots.map((item, index) => {
          const isOpen = openBlindspot === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-[#222E46] bg-[#0E131F] overflow-hidden"
            >
              <button
                onClick={() => setOpenBlindspot(isOpen ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#121929] transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-display font-bold text-sm text-white">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.summary}</div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 pt-1 border-t border-[#222E46]/50 text-xs text-slate-300 leading-relaxed bg-[#0A0E17]/60">
                  {item.body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
