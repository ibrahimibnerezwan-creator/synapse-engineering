'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/db/schema';
import { CONSUMER_FILTERS, groupTone } from '@/lib/productGroups';
import { GroupChip } from './GroupChip';

interface ConsumerPicksProps {
  products: Product[];
  onOpenCheckout?: (product: Product) => void;
  onOpenRFQ?: (productName?: string) => void;
}

export default function ConsumerPicks({ products, onOpenCheckout, onOpenRFQ }: ConsumerPicksProps) {
  const consumerItems = products.filter(
    (p) => p.category === 'Consumer Tech & Gadgets' || (p.price != null && p.price > 0)
  );

  const [activeCategory, setActiveCategory] = useState<(typeof CONSUMER_FILTERS)[number]['id']>('All');

  const filtered = consumerItems.filter((item) => {
    const subCat = (item.subCategory || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Power') return subCat.includes('power') || title.includes('power');
    if (activeCategory === 'Charging') return subCat.includes('charging') || title.includes('charger');
    if (activeCategory === 'Smart Home') return subCat.includes('smart') || title.includes('zigbee');
    return true;
  });

  const gadgetsTone = groupTone('Consumer Tech & Gadgets');

  return (
    <section id="consumer-gadgets" className="scroll-mt-24 py-16 md:py-20 border-t border-[rgba(28,22,18,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <p className="kicker">Home desk</p>
            <h2 className="display text-4xl sm:text-5xl leading-[1.05]">Gadgets. COD.</h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Gadget groups">
            {CONSUMER_FILTERS.map((cat) => {
              const selected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveCategory(cat.id)}
                  className={selected ? `chip ${cat.chip}` : cat.tab}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${gadgetsTone.wrap} p-3`}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const priceVal = Number(item.price) || 0;
            const tone = groupTone(item.category);

            return (
              <article key={item.id} className={`desk desk-hover flex flex-col ${tone.bar} ${tone.wash}`}>
                <div className="h-52 studio p-6 flex items-center justify-center relative">
                  <img src={item.primaryImage} alt="" className="max-h-full max-w-full object-contain" />
                  <span className="absolute top-3 left-3 text-[10px] tracking-[0.12em] uppercase bg-[#fffdf8] px-2 py-1 border border-[rgba(28,22,18,0.12)]">
                    {item.brand}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1 gap-4">
                  <div className="space-y-2">
                    <GroupChip category={item.category} subCategory={item.subCategory} />
                    <h3 className="text-base font-medium leading-snug">
                      <Link href={`/products/${item.slug}`} className="hover:text-[#b85c38]">
                        {item.title}
                      </Link>
                    </h3>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[rgba(28,22,18,0.12)] flex items-center justify-between gap-2">
                    <p className="mono text-lg">{priceVal > 0 ? `৳${priceVal.toLocaleString()}` : 'RFQ'}</p>
                    <div className="flex items-center gap-1.5">
                      {priceVal > 0 ? (
                        <button type="button" onClick={() => onOpenCheckout?.(item)} className="btn-copper px-3 py-2">
                          <span className="bn">অর্ডার</span>
                        </button>
                      ) : (
                        <button type="button" onClick={() => onOpenRFQ?.(item.title)} className="btn-ink px-3 py-2">
                          Quote
                        </button>
                      )}
                      <Link href={`/products/${item.slug}`} className="p-2 border border-[rgba(28,22,18,0.18)]" aria-label={`View ${item.title}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        </div>

        <div className={`desk p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${gadgetsTone.bar}`}>
          <div>
            <h3 className="display text-2xl mb-1">Not on the floor?</h3>
            <p className="text-sm text-[#4a4038]">Photo or 1688 link. Sohel checks the plant.</p>
          </div>
          <a
            href="https://wa.me/8801886113236?text=Hi%20Sohel,%20I%20am%20looking%20for%20a%20custom%20gadget%20from%20China"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ink px-5 py-3 shrink-0"
          >
            Custom gadget
          </a>
        </div>
      </div>
    </section>
  );
}
