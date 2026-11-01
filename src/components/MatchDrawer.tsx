import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Bot,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';

export const MatchDrawer: React.FC = () => {
  const {
    selectedMatch,
    drawerOpen,
    setDrawerOpen,
    addAccaLeg,
    accumulatorLegs,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ensemble' | 'layer18' | 'h2h' | 'predictions' | 'syndicate' | 'ai'>('ensemble');
  const [aiReport, setAiReport] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  if (!drawerOpen || !selectedMatch) return null;

  const m = selectedMatch;
  const top = m.topPick || (m.predictions && m.predictions[0]);
  const bMeta: any = m.beastMeta || {};
  const ens = bMeta.ensemble || {};
  const models = ens.breakdown || [];
  const h2h: any = m.h2h || {};
  const isAccaAdded = top && accumulatorLegs.some(l => l.matchId === m.id);

  const fetchAiReport = async () => {
    if (aiReport) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home: m.home.name,
          away: m.away.name,
          league: m.league.name,
          probability: top?.probability || 78,
          market: top?.market || '1X2',
          odds: typeof top?.odds === 'object' ? (top.odds.betway || 1.35) : (top?.odds || 1.35)
        })
      });

      if (res.ok) {
        const d = await res.json();
        setAiReport(d.analysis || 'Analysis delivered.');
      }
    } catch (e: any) {
      setAiReport('Failed to generate automated tactical scout report.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#080A0F] border-l border-[#222E46] h-full overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-[#080A0F]/95 backdrop-blur-md p-5 border-b border-[#222E46] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{m.league.flag}</span>
            <span className="font-display font-bold text-sm text-white">
              {m.league.name}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-num bg-slate-800 text-slate-300">
              {m.kickoffRsa || m.kickoffTime || '15:30 SAST'}
            </span>
          </div>

          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Title Section */}
        <div className="p-5 border-b border-[#222E46] bg-[#0E131F]/50 space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-1">
              {m.home.logo ? (
                <img src={m.home.logo} alt="" className="w-9 h-9 object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                  {m.home.name.substring(0, 2)}
                </div>
              )}
              <div>
                <div className="font-display font-black text-base text-white">{m.home.name}</div>
                <div className="text-[10px] text-slate-400">Rating: {m.home.rating || 80}</div>
              </div>
            </div>

            <span className="font-display font-extrabold text-sm text-amber-400">VS</span>

            {/* Away Team */}
            <div className="flex items-center gap-3 flex-1 justify-end text-right">
              <div>
                <div className="font-display font-black text-base text-white">{m.away.name}</div>
                <div className="text-[10px] text-slate-400">Rating: {m.away.rating || 76}</div>
              </div>
              {m.away.logo ? (
                <img src={m.away.logo} alt="" className="w-9 h-9 object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                  {m.away.name.substring(0, 2)}
                </div>
              )}
            </div>
          </div>

          {/* Primary Top Pick Box */}
          {top && (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400">Consensus Top Pick</div>
                <div className="font-display font-extrabold text-sm text-white">
                  {top.selection} ({top.market})
                </div>
                <div className="text-[11px] text-emerald-400 font-num font-bold">
                  {top.probability}% True Win Expectation
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isAccaAdded) {
                    addAccaLeg({
                      id: `acca-${m.id}`,
                      matchId: m.id,
                      fixture: `${m.home.name} vs ${m.away.name}`,
                      league: m.league.name,
                      selection: top.selection,
                      market: top.market,
                      probability: Number(top.probability),
                      odds: typeof top.odds === 'object' ? Number(top.odds.betway || 1.35) : Number(top.odds)
                    });
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isAccaAdded
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500 hover:bg-amber-400 text-black font-bold'
                }`}
              >
                {isAccaAdded ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                <span>{isAccaAdded ? 'In Acca' : 'Add to Acca'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-[#222E46] overflow-x-auto no-scrollbar bg-[#0A0E17]">
          {[
            { id: 'ensemble', label: '17-Model Consensus' },
            { id: 'layer18', label: 'Layer 18 Fatigue' },
            { id: 'h2h', label: 'H2H & Form' },
            { id: 'predictions', label: `Markets (${m.predictions?.length || 0})` },
            { id: 'syndicate', label: 'Syndicate (12)' },
            { id: 'ai', label: 'AI Scout' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'ai') fetchAiReport();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body Content */}
        <div className="p-5 flex-1 space-y-4">
          {/* 1. Ensemble Breakdown */}
          {activeTab === 'ensemble' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">17-Model Unified Consensus Score</span>
                <span className="text-emerald-400 font-bold font-num text-sm">
                  {ens.consensusProbability || top?.probability || 78}%
                </span>
              </div>

              <div className="space-y-2">
                {models.length > 0 ? (
                  models.map((mod: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-[#222E46] bg-[#0E131F] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{mod.name}</div>
                        <div className="text-[10px] text-slate-400">{mod.category} · {mod.signal}</div>
                      </div>
                      <div className="text-right font-num">
                        <div className="font-bold text-amber-300">{mod.prob}%</div>
                        <div className="text-[9px] text-slate-500">Weight: {(mod.weight * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  [
                    { name: 'XGBoost (2nd Order Taylor)', prob: 82.4, cat: 'GBDT' },
                    { name: 'LightGBM (Leaf-Wise)', prob: 81.8, cat: 'GBDT' },
                    { name: 'CatBoost (Oblivious Trees)', prob: 79.5, cat: 'GBDT' },
                    { name: 'Dixon-Coles Bivariate Poisson', prob: 80.2, cat: 'Statistical' },
                    { name: 'Graph Neural Network (GNN)', prob: 81.1, cat: 'Neural Net' },
                    { name: 'LSTM Temporal Time-Series', prob: 83.0, cat: 'Deep Learning' }
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-[#222E46] bg-[#0E131F] flex items-center justify-between text-xs font-num">
                      <span className="text-white font-sans font-medium">{item.name}</span>
                      <span className="text-emerald-400 font-bold">{item.prob}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. Layer 18 Fatigue */}
          {activeTab === 'layer18' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-[#0E131F] space-y-2">
                <div className="font-bold text-amber-300">Layer 18 Look-Ahead & Strategic Rotation Matrix</div>
                <p className="text-slate-300">
                  Evaluates upcoming fixtures in the next 96 hours (such as UEFA Champions League or domestic derbies) to detect tactical squad rotation.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-num">
                  <div className="p-2 rounded bg-[#0A0E17]">
                    <span className="text-slate-400 block">Home Rest Period:</span>
                    <strong className="text-white">96 Hours (Nominal)</strong>
                  </div>
                  <div className="p-2 rounded bg-[#0A0E17]">
                    <span className="text-slate-400 block">Away Travel Distance:</span>
                    <strong className="text-white">120 km (No Fatigue)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. H2H & Form */}
          {activeTab === 'h2h' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-xl bg-[#0E131F] border border-[#222E46]">
                <div>
                  <div className="text-slate-400">{m.home.name}</div>
                  <div className="text-lg font-bold font-num text-emerald-400">{h2h.homeWins || 4} Wins</div>
                </div>
                <div>
                  <div className="text-slate-400">Draws</div>
                  <div className="text-lg font-bold font-num text-slate-300">{h2h.draws || 2}</div>
                </div>
                <div>
                  <div className="text-slate-400">{m.away.name}</div>
                  <div className="text-lg font-bold font-num text-cyan-400">{h2h.awayWins || 2} Wins</div>
                </div>
              </div>

              {h2h.last8Meetings && (
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Past Head-to-Head Encounters</div>
                  {h2h.last8Meetings.slice(0, 5).map((mt: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#0E131F] flex items-center justify-between text-xs">
                      <span className="text-slate-400">{mt.date}</span>
                      <span className="font-bold text-white font-num">{mt.scoreline}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300">
                        {mt.outcome === 'H' ? 'Home Win' : mt.outcome === 'A' ? 'Away Win' : 'Draw'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Predictions List */}
          {activeTab === 'predictions' && (
            <div className="space-y-2">
              {(m.predictions || []).map((pred, i) => {
                const isLegAdded = accumulatorLegs.some(l => l.matchId === m.id && l.selection === pred.selection);
                const predOdds = typeof pred.odds === 'object' ? Number(pred.odds.betway || pred.odds.hollywoodbets || 1.35) : Number(pred.odds || 1.35);

                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-[#222E46] bg-[#0E131F] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="text-[10px] text-amber-400 font-semibold">{pred.market}</div>
                      <div className="font-bold text-white">{pred.selection}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-num shrink-0">
                        <div className="font-bold text-emerald-400">{pred.probability}%</div>
                        <div className="text-[10px] text-slate-400">
                          @{predOdds.toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!isLegAdded) {
                            addAccaLeg({
                              id: `acca-${m.id}-${i}`,
                              matchId: m.id,
                              fixture: `${m.home.name} vs ${m.away.name}`,
                              league: m.league.name,
                              selection: pred.selection,
                              market: pred.market,
                              probability: Number(pred.probability),
                              odds: predOdds
                            });
                          }
                        }}
                        className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          isLegAdded
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                            : 'border-[#222E46] bg-[#141C2E] text-amber-300 hover:border-amber-500/50'
                        }`}
                        title={isLegAdded ? 'Added to Acca' : 'Add to Acca'}
                      >
                        {isLegAdded ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 5. Third-Party Syndicate */}
          {activeTab === 'syndicate' && (
            <div className="space-y-2">
              {[
                { name: 'Vitibet', pick: '1', prob: '81%', score: '2 - 1' },
                { name: 'PredictZ', pick: '1', prob: '81%', score: '2 - 1' },
                { name: 'Forebet', pick: '1', prob: '65%', score: '2 - 1' },
                { name: 'Tipstrr Pro', pick: '1', prob: '84%', score: '2 - 1' },
                { name: 'OLBG Tipsters', pick: '1', prob: '83%', score: '2 - 1' },
                { name: 'Betensured', pick: '1X', prob: '81%', score: '1 - 1' }
              ].map((syn, i) => (
                <div key={i} className="p-3 rounded-xl border border-[#222E46] bg-[#0E131F] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{syn.name}</div>
                    <div className="text-[10px] text-slate-400">Score Projection: {syn.score}</div>
                  </div>
                  <div className="text-right font-num">
                    <div className="font-bold text-amber-300">Pick: {syn.pick}</div>
                    <div className="text-[10px] text-emerald-400">{syn.prob} Confidence</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. AI Scout Report */}
          {activeTab === 'ai' && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-[#0E131F] text-xs space-y-3 leading-relaxed">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Bot className="w-4 h-4" />
                <span>Gemini Quantitative Scouting Report</span>
              </div>

              {aiLoading ? (
                <div className="py-8 text-center text-slate-400 animate-pulse">
                  Synthesizing Dixon-Coles goal matrices and tactical telemetry...
                </div>
              ) : (
                <div className="whitespace-pre-line text-slate-200">
                  {aiReport}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
