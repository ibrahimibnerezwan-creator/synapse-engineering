'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sun, Cpu, CheckCircle2, Zap, Search } from 'lucide-react';

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
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 tech-grid-bg">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & High-Converting Messaging */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-400 text-xs font-semibold tracking-wide">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              DIRECT CHINA PROCUREMENT & FACTORY ENGINEERING CONTRACTOR
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Industrial Automation, <br />
              <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
                Solar LiFePO₄ Storage
              </span> <br />
              & Global China Supply
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              We eliminate industrial downtime with authentic <strong>Siemens & Schneider</strong> automation parts, 
              Tier-1 <strong>HiTHIUM 11,000-cycle LiFePO₄ battery systems</strong>, and dedicated on-ground factory sourcing 
              with personal quality inspection in China delivered directly to Bangladesh.
            </p>

            {/* Quick Part Number Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Part No (e.g. 6ES7532, LC1K, HiTHIUM 16kWh)..."
                  className="w-full pl-12 pr-32 py-3.5 rounded-xl bg-slate-900/90 border border-sky-500/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all shadow-md"
                >
                  Find Part
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onOpenRFQ?.()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Request Part Quotation (RFQ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#sourcing"
                className="px-6 py-3.5 rounded-xl glass-panel text-slate-200 hover:text-white font-semibold text-sm hover:border-sky-400/50 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Custom China Sourcing</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Guaranteed Authentic</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>On-Ground China QC</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>7-10 Days Air Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Interactive Hardware Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl glass-panel p-6 border border-sky-500/30 shadow-2xl shadow-sky-950/50 space-y-6">
              {/* Card Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                    Featured Industrial Tech
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">Dhaka & China Hub</span>
              </div>

              {/* Product Highlight 1: HiTHIUM 16kWh Battery Pack */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      HiTHIUM LiFePO₄
                    </span>
                    <span className="text-[11px] text-emerald-400">11,000 Cycles</span>
                  </div>
                  <h2 className="text-sm font-bold text-white truncate mt-1">
                    HeroEE 16kWh Portable Battery Pack
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">51.2V 314Ah • CAN/RS485 Protocol</p>
                </div>
              </div>

              {/* Product Highlight 2: Siemens S7-1500 PLC */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/20 hover:border-sky-500/40 transition-all flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Cpu className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      Siemens SIMATIC
                    </span>
                    <span className="text-[11px] text-slate-400">S7-1500 Series</span>
                  </div>
                  <h2 className="text-sm font-bold text-white truncate mt-1">
                    6ES7532-5HD00-0AB0 Analog Output
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">AQ 4xU/I ST • 16-Bit Resolution</p>
                </div>
              </div>

              {/* Sourcing Metric Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">China Direct Sourcing Time</div>
                  <div className="text-base font-bold text-emerald-400">7-10 Days Air Express</div>
                </div>
                <button
                  onClick={() => onOpenRFQ?.('China Direct Sourcing Inquiry')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Inquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
