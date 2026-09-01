'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, ArrowRight, MessageSquare, BatteryCharging, Wifi, Sparkles, Check } from 'lucide-react';
import { Product } from '@/db/schema';

interface ConsumerPicksProps {
  products: Product[];
  onOpenRFQ?: (productName?: string) => void;
}

export default function ConsumerPicks({ products, onOpenRFQ }: ConsumerPicksProps) {
  const consumerItems = products.filter(
    (p) => p.category === 'Consumer Tech & Gadgets' || (p.price != null && p.price > 0)
  );

  const [activeCategory, setActiveCategory] = useState<'All' | 'Power' | 'Charging' | 'Smart Home'>('All');

  const filtered = consumerItems.filter((item) => {
    const subCat = (item.subCategory || '').toLowerCase();
    const title = (item.title || '').toLowerCase();

    if (activeCategory === 'All') return true;
    if (activeCategory === 'Power') return subCat.includes('power') || title.includes('power');
    if (activeCategory === 'Charging') return subCat.includes('charging') || title.includes('charger');
    if (activeCategory === 'Smart Home') return subCat.includes('smart') || title.includes('zigbee');
    return true;
  });

  return (
    <section id="consumer-gadgets" className="py-16 md:py-24 border-t border-white/[0.06] bg-[#0b0d11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct From Shenzhen Tech Hubs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Daily Tech Gadgets & Personal Electronics
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Curated everyday technology sourced directly from Tier-1 Chinese manufacturers with authentic warranty and direct door delivery across Bangladesh.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#12151c] border border-white/[0.08]">
            {(['All', 'Power', 'Charging', 'Smart Home'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            let parsedSpecs: Record<string, string> = {};
            try {
              parsedSpecs = JSON.parse(item.specs || '{}');
            } catch {}

            const priceVal = Number(item.price) || 0;

            return (
              <div
                key={item.id}
                className="craft-card flex flex-col justify-between p-6 group relative overflow-hidden"
              >
                <div className="space-y-5">
                  {/* Image Canvas */}
                  <div className="h-52 rounded-xl bg-[#181d26] border border-white/[0.04] p-4 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={item.primaryImage}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-md border border-white/10">
                      {item.brand}
                    </div>
                    {item.originCountry && (
                      <div className="absolute top-3 right-3 bg-amber-500/10 text-amber-400 text-[11px] font-medium px-2.5 py-1 rounded-md border border-amber-500/20">
                        {item.originCountry}
                      </div>
                    )}
                  </div>

                  {/* Title & Details */}
                  <div className="space-y-2 text-left">
                    <div className="text-xs text-amber-400 font-medium">{item.subCategory || 'Direct Import'}</div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Key Feature Badges */}
                  <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-left">
                    {Object.entries(parsedSpecs).slice(0, 3).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">{key}</span>
                        <span className="text-slate-300 font-medium truncate max-w-[60%] text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Direct Price</div>
                    <div className="text-lg font-bold text-white mono">
                      {priceVal > 0 ? `৳${priceVal.toLocaleString()}` : 'Factory Quote'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/8801886113236?text=${encodeURIComponent(
                        `Hi Sohel, I want to order/inquire about: ${item.title}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Order on WhatsApp</span>
                    </a>

                    <Link
                      href={`/products/${item.slug}`}
                      className="p-2 rounded-xl bg-[#181d26] hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
                      title="View Specs"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#12151c] to-[#181d26] border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">Looking for a specific gadget or electronics item from China?</h4>
            <p className="text-xs text-slate-400">
              Send us a photo or link from Taobao/1688 — Sohel will personally check the factory and deliver it to your doorstep.
            </p>
          </div>
          <a
            href="https://wa.me/8801886113236?text=Hi%20Sohel,%20I%20am%20looking%20for%20a%20custom%20gadget/item%20from%20China"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-2 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Request Custom Gadget</span>
          </a>
        </div>
      </div>
    </section>
  );
}
