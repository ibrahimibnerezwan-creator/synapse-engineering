'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SolarCalculator from '@/components/SolarCalculator';
import RFQModal from '@/components/RFQModal';
import ChatWidget from '@/components/ChatWidget';
import Footer from '@/components/Footer';

export default function CalculatorPage() {
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqNote, setRfqNote] = useState('');

  const handleOpenRFQ = (note = '') => {
    setRfqNote(note);
    setRfqOpen(true);
  };

  return (
    <>
      <Navbar onOpenRFQ={() => handleOpenRFQ()} />

      <main className="flex-1 py-8">
        <SolarCalculator onOpenRFQ={handleOpenRFQ} />
      </main>

      <Footer />

      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialProduct={rfqNote || 'Solar & LiFePO4 Energy Sizing Calculation'}
      />

      <ChatWidget />
    </>
  );
}
