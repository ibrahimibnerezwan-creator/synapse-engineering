'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/db/schema';
import { CONSUMER_FILTERS } from '@/lib/productGroups';
import { consumerProducts } from '@/lib/storefront';
import { GroupChip } from './GroupChip';
import ProductImage from './ProductImage';
import styles from './storefront.module.css';

interface Props { products: Product[]; onOpenCheckout?: (product: Product) => void; onOpenRFQ?: (name?: string) => void }

export default function ConsumerPicks({ products, onOpenCheckout, onOpenRFQ }: Props) {
  const [category, setCategory] = useState('All');
  const filtered = consumerProducts(products, category);
  return (
    <section id="consumer-gadgets" className={`${styles.section} ${styles.consumer}`}>
      <div className={styles.shell}>
        <div className={styles.sectionHead}>
          <div><p className={styles.sectionLabel}>The Home desk</p><h2 className={styles.sectionTitle}>Good tech.<br />Everyday possibility.</h2></div>
          <div><p className={`${styles.sectionNote} mb-5`}>Power through a blackout. Charge faster. Make yourself at home.</p>
            <div className={styles.filters} role="group" aria-label="Gadget groups">
              {CONSUMER_FILTERS.map(cat => <button key={cat.id} type="button" aria-pressed={category === cat.id} onClick={() => setCategory(cat.id)} className={category === cat.id ? `chip ${cat.chip}` : cat.tab}>{cat.label}</button>)}
            </div>
          </div>
        </div>
        <div className={styles.productGrid}>
          {filtered.map(item => <article key={item.id} className={styles.productCard}>
            <Link href={`/products/${item.slug}`} className={styles.productImageLink} aria-label={`View ${item.title}`}><ProductImage product={item} /></Link>
            <div className={styles.productInfo}>
              <div className="flex flex-wrap items-center gap-2"><GroupChip category={item.category} subCategory={item.subCategory} /></div>
              <h3><Link href={`/products/${item.slug}`}>{item.title}</Link></h3>
              <p className={styles.productBrand}>{item.brand}</p>
              <div className={styles.productActions}>
                <p className={styles.price}>{Number(item.price) > 0 ? `৳${Number(item.price).toLocaleString('en-BD')}` : 'Request price'}</p>
                {Number(item.price) > 0 ? <button type="button" onClick={() => onOpenCheckout?.(item)} className="btn-copper">Order now</button>
                  : <button type="button" onClick={() => onOpenRFQ?.(item.title)} className="btn-ink">Get a quote</button>}
              </div>
            </div>
          </article>)}
        </div>
        {!filtered.length && <div className={styles.empty}><p>No products in this group yet.</p><button type="button" onClick={() => setCategory('All')} className="btn-ink">Browse all gadgets</button></div>}
        <div className={styles.consumerFoot}><p>Cash on delivery, bKash or Nagad. Delivery calculated at checkout.</p><a href="https://wa.me/8801886113236?text=Hi%20Sohel%2C%20I%20am%20looking%20for%20a%20gadget%20from%20China." target="_blank" rel="noopener noreferrer">Looking for something else?</a></div>
      </div>
    </section>
  );
}
