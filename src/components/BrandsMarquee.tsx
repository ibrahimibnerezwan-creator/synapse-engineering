'use client';

import React from 'react';

export default function BrandsMarquee() {
  const brands = [
    { name: 'Siemens', country: 'Germany', category: 'Automation & PLCs' },
    { name: 'HiTHIUM', country: 'Tier-1', category: '11,000-Cycle LiFePO₄' },
    { name: 'Schneider Electric', country: 'France', category: 'TeSys Switchgear' },
    { name: 'Deye', country: 'China', category: 'Hybrid Inverters' },
    { name: 'Omron', country: 'Japan', category: 'Sensors & Relays' },
    { name: 'Delta Electronics', country: 'Taiwan', category: 'VFDs & Servo' },
    { name: 'ABB', country: 'Switzerland', category: 'Power Electrics' },
    { name: 'Growatt', country: 'China', category: 'Solar Inverters' }
  ];

  return (
    <div className="py-10 bg-[#06080c] border-t border-b border-[#1a2234]">
      <div className="max-w-7xl mx-auto px-4 text-center mb-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
          [DIRECT SUPPLY MATRIX // AUTHENTIC GLOBAL INDUSTRIAL BRANDS]
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 items-center">
          {brands.map((b, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl hud-panel text-center hover:border-[#00f0ff]/40 transition-all group"
            >
              <div className="font-bold text-xs text-slate-200 group-hover:text-[#00f0ff] transition-colors mono">
                {b.name}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5 mono">{b.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
