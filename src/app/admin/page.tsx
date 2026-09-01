'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  FileText,
  ShieldCheck,
  Package,
  Plus,
  Sparkles,
  Phone,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/data';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'rfqs' | 'sourcing' | 'products' | 'ai-lister'>('rfqs');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Mock RFQs for immediate demo in admin dashboard
  const [rfqsList] = useState([
    {
      id: 'SYN-881920',
      contactName: 'Engr. Tariqul Islam',
      companyName: 'Akij Textiles Ltd.',
      phone: '01712-345678',
      productTitle: 'HiTHIUM HeroEE 16 — 16kWh LiFePO₄ Battery Pack',
      quantity: 4,
      requirement: 'Require 4 units for weaving shed backup. Need Deye 50kW protocol integration.',
      status: 'New',
      date: '2026-09-01'
    },
    {
      id: 'SYN-881914',
      contactName: 'Md. Kamrul Hasan',
      companyName: 'Bashundhara Paper Mills',
      phone: '01886-987654',
      productTitle: 'Siemens SIMATIC S7-1500 6ES7532-5HD00-0AB0',
      quantity: 2,
      requirement: 'Need replacement module with factory test certificate.',
      status: 'Quoted',
      date: '2026-08-31'
    }
  ]);

  // Sourcing Inquiries
  const [sourcingList] = useState([
    {
      id: 'SRC-90112',
      clientName: 'Mustafa Ahmed',
      companyName: 'Prime Ceramics Ltd.',
      phone: '01911-223344',
      itemName: 'High-Temperature Kiln Thermocouple Sensor (Obsolete model)',
      specification: 'Type S, 1600°C rated, 1200mm probe length. Need OEM factory direct in China.',
      targetQuantity: 10,
      status: 'Factory Matched (Guangdong)'
    }
  ]);

  // AI Auto Lister State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleSimulateAiExtract = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiResult({
        title: 'Schneider Electric LC1D18M7 Contactor 18A 220V',
        titleBn: 'স্নাইডার ইলেকট্রিক টেসিস ডি ১৮ অ্যাম্পিয়ার কন্টাক্টর',
        brand: 'Schneider Electric',
        modelNo: 'LC1D18M7',
        category: 'Industrial Automation',
        specs: {
          Current: '18A (AC-3)',
          Coil: '220V AC 50/60Hz',
          Poles: '3P + 1 NO + 1 NC',
          Durability: '15 Million Mechanical Cycles'
        },
        description:
          'Genuine Schneider TeSys D 18A 3-Pole Contactor for motor control and industrial panel automation. Sourced directly from authorized distributors in China.'
      });
      setAiAnalyzing(false);
    }, 1200);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-sky-500/30 bg-slate-900 shadow-2xl space-y-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/40">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Synapse Engineering Portal</h3>
            <p className="text-xs text-slate-400 mt-1">Management Desk & China Sourcing Center</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAuthenticated(true);
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password (e.g. admin2026)"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400 text-center"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all"
            >
              Access Dashboard
            </button>
          </form>
          <div className="text-[11px] text-slate-500">
            <Link href="/" className="hover:text-sky-400">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-white">Synapse Admin 2.0</span>
            <div className="text-[10px] text-slate-400">Dhaka & China Procurement Hub</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            View Live Site ↗
          </Link>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-xs text-rose-400 hover:text-rose-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('rfqs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'rfqs'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Enterprise RFQs ({rfqsList.length})
          </button>

          <button
            onClick={() => setActiveTab('sourcing')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'sourcing'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            China Sourcing Requests ({sourcingList.length})
          </button>

          <button
            onClick={() => setActiveTab('ai-lister')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'ai-lister'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Machine Tag OCR Lister
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Catalog Inventory ({INITIAL_PRODUCTS.length})
          </button>
        </div>

        {/* Tab 1: RFQ Leads */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Live Enterprise RFQ Submissions</h3>
            <div className="grid gap-4">
              {rfqsList.map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded">
                        {rfq.id}
                      </span>
                      <span className="text-xs font-bold text-white">{rfq.companyName}</span>
                      <span className="text-xs text-slate-400">({rfq.contactName})</span>
                    </div>
                    <div className="text-sm font-semibold text-sky-400">{rfq.productTitle}</div>
                    <div className="text-xs text-slate-400">
                      Qty: <strong>{rfq.quantity}</strong> • Notes: {rfq.requirement}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`https://wa.me/88${rfq.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp Client ({rfq.phone})
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: China Sourcing Inquiries */}
        {activeTab === 'sourcing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">China Direct Procurement Pipeline</h3>
            <div className="grid gap-4">
              {sourcingList.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl glass-panel border border-emerald-500/30 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-white">{item.companyName}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{item.itemName}</div>
                    <div className="text-xs text-slate-300">Spec: {item.specification}</div>
                    <div className="text-xs font-mono text-emerald-400">Status: {item.status}</div>
                  </div>

                  <a
                    href={`https://wa.me/88${item.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    Contact Client ({item.phone})
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: AI Machine Tag OCR Lister */}
        {activeTab === 'ai-lister' && (
          <div className="max-w-3xl mx-auto rounded-3xl glass-panel border border-amber-500/30 p-8 space-y-6">
            <div>
              <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                AI Vision & OCR Engine
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Auto-Extract Specs from China Machine Nameplate
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Simply take a photo of any component nameplate or box tag received in China. Gemini Vision parses all specs automatically.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-8 text-center space-y-3 cursor-pointer bg-slate-900/40">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-xs font-bold text-white">Click to Upload Nameplate Photo / Tag</div>
              <div className="text-[11px] text-slate-500">Supports JPEG, PNG, WEBP (Auto compressed)</div>
              <button
                type="button"
                onClick={handleSimulateAiExtract}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                {aiAnalyzing ? 'AI Parsing Nameplate...' : 'Simulate Gemini Vision Extraction'}
              </button>
            </div>

            {aiResult && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully Extracted Specifications!
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Title (English):</span>
                    <span className="font-bold text-white">{aiResult.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Model No:</span>
                    <span className="font-mono text-amber-400">{aiResult.modelNo}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block">Bengali Title:</span>
                  <span className="text-slate-300">{aiResult.titleBn}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Specs:</span>
                  <pre className="p-2 rounded bg-slate-950 text-[11px] font-mono text-slate-300 overflow-x-auto">
                    {JSON.stringify(aiResult.specs, null, 2)}
                  </pre>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-colors"
                >
                  Publish Directly to Live Catalog
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Product Catalog */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Live Catalog Inventory</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl glass-panel border border-slate-800 flex gap-4 items-center"
                >
                  <img
                    src={prod.primaryImage}
                    alt={prod.title}
                    className="w-16 h-16 rounded-lg object-contain bg-slate-900 p-2"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-sky-400">{prod.brand}</div>
                    <div className="text-xs font-bold text-white truncate">{prod.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{prod.stockStatus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
