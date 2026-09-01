'use client';

import React, { useState, useMemo } from 'react';
import { Sun, ArrowRight, Zap, RotateCcw } from 'lucide-react';

interface SolarCalculatorProps {
  onOpenRFQ?: (productName?: string) => void;
}

export default function SolarCalculator({ onOpenRFQ }: SolarCalculatorProps) {
  const [dailyLoadKWh, setDailyLoadKWh] = useState<number>(45);
  const [backupHours, setBackupHours] = useState<number>(6);
  const [autonomyDays, setAutonomyDays] = useState<number>(1);
  const [sunlightHours, setSunlightHours] = useState<number>(4.5);

  const calculations = useMemo(() => {
    const hourlyLoad = dailyLoadKWh / 24;
    const requiredBackupKWh = hourlyLoad * backupHours * autonomyDays;
    const dod = 0.85;
    const recommendedBatteryCapacityKWh = Math.ceil(requiredBackupKWh / dod);
    const unitCapacity = 16.08;
    const batteryUnitsNeeded = Math.max(1, Math.ceil(recommendedBatteryCapacityKWh / unitCapacity));
    const totalInstalledCapacity = (batteryUnitsNeeded * unitCapacity).toFixed(1);
    const solarPanelEfficiency = 0.8;
    const requiredSolarKWP = (dailyLoadKWh / (sunlightHours * solarPanelEfficiency)).toFixed(1);
    const panels550W = Math.ceil((Number(requiredSolarKWP) * 1000) / 550);
    const avgGridCostPerKWh = 12;
    const monthlySavingsBDT = Math.round(dailyLoadKWh * 30 * avgGridCostPerKWh * 0.7);
    const yearlySavingsBDT = monthlySavingsBDT * 12;
    return { recommendedBatteryCapacityKWh, batteryUnitsNeeded, totalInstalledCapacity, requiredSolarKWP, panels550W, monthlySavingsBDT, yearlySavingsBDT };
  }, [dailyLoadKWh, backupHours, autonomyDays, sunlightHours]);

  return (
    <section id="calculator" className="py-16 md:py-24 border-t border-black/[0.06] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#e85d04] text-xs font-semibold border border-orange-200"><Sun className="w-3.5 h-3.5" /><span>Industrial & Commercial Sizing Tool</span></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">Solar & 11,000-Cycle LiFePO₄ Battery Calculator</h2>
          <p className="text-[#718096] text-sm sm:text-base leading-relaxed font-light">Estimate exact battery storage capacity, required solar kWp, and monthly power savings for your factory or commercial facility in Bangladesh.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 craft-card p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-black/[0.06] pb-4">
              <h3 className="text-base font-bold text-[#1a1a1a]">Facility Consumption Parameters</h3>
              <button onClick={() => { setDailyLoadKWh(45); setBackupHours(6); }} className="text-xs text-[#718096] hover:text-[#1a1a1a] flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /><span>Reset</span></button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[#4a5568] font-medium">Daily Energy Consumption (kWh / Day)</label>
                <span className="font-bold text-[#e85d04] mono text-sm">{dailyLoadKWh} kWh</span>
              </div>
              <input type="range" min="10" max="500" step="5" value={dailyLoadKWh} onChange={(e) => setDailyLoadKWh(Number(e.target.value))} className="w-full accent-[#e85d04] cursor-pointer" />
              <div className="flex justify-between text-[10px] text-[#a0aec0]"><span>Small Workshop (10 kWh)</span><span>Commercial Factory (500 kWh)</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[#4a5568] font-medium">Required Zero-Grid Backup Hours</label>
                <span className="font-bold text-[#e85d04] mono text-sm">{backupHours} Hours</span>
              </div>
              <input type="range" min="2" max="24" step="1" value={backupHours} onChange={(e) => setBackupHours(Number(e.target.value))} className="w-full accent-[#e85d04] cursor-pointer" />
              <div className="flex justify-between text-[10px] text-[#a0aec0]"><span>Peak Load Shaving (2h)</span><span>24/7 Full Autonomy (24h)</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs text-[#718096]">Peak Sun Hours (BD)</label>
                <select value={sunlightHours} onChange={(e) => setSunlightHours(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-[#f5f5f2] border border-black/[0.06] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#e85d04]">
                  <option value={4.0}>4.0 Hours (Monsoon Average)</option>
                  <option value={4.5}>4.5 Hours (Standard Annual)</option>
                  <option value={5.0}>5.0 Hours (Summer Peak)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#718096]">Autonomy Days</label>
                <select value={autonomyDays} onChange={(e) => setAutonomyDays(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-[#f5f5f2] border border-black/[0.06] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#e85d04]">
                  <option value={1}>1 Day (Daily Cycle)</option>
                  <option value={2}>2 Days (Heavy Cloud Backup)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 craft-card p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white to-orange-50/40 border-orange-200">
            <div className="border-b border-black/[0.06] pb-4">
              <span className="text-[11px] font-bold text-[#e85d04] uppercase tracking-wider">RECOMMENDED SYSTEM SPECIFICATION</span>
              <h3 className="text-xl font-bold text-[#1a1a1a] mt-1">HiTHIUM LiFePO₄ Energy Storage Setup</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#fafaf8] border border-black/[0.06] space-y-1">
                <div className="text-xs text-[#718096]">Recommended Storage</div>
                <div className="text-2xl font-bold text-[#1a1a1a] mono">{calculations.totalInstalledCapacity} <span className="text-sm font-normal text-[#718096]">kWh</span></div>
                <div className="text-[11px] text-[#e85d04] font-medium">{calculations.batteryUnitsNeeded}x HiTHIUM HeroEE 16</div>
              </div>
              <div className="p-4 rounded-xl bg-[#fafaf8] border border-black/[0.06] space-y-1">
                <div className="text-xs text-[#718096]">Solar Array Sizing</div>
                <div className="text-2xl font-bold text-[#0284c7] mono">{calculations.requiredSolarKWP} <span className="text-sm font-normal text-[#718096]">kWp</span></div>
                <div className="text-[11px] text-[#718096] font-medium">Approx. {calculations.panels550W}x 550W Tier-1 Panels</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="text-xs text-[#059669] font-semibold flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /><span>Estimated Grid Cost Savings</span></div>
              <div className="text-lg font-bold text-[#1a1a1a] mono">৳{calculations.monthlySavingsBDT.toLocaleString()} / Month <span className="text-xs text-[#718096] font-normal">(৳{calculations.yearlySavingsBDT.toLocaleString()} / Year)</span></div>
            </div>
            <div className="pt-2">
              <button onClick={() => onOpenRFQ && onOpenRFQ(`HiTHIUM Solar ESS (${calculations.totalInstalledCapacity}kWh Battery + ${calculations.requiredSolarKWP}kWp Solar)`)} className="w-full py-3 rounded-xl bg-[#1a3a5c] hover:bg-[#0f2a45] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all">
                <span>Request Quotation with this Sizing</span><ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
