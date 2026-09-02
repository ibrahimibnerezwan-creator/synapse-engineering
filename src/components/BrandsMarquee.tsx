'use client';

import React from 'react';

const BRANDS = [
  { name: 'Siemens SIMATIC', category: 'Automation' },
  { name: 'HiTHIUM Energy', category: '11,000-cycle LiFePO₄' },
  { name: 'Schneider Electric', category: 'Switchgear' },
  { name: 'Deye Solar', category: 'Hybrid inverters' },
  { name: 'Omron', category: 'Sensors' },
  { name: 'Tuya Smart', category: 'Home IoT' },
  { name: 'Delta Electronics', category: 'Drives' },
  { name: 'ABB', category: 'Power' }
];

export default function BrandsMarquee() {
  const loop = [...BRANDS, ...BRANDS];

  return (
    <section className="border-y border-[rgba(28,22,18,0.12)] bg-[#fffdf8] overflow-hidden" aria-label="Factory brands on the corridor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-6">
        <p className="kicker shrink-0 hidden sm:block">On the corridor</p>
        <p className="sr-only">
          Siemens SIMATIC, HiTHIUM Energy, Schneider Electric, Deye Solar, Omron, Tuya Smart, Delta Electronics, ABB
        </p>
        <div className="overflow-hidden flex-1">
          <div className="marquee-track gap-10 pr-10" aria-hidden="true">
            {loop.map((b, i) => (
              <div key={`${b.name}-${i}`} className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-sm font-medium text-[#1c1612]">{b.name}</span>
                <span className="text-[11px] text-[#8a7e72]">{b.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
