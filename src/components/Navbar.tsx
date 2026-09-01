'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Sun, ShieldCheck, Phone, FileText, Menu, X, MessageSquare, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenRFQ?: (productName?: string) => void;
}

export default function Navbar({ onOpenRFQ }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 hud-panel bg-[#06080c]/90 border-b border-[#1a2234] backdrop-blur-xl">
      {/* Top Telemetry Strip */}
      <div className="border-b border-[#1a2234]/80 px-4 py-1.5 text-[11px] mono text-slate-400 bg-[#090d15]/90">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#00ff88] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] live-telemetry-dot" />
              [SYS: ACTIVE // CHINA ON-GROUND QC DESK]
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400">
              SIEMENS • SCHNEIDER • HiTHIUM 11,000-CYCLE LiFePO₄
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/8801886113236?text=Hello%20Synapse%20Engineering,%20I%20need%20a%20quotation%20for%20industrial%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#00ff88] hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WA: +880 1886-113236</span>
            </a>
            <a
              href="tel:+8801886113236"
              className="flex items-center gap-1 text-[#00f0ff] hover:text-cyan-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>DESK</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#00f0ff]/20 via-[#0b0f17] to-slate-900 border border-[#00f0ff]/40 flex items-center justify-center p-2.5 shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:border-[#00f0ff] transition-all">
              <Cpu className="w-full h-full text-[#00f0ff]" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-wider text-white mono flex items-center gap-1.5">
                SYNAPSE<span className="text-[#00f0ff]">::ENG</span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-widest uppercase mono">
                AUT.SYS // ENERGY ESS // CHINA QC
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 mono text-xs">
            <Link
              href="/#automation"
              className="text-slate-300 hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 group"
            >
              <span className="text-[#00f0ff] opacity-70 group-hover:opacity-100">// 01</span>
              <span>AUTOMATION & PLCs</span>
            </Link>
            <Link
              href="/#solar"
              className="text-slate-300 hover:text-[#ffaa00] transition-colors flex items-center gap-1.5 group"
            >
              <span className="text-[#ffaa00] opacity-70 group-hover:opacity-100">// 02</span>
              <span>SOLAR & LiFePO₄ ESS</span>
            </Link>
            <Link
              href="/#sourcing"
              className="text-slate-300 hover:text-[#00ff88] transition-colors flex items-center gap-1.5 group"
            >
              <span className="text-[#00ff88] opacity-70 group-hover:opacity-100">// 03</span>
              <span>CHINA SOURCING</span>
            </Link>
            <Link
              href="/calculator"
              className="px-3 py-1.5 rounded bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/30 hover:bg-[#ffaa00]/20 transition-all flex items-center gap-1 font-bold"
            >
              <span>⚡ ESS SIZER</span>
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenRFQ?.()}
              className="mono text-xs px-5 py-2.5 rounded bg-[#00f0ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>REQUEST_RFQ [↵]</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1a2234] bg-[#06080c]/98 px-6 pt-4 pb-8 space-y-4 mono text-xs">
          <Link
            href="/#automation"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-[#00f0ff]"
          >
            // 01. INDUSTRIAL AUTOMATION & PLCs
          </Link>
          <Link
            href="/#solar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-[#ffaa00]"
          >
            // 02. HiTHIUM 11,000-CYCLE LiFePO₄ ESS
          </Link>
          <Link
            href="/#sourcing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-[#00ff88]"
          >
            // 03. CHINA SOURCING & QC DESK
          </Link>
          <Link
            href="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#ffaa00] font-bold"
          >
            ⚡ INTERACTIVE ESS SIZER
          </Link>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRFQ?.();
              }}
              className="w-full py-3 rounded bg-[#00f0ff] text-slate-950 font-extrabold text-center flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>REQUEST_RFQ [↵]</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
