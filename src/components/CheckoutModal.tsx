'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#16120f]/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="bg-[#fffdf8] w-full max-w-2xl relative my-auto overflow-hidden border border-[rgba(28,22,18,0.16)]" onClick={(e) => e.stopPropagation()}>
        <div className="night px-6 py-4 flex justify-between items-center">
          <h2 id="checkout-title" className="display text-2xl text-[#f3ece3]">
            Complete the order
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 text-[#c9bdb0] hover:text-[#f3ece3]" aria-label="Close checkout">
            <X size={18} />
          </button>
        </div>

        {!success ? (
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="kicker">Slip</h3>
              <div className="flex gap-3.5">
                <div className="w-16 h-16 bg-[#f3ece3] p-1.5 shrink-0 flex items-center justify-center">
                  <img src={product.primaryImage} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h4 className="text-xs font-medium line-clamp-2">{product.title}</h4>
                  <p className="mono text-sm text-[#b85c38] mt-1">৳{productPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="bn text-xs text-[#4a4038]">পরিমাণ</span>
                <div className="flex items-center border border-[rgba(28,22,18,0.16)]">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 hover:bg-[#f3ece3]" aria-label="Decrease quantity">
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-medium">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} className="w-8 h-8 hover:bg-[#f3ece3]" aria-label="Increase quantity">
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="bn text-xs text-[#4a4038]">ডেলিভারি জোন</span>
                <div className="grid grid-cols-3 border border-[rgba(28,22,18,0.16)] text-xs">
                  {(
                    [
                      { key: 'dhaka' as const, label: 'ঢাকা', charge: 70 },
                      { key: 'suburb' as const, label: 'ঢাকা সংলগ্ন', charge: 100 },
                      { key: 'outside' as const, label: 'সারা দেশ', charge: 130 }
                    ]
                  ).map((z) => (
                    <button
                      key={z.key}
                      type="button"
                      onClick={() => setDeliveryZone(z.key)}
                      className={`flex flex-col items-center py-2 bn ${
                        deliveryZone === z.key ? 'bg-[#1c1612] text-[#f3ece3]' : 'hover:bg-[#f3ece3]'
                      }`}
                    >
                      <span className="text-[11px]">{z.label}</span>
                      <span className={`mono text-[10px] ${deliveryZone === z.key ? 'text-[#d4a28a]' : 'text-[#8a7e72]'}`}>
                        ৳{z.charge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <dl className="space-y-1 text-xs bg-[#f3ece3] p-3">
                <div className="flex justify-between">
                  <dt className="bn">পণ্যের দাম {qty > 1 && `(×${qty})`}</dt>
                  <dd className="mono">৳{productTotal.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="bn">ডেলিভারি</dt>
                  <dd className="mono">৳{baseDelivery}</dd>
                </div>
                <div className="flex justify-between border-t border-[rgba(28,22,18,0.12)] pt-1.5 font-medium">
                  <dt className="bn">সর্বমোট</dt>
                  <dd className="mono text-[#b85c38]">৳{orderTotal.toLocaleString()}</dd>
                </div>
              </dl>
              <p className="text-[11px] text-[#4a4038]">Steadfast Courier · COD · SMS tracking · 3–5 days.</p>
            </div>

            <div className="w-full md:w-1/2 space-y-3">
              <h3 className="kicker">Customer</h3>
              {error && <div className="p-2.5 bg-red-50 text-red-800 text-xs">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
                <div>
                  <label htmlFor="co-name" className="bn block mb-1 text-[#4a4038]">
                    আপনার নাম *
                  </label>
                  <input id="co-name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="field" />
                </div>
                <div>
                  <label htmlFor="co-phone" className="bn block mb-1 text-[#4a4038]">
                    মোবাইল *
                  </label>
                  <input id="co-phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="01XXXXXXXXX" className="field" />
                </div>
                <div>
                  <label htmlFor="co-addr" className="bn block mb-1 text-[#4a4038]">
                    সম্পূর্ণ ঠিকানা *
                  </label>
                  <textarea id="co-addr" rows={2} required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="field" />
                </div>
                <div>
                  <p className="bn mb-1.5 text-[#4a4038]">পেমেন্ট</p>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: 'cod', label: 'COD' },
                      { key: 'bkash', label: 'bKash' },
                      { key: 'nagad', label: 'Nagad' }
                    ].map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: p.key })}
                        className={`py-2 text-[11px] border ${
                          formData.paymentMethod === p.key
                            ? 'bg-[#1c1612] text-[#f3ece3] border-[#1c1612]'
                            : 'border-[rgba(28,22,18,0.16)]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                {formData.paymentMethod !== 'cod' && (
                  <div>
                    <label htmlFor="co-trx" className="block mb-1 text-[#4a4038]">
                      TrxID (optional)
                    </label>
                    <input id="co-trx" value={formData.trxId} onChange={(e) => setFormData({ ...formData, trxId: e.target.value })} className="field" />
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn-copper w-full py-3.5 disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="bn">প্রসেস হচ্ছে…</span>
                    </span>
                  ) : (
                    <span className="bn">অর্ডার কনফার্ম · ৳{orderTotal.toLocaleString()}</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <p className="kicker">Invoice #{invoice}</p>
            <h3 className="display text-3xl bn">অর্ডার গ্রহণ করা হয়েছে</h3>
            <p className="text-sm text-[#4a4038]">Steadfast কুরিয়ারের মাধ্যমে পাঠানো হবে। ডেলিভারি টিম শীঘ্রই যোগাযোগ করবে।</p>
            <dl className="p-4 bg-[#f3ece3] text-xs space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-[#8a7e72] bn">পণ্য</dt>
                <dd className="truncate max-w-[65%]">{product.title} (×{qty})</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8a7e72] bn">সর্বমোট</dt>
                <dd className="mono text-[#b85c38]">৳{orderTotal.toLocaleString()}</dd>
              </div>
            </dl>
            <div className="flex flex-col sm:flex-row gap-2">
              <button type="button" onClick={handleWhatsAppConfirm} className="btn-jade flex-1 py-3">
                WhatsApp কনফার্মেশন
              </button>
              <button type="button" onClick={onClose} className="btn-ghost px-6 py-3">
                বন্ধ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
