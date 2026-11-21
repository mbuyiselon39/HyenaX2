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
    <div className="min-h-screen text-[#E2E8F0] antialiased selection:bg-[#00E5FF]/30 selection:text-white relative bg-[#05060A]">

      {/* Ambient: drifting neural grid */}
      <div className="ambient-grid fixed inset-0 pointer-events-none" />

      {/* Ambient: floating particle orbs */}
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div className="orb orb-d" />
      <div className="orb orb-e" />

      {/* Header */}
      <Header />

      {/* Main Content */}
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
      <footer className="border-t border-[#1D2A45] glass-card py-8 text-xs text-[#64748B] relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-display font-bold text-[#00E5FF]">
              HyenaX · The Ndlela Millionaires GoldPack
            </div>
            <div className="font-num">
              17-Model Unified Consensus Stack · Dixon-Coles Time-Decay Engine · South African Standard Time (SAST, UTC+2)
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <span className="px-2 py-0.5 rounded-full border border-[#00E5FF]/40 text-[#00E5FF] font-bold">
              18+ RESPONSIBLE
            </span>
            <span className="font-num">Zero-Risk Protocol Active</span>
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
