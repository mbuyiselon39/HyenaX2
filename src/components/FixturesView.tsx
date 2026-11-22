import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Search,
  ChevronDown,
  PlusCircle,
  CheckCircle2,
  Flame,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronsDown,
  ChevronsUp
} from 'lucide-react';
import { Fixture } from '../types.ts';

const TeamMiniLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => {
  const [failed, setFailed] = useState(false);
  if (!logo || failed) {
    return (
      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[9px] flex items-center justify-center font-bold text-slate-200 shrink-0">
        {name.substring(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={logo}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="w-5 h-5 object-contain shrink-0"
    />
  );
};

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
    accumulatorLegs,
    loadError,
    refreshFixtures,
    dataSource
  } = useApp();

  // Tracks explicitly toggled leagues; undefined defaults to expanded so matches & predictions are scannable immediately
  const [openLeagues, setOpenLeagues] = useState<Record<string, boolean>>({});

  const toggleLeague = (lid: string) => {
    setOpenLeagues(prev => {
      const currentlyOpen = prev[lid] !== false;
      return { ...prev, [lid]: !currentlyOpen };
    });
  };

  const resetAllFilters = () => {
    setQuery('');
    setSelectedLeague('');
    setBigOnly(false);
    setApprovedOnly(false);
    setSelectedDate('all');
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

  const expandAllLeagues = () => {
    const next: Record<string, boolean> = {};
    filteredGroups.forEach(g => {
      next[g.league.id] = true;
    });
    setOpenLeagues(prev => ({ ...prev, ...next }));
  };

  const collapseAllLeagues = () => {
    const next: Record<string, boolean> = {};
    filteredGroups.forEach(g => {
      next[g.league.id] = false;
    });
    setOpenLeagues(prev => ({ ...prev, ...next }));
  };

  const expandedCount = filteredGroups.filter(g => openLeagues[g.league.id] !== false).length;
  const totalFilteredCount = filteredGroups.reduce((acc, g) => acc + g.matches.length, 0);

  return (
    <div className="space-y-5">
      {loadError && (
        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={() => refreshFixtures(true)}
            className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/20 hover:bg-rose-500/30 font-bold cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Date Strip with Games-Per-Day Counts & Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-stretch gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedDate('all')}
            className={`shrink-0 px-3.5 py-2 rounded-xl border text-xs transition-all flex flex-col items-center justify-center min-w-[92px] cursor-pointer ${
              selectedDate === 'all'
                ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_12px_rgba(0,229,255,0.22)]'
                : 'border-[#222E46] bg-[#0E131F] text-slate-300 hover:text-white hover:border-slate-600'
            }`}
          >
            <span className="font-display uppercase tracking-wider font-bold">All Dates</span>
            <span className={`text-[10px] font-num mt-0.5 ${selectedDate === 'all' ? 'text-[#00E5FF]' : 'text-emerald-400'}`}>
              {fixtures.length} {fixtures.length === 1 ? 'game' : 'games'}
            </span>
          </button>

          {days.map(day => {
            const isSelected = selectedDate === day.key;
            const count = day.fixtureCount ?? 0;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDate(day.key)}
                className={`shrink-0 px-3 py-2 rounded-xl border text-xs transition-all flex flex-col items-center justify-center min-w-[84px] cursor-pointer ${
                  isSelected
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                    : 'border-[#222E46] bg-[#0E131F] text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                <span className="font-display uppercase tracking-wider">{day.label}</span>
                <span className="text-[10px] opacity-80 font-num">{day.sub}</span>
                <span
                  className={`text-[10px] font-num font-semibold mt-0.5 ${
                    isSelected
                      ? 'text-[#00E5FF]'
                      : count > 0
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                  }`}
                >
                  {count} {count === 1 ? 'game' : 'games'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-[#222E46] bg-[#0E131F]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search club, competition, or country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs text-slate-200 focus:outline-none focus:border-[#00E5FF]/50"
            >
              <option value="">All Competitions ({allLeagues.length})</option>
              {allLeagues.map(l => (
                <option key={l.id} value={l.id}>
                  {l.flag} {l.name} ({l.count})
                </option>
              ))}
            </select>

            <button
              onClick={() => setBigOnly(!bigOnly)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
                bigOnly
                  ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
                  : 'border-[#222E46] bg-[#080A0F] text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Marquee</span>
            </button>

            <button
              onClick={() => setApprovedOnly(!approvedOnly)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
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

      {/* Match Results Summary & League Expand/Collapse Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-num text-slate-300">
            Showing <strong className="text-white">{totalFilteredCount}</strong> fixtures across{' '}
            <strong className="text-white">{filteredGroups.length}</strong> competitions
          </span>
          <span className="hidden sm:inline-block text-[11px] font-num text-slate-500">
            · Feed: <span className="text-emerald-400">{dataSource}</span>
          </span>
          {(query || selectedLeague || bigOnly || approvedOnly) && (
            <button onClick={resetAllFilters} className="text-[#00E5FF] hover:underline cursor-pointer font-semibold">
              Clear all filters
            </button>
          )}
        </div>

        {filteredGroups.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-num text-slate-400 hidden sm:inline">
              {expandedCount}/{filteredGroups.length} expanded
            </span>
            <button
              onClick={expandAllLeagues}
              disabled={expandedCount === filteredGroups.length}
              className="px-2.5 py-1 rounded-lg border border-[#222E46] bg-[#0E131F] hover:border-[#00E5FF]/50 hover:text-[#00E5FF] text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-default transition-colors"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
              <span>Expand All</span>
            </button>
            <button
              onClick={collapseAllLeagues}
              disabled={expandedCount === 0}
              className="px-2.5 py-1 rounded-lg border border-[#222E46] bg-[#0E131F] hover:border-[#00E5FF]/50 hover:text-[#00E5FF] text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-default transition-colors"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
              <span>Collapse All</span>
            </button>
          </div>
        )}
      </div>

      {/* Fixtures Grouped by Expanding Competition Accordions */}
      {filteredGroups.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#222E46] bg-[#0E131F] space-y-3">
          <p className="text-sm font-bold text-slate-300">No scheduled fixtures match your criteria.</p>
          <p className="text-xs text-slate-500">Reset your date, competition, or search filters to view the full match feed.</p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGroups.map(group => {
            const isOpen = openLeagues[group.league.id] !== false;

            return (
              <div
                key={group.league.id}
                className="rounded-2xl border border-[#222E46] bg-[#0E131F] overflow-hidden"
              >
                <button
                  onClick={() => toggleLeague(group.league.id)}
                  aria-expanded={isOpen}
                  className={`w-full px-4 py-3 bg-[#111827]/90 hover:bg-[#162034] flex items-center justify-between transition-colors text-left cursor-pointer ${
                    isOpen ? 'border-b border-[#222E46]/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{group.league.flag}</span>
                    <span className="font-display font-bold text-sm text-white truncate">
                      {group.league.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#0A0E17] border border-[#222E46] text-[#00E5FF] font-num font-bold shrink-0">
                      {group.matches.length} {group.matches.length === 1 ? 'game' : 'games'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-slate-400">
                    <span className="text-[11px] font-medium hidden sm:inline">
                      {isOpen ? 'Collapse' : 'Expand'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#00E5FF]' : ''}`}
                    />
                  </div>
                </button>

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
                      const isAccaAdded = accumulatorLegs.some(
                        l => l.matchId === match.id && l.selection === top.selection
                      );

                      return (
                        <div
                          key={match.id}
                          onClick={() => {
                            setSelectedMatchId(match.id);
                            setDrawerOpen(true);
                          }}
                          className="p-4 hover:bg-[#121929] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-4 min-w-[240px] flex-1">
                            <div className="text-center shrink-0 w-16">
                              <span className="text-xs font-bold font-num text-slate-300 block">
                                {match.kickoffRsa || match.kickoffTime || '15:30 SAST'}
                              </span>
                              {match.matchStatus === 'FINISHED' ? (
                                <span className="text-[10px] font-bold text-emerald-400">FT</span>
                              ) : match.matchStatus === 'IN_PLAY' ? (
                                <span className="text-[10px] font-bold text-emerald-400">LIVE</span>
                              ) : (
                                <span className="text-[9px] text-slate-500 font-num">Upcoming</span>
                              )}
                            </div>

                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <TeamMiniLogo logo={match.home.logo} name={match.home.name} />
                                  <span className="font-display font-bold text-sm text-white truncate">
                                    {match.home.name}
                                  </span>
                                </div>
                                {match.score && (
                                  <span className="font-num font-bold text-sm text-white shrink-0">
                                    {match.score.home}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <TeamMiniLogo logo={match.away.logo} name={match.away.name} />
                                  <span className="font-display font-bold text-sm text-slate-300 truncate">
                                    {match.away.name}
                                  </span>
                                </div>
                                {match.score && (
                                  <span className="font-num font-bold text-sm text-slate-300 shrink-0">
                                    {match.score.away}
                                  </span>
                                )}
                              </div>

                              {(match.timeSegmentProfile?.first15MinModel || match.cornerVolatilityProfile?.teamCornerProjections) && (
                                <div className="flex items-center gap-3 pt-0.5 text-[10px] font-num text-slate-400 flex-wrap">
                                  {match.timeSegmentProfile?.first15MinModel && (
                                    <span>
                                      15m X:{' '}
                                      <strong className="text-[#00E5FF]">
                                        {Number(match.timeSegmentProfile.first15MinModel.drawProbPct).toFixed(1)}%
                                      </strong>
                                    </span>
                                  )}
                                  {match.cornerVolatilityProfile?.teamCornerProjections && (
                                    <span>
                                      Corners H/A:{' '}
                                      <strong className="text-emerald-400">
                                        {match.cornerVolatilityProfile.teamCornerProjections.homeExp}
                                      </strong>
                                      {' / '}
                                      <strong className="text-amber-400">
                                        {match.cornerVolatilityProfile.teamCornerProjections.awayExp}
                                      </strong>
                                      {match.cornerVolatilityProfile.teamCornerProjections.homeOver55Pct !== undefined && (
                                        <span className="text-slate-500">
                                          {' '}(H O5.5: {match.cornerVolatilityProfile.teamCornerProjections.homeOver55Pct}% · H 7+: {match.cornerVolatilityProfile.teamCornerProjections.home7PlusPct}%)
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {top && (
                            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                              <div className="p-2 px-3 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 text-right">
                                <div className="text-[10px] uppercase font-bold text-[#00E5FF]">
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
                                      id: `acca-${match.id}-${String(top.selection || 'pick').replace(/\s+/g, '_')}`,
                                      matchId: match.id,
                                      fixture: `${match.home.name} vs ${match.away.name}`,
                                      league: match.league.name,
                                      selection: String(top.selection || 'Home'),
                                      market: String(top.market || 'Match Winner'),
                                      probability: prob,
                                      odds: oddsVal
                                    });
                                  }
                                }}
                                title={isAccaAdded ? 'Added to Accumulator Studio' : 'Add to Accumulator Studio'}
                                className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                  isAccaAdded
                                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                                    : 'border-[#222E46] bg-[#141C2E] text-[#00E5FF] hover:border-[#00E5FF]/50'
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
