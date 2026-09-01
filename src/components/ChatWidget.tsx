'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Phone, ArrowRight } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hello! I am Synapse AI Technical Consultant. Ask me about Siemens PLC parts, HiTHIUM 11,000-cycle battery sizing, daily tech gadgets, or direct China factory sourcing in English, Bangla, or Banglish.'
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
            text: 'For immediate factory wholesale quotes, please WhatsApp our engineers directly at +8801886113236.'
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Technical hotline is online! Please connect directly with our engineering team on WhatsApp: +880 1886-113236.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-[#12151c] hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-slate-950 font-bold text-xs shadow-2xl transition-all hover:scale-105"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 live-dot" />
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
          <span className="hidden sm:inline">AI Engineering Advisor</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl bg-[#0e1117] border border-white/10 shadow-2xl flex flex-col overflow-hidden text-left animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#141822] border-b border-white/[0.08] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span>Synapse AI Consultant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
                </div>
                <div className="text-[10px] text-amber-400/80">Gemini 3.6 Flash • Multilingual</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[82%] whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-[#181d26] text-slate-200 border border-white/[0.06]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-8">
                <span className="animate-spin text-amber-400">●</span>
                <span>Consulting engineering catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Direct Fallback Banner */}
          <div className="px-4 py-2 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-medium">Need instant human reply?</span>
            <a
              href="https://wa.me/8801886113236"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline font-bold"
            >
              WhatsApp Us ↗
            </a>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-[#12151c] border-t border-white/[0.08] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about PLC modules, battery sizing, gadgets..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0b0d11] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
