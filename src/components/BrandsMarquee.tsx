'use client';

import React from 'react';

const BRANDS = [
  { name: 'Siemens SIMATIC', category: 'Automation & PLCs', origin: 'Germany' },
  { name: 'HiTHIUM Energy', category: '11,000-Cycle LiFePO₄', origin: 'Xiamen' },
  { name: 'Schneider Electric', category: 'Switchgear & VFDs', origin: 'France' },
  { name: 'Deye Solar', category: 'Hybrid Inverters', origin: 'Ningbo' },
  { name: 'Omron Automation', category: 'Sensors & Relays', origin: 'Japan' },
  { name: 'Tuya Smart', category: 'Smart Home & IoT', origin: 'Hangzhou' },
  { name: 'Delta Electronics', category: 'Power & Servo Drives', origin: 'Taiwan' },
  { name: 'ABB Power', category: 'Industrial Switchgear', origin: 'Switzerland' }
];

export default function BrandsMarquee() {
  return (
    <section className="py-10 border-y border-white/[0.06] bg-[#0c0e14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">
          DIRECT FACTORY SUPPLY & AUTHORIZED DISTRIBUTOR NETWORKS
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="p-3 rounded-xl bg-[#12151c] border border-white/[0.06] hover:border-amber-500/30 transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate w-full">
                {b.name}
              </div>
              <div className="text-[10px] text-amber-400/80 truncate w-full">{b.category}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
