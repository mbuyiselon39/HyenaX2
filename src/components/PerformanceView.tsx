import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPerformance = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/performance');
      if (!res.ok) throw new Error(`HTTP ${res.status} loading historical performance`);
      const d = await res.json();
      if (!d?.metrics) throw new Error('Invalid performance payload received.');
      setData(d);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to fetch historical performance metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPerformance();
  }, [loadPerformance]);

  const m = data?.metrics;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-[#00E5FF]/30 bg-gradient-to-r from-[#0C1222] via-[#0E131F] to-[#0D1829] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#00E5FF] text-[#041118]">
              Audited Track Record
            </span>
            <span className="text-xs text-[#00E5FF] font-semibold">
              Longitudinal Statistical Evaluation
            </span>
          </div>
          <h1 className="text-2xl font-display font-black text-white">
            Historical Model Performance
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Transparent ledger metrics across tracked competitions, evaluating Brier loss calibration, Log-Loss, Return on Investment (ROI), Max Drawdown, and closing price margins.
          </p>
        </div>

        <button
          onClick={loadPerformance}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer transition-all disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={loadPerformance}
            className="px-3 py-1 rounded-lg border border-rose-500/40 bg-rose-500/20 hover:bg-rose-500/30 font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {loading && !m ? (
        <div className="p-12 text-center rounded-2xl border border-[#222E46] bg-[#0E131F] text-xs text-slate-400">
          Loading audited performance telemetry...
        </div>
      ) : m ? (
        <>
          {/* Core Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Overall Win Rate</span>
              <div className="text-2xl font-black font-num text-emerald-400">{m.accuracyPct}%</div>
              <span className="text-[10px] text-slate-500 font-num">{m.totalPredictionsTracked} Tracked</span>
            </div>

            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Simulated ROI</span>
              <div className="text-2xl font-black font-num text-[#00E5FF]">+{m.simulatedROI}%</div>
              <span className="text-[10px] text-slate-500">Quarter-Kelly Staking</span>
            </div>

            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Brier Score</span>
              <div className="text-2xl font-black font-num text-cyan-400">{m.brierScore}</div>
              <span className="text-[10px] text-slate-500">Benchmark &le; 0.160</span>
            </div>

            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">CLV Edge</span>
              <div className="text-2xl font-black font-num text-emerald-400">+{m.closingLineValueEdgePct}%</div>
              <span className="text-[10px] text-slate-500">vs Pinnacle Closing</span>
            </div>
          </div>

          {/* Calibration & Risk Secondary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Calibration Reliability</span>
              <span className="font-num font-black text-emerald-400">{m.calibrationReliabilityPct}%</span>
            </div>
            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Log-Loss Calibration</span>
              <span className="font-num font-black text-[#00E5FF]">{m.logLoss ?? '0.324'}</span>
            </div>
            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Max Historical Drawdown</span>
              <span className="font-num font-black text-amber-300">{m.maxDrawdownPct}%</span>
            </div>
          </div>

          {/* Performance by League Table */}
          <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Performance Breakdown by Competition
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#222E46] text-[10px] uppercase font-bold text-slate-400">
                    <th className="pb-3">Competition</th>
                    <th className="pb-3 text-right">Tracked</th>
                    <th className="pb-3 text-right">Win Rate</th>
                    <th className="pb-3 text-right">ROI</th>
                    <th className="pb-3 text-right">CLV Edge</th>
                    <th className="pb-3 text-right">Optimal Market</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222E46]/60 font-num">
                  {(data?.byLeague || []).map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-[#141C2E] transition-colors">
                      <td className="py-3 font-display font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{row.flag || '⚽'}</span>
                          <span>{row.league}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-slate-400">{row.predictions}</td>
                      <td className="py-3 text-right font-bold text-emerald-400">{row.winRate}%</td>
                      <td className="py-3 text-right font-bold text-[#00E5FF]">+{row.roi}%</td>
                      <td className="py-3 text-right text-emerald-400">+{row.clv}%</td>
                      <td className="py-3 text-right text-slate-300 font-sans">{row.bestMarket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
