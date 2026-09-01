'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Sun, Plane, CheckCircle2, ArrowRight } from 'lucide-react';

interface CorePillarsProps {
  onOpenRFQ?: (productName?: string) => void;
}

export default function CorePillars({ onOpenRFQ }: CorePillarsProps) {
  return (
    <section className="py-16 md:py-24 border-t border-black/[0.06] bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0284c7] text-xs font-semibold border border-blue-200"><Cpu className="w-3.5 h-3.5" /><span>Three Core Divisions</span></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">Engineered for Reliability. Built for Transparency.</h2>
          <p className="text-[#718096] text-sm sm:text-base leading-relaxed font-light">We operate as your dedicated engineering and procurement wing between Chinese manufacturing lines and your facility in Bangladesh.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Industrial Automation */}
          <div className="craft-card p-8 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0284c7] flex items-center justify-center"><Cpu className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">Industrial Automation & PLCs</h3>
              <p className="text-sm text-[#718096] leading-relaxed font-light">Original Siemens S7-1500/1200 PLCs, I/O modules, Schneider contactors, and Omron sensors. Guaranteed 100% genuine with manufacturer packaging and serial tracking.</p>
              <ul className="space-y-2 text-xs text-[#4a5568] pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0284c7] shrink-0" /><span>Full analog & digital I/O replacement modules</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0284c7] shrink-0" /><span>Obsolete & legacy part cross-referencing</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0284c7] shrink-0" /><span>Express air delivery for zero downtime</span></li>
              </ul>
            </div>
            <button onClick={() => onOpenRFQ && onOpenRFQ('Industrial Automation / PLC Modules')} className="w-full py-3 rounded-xl bg-[#f5f5f2] hover:bg-[#eeeee8] text-[#1a1a1a] font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-black/[0.06]">
              <span>Request PLC Quote</span><ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Solar & ESS */}
          <div className="craft-card p-8 flex flex-col justify-between space-y-6 text-left border-orange-200 bg-gradient-to-b from-white to-orange-50/30">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#e85d04] flex items-center justify-center"><Sun className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">11,000-Cycle Solar ESS</h3>
              <p className="text-sm text-[#718096] leading-relaxed font-light">HiTHIUM Tier-1 LiFePO₄ industrial energy storage packs and Deye hybrid inverters. 11,000 cycle lifespan delivers 15-20 years of continuous uninterrupted factory duty.</p>
              <ul className="space-y-2 text-xs text-[#4a5568] pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e85d04] shrink-0" /><span>Grade-A 314Ah cell chemistry with Smart BMS</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e85d04] shrink-0" /><span>Seamless &lt;10ms UPS switchover for spinning mills</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e85d04] shrink-0" /><span>10 Years direct manufacturer warranty</span></li>
              </ul>
            </div>
            <Link href="/calculator" className="w-full py-3 rounded-xl bg-[#e85d04] hover:bg-[#d45403] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md">
              <span>Use Battery Sizing Calculator</span><ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* China Sourcing */}
          <div className="craft-card p-8 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center"><Plane className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">Personal China Sourcing Desk</h3>
              <p className="text-sm text-[#718096] leading-relaxed font-light">Have a specific machine, mould, PCB, or consumer gadget to source? We visit the factory floor in China, inspect quality via live video call, and deliver door-to-door.</p>
              <ul className="space-y-2 text-xs text-[#4a5568] pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" /><span>Physical plant visits in Shenzhen, Dongguan & Ningbo</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" /><span>Live unboxing and tolerance test videos</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" /><span>Turnkey customs, air express (7-10d) & sea freight</span></li>
              </ul>
            </div>
            <Link href="/sourcing" className="w-full py-3 rounded-xl bg-[#f5f5f2] hover:bg-[#eeeee8] text-[#1a1a1a] font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-black/[0.06]">
              <span>Explore Sourcing Process</span><ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
