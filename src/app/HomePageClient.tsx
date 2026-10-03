'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BrandsMarquee from '@/components/BrandsMarquee';
import ConsumerPicks from '@/components/ConsumerPicks';
import FounderStory from '@/components/FounderStory';
import CorePillars from '@/components/CorePillars';
import SolarCalculator from '@/components/SolarCalculator';
import PartSearchGrid from '@/components/PartSearchGrid';
import ChinaSourcingSection from '@/components/ChinaSourcingSection';
import RFQModal from '@/components/RFQModal';
import CheckoutModal from '@/components/CheckoutModal';
import ChatWidget from '@/components/ChatWidget';
import Footer from '@/components/Footer';
import { Product } from '@/db/schema';

interface HomePageClientProps {
  initialProducts: Product[];
}

export default function HomePageClient({ initialProducts }: HomePageClientProps) {
  const [products, setProducts] = useState(initialProducts);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const response = await fetch('/api/products', { cache: 'no-store', signal: controller.signal });
        const data = await response.json();
        if (response.ok && Array.isArray(data.products) && !controller.signal.aborted) setProducts(data.products);
      } catch { /* Keep the rendered catalogue usable if a background refresh fails. */ }
    };
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('focus', refresh); controller.abort(); };
  }, []);
  const [rfqOpen, setRfqOpen] = useState(false);
  const [selectedProductForRFQ, setSelectedProductForRFQ] = useState('');
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [searchRequest, setSearchRequest] = useState({ term: '', revision: 0 });

  const handleOpenRFQ = (productName = '') => {
    setSelectedProductForRFQ(productName);
    setRfqOpen(true);
  };

  return (
    <>
      <Navbar onOpenRFQ={() => handleOpenRFQ()} tone="night" />

      <main id="main" className="flex-1">
        <HeroSection onOpenRFQ={handleOpenRFQ} onSearch={term => setSearchRequest(previous => ({ term, revision: previous.revision + 1 }))} />
        <BrandsMarquee />
        <CorePillars onOpenRFQ={handleOpenRFQ} />
        <ConsumerPicks
          products={products}
          onOpenCheckout={setCheckoutProduct}
          onOpenRFQ={handleOpenRFQ}
        />
        <PartSearchGrid
          key={searchRequest.revision}
          initialProducts={products}
          onOpenCheckout={setCheckoutProduct}
          onOpenRFQ={handleOpenRFQ}
          searchRequest={searchRequest}
        />
        <SolarCalculator onOpenRFQ={handleOpenRFQ} />
        <FounderStory />
        <ChinaSourcingSection />
      </main>

      <Footer />

      {checkoutProduct && (
        <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
      )}

      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialProduct={selectedProductForRFQ}
      />

      <ChatWidget />
    </>
  );
}
