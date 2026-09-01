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
      badge: 'Pillar 01',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      title: 'Industrial Automation & Control',
      tagline: 'Siemens, Schneider, Omron & SCADA Systems',
      description:
        'Complete automation supply for manufacturing plants, textile mills, and industrial automation lines. Guaranteed 100% authentic modules, contactors, HMIs, and variable frequency drives with factory serial verification.',
      features: [
        'Siemens S7-1200 / S7-1500 PLC & I/O Modules',
        'Schneider Electric TeSys Contactors & Breakers',
        'Invertek & Delta VFD Variable Frequency Drives',
        'Custom Industrial Control Panel Fabrication'
      ],
      ctaText: 'Explore Automation Catalog',
      ctaColor: 'text-sky-400 hover:text-sky-300',
      borderColor: 'border-sky-500/20 hover:border-sky-500/50',
      glowColor: 'hover:shadow-sky-500/10'
    },
    {
      id: 'solar',
      icon: Sun,
      badge: 'Pillar 02',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
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
      ctaText: 'Calculate Energy Storage',
      ctaColor: 'text-amber-400 hover:text-amber-300',
      borderColor: 'border-amber-500/20 hover:border-amber-500/50',
      glowColor: 'hover:shadow-amber-500/10'
    },
    {
      id: 'sourcing',
      icon: ShieldCheck,
      badge: 'Pillar 03',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
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
      ctaText: 'Request Custom Sourcing',
      ctaColor: 'text-emerald-400 hover:text-emerald-300',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/50',
      glowColor: 'hover:shadow-emerald-500/10'
    }
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-t border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            Comprehensive Industrial Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Three Pillars of <span className="text-sky-400">Industrial Excellence</span>
          </h2>
          <p className="text-slate-400 text-base">
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
                className={`rounded-2xl glass-panel p-8 border transition-all duration-300 shadow-xl flex flex-col justify-between ${pillar.borderColor} ${pillar.glowColor}`}
              >
                <div className="space-y-6">
                  {/* Top Badge & Icon */}
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{pillar.title}</h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">{pillar.tagline}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{pillar.description}</p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 pt-2 border-t border-slate-800">
                    {pillar.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => onOpenRFQ?.(pillar.title)}
                    className={`w-full py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${pillar.ctaColor}`}
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
