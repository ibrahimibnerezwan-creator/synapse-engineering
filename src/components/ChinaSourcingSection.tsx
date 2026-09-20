'use client';

import React, { useState } from 'react';
import styles from './storefront.module.css';

export default function ChinaSourcingSection() {
  const [partName, setPartName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  const whatsappText = `Hello Synapse China Sourcing Desk,\n\nI need a quote for:\n• Part/Item: ${partName}\n• Quantity: ${quantity}\n• Notes: ${notes || 'Standard factory quote'}\n\nPlease check availability and factory pricing.`;

  const stations = [
    { step: '01', title: 'Nameplate', body: 'Photo, datasheet, or 1688 link.', chip: 'chip-ink' },
    { step: '02', title: 'Plant', body: 'OEM in Guangdong / Jiangsu / Zhejiang.', chip: 'chip-kiln' },
    { step: '03', title: 'Video QC', body: 'You approve before it packs.', chip: 'chip-jade' },
    { step: '04', title: 'Landed', body: 'Air or sea. Confirm timing with your quote.', chip: 'chip-copper' },
  ];

  return (
    <section id="china-sourcing" className={`${styles.section} sourcing-section`}>
      <div className={`${styles.shell} space-y-10`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className={styles.sectionLabel}>Direct China sourcing</p><h2 className={styles.sectionTitle}>From your requirement<br />to your doorstep.</h2></div>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 sourcing-steps">
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

        <div className="grid lg:grid-cols-12 gap-10 items-start night rounded-lg p-6 sm:p-10">
          <div className="lg:col-span-6 space-y-4">
            <p className="kicker">Your sourcing brief</p>
            <h3 className="display text-3xl sm:text-4xl text-[#f3ece3]">Tell Sohel what you need.</h3>
          </div>
          <form action="https://wa.me/8801886113236" method="get" target="_blank" rel="noopener noreferrer" className="lg:col-span-6 space-y-3">
            <input type="hidden" name="text" value={whatsappText} />
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
                className="field sourcing-field"
              />
            </div>
            <div>
              <label htmlFor="src-qty" className="kicker block mb-1.5 text-[#d4a28a]">
                Quantity
              </label>
              <input
                id="src-qty"
                type="number" min="1" required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="field sourcing-field"
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
                className="field sourcing-field"
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
