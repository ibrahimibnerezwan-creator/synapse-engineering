'use client';

import { useState } from 'react';
import { LogOut, ExternalLink } from 'lucide-react';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import QuickOrder from './QuickOrder';
import LabelManager from './LabelManager';
import ReviewManager from './ReviewManager';
import CampaignManager from './CampaignManager';
import { errorText } from '@/lib/clientApi';

const tabs = [
  { key: 'products', label: 'Products' }, { key: 'orders', label: 'Orders' },
  { key: 'quick-order', label: 'Quick order' }, { key: 'labels', label: 'Shipping labels' },
  { key: 'reviews', label: 'Quotation requests' }, { key: 'campaigns', label: 'China sourcing' },
] as const;
type Tab = typeof tabs[number]['key'];

export default function AdminLayout({ onLogout }: { onLogout: () => Promise<void> }) {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const logout = async () => {
    setLoggingOut(true); setLogoutError('');
    try { await onLogout(); }
    catch (cause) { setLogoutError(errorText(cause)); }
    finally { setLoggingOut(false); }
  };
  return <main id="main" className="admin-shell min-h-screen bg-[#fafaf8] p-4 md:p-8">
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-6 flex-wrap gap-4 no-print">
        <div><h1 className="text-3xl font-bold">Synapse seller desk</h1><p className="text-sm text-gray-600">Products, customer orders and sourcing requests.</p></div>
        <div className="flex items-center gap-2"><a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost"><ExternalLink size={16} />View store</a><button type="button" onClick={logout} disabled={loggingOut} className="btn-ghost"><LogOut size={16} />{loggingOut ? 'Logging out…' : 'Log out'}</button></div>
      </header>
      {logoutError && <p role="alert" className="p-3 mb-4 bg-red-50 text-red-800 rounded-lg">{logoutError}</p>}
      <p className="p-3 mb-5 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-lg no-print">Courier bookings and payment checks are manual. Add the real tracking code after booking with your courier. Confirm prepaid orders after checking the transaction.</p>
      <nav className="flex gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto no-print" aria-label="Seller sections">
        {tabs.map(tab => <button type="button" key={tab.key} onClick={() => setActiveTab(tab.key)} aria-current={activeTab === tab.key ? 'page' : undefined} className={activeTab === tab.key ? 'btn-ink shrink-0' : 'btn-ghost shrink-0'}>{tab.label}</button>)}
      </nav>
      {activeTab === 'products' && <ProductManager />}
      {activeTab === 'orders' && <OrderManager />}
      {activeTab === 'quick-order' && <QuickOrder onOrderCreated={() => setActiveTab('orders')} />}
      {activeTab === 'labels' && <LabelManager />}
      {activeTab === 'reviews' && <ReviewManager />}
      {activeTab === 'campaigns' && <CampaignManager />}
    </div>
  </main>;
}
