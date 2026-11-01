import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  RefreshCw,
  Layers,
  ChevronDown,
  Shield,
  Activity,
  Bot
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    sastClock,
    utcClock,
    isSyncing,
    refreshFixtures,
    accumulatorLegs,
    setAiChatOpen,
    dailyTop20Picks
  } = useApp();

  const [navDropdownOpen, setNavDropdownOpen] = useState(false);

  const navItems = [
    { id: 'daily-top15', label: 'Daily Top 20', icon: '⭐', badge: `${dailyTop20Picks.length || 20}` },
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
  ];

  const activeModule = navItems.find(i => i.id === activeView);

  return (
    <header className="sticky top-0 z-30 border-b border-[#222E46] bg-[#080A0F]/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('daily-top15')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-[#FFE57F] via-[#F59E0B] to-[#78350F] shadow-[0_0_18px_-3px_rgba(245,158,11,0.5)] transition-transform duration-300 group-hover:scale-105">
              <img
                src="icons/icon.svg"
                alt="HyenaX"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="flex items-baseline gap-0.5">
                <span className="font-display font-black text-2xl tracking-tight text-white">Hyena</span>
                <span className="font-display font-black text-2xl text-[#F59E0B] drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">X</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/85">
                The Ndlela Millionaires GoldPack
              </div>
            </div>
          </button>
        </div>

        {/* Desktop View Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-[#0E131F] border border-[#222E46]">
          {navItems.slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === item.id
                  ? 'bg-[#F59E0B]/20 text-amber-300 border-amber-500/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-black font-extrabold font-num">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              className={`px-2.5 py-1.5 rounded-lg font-display text-xs font-semibold tracking-wider border transition-all flex items-center gap-1 cursor-pointer ${
                navItems.slice(5).some(i => i.id === activeView)
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>More</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {navDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0E131F] border border-[#222E46] shadow-2xl p-1.5 z-50">
                {navItems.slice(5).map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setNavDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      activeView === item.id ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400 text-black font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Time & Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* SAST Clock */}
          <div className="hidden sm:flex flex-col items-end text-right pr-2 border-r border-[#222E46]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-num">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{sastClock || '15:30 SAST'}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-num">
              {utcClock || '13:30 UTC'}
            </div>
          </div>

          {/* Sync Button */}
          <button
            onClick={() => refreshFixtures(true)}
            disabled={isSyncing}
            title="Force synchronization with live ESPN and Dixon-Coles models"
            className="p-2 rounded-xl border border-[#222E46] bg-[#0E131F] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Gemini AI Oracle Button */}
          <button
            onClick={() => setAiChatOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-amber-500/60 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 hover:bg-amber-500/30 font-display text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)] cursor-pointer"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">AI Oracle</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500 text-black font-black uppercase">
              Live
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-2 overflow-x-auto no-scrollbar border-t border-[#222E46]/80 bg-[#0A0E17]">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-display font-medium border flex items-center gap-1 ${
              activeView === item.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && (
              <span className="px-1 py-0.2 rounded text-[8px] bg-amber-400 text-black font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </header>
  );
};
