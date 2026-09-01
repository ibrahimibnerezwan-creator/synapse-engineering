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
  Share2,
  Terminal
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

      <main className="flex-1 py-10 bg-[#06080c] tech-grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs mono text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#00f0ff]">
              ROOT
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/#catalog-section" className="hover:text-[#00f0ff]">
              {product.category.toUpperCase()}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">{product.title}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
            {/* Left: Image Showcase (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl hud-panel p-8 border border-[#00f0ff]/30 bg-[#070a10] flex items-center justify-center min-h-[380px] shadow-2xl">
                <img
                  src={product.primaryImage}
                  alt={product.title}
                  className="max-h-[340px] max-w-full object-contain"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-xs font-bold mono px-3 py-1 rounded bg-[#0b0f17]/90 text-[#00f0ff] border border-[#00f0ff]/40 shadow-sm">
                    {product.brand}
                  </span>
                  <span className="text-xs font-medium mono px-2.5 py-1 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
                    {product.stockStatus}
                  </span>
                </div>
              </div>

              {/* Trust Box */}
              <div className="p-4 rounded-xl hud-panel border border-[#1a2234] flex items-center justify-around text-center text-xs mono text-slate-300">
                <div>
                  <div className="font-bold text-white">100% GENUINE</div>
                  <div className="text-[10px] text-slate-500">SERIAL VERIFIED</div>
                </div>
                <div className="w-px h-8 bg-[#1a2234]" />
                <div>
                  <div className="font-bold text-white">CHINA DISPATCH</div>
                  <div className="text-[10px] text-slate-500">ON-GROUND QC</div>
                </div>
                <div className="w-px h-8 bg-[#1a2234]" />
                <div>
                  <div className="font-bold text-white">WARRANTY</div>
                  <div className="text-[10px] text-slate-500">DHAKA DESK</div>
                </div>
              </div>
            </div>

            {/* Right: Technical Specs & Actions (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                    [{product.category.toUpperCase()} • {product.subCategory?.toUpperCase() || 'EQUIPMENT'}]
                  </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#090e17] border border-[#1a2234] hover:border-[#00f0ff]/40 text-slate-400 hover:text-white text-xs mono transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'COPIED!' : 'SHARE'}</span>
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mt-2">
                  {product.title}
                </h1>

                {product.modelNo && (
                  <div className="mt-2 text-xs font-mono text-[#ffaa00] bg-[#ffaa00]/10 px-3 py-1 rounded inline-block border border-[#ffaa00]/30 font-bold">
                    MODEL_NO: {product.modelNo}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 text-sm text-slate-300 leading-relaxed font-light">
                <p>{product.description}</p>
                {product.descriptionBn && (
                  <p className="text-xs text-slate-400 border-l-2 border-[#00f0ff]/40 pl-3 pt-1">
                    {product.descriptionBn}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-5 rounded-2xl bg-[#090e17] border border-[#00f0ff]/30 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setRfqOpen(true)}
                    className="flex-1 py-3.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-xs mono shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>TRANSMIT_OFFICIAL_RFQ [↵]</span>
                  </button>

                  <a
                    href={`https://wa.me/8801886113236?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-xs mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WHATSAPP_DESK</span>
                  </a>
                </div>

                {product.datasheetUrl && (
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#06080c] hover:bg-slate-900 text-slate-300 hover:text-white border border-[#1a2234] text-xs mono font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4 text-[#00f0ff]" />
                    <span>DOWNLOAD_TECHNICAL_DATASHEET.PDF</span>
                  </a>
                )}
              </div>

              {/* Technical Specifications Table */}
              {Object.keys(parsedSpecs).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    [ENGINEERING_SPECIFICATION_MATRIX]
                  </h3>
                  <div className="rounded-xl hud-panel border border-[#1a2234] overflow-hidden">
                    <table className="w-full text-left text-xs mono">
                      <tbody>
                        {Object.entries(parsedSpecs).map(([key, val], idx) => (
                          <tr
                            key={key}
                            className={`border-b border-[#1a2234] ${
                              idx % 2 === 0 ? 'bg-[#090e17]/60' : 'bg-[#070a10]/40'
                            }`}
                          >
                            <td className="p-3.5 font-bold text-slate-400 w-1/3 border-r border-[#1a2234]">
                              {key}
                            </td>
                            <td className="p-3.5 text-slate-200">{val}</td>
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
            <div className="pt-12 border-t border-[#1a2234] space-y-6">
              <h3 className="text-lg font-bold text-white uppercase mono">[RELATED_SOLUTIONS]</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.slug}`}
                    className="p-5 rounded-2xl hud-panel border border-[#1a2234] hover:border-[#00f0ff]/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="h-40 bg-[#070a10] rounded-xl flex items-center justify-center p-4 border border-[#1a2234]">
                        <img
                          src={rel.primaryImage}
                          alt={rel.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-[10px] font-bold mono text-[#00f0ff]">{rel.brand}</div>
                      <h4 className="text-xs font-bold text-white line-clamp-2">{rel.title}</h4>
                    </div>
                    <div className="pt-3 flex items-center justify-between text-xs mono text-slate-400 group-hover:text-white mt-2">
                      <span>VIEW_SPECS</span>
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
