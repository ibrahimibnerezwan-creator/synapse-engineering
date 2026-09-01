'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hello! I am Synapse AI Technical Consultant. Ask me about Siemens PLC parts, HiTHIUM 11,000-cycle battery sizing, daily tech gadgets, or direct China factory sourcing in English, Bangla, or Banglish.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userText, history: newMessages.slice(-6) }) });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply || 'For immediate factory wholesale quotes, please WhatsApp our engineers directly at +8801886113236.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Technical hotline is online! Please connect directly with our engineering team on WhatsApp: +880 1886-113236.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-white hover:bg-[#1a3a5c] border border-black/[0.08] hover:border-[#1a3a5c] text-[#1a3a5c] hover:text-white font-bold text-xs shadow-lg transition-all hover:scale-105">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669] live-dot" />
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Engineering Advisor</span>
        </button>
      )}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl bg-white border border-black/[0.08] shadow-2xl flex flex-col overflow-hidden text-left">
          <div className="p-4 bg-[#fafaf8] border-b border-black/[0.06] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1a3a5c] text-white flex items-center justify-center font-bold"><Bot className="w-4 h-4" /></div>
              <div>
                <div className="font-bold text-xs text-[#1a1a1a] flex items-center gap-1.5"><span>Synapse AI Consultant</span><span className="w-1.5 h-1.5 rounded-full bg-[#059669] live-dot" /></div>
                <div className="text-[10px] text-[#e85d04]">Gemini 3.6 Flash • Multilingual</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-[#718096] hover:text-[#1a1a1a] hover:bg-[#f5f5f2] transition-colors"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed bg-[#fafaf8]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0284c7] flex items-center justify-center shrink-0 mt-0.5"><Bot className="w-3.5 h-3.5" /></div>}
                <div className={`p-3 rounded-xl max-w-[82%] whitespace-pre-line ${m.role === 'user' ? 'bg-[#1a3a5c] text-white font-medium' : 'bg-white text-[#1a1a1a] border border-black/[0.06]'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex gap-2 items-center text-[#718096] text-xs pl-8"><span className="animate-spin text-[#e85d04]">●</span><span>Consulting engineering catalog...</span></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-[11px]">
            <span className="text-[#059669] font-medium">Need instant human reply?</span>
            <a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a] hover:underline font-bold">WhatsApp Us ↗</a>
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-black/[0.06] flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about PLC modules, battery sizing, gadgets..." className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-black/[0.08] text-[#1a1a1a] text-xs placeholder:text-[#a0aec0] focus:outline-none focus:border-[#e85d04]" />
            <button type="submit" disabled={loading || !input.trim()} className="p-2.5 rounded-xl bg-[#1a3a5c] hover:bg-[#0f2a45] disabled:opacity-50 text-white transition-all shadow-sm"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      )}
    </div>
  );
}
