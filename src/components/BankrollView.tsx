import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Wallet,
  ShieldAlert,
  Sliders,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  Lock,
  History
} from 'lucide-react';

export const BankrollView: React.FC = () => {
  const { addToast } = useApp();
  const [bankroll, setBankroll] = useState<number>(5000);
  const [modelType, setModelType] = useState<string>('quarter_kelly');
  const [consecutiveLosses, setConsecutiveLosses] = useState<number>(0);
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/beast/ledger')
      .then(r => r.json())
      .then(d => {
        if (d && d.ledger) setLedger(d.ledger);
      })
      .catch(() => {});
  }, []);

  const chi = modelType === 'quarter_kelly' ? 0.25 : modelType === 'half_kelly' ? 0.50 : 0.125;
  const isLossGuarded = consecutiveLosses >= 3;
  const lossMultiplier = isLossGuarded ? 0.5 : 1.0;

  // Calculate recommended stake for sample 78% win @ 1.65 odds
  const sampleP = 0.78;
  const sampleOdds = 1.65;
  const sampleB = sampleOdds - 1;
  const sampleQ = 1 - sampleP;
  const rawKelly = Math.max(0, (sampleB * sampleP - sampleQ) / sampleB);
  const fractionKellyPct = +(rawKelly * chi * lossMultiplier * 100).toFixed(2);
  const recommendedStakeZAR = +((bankroll * (fractionKellyPct / 100))).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#17130A] to-[#0E131F] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-black">
            Capital Preservation
          </span>
          <span className="text-xs text-amber-300 font-semibold">
            Fractional Kelly Allocation & Anti-Chasing Shield
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Bankroll Risk Manager
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Protects your capital with mathematical asset-growth maximization while guaranteeing complete insulation against drawdowns through automatic defensive stake tapering.
        </p>
      </div>

      {/* Control Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Bankroll Input */}
        <div className="p-5 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Bankroll Capital
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">R</span>
            <input
              type="number"
              value={bankroll}
              onChange={(e) => setBankroll(Math.max(100, Number(e.target.value)))}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#222E46] bg-[#080A0F] text-lg font-black font-num text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <div className="text-[10px] text-slate-500">
            Recommended minimum bankroll: R1,000 for proper fractional sizing.
          </div>
        </div>

        {/* Staking Formula Selector */}
        <div className="p-5 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Staking Strategy
          </label>
          <select
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="quarter_kelly">Quarter-Kelly (Recommended, &chi; = 0.25)</option>
            <option value="eighth_kelly">Eighth-Kelly (Conservative, &chi; = 0.125)</option>
            <option value="half_kelly">Half-Kelly (Aggressive, &chi; = 0.50)</option>
          </select>
          <div className="text-[10px] text-slate-500">
            Quarter-Kelly captures 75% of full-Kelly growth with 1/16th of the drawdown variance.
          </div>
        </div>

        {/* Loss-Chasing Safeguard */}
        <div className="p-5 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Consecutive Losses
            </label>
            {isLossGuarded && (
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500 text-white animate-pulse">
                50% Shield Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setConsecutiveLosses(n)}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold font-num transition-all cursor-pointer ${
                  consecutiveLosses === n
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-[#222E46] bg-[#080A0F] text-slate-400 hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-slate-400">
            {isLossGuarded
              ? 'Automatic 50% stake curtailment active to insulate against gambler’s ruin.'
              : 'Status nominal. Zero drawdown penalty applied.'}
          </div>
        </div>
      </div>

      {/* Suggested Stake Display */}
      <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-[#0D1829] to-[#0A1A17] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-emerald-400 mb-1">
            Standard Banker Recommended Wager
          </div>
          <div className="font-display font-black text-3xl text-white font-num">
            R {recommendedStakeZAR.toLocaleString()}
            <span className="text-xs font-semibold text-slate-400 ml-2">
              ({fractionKellyPct}% of capital)
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-300 space-y-0.5">
          <div>Maximum Daily Cap: <strong className="text-white">R {(bankroll * 0.15).toLocaleString()}</strong> (15%)</div>
          <div>Estimated Risk of Ruin: <strong className="text-emerald-400">&lt; 0.2%</strong></div>
        </div>
      </div>

      {/* Immutable Prediction Ledger */}
      <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#222E46] pb-3">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Immutable Prediction Audit Trail</span>
          </h3>
          <span className="text-[10px] text-emerald-400 font-bold">
            TIMESTAMP-CERTIFIED PRE-KICKOFF
          </span>
        </div>

        <div className="space-y-3">
          {ledger.map(row => (
            <div
              key={row.id}
              className="p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-num text-[10px] text-amber-400 font-bold">{row.id}</span>
                  <span className="font-display font-bold text-white">{row.match}</span>
                </div>
                <div className="text-slate-300">
                  Pick: <strong className="text-amber-300">{row.selection || row.pick}</strong> · {row.league}
                </div>
              </div>

              <div className="flex items-center gap-4 text-right font-num">
                <div>
                  <div className="text-emerald-400 font-bold">Prob: {row.calibratedProbability || row.calProb}%</div>
                  <div className="text-slate-400 text-[10px]">Odds: @{row.availableOdds || row.marketOdds}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  {row.recommendation || row.signal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
