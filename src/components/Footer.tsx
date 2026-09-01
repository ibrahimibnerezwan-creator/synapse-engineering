'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Phone, Mail, MapPin, Download, ShieldCheck, MessageSquare, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#06080c] border-t border-[#1a2234] text-slate-400 text-xs">
      {/* Top Banner */}
      <div className="border-b border-[#1a2234] py-8 px-4 bg-[#090e17]/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="text-[10px] mono text-[#00f0ff] font-bold">[FACTORY_UPGRADE_HOTLINE]</div>
            <h4 className="text-base font-bold text-white tracking-tight mt-1">
              Ready to Upgrade Factory Automation or Eliminate Power Outages?
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Connect directly with our engineering team in Dhaka or our procurement desk in Guangdong & Shenzhen.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/8801886113236?text=Hello%20Synapse,%20I%20want%20to%20discuss%20an%20engineering%20requirement."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#00ff88] hover:bg-emerald-300 text-slate-950 font-extrabold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)] mono text-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WHATSAPP_DESK [↵]</span>
            </a>
            <a
              href="https://synapse-engneering.com/wp-content/uploads/2026/04/Synapse-Engineering-Company-Profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#090e17] hover:bg-slate-900 text-slate-200 border border-[#1a2234] flex items-center gap-2 transition-all mono text-xs"
            >
              <Download className="w-4 h-4 text-[#00f0ff]" />
              <span>DOWNLOAD_PROFILE.PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#00f0ff] flex items-center justify-center text-slate-950 font-bold mono">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight mono">
                SYNAPSE<span className="text-[#00f0ff]">::ENG</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 font-light">
              Engineering solutions provider specializing in industrial automation systems, Tier-1 HiTHIUM LiFePO₄ energy storage, and turnkey direct procurement from China.
            </p>
            <div className="pt-2 text-slate-500 font-mono text-[11px]">
              [TRADE_LIC & IMPORT_REG: CERTIFIED]
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3 mono">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">// SOLUTIONS</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#automation" className="hover:text-[#00f0ff] transition-colors">
                  Siemens S7-1500 & S7-1200 PLCs
                </Link>
              </li>
              <li>
                <Link href="/#automation" className="hover:text-[#00f0ff] transition-colors">
                  Schneider Contactors & VFDs
                </Link>
              </li>
              <li>
                <Link href="/#solar" className="hover:text-[#ffaa00] transition-colors">
                  HiTHIUM 16kWh LiFePO₄ Battery Storage
                </Link>
              </li>
              <li>
                <Link href="/#solar" className="hover:text-[#ffaa00] transition-colors">
                  Deye Hybrid Solar Inverters
                </Link>
              </li>
              <li>
                <Link href="/#sourcing" className="hover:text-[#00ff88] transition-colors">
                  Direct China Machine Sourcing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering Sizing */}
          <div className="space-y-3 mono">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">// TOOLS & PORTALS</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/calculator" className="hover:text-[#ffaa00] transition-colors flex items-center gap-1.5">
                  <span>⚡ Solar Load & Battery Sizing Tool</span>
                </Link>
              </li>
              <li>
                <Link href="/#sourcing" className="hover:text-[#00ff88] transition-colors">
                  China QC Video Inspection Process
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-[#00f0ff] transition-colors">
                  Part Number Cross-Reference
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-slate-200 transition-colors font-mono text-[11px]">
                  Internal Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div className="space-y-3 mono">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">// HUBS & DISPATCH</h5>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                <span>+880 1886-113236 (Hotline / WA)</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                <span>sales@synapse-engneering.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                <span>Dhaka Hub: Bangladesh | China: Guangdong & Shenzhen</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-[#1a2234] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] mono text-slate-500">
          <div>
            © {new Date().getFullYear()} SYNAPSE ENGINEERING & SUPPLY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-4">
            <span className="text-[#00ff88]">GENUINE SERIALS GUARANTEED</span>
            <span>•</span>
            <span className="text-[#00f0ff]">CHINA ON-GROUND QC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
