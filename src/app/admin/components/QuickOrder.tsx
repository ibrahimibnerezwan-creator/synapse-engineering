'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, ImagePlus, Send, X, CheckCircle2 } from 'lucide-react';
import { Product } from '@/db/schema';
import { errorText, readJson } from '@/lib/clientApi';
import { inlineImage, prepareImage } from '@/lib/clientImage';
import { DELIVERY_CHARGES } from '@/lib/workflow';

export default function QuickOrder({ onOrderCreated }: { onOrderCreated?: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [rawText, setRawText] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productHint, setProductHint] = useState('');
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [trxId, setTrxId] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'dhaka' | 'suburb' | 'outside'>('outside');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => readJson<{ products: Product[] }>(r))
      .then((data) => {
        if (Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(error => setMsg({ kind: 'err', text: errorText(error) }));
  }, []);

  const handleExtract = async () => {
    if (!rawText && !screenshot) {
      setMsg({ kind: 'err', text: 'Paste a message or upload a screenshot first' });
      return;
    }
    setIsExtracting(true);
    setMsg(null);
    try {
      const body: { text?: string; imageBase64?: string; mimeType?: string } = {};
      if (rawText) body.text = rawText;
      if (screenshot) {
        const photo = await prepareImage(screenshot, 'image/jpeg', 600_000);
        body.imageBase64 = await inlineImage(photo);
        body.mimeType = photo.type;
      }
      const res = await fetch('/api/admin/parse-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await readJson<{ name?: string; phone?: string; address?: string; amountHint?: number; paymentMethod?: 'cod' | 'bkash' | 'nagad'; deliveryZone?: 'dhaka' | 'suburb' | 'outside'; productHint?: string }>(res);

      if (data.name) setName(data.name);
      if (data.phone) setPhone(data.phone);
      if (data.address) setAddress(data.address);
      if (data.amountHint) setAmount(String(data.amountHint));
      if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
      if (data.deliveryZone) setDeliveryZone(data.deliveryZone);
      setProductHint(data.productHint || '');

      // Try auto-matching product by hint
      if (data.productHint && products.length > 0) {
        const hint = String(data.productHint).toLowerCase();
        const guess = products.find(
          (p) =>
            (p.modelNo && hint.includes(p.modelNo.toLowerCase())) || hint === p.title.toLowerCase() || hint.includes(p.title.toLowerCase())
        );
        if (guess) {
          setProductId(String(guess.id));
          if (!data.amountHint && guess.price) {
            setAmount(String(guess.price));
          }
        }
      }
      setMsg({ kind: 'ok', text: 'AI extraction completed — review and adjust below' });
    } catch (err: unknown) {
      setMsg({ kind: 'err', text: errorText(err) });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleProductSelect = (idStr: string) => {
    setProductId(idStr);
    const selected = products.find((p) => String(p.id) === idStr);
    setAmount(selected?.price ? String(selected.price) : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !productId) {
      setMsg({ kind: 'err', text: 'Name, phone, address, and product are all required' });
      return;
    }
    setIsSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/manual-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          address,
          productId,
          amount: amount ? Number(amount) : undefined,
          quantity,
          paymentMethod,
          trxId: paymentMethod === 'cod' ? null : trxId,
          deliveryZone,
          note
        })
      });
      const data = await readJson<{ success: boolean; invoice: string; trackingCode?: string }>(res);
      if (!data.success || !data.invoice) throw new Error('The order was not saved.');

      setMsg({
        kind: 'ok',
        text: `Order ${data.invoice} saved successfully${
          data.trackingCode ? ` — Steadfast tracking: ${data.trackingCode}` : ''
        }`
      });

      // Reset form
      setRawText('');
      setScreenshot(null);
      setName('');
      setPhone('');
      setAddress('');
      setProductId('');
      setAmount('');
      setQuantity(1);
      setTrxId('');
      setNote('');
      setProductHint('');
      onOrderCreated?.();
    } catch (err: unknown) {
      setMsg({ kind: 'err', text: errorText(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-3xl text-left">
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-[#1a1a1a]">
        <Sparkles size={20} className="text-[#e85d04]" />
        Quick Order (FB / WhatsApp)
      </h2>
      <p className="text-xs text-gray-500 mb-5">
        Paste the customer’s message OR upload a screenshot. AI fills the form. Review and save.
      </p>

      {/* Step 1: Paste / Upload */}
      <div className="space-y-3 mb-5">
        <label htmlFor="quick-message" className="sr-only">Customer message to extract</label>
        <textarea id="quick-message"
          rows={4}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste customer message here (Bengali / English / Banglish all OK)"
          className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1a3a5c] outline-none"
        />

        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 text-xs font-semibold text-gray-700">
            <ImagePlus size={16} />
            <span>{screenshot ? screenshot.name.slice(0, 30) : 'Upload screenshot'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setScreenshot(file);
              }}
            />
          </label>

          {screenshot && (
            <button
              type="button"
              onClick={() => setScreenshot(null)}
              className="text-xs text-red-500 hover:text-red-700 p-1"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={handleExtract}
            disabled={isExtracting || (!rawText && !screenshot)}
            className="px-5 py-2 rounded-xl bg-[#e85d04] hover:bg-[#d45403] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            {isExtracting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>Extract</span>
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3 mb-5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            msg.kind === 'ok'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {msg.kind === 'ok' && <CheckCircle2 size={14} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Step 2: Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quick-name" className="block text-xs font-bold text-gray-700 mb-1">Customer Name *</label>
            <input id="quick-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shakil Ahmed"
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none"
            />
          </div>

          <div>
            <label htmlFor="quick-phone" className="block text-xs font-bold text-gray-700 mb-1">Phone *</label>
            <input id="quick-phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="quick-address" className="block text-xs font-bold text-gray-700 mb-1">Address *</label>
          <textarea id="quick-address"
            autoComplete="street-address" rows={2}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full delivery address"
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="quick-product" className="block text-xs font-bold text-gray-700">Product *</label>
            {productHint && (
              <span className="text-[11px] text-amber-600 font-medium">AI detected: {productHint}</span>
            )}
          </div>
          <select id="quick-product"
            required
            value={productId}
            onChange={(e) => handleProductSelect(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none bg-white"
          >
            <option value="">— Select product —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.price ? `(৳${p.price})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div><label htmlFor="quick-quantity" className="block text-sm font-semibold mb-1">Quantity</label><input id="quick-quantity" type="number" min="1" max="20" step="1" required value={quantity} onChange={event => setQuantity(Number(event.target.value))} className="w-full p-3 border rounded-xl text-base" /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="quick-amount" className="block text-xs font-bold text-gray-700 mb-1">Unit price (৳)</label>
            <input id="quick-amount"
              type="number"
              required min="1" step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="auto from product"
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none"
            />
          </div>

          <div>
            <label htmlFor="quick-zone" className="block text-xs font-bold text-gray-700 mb-1">Delivery zone</label>
            <select id="quick-zone"
              value={deliveryZone}
              onChange={(e) => setDeliveryZone(e.target.value as keyof typeof DELIVERY_CHARGES)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none bg-white"
            >
              <option value="dhaka">Inside Dhaka (৳70)</option>
              <option value="suburb">Dhaka Suburb (৳100)</option>
              <option value="outside">Outside (৳130)</option>
            </select>
          </div>

          <div>
            <label htmlFor="quick-payment" className="block text-xs font-bold text-gray-700 mb-1">Payment</label>
            <select id="quick-payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'bkash' | 'nagad')}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none bg-white"
            >
              <option value="cod">COD</option>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
            </select>
          </div>
        </div>

        {paymentMethod !== 'cod' && (
          <div>
            <label htmlFor="quick-trx" className="block text-xs font-bold text-gray-700 mb-1">bKash/Nagad TrxID *</label>
            <input id="quick-trx"
              type="text"
              required maxLength={120}
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="e.g. BL9A27D9X"
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none"
            />
          </div>
        )}

        <div>
          <label htmlFor="quick-note" className="block text-xs font-bold text-gray-700 mb-1">Note (optional)</label>
          <input id="quick-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. urgent, gift wrap, call before delivery"
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a3a5c] outline-none"
          />
        </div>

        <p className="p-3 bg-gray-50 rounded-xl text-sm">Order total: ৳{(Number(amount || 0) * quantity + DELIVERY_CHARGES[deliveryZone]).toLocaleString('en-BD')} including ৳{DELIVERY_CHARGES[deliveryZone]} delivery. Courier booking is manual.</p>
        <button
          type="submit"
          disabled={isSubmitting || isExtracting}
          className="w-full py-3.5 bg-[#0f2d3a] hover:bg-[#091d26] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          <span>Save order for manual dispatch</span>
        </button>
      </form>
    </div>
  );
}
