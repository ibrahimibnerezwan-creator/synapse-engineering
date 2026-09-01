'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Sun, ShieldCheck, Phone, FileText, Menu, X, MessageSquare } from 'lucide-react';

interface NavbarProps {
  onOpenRFQ?: (productName?: string) => void;
}

export default function Navbar({ onOpenRFQ }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-sky-500/20 bg-slate-950/80 backdrop-blur-md">
      {/* Top Engineering Trust Bar */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-amber-950/60 border-b border-sky-500/10 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              On-Ground China QC & Direct Factory Sourcing
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              Siemens • Schneider • HiTHIUM LiFePO₄ Energy Storage
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/8801886113236?text=Hello%20Synapse%20Engineering,%20I%20need%20a%20quotation%20for%20industrial%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp: +880 1886-113236
            </a>
            <a
              href="tel:+8801886113236"
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Hotline
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center p-2.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-full h-full text-white" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                SYNAPSE <span className="text-sky-400">ENGINEERING</span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                Automation • Solar ESS • China Sourcing
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/#automation"
              className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-sky-400" />
              Automation & PLCs
            </Link>
            <Link
              href="/#solar"
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Sun className="w-4 h-4 text-amber-400" />
              Solar & LiFePO₄ ESS
            </Link>
            <Link
              href="/#sourcing"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              China Sourcing Portal
            </Link>
            <Link
              href="/calculator"
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1"
            >
              <Sun className="w-3.5 h-3.5" />
              Solar Sizing Calculator
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenRFQ?.()}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Request Quote (RFQ)
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#automation"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-sky-400 font-medium"
          >
            Industrial Automation & PLCs
          </Link>
          <Link
            href="/#solar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400 font-medium"
          >
            Solar & HiTHIUM LiFePO₄ Energy Storage
          </Link>
          <Link
            href="/#sourcing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-emerald-400 font-medium"
          >
            China Sourcing & Direct Procurement
          </Link>
          <Link
            href="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-amber-400 font-medium"
          >
            ⚡ Solar & Battery Sizing Calculator
          </Link>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRFQ?.();
              }}
              className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-center flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Request Official Quotation (RFQ)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
