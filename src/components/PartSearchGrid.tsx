'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Package, ShieldCheck, ArrowRight, MessageSquare, ExternalLink, Filter } from 'lucide-react';
import { Product } from '@/db/schema';

interface PartSearchGridProps {
  initialProducts: Product[];
  onOpenRFQ?: (productName?: string) => void;
  filterTerm?: string;
}

const CATEGORIES = [
  'All Products',
  'Industrial Automation',
  'Solar & Power Solutions',
  'Consumer Tech & Gadgets',
  'Global Sourcing & Import'
];

export default function PartSearchGrid({
  initialProducts,
  onOpenRFQ,
  filterTerm = ''
}: PartSearchGridProps) {
  const [searchTerm, setSearchTerm] = useState(filterTerm);
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchCategory =
        selectedCategory === 'All Products' || product.category === selectedCategory;

      const query = searchTerm.toLowerCase().trim();
      const matchQuery =
        !query ||
        product.title.toLowerCase().includes(query) ||
        (product.titleBn && product.titleBn.includes(query)) ||
        product.brand.toLowerCase().includes(query) ||
        (product.modelNo && product.modelNo.toLowerCase().includes(query)) ||
        product.description.toLowerCase().includes(query);

      return matchCategory && matchQuery;
    });
  }, [initialProducts, selectedCategory, searchTerm]);

  return (
    <section id="catalog-section" className="py-16 md:py-24 border-t border-white/[0.06] bg-[#0c0e14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
              <Package className="w-3.5 h-3.5" />
              <span>Full Inventory & Direct Sourcing Desk</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verified Hardware & Product Catalog
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-light">
              Search by manufacturer part number (e.g. 6ES7, LC1K), brand, or product title.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search part number, brand..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12151c] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-[#12151c] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            let parsedSpecs: Record<string, string> = {};
            try {
              parsedSpecs = JSON.parse(product.specs || '{}');
            } catch {}

            const priceVal = Number(product.price) || 0;

            return (
              <div
                key={product.id}
                className="craft-card p-6 flex flex-col justify-between group text-left relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Image Canvas */}
                  <div className="h-48 rounded-xl bg-[#181d26] border border-white/[0.04] p-4 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={product.primaryImage}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-900/90 backdrop-blur-md text-slate-200 border border-white/10">
                      {product.brand}
                    </span>
                    {product.stockStatus && (
                      <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {product.stockStatus}
                      </span>
                    )}
                  </div>

                  {/* Title & Model */}
                  <div className="space-y-1">
                    {product.modelNo && (
                      <div className="text-[11px] text-amber-400 font-bold mono">
                        PN: {product.modelNo}
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-light leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Technical Specifications preview */}
                  <div className="pt-2 border-t border-white/[0.06] space-y-1 text-[11px]">
                    {Object.entries(parsedSpecs).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center text-slate-400">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-slate-300 font-medium truncate max-w-[65%] text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Pricing</div>
                    <div className="text-base font-bold text-white mono">
                      {priceVal > 0 ? `৳${priceVal.toLocaleString()}` : 'Official RFQ'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenRFQ && onOpenRFQ(product.title)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                    >
                      {priceVal > 0 ? 'Buy / Order' : 'Quote'}
                    </button>

                    <Link
                      href={`/products/${product.slug}`}
                      className="p-2 rounded-xl bg-[#181d26] hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
                      title="View Datasheet & Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="p-12 rounded-2xl bg-[#12151c] border border-white/[0.06] text-center space-y-3">
            <Package className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No exact matching product found in standard catalog</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Our China procurement team can source any specific industrial spare part, machine model, or tech gadget directly from factory floor.
            </p>
            <a
              href={`https://wa.me/8801886113236?text=${encodeURIComponent(
                `Hi Sohel, I am searching for this part/gadget: ${searchTerm}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-sm mt-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask Sohel on WhatsApp Directly</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
