'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import type { Order } from '@/db/schema';
import { ORDER_STATUSES } from '@/lib/workflow';
import { errorText, readJson, whatsappPhone } from '@/lib/clientApi';

type Details = { status: string; trackingCode: string; note: string };
export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Details>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const load = useCallback((signal?: AbortSignal) => fetch('/api/admin/orders', { cache: 'no-store', signal })
    .then(response => readJson<Order[]>(response))
    .then(data => {
      if (!Array.isArray(data)) throw new Error('The order list could not be read.');
      if (signal?.aborted) return;
      setError('');
      setOrders(data); setDrafts(Object.fromEntries(data.map(order => [order.id, { status: order.status || 'pending', trackingCode: order.trackingCode || '', note: order.note || '' }])));
    })
    .catch(cause => { if (!signal?.aborted) setError(errorText(cause)); })
    .finally(() => { if (!signal?.aborted) setLoading(false); }), []);
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);
  const refresh = () => { setLoading(true); setError(''); void load(); };
  const setDetail = (id: number, key: keyof Details, value: string) => setDrafts(previous => ({ ...previous, [id]: { ...previous[id], [key]: value } }));
  const save = async (event: React.FormEvent, id: number) => {
    event.preventDefault(); setBusy(id); setError(''); setNotice('');
    try {
      const data = await readJson<{ order: Order }>(await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...drafts[id] }) }));
      if (!data.order) throw new Error('The order was not updated.');
      setOrders(previous => previous.map(order => order.id === id ? data.order : order)); setNotice('Order ' + data.order.invoice + ' updated.');
    } catch (cause) { setError(errorText(cause)); } finally { setBusy(null); }
  };
  const needle = search.trim().toLowerCase();
  const filtered = orders.filter(order => (statusFilter === 'all' || order.status === statusFilter) && [order.invoice, order.customerName, order.phone, order.productTitle].some(value => value.toLowerCase().includes(needle)));
  return <section className="space-y-4">
    <div className="flex justify-between items-center gap-3 flex-wrap"><div><h2 className="text-2xl font-bold">Customer orders</h2><p className="text-sm text-gray-600">Check payments and manage dispatch details.</p></div><button type="button" onClick={refresh} disabled={loading || busy !== null} className="btn-ghost"><RefreshCw size={16} />Refresh</button></div>
    {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{error}</p>}
    {notice && <p role="status" className="p-3 bg-emerald-50 text-emerald-800 rounded-lg">{notice}</p>}
    <div className="flex flex-col sm:flex-row gap-3"><label htmlFor="order-search" className="sr-only">Search orders</label><input id="order-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Invoice, phone, name or product" className="flex-1 border rounded-lg p-3 text-base bg-white" /><label htmlFor="order-filter" className="sr-only">Filter order status</label><select id="order-filter" value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="border rounded-lg p-3 bg-white"><option value="all">All statuses</option>{ORDER_STATUSES.map(status => <option key={status}>{status}</option>)}</select></div>
    <p className="text-sm text-gray-500">{filtered.length} of {orders.length} orders</p>
    {loading ? <p className="p-10 flex justify-center gap-2"><Loader2 size={18} className="animate-spin" />Loading orders…</p> : !filtered.length && !error ? <p className="p-10 bg-white border rounded-xl">No orders match your filters.</p> : filtered.map(order => <article key={order.id} className="p-5 bg-white border rounded-xl space-y-4">
      <div className="flex justify-between gap-3 flex-wrap"><div><p className="font-mono text-sm text-gray-500">{order.invoice} · {order.status}</p><h3 className="text-lg font-semibold">{order.customerName}</h3><a href={'tel:' + order.phone} className="underline">{order.phone}</a></div><div className="text-right"><p className="text-xl font-semibold">৳{order.totalAmount.toLocaleString('en-BD')}</p><p className="text-sm">{order.paymentMethod?.toUpperCase()}</p>{order.paymentMethod !== 'cod' && order.status === 'pending' && <p className="text-sm text-amber-800">Verify payment before confirming</p>}</div></div>
      <p className="font-semibold">{order.productTitle} × {order.quantity || 1}</p><p className="text-sm text-gray-600">Products: ৳{order.productAmount.toLocaleString('en-BD')} · Delivery: ৳{Number(order.deliveryCharge).toLocaleString('en-BD')} ({order.deliveryZone})</p>
      <p className="whitespace-pre-wrap break-words text-sm">{order.address}</p>{order.trxId && <p className="font-mono text-sm break-all">Transaction: {order.trxId}</p>}
      <form onSubmit={event => save(event, order.id)} className="space-y-3 border-t pt-4">
        <div className="grid sm:grid-cols-2 gap-3"><div><label htmlFor={'order-status-' + order.id} className="block text-sm font-semibold mb-1">Order status</label><select id={'order-status-' + order.id} value={drafts[order.id]?.status || 'pending'} disabled={busy !== null} onChange={event => setDetail(order.id, 'status', event.target.value)} className="w-full border rounded-lg p-3 bg-white">{ORDER_STATUSES.map(status => <option key={status}>{status}</option>)}</select></div><div><label htmlFor={'order-tracking-' + order.id} className="block text-sm font-semibold mb-1">Real courier tracking code</label><input id={'order-tracking-' + order.id} maxLength={120} value={drafts[order.id]?.trackingCode || ''} disabled={busy !== null} onChange={event => setDetail(order.id, 'trackingCode', event.target.value)} className="w-full border rounded-lg p-3 text-base" placeholder="Add after booking the shipment" /></div></div>
        <div><label htmlFor={'order-note-' + order.id} className="block text-sm font-semibold mb-1">Seller notes</label><textarea id={'order-note-' + order.id} rows={2} maxLength={2000} value={drafts[order.id]?.note || ''} disabled={busy !== null} onChange={event => setDetail(order.id, 'note', event.target.value)} className="w-full border rounded-lg p-3 text-base" /></div>
        <div className="flex flex-wrap gap-3"><button type="submit" disabled={busy !== null} className="btn-ink">{busy === order.id ? 'Saving…' : 'Save order details'}</button><a href={'https://wa.me/' + whatsappPhone(order.phone) + '?text=' + encodeURIComponent('Hello ' + order.customerName + ', regarding your order ' + order.invoice + ' from Synapse Engineering.')} target="_blank" rel="noopener noreferrer" className="btn-jade">WhatsApp customer ↗</a></div>
      </form>
    </article>)}
  </section>;
}
