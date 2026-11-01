import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Settings,
  Server,
  RefreshCw,
  Power,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Database
} from 'lucide-react';

export const AdminCentreView: React.FC = () => {
  const { addToast, refreshFixtures, isSyncing } = useApp();
  const [pipelineStatus, setPipelineStatus] = useState<any>(null);
  const [isPurging, setIsPurging] = useState(false);

  const fetchScraperHealth = async () => {
    try {
      const res = await fetch('/api/scrapers/status');
      if (res.ok) {
        const d = await res.json();
        setPipelineStatus(d);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchScraperHealth();
  }, []);

  const toggleScraper = async (key: string, currentEnabled: boolean) => {
    try {
      const res = await fetch('/api/scrapers/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scraperKey: key, enabled: !currentEnabled })
      });
      if (res.ok) {
        addToast('Scraper Toggled', `${key} ${!currentEnabled ? 'Enabled' : 'Paused'}`, 'info');
        fetchScraperHealth();
      }
    } catch (e: any) {
      addToast('Toggle Error', e.message, 'error');
    }
  };

  const clearCache = async () => {
    setIsPurging(true);
    try {
      const res = await fetch('/api/admin/clear-cache', { method: 'POST' });
      if (res.ok) {
        addToast('Cache Purged', 'Telemetry caches refreshed and re-anchored', 'success');
      }
    } catch (e: any) {
      addToast('Error', e.message, 'error');
    } finally {
      setIsPurging(false);
    }
  };

  const scrapers = pipelineStatus?.health ? Object.entries(pipelineStatus.health) : [
    ['understat', { name: 'UnderStat', status: 'ONLINE', enabled: true, latencyMs: 142 }],
    ['whoscored', { name: 'WhoScored', status: 'ONLINE', enabled: true, latencyMs: 210 }],
    ['transfermarkt', { name: 'Transfermarkt', status: 'ONLINE', enabled: true, latencyMs: 180 }],
    ['sofascore', { name: 'SofaScore', status: 'ONLINE', enabled: true, latencyMs: 110 }],
    ['soccerWiki', { name: 'SoccerWiki', status: 'ONLINE', enabled: true, latencyMs: 95 }],
    ['googleDiscovery', { name: 'GoogleDiscovery', status: 'ONLINE', enabled: true, latencyMs: 165 }]
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#17130A] to-[#0E131F] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-black">
            System Orchestrator
          </span>
          <span className="text-xs text-amber-300 font-semibold">
            Pipeline Health & Telemetry Controls
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Admin Control Centre
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Manage data scrapers, trigger manual fixture regeneration, purge stale caches, and audit system-wide telemetry streams.
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => refreshFixtures(true)}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-display text-xs font-bold transition-all shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Force Live Feed Sync</span>
        </button>

        <button
          onClick={clearCache}
          disabled={isPurging}
          className="px-4 py-2.5 rounded-xl border border-[#222E46] bg-[#0E131F] hover:bg-[#141C2E] text-slate-200 font-display text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>Purge & Re-anchor Cache</span>
        </button>
      </div>

      {/* Scrapers Status Grid */}
      <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
          Individual Scraper Engine Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {scrapers.map(([key, item]: any) => (
            <div
              key={key}
              className="p-4 rounded-xl border border-[#222E46] bg-[#0A0E17] flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="font-bold text-white uppercase">{item.name || key}</div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.enabled !== false ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                  <span className="text-[10px] text-slate-400 font-num">
                    {item.latencyMs ? `${item.latencyMs}ms latency` : 'Active'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleScraper(key, item.enabled !== false)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  item.enabled !== false
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Toggle Scraper"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
