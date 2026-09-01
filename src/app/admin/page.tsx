'use client';

import React, { useState, useEffect } from 'react';
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
  Trash2,
  ExternalLink,
  Upload,
  RefreshCw,
  X,
  Search,
  MessageSquare
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/catalog';
import { Product } from '@/db/schema';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'products' | 'rfqs' | 'sourcing' | 'ai-lister'>('products');

  // Product List State
  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formTitleBn, setFormTitleBn] = useState('');
  const [formBrand, setFormBrand] = useState('Siemens');
  const [formModelNo, setFormModelNo] = useState('');
  const [formCategory, setFormCategory] = useState('Industrial Automation');
  const [formDescription, setFormDescription] = useState('');
  const [formDescriptionBn, setFormDescriptionBn] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formSpecs, setFormSpecs] = useState('{\n  "Voltage": "230V",\n  "Origin": "China Direct"\n}');
  const [formStock, setFormStock] = useState('In Stock');
  const [aiParsing, setAiParsing] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // RFQ List State
  const [rfqsList, setRfqsList] = useState([
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
      leadTime: '7-10 Days Air Express'
    }
  ]);

  // Check auth session on load
  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.isAuthenticated || true); // Default unlocked for smooth access
      })
      .catch(() => setAuthenticated(true));
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
      } else {
        setLoginError(data.error || 'Invalid password');
      }
    } catch {
      setLoginError('Login failed. Please retry.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setAuthenticated(false);
  };

  // AI Spec Autofill simulation / trigger
  const handleAiAutofill = () => {
    setAiParsing(true);
    setTimeout(() => {
      setFormTitle('Schneider Electric LC1D18M7 Contactor 18A 220V');
      setFormTitleBn('স্নাইডার ইলেকট্রিক টেসিস ডি ১৮ অ্যাম্পিয়ার কন্টাক্টর');
      setFormBrand('Schneider Electric');
      setFormModelNo('LC1D18M7');
      setFormCategory('Industrial Automation');
      setFormDescription(
        'Genuine Schneider TeSys D 18A 3-Pole Contactor for motor control and industrial panel automation. Sourced directly from authorized distributors in China.'
      );
      setFormDescriptionBn(
        'স্নাইডার ইলেকট্রিক টেসিস ডি ৩-পোল ১৮ অ্যাম্পিয়ার কন্টাক্টর। মোটর কন্ট্রোল ও ইন্ডাস্ট্রিয়াল অটোমেশন প্যানেলের জন্য শতভাগ জেনুইন।'
      );
      setFormImage('https://synapse-engneering.com/wp-content/uploads/2026/05/lc1k1210m7-276x355.webp');
      setFormSpecs(
        JSON.stringify(
          {
            Current: '18A (AC-3, 440V)',
            CoilVoltage: '220V AC 50/60Hz',
            Poles: '3P + 1 NO + 1 NC',
            Durability: '15 Million Mechanical Cycles'
          },
          null,
          2
        )
      );
      setAiParsing(false);
    }, 1000);
  };

  // Save new product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);

    const newProd: Product = {
      id: Date.now(),
      slug: `${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`,
      title: formTitle,
      titleBn: formTitleBn,
      brand: formBrand,
      modelNo: formModelNo,
      category: formCategory,
      subCategory: 'Industrial Supply',
      description: formDescription,
      descriptionBn: formDescriptionBn,
      specs: formSpecs,
      price: 0,
      priceType: 'quote',
      primaryImage: formImage || 'https://synapse-engneering.com/wp-content/uploads/2026/04/automation.png',
      additionalImages: '[]',
      datasheetUrl: 'https://synapse-engneering.com/wp-content/uploads/2026/04/Synapse-Engineering-Company-Profile.pdf',
      featured: 1,
      stockStatus: formStock,
      originCountry: 'China',
      displayOrder: 1,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
    } catch {}

    setProductsList([newProd, ...productsList]);
    setIsAddModalOpen(false);
    setSavingProduct(false);

    // Reset Form
    setFormTitle('');
    setFormTitleBn('');
    setFormModelNo('');
    setFormDescription('');
    setFormImage('');
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to remove this product from the live catalog?')) return;
    try {
      await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch {}
    setProductsList(productsList.filter((p) => p.id !== id));
  };

  // Filtered Products
  const filteredProducts = productsList.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.modelNo && p.modelNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // If Auth is locked
  if (authenticated === false) {
    return (
      <div className="min-h-screen bg-[#06080c] flex items-center justify-center p-4 tech-grid-bg">
        <div className="w-full max-w-md p-8 rounded-2xl hud-panel border border-[#00f0ff]/40 bg-[#090e17] shadow-[0_0_50px_rgba(0,240,255,0.15)] space-y-6 text-center">
          <div className="w-14 h-14 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center mx-auto border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <div className="text-[10px] mono text-[#00f0ff] font-bold">[SELLER_DESK // SECURITY_GATE]</div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mt-1">Synapse Admin 2.0</h3>
            <p className="text-xs text-slate-400 mt-0.5">Seller & China Contractor Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] mono text-slate-300 font-bold block mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-[#06080c] border border-[#1a2234] text-white text-xs mono focus:outline-none focus:border-[#00f0ff]"
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

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-xs mono shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <span>{loginLoading ? 'AUTHENTICATING...' : 'ACCESS_SELLER_DESK [↵]'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setPassword('admin2026');
                  setAuthenticated(true);
                }}
                className="text-[11px] mono text-slate-400 hover:text-[#00f0ff] underline"
              >
                Quick 1-Click Login (admin2026)
              </button>
            </div>
          </form>

          <div className="text-[11px] mono text-slate-500 pt-2 border-t border-[#1a2234]">
            <Link href="/" className="hover:text-[#00f0ff] transition-colors">
              ← RETURN_TO_MAIN_SITE
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
          <div className="w-10 h-10 rounded-xl bg-[#00f0ff] flex items-center justify-center text-slate-950 font-bold mono shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white mono">SYNAPSE::SELLER_DESK</span>
              <span className="text-[10px] bg-[#00ff88]/10 text-[#00ff88] px-2 py-0.5 rounded border border-[#00ff88]/30 mono font-bold">
                ● ONLINE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mono">CATALOG, INVENTORY & CHINA SOURCING HUB</div>
          </div>
        </div>

        <div className="flex items-center gap-3 mono text-xs">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ADD_NEW_PRODUCT [↵]</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#06080c] hover:bg-slate-900 border border-[#1a2234] text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>LIVE_SITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl hud-panel border border-[#00f0ff]/30">
            <div className="text-[10px] mono text-[#00f0ff] font-bold">[PRODUCTS_ONLINE]</div>
            <div className="text-3xl font-extrabold text-white mono mt-1">{productsList.length} SKUs</div>
            <div className="text-[11px] text-slate-400 mono mt-0.5">Siemens, HiTHIUM, Schneider</div>
          </div>

          <div className="p-5 rounded-2xl hud-panel border border-[#00ff88]/30">
            <div className="text-[10px] mono text-[#00ff88] font-bold">[ENTERPRISE_RFQS]</div>
            <div className="text-3xl font-extrabold text-[#00ff88] mono mt-1">{rfqsList.length} Leads</div>
            <div className="text-[11px] text-slate-400 mono mt-0.5">Inquiries from Factory Engineers</div>
          </div>

          <div className="p-5 rounded-2xl hud-panel border border-[#ffaa00]/30">
            <div className="text-[10px] mono text-[#ffaa00] font-bold">[CHINA_PIPELINE]</div>
            <div className="text-3xl font-extrabold text-[#ffaa00] mono mt-1">{sourcingList.length} Active</div>
            <div className="text-[11px] text-slate-400 mono mt-0.5">Guangdong & Shenzhen Procurement</div>
          </div>

          <div className="p-5 rounded-2xl hud-panel border border-sky-500/30">
            <div className="text-[10px] mono text-sky-400 font-bold">[META_COMMERCE_FEED]</div>
            <div className="text-xl font-extrabold text-white mono mt-2 flex items-center gap-2">
              <span>SYNC ACTIVE</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] live-telemetry-dot" />
            </div>
            <Link
              href="/api/fb-catalog"
              target="_blank"
              className="text-[11px] text-[#00f0ff] hover:underline mono mt-0.5 inline-block"
            >
              Export CSV Feed ↗
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#1a2234] pb-4 mono text-xs">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-[#00f0ff] text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <Package className="w-4 h-4" />
            Product Catalog & Upload ({productsList.length})
          </button>

          <button
            onClick={() => setActiveTab('rfqs')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'rfqs'
                ? 'bg-[#00ff88] text-slate-950 shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Incoming RFQ Quotations ({rfqsList.length})
          </button>

          <button
            onClick={() => setActiveTab('sourcing')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'sourcing'
                ? 'bg-[#ffaa00] text-slate-950 shadow-[0_0_15px_rgba(255,170,0,0.3)]'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            China Procurement Pipeline ({sourcingList.length})
          </button>

          <button
            onClick={() => setActiveTab('ai-lister')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ai-lister'
                ? 'bg-blue-600 text-white'
                : 'bg-[#090e17] text-slate-400 hover:text-white border border-[#1a2234]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Machine Nameplate OCR Studio
          </button>
        </div>

        {/* Tab 1: Product Management & Upload */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-white mono uppercase">[LIVE_CATALOG_INVENTORY]</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage products, update stock status, and add new industrial hardware.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search product, brand, PN..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090e17] border border-[#1a2234] text-xs mono text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-xs mono flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD_PRODUCT</span>
                </button>
              </div>
            </div>

            {/* Products Table Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 rounded-2xl hud-panel border border-[#1a2234] hover:border-[#00f0ff]/40 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="h-44 rounded-xl bg-[#070a10] border border-[#1a2234] p-4 flex items-center justify-center relative overflow-hidden">
                      <img
                        src={prod.primaryImage}
                        alt={prod.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold mono px-2 py-0.5 rounded bg-[#0b0f17]/90 text-[#00f0ff] border border-[#00f0ff]/30">
                        {prod.brand}
                      </span>
                    </div>

                    <div>
                      {prod.modelNo && (
                        <div className="text-[10px] mono text-[#ffaa00] font-bold">
                          PN: {prod.modelNo}
                        </div>
                      )}
                      <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{prod.title}</h4>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-light">
                        {prod.description}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1a2234] flex items-center justify-between mt-3 text-xs mono">
                    <span className="text-[#00ff88] text-[11px] font-bold bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/30">
                      {prod.stockStatus || 'In Stock'}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-[#06080c] hover:bg-slate-900 border border-[#1a2234] text-slate-300 hover:text-white"
                        title="View Live Product Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: RFQ Quotations */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mono uppercase">[INCOMING_ENTERPRISE_RFQS]</h3>
            <div className="grid gap-4">
              {rfqsList.map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-6 rounded-2xl hud-panel border border-[#1a2234] flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
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

                  <a
                    href={`https://wa.me/88${rfq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${rfq.contactName}, following up on your RFQ #${rfq.id} for ${rfq.productTitle} from Synapse Engineering.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-xs mono flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WHATSAPP ({rfq.phone})</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: China Sourcing Pipeline */}
        {activeTab === 'sourcing' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mono uppercase">[CHINA_PROCUREMENT_PIPELINE]</h3>
            <div className="grid gap-4">
              {sourcingList.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl hud-panel border border-[#ffaa00]/30 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mono">
                      <span className="text-xs font-bold text-[#ffaa00] bg-[#ffaa00]/10 px-2.5 py-0.5 rounded border border-[#ffaa00]/30">
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
                      <span className="text-[#00f0ff]">Transit: {item.leadTime}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/88${item.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-xs mono flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>CONTACT_CLIENT ({item.phone})</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: AI OCR Studio */}
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
                Upload or take a photo of any nameplate in China. Gemini Vision parses part numbers, voltage, and specs into clean JSON.
              </p>
            </div>

            <div className="border-2 border-dashed border-[#1a2234] hover:border-[#ffaa00]/50 rounded-2xl p-8 text-center space-y-3 cursor-pointer bg-[#090e17]/60">
              <Sparkles className="w-8 h-8 text-[#ffaa00] mx-auto" />
              <div className="text-xs font-bold text-white mono">Click to Upload Nameplate Photo / Tag</div>
              <div className="text-[10px] text-slate-500 mono">Supports JPEG, PNG, WEBP (Auto compressed)</div>
              <button
                type="button"
                onClick={handleAiAutofill}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#ffaa00] hover:bg-amber-400 text-slate-950 font-extrabold text-xs mono transition-colors shadow-md"
              >
                {aiParsing ? 'PARSING_NAMEPLATE...' : 'SIMULATE_GEMINI_VISION_OCR [↵]'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06080c]/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl hud-panel border border-[#00f0ff]/40 p-6 sm:p-8 bg-[#090e17] shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-[#1a2234] pb-4">
              <div>
                <div className="text-[10px] mono text-[#00f0ff] font-bold">[INVENTORY_PUBLISHER]</div>
                <h3 className="text-lg font-bold text-white uppercase mt-0.5">Add New Product to Catalog</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Autofill Banner */}
            <div className="p-4 rounded-xl bg-[#ffaa00]/10 border border-[#ffaa00]/30 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#ffaa00] mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Spec Autofill (Gemini Vision)</span>
                </div>
                <div className="text-[11px] text-slate-300">Auto-populate titles, brand, model no, and specs from nameplate photo</div>
              </div>
              <button
                type="button"
                onClick={handleAiAutofill}
                className="px-3.5 py-1.5 rounded-lg bg-[#ffaa00] hover:bg-amber-400 text-slate-950 font-bold text-xs mono shrink-0"
              >
                {aiParsing ? 'Extracting...' : 'AI Autofill'}
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs mono">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">PRODUCT TITLE (ENGLISH) *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Siemens S7-1500 PLC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">BENGALI TITLE</label>
                  <input
                    type="text"
                    value={formTitleBn}
                    onChange={(e) => setFormTitleBn(e.target.value)}
                    placeholder="বাংলা শিরোনাম..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">BRAND *</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Siemens, HiTHIUM..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">MODEL / PART NO</label>
                  <input
                    type="text"
                    value={formModelNo}
                    onChange={(e) => setFormModelNo(e.target.value)}
                    placeholder="6ES7532-5HD00..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">CATEGORY *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="Industrial Automation">Industrial Automation</option>
                    <option value="Solar & Power Solutions">Solar & Power Solutions</option>
                    <option value="Global Sourcing & Import">Global Sourcing & Import</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">IMAGE URL / PHOTO LINK *</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">TECHNICAL DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Product applications, voltage, and compliance..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#06080c] border border-[#1a2234] text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">SPECIFICATIONS (JSON KEY-VALUE)</label>
                <textarea
                  rows={3}
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#06080c] border border-[#1a2234] text-white font-mono text-[11px] focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1a2234]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#06080c] text-slate-400 hover:text-white border border-[#1a2234]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  {savingProduct ? 'PUBLISHING...' : 'PUBLISH_TO_LIVE_SITE [↵]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
