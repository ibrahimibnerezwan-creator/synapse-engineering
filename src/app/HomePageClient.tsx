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
  const [filterTerm, setFilterTerm] = useState('');

  const handleOpenRFQ = (productName = '') => {
    setSelectedProductForRFQ(productName);
    setRfqOpen(true);
  };

  return (
    <>
      <Navbar onOpenRFQ={() => handleOpenRFQ()} tone="night" />

      <main id="main" className="flex-1">
        <HeroSection onOpenRFQ={handleOpenRFQ} onSearch={setFilterTerm} />
        <BrandsMarquee />
        <FounderStory />
        <CorePillars onOpenRFQ={handleOpenRFQ} />
        <ConsumerPicks
          products={initialProducts}
          onOpenCheckout={setCheckoutProduct}
          onOpenRFQ={handleOpenRFQ}
        />
        <SolarCalculator onOpenRFQ={handleOpenRFQ} />
        <PartSearchGrid
          initialProducts={initialProducts}
          onOpenCheckout={setCheckoutProduct}
          onOpenRFQ={handleOpenRFQ}
          filterTerm={filterTerm}
        />
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
