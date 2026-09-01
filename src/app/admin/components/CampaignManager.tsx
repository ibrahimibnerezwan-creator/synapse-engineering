'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Plane, MessageSquare, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SourcingInquiry } from '@/db/schema';

export default function CampaignManager() {
  const [inquiries, setInquiries] = useState<SourcingInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sourcing');
      const data = await res.json();
      if (Array.isArray(data)) setInquiries(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Direct China Sourcing Requests</h2>
          <p className="text-xs text-gray-500">Custom factory inquiries requiring on-ground plant visits in Shenzhen, Dongguan & Ningbo.</p>
        </div>
        <button
          onClick={fetchInquiries}
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
            <span>Loading sourcing requests...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No direct China sourcing inquiries pending.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#fafaf8] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Inquiry #</th>
                  <th className="p-3.5">Client & Phone</th>
                  <th className="p-3.5">Item Requested</th>
                  <th className="p-3.5">Specification</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((iq) => (
                  <tr key={iq.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5 font-bold mono text-[#1a1a1a]">#{iq.inquiryNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#1a1a1a]">{iq.clientName}</div>
                      <div className="text-[11px] text-gray-400 mono">{iq.phone}</div>
                    </td>
                    <td className="p-3.5 font-bold text-[#1a1a1a]">{iq.itemName}</td>
                    <td className="p-3.5 text-gray-600 max-w-xs truncate">{iq.specification || 'Standard wholesale'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] uppercase">
                        {iq.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <a
                        href={`https://wa.me/${iq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${iq.clientName}, regarding your China Sourcing Inquiry #${iq.inquiryNumber} for ${iq.itemName}...`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1 font-bold text-[11px]"
                      >
                        <MessageSquare size={13} />
                        <span>WhatsApp Video QC</span>
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
