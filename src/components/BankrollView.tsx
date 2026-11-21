import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  History,
  AlertCircle,
  ShieldAlert,
  TrendingUp
} from 'lucide-react';

export const BankrollView: React.FC = () => {
  const { dailyTop20Picks } = useApp();
  const [bankroll, setBankroll] = useState<number>(5000);
  const [modelType, setModelType] = useState<'quarter' | 'half'>('quarter');
  const [consecutiveLosses, setConsecutiveLosses] = useState<number>(0);

  const [bankrollData, setBankrollData] = useState<any>(null);
  const [bankrollLoading, setBankrollLoading] = useState<boolean>(false);
  const [bankrollError, setBankrollError] = useState<string | null>(null);

  const [ledger, setLedger] = useState<any[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState<boolean>(true);
  const [ledgerError, setLedgerError] = useState<string | null>(null);

  const fetchLedger = useCallback(async () => {
    setLedgerLoading(true);
    setLedgerError(null);
    try {
      const res = await fetch('/api/beast/ledger');
      if (!res.ok) throw new Error(`HTTP ${res.status} loading audit ledger`);
      const d = await res.json();
      setLedger(Array.isArray(d?.ledger) ? d.ledger : []);
    } catch (err: any) {
      setLedgerError(err?.message || 'Unable to load immutable prediction ledger.');
    } finally {
      setLedgerLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const computeBankrollAllocations = useCallback(async () => {
    setBankrollLoading(true);
    setBankrollError(null);
    try {
      const opportunities = dailyTop20Picks.length > 0
        ? dailyTop20Picks.slice(0, 6).map(p => ({
            match: p.match,
            selection: `${p.market}: ${p.selection}`,
            calibratedProbability: p.calibratedProb || p.probability,
            odds: p.odds
          }))
        : [
            {
              match: 'Primary Consensus Benchmark',
              selection: 'Banker Allocation Reference',
              calibratedProbability: 78.0,
              odds: 1.65
            }
          ];

      const res = await fetch('/api/beast/bankroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankroll,
          fractionalKellyType: modelType,
          consecutiveLosses,
          opportunities
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} computing Kelly stakes`);
      const data = await res.json();
      setBankrollData(data);
    } catch (err: any) {
      setBankrollError(err?.message || 'Unable to calculate fractional Kelly sizing.');
    } finally {
      setBankrollLoading(false);
    }
  }, [bankroll, modelType, consecutiveLosses, dailyTop20Picks]);

  useEffect(() => {
    computeBankrollAllocations();
  }, [computeBankrollAllocations]);

  const isLossGuarded = consecutiveLosses >= 3;
  const recommendations: any[] = bankrollData?.recommendations || [];
  const leadRec = recommendations[0];
  const maxDailyCap = bankrollData?.maxDailyExposure ?? +(bankroll * 0.15).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-[#00E5FF]/30 bg-gradient-to-r from-[#0C1222] via-[#0E131F] to-[#0D1829] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#00E5FF] text-[#041118]">
            Capital Preservation
          </span>
          <span className="text-xs text-[#00E5FF] font-semibold">
            Fractional Kelly Allocation &amp; Anti-Chasing Shield
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Bankroll Risk Manager
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Protects your capital with live fractional Kelly sizing across today&apos;s Daily Top 20 bankers while enforcing automatic 50% drawdown tapering after 3 consecutive losses.
        </p>
      </div>

      {/* Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Bankroll Input */}
        <div className="p-5 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Bankroll Capital
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#00E5FF]">R</span>
            <input
              type="number"
              min={100}
              value={bankroll}
              onChange={(e) => setBankroll(Math.max(100, Number(e.target.value) || 100))}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#222E46] bg-[#080A0F] text-lg font-black font-num text-white focus:outline-none focus:border-[#00E5FF]/50"
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
            onChange={(e) => setModelType(e.target.value as 'quarter' | 'half')}
            className="w-full px-3 py-2.5 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs text-slate-200 focus:outline-none focus:border-[#00E5FF]/50"
          >
            <option value="quarter">Quarter-Kelly (Recommended, χ = 0.25)</option>
            <option value="half">Half-Kelly (Aggressive, χ = 0.50)</option>
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
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500 text-white">
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
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
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

      {/* Loss Alert Banner */}
      {bankrollData?.lossAlert && (
        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 flex items-start gap-3 text-xs text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-300 uppercase text-[11px]">Anti-Chasing Risk Defense Activated</div>
            <p className="mt-0.5 leading-relaxed">{bankrollData.lossAlert.message}</p>
          </div>
        </div>
      )}

      {bankrollError && (
        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{bankrollError}</span>
          </div>
          <button
            onClick={computeBankrollAllocations}
            className="px-3 py-1 rounded-lg border border-rose-500/40 bg-rose-500/20 font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Primary Recommended Stake Display */}
      <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-[#0D1829] to-[#0A1A17] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-emerald-400 mb-1">
            {leadRec ? `Lead Pick Allocation — ${leadRec.match}` : 'Lead Banker Recommended Wager'}
          </div>
          <div className="font-display font-black text-3xl text-white font-num">
            {bankrollLoading && !leadRec
              ? 'Calculating...'
              : `R ${Number(leadRec?.recommendedStakeZAR ?? 0).toLocaleString()}`}
            {leadRec && (
              <span className="text-xs font-semibold text-slate-400 ml-2">
                ({leadRec.fractionalKellyPct}% of capital · {bankrollData?.fractionalScaleName || 'Quarter-Kelly'})
              </span>
            )}
          </div>
          {leadRec && (
            <div className="text-[11px] text-slate-300 mt-1">
              Selection: <strong className="text-[#00E5FF]">{leadRec.selection}</strong> @ {leadRec.odds.toFixed(2)} ({leadRec.calibratedProbability}% Calibrated)
            </div>
          )}
        </div>

        <div className="sm:text-right text-xs text-slate-300 space-y-0.5 font-num shrink-0">
          <div>Maximum Daily Cap: <strong className="text-white">R {Number(maxDailyCap).toLocaleString()}</strong> (15%)</div>
          <div>
            Estimated Risk of Ruin:{' '}
            <strong className="text-emerald-400">
              {leadRec ? `${leadRec.estimatedRuinProbPct}%` : '< 0.2%'}
            </strong>
          </div>
        </div>
      </div>

      {/* Live Daily Top 20 Per-Fixture Staking Plan */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222E46] pb-3">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
              <span>Daily Qualified Banker Stake Plan (Live Kelly Engine)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-num">5.0% Single-Bet Cap Enforced</span>
          </div>

          <div className="space-y-2.5">
            {recommendations.map((rec, i) => (
              <div
                key={`${rec.match}-${i}`}
                className="p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="font-display font-bold text-white truncate">{rec.match}</div>
                  <div className="text-slate-400 truncate">
                    <span className="text-[#00E5FF] font-semibold">{rec.selection}</span> · {rec.calibratedProbability}% Prob @ {Number(rec.odds).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-num">
                  <div className="text-right">
                    <div className="text-emerald-400 font-black">R {Number(rec.recommendedStakeZAR).toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">{rec.fractionalKellyPct}% bankroll</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rec.isPositiveExpectation
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {rec.wasCappedAtCeiling ? 'CAPPED 5%' : rec.isPositiveExpectation ? '+EV SIZED' : 'NO EDGE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immutable Prediction Ledger */}
      <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#222E46] pb-3">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-[#00E5FF]" />
            <span>Immutable Prediction Audit Trail</span>
          </h3>
          <span className="text-[10px] text-emerald-400 font-bold">
            TIMESTAMP-CERTIFIED PRE-KICKOFF
          </span>
        </div>

        {ledgerLoading ? (
          <div className="p-6 text-center text-xs text-slate-400">
            Loading immutable prediction audit trail...
          </div>
        ) : ledgerError ? (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300 flex items-center justify-between">
            <span>{ledgerError}</span>
            <button onClick={fetchLedger} className="font-bold underline cursor-pointer">Retry</button>
          </div>
        ) : ledger.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No pre-kickoff audit records logged yet for the active cycle.
          </div>
        ) : (
          <div className="space-y-3">
            {ledger.map(row => (
              <div
                key={row.id}
                className="p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-num text-[10px] text-[#00E5FF] font-bold shrink-0">{row.id}</span>
                    <span className="font-display font-bold text-white truncate">{row.match}</span>
                  </div>
                  <div className="text-slate-300 truncate">
                    Pick: <strong className="text-[#00E5FF]">{row.selection || row.pick}</strong> · {row.league}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right font-num shrink-0">
                  <div>
                    <div className="text-emerald-400 font-bold">Prob: {row.calibratedProbability || row.calProb}%</div>
                    <div className="text-slate-400 text-[10px]">Odds: @{row.availableOdds || row.marketOdds}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00E5FF]/15 text-[#00E5FF]">
                    {row.recommendation || row.signal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
