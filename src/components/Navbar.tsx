'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Phone, MessageSquare, Menu, X, Sparkles, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenRFQ?: (productName?: string) => void;
}

export default function Navbar({ onOpenRFQ }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#1a3a5c] flex items-center justify-center text-white font-black shadow-md group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-lg text-[#1a1a1a] tracking-tight flex items-center gap-1.5">
                <span>SYNAPSE</span>
                <span className="text-[11px] text-[#e85d04] font-bold px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                  ENGINEERING
                </span>
              </div>
              <div className="text-[11px] text-[#718096] font-medium">Supply & Direct China Procurement</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#4a5568]">
            <a href="#catalog-section" className="hover:text-[#1a1a1a] transition-colors">
              Industrial Spares
            </a>
            <a href="#consumer-gadgets" className="hover:text-[#e85d04] transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e85d04]" />
              <span>Tech Gadgets</span>
            </a>
            <Link href="/calculator" className="hover:text-[#1a1a1a] transition-colors">
              Solar & Battery
            </Link>
            <Link href="/sourcing" className="hover:text-[#1a1a1a] transition-colors">
              China Sourcing
            </Link>
            <Link href="/admin" className="hover:text-[#718096] transition-colors text-xs text-[#a0aec0]">
              Seller Portal
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://wa.me/8801886113236"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#f5f5f2] hover:bg-[#eeeee8] text-[#4a5568] hover:text-[#1a1a1a] border border-black/[0.06] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#e85d04]" />
              <span>+880 1886-113236</span>
            </a>

            <button
              onClick={() => onOpenRFQ && onOpenRFQ()}
              className="px-5 py-2.5 rounded-xl bg-[#1a3a5c] hover:bg-[#0f2a45] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#f5f5f2] text-[#4a5568] hover:text-[#1a1a1a] border border-black/[0.06]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-black/[0.06] bg-white px-4 pt-3 pb-6 space-y-3 text-left">
          <a href="#catalog-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#4a5568]">Industrial Spares & Automation</a>
          <a href="#consumer-gadgets" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#e85d04]">Daily Tech Gadgets & Electronics</a>
          <Link href="/calculator" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#4a5568]">Solar Battery Sizing Calculator</Link>
          <Link href="/sourcing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#4a5568]">China Sourcing & Video QC</Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-medium text-[#a0aec0]">Seller Portal</Link>
          <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">
            <a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp (+880 1886-113236)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
