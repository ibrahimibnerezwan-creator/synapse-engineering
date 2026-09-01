'use client';

import React, { useState } from 'react';
import { Sun, BatteryCharging, Zap, Calculator, ArrowRight, CheckCircle2, Terminal } from 'lucide-react';

interface SolarCalculatorProps {
  onOpenRFQ?: (prefillNotes?: string) => void;
}

export default function SolarCalculator({ onOpenRFQ }: SolarCalculatorProps) {
  const [loadKW, setLoadKW] = useState<number>(15);
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
    const specDetails = `ESS Calculator Sizing: ${loadKW} kW Load for ${backupHours} Hours Backup (Storage: ~${recommendedKWh} kWh, Inverter: ~${recommendedInverterKW} kW, HiTHIUM Units: ${heroEE16Count}x 16kWh HeroEE)`;
    onOpenRFQ?.(specDetails);
  };

  return (
    <section id="calculator" className="py-20 bg-[#06080c] relative tech-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b0f17] border border-[#ffaa00]/30 text-[#ffaa00] text-xs font-bold mono uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            [ENGINEERING_TOOL // SIZING_ENGINE_V2.6]
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Factory Solar & <span className="text-[#ffaa00]">HiTHIUM LiFePO₄ Sizing</span> Console
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Calculate your industrial power storage requirements and configure custom HiTHIUM battery units for 15-20+ years of maintenance-free operation.
          </p>
        </div>

        {/* Calculator Main HUD Box */}
        <div className="max-w-5xl mx-auto rounded-2xl hud-panel border border-[#ffaa00]/30 p-6 sm:p-10 shadow-2xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Input Controls (Left 6 cols) */}
            <div className="md:col-span-6 space-y-8">
              {/* Load Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-200 mono flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#ffaa00]" />
                    ESSENTIAL PLANT LOAD:
                  </label>
                  <span className="text-lg font-extrabold font-mono text-[#ffaa00] bg-[#ffaa00]/10 px-3 py-0.5 rounded border border-[#ffaa00]/30">
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
                  className="w-full h-2 bg-[#1a2234] rounded-lg appearance-none cursor-pointer accent-[#ffaa00]"
                />
                <div className="flex justify-between text-[10px] mono text-slate-500">
                  <span>1 kW (Small Commercial)</span>
                  <span>50 kW (Weaving / Line)</span>
                  <span>100 kW (Heavy Plant)</span>
                </div>
              </div>

              {/* Backup Hours Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-200 mono flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4 text-[#00f0ff]" />
                    BACKUP DURATION:
                  </label>
                  <span className="text-lg font-extrabold font-mono text-[#00f0ff] bg-[#00f0ff]/10 px-3 py-0.5 rounded border border-[#00f0ff]/30">
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
                  className="w-full h-2 bg-[#1a2234] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                />
                <div className="flex justify-between text-[10px] mono text-slate-500">
                  <span>1 Hour (Load Shedding)</span>
                  <span>8 Hours (Full Shift)</span>
                  <span>24 Hours (Off-Grid)</span>
                </div>
              </div>

              {/* Hardware Specs Checklist */}
              <div className="p-4 rounded-xl bg-[#090e17] border border-[#1a2234] text-xs mono text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-[#00ff88]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>HiTHIUM Grade-A Cells (11,000+ Cycles)</span>
                </div>
                <div className="flex items-center gap-2 text-[#00f0ff]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Compatible with Deye, Growatt, Megarevo Inverters</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Card (Right 6 cols) */}
            <div className="md:col-span-6 rounded-2xl bg-[#070a10] p-6 sm:p-8 border border-[#1a2234] shadow-inner space-y-6">
              <div className="border-b border-[#1a2234] pb-4">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  [CALCULATED ESS SPECIFICATION]
                </div>
                <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                  <span className="text-[#ffaa00] mono">{recommendedKWh}</span>
                  <span className="text-sm font-medium text-slate-400 mono">kWh Total Storage</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs mono">
                <div className="p-3 rounded-xl bg-[#090e17] border border-[#1a2234]">
                  <div className="text-[10px] text-slate-500">HYBRID INVERTER</div>
                  <div className="text-sm font-bold text-[#00f0ff] mt-0.5">≥ {recommendedInverterKW} kW</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090e17] border border-[#1a2234]">
                  <div className="text-[10px] text-slate-500">RECOMMENDED PACK</div>
                  <div className="text-sm font-bold text-[#00ff88] mt-0.5">
                    {heroEE16Count}x HeroEE 16kWh
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#090e17] border border-[#1a2234]">
                  <div className="text-[10px] text-slate-500">ALTERNATIVE PACK</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {maxPower8Count}x MaxPower 8kWh
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#090e17] border border-[#1a2234]">
                  <div className="text-[10px] text-slate-500">CYCLE LONGEVITY</div>
                  <div className="text-sm font-bold text-[#ffaa00] mt-0.5">15-20+ Years</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRequestQuote}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ffaa00] to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs mono shadow-[0_0_20px_rgba(255,170,0,0.3)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>EXECUTE_OFFICIAL_PROPOSAL [↵]</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
