'use client';

import React, { useMemo, useState } from 'react';

interface SolarCalculatorProps {
  onOpenRFQ?: (productName?: string) => void;
}

export default function SolarCalculator({ onOpenRFQ }: SolarCalculatorProps) {
  const [dailyLoadKWh, setDailyLoadKWh] = useState(45);
  const [backupHours, setBackupHours] = useState(6);
  const [autonomyDays, setAutonomyDays] = useState(1);
  const [sunlightHours, setSunlightHours] = useState(4.5);

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
    return {
      batteryUnitsNeeded,
      totalInstalledCapacity,
      requiredSolarKWP,
      panels550W,
      monthlySavingsBDT,
      yearlySavingsBDT
    };
  }, [dailyLoadKWh, backupHours, autonomyDays, sunlightHours]);

  return (
    <section id="calculator" className="scroll-mt-24 py-16 md:py-20 border-t border-[rgba(28,22,18,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-4xl sm:text-5xl leading-[1.05]">Size the mill battery.</h2>
          <p className="kicker">ESS</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 desk p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-[rgba(28,22,18,0.12)] pb-4">
              <h3 className="font-medium">Facility load</h3>
              <button
                type="button"
                onClick={() => {
                  setDailyLoadKWh(45);
                  setBackupHours(6);
                }}
                className="text-[11px] tracking-[0.1em] uppercase text-[#8a7e72] hover:text-[#1c1612]"
              >
                Reset
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="load">Daily consumption</label>
                <span className="mono text-[#b85c38]">{dailyLoadKWh} kWh</span>
              </div>
              <input
                id="load"
                type="range"
                min="10"
                max="500"
                step="5"
                value={dailyLoadKWh}
                onChange={(e) => setDailyLoadKWh(Number(e.target.value))}
                className="w-full accent-[#b85c38]"
              />
              <div className="flex justify-between text-[10px] text-[#8a7e72]">
                <span>Workshop 10</span>
                <span>Mill 500</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="backup">Zero-grid hours</label>
                <span className="mono text-[#b85c38]">{backupHours} h</span>
              </div>
              <input
                id="backup"
                type="range"
                min="2"
                max="24"
                step="1"
                value={backupHours}
                onChange={(e) => setBackupHours(Number(e.target.value))}
                className="w-full accent-[#b85c38]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="sun" className="text-xs text-[#8a7e72]">
                  Peak sun hours (BD)
                </label>
                <select
                  id="sun"
                  value={sunlightHours}
                  onChange={(e) => setSunlightHours(Number(e.target.value))}
                  className="field"
                >
                  <option value={4.0}>4.0 monsoon</option>
                  <option value={4.5}>4.5 annual</option>
                  <option value={5.0}>5.0 summer</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="auto" className="text-xs text-[#8a7e72]">
                  Autonomy
                </label>
                <select
                  id="auto"
                  value={autonomyDays}
                  onChange={(e) => setAutonomyDays(Number(e.target.value))}
                  className="field"
                >
                  <option value={1}>1 day</option>
                  <option value={2}>2 days cloud</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 night p-6 sm:p-8 space-y-6">
            <div className="border-b border-[rgba(243,236,227,0.12)] pb-4">
              <p className="kicker">Recommended board</p>
              <h3 className="display text-2xl text-[#f3ece3] mt-1">HiTHIUM LiFePO₄ setup</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[rgba(243,236,227,0.14)] p-4">
                <p className="text-xs text-[#c9bdb0]">Storage</p>
                <p className="mono text-2xl text-[#f3ece3] mt-1">
                  {calculations.totalInstalledCapacity} <span className="text-sm">kWh</span>
                </p>
                <p className="text-[11px] text-[#d4a28a] mt-1">{calculations.batteryUnitsNeeded}× HeroEE 16</p>
              </div>
              <div className="border border-[rgba(243,236,227,0.14)] p-4">
                <p className="text-xs text-[#c9bdb0]">Solar array</p>
                <p className="mono text-2xl text-[#f3ece3] mt-1">
                  {calculations.requiredSolarKWP} <span className="text-sm">kWp</span>
                </p>
                <p className="text-[11px] text-[#c9bdb0] mt-1">~{calculations.panels550W}× 550W</p>
              </div>
            </div>
            <div className="border border-[rgba(31,107,74,0.45)] p-4">
              <p className="text-xs text-[#cfe4d8]">Est. grid saving</p>
              <p className="mono text-lg text-[#f3ece3] mt-1">
                ৳{calculations.monthlySavingsBDT.toLocaleString()} / mo
                <span className="text-xs text-[#c9bdb0] font-normal">
                  {' '}
                  (৳{calculations.yearlySavingsBDT.toLocaleString()} / yr)
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onOpenRFQ?.(
                  `HiTHIUM Solar ESS (${calculations.totalInstalledCapacity}kWh Battery + ${calculations.requiredSolarKWP}kWp Solar)`
                )
              }
              className="btn-copper w-full py-3"
            >
              Quote this sizing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
