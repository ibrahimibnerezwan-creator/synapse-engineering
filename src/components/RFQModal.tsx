'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, FileText, ArrowRight, MessageSquare, Phone } from 'lucide-react';

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
    if (initialProduct) {
      setProductName(initialProduct);
    }
  }, [initialProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedNumber = `SYN-${Date.now().toString().slice(-6)}`;

    try {
      // 1. Submit RFQ to API (DB + Server-Side Meta CAPI)
      const res = await fetch('/api/rfq', {
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

      // 2. Fire client-side Meta Pixel Lead event if available
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: productName,
          currency: 'BDT',
          value: 0
        });
      }

      setRfqNumber(generatedNumber);
    } catch {
      // Fallback display
      setRfqNumber(generatedNumber);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Synapse Engineering, I submitted RFQ #${rfqNumber || ''} for: ${productName}. Name: ${name}, Company: ${company}, Phone: ${phone}. Please share price & lead time.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-sky-500/30 p-6 sm:p-8 bg-slate-900 shadow-2xl shadow-sky-950/80 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {rfqNumber ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                RFQ Generated
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">Quotation Request Received!</h3>
              <p className="text-xs font-mono text-amber-400 mt-1 bg-amber-500/10 py-1 px-3 rounded-md inline-block">
                Reference ID: {rfqNumber}
              </p>
            </div>

            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Our engineering & sourcing desk has received your request for <strong>{productName}</strong>. We will review availability and contact you within 1-2 hours.
            </p>

            {/* Instant WhatsApp Direct Escalation */}
            <div className="pt-4 space-y-2">
              <a
                href={`https://wa.me/8801886113236?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Follow-up (Priority)</span>
              </a>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <div className="space-y-5">
            <div>
              <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                Official B2B Inquiry
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Request Part Quotation (RFQ)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Fast engineering pricing & delivery timelines directly from our China & Dhaka stock.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Product / Spec Title */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Product / Required Component *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Siemens S7-1500, HiTHIUM 16kWh Battery, Schneider Contactor..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Name & Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Engr. Rahim..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Company / Plant Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="ABC Spinning Mill..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Phone & Qty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Project Notes / Voltage / Delivery urgency (Optional)
                </label>
                <textarea
                  rows={2}
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Need 7-day urgent air shipment / technical support required..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{loading ? 'Submitting RFQ...' : 'Submit Official RFQ Proposal'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
