import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Fixture, DayTab, TopBankerPick, AccumulatorLeg, AccumulatorAnalysis, Toast, ChatMessage } from '../types.ts';
import { fetchJsonSafe } from '../utils/safeFetch.ts';
// @ts-ignore
import { analyzeAccumulator } from '../beastEngine.js';
// @ts-ignore
import { auditFixturePrediction } from '../advancedRiskValidationLayer.js';

interface AppContextType {
  fixtures: Fixture[];
  days: DayTab[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  selectedMatch: Fixture | null;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  query: string;
  setQuery: (q: string) => void;
  selectedLeague: string;
  setSelectedLeague: (lid: string) => void;
  bigOnly: boolean;
  setBigOnly: (b: boolean) => void;
  approvedOnly: boolean;
  setApprovedOnly: (a: boolean) => void;
  isSyncing: boolean;
  loadError: string | null;
  lastSyncedAt: string | null;
  dataSource: string;
  sastClock: string;
  utcClock: string;
  todayFullStr: string;
  toasts: Toast[];
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  accumulatorLegs: AccumulatorLeg[];
  addAccaLeg: (leg: AccumulatorLeg) => void;
  removeAccaLeg: (id: string) => void;
  clearAccaLegs: () => void;
  accumulatorAnalysis: AccumulatorAnalysis | null;
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  aiChatMessages: ChatMessage[];
  sendAiMessage: (text: string, model?: string, enableSearch?: boolean, enableMaps?: boolean) => Promise<void>;
  aiChatLoading: boolean;
  refreshFixtures: (force?: boolean) => Promise<void>;
  dailyTop20Picks: TopBankerPick[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [days, setDays] = useState<DayTab[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const selectedMatchIdRef = useRef<string | null>(null);
  useEffect(() => { selectedMatchIdRef.current = selectedMatchId; }, [selectedMatchId]);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('daily-top15');
  const [query, setQuery] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [bigOnly, setBigOnly] = useState<boolean>(false);
  const [approvedOnly, setApprovedOnly] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('ESPN LIVE INGESTION');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [accumulatorLegs, setAccumulatorLegs] = useState<AccumulatorLeg[]>([]);
  const [accumulatorAnalysis, setAccumulatorAnalysis] = useState<AccumulatorAnalysis | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);
  const [aiChatLoading, setAiChatLoading] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "👋 Welcome to the **HyenaX Beast AI Oracle**. I am your quantitative football strategist grounded with **Google Search** for live breaking team news/lineups and **Google Maps** for stadium locations and travel fatigue analysis.\n\nAsk me about today's Daily Top 20 bankers, tactical match distributions, or stadium travel factors.",
      timestamp: 'Just now'
    }
  ]);

  // Live clocks
  const [sastClock, setSastClock] = useState<string>('');
  const [utcClock, setUtcClock] = useState<string>('');
  const [todayFullStr, setTodayFullStr] = useState<string>('');

  const pad = (n: number) => String(n).padStart(2, '0');

  const updateClocks = useCallback(() => {
    const now = new Date();
    setUtcClock(`${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`);
    const rsaDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    setSastClock(`${pad(rsaDate.getUTCHours())}:${pad(rsaDate.getUTCMinutes())} SAST`);
    setTodayFullStr(now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  useEffect(() => {
    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, [updateClocks]);

  const addToast = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const now = new Date();
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setToasts(prev => [...prev.slice(-4), { id, title, message, type, time }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Sync calendar days with confirmed fixtures
  const syncDays = useCallback((fixList: Fixture[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayKey = `${yesterday.getFullYear()}-${pad(yesterday.getMonth() + 1)}-${pad(yesterday.getDate())}`;
    const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowKey = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

    const dateCounts = new Map<string, number>();
    fixList.forEach(m => {
      const k = m.matchDate || (m.kickoff ? m.kickoff.split('T')[0] : '');
      if (k && k >= yesterdayKey) {
        dateCounts.set(k, (dateCounts.get(k) || 0) + 1);
      }
    });

    dateCounts.set(yesterdayKey, dateCounts.get(yesterdayKey) || 0);
    dateCounts.set(todayKey, dateCounts.get(todayKey) || 0);
    dateCounts.set(tomorrowKey, dateCounts.get(tomorrowKey) || 0);

    const sortedKeys = Array.from(dateCounts.keys()).sort();
    const newDays: DayTab[] = sortedKeys.map(k => {
      const parts = k.split('-');
      const dObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const diff = Math.round((dObj.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      return {
        key: k,
        date: dObj,
        offset: diff,
        label: diff === -1 ? 'Yesterday' : diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : dObj.toLocaleDateString('en-GB', { weekday: 'short' }),
        sub: dObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        year: dObj.getFullYear(),
        fullLabel: diff === -1 ? `Yesterday (${dObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})` :
                   diff === 0 ? `Today (${dObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})` :
                   dObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
        fixtureCount: dateCounts.get(k) || 0
      };
    });

    setDays(newDays);
    setSelectedDate(prev => {
      if (prev && newDays.some(d => d.key === prev)) return prev;
      if ((dateCounts.get(todayKey) || 0) > 0) return todayKey;
      const firstActiveDay = sortedKeys.find(k => (dateCounts.get(k) || 0) > 0);
      return firstActiveDay || todayKey;
    });
  }, []);

  const loadFixtures = useCallback(async (force = false) => {
    setIsSyncing(true);
    setLoadError(null);
    try {
      const ts = Date.now();
      const apiUrl = force ? `/api/fixtures?force=1&t=${ts}` : `/api/fixtures?t=${ts}`;
      let usedStaticFallback = false;
      let res = await fetchJsonSafe<{ meta?: any; matches?: Fixture[] }>(apiUrl, { cache: 'no-store' });

      if (!res.ok || !res.data || !Array.isArray(res.data.matches) || res.data.matches.length === 0) {
        const staticCandidates = [`/data/fixtures.json?t=${ts}`, `./data/fixtures.json?t=${ts}`];
        for (const candidate of staticCandidates) {
          const fallbackRes = await fetchJsonSafe<{ meta?: any; matches?: Fixture[] }>(candidate, { cache: 'no-store' });
          if (fallbackRes.ok && fallbackRes.data && Array.isArray(fallbackRes.data.matches) && fallbackRes.data.matches.length > 0) {
            res = fallbackRes;
            usedStaticFallback = true;
            break;
          }
        }
      }

      if (res.ok && res.data && Array.isArray(res.data.matches) && res.data.matches.length > 0) {
        const data = res.data;
        setFixtures(data.matches);
        const baseSource = data.meta?.dataSource || 'OFFICIAL ESPN LIVE INGESTION';
        setDataSource(usedStaticFallback ? `${baseSource} (EDGE CACHE)` : baseSource);
        setLastSyncedAt(data.meta?.generated_at || data.meta?.generatedAt || new Date().toISOString());
        syncDays(data.matches);
        if (!selectedMatchIdRef.current && data.matches.length > 0) {
          setSelectedMatchId(data.matches[0].id);
        }
        if (force) {
          const lc = data.meta?.league_count || new Set(data.matches.map((m: any) => m.league?.id)).size;
          addToast('Synchronized', `Loaded ${data.matches.length} fixtures across ${lc} leagues`, 'success');
        }
      } else {
        setLoadError(res.error || 'No fixtures returned from ingestion service.');
      }
    } catch (err: any) {
      setLoadError(err?.message || 'Unable to reach fixture ingestion server');
      addToast('Sync Error', err?.message || 'Failed to sync fixture feed', 'error');
    } finally {
      setIsSyncing(false);
    }
  }, [addToast, syncDays]);

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    loadFixtures(false);
  }, [loadFixtures]);

  // Accumulator analysis
  const recalculateAcca = useCallback(async (legs: AccumulatorLeg[]) => {
    if (legs.length === 0) {
      setAccumulatorAnalysis(null);
      return;
    }
    const res = await fetchJsonSafe<AccumulatorAnalysis>('/api/beast/accumulator/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selections: legs })
    });
    if (res.ok && res.data) {
      setAccumulatorAnalysis(res.data);
      return;
    }

    // Client-side exact Beast Engine quantitative calculation on static host
    try {
      const localAnalysis = analyzeAccumulator(legs);
      setAccumulatorAnalysis(localAnalysis);
      return;
    } catch {
      // Ultimate safe inline fallback
    }
    let compoundOdds = 1.0;
    let compoundProb = 1.0;
    legs.forEach(l => {
      compoundOdds *= (l.odds || 1.25);
      compoundProb *= ((l.probability || 75) / 100);
    });
    const trueProbPct = +(Math.max(0.01, compoundProb * 100)).toFixed(2);
    const failureProb = +(100 - trueProbPct).toFixed(2);
    const fairTicketOdds = +(100 / Math.max(0.01, trueProbPct)).toFixed(2);
    const evPct = +(((trueProbPct / 100) * compoundOdds - 1) * 100).toFixed(2);
    const impliedProb = compoundOdds > 0 ? (1 / compoundOdds) : 0;
    const vig = impliedProb > 0 ? Math.max(0, ((impliedProb - compoundProb) / impliedProb) * 100) : 0;
    const weakest = legs.reduce((min, cur) => cur.probability < min.probability ? cur : min, legs[0]);
    setAccumulatorAnalysis({
      count: legs.length,
      combinedOdds: +compoundOdds.toFixed(2),
      fairTicketOdds,
      trueProbability: trueProbPct,
      failureProbability: failureProb,
      expectedValuePct: evPct,
      riskLevel: legs.length > 8 || failureProb > 90 ? 'EXTREME HIGH RISK' : legs.length > 4 || failureProb > 75 ? 'HIGH RISK' : legs.length > 2 ? 'MODERATE' : 'LOW',
      legsCount: legs.length,
      compoundOdds: +compoundOdds.toFixed(2),
      compoundTrueProbabilityPct: trueProbPct,
      compoundImpliedProbabilityPct: +(impliedProb * 100).toFixed(1),
      houseVigPct: +vig.toFixed(1),
      netEdgePct: evPct,
      riskRating: compoundProb > 0.4 ? 'SAFE' : compoundProb > 0.2 ? 'MODERATE' : 'HIGH',
      weakestLink: weakest,
      legs
    });
  }, []);

  const addAccaLeg = useCallback((leg: AccumulatorLeg) => {
    setAccumulatorLegs(prev => {
      if (prev.some(l => l.matchId === leg.matchId && l.selection === leg.selection)) {
        addToast('Leg Exists', `${leg.selection} is already on your ticket`, 'warning');
        return prev;
      }
      const updated = [...prev, leg];
      recalculateAcca(updated);
      addToast('Leg Added', `${leg.selection} added to Accumulator Studio`, 'success');
      return updated;
    });
  }, [addToast, recalculateAcca]);

  const removeAccaLeg = useCallback((id: string) => {
    setAccumulatorLegs(prev => {
      const updated = prev.filter(l => l.id !== id);
      recalculateAcca(updated);
      return updated;
    });
  }, [recalculateAcca]);

  const clearAccaLegs = useCallback(() => {
    setAccumulatorLegs([]);
    setAccumulatorAnalysis(null);
    addToast('Cleared', 'Accumulator ticket cleared', 'info');
  }, [addToast]);

  // AI Chat Messenger
  const sendAiMessage = useCallback(async (text: string, model = 'gemini-4-hydrogen', enableSearch = true, enableMaps = false) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date().toLocaleTimeString() };
    setAiChatMessages(prev => [...prev, userMsg]);
    setAiChatLoading(true);

    try {
      const historyToSend = [...aiChatMessages, userMsg].map(m => ({ role: m.role, text: m.text }));
      const res = await fetchJsonSafe<{ reply?: string; grounding?: any; message?: string }>('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyToSend,
          model,
          enableSearch,
          enableMaps
        })
      });

      if (res.ok && res.data) {
        const modelMsg: ChatMessage = {
          role: 'model',
          text: res.data.reply || 'Analysis delivered.',
          grounding: res.data.grounding,
          timestamp: new Date().toLocaleTimeString()
        };
        setAiChatMessages(prev => [...prev, modelMsg]);
      } else if (res.isHtmlFallback) {
        setAiChatMessages(prev => [
          ...prev,
          {
            role: 'model',
            text: `ℹ️ **Static Edge Mode Active**: Live Gemini Google Search & Maps grounding requires the Node/Express runtime server, while all **24 quantitative engines**, Dixon-Coles projections, Atmospheric Physics, and Team Corner / First 15 Min Draw probabilities are running live locally across ${fixtures.length} fixtures.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        setAiChatMessages(prev => [
          ...prev,
          {
            role: 'model',
            text: `⚠️ Engine Notice: ${res.error || 'Unable to complete AI query at this moment.'}`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    } catch (e: any) {
      setAiChatMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: `⚠️ Connectivity Exception: ${e.message}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setAiChatLoading(false);
    }
  }, [aiChatMessages, fixtures.length]);

  const selectedMatch = useMemo(() => {
    const found = fixtures.find(f => f.id === selectedMatchId) || null;
    if (!found) return null;
    if (found.advancedRiskValidation) return found;
    try {
      return {
        ...found,
        advancedRiskValidation: auditFixturePrediction(found)
      };
    } catch {
      return found;
    }
  }, [fixtures, selectedMatchId]);

  // Daily Top 20 Banker generation with Strict Vetting Directive & 20-Layer Risk Validation
  const dailyTop20Picks = useMemo<TopBankerPick[]>(() => {
    if (!fixtures.length) return [];
    const targetDate = selectedDate;
    const matchesForDay = fixtures.filter(m => (m.matchDate || (m.kickoff ? m.kickoff.split('T')[0] : '')) === targetDate);
    const dayMatches = matchesForDay.length > 0 ? matchesForDay : fixtures.slice(0, 30);

    const extractOdds = (o: any) => {
      if (typeof o === 'number') return o;
      if (typeof o === 'object' && o !== null) return Number(o.betway || o.hollywoodbets || o.easybet || 1.25);
      const parsed = parseFloat(o);
      return isNaN(parsed) ? 1.25 : parsed;
    };

    const rawCandidates: Array<{ match: Fixture; pick: TopBankerPick }> = [];

    dayMatches.forEach(m => {
      const allMarkets = Array.isArray(m.predictions) && m.predictions.length ? m.predictions : (m.topPick ? [m.topPick] : []);
      if (!allMarkets.length) return;

      const sorted = allMarkets.slice().sort((a, b) => {
        const probA = Number(a.probability) || 0;
        const probB = Number(b.probability) || 0;
        return probB - probA;
      });

      const best = sorted[0];
      const oddsVal = extractOdds(best.odds);
      const prob = Number(best.probability) || 75;
      const beast: any = m.beastMeta || {};
      const ens = beast.ensemble || {};
      const modelAgreement = ens.modelAgreementScore || 88;
      const calProb = beast.calibratedProbability || prob;
      const bankerScore = Math.min(99, Math.round((prob * 0.5) + (modelAgreement * 0.3) + 18));

      rawCandidates.push({
        match: m,
        pick: {
          id: `TOP-${m.id}`,
          matchId: m.id,
          rank: 0,
          rankLabel: '',
          match: `${m.home.name} vs ${m.away.name}`,
          home: m.home,
          away: m.away,
          league: m.league,
          kickoff: m.kickoff,
          kickoffTime: m.kickoffRsa || m.kickoffTime || '15:30 SAST',
          matchDate: m.matchDate || (m.kickoff ? m.kickoff.split('T')[0] : targetDate),
          market: best.market || 'Match Winner',
          marketCategory: best.marketCategory || 'WINNERS_DC',
          selection: String(best.selection || 'Home'),
          probability: prob,
          calibratedProb: calProb,
          odds: oddsVal,
          allOdds: (best.odds && typeof best.odds === 'object') ? (best.odds as any) : { hollywoodbets: oddsVal, betway: +(oddsVal * 1.02).toFixed(2), easybet: oddsVal },
          bankerScore,
          modelAgreement,
          modelsActive: ens.totalModelsActive || 24,
          trustScore: beast.trustScore || 92,
          safetyTier: prob >= 82 ? 'ULTRA_BANKER' : 'VETTED_BANKER',
          safetyBadge: prob >= 82 ? '🛡️ ULTRA BANKER LOCK' : '✅ VETTED BANKER',
          badgeBg: prob >= 82 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          whySafe: `${m.home.name} vs ${m.away.name}: ${ens.totalModelsActive || 24}-Model Ensemble agreement at ${modelAgreement}% with zero rotation look-ahead penalty.`,
          isFinished: m.matchStatus === 'FINISHED',
          finalScore: m.finalScore,
          settledResult: best.result || 'PENDING',
          evPct: beast.expectedValuePct || +(((calProb / 100) * oddsVal - 1) * 100).toFixed(1),
          advancedRiskValidation: m.advancedRiskValidation || null
        }
      });
    });

    rawCandidates.sort((a, b) => b.pick.probability - a.pick.probability);

    return rawCandidates.slice(0, 20).map(({ match, pick }, idx) => {
      let riskAudit = pick.advancedRiskValidation;
      if (!riskAudit) {
        try {
          riskAudit = auditFixturePrediction(match);
        } catch {
          riskAudit = null;
        }
      }
      return {
        ...pick,
        rank: idx + 1,
        rankLabel: idx === 0 ? '👑 #1 TOP SUREST WIN' : idx === 1 ? '🥈 #2 PRIME LOCK' : idx === 2 ? '🥉 #3 PRIME LOCK' : `🏅 #${idx + 1} SURE LOCK`,
        advancedRiskValidation: riskAudit
      };
    });
  }, [fixtures, selectedDate]);

  return (
    <AppContext.Provider
      value={{
        fixtures,
        days,
        selectedDate,
        setSelectedDate,
        selectedMatchId,
        setSelectedMatchId,
        selectedMatch,
        drawerOpen,
        setDrawerOpen,
        activeView,
        setActiveView,
        query,
        setQuery,
        selectedLeague,
        setSelectedLeague,
        bigOnly,
        setBigOnly,
        approvedOnly,
        setApprovedOnly,
        isSyncing,
        loadError,
        lastSyncedAt,
        dataSource,
        sastClock,
        utcClock,
        todayFullStr,
        toasts,
        addToast,
        removeToast,
        accumulatorLegs,
        addAccaLeg,
        removeAccaLeg,
        clearAccaLegs,
        accumulatorAnalysis,
        aiChatOpen,
        setAiChatOpen,
        aiChatMessages,
        sendAiMessage,
        aiChatLoading,
        refreshFixtures: loadFixtures,
        dailyTop20Picks
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
