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
      // 1. Submit RFQ to API
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

      // 2. Fire client-side Meta Pixel Lead event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06080c]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl craft-card p-6 sm:p-8 bg-[#0e1117] border border-white/10 shadow-2xl space-y-6 text-left my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!rfqNumber ? (
          <>
            {/* Header */}
            <div className="space-y-1.5 border-b border-white/[0.08] pb-4">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                OFFICIAL INQUIRY & RFQ DESK
              </span>
              <h3 className="text-xl font-bold text-white">Request Factory Quotation</h3>
              <p className="text-xs text-slate-400 font-light">
                Direct wholesale pricing from China manufacturers with full warranty in Bangladesh.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">PRODUCT / PART REQUESTED *</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. HiTHIUM HeroEE 16 or Siemens S7-1500"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">YOUR NAME *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Engr. / Mr. Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">PHONE / WHATSAPP *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">COMPANY / FACTORY</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Mill / Factory name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">QUANTITY REQUIRED</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">PROJECT REQUIREMENT / NOTES</label>
                <textarea
                  rows={2}
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Voltage specifications, target delivery timeline..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{loading ? 'SUBMITTING...' : 'SUBMIT OFFICIAL RFQ'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInstant}
                  className="w-full py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via 1-Tap WhatsApp Instead</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-amber-400 font-bold">RFQ #{rfqNumber} SUBMITTED</div>
              <h3 className="text-xl font-bold text-white">Quotation Request Received</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-light leading-relaxed">
                Our procurement engineering desk is reviewing factory availability. We will contact you via WhatsApp with the official quote.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#181d26] border border-white/[0.06] text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Product:</span>
                <span className="text-white font-medium truncate max-w-[60%]">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity:</span>
                <span className="text-white font-medium">{quantity} Unit(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Direct Contact:</span>
                <span className="text-emerald-400 font-medium">+880 1886-113236</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleWhatsAppInstant}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Follow up on WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-[#181d26] hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
