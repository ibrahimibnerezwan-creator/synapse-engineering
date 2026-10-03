'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import type { RFQ } from '@/db/schema';
import { RFQ_STATUSES } from '@/lib/workflow';
import { errorText, readJson, whatsappPhone } from '@/lib/clientApi';

export default function ReviewManager() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const load = useCallback((signal?: AbortSignal) => fetch('/api/admin/rfqs', { cache: 'no-store', signal })
    .then(response => readJson<{ rfqs: RFQ[] }>(response))
    .then(data => {
      if (!Array.isArray(data.rfqs)) throw new Error('The quotation list could not be read.');
      if (signal?.aborted) return;
      setError('');
      setRfqs(data.rfqs); setNotes(Object.fromEntries(data.rfqs.map(rfq => [rfq.id, rfq.adminNotes || ''])));
    })
    .catch(cause => { if (!signal?.aborted) setError(errorText(cause)); })
    .finally(() => { if (!signal?.aborted) setLoading(false); }), []);
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);
  const refresh = () => { setLoading(true); setError(''); void load(); };
  const update = async (id: number, change: { status?: string; adminNotes?: string }) => {
    setBusy(id); setError('');
    try {
      const data = await readJson<{ rfq: RFQ }>(await fetch('/api/admin/rfqs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...change }) }));
      if (!data.rfq) throw new Error('The quotation was not updated.');
      setRfqs(previous => previous.map(item => item.id === id ? data.rfq : item));
    } catch (cause) { setError(errorText(cause)); } finally { setBusy(null); }
  };
  return <section className="space-y-4">
    <div className="flex justify-between items-center gap-3 flex-wrap"><div><h2 className="text-2xl font-bold">Quotation requests</h2><p className="text-sm text-gray-600">Follow each request from first contact to completion.</p></div><button type="button" onClick={refresh} disabled={loading || busy !== null} className="btn-ghost"><RefreshCw size={16} />Refresh</button></div>
    {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{error}</p>}
    {loading ? <p className="p-10 flex justify-center gap-2"><Loader2 size={18} className="animate-spin" />Loading quotations…</p> : !rfqs.length && !error ? <p className="p-10 bg-white border rounded-xl">No quotation requests received yet.</p> : rfqs.map(rfq => <article key={rfq.id} className="p-5 bg-white border rounded-xl space-y-3">
      <div className="flex justify-between flex-wrap gap-3"><div><p className="text-sm text-gray-500">{rfq.rfqNumber}</p><h3 className="text-lg font-semibold">{rfq.productTitle}</h3><p>{rfq.contactName}{rfq.companyName ? ' · ' + rfq.companyName : ''}</p><a href={'tel:' + rfq.phone} className="text-sm underline">{rfq.phone}</a>{rfq.email && <p className="text-sm">{rfq.email}</p>}</div><div><label htmlFor={'rfq-status-' + rfq.id} className="sr-only">Status for {rfq.rfqNumber}</label><select id={'rfq-status-' + rfq.id} value={rfq.status || 'new'} disabled={busy !== null} onChange={event => update(rfq.id, { status: event.target.value })} className="border rounded-lg p-3 bg-white">{RFQ_STATUSES.map(status => <option key={status}>{status}</option>)}</select></div></div>
      <p className="text-sm">Quantity: {rfq.quantity || 1}</p><p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{rfq.projectRequirement || 'No additional requirement.'}</p>
      <div><label htmlFor={'rfq-note-' + rfq.id} className="block text-sm font-semibold mb-1">Seller notes</label><textarea id={'rfq-note-' + rfq.id} rows={2} maxLength={2000} value={notes[rfq.id] || ''} onChange={event => setNotes(previous => ({ ...previous, [rfq.id]: event.target.value }))} className="w-full border rounded-lg p-3 text-base" /></div>
      <div className="flex gap-3 flex-wrap"><button type="button" onClick={() => update(rfq.id, { adminNotes: notes[rfq.id] || '' })} disabled={busy !== null} className="btn-ink">{busy === rfq.id ? 'Saving…' : 'Save notes'}</button><a href={'https://wa.me/' + whatsappPhone(rfq.phone) + '?text=' + encodeURIComponent('Hello ' + rfq.contactName + ', regarding your quotation request ' + rfq.rfqNumber + ' for ' + rfq.productTitle)} target="_blank" rel="noopener noreferrer" className="btn-jade">Send quote on WhatsApp ↗</a></div>
    </article>)}
  </section>;
}
