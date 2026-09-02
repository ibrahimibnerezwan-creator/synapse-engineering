'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { Product } from '@/db/schema';
import { CATEGORY_ORDER, groupTone } from '@/lib/productGroups';
import { GroupChip } from './GroupChip';

interface PartSearchGridProps {
  initialProducts: Product[];
  onOpenCheckout?: (product: Product) => void;
  onOpenRFQ?: (productName?: string) => void;
  filterTerm?: string;
}

function ProductCard({
  product,
  onOpenCheckout,
  onOpenRFQ
}: {
  product: Product;
  onOpenCheckout?: (product: Product) => void;
  onOpenRFQ?: (productName?: string) => void;
}) {
  const priceVal = Number(product.price) || 0;
  const tone = groupTone(product.category);

  return (
    <article className={`desk desk-hover flex flex-col ${tone.bar} ${tone.wash}`}>
      <div className="h-44 studio p-5 flex items-center justify-center relative">
        <img src={product.primaryImage} alt="" className="max-h-full max-w-full object-contain" />
        {product.stockStatus && (
          <span className="stamp absolute top-3 right-3 bg-[#fffdf8]">{product.stockStatus}</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <GroupChip category={product.category} subCategory={product.subCategory} />
        {product.modelNo && <p className="mono text-[11px] text-[#b85c38]">PN {product.modelNo}</p>}
        <h3 className="text-sm font-medium leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-[#b85c38]">
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto pt-3 border-t border-[rgba(28,22,18,0.12)] flex items-center justify-between gap-2">
          <p className="mono text-base">{priceVal > 0 ? `৳${priceVal.toLocaleString()}` : 'RFQ'}</p>
          <div className="flex gap-1.5">
            {priceVal > 0 ? (
              <button type="button" onClick={() => onOpenCheckout?.(product)} className="btn-copper px-3 py-2">
                Order
              </button>
            ) : (
              <button type="button" onClick={() => onOpenRFQ?.(product.title)} className="btn-ink px-3 py-2">
                Quote
              </button>
            )}
            <Link href={`/products/${product.slug}`} className="p-2 border border-[rgba(28,22,18,0.18)]" aria-label={`View ${product.title}`}>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PartSearchGrid({
  initialProducts,
  onOpenCheckout,
  onOpenRFQ,
  filterTerm = ''
}: PartSearchGridProps) {
  const [searchTerm, setSearchTerm] = useState(filterTerm);
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  useEffect(() => {
    if (filterTerm) setSearchTerm(filterTerm);
  }, [filterTerm]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
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

  const grouped =
    selectedCategory === 'All Products'
      ? CATEGORY_ORDER.map((cat) => ({
          cat,
          items: filteredProducts.filter((p) => p.category === cat)
        })).filter((g) => g.items.length > 0)
      : [{ cat: selectedCategory, items: filteredProducts }];

  return (
    <section id="catalog-section" className="scroll-mt-24 py-16 md:py-20 border-t border-[rgba(28,22,18,0.12)] bg-[#fffdf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <p className="kicker">Ledger</p>
            <h2 className="display text-4xl sm:text-5xl leading-[1.05]">In stock.</h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8a7e72] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
            <label htmlFor="catalog-search" className="sr-only">
              Search catalog
            </label>
            <input
              id="catalog-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="6ES7, LC1K, HeroEE…"
              className="field pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Product groups">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'All Products'}
            onClick={() => setSelectedCategory('All Products')}
            className={selectedCategory === 'All Products' ? 'chip chip-ink' : 'tab-all'}
          >
            All
          </button>
          {CATEGORY_ORDER.map((cat) => {
            const tone = groupTone(cat);
            const selected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedCategory(cat)}
                className={selected ? `chip ${tone.chip}` : tone.tab}
              >
                {tone.short}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <p role="status" className="py-16 text-center text-sm text-[#4a4038]">
            No match. WhatsApp a photo of the nameplate.
          </p>
        ) : (
          <div className="space-y-8">
            {grouped.map(({ cat, items }) => {
              const tone = groupTone(cat);
              return (
                <div key={cat} className={`${tone.wrap} space-y-3 p-3`}>
                  <div className={tone.band}>
                    <span>{tone.short}</span>
                    <span className="mono tracking-normal normal-case opacity-80">{items.length}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onOpenCheckout={onOpenCheckout}
                        onOpenRFQ={onOpenRFQ}
                      />
                    ))}
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
