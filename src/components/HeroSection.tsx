'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Zap, MessageSquare, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenRFQ?: (productName?: string) => void;
  onSearch?: (term: string) => void;
}

export default function HeroSection({ onOpenRFQ, onSearch }: HeroSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 craft-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot" />
              <span>Direct Factory Supply Desk • Dhaka & Guangdong</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Authentic Engineering Supply & <br />
              <span className="text-amber-400">Direct-From-China Tech.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Direct factory procurement with on-ground video QC in China. From genuine <strong>Siemens & Schneider</strong> industrial automation and <strong>HiTHIUM 11,000-cycle LiFePO₄ batteries</strong> to <strong>daily tech gadgets</strong> delivered straight to your door in Bangladesh.
            </p>

            {/* Universal Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl">
              <div className="p-2 rounded-2xl bg-[#12151c] border border-white/10 hover:border-amber-500/40 transition-all flex items-center gap-3 shadow-xl">
                <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Part No. (e.g. 6ES7, LC1K) or Gadget (GaN, LiFePO4)..."
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog-section"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <span>Browse Full Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href="#consumer-gadgets"
                className="px-6 py-3 rounded-xl bg-[#181d26] hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Daily Tech Gadgets</span>
              </a>

              <a
                href="https://wa.me/8801886113236?text=Hi%20Synapse%20Engineering,%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Trust & Live Showcase */}
          <div className="lg:col-span-5 space-y-4">
            {/* Featured Product Card */}
            <div className="craft-card p-6 space-y-5 text-left border-amber-500/20 bg-gradient-to-b from-[#12151c] to-[#0e1117]">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  FEATURED STORAGE
                </span>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot" />
                  Direct Stock
                </span>
              </div>

              <div className="h-44 rounded-xl bg-[#181d26] p-3 flex items-center justify-center">
                <img
                  src="https://synapse-engneering.com/wp-content/uploads/2026/03/HiTHIUM-HeroEE-16.png"
                  alt="HiTHIUM HeroEE 16"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-amber-400 font-semibold">HiTHIUM • 11,000 Cycles Life</div>
                <h3 className="text-base font-bold text-white">HeroEE 16 — 16kWh LiFePO₄ Battery</h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Zero downtime industrial energy storage. Compatible with Deye, Growatt, and Sungrow hybrid systems.
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Warranty: <strong className="text-white">10 Years</strong>
                </div>
                <button
                  onClick={() => onOpenRFQ && onOpenRFQ('HiTHIUM HeroEE 16kWh Battery')}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
                >
                  Request Factory Quote
                </button>
              </div>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="craft-card p-3.5 space-y-1">
                <div className="text-[11px] text-amber-400 font-bold">100% GENUINE</div>
                <div className="text-xs text-slate-300">Original Siemens & HiTHIUM factory seals</div>
              </div>
              <div className="craft-card p-3.5 space-y-1">
                <div className="text-[11px] text-emerald-400 font-bold">VIDEO QC BEFORE DISPATCH</div>
                <div className="text-xs text-slate-300">Live test video from Shenzhen plant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
