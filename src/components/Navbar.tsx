'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Phone, MessageSquare, Menu, X, Sparkles, ShieldCheck, Sun, Layers, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenRFQ?: (productName?: string) => void;
}

export default function Navbar({ onOpenRFQ }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0b0d11]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                <span>SYNAPSE</span>
                <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  ENGINEERING
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Supply & Direct China Procurement</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#catalog-section" className="hover:text-white transition-colors">
              Industrial Spares
            </a>
            <a href="#consumer-gadgets" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tech Gadgets</span>
            </a>
            <Link href="/calculator" className="hover:text-white transition-colors">
              Solar & Battery Sizing
            </Link>
            <Link href="/sourcing" className="hover:text-white transition-colors">
              China Sourcing
            </Link>
            <Link href="/admin" className="hover:text-slate-400 transition-colors text-xs text-slate-500">
              Seller Portal
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://wa.me/8801886113236"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#181d26] hover:bg-slate-800 text-slate-200 hover:text-white border border-white/[0.08] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+880 1886-113236</span>
            </a>

            <button
              onClick={() => onOpenRFQ && onOpenRFQ()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#12151c] text-slate-300 hover:text-white border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-white/[0.08] bg-[#0b0d11] px-4 pt-3 pb-6 space-y-3 text-left">
          <a
            href="#catalog-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200"
          >
            Industrial Spares & Automation
          </a>
          <a
            href="#consumer-gadgets"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-amber-400"
          >
            Daily Tech Gadgets & Electronics
          </a>
          <Link
            href="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200"
          >
            Solar Battery Sizing Calculator
          </Link>
          <Link
            href="/sourcing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200"
          >
            China Sourcing & Video QC
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-medium text-slate-500"
          >
            Seller Portal
          </Link>

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <a
              href="https://wa.me/8801886113236"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp (+880 1886-113236)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
