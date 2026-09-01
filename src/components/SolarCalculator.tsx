'use client';

import React, { useState } from 'react';
import { Sun, BatteryCharging, Zap, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SolarCalculatorProps {
  onOpenRFQ?: (prefillNotes?: string) => void;
}

export default function SolarCalculator({ onOpenRFQ }: SolarCalculatorProps) {
  const [loadKW, setLoadKW] = useState<number>(10);
  const [backupHours, setBackupHours] = useState<number>(4);
  const [efficiency] = useState<number>(0.88); // 88% system depth of discharge & inverter efficiency

  // Calculations
  const rawKWh = loadKW * backupHours;
  const recommendedKWh = Math.ceil(rawKWh / efficiency);
  const recommendedInverterKW = Math.ceil(loadKW * 1.25); // 25% surge headroom
  
  // Recommend battery units
  const heroEE16Count = Math.ceil(recommendedKWh / 16);
  const maxPower8Count = Math.ceil(recommendedKWh / 8);

  const handleRequestQuote = () => {
    const specDetails = `Solar & ESS Calculator Sizing: ${loadKW} kW Load for ${backupHours} Hours Backup (Required Storage: ~${recommendedKWh} kWh, Inverter: ~${recommendedInverterKW} kW, HiTHIUM Battery Units: ${heroEE16Count}x 16kWh HeroEE)`;
    onOpenRFQ?.(specDetails);
  };

  return (
    <section id="calculator" className="py-20 bg-slate-900/40 relative tech-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            Engineering Sizing Tool
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Factory Solar & <span className="text-amber-400">LiFePO₄ Battery Sizing</span> Calculator
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Calculate your plant's energy storage requirements and receive an instant HiTHIUM battery configuration tailored to your load.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-5xl mx-auto rounded-3xl glass-panel border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-950/20">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Input Controls (Left 6 cols) */}
            <div className="md:col-span-6 space-y-8">
              {/* Load Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Essential Plant / Load Power:
                  </label>
                  <span className="text-xl font-bold font-mono text-amber-400 bg-amber-500/10 px-3 py-0.5 rounded-lg border border-amber-500/20">
                    {loadKW} kW
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={loadKW}
                  onChange={(e) => setLoadKW(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>1 kW (Small Commercial)</span>
                  <span>50 kW (Factory Line)</span>
                  <span>100 kW (Heavy Industrial)</span>
                </div>
              </div>

              {/* Backup Hours Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4 text-sky-400" />
                    Required Backup Duration:
                  </label>
                  <span className="text-xl font-bold font-mono text-sky-400 bg-sky-500/10 px-3 py-0.5 rounded-lg border border-sky-500/20">
                    {backupHours} Hours
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={backupHours}
                  onChange={(e) => setBackupHours(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>1 Hour (Load shedding surge)</span>
                  <span>8 Hours (Full Shift)</span>
                  <span>24 Hours (24/7 Off-Grid)</span>
                </div>
              </div>

              {/* Quick Specs Checklist */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  HiTHIUM Grade-A LiFePO₄ Cells (11,000+ Cycles)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  Supports Deye, Growatt, Megarevo Hybrid Inverters
                </div>
              </div>
            </div>

            {/* Calculated Output Card (Right 6 cols) */}
            <div className="md:col-span-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 border border-slate-800 shadow-inner space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                  Recommended Energy Storage System
                </div>
                <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                  <span className="text-amber-400 font-mono">{recommendedKWh}</span>
                  <span className="text-base font-medium text-slate-300">kWh Storage Needed</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Hybrid Inverter Size</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5">≥ {recommendedInverterKW} kW</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Battery Option A</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {heroEE16Count}x HeroEE 16kWh
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Battery Option B</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {maxPower8Count}x MaxPower 8kWh
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Expected Lifespan</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">15-20+ Years</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRequestQuote}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Get Official Factory Proposal (RFQ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
