'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

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
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="night relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(243,236,227,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(243,236,227,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-10 pb-16 md:pt-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-7 space-y-6">
            <p className="kicker flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1f6b4a] live-dot" aria-hidden />
              Dhaka desk · Guangdong floor
            </p>

            <h1 className="display text-[3.15rem] sm:text-6xl lg:text-[4.6rem] leading-[0.92] text-[#f3ece3]">
              Your man on
              <br />
              the <em className="italic text-[#b85c38]">floor.</em>
            </h1>

            <p className="bn text-[1.05rem] text-[#c9bdb0]">চীনের কারখানায় আপনার নিজের মানুষ।</p>

            <div className="flex flex-wrap gap-2" aria-label="What you can do">
              <a href="#sohel" className="chip chip-lg chip-jade">
                Video QC
              </a>
              <a
                href="https://wa.me/8801886113236"
                target="_blank"
                rel="noopener noreferrer"
                className="chip chip-lg chip-jade"
              >
                WhatsApp
              </a>
              <button type="button" onClick={() => onOpenRFQ?.()} className="chip chip-lg chip-paper">
                Quote
              </button>
              <a href="#consumer-gadgets" className="chip chip-lg chip-copper">
                COD gadgets
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              <a href="#catalog-section" className="btn-paper px-5 py-4 text-left !justify-start !normal-case !tracking-normal !text-sm font-medium">
                <span>
                  <span className="block text-[10px] tracking-[0.14em] uppercase opacity-80 mb-1">Factory desk</span>
                  PLC · ESS · spares
                </span>
              </a>
              <a href="#consumer-gadgets" className="btn-copper px-5 py-4 text-left !justify-start !normal-case !tracking-normal !text-sm font-medium">
                <span>
                  <span className="block text-[10px] tracking-[0.14em] uppercase opacity-80 mb-1">Home desk</span>
                  Gadgets · COD
                </span>
              </a>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex border border-[rgba(243,236,227,0.18)]">
              <label htmlFor="hero-search" className="sr-only">
                Search part number or gadget
              </label>
              <Search className="w-4 h-4 text-[#8a7e72] ml-3.5 self-center shrink-0" aria-hidden />
              <input
                id="hero-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="6ES7 · LC1K · GaN · HeroEE"
                className="flex-1 bg-transparent text-[#f3ece3] text-sm px-3 py-3.5 focus:outline-none placeholder:text-[#8a7e72]"
              />
              <button type="submit" className="btn-paper px-5 py-3.5 shrink-0">
                Seek
              </button>
            </form>
          </div>

          <aside className="lg:col-span-5 space-y-3">
            <div className="border border-[rgba(243,236,227,0.16)] p-6 bg-[linear-gradient(180deg,rgba(243,236,227,0.04),transparent)]">
              <div className="flex justify-between items-center mb-5">
                <span className="mono text-[10px] tracking-[0.16em] uppercase text-[#b85c38]">Field card / SYN-01</span>
                <span className="stamp">Video QC</span>
              </div>
              <div className="flex gap-4 items-center mb-6">
                <div
                  className="w-[4.5rem] h-[5.5rem] shrink-0 border border-[rgba(243,236,227,0.2)] flex items-end justify-center pb-2 display text-3xl text-[#b85c38]"
                  style={{ background: 'linear-gradient(160deg, #3a2a22, #1a1410)' }}
                  aria-hidden
                >
                  স
                </div>
                <div>
                  <p className="display text-3xl text-[#f3ece3]">Sohel</p>
                  <p className="mono text-[10px] tracking-[0.14em] uppercase text-[#c9bdb0] mt-1">Engineer · Guangdong</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] text-[#c9bdb0] border-t border-[rgba(243,236,227,0.12)] pt-4">
                <div>
                  <dt>Station</dt>
                  <dd className="mono text-[12px] text-[#f3ece3] mt-0.5">Shenzhen / Dongguan</dd>
                </div>
                <div>
                  <dt>Reply</dt>
                  <dd className="mono text-[12px] text-[#f3ece3] mt-0.5">WhatsApp, minutes</dd>
                </div>
                <div>
                  <dt>Seals</dt>
                  <dd className="mono text-[12px] text-[#f3ece3] mt-0.5">Siemens · HiTHIUM</dd>
                </div>
                <div>
                  <dt>Transit</dt>
                  <dd className="mono text-[12px] text-[#f3ece3] mt-0.5">Air 7–10d · Sea 25–35d</dd>
                </div>
              </dl>
            </div>

            <button
              type="button"
              onClick={() => onOpenRFQ?.('HiTHIUM HeroEE 16kWh Battery')}
              className="w-full text-left border border-[rgba(243,236,227,0.16)] p-3 hover:bg-white/5 flex gap-4 items-center"
            >
              <div className="w-20 h-20 shrink-0 studio p-1.5 flex items-center justify-center">
                <img
                  src="https://synapse-engneering.com/wp-content/uploads/2026/03/HiTHIUM-HeroEE-16.png"
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="kicker mb-1">Featured ESS</p>
                <p className="text-sm text-[#f3ece3]">HiTHIUM HeroEE 16</p>
                <p className="text-[11px] text-[#c9bdb0] mt-1">11,000 cycles · 10-year</p>
              </div>
              <span className="btn-copper px-3 py-2 shrink-0">Quote</span>
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
