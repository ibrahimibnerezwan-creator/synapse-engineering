'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import type { Product } from '@/db/schema';
import styles from './storefront.module.css';
import Image from 'next/image';

/** Stock photos illustrate a use case; they are never represented as this exact SKU. */
export default function ProductImage({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const illustration = product.primaryImage.includes('images.unsplash.com');
  const category = `${product.subCategory || ''} ${product.title}`.toLowerCase();
  const fallback = category.includes('smart') || category.includes('zigbee') ? '/hero/home-smart.jpg'
    : category.includes('charging') || category.includes('gan') ? '/hero/home-gan.jpg'
    : product.category === 'Consumer Tech & Gadgets' ? '/hero/home-power.jpg'
    : product.category === 'Solar & Power Solutions' ? '/hero/factory-ess.jpg'
    : product.category === 'Global Sourcing & Import' ? '/hero/factory-floor.jpg' : '/hero/factory-panel.jpg';
  return (
    <div className={`${styles.productMedia} ${illustration ? styles.productMediaIllustration : ''}`}>
      {failed || !product.primaryImage ? <div className={styles.imageMissing}><Package size={32} strokeWidth={1} aria-hidden /><span>Product photo on request</span></div> : <>
        <Image unoptimized width={800} height={600} src={illustration ? fallback : product.primaryImage} alt={illustration ? `${product.subCategory || product.category} use-case illustration` : product.title}
          loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
        {illustration && <span className={styles.illustrationLabel}>Use-case image</span>}
      </>}
    </div>
  );
}
