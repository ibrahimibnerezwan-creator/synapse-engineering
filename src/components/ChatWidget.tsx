'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Desk advisor. Ask about Siemens parts, HiTHIUM sizing, gadgets, or China sourcing — English, Bangla, or Banglish.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        body: JSON.stringify({ message: userText, history: newMessages.slice(-6) })
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'WhatsApp the engineers at +8801886113236 for a factory quote.'
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Hotline is up. WhatsApp +880 1886-113236.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#1c1612] text-[#f3ece3] text-[11px] tracking-[0.12em] uppercase shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-[#1f6b4a] live-dot" aria-hidden />
          Ask the desk
        </button>
      )}
      {isOpen && (
        <div className="w-[min(100vw-2rem,380px)] h-[520px] bg-[#fffdf8] border border-[rgba(28,22,18,0.18)] flex flex-col shadow-2xl">
          <div className="p-3.5 night flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-[#f3ece3]">Desk advisor</p>
              <p className="mono text-[10px] text-[#c9bdb0]">Multilingual · WhatsApp backup</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="p-1 text-[#c9bdb0] hover:text-[#f3ece3]" aria-label="Close chat">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed bg-[#f3ece3]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 max-w-[82%] whitespace-pre-line ${
                    m.role === 'user' ? 'bg-[#1c1612] text-[#f3ece3]' : 'bg-[#fffdf8] border border-[rgba(28,22,18,0.12)]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <p className="text-[#8a7e72] pl-1">Consulting the ledger…</p>}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-4 py-2 bg-[#cfe4d8] flex justify-between text-[11px]">
            <span className="text-[#1f6b4a]">Need a human?</span>
            <a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer" className="font-medium text-[#1c1612]">
              WhatsApp ↗
            </a>
          </div>
          <form onSubmit={handleSend} className="p-3 bg-[#fffdf8] border-t border-[rgba(28,22,18,0.12)] flex gap-2">
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="PLC, battery, gadget…"
              className="field flex-1"
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-ink p-2.5 disabled:opacity-40" aria-label="Send">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
