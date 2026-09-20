'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, MessageSquare, RefreshCw } from 'lucide-react';
import { RFQ } from '@/db/schema';

export default function ReviewManager() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/rfqs', { signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.rfqs)) throw new Error(data.error || 'Could not load quotation requests.');
        return data.rfqs as RFQ[];
      })
      .then(data => { if (!controller.signal.aborted) { setRfqs(data); setError(''); } })
      .catch(cause => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Could not load quotation requests. Try refreshing.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Quotation Requests (RFQs)</h2>
          <p className="text-xs text-gray-500">Incoming B2B factory inquiries and quotation submissions.</p>
        </div>
        <button
          onClick={() => { setLoading(true); setError(''); setRevision(value => value + 1); }}
          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Loading quotation requests...</span>
          </div>
        ) : error ? (
          <p role="alert" className="p-6 text-sm text-red-700">{error}</p>
        ) : rfqs.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No RFQ requests received yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#fafaf8] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">RFQ #</th>
                  <th className="p-3.5">Client & Company</th>
                  <th className="p-3.5">Requested Product / Part</th>
                  <th className="p-3.5">Qty</th>
                  <th className="p-3.5">Requirements / Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rfqs.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5 font-bold mono text-[#1a1a1a]">#{r.rfqNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#1a1a1a]">{r.contactName}</div>
                      <div className="text-gray-500">{r.companyName || 'Private / Mill'}</div>
                      <div className="text-[11px] text-gray-400 mono">{r.phone}</div>
                    </td>
                    <td className="p-3.5 font-bold text-[#1a1a1a]">{r.productTitle}</td>
                    <td className="p-3.5 font-medium">{r.quantity}</td>
                    <td className="p-3.5 text-gray-600 max-w-xs truncate">{r.projectRequirement || 'N/A'}</td>
                    <td className="p-3.5 text-right">
                      <a
                        href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '').replace(/^01/, '8801')}?text=${encodeURIComponent(
                          `Hello ${r.contactName}, regarding your quotation request #${r.rfqNumber} for ${r.productTitle}...`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1 font-bold text-[11px]"
                      >
                        <MessageSquare size={13} />
                        <span>Send Quote</span>
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
