'use client';

import React, { useState } from 'react';
import { Plane, ShieldCheck, Video, PhoneCall, CheckCircle2, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export default function ChinaSourcingSection() {
  const [partName, setPartName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  const handleSourcingWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Synapse China Sourcing Desk,\n\nI need a quote for:\n• Part/Item: ${partName}\n• Quantity: ${quantity}\n• Notes: ${notes || 'Standard factory quote'}\n\nPlease check availability and factory pricing.`;
    window.open(`https://wa.me/8801886113236?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="china-sourcing" className="py-16 md:py-24 border-t border-white/[0.06] bg-[#0b0d11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="max-w-3xl text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <Plane className="w-3.5 h-3.5" />
            <span>Turnkey Global Procurement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Our Direct China Sourcing Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
            From single obsolete PLC modules to full industrial production lines and bulk consumer gadget imports.
          </p>
        </div>

        {/* 4-Step Journey Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Step 1 */}
          <div className="craft-card p-6 space-y-4 border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-white">Send Part Spec or Photo</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Send us a photo of the nameplate, machine tag, datasheet, or Taobao/1688 link via WhatsApp or our web form.
            </p>
          </div>

          {/* Step 2 */}
          <div className="craft-card p-6 space-y-4 border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-white">Factory Matching & Pricing</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Our team in China visits verified manufacturing hubs in Guangdong, Jiangsu, or Zhejiang and secures wholesale direct pricing.
            </p>
          </div>

          {/* Step 3 */}
          <div className="craft-card p-6 space-y-4 border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-white">Live On-Ground Video QC</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              We physically test voltages, inspect seals, and send you unboxing video proof before packaging for international transit.
            </p>
          </div>

          {/* Step 4 */}
          <div className="craft-card p-6 space-y-4 border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-white">Customs & Door Delivery</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              We handle complete customs clearance. Express Air Cargo takes 7-10 days; cost-effective Sea Freight takes 25-35 days.
            </p>
          </div>
        </div>

        {/* Interactive Direct Sourcing Box */}
        <div className="craft-card p-8 sm:p-12 border-emerald-500/20 bg-[#12151c] flex flex-col lg:flex-row gap-10 items-center justify-between text-left">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant WhatsApp Concierge</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Request a Custom Sourcing Quote Right Now
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
              Tell us what item or machinery you need. Sohel will check Chinese factory inventory and reply with a complete price breakdown including freight and customs.
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero obligation inquiry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fast response on WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Fast Sourcing Form */}
          <form
            onSubmit={handleSourcingWhatsApp}
            className="w-full lg:w-96 space-y-4 p-6 rounded-2xl bg-[#0b0d11] border border-white/10"
          >
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">PART NAME / GADGET MODEL *</label>
              <input
                type="text"
                required
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="e.g. Siemens S7-1200 or 140W GaN Charger"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">QUANTITY REQUIRED</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 1 unit / 10 pcs / 1 batch"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">ADDITIONAL REQUIREMENTS</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Air cargo urgency, brand preference, etc..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#181d26] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Sourcing Request on WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
