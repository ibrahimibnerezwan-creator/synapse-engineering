'use client';

import React, { useState } from 'react';
import styles from './storefront.module.css';
import { errorText, readJson } from '@/lib/clientApi';

export default function ChinaSourcingSection() {
  const [partName, setPartName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [reference, setReference] = useState('');
  const [budget, setBudget] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (saving) return;
    setSaving(true); setError('');
    try {
      const data = await readJson<{ success: boolean; inquiryNumber: string }>(await fetch('/api/sourcing-inquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, phone, companyName, itemName: partName, targetQuantity: Number(quantity), specification: notes, targetBudget: budget, sampleOrPhotoUrl: reference }),
      }));
      if (!data.success || !data.inquiryNumber) throw new Error('The request was not saved. Please try again.');
      setReceipt(data.inquiryNumber);
    } catch (cause) { setError(errorText(cause)); } finally { setSaving(false); }
  };

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
          {receipt ? <div className="lg:col-span-6 space-y-4" role="status">
            <h3 className="display text-3xl text-[#f3ece3]">Your request is saved.</h3>
            <p className="text-[#f3ece3]">Reference: {receipt}. Sohel will review your requirement and contact you.</p>
            <a className="btn-copper" href={`https://wa.me/8801886113236?text=${encodeURIComponent(whatsappText + '\nReference: ' + receipt)}`} target="_blank" rel="noopener noreferrer">Discuss on WhatsApp ↗</a>
            <button type="button" className="btn-ghost text-[#f3ece3]" onClick={() => { setReceipt(''); setPartName(''); setQuantity('1'); setNotes(''); setReference(''); setBudget(''); }}>Send another request</button>
          </div> : <form onSubmit={submit} className="lg:col-span-6 space-y-3">
            {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{error}</p>}
            <fieldset disabled={saving} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label htmlFor="src-name" className="kicker block mb-1.5 text-[#d4a28a]">Your name *</label><input id="src-name" autoComplete="name" required maxLength={120} value={clientName} onChange={event => setClientName(event.target.value)} className="field sourcing-field" /></div>
              <div><label htmlFor="src-phone" className="kicker block mb-1.5 text-[#d4a28a]">Phone / WhatsApp *</label><input id="src-phone" autoComplete="tel" type="tel" required maxLength={30} value={phone} onChange={event => setPhone(event.target.value)} placeholder="01XXXXXXXXX" className="field sourcing-field" /></div>
            </div>
            <div><label htmlFor="src-company" className="kicker block mb-1.5 text-[#d4a28a]">Company (optional)</label><input id="src-company" maxLength={200} value={companyName} onChange={event => setCompanyName(event.target.value)} className="field sourcing-field" /></div>
            <div>
              <label htmlFor="src-part" className="kicker block mb-1.5 text-[#d4a28a]">
                Part / gadget
              </label>
              <input
                id="src-part"
                required maxLength={300}
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
                type="number" min="1" max="1000000" step="1" required
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
                rows={2} maxLength={5000}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Air, brand, voltage…"
                className="field sourcing-field"
              />
            </div>
            <div><label htmlFor="src-reference" className="kicker block mb-1.5 text-[#d4a28a]">Photo, datasheet or product link (optional)</label><input id="src-reference" type="url" maxLength={2048} value={reference} onChange={event => setReference(event.target.value)} placeholder="https://…" className="field sourcing-field" /></div>
            <div><label htmlFor="src-budget" className="kicker block mb-1.5 text-[#d4a28a]">Target budget (optional)</label><input id="src-budget" maxLength={200} value={budget} onChange={event => setBudget(event.target.value)} className="field sourcing-field" /></div>
            <button type="submit" disabled={saving} className="btn-copper w-full py-3 disabled:opacity-50">
              {saving ? 'Saving…' : 'Send sourcing request'}
            </button>
            <a href={`https://wa.me/8801886113236?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer" className="block text-sm underline text-[#f3ece3]">Or ask directly on WhatsApp ↗</a>
            </fieldset>
          </form>}
        </div>
      </div>
    </section>
  );
}
