'use client';

import React from 'react';
import { Cpu, Sun, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface CorePillarsProps {
  onOpenRFQ?: (categoryName?: string) => void;
}

export default function CorePillars({ onOpenRFQ }: CorePillarsProps) {
  const pillars = [
    {
      id: 'automation',
      icon: Cpu,
      badge: '[PILLAR_01: AUTOMATION]',
      badgeColor: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30',
      title: 'Industrial Automation & Control',
      tagline: 'Siemens, Schneider, Omron & SCADA Systems',
      description:
        'Turnkey automation hardware for factories, textile spinning mills, and packaging automation. Guaranteed 100% authentic modules, contactors, HMIs, and VFDs with direct serial verification.',
      features: [
        'Siemens S7-1200 / S7-1500 PLC & I/O Modules',
        'Schneider Electric TeSys Contactors & Breakers',
        'Invertek & Delta VFD Variable Frequency Drives',
        'Custom Industrial Control Panel Fabrication'
      ],
      ctaText: 'QUERY_AUTOMATION_CATALOG [↵]',
      ctaColor: 'text-[#00f0ff] hover:text-cyan-300',
      borderColor: 'border-[#00f0ff]/20 hover:border-[#00f0ff]/50'
    },
    {
      id: 'solar',
      icon: Sun,
      badge: '[PILLAR_02: ENERGY_STORAGE]',
      badgeColor: 'bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/30',
      title: 'Solar & LiFePO₄ Energy Storage',
      tagline: 'HiTHIUM 11,000+ Cycles & Hybrid Inverters',
      description:
        'Tier-1 energy storage systems engineered to eliminate factory load shedding. Featuring authentic HiTHIUM LiFePO₄ battery packs with ultra-long 11,000-cycle life, integrated hybrid inverters, and zero-downtime transfer.',
      features: [
        'HiTHIUM HeroEE 16kWh LiFePO₄ Battery Storage',
        'HiTHIUM MaxPower 8kWh All-In-One UPS Systems',
        'Deye / Growatt 5kW - 50kW Hybrid Solar Inverters',
        'Commercial Rooftop Solar Turnkey Engineering'
      ],
      ctaText: 'CALCULATE_ESS_REQUIREMENT [↵]',
      ctaColor: 'text-[#ffaa00] hover:text-amber-300',
      borderColor: 'border-[#ffaa00]/20 hover:border-[#ffaa00]/50'
    },
    {
      id: 'sourcing',
      icon: ShieldCheck,
      badge: '[PILLAR_03: CHINA_PROCUREMENT]',
      badgeColor: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30',
      title: 'China Direct Sourcing & QC',
      tagline: 'Personal Factory Touch & Doorstep Delivery',
      description:
        'Your trusted engineering partner on the ground in China. We personally visit factories in Shenzhen, Dongguan, and Ningbo to verify tolerances, negotiate factory-direct prices, and deliver obsolete or custom machinery directly to Bangladesh.',
      features: [
        'Personal On-Ground Factory Audits in China',
        'Obsolete & Hard-to-Find Component Sourcing',
        'Sample Verification & Pre-Shipment Video Inspection',
        'Door-to-Door Air Cargo (7-10d) & Sea Freight (25d)'
      ],
      ctaText: 'SUBMIT_SOURCING_BOM [↵]',
      ctaColor: 'text-[#00ff88] hover:text-emerald-300',
      borderColor: 'border-[#00ff88]/20 hover:border-[#00ff88]/50'
    }
  ];

  return (
    <section className="py-20 bg-[#06080c] border-t border-b border-[#1a2234]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b0f17] border border-[#1a2234] text-[#00f0ff] text-xs font-bold mono uppercase tracking-wider">
            [CORE ARCHITECTURE // THREE INDUSTRIAL DIVISIONS]
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Engineered For <span className="text-[#00f0ff]">Zero Factory Downtime</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            From factory automation components to high-density lithium storage and direct manufacturer procurement in China.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                id={pillar.id}
                className={`rounded-2xl hud-panel p-8 transition-all duration-300 shadow-xl flex flex-col justify-between ${pillar.borderColor}`}
              >
                <div className="space-y-6">
                  {/* Top Badge & Icon */}
                  <div className="flex justify-between items-center">
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded border ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                    <div className="w-11 h-11 rounded-lg bg-[#06080c] border border-[#1a2234] flex items-center justify-center text-white shadow-inner">
                      <Icon className="w-5 h-5 text-[#00f0ff]" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{pillar.title}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-1">{pillar.tagline}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">{pillar.description}</p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 pt-2 border-t border-[#1a2234]">
                    {pillar.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => onOpenRFQ?.(pillar.title)}
                    className={`w-full py-3 rounded-xl bg-[#090e17] hover:bg-slate-900 border border-[#1a2234] text-xs font-bold mono flex items-center justify-center gap-2 transition-all ${pillar.ctaColor}`}
                  >
                    <span>{pillar.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
