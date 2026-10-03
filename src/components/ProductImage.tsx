'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import type { Product } from '@/db/schema';
import styles from './storefront.module.css';
import Image from 'next/image';
import { productPhoto } from '@/lib/productMedia';

/** Stock photos illustrate a use case; they are never represented as this exact SKU. */
export default function ProductImage({ product, priority = false, image, onUnavailable }: { product: Product; priority?: boolean; image?: string; onUnavailable?: (id: number) => void }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const originalSource = image ?? product.primaryImage;
  const { source, illustration } = productPhoto(product, originalSource);
  return (
    <div className={`${styles.productMedia} ${illustration ? styles.productMediaIllustration : ''}`}>
      {failedSource === source || !source ? <div className={styles.imageMissing}><Package size={32} strokeWidth={1} aria-hidden /><span>Product photo on request</span></div> : <>
        <Image unoptimized width={800} height={600} src={source} alt={illustration ? `${product.subCategory || product.category} use-case illustration` : product.title}
          loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => { setFailedSource(source); onUnavailable?.(product.id); }} />
        {illustration && <span className={styles.illustrationLabel}>Use-case image</span>}
      </>}
    </div>
  );
}
