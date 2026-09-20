'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Modal from './Modal';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export default function RFQModal({ isOpen, onClose, initialProduct = '' }: RFQModalProps) {
  return isOpen ? <QuotationForm onClose={onClose} initialProduct={initialProduct} /> : null;
}

function QuotationForm({ onClose, initialProduct = '' }: Omit<RFQModalProps, 'isOpen'>) {
  const [productName, setProductName] = useState(initialProduct);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [rfqNumber, setRfqNumber] = useState<string | null>(null);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: name,
          companyName: company,
          phone,
          productTitle: productName || 'General Quotation Request',
          quantity: Number(quantity) || 1,
          projectRequirement: requirement
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.rfqNumber) throw new Error(data.error || 'Your request could not be saved. Please try again.');
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
      try { fbq?.('track', 'Lead', { content_name: productName, currency: 'BDT', value: 0 }); } catch { /* Analytics must not affect the receipt. */ }
      setRfqNumber(data.rfqNumber);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your request could not be saved. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappText = `Hello Synapse Engineering,\n\nI need an official quote for:\n• Item: ${productName}\n• Quantity: ${quantity}\n• Name: ${name}\n• Company/Project: ${company || 'Individual / Factory'}\n• Phone: ${phone}\n• Notes: ${requirement || 'N/A'}${rfqNumber ? `\n• RFQ: ${rfqNumber}` : ''}`;
  const whatsappUrl = `https://wa.me/8801886113236?text=${encodeURIComponent(whatsappText)}`;

  return (
    <Modal onClose={onClose} labelledBy="rfq-title">
      <div
        className="relative w-full p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 text-[#8a7e72] hover:text-[#1c1612]" aria-label="Close quotation form">
          <X className="w-5 h-5" />
        </button>

        {!rfqNumber ? (
          <>
            <div className="space-y-1 border-b border-[rgba(28,22,18,0.12)] pb-4 pr-8">
              <p className="kicker">RFQ desk</p>
              <h2 id="rfq-title" className="display text-3xl">Factory quotation</h2>
              <p className="text-xs text-[#4a4038]">Share your requirement. Sohel will confirm availability, pricing and delivery.</p>
            </div>
            {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="rfq-product" className="block mb-1 text-[#4a4038]">
                  Product / part *
                </label>
                <input id="rfq-product" required value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="HiTHIUM HeroEE 16 or Siemens S7-1500" className="field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="rfq-name" className="block mb-1 text-[#4a4038]">
                    Name *
                  </label>
                  <input id="rfq-name" required value={name} onChange={(e) => setName(e.target.value)} className="field" />
                </div>
                <div>
                  <label htmlFor="rfq-phone" className="block mb-1 text-[#4a4038]">
                    Phone *
                  </label>
                  <input id="rfq-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="017xxxxxxxx" className="field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="rfq-co" className="block mb-1 text-[#4a4038]">
                    Factory / company
                  </label>
                  <input id="rfq-co" value={company} onChange={(e) => setCompany(e.target.value)} className="field" />
                </div>
                <div>
                  <label htmlFor="rfq-qty" className="block mb-1 text-[#4a4038]">
                    Quantity
                  </label>
                  <input id="rfq-qty" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="rfq-notes" className="block mb-1 text-[#4a4038]">
                  Notes
                </label>
                <textarea id="rfq-notes" rows={2} value={requirement} onChange={(e) => setRequirement(e.target.value)} className="field" />
              </div>
              <button type="submit" disabled={loading} className="btn-ink w-full py-3">
                {loading ? 'Submitting…' : 'Submit RFQ'}
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full py-3">
                WhatsApp instead
              </a>
            </form>
          </>
        ) : (
          <div className="py-4 space-y-5">
            <p className="kicker">RFQ #{rfqNumber}</p>
            <h2 id="rfq-title" className="display text-3xl" role="status">Request received.</h2>
            <p className="text-sm text-[#4a4038]">The procurement desk will reply on WhatsApp with factory availability.</p>
            <dl className="p-4 bg-[#f3ece3] text-xs space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-[#8a7e72]">Product</dt>
                <dd className="truncate max-w-[60%]">{productName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8a7e72]">Qty</dt>
                <dd>{quantity}</dd>
              </div>
            </dl>
            <div className="flex gap-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-jade flex-1 py-3">
                Follow on WhatsApp
              </a>
              <button type="button" onClick={onClose} className="btn-ghost px-5 py-3">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
