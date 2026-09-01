'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Truck, CheckCircle2, Clock, XCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { Order } from '@/db/schema';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      fetchOrders();
    } catch {
      alert('Failed to update status');
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.invoice.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.productTitle.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Customer Orders & Dispatch</h2>
          <p className="text-xs text-gray-500">Manage online checkouts, FB/WhatsApp orders, and courier fulfillment.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                statusFilter === st
                  ? 'bg-[#1a3a5c] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice, phone, name..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1a3a5c]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Loading orders...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No orders match your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#fafaf8] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Invoice</th>
                  <th className="p-3.5">Customer & Phone</th>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Total & Payment</th>
                  <th className="p-3.5">Address</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5 font-bold mono text-[#1a1a1a]">
                      #{o.invoice}
                      {o.trackingCode && (
                        <div className="text-[10px] text-blue-600 font-medium">Tracking: {o.trackingCode}</div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#1a1a1a]">{o.customerName}</div>
                      <div className="text-gray-500 font-medium mono">{o.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-gray-900 line-clamp-1">{o.productTitle}</div>
                      <div className="text-[10px] text-gray-400">Qty: {o.quantity}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#e85d04] mono">৳{o.totalAmount.toLocaleString()}</div>
                      <span className="text-[10px] uppercase font-bold text-gray-500">
                        {o.paymentMethod} {o.trxId ? `(${o.trxId})` : ''}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-[200px]">
                      <div className="text-gray-600 truncate">{o.address}</div>
                      <span className="text-[10px] text-gray-400 capitalize">{o.deliveryZone}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          o.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-700'
                            : o.status === 'in_transit'
                            ? 'bg-amber-50 text-amber-700'
                            : o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : o.status === 'cancelled'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <select
                        value={o.status || 'pending'}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <a
                        href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${o.customerName}, regarding your order #${o.invoice} from Synapse Engineering...`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg inline-block align-middle"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare size={13} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
