import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { fetchJsonSafe } from '../utils/safeFetch.ts';
// @ts-ignore
import { BetSlipXRayEngine } from '../beastEngine.js';
import { Scan } from 'lucide-react';

export const BetSlipXRayView: React.FC = () => {
  const { addToast } = useApp();
  const [slipCode, setSlipCode] = useState<string>('HW-8942-NDLELA');
  const [bookmakerHint, setBookmakerHint] = useState<string>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const presets = [
    { label: 'Hollywoodbets (6 Legs)', code: 'HW-8942-NDLELA', bookmaker: 'hollywoodbets' },
    { label: 'Betway Gold Ticket (3 Legs)', code: 'BW-7731-GOLD', bookmaker: 'betway' },
    { label: 'EasyBet High Conviction (5 Legs)', code: 'EB-3310-SAFE', bookmaker: 'easybet' },
  ];

  const handleAnalyze = async () => {
    if (!slipCode.trim()) {
      addToast('Input Required', 'Please enter a Bet Slip Code or paste bet slip text', 'warning');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetchJsonSafe<any>('/api/beast/betslip/xray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: slipCode,
          bookmakerHint: bookmakerHint === 'auto' ? undefined : bookmakerHint
        })
      });

      if (res.ok && res.data) {
        setAnalysisResult(res.data);
        addToast('X-Ray Complete', `Parsed ${res.data.legs?.length || 0} legs with full probability audit`, 'success');
      } else {
        const xray = new BetSlipXRayEngine();
        const localData = xray.parseBetSlip(slipCode, bookmakerHint === 'auto' ? 'auto' : bookmakerHint);
        if (localData && !localData.error) {
          setAnalysisResult(localData);
          addToast('X-Ray Complete', `Parsed ${localData.legs?.length || 0} legs via Quantitative X-Ray Engine`, 'success');
        } else {
          addToast('X-Ray Failed', localData?.error || res.error || 'Failed to parse bet slip code', 'error');
        }
      }
    } catch (e: any) {
      addToast('Error', e.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analysis = analysisResult?.analysis || {};
  const combinedOdds = Number(analysis.combinedOdds ?? analysisResult?.totalOdds ?? 1);
  const trueProb = Number(analysis.trueProbability ?? analysisResult?.compoundTrueProb ?? 0);
  const impliedProbPct = combinedOdds > 1 ? (100 / combinedOdds) : 0;
  const overroundPct = analysisResult?.overroundPct !== undefined
    ? Number(analysisResult.overroundPct)
    : +Math.max(0, impliedProbPct - trueProb).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-[#00E5FF]/30 bg-gradient-to-r from-[#0C1222] to-[#0E131F] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#00E5FF] text-[#041118]">
            Slip Deconstruction
          </span>
          <span className="text-xs text-[#00E5FF] font-semibold">
            Optical &amp; Code X-Ray Scanner
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Bet Slip Code X-Ray
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Enter booking codes or paste multi-line bet slip text from Hollywoodbets, Betway, or EasyBet. We de-vig the ticket, isolate each leg&apos;s Dixon-Coles goal expectation, and compute the true survival probability before you place your stake.
        </p>
      </div>

      {/* Input & Presets Card */}
      <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
        {/* Presets */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Test Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button
                key={p.code}
                onClick={() => {
                  setSlipCode(p.code);
                  setBookmakerHint(p.bookmaker);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  slipCode === p.code
                    ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-[#00E5FF]'
                    : 'border-[#222E46] bg-[#0A0E17] text-slate-300 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            Bet Slip Booking Code or Pasted Multi-Line Slip Text
          </label>
          <div className="flex flex-col gap-2">
            <textarea
              rows={3}
              value={slipCode}
              onChange={(e) => setSlipCode(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleAnalyze();
              }}
              placeholder={"e.g. HW-8942-NDLELA or paste multi-line matches:\nArsenal vs Chelsea\n1.85"}
              className="w-full px-4 py-2.5 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]/50 resize-y"
            />

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <select
                value={bookmakerHint}
                onChange={(e) => setBookmakerHint(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs text-slate-200 focus:outline-none focus:border-[#00E5FF]/50"
              >
                <option value="auto">Auto-Detect Bookmaker</option>
                <option value="hollywoodbets">Hollywoodbets</option>
                <option value="betway">Betway</option>
                <option value="easybet">EasyBet</option>
              </select>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn-primary px-5 py-2.5 text-xs font-display font-extrabold tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Scan className="w-4 h-4" />
                <span>{isAnalyzing ? 'Scanning...' : 'X-Ray Slip'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top Ticket Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Bookmaker</span>
              <div className="text-base font-bold text-[#00E5FF] uppercase truncate">
                {analysisResult.bookmaker || 'Identified'}
              </div>
              {analysis.riskLevel && (
                <div className="text-[10px] text-slate-400 font-num">{analysis.riskLevel}</div>
              )}
            </div>

            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Quoted Odds</span>
              <div className="text-xl font-black font-num text-white">
                @{combinedOdds.toFixed(2)}
              </div>
              {analysis.fairTicketOdds && (
                <div className="text-[10px] text-slate-400 font-num">Fair: @{Number(analysis.fairTicketOdds).toFixed(2)}</div>
              )}
            </div>

            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">True Survival Prob</span>
              <div className="text-xl font-black font-num text-emerald-400">
                {trueProb.toFixed(1)}%
              </div>
              {analysis.expectedValuePct !== undefined && (
                <div className={`text-[10px] font-num font-bold ${Number(analysis.expectedValuePct) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Ticket EV: {Number(analysis.expectedValuePct) >= 0 ? `+${analysis.expectedValuePct}%` : `${analysis.expectedValuePct}%`}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Implied Vig Spread</span>
              <div className="text-xl font-black font-num text-rose-400">
                +{overroundPct.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 font-num">Failure Risk: {Number(analysis.failureProbability ?? (100 - trueProb)).toFixed(1)}%</div>
            </div>
          </div>

          {/* Parsed Legs List */}
          <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Parsed Match Legs ({analysisResult.legs?.length || 0})
            </h3>

            <div className="space-y-3">
              {(analysisResult.legs || []).map((leg: any, i: number) => {
                const legStatus = leg.status || 'KEEP';
                const badgeClass =
                  legStatus === 'REMOVE'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : legStatus === 'REPLACE'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                const legProb = Number(leg.calibratedProbability ?? leg.probability ?? leg.trueProb ?? 75);

                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold font-num flex items-center justify-center text-slate-300">
                          {i + 1}
                        </span>
                        <span className="font-display font-bold text-sm text-white">
                          {leg.match || leg.fixture}
                        </span>
                      </div>

                      <div className="text-xs text-[#00E5FF] font-semibold pl-7">
                        {leg.market}: <span className="text-white">{leg.selection}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pl-7 sm:pl-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-300 font-num">
                          @{Number(leg.odds).toFixed(2)}
                        </div>
                        <div className="text-[10px] font-num text-emerald-400">
                          {legProb.toFixed(1)}% Model Prob
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${badgeClass}`}>
                        {legStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verdict */}
            <div className="p-3 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-[#00E5FF] block">
                X-Ray Verdict{analysisResult.ticketVerdict?.rating ? ` · ${analysisResult.ticketVerdict.rating}` : ''}:
              </span>
              {analysisResult.ticketVerdict?.summary || analysisResult.summary || 'Audit complete. Maintain fractional Kelly staking discipline.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
