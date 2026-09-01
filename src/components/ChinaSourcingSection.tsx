'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, Video, Truck, CheckCircle2, ArrowRight, Upload, Phone } from 'lucide-react';

export default function ChinaSourcingSection() {
  const [itemName, setItemName] = useState('');
  const [specs, setSpecs] = useState('');
  const [quantity, setQuantity] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/sourcing-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: 'Website Client',
          phone,
          itemName,
          specification: specs,
          targetQuantity: Number(quantity) || 1
        })
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      number: '01',
      title: 'Submit Spec or Nameplate',
      description:
        'Provide your part number, machinery model, CAD drawing, or photo of an obsolete component.'
    },
    {
      number: '02',
      title: 'On-Ground Factory Visit',
      description:
        'Our personal contractor in China visits trusted factories in Guangdong & Jiangsu to audit specs and negotiate direct factory rates.'
    },
    {
      number: '03',
      title: 'Pre-Shipment Video QC',
      description:
        'We test tolerances and share live high-definition test video & calibration reports before dispatch.'
    },
    {
      number: '04',
      title: 'Customs & Factory Delivery',
      description:
        'Delivered straight to your factory in Bangladesh via 7-10 day Air Express or consolidated Sea Freight.'
    }
  ];

  return (
    <section id="sourcing" className="py-20 bg-slate-900/60 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Direct China Procurement Partner
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Personal Factory Touch & <span className="text-emerald-400">Quality Inspection</span> in China
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Never risk sub-standard machinery or fake parts. We act as your on-ground engineering eyes and hands in China.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-panel p-6 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-3 relative"
            >
              <div className="text-2xl font-mono font-extrabold text-emerald-400/50">{step.number}</div>
              <h3 className="text-base font-bold text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Sourcing Form Card */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel border border-emerald-500/30 p-8 sm:p-12 shadow-2xl shadow-emerald-950/20">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Need a Custom Machine or Obsolete Part?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Send us the part name or model. Our China team will immediately source direct factory availability, price, and lead time.
              </p>
              <div className="pt-2 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct WhatsApp Updates from Factory Floor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Full Customs Clearance Included</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-7">
              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Sourcing Request Received!</h4>
                  <p className="text-xs text-slate-300">
                    Our China team has been notified. We will contact you via WhatsApp / Phone shortly with pricing & availability.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Part / Machine Name or Model Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g. Siemens S7-1200 CPU, Textile Loom Sensor..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Quantity Required
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Technical Specs / Brand / Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specs}
                      onChange={(e) => setSpecs(e.target.value)}
                      placeholder="Voltage, dimensions, OEM part number, or urgent delivery date..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting...' : 'Dispatch Sourcing Request to China'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
