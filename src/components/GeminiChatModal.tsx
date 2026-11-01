import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Bot,
  X,
  Send,
  Search,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  HelpCircle
} from 'lucide-react';

export const GeminiChatModal: React.FC = () => {
  const {
    aiChatOpen,
    setAiChatOpen,
    aiChatMessages,
    sendAiMessage,
    aiChatLoading
  } = useApp();

  const [input, setInput] = useState<string>('');
  const [model, setModel] = useState<string>('gemini-3.8-flash');
  const [enableSearch, setEnableSearch] = useState<boolean>(true);
  const [enableMaps, setEnableMaps] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatMessages, aiChatOpen]);

  if (!aiChatOpen) return null;

  const handleSend = () => {
    if (!input.trim() || aiChatLoading) return;
    const msg = input;
    setInput('');
    sendAiMessage(msg, model, enableSearch, enableMaps);
  };

  const starterPrompts = [
    "Analyze today's #1 surest win pick",
    "Explain the Layer 18 calendar fatigue formula",
    "How does 64-step Shin de-vigging strip bookmaker overround?",
    "Check travel fatigue for today's away teams"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-2xl bg-[#080A0F] border border-[#222E46] rounded-2xl h-[85vh] max-h-[750px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-[#222E46] bg-[#0E131F] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">HyenaX Beast AI Oracle</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Grounded
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Senior Quantitative Strategist & Risk Officer
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="hidden sm:block px-2.5 py-1.5 rounded-xl border border-[#222E46] bg-[#080A0F] text-[11px] text-slate-200 focus:outline-none"
            >
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Recommended)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite (Fast)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Math)</option>
            </select>

            <button
              onClick={() => setAiChatOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grounding Controls Strip */}
        <div className="px-4 py-2 border-b border-[#222E46]/60 bg-[#0A0E17] flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Grounding Tools:</span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEnableSearch(!enableSearch);
                if (!enableSearch) setEnableMaps(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                enableSearch
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                  : 'border-slate-800 text-slate-500'
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Google Search</span>
            </button>

            <button
              onClick={() => {
                setEnableMaps(!enableMaps);
                if (!enableMaps) setEnableSearch(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                enableMaps
                  ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                  : 'border-slate-800 text-slate-500'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Google Maps</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
          {aiChatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-amber-500/20 text-white border border-amber-500/40 font-medium'
                    : 'bg-[#0E131F] text-slate-200 border border-[#222E46]'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Grounding Citations */}
                {msg.grounding && (
                  <div className="pt-2 border-t border-[#222E46]/60 space-y-1">
                    {msg.grounding.searchSources && msg.grounding.searchSources.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block">Verified Citations:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.grounding.searchSources.slice(0, 3).map((s, i) => (
                            <a
                              key={i}
                              href={s.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center gap-1"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[180px]">{s.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.grounding.mapSources && msg.grounding.mapSources.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold block">Google Maps Venues:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.grounding.mapSources.slice(0, 2).map((m, i) => (
                            <a
                              key={i}
                              href={m.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-300 flex items-center gap-1"
                            >
                              <MapPin className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[180px]">{m.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {msg.timestamp && (
                  <div className="text-[9px] text-slate-500 font-num text-right">
                    {msg.timestamp}
                  </div>
                )}
              </div>
            </div>
          ))}

          {aiChatLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-300 animate-pulse pl-10">
              <span>Synthesizing Dixon-Coles goal distributions and live press telemetry...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Chips */}
        {aiChatMessages.length <= 2 && (
          <div className="px-4 py-2 border-t border-[#222E46]/60 bg-[#0A0E17] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {starterPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(p);
                }}
                className="shrink-0 px-2.5 py-1 rounded-lg border border-[#222E46] bg-[#0E131F] text-[11px] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-[#222E46] bg-[#0E131F]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about today's matches, bankers, or tactical distributions..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#222E46] bg-[#080A0F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />

            <button
              type="submit"
              disabled={!input.trim() || aiChatLoading}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
