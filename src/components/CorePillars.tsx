'use client';

import React from 'react';
import { Cpu, Sun, Plane, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CorePillarsProps {
  onOpenRFQ?: (productName?: string) => void;
}

export default function CorePillars({ onOpenRFQ }: CorePillarsProps) {
  return (
    <section className="py-16 md:py-24 border-t border-white/[0.06] bg-[#0b0d11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="max-w-3xl text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Three Core Divisions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Reliability. Built for Transparency.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
            We operate as your dedicated engineering and procurement wing between Chinese manufacturing lines and your facility in Bangladesh.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pillar 1: Industrial Automation */}
          <div className="craft-card p-8 flex flex-col justify-between space-y-6 text-left border-white/[0.08]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Industrial Automation & PLCs</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Original Siemens S7-1500/1200 PLCs, I/O modules, Schneider contactors, and Omron sensors. Guaranteed 100% genuine with manufacturer packaging and serial tracking.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Full analog & digital I/O replacement modules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Obsolete & legacy part cross-referencing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Express air delivery for zero downtime</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenRFQ && onOpenRFQ('Industrial Automation / PLC Modules')}
              className="w-full py-3 rounded-xl bg-[#181d26] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Request PLC Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: Solar & Energy Storage */}
          <div className="craft-card p-8 flex flex-col justify-between space-y-6 text-left border-amber-500/20 bg-gradient-to-b from-[#12151c] to-[#141720]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">11,000-Cycle Solar ESS</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                HiTHIUM Tier-1 LiFePO₄ industrial energy storage packs and Deye hybrid inverters. 11,000 cycle lifespan delivers 15-20 years of continuous uninterrupted factory duty.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Grade-A 314Ah cell chemistry with Smart BMS</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Seamless &lt;10ms UPS switchover for spinning mills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>10 Years direct manufacturer warranty</span>
                </li>
              </ul>
            </div>

            <Link
              href="/calculator"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Use Battery Sizing Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 3: Direct China Procurement */}
          <div className="craft-card p-8 flex flex-col justify-between space-y-6 text-left border-white/[0.08]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Personal China Sourcing Desk</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Have a specific machine, mould, PCB, or consumer gadget to source? We visit the factory floor in China, inspect quality via live video call, and deliver door-to-door.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Physical plant visits in Shenzhen, Dongguan & Ningbo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live unboxing and tolerance test videos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Turnkey customs, air express (7-10d) & sea freight</span>
                </li>
              </ul>
            </div>

            <Link
              href="/sourcing"
              className="w-full py-3 rounded-xl bg-[#181d26] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Sourcing Process</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
