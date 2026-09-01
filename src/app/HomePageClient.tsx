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
        {/* 1. Value-First Hero with Universal Search & Trust Highlights */}
        <HeroSection onOpenRFQ={handleOpenRFQ} onSearch={handleSearchFromHero} />

        {/* 2. Global Industrial & Tech Brands Matrix */}
        <BrandsMarquee />

        {/* 3. Daily Consumer Tech Gadgets & Electronics Showcase (NEW) */}
        <ConsumerPicks products={initialProducts} onOpenRFQ={handleOpenRFQ} />

        {/* 4. The Human Advantage: Sohel & On-Ground Video QC in China (NEW) */}
        <FounderStory />

        {/* 5. Three Core Engineering Divisions */}
        <CorePillars onOpenRFQ={handleOpenRFQ} />

        {/* 6. Interactive Solar & LiFePO4 Energy Sizing Calculator */}
        <SolarCalculator onOpenRFQ={handleOpenRFQ} />

        {/* 7. Full Product Catalog with Universal Filtering */}
        <PartSearchGrid
          initialProducts={initialProducts}
          onOpenRFQ={handleOpenRFQ}
          filterTerm={filterTerm}
        />

        {/* 8. China Direct Sourcing & Turnkey Logistics Workflow */}
        <ChinaSourcingSection />
      </main>

      <Footer />

      {/* Reusable RFQ Quotation Modal */}
      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialProduct={selectedProductForRFQ}
      />

      {/* Floating Multilingual Gemini AI Technical Consultant */}
      <ChatWidget />
    </>
  );
}
