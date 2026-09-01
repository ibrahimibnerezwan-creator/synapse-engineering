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
  Terminal,
  ExternalLink,
  RefreshCw,
  Search
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/catalog';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'rfqs' | 'sourcing' | 'products' | 'ai-lister'>('rfqs');
  const [searchQuery, setSearchQuery] = useState('');

  // Live RFQs
  const [rfqsList, setRfqsList] = useState([
    {
      id: 'SYN-881920',
      contactName: 'Engr. Tariqul Islam',
      companyName: 'Akij Textiles Ltd.',
      phone: '01712-345678',
      email: 'tariqul@akijtextiles.com',
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
      email: 'kamrul@bashundhara.com',
      productTitle: 'Siemens SIMATIC S7-1500 6ES7532-5HD00-0AB0',
      quantity: 2,
      requirement: 'Need replacement module with factory test certificate.',
      status: 'Quoted',
      date: '2026-08-31'
    },
    {
      id: 'SYN-881902',
      contactName: 'Engr. Shafiqul Alam',
      companyName: 'Square Pharmaceuticals',
      phone: '01711-224466',
      email: 'shafiq@squarepharma.com',
      productTitle: 'Schneider Electric TeSys K LC1K06105P7 Contactor 6A',
      quantity: 12,
      requirement: 'Urgent replacement for packaging cleanroom line.',
      status: 'Processing',
      date: '2026-08-30'
    }
  ]);

  // Sourcing Inquiries
  const [sourcingList, setSourcingList] = useState([
    {
      id: 'SRC-90112',
      clientName: 'Mustafa Ahmed',
      companyName: 'Prime Ceramics Ltd.',
      phone: '01911-223344',
      itemName: 'High-Temperature Kiln Thermocouple Sensor (Obsolete model)',
      specification: 'Type S, 1600°C rated, 1200mm probe length. Need OEM factory direct in China.',
      targetQuantity: 10,
      status: 'Factory Matched (Guangdong)',
      leadTime: '7 Days Air Cargo'
    },
    {
      id: 'SRC-90108',
      clientName: 'Rashidul Karim',
      companyName: 'Bengal Plastic Industries',
      phone: '01819-334455',
      itemName: 'Injection Molding Machine Hydraulic Servo Valve',
      specification: 'Rexroth compatible 4WRKE series with calibration certificate.',
      targetQuantity: 2,
      status: 'Video QC Verified (Shenzhen)',
      leadTime: 'In Transit to Dhaka'
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
          Current: '18A (AC-3, 440V)',
          CoilVoltage: '220V AC 50/60Hz',
          Poles: '3P + 1 NO + 1 NC Auxiliary',
          Durability: '15 Million Mechanical Cycles'
        },
        description:
          'Genuine Schneider TeSys D 18A 3-Pole Contactor for motor control and industrial panel automation. Sourced directly from authorized distributors in China.'
      });
      setAiAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col tech-grid-bg">
      {/* Top Admin Header */}
      <header className="border-b border-[#1a2234] bg-[#090e17] px-6 py-4 flex justify-between items-center hud-panel">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00f0ff] flex items-center justify-center text-slate-950 font-bold mono shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white mono">SYNAPSE::ADMIN_2.0</span>
              <span className="text-[10px] bg-[#00ff88]/10 text-[#00ff88] px-2 py-0.5 rounded border border-[#00ff88]/30 mono font-bold">
                ● LIVE DESK
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mono">DHAKA & CHINA PROCUREMENT CONTROL CENTER</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mono text-xs">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-[#06080c] hover:bg-slate-900 border border-[#1a2234] text-[#00f0ff] hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>VIEW_MAIN_SITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* KPI Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl hud-panel border border-[#00f0ff]/30">
            <div className="text-[10px] mono text-[#00f0ff] font-bold uppercase tracking-wider">
              [TOTAL_ENTERPRISE_RFQS]
            </div>
            <div className="text-3xl font-extrabold text-white mono mt-1">{rfqsList.length} Leads</div>
            <div className="text-[11px] text-slate-400 mono mt-0.5">Active Inquiries from BD Plants</div>
          </div>

          <div className="p-5 rounded-2xl hud-panel border border-[#00ff88]/30">
            <div className="text-[10px] mono text-[#00ff88] font-bold uppercase tracking-wider">
              [CHINA_PROCUREMENT]
            </div>
            <div className="text-3xl font-extrabold text-[#00ff88] mono mt-1">{sourcingList.length} Active</div>
            <div className="text-[11px] text-slate-400 mono mt-0.5">Guangdong & Shenzhen Pipeline</div>
          </div>

          <div className="p-5 rounded-2xl hud-panel border border-[#ffaa00]/30">
            <div className="text-[10px] mono text-[#ffaa00] font-bold uppercase tracking-wider">
              [CATALOG_INVENTORY]
            </div>
            <div className="text-3xl font-extrabold text-[#ffaa00] mono mt-1">{INITIAL_PRODUCTS.length} SKUs</div>
            <div className="text-[11px] text-slate-400 mono mt-0.5">Siemens, HiTHIUM, Schneider</div>
          </div>

          <div className="p-5 rounded-2xl hud-panel border border-sky-500/30">
            <div className="text-[10px] mono text-sky-400 font-bold uppercase tracking-wider">
              [META_CATALOG_FEED]
            </div>
            <div className="text-xl font-extrabold text-white mono mt-2 flex items-center gap-2">
              <span>SYNC ACTIVE</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] live-telemetry-dot" />
            </div>
            <Link
              href="/api/fb-catalog"
              target="_blank"
              className="text-[11px] text-[#00f0ff] hover:underline mono mt-0.5 inline-block"
            >
              Download CSV Feed ↗
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#1a2234] pb-4 mono text-xs">
          <button
            onClick={() => setActiveTab('rfqs')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'rfqs'
                ? 'bg-[#00f0ff] text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Enterprise Quotations ({rfqsList.length})
          </button>

          <button
            onClick={() => setActiveTab('sourcing')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'sourcing'
                ? 'bg-[#00ff88] text-slate-950 shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            China Direct Procurement ({sourcingList.length})
          </button>

          <button
            onClick={() => setActiveTab('ai-lister')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ai-lister'
                ? 'bg-[#ffaa00] text-slate-950 shadow-[0_0_15px_rgba(255,170,0,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Machine Nameplate OCR
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <Package className="w-4 h-4" />
            Live Catalog ({INITIAL_PRODUCTS.length})
          </button>
        </div>

        {/* Tab 1: RFQ Leads */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white mono uppercase">[LIVE_ENTERPRISE_RFQS]</h3>
              <span className="text-xs mono text-slate-400">Direct integration with WhatsApp & Meta CAPI</span>
            </div>

            <div className="grid gap-4">
              {rfqsList.map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-6 rounded-2xl hud-panel border border-[#1a2234] hover:border-[#00f0ff]/30 transition-all flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mono">
                      <span className="text-xs font-bold text-[#ffaa00] bg-[#ffaa00]/10 px-2.5 py-0.5 rounded border border-[#ffaa00]/30">
                        {rfq.id}
                      </span>
                      <span className="text-xs font-bold text-white">{rfq.companyName}</span>
                      <span className="text-xs text-slate-400">({rfq.contactName})</span>
                      <span className="text-[10px] text-slate-500">• {rfq.date}</span>
                    </div>

                    <div className="text-sm font-semibold text-[#00f0ff]">{rfq.productTitle}</div>
                    
                    <div className="text-xs text-slate-300 mono bg-[#06080c] p-2.5 rounded-lg border border-[#1a2234]">
                      Qty: <strong className="text-white">{rfq.quantity}</strong> • Requirement: {rfq.requirement}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <a
                      href={`https://wa.me/88${rfq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${rfq.contactName}, following up on your RFQ #${rfq.id} for ${rfq.productTitle} from Synapse Engineering.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-xs mono flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WHATSAPP ({rfq.phone})</span>
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
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white mono uppercase">[CHINA_PROCUREMENT_PIPELINE]</h3>
              <span className="text-xs mono text-[#00ff88]">On-Ground Factory Verification Desk</span>
            </div>

            <div className="grid gap-4">
              {sourcingList.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl hud-panel border border-[#00ff88]/30 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mono">
                      <span className="text-xs font-bold text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-0.5 rounded border border-[#00ff88]/30">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-white">{item.companyName}</span>
                      <span className="text-xs text-slate-400">({item.clientName})</span>
                    </div>

                    <div className="text-sm font-semibold text-white">{item.itemName}</div>
                    
                    <div className="text-xs text-slate-300 mono bg-[#06080c] p-2.5 rounded-lg border border-[#1a2234]">
                      Spec: {item.specification} | Target Qty: <strong>{item.targetQuantity}</strong>
                    </div>

                    <div className="flex items-center gap-3 text-xs mono">
                      <span className="text-[#00ff88] font-bold">Status: {item.status}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-[#00f0ff]">Lead Time: {item.leadTime}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/88${item.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-xs mono flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>CONTACT_CLIENT ({item.phone})</span>
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
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#ffaa00] hover:bg-amber-400 text-slate-950 font-extrabold text-xs mono transition-colors shadow-md"
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
            <h3 className="text-base font-bold text-white mono uppercase">[LIVE_CATALOG_INVENTORY]</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 rounded-2xl hud-panel border border-[#1a2234] flex gap-4 items-center"
                >
                  <img
                    src={prod.primaryImage}
                    alt={prod.title}
                    className="w-16 h-16 rounded-xl object-contain bg-[#070a10] p-2 border border-[#1a2234]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-[#00f0ff] mono">{prod.brand}</div>
                    <div className="text-xs font-bold text-white truncate">{prod.title}</div>
                    <div className="text-[10px] text-[#00ff88] mt-0.5 mono">{prod.stockStatus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
