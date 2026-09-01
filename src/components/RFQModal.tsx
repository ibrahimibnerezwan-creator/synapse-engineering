'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, FileText, ArrowRight, MessageSquare, Phone, Terminal } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06080c]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl hud-panel border border-[#00f0ff]/40 p-6 sm:p-8 bg-[#090e17] shadow-2xl shadow-[#00f0ff]/10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {rfqNumber ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4 mono">
            <div className="w-16 h-16 rounded-full bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center mx-auto border border-[#00ff88]/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs text-[#00ff88] uppercase font-bold tracking-wider">
                [RFQ_DISPATCH_CONFIRMED]
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">Proposal Registered!</h3>
              <p className="text-xs text-[#ffaa00] mt-1 bg-[#ffaa00]/10 py-1 px-3 rounded inline-block border border-[#ffaa00]/30">
                REF_ID: {rfqNumber}
              </p>
            </div>

            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed font-sans">
              Our engineering & sourcing desk has received your request for <strong>{productName}</strong>. We will review availability and contact you within 1-2 hours.
            </p>

            {/* Instant WhatsApp Direct Escalation */}
            <div className="pt-4 space-y-2">
              <a
                href={`https://wa.me/8801886113236?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>INSTANT_WHATSAPP_CONFIRMATION [↵]</span>
              </a>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              >
                CLOSE_WINDOW
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <div className="space-y-5">
            <div>
              <div className="text-[10px] font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                [CMD: GENERATE_OFFICIAL_RFQ]
              </div>
              <h3 className="text-xl font-bold text-white mt-1 uppercase tracking-tight">Request Part Quotation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct factory pricing & express delivery from China and Dhaka stock.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mono text-xs">
              {/* Product / Spec Title */}
              <div>
                <label className="text-slate-300 block mb-1">
                  REQUIRED COMPONENT / PART NUMBER *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Siemens S7-1500, HiTHIUM 16kWh Battery, LC1K Contactor..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Name & Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Engr. Name..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">
                    COMPANY / PLANT
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Factory Name..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              {/* Phone & Qty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">
                    PHONE / WHATSAPP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">
                    QUANTITY
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-slate-300 block mb-1">
                  PROJECT SPECIFICATIONS / TIMELINE (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Need 7-day urgent air shipment / technical support required..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>{loading ? 'TRANSMITTING...' : 'TRANSMIT_OFFICIAL_RFQ [↵]'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
