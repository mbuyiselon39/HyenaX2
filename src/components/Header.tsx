import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Search, RefreshCw, Bot, ChevronDown, Clock, Menu, X, Check
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  desc?: string;
  count?: number;
}

export const Header: React.FC = () => {
  const {
    activeView, setActiveView,
    sastClock, utcClock,
    isSyncing, refreshFixtures,
    accumulatorLegs, setAiChatOpen,
    query, setQuery, dataSource
  } = useApp();

  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNavDropdownOpen(false);
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNavDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const primaryItems: NavItem[] = useMemo(() => [
    { id: 'daily-top15', label: 'Top 20 Bankers' },
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'beastboard', label: 'Beast Board' },
    { id: 'accumulator', label: 'Acca Studio', count: accumulatorLegs.length },
    { id: 'betslip', label: 'Slip X-Ray' },
  ], [accumulatorLegs.length]);

  const secondaryItems: NavItem[] = useMemo(() => [
    { id: 'validation', label: 'Validation Suite', desc: 'Walk-forward, CLV & 17 data sources' },
    { id: 'reality-check', label: 'Reality Check', desc: 'Probability calibration & trap check' },
    { id: 'discovery', label: 'Discovery', desc: 'Lineups, weather & steam alerts' },
    { id: 'performance', label: 'Performance', desc: 'Accuracy ledger & league ROI' },
    { id: 'bankroll', label: 'Bankroll', desc: 'Fractional Kelly & loss safeguards' },
    { id: 'admin', label: 'Admin Centre', desc: '17 scraper engines & live cache sync' },
  ], []);

  const allItems = useMemo(() => [...primaryItems, ...secondaryItems], [primaryItems, secondaryItems]);

  const navigateTo = (id: string) => {
    setActiveView(id);
    setNavDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isSecondaryActive = secondaryItems.some(i => i.id === activeView);
  const activeSecondaryLabel = secondaryItems.find(i => i.id === activeView)?.label;

  return (
    <header className="sticky top-0 z-30 border-b border-[#1D2A45] bg-[#070A13]/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 h-16 flex items-center justify-between gap-2 xl:gap-3">

        {/* ── Brand Zone ── */}
        <button
          onClick={() => navigateTo('daily-top15')}
          className="flex items-center gap-2 shrink-0 cursor-pointer group focus:outline-none"
          title="HyenaX · The Ndlela Millionaires GoldPack"
        >
          <div className="relative w-8 h-8 xl:w-9 xl:h-9 rounded-lg overflow-hidden p-0.5 bg-gradient-to-br from-[#00E5FF] via-[#7B2EFA] to-[#FF2E9D] shadow-[0_0_16px_-4px_rgba(0,229,255,0.5)]">
            <img
              src="/icons/icon.svg"
              alt="HyenaX"
              className="w-full h-full object-cover rounded-[6px]"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <div className="leading-none text-left whitespace-nowrap">
            <div className="flex items-baseline gap-0.5">
              <span className="font-display font-bold text-lg xl:text-xl tracking-tight text-white">Hyena</span>
              <span className="font-display font-extrabold text-lg xl:text-xl text-[#00E5FF]">X</span>
            </div>
            <div className="hidden 2xl:block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#00E5FF]/75 mt-0.5">
              GoldPack Engine
            </div>
          </div>
        </button>

        {/* ── Center Desktop Nav Zone (Single-Line, Zero Wrapping) ── */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-xl border border-[#1D2A45] bg-[#0B0F1A] shrink-0">
          {primaryItems.map(item => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`px-2 xl:px-3 py-1.5 rounded-lg font-display text-xs xl:text-[13px] font-semibold transition-colors flex items-center gap-1 xl:gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#131A2C] border border-transparent'
                }`}
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] leading-none bg-[#00E5FF] text-[#041118] font-extrabold font-num">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Expanding More Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setNavDropdownOpen(prev => !prev)}
              aria-expanded={navDropdownOpen}
              aria-haspopup="menu"
              className={`px-2 xl:px-3 py-1.5 rounded-lg font-display text-xs xl:text-[13px] font-semibold transition-colors flex items-center gap-1 xl:gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                isSecondaryActive || navDropdownOpen
                  ? 'bg-[#7B2EFA]/20 text-[#00E5FF] border border-[#7B2EFA]/50'
                  : 'text-slate-300 hover:text-white hover:bg-[#131A2C] border border-transparent'
              }`}
            >
              <span>{isSecondaryActive ? activeSecondaryLabel : 'More'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${navDropdownOpen ? 'rotate-180 text-[#00E5FF]' : 'text-slate-400'}`}
              />
            </button>

            {navDropdownOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 border border-[#1D2A45] bg-[#0B101D]/98 backdrop-blur-xl p-2 z-50 rounded-xl space-y-1 shadow-2xl"
              >
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Intelligence &amp; Risk Suite
                </div>
                {secondaryItems.map(item => {
                  const active = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      role="menuitem"
                      onClick={() => navigateTo(item.id)}
                      className={`w-full px-3 py-2 rounded-lg text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        active
                          ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30'
                          : 'text-slate-200 hover:bg-[#161F33] border border-transparent'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-display font-bold truncate">{item.label}</div>
                        {item.desc && (
                          <div className="text-[11px] text-slate-400 truncate">{item.desc}</div>
                        )}
                      </div>
                      {active && <Check className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* ── Right Utility Zone ── */}
        <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
          {/* Search Trigger (expands quick search bar cleanly without crowding nav) */}
          <button
            onClick={() => setSearchOpen(prev => !prev)}
            aria-expanded={searchOpen}
            aria-label="Toggle quick search"
            title={query ? `Filtering: "${query}"` : 'Search teams & leagues'}
            className={`relative p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
              searchOpen || query
                ? 'border-[#00E5FF]/60 bg-[#00E5FF]/15 text-[#00E5FF]'
                : 'border-[#1D2A45] bg-[#0B0F1A] text-slate-300 hover:text-white hover:border-[#00E5FF]/40'
            }`}
          >
            <Search className="w-4 h-4" />
            {query && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00E5FF]" />
            )}
          </button>

          {/* Compact SAST / UTC Clock */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg border border-[#1D2A45] bg-[#0B0F1A] shrink-0"
            title={`${utcClock} · ${dataSource}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <div className="flex items-center gap-1 text-[11px] xl:text-xs font-bold text-[#00E5FF] font-num whitespace-nowrap">
              <Clock className="w-3 h-3 text-[#00E5FF]/80" />
              <span>{sastClock}</span>
            </div>
          </div>

          {/* Sync */}
          <button
            onClick={() => refreshFixtures(true)}
            disabled={isSyncing}
            className="p-2 rounded-lg border border-[#1D2A45] bg-[#0B0F1A] text-slate-300 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title={`Force sync live ESPN feed (${dataSource})`}
            aria-label="Synchronize live fixtures"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#00E5FF]' : ''}`} />
          </button>

          {/* AI Oracle */}
          <button
            onClick={() => setAiChatOpen(true)}
            className="btn-primary hidden sm:flex items-center gap-1.5 px-2.5 xl:px-3 py-2 text-xs whitespace-nowrap shrink-0 cursor-pointer"
            title="Open the Quantitative AI Oracle"
          >
            <Bot className="w-4 h-4 shrink-0" />
            <span>AI Oracle</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-lg border border-[#1D2A45] bg-[#0B0F1A] text-slate-200 hover:border-[#00E5FF]/50 cursor-pointer shrink-0"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer Strip */}
      {searchOpen && (
        <div className="border-t border-[#1D2A45] bg-[#0A0E19]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-2.5 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00E5FF]" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim() && activeView !== 'fixtures') {
                    setActiveView('fixtures');
                  }
                }}
                placeholder="Search club, league, or country across all 141 competitions..."
                className="futuristic-input w-full pl-9 pr-9 text-xs"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="px-3 py-2 rounded-lg border border-[#1D2A45] text-xs font-medium text-slate-300 hover:text-white cursor-pointer shrink-0"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Mobile Expandable Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1D2A45] bg-[#080B14]/98 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {allItems.map(item => {
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-display font-semibold flex items-center justify-between gap-2 cursor-pointer ${
                      active
                        ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40'
                        : 'text-slate-200 bg-[#0E131F] hover:bg-[#1A2236] border border-transparent'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-[#00E5FF] text-[#041118] font-bold font-num shrink-0">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1D2A45]">
              <span className="text-[11px] font-num text-slate-400 truncate">
                {sastClock} · {utcClock}
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAiChatOpen(true);
                }}
                className="sm:hidden btn-primary px-3 py-2 flex items-center gap-1.5 text-xs cursor-pointer shrink-0"
              >
                <Bot className="w-4 h-4" />
                <span>AI Oracle</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
