'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Loader2, Package, CheckSquare, Square } from 'lucide-react';
import { Order } from '@/db/schema';

export default function LabelManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data.filter((o) => o.status === 'pending' || o.status === 'confirmed'));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === orders.length) setSelectedIds([]);
    else setSelectedIds(orders.map((o) => o.id));
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedOrders = orders.filter((o) => selectedIds.includes(o.id));

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center flex-wrap gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Print Shipping Labels</h2>
          <p className="text-xs text-gray-500">Generate Steadfast Courier packing slips and dispatch labels.</p>
        </div>
        <button
          onClick={handlePrint}
          disabled={selectedOrders.length === 0}
          className="px-4 py-2.5 bg-[#1a3a5c] hover:bg-[#0f2a45] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition"
        >
          <Printer size={16} />
          <span>Print {selectedOrders.length} Label(s)</span>
        </button>
      </div>

      {/* Select Table (hidden when printing) */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm no-print">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Loading orders for dispatch...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No pending orders ready for label printing.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#fafaf8] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 w-10">
                    <button onClick={selectAll} className="text-gray-500">
                      {selectedIds.length === orders.length ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                  </th>
                  <th className="p-3.5">Invoice</th>
                  <th className="p-3.5">Recipient</th>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">COD Amount</th>
                  <th className="p-3.5">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => toggleSelect(o.id)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5">
                      {selectedIds.includes(o.id) ? (
                        <CheckSquare size={16} className="text-[#1a3a5c]" />
                      ) : (
                        <Square size={16} className="text-gray-300" />
                      )}
                    </td>
                    <td className="p-3.5 font-bold mono">#{o.invoice}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#1a1a1a]">{o.customerName}</div>
                      <div className="text-gray-500 mono">{o.phone}</div>
                    </td>
                    <td className="p-3.5 font-medium">{o.productTitle}</td>
                    <td className="p-3.5 font-bold mono text-[#e85d04]">
                      {o.paymentMethod === 'cod' ? `৳${o.totalAmount.toLocaleString()}` : 'PAID'}
                    </td>
                    <td className="p-3.5 text-gray-600 truncate max-w-xs">{o.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Labels Canvas */}
      {selectedOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-only">
          {selectedOrders.map((o) => (
            <div
              key={o.id}
              className="p-5 border-2 border-dashed border-gray-400 rounded-xl bg-white text-left space-y-3"
            >
              <div className="flex justify-between items-start border-b border-gray-300 pb-2">
                <div>
                  <div className="font-extrabold text-sm text-[#1a1a1a]">SYNAPSE ENGINEERING</div>
                  <div className="text-[10px] text-gray-500">Dhaka & Guangdong Sourcing Desk</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold mono">INVOICE: #{o.invoice}</div>
                  <div className="text-[10px] text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[10px] uppercase font-bold text-gray-400">DELIVER TO:</div>
                <div className="font-bold text-base text-[#1a1a1a]">{o.customerName}</div>
                <div className="font-bold mono text-sm">{o.phone}</div>
                <div className="text-gray-700 leading-snug">{o.address}</div>
              </div>

              <div className="border-t border-gray-300 pt-2 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500">Product: </span>
                  <span className="font-bold">{o.productTitle} (×{o.quantity})</span>
                </div>
                <div className="text-right font-bold mono text-sm text-[#e85d04]">
                  COD: {o.paymentMethod === 'cod' ? `৳${o.totalAmount.toLocaleString()}` : 'PREPAID'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
