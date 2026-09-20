'use client';

import React, { useState } from 'react';
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
          products={initialProducts}
          onOpenCheckout={setCheckoutProduct}
          onOpenRFQ={handleOpenRFQ}
        />
        <PartSearchGrid
          key={searchRequest.revision}
          initialProducts={initialProducts}
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
