'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import type { Product } from '@/db/schema';
import { CATEGORY_ORDER, groupTone } from '@/lib/productGroups';
import { searchProducts } from '@/lib/storefront';
import ProductImage from './ProductImage';
import styles from './storefront.module.css';

interface Props {
  initialProducts: Product[];
  onOpenCheckout?: (product: Product) => void;
  onOpenRFQ?: (name?: string) => void;
  searchRequest?: { term: string; revision: number };
}

export default function PartSearchGrid({ initialProducts, onOpenCheckout, onOpenRFQ, searchRequest }: Props) {
  const [searchTerm, setSearchTerm] = useState(searchRequest?.term || '');
  const [category, setCategory] = useState('All Products');
  useEffect(() => {
    if (searchRequest?.revision) {
      document.getElementById('catalog-search')?.focus({ preventScroll: true });
      document.getElementById('catalog-section')?.scrollIntoView();
    }
  }, [searchRequest]);
  const filtered = useMemo(() => searchProducts(initialProducts, searchTerm, category), [initialProducts, searchTerm, category]);
  // Preserve newly added admin categories instead of silently dropping them.
  const categories = [...new Set<string>([...CATEGORY_ORDER, ...initialProducts.map(product => product.category)])];
  const groups = categories.map(cat => ({ category: cat, items: filtered.filter(product => product.category === cat) })).filter(group => group.items.length);

  return (
    <section id="catalog-section" className={`${styles.section} ${styles.catalog}`}>
      <div className={styles.shell}>
        <div className={styles.sectionHead}>
          <div><p className={styles.sectionLabel}>The supply desk</p><h2 className={styles.sectionTitle}>Find your next solution.</h2></div>
          <div className={styles.catalogSearch}><Search size={19} aria-hidden /><label htmlFor="catalog-search" className="sr-only">Search catalog</label>
            <input id="catalog-search" type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Part number, product or brand" />
          </div>
        </div>
        <div className={styles.catalogToolbar}>
          <div className={styles.filters} role="group" aria-label="Product groups">
            <button type="button" aria-pressed={category === 'All Products'} onClick={() => setCategory('All Products')} className={category === 'All Products' ? 'chip chip-ink' : 'tab-all'}>All products</button>
            {categories.map(cat => {
              const tone = groupTone(cat);
              return <button key={cat} type="button" aria-pressed={category === cat} onClick={() => setCategory(cat)} className={category === cat ? `chip ${tone.chip}` : tone.tab}>{CATEGORY_ORDER.includes(cat as typeof CATEGORY_ORDER[number]) ? tone.short : cat}</button>;
            })}
          </div>
          <p className={styles.resultCount} role="status">{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</p>
        </div>
        {!filtered.length ? <div className={styles.empty}>
          <p>No match. Try a model number, or send us a photo of the nameplate.</p>
          <div className="flex flex-wrap justify-center gap-3"><button type="button" onClick={() => { setSearchTerm(''); setCategory('All Products'); }} className="btn-ghost">Clear filters</button><button type="button" onClick={() => onOpenRFQ?.(searchTerm)} className="btn-ink">Ask us to source it</button></div>
        </div> : groups.map(group => {
          const tone = groupTone(group.category);
          return <div key={group.category} className={styles.catalogGroup}>
            <h3 className={`${styles.catalogBand} ${tone.chip}`}>{CATEGORY_ORDER.includes(group.category as typeof CATEGORY_ORDER[number]) ? tone.short : group.category}<span>{group.items.length} products</span></h3>
            {group.items.map(product => <article key={product.id} className={styles.catalogRow}>
              <Link href={`/products/${product.slug}`} className={styles.catalogThumb} aria-label={`View ${product.title}`}><ProductImage product={product} /></Link>
              <div className={styles.catalogDescription}><h3><Link href={`/products/${product.slug}`}>{product.title}</Link></h3><p>{product.modelNo || product.brand}{product.subCategory ? ` / ${product.subCategory}` : ''}</p></div>
              <div className={styles.catalogPrice}>{Number(product.price) > 0 ? `৳${Number(product.price).toLocaleString('en-BD')}` : 'On request'}<span className={styles.stock}>{product.stockStatus}</span></div>
              <div className={styles.catalogAction}>{Number(product.price) > 0 ? <button type="button" onClick={() => onOpenCheckout?.(product)} className="btn-copper">Order</button> : <button type="button" onClick={() => onOpenRFQ?.(product.title)} className="btn-ink">Quote</button>}<Link href={`/products/${product.slug}`} className={styles.detailLink} aria-label={`Details for ${product.title}`}><ArrowUpRight size={18} /></Link></div>
            </article>)}
          </div>;
        })}
      </div>
    </section>
  );
}
