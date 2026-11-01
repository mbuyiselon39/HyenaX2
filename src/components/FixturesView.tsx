import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  PlusCircle,
  CheckCircle2,
  Calendar,
  SlidersHorizontal,
  Flame,
  CheckCircle
} from 'lucide-react';
import { Fixture } from '../types.ts';

export const FixturesView: React.FC = () => {
  const {
    fixtures,
    days,
    selectedDate,
    setSelectedDate,
    query,
    setQuery,
    selectedLeague,
    setSelectedLeague,
    bigOnly,
    setBigOnly,
    approvedOnly,
    setApprovedOnly,
    setSelectedMatchId,
    setDrawerOpen,
    addAccaLeg,
    accumulatorLegs
  } = useApp();

  const [openLeagues, setOpenLeagues] = useState<Record<string, boolean>>({});

  const toggleLeague = (lid: string) => {
    setOpenLeagues(prev => ({ ...prev, [lid]: prev[lid] === false }));
  };

  const allLeagues = useMemo(() => {
    const map = new Map<string, { id: string; name: string; flag: string; count: number }>();
    fixtures.forEach(f => {
      const lid = f.league.id;
      if (!map.has(lid)) {
        map.set(lid, { id: lid, name: f.league.name, flag: f.league.flag, count: 1 });
      } else {
        map.get(lid)!.count++;
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [fixtures]);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sel = selectedLeague;

    // Filter list
    const list = fixtures.filter(m => {
      const matchDateKey = m.matchDate || (m.kickoff ? m.kickoff.split('T')[0] : '');
      const dateMatch = selectedDate === 'all' || q ? true : matchDateKey === selectedDate;
      const bigMatch = !bigOnly || m.isBig;
      const appMatch = !approvedOnly || m.approvalStatus === 'APPROVED' || m.isVettedApproved;
      const leagueMatch = !sel || m.league.id === sel;
      const queryMatch = !q || m.home.name.toLowerCase().includes(q) || m.away.name.toLowerCase().includes(q) || m.league.name.toLowerCase().includes(q);

      return dateMatch && bigMatch && appMatch && leagueMatch && queryMatch;
    });

    const groupsMap = new Map<string, { league: any; matches: Fixture[] }>();
    list.forEach(m => {
      const lid = m.league.id;
      if (!groupsMap.has(lid)) {
        groupsMap.set(lid, { league: m.league, matches: [m] });
      } else {
        groupsMap.get(lid)!.matches.push(m);
      }
    });

    return Array.from(groupsMap.values());
  }, [fixtures, selectedDate, query, selectedLeague, bigOnly, approvedOnly]);

  const totalFilteredCount = filteredGroups.reduce((acc, g) => acc + g.matches.length, 0);

  return (
    <div className="space-y-6">
      
      {/* Date Strip & Controls */}
      <div className="flex flex-col gap-4">
        
        {/* Date Tabs Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedDate('all')}
            className={`shrink-0 px-3 py-2 rounded-xl border text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
              selectedDate === 'all'
                ? 'border-amber-500 bg-amber-500/20 text-amber-200 font-bold'
                : 'border-[#222E46] bg-[#0E131F] text-slate-400 hover:text-white'
            }`}
          >
            All Dates
          </button>

          {days.map(day => {
            const isSelected = selectedDate === day.key;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDate(day.key)}
                className={`shrink-0 px-3 py-2 rounded-xl border text-xs transition-all flex flex-col items-center min-w-[76px] cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/20 text-amber-200 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'border-[#222E46] bg-[#0E131F] text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-display uppercase tracking-wider">{day.label}</span>
                <span className="text-[10px] opacity-80 font-num">{day.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-[#222E46] bg-[#0E131F]">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search club, competition, or country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* League Dropdown */}
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All Competitions ({allLeagues.length})</option>
              {allLeagues.map(l => (
                <option key={l.id} value={l.id}>
                  {l.flag} {l.name} ({l.count})
                </option>
              ))}
            </select>

            {/* Big Matches Toggle */}
            <button
              onClick={() => setBigOnly(!bigOnly)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                bigOnly
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-[#222E46] bg-[#080A0F] text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Marquee</span>
            </button>

            {/* Approved Toggle */}
            <button
              onClick={() => setApprovedOnly(!approvedOnly)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                approvedOnly
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  : 'border-[#222E46] bg-[#080A0F] text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vetted</span>
            </button>
          </div>
        </div>
      </div>

      {/* Match Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {totalFilteredCount} fixtures across {filteredGroups.length} competitions</span>
        {query && (
          <button onClick={() => setQuery('')} className="text-amber-400 hover:underline">
            Clear search
          </button>
        )}
      </div>

      {/* Fixtures Grouped by Competition */}
      {filteredGroups.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-2">
          <p className="text-sm font-bold text-slate-300">No scheduled fixtures match your criteria.</p>
          <p className="text-xs text-slate-500">Try clearing competition or keyword filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map(group => {
            const isOpen = openLeagues[group.league.id] !== false;

            return (
              <div
                key={group.league.id}
                className="rounded-2xl border border-[#222E46] bg-[#0E131F] overflow-hidden"
              >
                {/* Competition Header */}
                <button
                  onClick={() => toggleLeague(group.league.id)}
                  className="w-full px-4 py-3 bg-[#111827]/80 hover:bg-[#141C2E] flex items-center justify-between border-b border-[#222E46]/60 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{group.league.flag}</span>
                    <span className="font-display font-bold text-sm text-white">
                      {group.league.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-num font-bold">
                      {group.matches.length}
                    </span>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Match Cards Inside Accordion */}
                {isOpen && (
                  <div className="divide-y divide-[#222E46]/50">
                    {group.matches.map(match => {
                      const top = match.topPick || (match.predictions && match.predictions[0]) || {
                        market: 'Highest Scoring Half',
                        selection: '2nd Half or Equal',
                        probability: 77.2,
                        odds: 1.36
                      };
                      const prob = top ? Number(top.probability) : 75;
                      const oddsVal = top?.odds ? (typeof top.odds === 'object' ? Number(top.odds.betway || top.odds.hollywoodbets || 1.35) : Number(top.odds)) : 1.35;
                      const isAccaAdded = accumulatorLegs.some(l => l.matchId === match.id);

                      return (
                        <div
                          key={match.id}
                          onClick={() => {
                            setSelectedMatchId(match.id);
                            setDrawerOpen(true);
                          }}
                          className="p-4 hover:bg-[#121929] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                        >
                          {/* Match Info: Time + Teams */}
                          <div className="flex items-center gap-4 min-w-[260px] flex-1">
                            <div className="text-center shrink-0 w-16">
                              <span className="text-xs font-bold font-num text-slate-300 block">
                                {match.kickoffRsa || match.kickoffTime || '15:30 SAST'}
                              </span>
                              {match.matchStatus === 'FINISHED' ? (
                                <span className="text-[10px] font-bold text-emerald-400">FT</span>
                              ) : match.matchStatus === 'IN_PLAY' ? (
                                <span className="text-[10px] font-bold text-amber-400 animate-pulse">LIVE</span>
                              ) : (
                                <span className="text-[9px] text-slate-500 font-num">Upcoming</span>
                              )}
                            </div>

                            <div className="space-y-1 flex-1">
                              {/* Home Team */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {match.home.logo ? (
                                    <img src={match.home.logo} alt="" className="w-5 h-5 object-contain" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-slate-800 text-[9px] flex items-center justify-center font-bold">
                                      {match.home.name.substring(0, 2)}
                                    </div>
                                  )}
                                  <span className="font-display font-bold text-sm text-white">
                                    {match.home.name}
                                  </span>
                                </div>
                                {match.score && (
                                  <span className="font-num font-bold text-sm text-white">
                                    {match.score.home}
                                  </span>
                                )}
                              </div>

                              {/* Away Team */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {match.away.logo ? (
                                    <img src={match.away.logo} alt="" className="w-5 h-5 object-contain" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-slate-800 text-[9px] flex items-center justify-center font-bold">
                                      {match.away.name.substring(0, 2)}
                                    </div>
                                  )}
                                  <span className="font-display font-bold text-sm text-slate-300">
                                    {match.away.name}
                                  </span>
                                </div>
                                {match.score && (
                                  <span className="font-num font-bold text-sm text-slate-300">
                                    {match.score.away}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Prediction Pill & Probability */}
                          {top && (
                            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                              <div className="p-2 px-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-right">
                                <div className="text-[10px] uppercase font-bold text-amber-400">
                                  {top.market}
                                </div>
                                <div className="font-display font-bold text-xs text-white">
                                  {top.selection}
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-sm font-black font-num text-emerald-400">
                                  {prob.toFixed(1)}%
                                </div>
                                <div className="text-[10px] font-num text-slate-400 font-bold">
                                  @{oddsVal.toFixed(2)}
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isAccaAdded) {
                                    addAccaLeg({
                                      id: `acca-${match.id}`,
                                      matchId: match.id,
                                      fixture: `${match.home.name} vs ${match.away.name}`,
                                      league: match.league.name,
                                      selection: top.selection,
                                      market: top.market,
                                      probability: prob,
                                      odds: oddsVal
                                    });
                                  }
                                }}
                                className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                                  isAccaAdded
                                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                                    : 'border-[#222E46] bg-[#141C2E] text-amber-300 hover:border-amber-500/50'
                                }`}
                              >
                                {isAccaAdded ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <PlusCircle className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
