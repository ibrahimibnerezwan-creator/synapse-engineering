'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrandMark from './BrandMark';

export default function Footer() {
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className="border-t border-[rgba(28,22,18,0.12)] bg-[#ebe2d4] text-[#4a4038] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <BrandMark className="w-8 h-8" />
              <span>
                <span className="block text-[11px] font-semibold tracking-[0.22em] uppercase text-[#1c1612]">Synapse</span>
                <span className="block text-[10px] tracking-[0.16em] uppercase text-[#8a7e72]">Two desks. One corridor.</span>
              </span>
            </Link>
            <p className="leading-relaxed max-w-sm text-[#4a4038]">
              Dhaka desk. Guangdong floor. Video QC before it ships.
            </p>
            <a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer" className="btn-jade px-4 py-2.5">
              WhatsApp +880 1886-113236
            </a>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <h2 className="kicker">Desks</h2>
            <ul className="space-y-2">
              <li><a href="/#catalog-section" className="hover:text-[#1c1612]">Siemens & Schneider</a></li>
              <li><a href="/#catalog-section" className="hover:text-[#1c1612]">HiTHIUM ESS</a></li>
              <li><a href="/#consumer-gadgets" className="hover:text-[#1c1612]">Home gadgets</a></li>
              <li><Link href="/calculator" className="hover:text-[#1c1612]">Battery sizing</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <h2 className="kicker">Corridor</h2>
            <ul className="space-y-2">
              <li><Link href="/sourcing" className="hover:text-[#1c1612]">Plant visits</Link></li>
              <li><Link href="/sourcing" className="hover:text-[#1c1612]">Live video QC</Link></li>
              <li><Link href="/sourcing" className="hover:text-[#1c1612]">Air 7–10 days</Link></li>
              <li><Link href="/admin" className="text-[#8a7e72]">Seller desk</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-3 space-y-3">
            <h2 className="kicker">Stations</h2>
            <div className="space-y-3">
              <p><span className="block text-[#1c1612] font-medium">Dhaka</span>Commercial supply & doorstep</p>
              <p><span className="block text-[#1c1612] font-medium">Guangdong</span>Shenzhen, Dongguan, Ningbo</p>
              <p className="text-xs">synapseengneering@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[rgba(28,22,18,0.12)] flex flex-col sm:flex-row justify-between gap-3 text-[11px] tracking-wide uppercase text-[#8a7e72]">
          <p>© {year} Synapse Engineering & Supply</p>
          <p>Genuine seals · Video QC · Door delivery</p>
        </div>
      </div>
    </footer>
  );
}
