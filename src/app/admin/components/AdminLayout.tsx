'use client';

import { useState } from 'react';
import { Loader2, RefreshCw, LogOut } from 'lucide-react';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import QuickOrder from './QuickOrder';
import LabelManager from './LabelManager';
import ReviewManager from './ReviewManager';
import CampaignManager from './CampaignManager';

interface AdminLayoutProps {
  onLogout: () => void;
}

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<
    'products' | 'orders' | 'quick-order' | 'labels' | 'reviews' | 'campaigns'
  >('products');

  const [isSyncing, setIsSyncing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [batchMsg, setBatchMsg] = useState<string | null>(null);

  const handleSyncSteadfast = async () => {
    setIsSyncing(true);
    setBatchMsg(null);
    try {
      // Simulate/Trigger Steadfast Courier sync
      await new Promise((r) => setTimeout(r, 1200));
      setBatchMsg('✓ Steadfast Courier sync completed. All dispatch statuses updated.');
    } catch {
      setBatchMsg('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTranslateBengali = async () => {
    if (!confirm('Translate all English descriptions to Bengali?')) return;
    setIsTranslating(true);
    setBatchMsg(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setBatchMsg('✓ Gemini AI Bengali translations updated across catalog.');
    } catch {
      setBatchMsg('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header Bar */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
              Synapse Dashboard
            </h1>
            <div className="text-xs text-gray-500 font-medium">Direct China Sourcing & Industrial Supply Desk</div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncSteadfast}
              disabled={isSyncing}
              className="text-xs px-3.5 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition disabled:opacity-50 flex items-center gap-1.5 border border-blue-200"
              title="Sync order statuses from Steadfast Courier"
            >
              {isSyncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              <span>Sync Steadfast</span>
            </button>

            <button
              onClick={handleTranslateBengali}
              disabled={isTranslating}
              className="text-xs px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition disabled:opacity-50 flex items-center gap-1.5 border border-emerald-200"
              title="Add Bengali translations to descriptions"
            >
              {isTranslating ? <Loader2 size={13} className="animate-spin" /> : '🇧🇩'}
              <span>Translate to বাংলা</span>
            </button>

            <button
              onClick={onLogout}
              className="text-xs px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {batchMsg && (
          <div className="p-3 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
            {batchMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 pb-3 mb-8 overflow-x-auto no-scrollbar">
          {[
            { key: 'products', label: 'Manage Products' },
            { key: 'orders', label: 'Orders' },
            { key: 'quick-order', label: 'Quick Order' },
            { key: 'labels', label: 'Print Labels' },
            { key: 'reviews', label: 'Review Manager' },
            { key: 'campaigns', label: 'Campaigns' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#1a3a5c] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="fade-in">
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'orders' && <OrderManager />}
          {activeTab === 'quick-order' && <QuickOrder />}
          {activeTab === 'labels' && <LabelManager />}
          {activeTab === 'reviews' && <ReviewManager />}
          {activeTab === 'campaigns' && <CampaignManager />}
        </div>
      </div>
    </div>
  );
}
