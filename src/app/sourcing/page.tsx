'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ChinaSourcingSection from '@/components/ChinaSourcingSection';
import RFQModal from '@/components/RFQModal';
import ChatWidget from '@/components/ChatWidget';
import Footer from '@/components/Footer';

export default function SourcingPage() {
  const [rfqOpen, setRfqOpen] = useState(false);

  return (
    <>
      <Navbar onOpenRFQ={() => setRfqOpen(true)} />

      <main className="flex-1 py-8">
        <ChinaSourcingSection />
      </main>

      <Footer />

      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialProduct="China Direct Machine & Component Sourcing"
      />

      <ChatWidget />
    </>
  );
}
