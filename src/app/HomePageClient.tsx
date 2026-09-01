'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BrandsMarquee from '@/components/BrandsMarquee';
import CorePillars from '@/components/CorePillars';
import SolarCalculator from '@/components/SolarCalculator';
import PartSearchGrid from '@/components/PartSearchGrid';
import ChinaSourcingSection from '@/components/ChinaSourcingSection';
import RFQModal from '@/components/RFQModal';
import ChatWidget from '@/components/ChatWidget';
import Footer from '@/components/Footer';
import { Product } from '@/db/schema';

interface HomePageClientProps {
  initialProducts: Product[];
}

export default function HomePageClient({ initialProducts }: HomePageClientProps) {
  const [rfqOpen, setRfqOpen] = useState(false);
  const [selectedProductForRFQ, setSelectedProductForRFQ] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  const handleOpenRFQ = (productName = '') => {
    setSelectedProductForRFQ(productName);
    setRfqOpen(true);
  };

  const handleSearchFromHero = (term: string) => {
    setFilterTerm(term);
  };

  return (
    <>
      <Navbar onOpenRFQ={() => handleOpenRFQ()} />

      <main className="flex-1">
        {/* 1. High-Impact Hero with Quick Search & Value Proposition */}
        <HeroSection onOpenRFQ={handleOpenRFQ} onSearch={handleSearchFromHero} />

        {/* 2. Global Industrial Brands Marquee */}
        <BrandsMarquee />

        {/* 3. Three Core Pillars (Automation, Solar ESS, China Sourcing) */}
        <CorePillars onOpenRFQ={handleOpenRFQ} />

        {/* 4. Interactive Solar & LiFePO4 Energy Sizing Calculator */}
        <SolarCalculator onOpenRFQ={handleOpenRFQ} />

        {/* 5. Instant Part Number Search & Catalog Grid */}
        <PartSearchGrid
          initialProducts={initialProducts}
          onOpenRFQ={handleOpenRFQ}
          filterTerm={filterTerm}
        />

        {/* 6. China Direct Sourcing & Personal QC Verification Workflow */}
        <ChinaSourcingSection />
      </main>

      <Footer />

      {/* Reusable RFQ Quotation Modal */}
      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialProduct={selectedProductForRFQ}
      />

      {/* Floating Gemini AI Technical Advisor */}
      <ChatWidget />
    </>
  );
}
