'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Phone, MessageSquare, Mail, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#08090d] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight">SYNAPSE ENGINEERING</span>
                <div className="text-[10px] text-amber-400 font-semibold">Direct China Sourcing & Industrial Supply</div>
              </div>
            </Link>

            <p className="text-slate-400 font-light leading-relaxed max-w-sm">
              Your direct personal bridge to China’s manufacturing heartlands. We supply authentic Siemens PLCs, HiTHIUM 11,000-cycle battery packs, and curated tech gadgets with on-ground video inspection before shipment.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/8801886113236"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: +880 1886-113236</span>
              </a>
            </div>
          </div>

          {/* Col 2: Divisions */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Divisions</h4>
            <ul className="space-y-2 font-light">
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Siemens S7 PLCs & I/O
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Schneider Electric Switchgear
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  HiTHIUM LiFePO₄ Energy Storage
                </a>
              </li>
              <li>
                <a href="#consumer-gadgets" className="hover:text-amber-400 transition-colors">
                  Daily Tech Gadgets & GaN
                </a>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-white transition-colors">
                  Solar Battery Sizing Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: China Sourcing */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">China Sourcing</h4>
            <ul className="space-y-2 font-light">
              <li>
                <Link href="/sourcing" className="hover:text-white transition-colors">
                  On-Ground Factory Visits
                </Link>
              </li>
              <li>
                <Link href="/sourcing" className="hover:text-white transition-colors">
                  Live Video QC Inspection
                </Link>
              </li>
              <li>
                <Link href="/sourcing" className="hover:text-white transition-colors">
                  Air Cargo Express (7-10 Days)
                </Link>
              </li>
              <li>
                <Link href="/sourcing" className="hover:text-white transition-colors">
                  Sea Freight Container (25-35d)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-slate-400 text-slate-500">
                  Seller Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: On-Ground Hubs */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Operations Hubs</h4>
            <div className="space-y-3 font-light text-slate-400">
              <div>
                <div className="font-medium text-slate-200">Dhaka Desk (Bangladesh)</div>
                <p className="text-[11px]">Commercial Supply & Delivery Desk</p>
              </div>

              <div>
                <div className="font-medium text-slate-200">Guangdong Desk (China)</div>
                <p className="text-[11px]">Shenzhen, Dongguan & Ningbo Factory Inspection Hub</p>
              </div>

              <div className="text-[11px] text-slate-400">
                Email: <strong className="text-white">synapseengneering@gmail.com</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-light">
          <div>
            © {new Date().getFullYear()} Synapse Engineering & Supply. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Direct China Factory Procurement</span>
            <span>100% Genuine Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
