'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Phone, Mail, MapPin, Download, ShieldCheck, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Top Banner */}
      <div className="border-b border-slate-900 py-8 px-4 bg-slate-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h4 className="text-base font-bold text-white">
              Ready to Upgrade Factory Automation or Reduce Power Outages?
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Speak directly with our technical team in Dhaka or our procurement desk in China.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/8801886113236?text=Hello%20Synapse,%20I%20want%20to%20discuss%20an%20engineering%20requirement."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Engineering Desk
            </a>
            <a
              href="https://synapse-engneering.com/wp-content/uploads/2026/04/Synapse-Engineering-Company-Profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Company Profile (PDF)
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
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                SYNAPSE <span className="text-sky-400">ENGINEERING</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 font-light">
              Engineering solutions provider specializing in industrial automation systems, Tier-1 HiTHIUM LiFePO₄ energy storage, and turnkey direct procurement from China.
            </p>
            <div className="pt-2 text-slate-500 font-mono text-[11px]">
              Trade License & Import Registration Certified
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Core Solutions</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/#automation" className="hover:text-sky-400 transition-colors">
                  Siemens S7-1500 & S7-1200 PLCs
                </Link>
              </li>
              <li>
                <Link href="/#automation" className="hover:text-sky-400 transition-colors">
                  Schneider Contactors & VFDs
                </Link>
              </li>
              <li>
                <Link href="/#solar" className="hover:text-amber-400 transition-colors">
                  HiTHIUM 16kWh LiFePO₄ Battery Storage
                </Link>
              </li>
              <li>
                <Link href="/#solar" className="hover:text-amber-400 transition-colors">
                  Deye Hybrid Solar Inverters
                </Link>
              </li>
              <li>
                <Link href="/#sourcing" className="hover:text-emerald-400 transition-colors">
                  Direct China Machine Sourcing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering Sizing */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Tools & Portals</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/calculator" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>⚡ Solar Load & Battery Sizing Tool</span>
                </Link>
              </li>
              <li>
                <Link href="/#sourcing" className="hover:text-emerald-400 transition-colors">
                  China QC Video Inspection Process
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-sky-400 transition-colors">
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
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Contact & Offices</h5>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>+880 1886-113236 (Direct Hotline / WhatsApp)</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>sales@synapse-engneering.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Dhaka Hub: Bangladesh | China Hub: Guangdong & Shenzhen</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Synapse Engineering & Supply. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <span>Guaranteed Authentic Components</span>
            <span>•</span>
            <span>China On-Ground Inspection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
