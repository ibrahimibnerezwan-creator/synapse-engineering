'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/db/schema';
import { Search, FileText, ArrowUpRight, CheckCircle2, ShieldCheck, Download, Terminal } from 'lucide-react';

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
    <section id="catalog-section" className="py-20 bg-[#06080c] border-t border-[#1a2234]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-[#1a2234] pb-8">
          <div>
            <div className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider mb-2">
              [INVENTORY_MATRIX // AUTHENTIC_HARDWARE]
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Featured Parts & <span className="text-[#00f0ff]">Hardware Catalog</span>
            </h2>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter part number, brand..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e17] border border-[#1a2234] text-white placeholder-slate-500 text-xs mono focus:outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#00f0ff] text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'bg-[#090e17] text-slate-400 hover:text-white hover:bg-slate-900 border border-[#1a2234]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl hud-panel border border-[#1a2234] space-y-4">
            <p className="text-slate-400 text-sm mono">No matching inventory item found for this query.</p>
            <p className="text-xs text-slate-500 mono">
              We source obsolete or unlisted machine models directly from manufacturers in China.
            </p>
            <button
              onClick={() => onOpenRFQ?.(`Custom Sourcing Request: ${searchQuery}`)}
              className="px-6 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 text-xs font-bold mono transition-all"
            >
              DISPATCH_SOURCING_QUERY (&ldquo;{searchQuery}&rdquo;) [↵]
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
                  className="rounded-2xl hud-panel p-6 border border-[#1a2234] hover:border-[#00f0ff]/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Image Area with Badge */}
                    <div className="relative h-60 bg-[#070a10] rounded-xl flex items-center justify-center p-6 border border-[#1a2234] overflow-hidden">
                      <img
                        src={product.primaryImage}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[10px] font-bold mono px-2.5 py-1 rounded bg-[#0b0f17]/90 text-[#00f0ff] border border-[#00f0ff]/30">
                          {product.brand}
                        </span>
                        {product.stockStatus && (
                          <span className="text-[10px] font-medium mono px-2 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
                            {product.stockStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-3">
                      {product.modelNo && (
                        <div className="text-[11px] font-mono font-bold text-[#ffaa00] bg-[#ffaa00]/10 px-2 py-0.5 rounded inline-block border border-[#ffaa00]/20">
                          PN: {product.modelNo}
                        </div>
                      )}

                      <h3 className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors line-clamp-2">
                        <Link href={`/products/${product.slug}`}>{product.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 font-light leading-relaxed">
                        {product.description}
                      </p>

                      {/* Technical Specs Pill List */}
                      {specKeys.length > 0 && (
                        <div className="space-y-1.5 pt-3 border-t border-[#1a2234]">
                          {specKeys.map((key) => (
                            <div key={key} className="flex justify-between text-[11px] mono">
                              <span className="text-slate-500">{key}:</span>
                              <span className="text-slate-300 font-medium">{parsedSpecs[key]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-6 border-t border-[#1a2234] flex items-center gap-3 mt-4">
                    <button
                      onClick={() => onOpenRFQ?.(`${product.brand} - ${product.title} (${product.modelNo || ''})`)}
                      className="flex-1 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-xs mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center gap-1.5"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>RFQ_QUOTE [↵]</span>
                    </button>

                    <Link
                      href={`/products/${product.slug}`}
                      className="p-2.5 rounded-xl bg-[#090e17] hover:bg-slate-900 text-slate-300 hover:text-white border border-[#1a2234] transition-all"
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
