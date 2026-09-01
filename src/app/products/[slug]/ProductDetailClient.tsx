'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RFQModal from '@/components/RFQModal';
import CheckoutModal from '@/components/CheckoutModal';
import ChatWidget from '@/components/ChatWidget';
import { Product } from '@/db/schema';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Truck,
  Zap,
  Cpu,
  ArrowRight,
  Share2,
  ShoppingBag
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [rfqOpen, setRfqOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  let parsedSpecs: Record<string, string> = {};
  try {
    if (product.specs) parsedSpecs = JSON.parse(product.specs);
  } catch {}

  const priceVal = Number(product.price) || 0;

  const whatsappMessage = encodeURIComponent(
    `Hello Synapse Engineering, I am interested in: ${product.title} (${product.modelNo || product.brand}). Please share current pricing and delivery lead time.`
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.title,
          text: product.description,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Navbar onOpenRFQ={() => setRfqOpen(true)} />

      <main className="flex-1 py-10 bg-[#fafaf8] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#718096] mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#1a1a1a]">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/#catalog-section" className="hover:text-[#1a1a1a]">
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#1a1a1a] font-bold truncate max-w-md">{product.title}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
            {/* Left: Image Showcase */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl craft-card p-8 bg-white border border-black/[0.06] flex items-center justify-center min-h-[380px] shadow-sm">
                <img
                  src={product.primaryImage}
                  alt={product.title}
                  className="max-h-[340px] max-w-full object-contain"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded bg-white text-[#1a1a1a] border border-black/[0.08] shadow-sm">
                    {product.brand}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded bg-emerald-50 text-[#059669] border border-emerald-200">
                    {product.stockStatus}
                  </span>
                </div>
              </div>

              {/* Trust Box */}
              <div className="p-4 rounded-xl craft-card bg-white border border-black/[0.06] flex items-center justify-around text-center text-xs text-[#4a5568]">
                <div>
                  <div className="font-bold text-[#1a1a1a]">100% GENUINE</div>
                  <div className="text-[10px] text-gray-400">SERIAL VERIFIED</div>
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div>
                  <div className="font-bold text-[#059669]">VIDEO QC</div>
                  <div className="text-[10px] text-gray-400">PRE-DISPATCH</div>
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div>
                  <div className="font-bold text-[#0284c7]">FAST TRANSIT</div>
                  <div className="text-[10px] text-gray-400">AIR & SEA FREIGHT</div>
                </div>
              </div>
            </div>

            {/* Right: Technical Specs & Purchasing Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#e85d04] uppercase tracking-wider">
                  {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] leading-tight">
                  {product.title}
                </h1>
                {product.modelNo && (
                  <div className="text-xs font-bold text-gray-500 mono">
                    Model / Part Number: <span className="text-[#1a1a1a]">{product.modelNo}</span>
                  </div>
                )}
              </div>

              {/* Pricing & Stock Banner */}
              <div className="p-5 rounded-2xl craft-card bg-gradient-to-r from-white to-[#fafaf8] border border-black/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    {priceVal > 0 ? 'Direct Price' : 'Commercial Quotation'}
                  </div>
                  <div className="text-2xl font-bold text-[#1a1a1a] mono">
                    {priceVal > 0 ? `৳${priceVal.toLocaleString()}` : 'Official Factory RFQ'}
                  </div>
                  <div className="text-xs text-[#059669] font-medium flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock / Ready for Dispatch</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {priceVal > 0 ? (
                    <button
                      onClick={() => setCheckoutOpen(true)}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#e85d04] hover:bg-[#d45403] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>অর্ডার করুন (Order Now)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setRfqOpen(true)}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#1a3a5c] hover:bg-[#0f2a45] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Request Quotation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <a
                    href={`https://wa.me/8801886113236?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#059669] border border-emerald-200 transition-colors"
                    title="Direct WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    onClick={handleShare}
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Share link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">Product Overview</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed font-light whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Detailed Specs Grid */}
              {Object.keys(parsedSpecs).length > 0 && (
                <div className="space-y-3 pt-4 border-t border-black/[0.06]">
                  <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">Technical Specifications</h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(parsedSpecs).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-3 rounded-xl bg-white border border-black/[0.04] flex justify-between items-center"
                      >
                        <span className="text-gray-400 font-medium">{key}</span>
                        <span className="font-bold text-[#1a1a1a] text-right truncate max-w-[60%]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Checkout Modal */}
      {checkoutOpen && <CheckoutModal product={product} onClose={() => setCheckoutOpen(false)} />}

      {/* RFQ Modal */}
      <RFQModal isOpen={rfqOpen} onClose={() => setRfqOpen(false)} initialProduct={product.title} />

      <ChatWidget />
    </>
  );
}
