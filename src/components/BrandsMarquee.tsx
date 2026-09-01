'use client';

import React from 'react';

const BRANDS = [
  { name: 'Siemens SIMATIC', category: 'Automation & PLCs' },
  { name: 'HiTHIUM Energy', category: '11,000-Cycle LiFePO₄' },
  { name: 'Schneider Electric', category: 'Switchgear & VFDs' },
  { name: 'Deye Solar', category: 'Hybrid Inverters' },
  { name: 'Omron Automation', category: 'Sensors & Relays' },
  { name: 'Tuya Smart', category: 'Smart Home & IoT' },
  { name: 'Delta Electronics', category: 'Power & Servo Drives' },
  { name: 'ABB Power', category: 'Industrial Switchgear' }
];

export default function BrandsMarquee() {
  return (
    <section className="py-10 border-y border-black/[0.06] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <p className="text-[11px] uppercase tracking-widest text-[#a0aec0] font-bold">
          DIRECT FACTORY SUPPLY & AUTHORIZED DISTRIBUTOR NETWORKS
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BRANDS.map((b) => (
            <div key={b.name} className="p-3 rounded-xl bg-[#fafaf8] border border-black/[0.06] hover:border-[#e85d04]/30 transition-all flex flex-col items-center justify-center text-center group">
              <div className="text-xs font-bold text-[#1a1a1a] group-hover:text-[#e85d04] transition-colors truncate w-full">{b.name}</div>
              <div className="text-[10px] text-[#718096] truncate w-full">{b.category}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
