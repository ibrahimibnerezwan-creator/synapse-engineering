'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RFQModal from '@/components/RFQModal';
import CheckoutModal from '@/components/CheckoutModal';
import ChatWidget from '@/components/ChatWidget';
import { Product } from '@/db/schema';
import { ChevronRight, Share2 } from 'lucide-react';
import { GroupChip } from '@/components/GroupChip';
import { groupTone } from '@/lib/productGroups';

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

      <main id="main" className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#8a7e72] mb-10 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#1c1612]">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/#catalog-section" className="hover:text-[#1c1612]">
              {groupTone(product.category).short}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1c1612] truncate max-w-md">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
            <div className="lg:col-span-5 space-y-3">
              <div className="desk studio p-8 flex items-center justify-center min-h-[380px] relative">
                <img src={product.primaryImage} alt={product.title} className="max-h-[340px] max-w-full object-contain" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <GroupChip category={product.category} />
                  <span className="text-[10px] tracking-[0.12em] uppercase bg-[#fffdf8] px-2 py-1 border border-[rgba(28,22,18,0.12)]">
                    {product.brand}
                  </span>
                  <span className="stamp bg-[#fffdf8]">{product.stockStatus}</span>
                </div>
              </div>
              <div className="desk p-4 grid grid-cols-3 text-center text-[11px] text-[#4a4038]">
                <div>
                  <p className="font-medium text-[#1c1612]">Genuine</p>
                  <p className="text-[#8a7e72]">Serial verified</p>
                </div>
                <div className="border-x border-[rgba(28,22,18,0.12)]">
                  <p className="font-medium text-[#1f6b4a]">Video QC</p>
                  <p className="text-[#8a7e72]">Pre-dispatch</p>
                </div>
                <div>
                  <p className="font-medium text-[#1c1612]">Transit</p>
                  <p className="text-[#8a7e72]">Air & sea</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <GroupChip category={product.category} subCategory={product.subCategory} />
                <h1 className="display text-3xl sm:text-4xl leading-tight">{product.title}</h1>
                {product.modelNo && (
                  <p className="mono text-xs text-[#8a7e72]">
                    PN <span className="text-[#1c1612]">{product.modelNo}</span>
                  </p>
                )}
              </div>

              <div className={`desk p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${groupTone(product.category).bar}`}>
                <div>
                  <p className="kicker">{priceVal > 0 ? 'Direct price' : 'Commercial RFQ'}</p>
                  <p className="mono text-2xl mt-1">{priceVal > 0 ? `৳${priceVal.toLocaleString()}` : 'Factory quote'}</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {priceVal > 0 ? (
                    <button type="button" onClick={() => setCheckoutOpen(true)} className="btn-copper flex-1 sm:flex-none px-6 py-3">
                      <span className="bn">অর্ডার করুন</span>
                    </button>
                  ) : (
                    <button type="button" onClick={() => setRfqOpen(true)} className="btn-ink flex-1 sm:flex-none px-6 py-3">
                      Request quotation
                    </button>
                  )}
                  <a
                    href={`https://wa.me/8801886113236?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-jade px-3 py-3"
                  >
                    WhatsApp
                  </a>
                  <button type="button" onClick={handleShare} className="p-3 border border-[rgba(28,22,18,0.18)]" aria-label="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {copied && <p className="text-xs text-[#1f6b4a]">Link copied.</p>}

              <div className="space-y-3">
                <h2 className="kicker">Overview</h2>
                <p className="text-sm text-[#4a4038] leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>

              {Object.keys(parsedSpecs).length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[rgba(28,22,18,0.12)]">
                  <h2 className="kicker">Specifications</h2>
                  <dl className="grid sm:grid-cols-2 gap-px bg-[rgba(28,22,18,0.12)] border border-[rgba(28,22,18,0.12)]">
                    {Object.entries(parsedSpecs).map(([key, val]) => (
                      <div key={key} className="bg-[#fffdf8] p-3 flex justify-between gap-3 text-xs">
                        <dt className="text-[#8a7e72]">{key}</dt>
                        <dd className="mono text-right truncate max-w-[60%]">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="border-t border-[rgba(28,22,18,0.12)] pt-12 mb-8">
              <h2 className="kicker mb-6">Also on this desk</h2>
              <ul className="grid sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <li key={rel.id} className="desk desk-hover">
                    <Link href={`/products/${rel.slug}`} className="block p-4">
                      <div className="h-28 studio mb-3 flex items-center justify-center p-3">
                        <img src={rel.primaryImage} alt="" className="max-h-full object-contain" />
                      </div>
                      <p className="mb-2">
                        <GroupChip category={rel.category} subCategory={rel.subCategory} />
                      </p>
                      <p className="text-sm font-medium line-clamp-2">{rel.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {checkoutOpen && <CheckoutModal product={product} onClose={() => setCheckoutOpen(false)} />}
      <RFQModal isOpen={rfqOpen} onClose={() => setRfqOpen(false)} initialProduct={product.title} />
      <ChatWidget />
    </>
  );
}
