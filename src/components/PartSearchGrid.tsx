'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/db/schema';
import { Search, FileText, ArrowUpRight, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface PartSearchGridProps {
  initialProducts: Product[];
  onOpenRFQ?: (productName: string) => void;
  filterTerm?: string;
}

export default function PartSearchGrid({ initialProducts, onOpenRFQ, filterTerm = '' }: PartSearchGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(filterTerm);

  const categories = [
    'All',
    'Industrial Automation',
    'Solar & Power Solutions',
    'Global Sourcing & Import'
  ];

  // Filter products by category and search term
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCat =
        selectedCategory === 'All' ||
        product.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCat;

      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        (product.modelNo && product.modelNo.toLowerCase().includes(query)) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <section id="catalog-section" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-800 pb-8">
          <div>
            <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider mb-2">
              Authentic Equipment Inventory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Parts & <span className="text-sky-400">Engineering Solutions</span>
            </h2>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by part number, brand..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <p className="text-slate-400 text-base">No specific matching parts found in quick catalog.</p>
            <p className="text-xs text-slate-500">
              Need a custom machine part or unlisted model? We source directly from China.
            </p>
            <button
              onClick={() => onOpenRFQ?.(`Custom Sourcing Request: ${searchQuery}`)}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all"
            >
              Request Sourcing for &ldquo;{searchQuery}&rdquo;
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              let parsedSpecs: Record<string, string> = {};
              try {
                if (product.specs) parsedSpecs = JSON.parse(product.specs);
              } catch {}

              const specKeys = Object.keys(parsedSpecs).slice(0, 3);

              return (
                <div
                  key={product.id}
                  className="rounded-2xl glass-panel border border-slate-800 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl hover:shadow-sky-950/40"
                >
                  <div>
                    {/* Image Area with Badge */}
                    <div className="relative h-64 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-6 border-b border-slate-800 overflow-hidden">
                      <img
                        src={product.primaryImage}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-sky-400 border border-sky-500/30">
                          {product.brand}
                        </span>
                        {product.stockStatus && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {product.stockStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 space-y-4">
                      {product.modelNo && (
                        <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded inline-block border border-amber-500/20">
                          Model: {product.modelNo}
                        </div>
                      )}

                      <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-2">
                        <Link href={`/products/${product.slug}`}>{product.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 font-light leading-relaxed">
                        {product.description}
                      </p>

                      {/* Technical Specs Pill List */}
                      {specKeys.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                          {specKeys.map((key) => (
                            <div key={key} className="flex justify-between text-[11px]">
                              <span className="text-slate-500">{key}:</span>
                              <span className="text-slate-300 font-medium">{parsedSpecs[key]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-6 pt-0 border-t border-slate-800/40 flex items-center gap-3 mt-4">
                    <button
                      onClick={() => onOpenRFQ?.(`${product.brand} - ${product.title} (${product.modelNo || ''})`)}
                      className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Request Quote
                    </button>

                    <Link
                      href={`/products/${product.slug}`}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
                      title="View Full Specifications"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
