'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, Video, Truck, CheckCircle2, ArrowRight, Upload, Phone, Terminal } from 'lucide-react';

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
      coord: 'LOC: BD-DAC',
      title: 'Submit Spec or Nameplate',
      description:
        'Provide your part number, machinery model, CAD drawing, or photo of an obsolete component.'
    },
    {
      number: '02',
      coord: 'LOC: CN-SZX',
      title: 'On-Ground Factory Visit',
      description:
        'Our personal contractor in China visits trusted factories in Guangdong & Jiangsu to audit specs and negotiate direct factory rates.'
    },
    {
      number: '03',
      coord: 'LOC: CN-CAN',
      title: 'Pre-Shipment Video QC',
      description:
        'We test electrical tolerances and share live high-definition test video & calibration reports before dispatch.'
    },
    {
      number: '04',
      coord: 'LOC: BD-CGP',
      title: 'Customs & Factory Delivery',
      description:
        'Delivered straight to your factory in Bangladesh via 7-10 day Air Express or consolidated Sea Freight.'
    }
  ];

  return (
    <section id="sourcing" className="py-20 bg-[#06080c] relative tech-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b0f17] border border-[#00ff88]/30 text-[#00ff88] text-xs font-bold mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            [PROCUREMENT_RADAR // CHINA ON-GROUND DIRECT DESK]
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Personal Factory Touch & <span className="text-[#00ff88]">On-Ground Video QC</span> in China
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Never risk sub-standard machinery or fake parts. We act as your on-ground engineering eyes and hands in China.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl hud-panel p-6 border border-[#1a2234] hover:border-[#00ff88]/40 transition-all space-y-3 relative"
            >
              <div className="flex justify-between items-center text-xs mono">
                <span className="text-xl font-extrabold text-[#00ff88]">{step.number}</span>
                <span className="text-[10px] text-slate-500">{step.coord}</span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Sourcing Form Card */}
        <div className="max-w-4xl mx-auto rounded-3xl hud-panel border border-[#00ff88]/30 p-8 sm:p-12 shadow-2xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4">
              <div className="text-[10px] mono text-[#00ff88] font-bold">[CUSTOM_SOURCING_PORTAL]</div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Need a Custom Machine or Obsolete Part?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Send us the part name or model. Our China team will immediately source direct factory availability, price, and lead time.
              </p>
              <div className="pt-2 space-y-2 text-xs mono text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                  <span>Direct WhatsApp Video Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                  <span>Complete Customs Clearance Handled</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-7">
              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#070b12] border border-[#00ff88]/40 text-center space-y-3 mono">
                  <CheckCircle2 className="w-10 h-10 text-[#00ff88] mx-auto" />
                  <h4 className="text-base font-bold text-white">SOURCING_DISPATCH_CONFIRMED</h4>
                  <p className="text-xs text-slate-400">
                    Our China team has been notified. We will contact you via WhatsApp / Phone shortly with pricing & availability.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mono text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">
                      PART / MACHINE NAME OR MODEL *
                    </label>
                    <input
                      type="text"
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g. Siemens S7-1200 CPU, Loom Sensor..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090e17] border border-[#1a2234] text-white focus:outline-none focus:border-[#00ff88]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 block mb-1">
                        QTY REQUIRED
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090e17] border border-[#1a2234] text-white focus:outline-none focus:border-[#00ff88]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">
                        PHONE / WHATSAPP *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090e17] border border-[#1a2234] text-white focus:outline-none focus:border-[#00ff88]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">
                      TECHNICAL SPECS / NOTES (OPTIONAL)
                    </label>
                    <textarea
                      rows={2}
                      value={specs}
                      onChange={(e) => setSpecs(e.target.value)}
                      placeholder="Voltage, dimensions, OEM part number, or urgent delivery date..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090e17] border border-[#1a2234] text-white focus:outline-none focus:border-[#00ff88]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>{loading ? 'DISPATCHING...' : 'DISPATCH_SOURCING_INQUIRY [↵]'}</span>
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
