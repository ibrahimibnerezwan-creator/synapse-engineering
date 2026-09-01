'use client';

import React from 'react';

export default function BrandsMarquee() {
  const brands = [
    { name: 'Siemens', country: 'Germany', category: 'Automation & PLCs' },
    { name: 'HiTHIUM', country: 'China (Tier-1)', category: 'LiFePO₄ Storage' },
    { name: 'Schneider Electric', country: 'France', category: 'Contactors & Switchgear' },
    { name: 'Deye', country: 'China', category: 'Hybrid Inverters' },
    { name: 'Omron', country: 'Japan', category: 'Industrial Sensors' },
    { name: 'Delta Electronics', country: 'Taiwan', category: 'VFDs & Servo' },
    { name: 'ABB', country: 'Switzerland', category: 'Power Electronics' },
    { name: 'Growatt', country: 'China', category: 'Solar Inverters' }
  ];

  return (
    <div className="py-12 bg-slate-950 border-t border-b border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
          Supplying Authentic Global Industrial Brands
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
          {brands.map((b, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center hover:border-sky-500/30 transition-all group"
            >
              <div className="font-bold text-sm text-slate-200 group-hover:text-sky-400 transition-colors">
                {b.name}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{b.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
