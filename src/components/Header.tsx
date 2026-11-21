import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Search, RefreshCw, Bot, PanelLeft, Clock, Menu, ShieldAlert
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView, setActiveView,
    sastClock, utcClock, todayFullStr,
    isSyncing, refreshFixtures,
    accumulatorLegs, setAiChatOpen,
    query, setQuery, dataSource
  } = useApp();

  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = useMemo(() => [
    { id: 'daily-top15', label: 'Daily Top 20', icon: '⭐' },
    { id: 'fixtures', label: 'Fixtures', icon: '⚽' },
    { id: 'beastboard', label: 'Beast Board', icon: '🦁', badge: '+EV' },
    { id: 'accumulator', label: 'Acca Studio', icon: '📋', badge: accumulatorLegs.length > 0 ? `${accumulatorLegs.length}` : null },
    { id: 'betslip', label: 'Slip X-Ray', icon: '🔬', badge: 'OCR' },
    { id: 'validation', label: 'Validation Suite', icon: '🧪', badge: 'SHIELD' },
    { id: 'reality-check', label: 'Reality Check', icon: '🛡️', badge: 'SIM' },
    { id: 'discovery', label: 'Discovery', icon: '📡', badge: 'LIVE' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'bankroll', label: 'Bankroll', icon: '💰' },
    { id: 'admin', label: 'Admin', icon: '⚙️' },
  ], [accumulatorLegs.length]);

  const activeModule = navItems.find(i => i.id === activeView);

  const allViews = [
    { id: 'daily-top15', label: 'Daily Top 20' },
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'beastboard', label: 'Beast Board' },
    { id: 'accumulator', label: 'Acca Studio' },
    { id: 'betslip', label: 'Bet Slip X-Ray' },
    { id: 'validation', label: 'Validation Suite' },
    { id: 'reality-check', label: 'Reality Check' },
    { id: 'discovery', label: 'Discovery' },
    { id: 'performance', label: 'Performance' },
    { id: 'bankroll', label: 'Bankroll' },
    { id: 'admin', label: 'Admin Centre' },
  ];

  const navNav = (id: string) => {
    setActiveView(id);
    setNavDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-[#1D2A45] backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 h-20 flex items-center gap-4">

        {/* ── Brand: gradient logo + neon X ── */}
        <button
          onClick={() => navNav('daily-top15')}
          className="flex items-center gap-3.5 group shrink-0 cursor-pointer transition-transform duration-300 group-hover:scale-105"
        >
          <div className="relative w-12 h-12 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-[#00E5FF] via-[#7B2EFA] to-[#FF2E9D] shadow-[0_0_22px_-4px_rgba(0,229,255,0.55)]">
            <img src="icons/icon.svg" alt="HyenaX" className="w-full h-full object-cover rounded-[10px]"
                 onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline gap-0.5">
              <span className="font-display font-black text-2xl tracking-tight text-white">Hyena</span>
              <span className="font-display font-black text-2xl text-[#00E5FF] drop-shadow-[0_0_12px_rgba(0,229,255,0.65)]">X</span>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF]/80">
              The Ndlela Millionaires GoldPack
            </div>
          </div>
        </button>

        {/* ── Desktop nav: futures pills ── */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl border border-[#1D2A45] bg-[#0B0D16]">
          <button
            onClick={() => navNav('fixtures')}
            className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'fixtures'
                ? 'bg-[#00E5FF]/12 text-[#00E5FF] border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,.2)]'
                : 'text-slate-400 hover:text-[#00E5FF] border-transparent'
            }`}
          >
            <span>⚽</span><span>Fixtures</span>
          </button>

          {navItems.slice(1, 5).map(item => (
            <button
              key={item.id}
              onClick={() => navNav(item.id)}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === item.id
                  ? 'bg-[#00E5FF]/12 text-[#00E5FF] border-[#00E5FF]/50'
                  : 'text-slate-400 hover:text-[#00E5FF] border-transparent'
              }`}
            >
              <span>{item.icon}</span><span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#00E5FF]/15 text-[#00E5FF] font-extrabold font-num border border-[#00E5FF]/30">{item.badge}</span>
              )}
            </button>
          ))}

          {/* More dropdown */}
          <div className="relative" onClick={() => setNavDropdownOpen(!navDropdownOpen)}>
            <button
              className={`px-2.5 py-1.5 rounded-lg font-display text-xs font-semibold tracking-wider border transition-all flex items-center gap-1 cursor-pointer ${
                navItems.slice(5).some(i => i.id === activeView)
                  ? 'bg-[#7B2EFA]/20 text-[#7B2EFA] border-[#7B2EFA]/50'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <PanelLeft className="w-3.5 h-3.5 text-[#7B2EFA]" />
              <span>More</span>
              <span className="text-[10px] opacity-60">▼</span>
            </button>

            {navDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card border-[#1D2A45] p-1.5 z-50 rounded-xl space-y-0.5">
                {navItems.slice(5).map(item => (
                  <button
                    key={item.id}
                    onClick={() => navNav(item.id)}
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      activeView === item.id ? 'bg-[#00E5FF]/15 text-[#00E5FF]' : 'text-slate-300 hover:bg-[#1D2A45]'
                    }`}
                  >
                    <span className="flex items-center gap-2"><span>{item.icon}</span><span>{item.label}</span></span>
                    {item.badge && <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#00E5FF]/15 text-[#00E5FF] font-bold">{item.badge}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ── Center: global search (futuristic glass input) ── */}
        <div className="flex-1 hidden md:block relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#00E5FF]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams & leagues…"
            className="futuristic-input w-full pl-9"
          />
        </div>

        {/* ── Right: status pill + actions ── */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Engine status (live) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card border-border text-[11px]">
            <span className="live-dot w-2 h-2 rounded-full" />
            <span className="font-num text-[11px] font-bold text-[#00E5FF]">
              {dataSource}
            </span>
          </div>

          {/* SAST / UTC clocks */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00E5FF] font-num">
              <span>{sastClock}</span>
              <Clock className="w-3 h-3 text-[#00E5FF]" />
            </div>
            <div className="text-[10px] text-slate-400 font-num">{utcClock}</div>
          </div>

          {/* Sync */}
          <button
            onClick={() => refreshFixtures(true)}
            disabled={isSyncing}
            className="btn-ghost p-2"
            title="Force synchronization with live ESPN and Dixon-Coles models"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* AI Oracle */}
          <button
            onClick={() => setAiChatOpen(true)}
            className="btn-primary hidden sm:flex items-center gap-2 px-3.5 py-2"
            title="Open the quantitative AI Oracle"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Oracle</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-[#00E5FF] text-[#041118] font-black uppercase">Live</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden btn-ghost p-2"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown: all views */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-t border-[#1D2A45]">
          <div className="px-4 py-3 space-y-1">
            {allViews.map(v => (
              <button
                key={v.id}
                onClick={() => navNav(v.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-display flex items-center justify-between cursor-pointer ${
                  activeView === v.id ? 'bg-[#00E5FF]/15 text-[#00E5FF]' : 'text-slate-300 hover:bg-[#1D2A45]'
                }`}
              >
                <span className="flex items-center gap-2.5"><span className="font-semibold">{v.label}</span></span>
                {activeView === v.id && <ShieldAlert className="w-3.5 h-3.5 text-[#00E5FF]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
