import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  Calculator,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

export const AccaStudioView: React.FC = () => {
  const {
    accumulatorLegs,
    removeAccaLeg,
    clearAccaLegs,
    accumulatorAnalysis,
    addToast
  } = useApp();

  const [stakeZAR, setStakeZAR] = useState<number>(100);
  const [activePreset, setActivePreset] = useState<'full' | 'best3' | 'best5'>('full');

  // Compute ticket metrics
  const legs = accumulatorLegs;
  let compoundOdds = 1.0;
  let compoundTrueProb = 1.0;

  legs.forEach(l => {
    compoundOdds *= (l.odds || 1.25);
    compoundTrueProb *= ((l.probability || 75) / 100);
  });

  const impliedProb = compoundOdds > 1 ? (1 / compoundOdds) : 1;
  const houseVigPct = Math.max(0, ((impliedProb - compoundTrueProb) / impliedProb) * 100);
  const trueProbPct = +(compoundTrueProb * 100).toFixed(1);
  const payoutZAR = +(stakeZAR * compoundOdds).toFixed(2);
  const profitZAR = +(payoutZAR - stakeZAR).toFixed(2);

  // Weakest link
  const weakestLink = legs.length > 0
    ? legs.reduce((min, cur) => cur.probability < min.probability ? cur : min, legs[0])
    : null;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#17130A] via-[#0E131F] to-[#0D1829] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-black">
                Survival Engine
              </span>
              <span className="text-xs text-amber-300 font-semibold">
                True Independent Probability & Vig Breakdown
              </span>
            </div>
            <h1 className="text-2xl font-display font-black text-white">
              Accumulator Studio & Optimizer
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Unlike bookmakers who multiply odds without showing true compound survival rates, HyenaX calculates the actual mathematical survival probability and isolates your weakest link.
            </p>
          </div>

          {legs.length > 0 && (
            <button
              onClick={clearAccaLegs}
              className="px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 self-start cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Ticket ({legs.length})</span>
            </button>
          )}
        </div>
      </div>

      {legs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <Layers className="w-12 h-12 text-amber-400 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-white">Your Accumulator Ticket is Empty</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Browse Daily Top 20, Beast Board, or Fixtures and click "Add Acca" to test any combinations with true mathematical failure-rate modeling.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Ticket Legs List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>Selected Match Legs</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-black font-extrabold font-num">
                  {legs.length}
                </span>
              </h2>

              <span className="text-xs text-slate-400">
                Click trash icon to remove any leg
              </span>
            </div>

            <div className="space-y-3">
              {legs.map((leg, index) => {
                const isWeakest = weakestLink?.id === leg.id && legs.length > 2;

                return (
                  <div
                    key={leg.id}
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-4 transition-all ${
                      isWeakest
                        ? 'border-rose-500/60 bg-rose-950/20 shadow-rose-950/20'
                        : 'border-[#222E46] bg-[#0E131F] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-[11px] font-num font-bold flex items-center justify-center text-slate-300 shrink-0">
                        {index + 1}
                      </span>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-white truncate">
                            {leg.fixture}
                          </span>
                          {isWeakest && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500 text-white shrink-0 animate-pulse">
                              Weakest Link
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-amber-400 font-semibold">{leg.market}:</span>
                          <span className="text-slate-200 font-bold">{leg.selection}</span>
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {leg.league}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-black font-num text-white">
                          @{leg.odds.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-num text-emerald-400 font-bold">
                          {leg.probability.toFixed(1)}% True Prob
                        </div>
                      </div>

                      <button
                        onClick={() => removeAccaLeg(leg.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove leg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weakest Link Warning Box */}
            {weakestLink && legs.length > 2 && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/5 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-rose-300">
                    Weakest Link Optimization Alert
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    Leg #{legs.findIndex(l => l.id === weakestLink.id) + 1} (<strong>{weakestLink.fixture} - {weakestLink.selection}</strong>) carries the lowest single survival probability ({weakestLink.probability}%). Removing this single leg increases whole-ticket survival from <strong>{trueProbPct}%</strong> to <strong>{+(compoundTrueProb / (weakestLink.probability / 100) * 100).toFixed(1)}%</strong>.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Mathematical Ticket Summary */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-500/40 bg-[#0E131F] p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#222E46] pb-3">
                <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Ticket Intelligence</span>
                </h3>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 font-num">
                  {legs.length} SELECTIONS
                </span>
              </div>

              {/* Core Multiplier Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Combined Odds</span>
                  <span className="font-display font-black text-xl text-amber-300 font-num">
                    @{compoundOdds.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">True Survival Probability</span>
                  <span className={`font-num font-bold text-sm ${trueProbPct > 50 ? 'text-emerald-400' : trueProbPct > 25 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {trueProbPct}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Bookmaker Implied Odds</span>
                  <span className="font-num text-xs text-slate-300">
                    {+(impliedProb * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Hidden Compound Vig</span>
                  <span className="font-num font-bold text-xs text-rose-400">
                    +{houseVigPct.toFixed(1)}% Margin
                  </span>
                </div>
              </div>

              {/* Interactive Stake Slider */}
              <div className="pt-3 border-t border-[#222E46] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Stake Amount</span>
                  <span className="font-display font-bold text-white font-num">
                    R {stakeZAR}
                  </span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={stakeZAR}
                  onChange={(e) => setStakeZAR(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-num">
                  <span>R20</span>
                  <span>R250</span>
                  <span>R500</span>
                  <span>R1000</span>
                </div>
              </div>

              {/* Estimated Payout Box */}
              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-1 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-400">
                  Potential Estimated Payout
                </div>
                <div className="font-display font-black text-2xl text-emerald-300 font-num">
                  R {payoutZAR.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-num">
                  Net Profit: +R {profitZAR.toLocaleString()}
                </div>
              </div>

              {/* Fractional Kelly Recommendation */}
              <div className="text-[11px] text-slate-400 bg-[#080A0F] p-3 rounded-xl border border-[#222E46] space-y-1">
                <span className="font-bold text-amber-300 block">🛡️ Risk Protocol Stake Limit:</span>
                Never stake more than 3% of your active bankroll on multi-leg tickets with survival probabilities below 40%.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
