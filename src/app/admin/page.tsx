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
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Terminal
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/data';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'rfqs' | 'sourcing' | 'products' | 'ai-lister'>('rfqs');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2026' || password.trim().toLowerCase() === 'admin') {
      setAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid password. Default password is: admin2026');
    }
  };

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
      <div className="min-h-screen bg-[#06080c] flex items-center justify-center p-4 tech-grid-bg">
        <div className="w-full max-w-md p-8 rounded-2xl hud-panel border border-[#00f0ff]/40 bg-[#090e17] shadow-[0_0_50px_rgba(0,240,255,0.15)] space-y-6 text-center relative">
          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center mx-auto border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <div className="text-[10px] mono text-[#00f0ff] font-bold">[SECURITY_GATE // AUTH_REQUIRED]</div>
            <h3 className="text-xl font-bold text-white tracking-tight uppercase mt-1">Synapse Admin 2.0</h3>
            <p className="text-xs text-slate-400 mt-0.5">Management Desk & China Procurement Console</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] mono text-slate-300 font-bold block mb-1.5">
                ADMIN ACCESS PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3.5 pr-10 rounded-xl bg-[#06080c] border border-[#1a2234] text-white text-sm mono focus:outline-none focus:border-[#00f0ff] placeholder-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-xs mono shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>ACCESS_ADMIN_DESK [↵]</span>
            </button>

            {/* Quick Helper Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setPassword('admin2026');
                  setAuthenticated(true);
                }}
                className="text-[11px] mono text-slate-400 hover:text-[#00f0ff] underline"
              >
                Quick Demo Login (admin2026)
              </button>
            </div>
          </form>

          <div className="text-[11px] mono text-slate-500 pt-2 border-t border-[#1a2234]">
            <Link href="/" className="hover:text-[#00f0ff] transition-colors">
              ← RETURN_TO_WEBSITE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col tech-grid-bg">
      {/* Top Admin Header */}
      <header className="border-b border-[#1a2234] bg-[#090e17] px-6 py-4 flex justify-between items-center hud-panel">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00f0ff] flex items-center justify-center text-slate-950 font-bold mono">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-white mono">SYNAPSE::ADMIN_2.0</span>
            <div className="text-[10px] text-slate-400 mono">DHAKA & CHINA PROCUREMENT HUB</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mono text-xs">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg bg-[#06080c] hover:bg-slate-900 border border-[#1a2234] text-slate-200 transition-colors"
          >
            VIEW_LIVE_SITE ↗
          </Link>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-rose-400 hover:text-rose-300"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#1a2234] pb-4 mb-8 mono text-xs">
          <button
            onClick={() => setActiveTab('rfqs')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'rfqs'
                ? 'bg-[#00f0ff] text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Enterprise RFQs ({rfqsList.length})
          </button>

          <button
            onClick={() => setActiveTab('sourcing')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'sourcing'
                ? 'bg-[#00ff88] text-slate-950 shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            China Sourcing Requests ({sourcingList.length})
          </button>

          <button
            onClick={() => setActiveTab('ai-lister')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ai-lister'
                ? 'bg-[#ffaa00] text-slate-950 shadow-[0_0_15px_rgba(255,170,0,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Machine Tag OCR Lister
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Catalog Inventory ({INITIAL_PRODUCTS.length})
          </button>
        </div>

        {/* Tab 1: RFQ Leads */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mono uppercase">[LIVE_ENTERPRISE_RFQS]</h3>
            <div className="grid gap-4">
              {rfqsList.map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-6 rounded-2xl hud-panel border border-[#1a2234] flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mono">
                      <span className="text-xs font-bold text-[#ffaa00] bg-[#ffaa00]/10 px-2.5 py-0.5 rounded border border-[#ffaa00]/30">
                        {rfq.id}
                      </span>
                      <span className="text-xs font-bold text-white">{rfq.companyName}</span>
                      <span className="text-xs text-slate-400">({rfq.contactName})</span>
                    </div>
                    <div className="text-sm font-semibold text-[#00f0ff]">{rfq.productTitle}</div>
                    <div className="text-xs text-slate-400 mono">
                      Qty: <strong className="text-white">{rfq.quantity}</strong> • Notes: {rfq.requirement}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`https://wa.me/88${rfq.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-xs mono flex items-center gap-1.5 shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WHATSAPP_CLIENT ({rfq.phone})
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
            <h3 className="text-lg font-bold text-white mono uppercase">[CHINA_PROCUREMENT_PIPELINE]</h3>
            <div className="grid gap-4">
              {sourcingList.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl hud-panel border border-[#00ff88]/30 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mono">
                      <span className="text-xs font-bold text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-0.5 rounded border border-[#00ff88]/30">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-white">{item.companyName}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{item.itemName}</div>
                    <div className="text-xs text-slate-300">Spec: {item.specification}</div>
                    <div className="text-xs font-mono text-[#00ff88]">Status: {item.status}</div>
                  </div>

                  <a
                    href={`https://wa.me/88${item.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-xs mono"
                  >
                    CONTACT_CLIENT ({item.phone})
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: AI Machine Tag OCR Lister */}
        {activeTab === 'ai-lister' && (
          <div className="max-w-3xl mx-auto rounded-2xl hud-panel border border-[#ffaa00]/30 p-8 space-y-6">
            <div>
              <div className="text-[10px] font-mono text-[#ffaa00] font-bold uppercase tracking-wider">
                [AI_VISION // OCR_EXTRACTOR]
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Auto-Extract Specs from China Machine Nameplate
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Simply take a photo of any component nameplate or box tag received in China. Gemini Vision parses all specs automatically.
              </p>
            </div>

            <div className="border-2 border-dashed border-[#1a2234] hover:border-[#ffaa00]/50 rounded-2xl p-8 text-center space-y-3 cursor-pointer bg-[#090e17]/60">
              <Sparkles className="w-8 h-8 text-[#ffaa00] mx-auto" />
              <div className="text-xs font-bold text-white mono">Click to Upload Nameplate Photo / Tag</div>
              <div className="text-[10px] text-slate-500 mono">Supports JPEG, PNG, WEBP (Auto compressed)</div>
              <button
                type="button"
                onClick={handleSimulateAiExtract}
                className="mt-2 px-4 py-2 rounded-xl bg-[#ffaa00] hover:bg-amber-400 text-slate-950 font-extrabold text-xs mono transition-colors"
              >
                {aiAnalyzing ? 'PARSING_NAMEPLATE...' : 'SIMULATE_GEMINI_VISION_OCR [↵]'}
              </button>
            </div>

            {aiResult && (
              <div className="p-6 rounded-2xl bg-[#070a10] border border-[#1a2234] space-y-4 text-xs mono animate-in fade-in">
                <div className="flex items-center gap-2 text-[#00ff88] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  SUCCESSFULLY EXTRACTED SPECIFICATIONS!
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Title (English):</span>
                    <span className="font-bold text-white">{aiResult.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Model No:</span>
                    <span className="text-[#ffaa00] font-bold">{aiResult.modelNo}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Bengali Title:</span>
                  <span className="text-slate-300">{aiResult.titleBn}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Specs:</span>
                  <pre className="p-2 rounded bg-[#06080c] text-[10px] text-slate-300 overflow-x-auto border border-[#1a2234]">
                    {JSON.stringify(aiResult.specs, null, 2)}
                  </pre>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold transition-colors"
                >
                  PUBLISH_TO_LIVE_CATALOG [↵]
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Product Catalog */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mono uppercase">[LIVE_CATALOG_INVENTORY]</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl hud-panel border border-[#1a2234] flex gap-4 items-center"
                >
                  <img
                    src={prod.primaryImage}
                    alt={prod.title}
                    className="w-16 h-16 rounded-lg object-contain bg-[#070a10] p-2 border border-[#1a2234]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-[#00f0ff] mono">{prod.brand}</div>
                    <div className="text-xs font-bold text-white truncate">{prod.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 mono">{prod.stockStatus}</div>
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
