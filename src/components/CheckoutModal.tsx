'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, MessageSquare, Truck, ShieldCheck } from 'lucide-react';
import { Product } from '@/db/schema';

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
}

export default function CheckoutModal({ product, onClose }: CheckoutModalProps) {
  const [qty, setQty] = useState(1);
  const [deliveryZone, setDeliveryZone] = useState<'dhaka' | 'suburb' | 'outside'>('outside');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
    trxId: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const baseDelivery = deliveryZone === 'dhaka' ? 70 : deliveryZone === 'suburb' ? 100 : 130;
  const productPrice = Number(product.price) || 0;
  const productTotal = productPrice * qty;
  const orderTotal = productTotal + baseDelivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const phoneClean = formData.phone.replace(/[\s\-()]/g, '');
    if (!/^\+?\d{7,15}$/.test(phoneClean)) {
      setError('সঠিক ফোন নম্বর দিন (01XXXXXXXXX)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: phoneClean,
          address: formData.address,
          productId: product.id,
          productTitle: qty > 1 ? `${product.title} ×${qty}` : product.title,
          quantity: qty,
          productAmount: productTotal,
          deliveryZone,
          paymentMethod: formData.paymentMethod,
          trxId: formData.trxId,
          website: honeypot
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to place order');
      }

      setInvoice(data.invoice);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    const text = `Hello Synapse Engineering,\n\nI just placed order *#${invoice}*:\n• Product: ${product.title} (Qty: ${qty})\n• Total Amount: ৳${orderTotal.toLocaleString()}\n• Delivery: ${deliveryZone.toUpperCase()} (৳${baseDelivery})\n• Name: ${formData.name}\n• Phone: ${formData.phone}\n• Address: ${formData.address}\n• Payment: ${formData.paymentMethod.toUpperCase()}${formData.trxId ? ` (TrxID: ${formData.trxId})` : ''}\n\nPlease confirm dispatch!`;
    window.open(`https://wa.me/8801886113236?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative my-auto overflow-hidden border border-black/[0.08] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a3a5c] px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold">Complete Your Order</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {!success ? (
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Left: Order Summary */}
            <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <h3 className="font-bold text-base text-[#1a1a1a] border-b pb-2">Order Summary</h3>

                {/* Product Snapshot */}
                <div className="flex gap-3.5">
                  <div className="w-16 h-16 rounded-xl bg-[#f5f5f2] border border-black/[0.06] p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.primaryImage}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-[#1a1a1a] line-clamp-2 leading-snug">
                      {product.title}
                    </h4>
                    <div className="text-xs font-bold text-[#e85d04] mono">
                      ৳{productPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-[#718096]">পরিমাণ (Quantity)</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#1a1a1a]">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(20, q + 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery Zone Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#718096]">ডেলিভারি জোন</span>
                  <div className="grid grid-cols-3 rounded-lg border border-gray-200 overflow-hidden text-xs font-bold">
                    {[
                      { key: 'dhaka', label: 'ঢাকা', charge: 70 },
                      { key: 'suburb', label: 'ঢাকা সংলগ্ন', charge: 100 },
                      { key: 'outside', label: 'সারা দেশ', charge: 130 }
                    ].map((z) => (
                      <button
                        key={z.key}
                        type="button"
                        onClick={() => setDeliveryZone(z.key as any)}
                        className={`flex flex-col items-center py-2 transition-colors ${
                          deliveryZone === z.key
                            ? 'bg-[#1a3a5c] text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[11px]">{z.label}</span>
                        <span
                          className={`text-[10px] ${
                            deliveryZone === z.key ? 'text-orange-300' : 'text-gray-400'
                          }`}
                        >
                          ৳{z.charge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1 text-xs text-[#718096] bg-[#fafaf8] p-3 rounded-xl border border-black/[0.06]">
                  <div className="flex justify-between">
                    <span>পণ্যের দাম {qty > 1 && `(×${qty})`}:</span>
                    <span className="font-bold text-[#1a1a1a] mono">৳{productTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-bold text-[#1a1a1a] mono">৳{baseDelivery}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-1.5 font-bold text-sm text-[#1a1a1a]">
                    <span>সর্বমোট (Total):</span>
                    <span className="text-[#e85d04] mono">৳{orderTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#059669] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Steadfast Courier ডোরস্টেপ ডেলিভারি</span>
                </div>
                <p className="text-[11px] text-[#4a5568]">ক্যাশ অন ডেলিভারি (COD) ও SMS ট্র্যাকিং সহ ৩-৫ দিনে ডেলিভারি।</p>
              </div>
            </div>

            {/* Right: Checkout Form */}
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="font-bold text-base text-[#1a1a1a] border-b pb-2">Customer Details</h3>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {/* Honeypot */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                />

                <div>
                  <label className="text-[#4a5568] font-bold block mb-1">আপনার নাম (Full Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. মো: তানভীর আহমেদ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-gray-200 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3a5c]"
                  />
                </div>

                <div>
                  <label className="text-[#4a5568] font-bold block mb-1">মোবাইল নম্বর (Phone) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-gray-200 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3a5c]"
                  />
                </div>

                <div>
                  <label className="text-[#4a5568] font-bold block mb-1">সম্পূর্ণ ঠিকানা (Full Delivery Address) *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="বাসা/হোল্ডিং নং, রোড, এলাকা, থানা ও জেলা"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-gray-200 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3a5c]"
                  />
                </div>

                <div>
                  <label className="text-[#4a5568] font-bold block mb-1.5">পেমেন্ট মেথড (Payment)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'cod', label: 'Cash on Delivery' },
                      { key: 'bkash', label: 'bKash' },
                      { key: 'nagad', label: 'Nagad' }
                    ].map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: p.key })}
                        className={`py-2 px-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                          formData.paymentMethod === p.key
                            ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.paymentMethod !== 'cod' && (
                  <div>
                    <label className="text-[#4a5568] font-bold block mb-1">bKash/Nagad TrxID (Optional)</label>
                    <input
                      type="text"
                      value={formData.trxId}
                      onChange={(e) => setFormData({ ...formData, trxId: e.target.value })}
                      placeholder="e.g. BL9A27D9X"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-gray-200 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3a5c]"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#e85d04] hover:bg-[#d45403] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>অর্ডার প্রসেস হচ্ছে...</span>
                      </>
                    ) : (
                      <span>অর্ডার কনফার্ম করুন (৳{orderTotal.toLocaleString()})</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Order Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-[#e85d04] font-bold mono">INVOICE #{invoice}</div>
              <h3 className="text-2xl font-extrabold text-[#1a1a1a]">অর্ডার সফলভাবে গ্রহণ করা হয়েছে!</h3>
              <p className="text-xs text-[#718096] max-w-md mx-auto">
                আমাদের ডেলিভারি টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে। Steadfast কুরিয়ারের মাধ্যমে পণ্য পাঠানো হবে।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fafaf8] border border-black/[0.06] text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-[#718096]">পণ্য:</span>
                <span className="text-[#1a1a1a] font-bold truncate max-w-[65%]">{product.title} (×{qty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">সর্বমোট বিল:</span>
                <span className="text-[#e85d04] font-bold mono">৳{orderTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">ডেলিভারি ঠিকানা:</span>
                <span className="text-[#1a1a1a] font-medium truncate max-w-[65%]">{formData.address}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                onClick={handleWhatsAppConfirm}
                className="flex-1 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp এ কনফার্মেশন পাঠান</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#f5f5f2] hover:bg-[#eeeee8] text-[#1a1a1a] font-bold text-xs border border-black/[0.06]"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
