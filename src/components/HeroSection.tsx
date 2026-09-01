'use client';

import React, { useState } from 'react';
import { ArrowRight, Search, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';

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
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 craft-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#e85d04] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#059669] live-dot" />
              <span>Direct Factory Supply Desk • Dhaka & Guangdong</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#1a1a1a] tracking-tight leading-[1.1]">
              Authentic Engineering Supply & <br />
              <span className="text-[#e85d04]">Direct-From-China Tech.</span>
            </h1>

            <p className="text-[#4a5568] text-base sm:text-lg leading-relaxed max-w-2xl">
              Direct factory procurement with on-ground video QC in China. From genuine <strong className="text-[#1a1a1a]">Siemens & Schneider</strong> industrial automation and <strong className="text-[#1a1a1a]">HiTHIUM 11,000-cycle LiFePO₄ batteries</strong> to <strong className="text-[#1a1a1a]">daily tech gadgets</strong> delivered straight to your door in Bangladesh.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl">
              <div className="p-2 rounded-2xl bg-white border border-black/[0.08] hover:border-[#e85d04]/40 transition-all flex items-center gap-3 shadow-lg">
                <Search className="w-5 h-5 text-[#a0aec0] ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Part No. (6ES7, LC1K) or Gadget (GaN, LiFePO4)..."
                  className="flex-1 bg-transparent text-[#1a1a1a] text-sm focus:outline-none placeholder:text-[#a0aec0]"
                />
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#1a3a5c] hover:bg-[#0f2a45] text-white font-bold text-xs shrink-0 transition-all shadow-sm">
                  Search
                </button>
              </div>
            </form>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#catalog-section" className="px-6 py-3 rounded-xl bg-[#1a3a5c] hover:bg-[#0f2a45] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md">
                <span>Browse Full Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#consumer-gadgets" className="px-6 py-3 rounded-xl bg-white hover:bg-[#f5f5f2] text-[#1a1a1a] border border-black/[0.08] font-bold text-xs flex items-center gap-2 transition-all">
                <Sparkles className="w-4 h-4 text-[#e85d04]" />
                <span>Daily Tech Gadgets</span>
              </a>
              <a href="https://wa.me/8801886113236?text=Hi%20Synapse%20Engineering,%20I%20have%20an%20inquiry." target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#059669] border border-emerald-200 font-bold text-xs flex items-center gap-2 transition-all">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          {/* Right Column: Featured Product */}
          <div className="lg:col-span-5 space-y-4">
            <div className="craft-card p-6 space-y-5 text-left border-orange-200/60 bg-gradient-to-b from-white to-[#fafaf8]">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-orange-50 text-[#e85d04] border border-orange-200">
                  FEATURED STORAGE
                </span>
                <span className="text-[11px] font-bold text-[#059669] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#059669] live-dot" />
                  Direct Stock
                </span>
              </div>

              <div className="h-44 rounded-xl bg-[#f5f5f2] p-3 flex items-center justify-center">
                <img src="https://synapse-engneering.com/wp-content/uploads/2026/03/HiTHIUM-HeroEE-16.png" alt="HiTHIUM HeroEE 16" className="max-h-full max-w-full object-contain" />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-[#e85d04] font-semibold">HiTHIUM • 11,000 Cycles Life</div>
                <h3 className="text-base font-bold text-[#1a1a1a]">HeroEE 16 — 16kWh LiFePO₄ Battery</h3>
                <p className="text-xs text-[#718096] line-clamp-2">Zero downtime industrial energy storage. Compatible with Deye, Growatt, and Sungrow hybrid systems.</p>
              </div>

              <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
                <div className="text-xs text-[#718096]">Warranty: <strong className="text-[#1a1a1a]">10 Years</strong></div>
                <button onClick={() => onOpenRFQ && onOpenRFQ('HiTHIUM HeroEE 16kWh Battery')} className="px-4 py-2 rounded-lg bg-[#1a3a5c] hover:bg-[#0f2a45] text-white font-bold text-xs transition-all">
                  Request Factory Quote
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="craft-card p-3.5 space-y-1">
                <div className="text-[11px] text-[#e85d04] font-bold">100% GENUINE</div>
                <div className="text-xs text-[#4a5568]">Original Siemens & HiTHIUM factory seals</div>
              </div>
              <div className="craft-card p-3.5 space-y-1">
                <div className="text-[11px] text-[#059669] font-bold">VIDEO QC BEFORE DISPATCH</div>
                <div className="text-xs text-[#4a5568]">Live test video from Shenzhen plant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
