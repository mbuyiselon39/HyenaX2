import React from 'react';
import { useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { DailyTop20View } from './components/DailyTop20View.tsx';
import { FixturesView } from './components/FixturesView.tsx';
import { BeastBoardView } from './components/BeastBoardView.tsx';
import { AccaStudioView } from './components/AccaStudioView.tsx';
import { BetSlipXRayView } from './components/BetSlipXRayView.tsx';
import { ValidationView } from './components/ValidationView.tsx';
import { RealityCheckView } from './components/RealityCheckView.tsx';
import { DiscoveryView } from './components/DiscoveryView.tsx';
import { PerformanceView } from './components/PerformanceView.tsx';
import { BankrollView } from './components/BankrollView.tsx';
import { AdminCentreView } from './components/AdminCentreView.tsx';
import { MatchDrawer } from './components/MatchDrawer.tsx';
import { GeminiChatModal } from './components/GeminiChatModal.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';

export const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen text-slate-200 antialiased selection:bg-amber-500/30 selection:text-amber-200 relative bg-[#080A0F]">
      
      {/* Ambient background layers */}
      <div className="bg-grid fixed inset-0 pointer-events-none"></div>
      <div className="glow glow-gold"></div>
      <div className="glow glow-cyan"></div>
      <div className="glow glow-mint"></div>
      
      {/* Subtle pitch watermark */}
      <div className="pitch" aria-hidden="true">
        <svg viewBox="0 0 1000 620" fill="none" stroke="#F59E0B" strokeWidth="2">
          <rect x="10" y="10" width="980" height="600" rx="8"/>
          <line x1="500" y1="10" x2="500" y2="610"/>
          <circle cx="500" cy="310" r="92"/>
          <rect x="10" y="155" width="150" height="310"/>
          <rect x="840" y="155" width="150" height="310"/>
          <rect x="10" y="240" width="55" height="140"/>
          <rect x="935" y="240" width="55" height="140"/>
        </svg>
      </div>

      {/* Main Header */}
      <Header />

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 relative z-10 pb-20">
        {activeView === 'daily-top15' && <DailyTop20View />}
        {activeView === 'fixtures' && <FixturesView />}
        {activeView === 'beastboard' && <BeastBoardView />}
        {activeView === 'accumulator' && <AccaStudioView />}
        {activeView === 'betslip' && <BetSlipXRayView />}
        {activeView === 'validation' && <ValidationView />}
        {activeView === 'reality-check' && <RealityCheckView />}
        {activeView === 'discovery' && <DiscoveryView />}
        {activeView === 'performance' && <PerformanceView />}
        {activeView === 'bankroll' && <BankrollView />}
        {activeView === 'admin' && <AdminCentreView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222E46] bg-[#0A0E17] py-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-display font-bold text-slate-300">
              HyenaX · The Ndlela Millionaires GoldPack
            </div>
            <div>
              17-Model Unified Consensus Stack · Dixon-Coles Time-Decay Engine · South African Standard Time (SAST, UTC+2)
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="px-2 py-0.5 rounded border border-amber-500/30 text-amber-300 font-bold">
              18+ RESPONSIBLE
            </span>
            <span>Zero-Risk Protocol Active</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <MatchDrawer />
      <GeminiChatModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
