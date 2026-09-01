'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RFQModal from '@/components/RFQModal';
import ChatWidget from '@/components/ChatWidget';
import { Product } from '@/db/schema';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Truck,
  Zap,
  Cpu,
  ArrowRight,
  Share2
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [rfqOpen, setRfqOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  let parsedSpecs: Record<string, string> = {};
  try {
    if (product.specs) parsedSpecs = JSON.parse(product.specs);
  } catch {}

  const whatsappMessage = encodeURIComponent(
    `Hello Synapse Engineering, I am interested in: ${product.title} (${product.modelNo || product.brand}). Please share the official quotation and current lead time.`
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Navbar onOpenRFQ={() => setRfqOpen(true)} />

      <main className="flex-1 py-10 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-sky-400">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/#catalog-section" className="hover:text-sky-400">
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-medium">{product.title}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
            {/* Left: Image Showcase (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl glass-panel p-8 border border-sky-500/20 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center min-h-[380px] shadow-2xl">
                <img
                  src={product.primaryImage}
                  alt={product.title}
                  className="max-h-[340px] max-w-full object-contain"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900/90 text-sky-400 border border-sky-500/40 shadow-sm">
                    {product.brand}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {product.stockStatus}
                  </span>
                </div>
              </div>

              {/* Trust Box */}
              <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-around text-center text-xs text-slate-300">
                <div>
                  <div className="font-bold text-white">100% Genuine</div>
                  <div className="text-[10px] text-slate-500">Verified Serial</div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <div className="font-bold text-white">China Dispatch</div>
                  <div className="text-[10px] text-slate-500">Factory Direct</div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <div className="font-bold text-white">Warranty Included</div>
                  <div className="text-[10px] text-slate-500">Local Engineering Support</div>
                </div>
              </div>
            </div>

            {/* Right: Technical Specs & Actions (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                    {product.category} • {product.subCategory || 'Industrial Equipment'}
                  </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
                  {product.title}
                </h1>

                {product.modelNo && (
                  <div className="mt-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md inline-block border border-amber-500/20">
                    Model / Part Number: <strong>{product.modelNo}</strong>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 text-sm text-slate-300 leading-relaxed font-light">
                <p>{product.description}</p>
                {product.descriptionBn && (
                  <p className="text-xs text-slate-400 border-l-2 border-sky-500/40 pl-3 pt-1">
                    {product.descriptionBn}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-950 border border-sky-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setRfqOpen(true)}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request Official Quotation (RFQ)</span>
                  </button>

                  <a
                    href={`https://wa.me/8801886113236?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>

                {product.datasheetUrl && (
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>Download Technical Datasheet / Profile (PDF)</span>
                  </a>
                )}
              </div>

              {/* Technical Specifications Table */}
              {Object.keys(parsedSpecs).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Engineering Specifications
                  </h3>
                  <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <tbody>
                        {Object.entries(parsedSpecs).map(([key, val], idx) => (
                          <tr
                            key={key}
                            className={`border-b border-slate-800/60 ${
                              idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/10'
                            }`}
                          >
                            <td className="p-3.5 font-semibold text-slate-400 w-1/3 border-r border-slate-800/60">
                              {key}
                            </td>
                            <td className="p-3.5 text-slate-200 font-mono">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Solutions */}
          {relatedProducts.length > 0 && (
            <div className="pt-12 border-t border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-white">Related Industrial Solutions</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.slug}`}
                    className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="h-40 bg-slate-900/80 rounded-xl flex items-center justify-center p-4">
                        <img
                          src={rel.primaryImage}
                          alt={rel.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-xs font-semibold text-sky-400">{rel.brand}</div>
                      <h4 className="text-sm font-bold text-white line-clamp-2">{rel.title}</h4>
                    </div>
                    <div className="pt-3 flex items-center justify-between text-xs text-slate-400 group-hover:text-white mt-2">
                      <span>View Specifications</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialProduct={`${product.brand} - ${product.title} (${product.modelNo || ''})`}
      />

      <ChatWidget />
    </>
  );
}
