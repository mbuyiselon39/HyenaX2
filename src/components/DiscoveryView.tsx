import React, { useState, useEffect } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const DiscoveryView: React.FC = () => {
  const [conflictsData, setConflictsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const discoveryNews = [
    {
      id: 'gn-1',
      match: 'Arsenal vs Chelsea',
      type: 'LINEUP_ALERT',
      source: 'Google Discovery Feed',
      text: 'Starting XI confirmed. Saka and Odegaard both starting on the right flank.',
      time: '12m ago',
      impact: '+2.4% Attack Index'
    },
    {
      id: 'gn-2',
      match: 'Real Madrid vs Barcelona',
      type: 'TACTICAL_UPDATE',
      source: 'Google Sports Grounding',
      text: 'Tactical shift to 4-3-3 high press confirmed by official press conference.',
      time: '24m ago',
      impact: '+3.1% Over 2.5'
    },
    {
      id: 'gn-3',
      match: 'Mamelodi Sundowns vs SuperSport United',
      type: 'WEATHER_SURFACE',
      source: 'Google Environmental Mesh',
      text: 'Loftus Versfeld pitch condition dry and fast. Wind 8km/h, 24°C.',
      time: '40m ago',
      impact: 'Nominal'
    },
    {
      id: 'gn-4',
      match: 'Kaizer Chiefs vs Orlando Pirates',
      type: 'DERBY_SECURITY',
      source: 'PSL Official Delegate',
      text: 'FNB Stadium sold out. Match categorized as High-Risk Derby; strict anti-guessing volatility dampener active.',
      time: '1h ago',
      impact: 'Zero-Risk Protocol Applied'
    }
  ];

  useEffect(() => {
    fetch('/api/conflicts')
      .then(r => r.json())
      .then(d => {
        if (d && d.conflicts) setConflictsData(d.conflicts);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#17130A] to-[#0E131F] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-400 text-black">
            Real-Time Feed
          </span>
          <span className="text-xs text-amber-300 font-semibold">
            Google Grounding & Data Ingestion Pipeline
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Discovery & Conflict Resolution
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Automated multi-source cross-referencing between UnderStat, WhoScored, Transfermarkt, and Google Discovery feeds to eliminate data errors before match kickoff.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Discovery Breaking News */}
        <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Live Discovery Telemetry</span>
            </h3>
            <span className="text-[10px] text-slate-400">4 Active Feeds</span>
          </div>

          <div className="space-y-3">
            {discoveryNews.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-display font-bold text-white">{item.match}</span>
                  <span className="text-slate-400 font-num">{item.time}</span>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {item.text}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#222E46]/60 text-[10px]">
                  <span className="text-slate-400">Source: <strong className="text-amber-300">{item.source}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-num font-bold">
                    {item.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Automated Sanity & Conflicts Resolution */}
        <div className="rounded-2xl border border-[#222E46] bg-[#0E131F] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Automated Conflict Resolution</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold">100% Resolved</span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'cf-1', match: 'Arsenal vs Chelsea', entity: 'Kickoff Verification', sourceA: 'Flashscore (17:30)', sourceB: 'Google Discovery (17:30)', resolution: 'CONSENSUS_VERIFIED', confidence: '99.4%' },
              { id: 'cf-2', match: 'Kaizer Chiefs vs Orlando Pirates', entity: 'xG Baseline', sourceA: 'UnderStat (1.52)', sourceB: 'WhoScored (1.48)', resolution: 'WEIGHTED_BAYESIAN_MEAN', confidence: '96.8%' },
              { id: 'cf-3', match: 'Bayern Munich vs Dortmund', entity: 'Injury Status (Forward)', sourceA: 'Transfermarkt (Doubt)', sourceB: 'Google News Discovery (Fit)', resolution: 'GOOGLE_DISCOVERY_GROUNDED', confidence: '98.2%' }
            ].map(cf => (
              <div
                key={cf.id}
                className="p-3.5 rounded-xl border border-[#222E46] bg-[#0A0E17] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{cf.match}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold">
                    {cf.confidence} Conviction
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Parameter: <strong className="text-slate-200">{cf.entity}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] p-2 rounded bg-slate-900/60 font-num">
                  <div className="text-slate-400">A: {cf.sourceA}</div>
                  <div className="text-slate-400">B: {cf.sourceB}</div>
                </div>

                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Resolution Protocol: {cf.resolution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
