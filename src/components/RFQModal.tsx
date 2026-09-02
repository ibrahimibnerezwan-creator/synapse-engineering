'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export default function RFQModal({ isOpen, onClose, initialProduct = '' }: RFQModalProps) {
  const [productName, setProductName] = useState(initialProduct);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [rfqNumber, setRfqNumber] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) setProductName(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const generatedNumber = `SYN-${Date.now().toString().slice(-6)}`;
    try {
      await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfqNumber: generatedNumber,
          contactName: name,
          companyName: company,
          phone,
          email,
          productTitle: productName || 'General Quotation Request',
          quantity: Number(quantity) || 1,
          projectRequirement: requirement
        })
      });
      if (typeof window !== 'undefined' && (window as unknown as { fbq?: Function }).fbq) {
        (window as unknown as { fbq: Function }).fbq('track', 'Lead', {
          content_name: productName,
          currency: 'BDT',
          value: 0
        });
      }
      setRfqNumber(generatedNumber);
    } catch {
      setRfqNumber(generatedNumber);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInstant = () => {
    const text = `Hello Synapse Engineering,\n\nI need an official quote for:\n• Item: ${productName}\n• Quantity: ${quantity}\n• Name: ${name}\n• Company/Project: ${company || 'Individual / Factory'}\n• Phone: ${phone}\n• Notes: ${requirement || 'N/A'}`;
    window.open(`https://wa.me/8801886113236?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#16120f]/50 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rfq-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg desk p-6 sm:p-8 space-y-6 my-8 bg-[#fffdf8]"
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
              <p className="text-xs text-[#4a4038]">Wholesale from the plant. Warranty in Bangladesh.</p>
            </div>
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
              <button type="button" onClick={handleWhatsAppInstant} className="btn-ghost w-full py-3">
                WhatsApp instead
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 space-y-5">
            <p className="kicker">RFQ #{rfqNumber}</p>
            <h2 className="display text-3xl">Received.</h2>
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
              <button type="button" onClick={handleWhatsAppInstant} className="btn-jade flex-1 py-3">
                Follow on WhatsApp
              </button>
              <button type="button" onClick={onClose} className="btn-ghost px-5 py-3">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
