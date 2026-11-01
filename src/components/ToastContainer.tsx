import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(t => {
        let borderClass = 'border-[#222E46] bg-[#0E131F]/95 text-slate-200';
        let icon = 'ℹ️';

        if (t.type === 'success') {
          borderClass = 'border-emerald-500/50 bg-[#0E1B16]/95 text-emerald-300';
          icon = '⚡';
        } else if (t.type === 'warning') {
          borderClass = 'border-amber-500/50 bg-[#1D1409]/95 text-amber-300';
          icon = '⚠️';
        } else if (t.type === 'error') {
          borderClass = 'border-rose-500/50 bg-[#1F0A0D]/95 text-rose-300';
          icon = '🛑';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-lg transform transition-all duration-300 animate-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="text-base shrink-0 mt-0.5">{icon}</div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="font-display font-bold text-xs text-white">{t.title}</div>
              <div className="text-[11px] leading-relaxed text-slate-300">{t.message}</div>
              <div className="text-[9px] font-num text-slate-400 mt-1">{t.time}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white shrink-0 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
