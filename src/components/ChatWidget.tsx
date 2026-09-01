'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Phone, ArrowRight, Terminal } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'SYNAPSE AI ENGINE ONLINE. Ask me about Siemens PLC compatibility, HiTHIUM 11,000-cycle battery sizing, or custom China direct machine sourcing.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: newMessages.slice(-6)
        })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'For immediate engineering assistance and custom part pricing, please contact our engineer directly on WhatsApp at +8801886113236.'
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Our technical team is on standby. Please call or WhatsApp us directly at +8801886113236.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-[#00f0ff] via-sky-500 to-blue-600 text-slate-950 font-extrabold shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all mono text-xs"
          aria-label="Open AI Engineering Consultant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00ff88] border-2 border-slate-950 live-telemetry-dot" />
          </div>
          <span className="hidden sm:inline">
            AI_TECH_ADVISOR [↵]
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[390px] h-[520px] rounded-2xl hud-panel bg-[#06080c] border border-[#00f0ff]/40 shadow-2xl shadow-[#00f0ff]/10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#090e17] border-b border-[#1a2234] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mono flex items-center gap-1.5">
                  SYNAPSE::AI_CONSULTANT
                </h4>
                <span className="text-[10px] text-[#00ff88] mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" /> TELEMETRY: ONLINE
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-[#070a10] border-b border-[#1a2234] flex gap-1.5 overflow-x-auto text-[10px] mono text-slate-400">
            <button
              onClick={() => setInput('HiTHIUM 16kWh battery specs & cycle life?')}
              className="px-2.5 py-1 rounded bg-[#090e17] border border-[#1a2234] hover:border-[#ffaa00]/40 hover:text-[#ffaa00] transition-colors whitespace-nowrap"
            >
              ⚡ HiTHIUM 16kWh
            </button>
            <button
              onClick={() => setInput('How to source obsolete machine parts from China?')}
              className="px-2.5 py-1 rounded bg-[#090e17] border border-[#1a2234] hover:border-[#00ff88]/40 hover:text-[#00ff88] transition-colors whitespace-nowrap"
            >
              🇨🇳 China QC
            </button>
            <button
              onClick={() => setInput('Siemens S7-1500 PLC availability in BD?')}
              className="px-2.5 py-1 rounded bg-[#090e17] border border-[#1a2234] hover:border-[#00f0ff]/40 hover:text-[#00f0ff] transition-colors whitespace-nowrap"
            >
              ⚙️ Siemens S7
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed mono">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[82%] text-[11px] ${
                    msg.role === 'user'
                      ? 'bg-[#00f0ff] text-slate-950 font-semibold'
                      : 'bg-[#090e17] text-slate-200 border border-[#1a2234] shadow-md'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-400 pl-8 mono">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-bounce delay-200" />
                <span className="ml-1 text-[10px] text-slate-500">QUERYING SPEC CATALOG...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-[#090e17] border-t border-[#1a2234] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask in English, বাংলা, or Banglish..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#06080c] border border-[#1a2234] text-white text-xs mono focus:outline-none focus:border-[#00f0ff]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] disabled:opacity-50 text-slate-950 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
