'use client';

import React, { useState } from 'react';
import { Plane, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

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
    <section id="china-sourcing" className="py-16 md:py-24 border-t border-black/[0.06] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-semibold border border-emerald-200"><Plane className="w-3.5 h-3.5" /><span>Turnkey Global Procurement</span></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">How Our Direct China Sourcing Works</h2>
          <p className="text-[#718096] text-sm sm:text-base leading-relaxed font-light">From single obsolete PLC modules to full industrial production lines and bulk consumer gadget imports.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { step: '01', title: 'Send Part Spec or Photo', desc: 'Send us a photo of the nameplate, machine tag, datasheet, or Taobao/1688 link via WhatsApp or our web form.', color: 'bg-orange-50 text-[#e85d04]' },
            { step: '02', title: 'Factory Matching & Pricing', desc: 'Our team in China visits verified manufacturing hubs in Guangdong, Jiangsu, or Zhejiang and secures wholesale direct pricing.', color: 'bg-blue-50 text-[#0284c7]' },
            { step: '03', title: 'Live On-Ground Video QC', desc: 'We physically test voltages, inspect seals, and send you unboxing video proof before packaging for international transit.', color: 'bg-emerald-50 text-[#059669]' },
            { step: '04', title: 'Customs & Door Delivery', desc: 'We handle complete customs clearance. Express Air Cargo takes 7-10 days; cost-effective Sea Freight takes 25-35 days.', color: 'bg-purple-50 text-purple-600' },
          ].map((s) => (
            <div key={s.step} className="craft-card p-6 space-y-4">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center font-bold text-sm`}>{s.step}</div>
              <h3 className="text-base font-bold text-[#1a1a1a]">{s.title}</h3>
              <p className="text-xs text-[#718096] leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="craft-card p-8 sm:p-12 border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30 flex flex-col lg:flex-row gap-10 items-center justify-between text-left">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#e85d04] text-xs font-semibold border border-orange-200"><Sparkles className="w-3.5 h-3.5" /><span>Instant WhatsApp Concierge</span></div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Request a Custom Sourcing Quote Right Now</h3>
            <p className="text-[#718096] text-xs sm:text-sm font-light leading-relaxed">Tell us what item or machinery you need. Sohel will check Chinese factory inventory and reply with a complete price breakdown including freight and customs.</p>
            <div className="flex flex-wrap gap-4 text-xs text-[#4a5568] pt-2">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#059669]" /><span>Zero obligation inquiry</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#059669]" /><span>Fast response on WhatsApp</span></div>
            </div>
          </div>

          <form onSubmit={handleSourcingWhatsApp} className="w-full lg:w-96 space-y-4 p-6 rounded-2xl bg-[#fafaf8] border border-black/[0.06]">
            <div>
              <label className="text-xs text-[#4a5568] font-medium block mb-1.5">PART NAME / GADGET MODEL *</label>
              <input type="text" required value={partName} onChange={(e) => setPartName(e.target.value)} placeholder="e.g. Siemens S7-1200 or 140W GaN Charger" className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-[#1a1a1a] text-xs placeholder:text-[#a0aec0] focus:outline-none focus:border-[#059669]" />
            </div>
            <div>
              <label className="text-xs text-[#4a5568] font-medium block mb-1.5">QUANTITY REQUIRED</label>
              <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 1 unit / 10 pcs / 1 batch" className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-[#1a1a1a] text-xs placeholder:text-[#a0aec0] focus:outline-none focus:border-[#059669]" />
            </div>
            <div>
              <label className="text-xs text-[#4a5568] font-medium block mb-1.5">ADDITIONAL REQUIREMENTS</label>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Air cargo urgency, brand preference, etc..." className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/[0.08] text-[#1a1a1a] text-xs placeholder:text-[#a0aec0] focus:outline-none focus:border-[#059669]" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md">
              <MessageSquare className="w-4 h-4" /><span>Send Sourcing Request on WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
