'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import type { SourcingInquiry } from '@/db/schema';
import { SOURCING_STATUSES } from '@/lib/workflow';
import { errorText, readJson, whatsappPhone } from '@/lib/clientApi';

export default function CampaignManager() {
  const [inquiries, setInquiries] = useState<SourcingInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [tracking, setTracking] = useState<Record<number, string>>({});
  const load = useCallback((signal?: AbortSignal) => fetch('/api/admin/sourcing', { cache: 'no-store', signal })
    .then(response => readJson<{ inquiries: SourcingInquiry[] }>(response))
    .then(data => {
      if (!Array.isArray(data.inquiries)) throw new Error('The sourcing list could not be read.');
      if (signal?.aborted) return;
      setError('');
      setInquiries(data.inquiries); setNotes(Object.fromEntries(data.inquiries.map(inquiry => [inquiry.id, inquiry.adminNotes || ''])));
      setTracking(Object.fromEntries(data.inquiries.map(inquiry => [inquiry.id, inquiry.trackingCode || ''])));
    })
    .catch(cause => { if (!signal?.aborted) setError(errorText(cause)); })
    .finally(() => { if (!signal?.aborted) setLoading(false); }), []);
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);
  const refresh = () => { setLoading(true); setError(''); void load(); };
  const update = async (id: number, change: { status?: string; adminNotes?: string; trackingCode?: string }) => {
    setBusy(id); setError('');
    try {
      const data = await readJson<{ inquiry: SourcingInquiry }>(await fetch('/api/admin/sourcing', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...change }) }));
      if (!data.inquiry) throw new Error('The inquiry was not updated.');
      setInquiries(previous => previous.map(item => item.id === id ? data.inquiry : item));
    } catch (cause) { setError(errorText(cause)); } finally { setBusy(null); }
  };
  return <section className="space-y-4">
    <div className="flex justify-between items-center gap-3 flex-wrap"><div><h2 className="text-2xl font-bold">China sourcing requests</h2><p className="text-sm text-gray-600">Saved requirements from the website.</p></div><button type="button" onClick={refresh} disabled={loading || busy !== null} className="btn-ghost"><RefreshCw size={16} />Refresh</button></div>
    {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{error}</p>}
    {loading ? <p className="p-10 flex justify-center gap-2"><Loader2 size={18} className="animate-spin" />Loading sourcing requests…</p> : !inquiries.length && !error ? <p className="p-10 bg-white border rounded-xl">No sourcing requests received yet.</p> : inquiries.map(inquiry => <article key={inquiry.id} className="p-5 bg-white border rounded-xl space-y-3">
      <div className="flex justify-between flex-wrap gap-3"><div><p className="text-sm text-gray-500">{inquiry.inquiryNumber}</p><h3 className="text-lg font-semibold">{inquiry.itemName}</h3><p>{inquiry.clientName}{inquiry.companyName ? ' · ' + inquiry.companyName : ''}</p><a href={'tel:' + inquiry.phone} className="text-sm underline">{inquiry.phone}</a>{inquiry.email && <p className="text-sm">{inquiry.email}</p>}</div><div><label htmlFor={'sourcing-status-' + inquiry.id} className="sr-only">Status for {inquiry.inquiryNumber}</label><select id={'sourcing-status-' + inquiry.id} value={inquiry.status || 'reviewing'} disabled={busy !== null} onChange={event => update(inquiry.id, { status: event.target.value })} className="border rounded-lg p-3 bg-white">{SOURCING_STATUSES.map(status => <option key={status}>{status}</option>)}</select></div></div>
      <p className="text-sm">Quantity: {inquiry.targetQuantity || 1}{inquiry.targetBudget ? ' · Budget: ' + inquiry.targetBudget : ''}</p>
      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{inquiry.specification || 'No additional specification.'}</p>
      {inquiry.sampleOrPhotoUrl && /^https:\/\//.test(inquiry.sampleOrPhotoUrl) && <a href={inquiry.sampleOrPhotoUrl} className="underline text-sm" target="_blank" rel="noopener noreferrer">Reference photo / link</a>}
      <div><label htmlFor={'sourcing-tracking-' + inquiry.id} className="block text-sm font-semibold mb-1">Real shipment tracking code</label><input id={'sourcing-tracking-' + inquiry.id} maxLength={120} value={tracking[inquiry.id] || ''} onChange={event => setTracking(previous => ({ ...previous, [inquiry.id]: event.target.value }))} className="w-full border rounded-lg p-3 text-base" placeholder="Add after arranging shipment" /></div>
      <div><label htmlFor={'sourcing-note-' + inquiry.id} className="block text-sm font-semibold mb-1">Seller notes</label><textarea id={'sourcing-note-' + inquiry.id} rows={2} maxLength={2000} value={notes[inquiry.id] || ''} onChange={event => setNotes(previous => ({ ...previous, [inquiry.id]: event.target.value }))} className="w-full border rounded-lg p-3 text-base" /></div>
      <div className="flex gap-3 flex-wrap"><button type="button" onClick={() => update(inquiry.id, { adminNotes: notes[inquiry.id] || '', trackingCode: tracking[inquiry.id] || '' })} disabled={busy !== null} className="btn-ink">{busy === inquiry.id ? 'Saving…' : 'Save request details'}</button><a href={'https://wa.me/' + whatsappPhone(inquiry.phone) + '?text=' + encodeURIComponent('Hello ' + inquiry.clientName + ', regarding your sourcing request ' + inquiry.inquiryNumber + ' for ' + inquiry.itemName)} target="_blank" rel="noopener noreferrer" className="btn-jade">WhatsApp customer ↗</a></div>
    </article>)}
  </section>;
}
