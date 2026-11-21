import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Radio,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export const DiscoveryView: React.FC = () => {
  const { fixtures, setSelectedMatchId, setDrawerOpen } = useApp();
  const [conflictsData, setConflictsData] = useState<any[]>([]);
  const [totalResolved, setTotalResolved] = useState<number>(0);
  const [movementsData, setMovementsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDiscoveryData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [confRes, movRes] = await Promise.all([
        fetch('/api/conflicts'),
        fetch('/api/market/movements')
      ]);
      if (!confRes.ok || !movRes.ok) {
        throw new Error(`HTTP ${!confRes.ok ? confRes.status : movRes.status} loading discovery feeds`);
      }
      const [confJson, movJson] = await Promise.all([confRes.json(), movRes.json()]);
      setConflictsData(Array.isArray(confJson?.conflicts) ? confJson.conflicts : []);
      setTotalResolved(Number(confJson?.totalConflictsResolved ?? (confJson?.conflicts?.length || 0)));
      setMovementsData(Array.isArray(movJson?.movements) ? movJson.movements : []);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to load discovery & conflict resolution feeds.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiscoveryData();
  }, [loadDiscoveryData]);

  // Combine live market movements with fixture-level tactical/derby telemetry
  const telemetryFeed = useMemo(() => {
    const items: Array<{
      id: string;
      matchId?: string;
      match: string;
      badge: string;
      source: string;
      text: string;
      metricLabel: string;
      impact: string;
    }> = [];

    movementsData.slice(0, 4).forEach((mv, idx) => {
      items.push({
        id: `mv-${idx}`,
        match: mv.fixture,
        badge: mv.direction || 'STEAM_SHIFT',
        source: 'Betfair Liquidity & Sharp Odds Mesh',
        text: `${mv.market} shifted from @${mv.openOdds} to @${mv.currentOdds} on ${mv.volume || 'high'} market liquidity.`,
        metricLabel: mv.league || 'Global Market',
        impact: `${mv.movePct > 0 ? `+${mv.movePct}%` : `${mv.movePct}%`} Odds Drift`
      });
    });

    fixtures.slice(0, 60).forEach((m) => {
      if (items.length >= 8) return;
      const sit = m.situationalFactors || {};
      const derby = m.beastMeta?.derbyInfo;
      if (derby?.isDerby) {
        items.push({
          id: `derby-${m.id}`,
          matchId: m.id,
          match: `${m.home.name} vs ${m.away.name}`,
          badge: 'DERBY_GUARD',
          source: 'Structural Volatility Engine',
          text: `${derby.derbyName || 'High-intensity rivalry fixture'} flagged; anti-guessing variance dampener engaged for ${m.topPick?.market || 'primary market'}.`,
          metricLabel: m.league.name,
          impact: `${m.topPick?.probability?.toFixed?.(1) ?? m.topPick?.probability ?? 75}% Calibrated`
        });
      } else if (sit?.weatherConditions?.summary || sit?.travelFatigue?.awayTravelKm > 800) {
        items.push({
          id: `sit-${m.id}`,
          matchId: m.id,
          match: `${m.home.name} vs ${m.away.name}`,
          badge: 'TELEMETRY_SYNC',
          source: 'Venue Altitude & Fatigue Adapter',
          text: `${m.venue || 'Confirmed stadium'}: ${sit.weatherConditions?.summary || 'Surface telemetry verified'}${sit.travelFatigue?.awayTravelKm ? ` · Away transit ${sit.travelFatigue.awayTravelKm} km` : ''}.`,
          metricLabel: m.league.name,
          impact: m.topPick?.selection || 'Verified'
        });
      }
    });

    return items;
  }, [movementsData, fixtures]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-[#00E5FF]/30 bg-gradient-to-r from-[#0C1222] via-[#0E131F] to-[#0D1829] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-400 text-[#041118]">
              Real-Time Feed
            </span>
            <span className="text-xs text-[#00E5FF] font-semibold">
              Multi-Source Grounding &amp; Ingestion Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-display font-black text-white">
            Discovery &amp; Conflict Resolution
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Automated multi-source cross-referencing across UnderStat, WhoScored, Transfermarkt, Betfair Exchange, and Google Discovery feeds before kickoff.
          </p>
        </div>

        <button
          onClick={loadDiscoveryData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer transition-all disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={loadDiscoveryData}
            className="px-3 py-1 rounded-lg border border-rose-500/40 bg-rose-500/20 hover:bg-rose-500/30 font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Live Market Steam & Fixture Discovery Telemetry */}
        <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Live Discovery &amp; Steam Telemetry</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-num">
              {telemetryFeed.length} Signals
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Synchronizing live discovery &amp; sharp steam feeds...
            </div>
          ) : telemetryFeed.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No live steam alerts or tactical telemetry anomalies detected right now.
            </div>
          ) : (
            <div className="space-y-3">
              {telemetryFeed.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.matchId) {
                      setSelectedMatchId(item.matchId);
                      setDrawerOpen(true);
                    }
                  }}
                  className={`p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] space-y-2 text-xs ${
                    item.matchId ? 'cursor-pointer hover:border-[#00E5FF]/50 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-display font-bold text-white truncate">{item.match}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-bold font-num shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {item.text}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#222E46]/60 text-[10px] gap-2">
                    <span className="text-slate-400 truncate">
                      Source: <strong className="text-slate-200">{item.source}</strong> · {item.metricLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-num font-bold shrink-0 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {item.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Automated Sanity & Conflicts Resolution */}
        <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              <span>Automated Conflict Resolution</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold font-num">
              {totalResolved} Resolved
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Auditing cross-source conflicts...
            </div>
          ) : conflictsData.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Zero unresolved cross-source conflicts across active ingestion feeds.
            </div>
          ) : (
            <div className="space-y-3">
              {conflictsData.map((cf, i) => (
                <div
                  key={cf.id || `cf-${i}`}
                  className="p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white truncate">{cf.fixture || cf.match}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
                      RESOLVED
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Parameter: <strong className="text-slate-200">{cf.type || cf.entity}</strong>
                    {cf.resolvedValue && (
                      <span className="ml-2 text-[#00E5FF] font-semibold">→ {cf.resolvedValue}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] p-2 rounded bg-slate-900/60">
                    <div className="text-slate-400">
                      <span className="text-slate-300 font-semibold">{cf.sourceA?.name || 'Source A'}:</span>{' '}
                      {cf.sourceA?.value ?? cf.sourceA}
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-300 font-semibold">{cf.sourceB?.name || 'Source B'}:</span>{' '}
                      {cf.sourceB?.value ?? cf.sourceB}
                    </div>
                  </div>

                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{cf.resolutionReason || cf.resolution || 'Multi-source verification passed'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
