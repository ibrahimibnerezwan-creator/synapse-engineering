'use client';

import React, { useState } from 'react';

export default function ChinaSourcingSection() {
  const [partName, setPartName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  const handleSourcingWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Synapse China Sourcing Desk,\n\nI need a quote for:\n• Part/Item: ${partName}\n• Quantity: ${quantity}\n• Notes: ${notes || 'Standard factory quote'}\n\nPlease check availability and factory pricing.`;
    window.open(`https://wa.me/8801886113236?text=${encodeURIComponent(text)}`, '_blank');
  };

  const stations = [
    { step: '01', title: 'Nameplate', body: 'Photo, datasheet, or 1688 link.', chip: 'chip-ink' },
    { step: '02', title: 'Plant', body: 'OEM in Guangdong / Jiangsu / Zhejiang.', chip: 'chip-kiln' },
    { step: '03', title: 'Video QC', body: 'You approve before it packs.', chip: 'chip-jade' },
    { step: '04', title: 'Landed', body: 'Air 7–10d · Sea 25–35d.', chip: 'chip-copper' },
  ];

  return (
    <section id="china-sourcing" className="scroll-mt-24 py-16 md:py-20 border-t border-[rgba(28,22,18,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-4xl sm:text-5xl leading-[1.05]">Nameplate → crate.</h2>
          <p className="kicker">Sourcing</p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[rgba(28,22,18,0.12)]">
          {stations.map((s, i) => (
            <li
              key={s.step}
              className={`p-6 ${i % 2 === 0 ? 'bg-[#fffdf8]' : ''} ${i < 3 ? 'lg:border-r border-[rgba(28,22,18,0.12)]' : ''} ${i < 2 ? 'border-b lg:border-b-0 border-[rgba(28,22,18,0.12)]' : 'sm:border-b-0 border-b last:border-b-0 border-[rgba(28,22,18,0.12)] lg:border-b-0'}`}
            >
              <p className="mb-3">
                <span className={`chip ${s.chip}`}>{s.step} · {s.title}</span>
              </p>
              <p className="text-sm text-[#4a4038]">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="grid lg:grid-cols-12 gap-10 items-start night p-8 sm:p-10">
          <div className="lg:col-span-6 space-y-4">
            <p className="kicker">WhatsApp slip</p>
            <h3 className="display text-3xl sm:text-4xl text-[#f3ece3]">Tell Sohel what to fetch.</h3>
          </div>
          <form onSubmit={handleSourcingWhatsApp} className="lg:col-span-6 space-y-3">
            <div>
              <label htmlFor="src-part" className="kicker block mb-1.5 text-[#d4a28a]">
                Part / gadget
              </label>
              <input
                id="src-part"
                required
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="S7-1200 or 140W GaN"
                className="field bg-transparent text-[#f3ece3] border-[rgba(243,236,227,0.22)] placeholder:text-[#8a7e72]"
              />
            </div>
            <div>
              <label htmlFor="src-qty" className="kicker block mb-1.5 text-[#d4a28a]">
                Quantity
              </label>
              <input
                id="src-qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="field bg-transparent text-[#f3ece3] border-[rgba(243,236,227,0.22)]"
              />
            </div>
            <div>
              <label htmlFor="src-notes" className="kicker block mb-1.5 text-[#d4a28a]">
                Notes
              </label>
              <textarea
                id="src-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Air, brand, voltage…"
                className="field bg-transparent text-[#f3ece3] border-[rgba(243,236,227,0.22)] placeholder:text-[#8a7e72]"
              />
            </div>
            <button type="submit" className="btn-copper w-full py-3">
              Send on WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
