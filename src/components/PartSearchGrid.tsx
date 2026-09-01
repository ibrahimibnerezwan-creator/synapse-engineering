'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '@/db/schema';

interface PartSearchGridProps {
  initialProducts: Product[];
  onOpenCheckout?: (product: Product) => void;
  onOpenRFQ?: (productName?: string) => void;
  filterTerm?: string;
}

const CATEGORIES = ['All Products', 'Industrial Automation', 'Solar & Power Solutions', 'Consumer Tech & Gadgets', 'Global Sourcing & Import'];

export default function PartSearchGrid({ initialProducts, onOpenCheckout, onOpenRFQ, filterTerm = '' }: PartSearchGridProps) {
  const [searchTerm, setSearchTerm] = useState(filterTerm);
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
      const query = searchTerm.toLowerCase().trim();
      const matchQuery = !query || product.title.toLowerCase().includes(query) || (product.titleBn && product.titleBn.includes(query)) || product.brand.toLowerCase().includes(query) || (product.modelNo && product.modelNo.toLowerCase().includes(query)) || product.description.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  }, [initialProducts, selectedCategory, searchTerm]);

  return (
    <section id="catalog-section" className="py-16 md:py-24 border-t border-black/[0.06] bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0284c7] text-xs font-semibold border border-blue-200">
              <Package className="w-3.5 h-3.5" />
              <span>Full Inventory & Direct Sourcing Desk</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">Verified Hardware & Product Catalog</h2>
            <p className="text-[#718096] text-sm sm:text-base font-light">Search by manufacturer part number (e.g. 6ES7, LC1K), brand, or product title.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#a0aec0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search part number, brand..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-[#1a1a1a] text-xs placeholder:text-[#a0aec0] focus:outline-none focus:border-[#e85d04] transition-colors" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-black/[0.06] pb-4">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedCategory === cat ? 'bg-[#1a3a5c] text-white shadow-sm' : 'bg-white text-[#718096] hover:text-[#1a1a1a] border border-black/[0.06]'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            let parsedSpecs: Record<string, string> = {};
            try { parsedSpecs = JSON.parse(product.specs || '{}'); } catch {}
            const priceVal = Number(product.price) || 0;

            return (
              <div key={product.id} className="craft-card p-6 flex flex-col justify-between group text-left relative overflow-hidden">
                <div className="space-y-4">
                  <div className="h-48 rounded-xl bg-[#f5f5f2] border border-black/[0.04] p-4 flex items-center justify-center relative overflow-hidden">
                    <img src={product.primaryImage} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded bg-white/90 backdrop-blur-md text-[#1a1a1a] border border-black/[0.08]">{product.brand}</span>
                    {product.stockStatus && <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded bg-emerald-50 text-[#059669] border border-emerald-200">{product.stockStatus}</span>}
                  </div>
                  <div className="space-y-1">
                    {product.modelNo && <div className="text-[11px] text-[#e85d04] font-bold mono">PN: {product.modelNo}</div>}
                    <h3 className="text-sm font-bold text-[#1a1a1a] group-hover:text-[#e85d04] transition-colors line-clamp-2">{product.title}</h3>
                    <p className="text-xs text-[#718096] line-clamp-2 font-light leading-relaxed">{product.description}</p>
                  </div>
                  <div className="pt-2 border-t border-black/[0.06] space-y-1 text-[11px]">
                    {Object.entries(parsedSpecs).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center"><span className="text-[#a0aec0]">{k}:</span><span className="text-[#4a5568] font-medium truncate max-w-[65%] text-right">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="pt-5 mt-5 border-t border-black/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-[#a0aec0] font-semibold tracking-wider">Pricing</div>
                    <div className="text-base font-bold text-[#1a1a1a] mono">{priceVal > 0 ? `৳${priceVal.toLocaleString()}` : 'Official RFQ'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {priceVal > 0 ? (
                      <button onClick={() => onOpenCheckout && onOpenCheckout(product)} className="px-3.5 py-2 rounded-xl bg-[#e85d04] hover:bg-[#d45403] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Order (৳{priceVal.toLocaleString()})</span>
                      </button>
                    ) : (
                      <button onClick={() => onOpenRFQ && onOpenRFQ(product.title)} className="px-3.5 py-2 rounded-xl bg-[#1a3a5c] hover:bg-[#0f2a45] text-white font-bold text-xs shadow-sm transition-all">
                        Quote
                      </button>
                    )}
                    <Link href={`/products/${product.slug}`} className="p-2 rounded-xl bg-[#f5f5f2] hover:bg-[#eeeee8] text-[#4a5568] hover:text-[#1a1a1a] border border-black/[0.06] transition-colors" title="View Details"><ArrowRight className="w-4 h-4" /></Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
