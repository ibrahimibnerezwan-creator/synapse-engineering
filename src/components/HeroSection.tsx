'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sun, Cpu, CheckCircle2, Zap, Search, Terminal, Activity } from 'lucide-react';

interface HeroSectionProps {
  onOpenRFQ?: (productName?: string) => void;
  onSearch?: (term: string) => void;
}

export default function HeroSection({ onOpenRFQ, onSearch }: HeroSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 tech-grid-bg">
      {/* Laser Cyan & Solar Amber Ambient Core Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00f0ff]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-[#ffaa00]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Monolith Headline & Terminal Input */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Coordinate Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0b0f17] border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-bold mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] live-telemetry-dot" />
              <span>LOC: GZ-CAN // DHAKA DESK // VERIFIED FACTORY CONTRACTOR</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase">
              Mission-Critical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-sky-300 to-[#ffaa00]">
                Factory Automation
              </span> <br />
              & 11,000-Cycle ESS
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              We eliminate industrial downtime with authentic <strong>Siemens & Schneider</strong> automation modules, 
              Tier-1 <strong>HiTHIUM 11,000-cycle LiFePO₄ storage systems</strong>, and dedicated on-ground factory sourcing 
              with personal video QC in China delivered straight to your factory in Bangladesh.
            </p>

            {/* Command-Line Search Terminal */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl">
              <div className="hud-panel p-2 rounded-xl flex items-center gap-3 border border-[#00f0ff]/30 bg-[#090e17]/90 shadow-[0_0_25px_rgba(0,240,255,0.1)]">
                <span className="mono text-xs text-[#00f0ff] font-bold pl-2 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" />
                  CMD:&gt;
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="QUERY PART NO (e.g. 6ES7532-5HD00, LC1K, HiTHIUM 16kWh)..."
                  className="w-full bg-transparent text-xs mono text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="mono text-xs px-4 py-2 bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold rounded transition-all shadow-md shrink-0"
                >
                  EXECUTE [↵]
                </button>
              </div>
            </form>

            {/* Action Triggers */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onOpenRFQ?.()}
                className="mono text-xs px-6 py-3.5 rounded bg-gradient-to-r from-[#00f0ff] via-sky-500 to-blue-600 hover:from-[#38bdf8] hover:to-blue-500 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>INIT_OFFICIAL_RFQ [↵]</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#sourcing"
                className="mono text-xs px-6 py-3.5 rounded hud-panel text-slate-200 hover:text-white font-bold hover:border-[#00ff88]/50 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
                <span>CHINA_QC_WORKFLOW</span>
              </a>
            </div>

            {/* Verification Checklist */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1a2234]">
              <div className="flex items-center gap-2 text-xs mono text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0" />
                <span>100% GENUINE SERIAL</span>
              </div>
              <div className="flex items-center gap-2 text-xs mono text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <span>VIDEO QC BEFORE SHIP</span>
              </div>
              <div className="flex items-center gap-2 text-xs mono text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-[#ffaa00] shrink-0" />
                <span>7-10D AIR EXPRESS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry HUD Widget */}
          <div className="lg:col-span-5 relative">
            <div className="hud-panel rounded-2xl p-6 border border-[#00f0ff]/30 shadow-2xl space-y-5">
              {/* Telemetry Header */}
              <div className="flex justify-between items-center pb-3 border-b border-[#1a2234] text-xs mono">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-white font-bold tracking-wider">HARDWARE_TELEMETRY</span>
                </div>
                <span className="text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/30">
                  FEED: LIVE
                </span>
              </div>

              {/* Telemetry Card 1: HiTHIUM 16kWh Battery */}
              <div className="p-4 rounded-xl bg-[#070b12] border border-[#ffaa00]/20 hover:border-[#ffaa00]/50 transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded bg-[#ffaa00]/10 flex items-center justify-center text-[#ffaa00] shrink-0 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffaa00]/20 text-[#ffaa00] mono">
                      HiTHIUM LiFePO₄
                    </span>
                    <span className="text-[10px] text-[#00ff88] mono">11,000 CYCLES</span>
                  </div>
                  <h2 className="text-xs font-bold text-white truncate mt-1">
                    HeroEE 16kWh Battery Pack (51.2V 314Ah)
                  </h2>
                  <div className="text-[10px] text-slate-500 mono mt-0.5">SMART-BMS // CAN/RS485 PROTOCOL</div>
                </div>
              </div>

              {/* Telemetry Card 2: Siemens S7-1500 PLC */}
              <div className="p-4 rounded-xl bg-[#070b12] border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] shrink-0 group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] mono">
                      Siemens SIMATIC
                    </span>
                    <span className="text-[10px] text-slate-400 mono">S7-1500</span>
                  </div>
                  <h2 className="text-xs font-bold text-white truncate mt-1">
                    6ES7532-5HD00-0AB0 Analog Output
                  </h2>
                  <div className="text-[10px] text-slate-500 mono mt-0.5">AQ 4xU/I ST // 16-BIT RESOLUTION</div>
                </div>
              </div>

              {/* Sourcing Metric Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#00ff88]/10 via-[#070b12] to-[#070b12] border border-[#00ff88]/30 flex items-center justify-between mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">CHINA DISPATCH TIMELINE</div>
                  <div className="text-xs font-bold text-[#00ff88]">7-10 DAYS AIR EXPRESS</div>
                </div>
                <button
                  onClick={() => onOpenRFQ?.('China Direct Sourcing Inquiry')}
                  className="px-3 py-1.5 rounded bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold text-[11px] transition-colors"
                >
                  DISPATCH [↵]
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
