'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import DeskClocks from './DeskClocks';
import HeroSlideshow, { type HeroSlide } from './HeroSlideshow';

interface HeroSectionProps {
  onOpenRFQ?: (productName?: string) => void;
  onSearch?: (term: string) => void;
}

const FACTORY_SLIDES: HeroSlide[] = [
  {
    src: '/hero/factory-panel.jpg',
    alt: 'ইন্ডাস্ট্রিয়াল কন্ট্রোল প্যানেলের ভেতরে মডিউল ও ওয়্যারিং',
    label: 'প্যানেল ও PLC',
    note: 'Siemens · Schneider অরিজিনাল',
  },
  {
    src: '/hero/factory-ess.jpg',
    alt: 'সোলার প্যানেলের পাশে কন্টেইনার এনার্জি স্টোরেজ',
    label: 'সোলার ও ESS',
    note: 'HiTHIUM · ১১,০০০+ সাইকেল',
  },
  {
    src: '/hero/factory-floor.jpg',
    alt: 'কারখানার প্রোডাকশন লাইনে কর্মীরা',
    label: 'কারখানা পরিদর্শন',
    note: 'লাইভ ভিডিও QC',
  },
];

const HOME_SLIDES: HeroSlide[] = [
  {
    src: '/hero/home-power.jpg',
    alt: 'ক্যাম্পিং টেবিলে পোর্টেবল পাওয়ার স্টেশন',
    label: 'পোর্টেবল পাওয়ার',
    note: 'লোডশেডিং · ক্যাম্পিং',
  },
  {
    src: '/hero/home-gan.jpg',
    alt: 'GaN ফাস্ট চার্জার',
    label: 'ফাস্ট চার্জিং',
    note: 'GaN ১৪০W · ল্যাপটপ ও ফোন',
  },
  {
    src: '/hero/home-smart.jpg',
    alt: 'স্মার্ট স্পিকার ও ফোনে হোম অ্যাপ',
    label: 'স্মার্ট হোম',
    note: 'অ্যাপেই লাইট ও এসি',
  },
  {
    src: '/hero/home-cod.jpg',
    alt: 'কুরিয়ার পার্সেল হস্তান্তর',
    label: 'ক্যাশ অন ডেলিভারি',
    note: 'দেখে তারপর টাকা',
  },
];

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
    <section
      id="hero"
      className="relative flex flex-col h-[calc(100svh-65px)] md:h-[calc(100svh-69px)] overflow-hidden"
    >
      <h1 className="sr-only">Factory desk and Home desk — Synapse Engineering</h1>

      <div className="grid flex-1 min-h-0 grid-rows-2 lg:grid-rows-1 lg:grid-cols-[1fr_6px_1fr]">
        <article className="door-factory flex flex-col gap-3 sm:gap-4 px-5 py-4 sm:px-8 sm:py-7 lg:px-10 lg:py-10 min-h-0 overflow-y-auto">
          <div>
            <p className="kicker flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1f6b4a] live-dot" aria-hidden />
              Factory desk · mill floor
            </p>
            <div className="mt-2">
              <DeskClocks tone="night" />
            </div>
            <h2 className="display mt-2 sm:mt-3 text-[clamp(2.15rem,7vw,5.2rem)] leading-[0.88] text-[#f3ece3]">
              Factory
              <br />
              <em className="italic text-[#b85c38]">desk.</em>
            </h2>
            <p className="bn mt-3 sm:mt-4 text-[1.05rem] sm:text-lg text-[#f3ece3]">
              কারখানার ডেস্ক। জেনুইন PLC, ESS ও খুচরা যন্ত্রাংশ।
            </p>
            <p className="bn mt-2 hidden sm:block text-[0.98rem] sm:text-base font-medium text-[#c9bdb0]">
              নামপ্লেটের ছবি পাঠান, ভিডিও টেস্ট দেখে কনফার্ম করুন।
            </p>
          </div>

          <HeroSlideshow slides={FACTORY_SLIDES} tone="night" label="Factory desk — product use cases" />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onOpenRFQ?.()} className="btn-paper px-5 py-3.5">
                Quote a mill part
              </button>
              <a href="#sohel" className="stamp hidden sm:inline-flex">
                Video QC
              </a>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex border border-[rgba(243,236,227,0.22)]">
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
                className="flex-1 min-w-0 bg-transparent text-[#f3ece3] text-sm px-3 py-3 focus:outline-none placeholder:text-[#8a7e72]"
              />
              <button type="submit" className="btn-paper px-4 sm:px-5 py-3 shrink-0">
                Seek
              </button>
            </form>
            <p className="hidden sm:block mono text-[10px] tracking-[0.14em] uppercase text-[#c9bdb0]">
              স Sohel · Guangdong · Air 7–10d · Sea 25–35d
            </p>
          </div>
        </article>

        <div className="hidden lg:block bg-[#f3ece3]" aria-hidden />

        <article className="door-home flex flex-col gap-3 sm:gap-4 px-5 py-4 pb-16 sm:px-8 sm:py-7 lg:px-10 lg:py-10 lg:pb-10 min-h-0 overflow-y-auto">
          <div>
            <p className="inline-block bg-[#f3ece3] text-[#1c1612] mono text-[10px] tracking-[0.16em] uppercase px-2 py-1">
              Home desk · doorstep COD
            </p>
            <div className="mt-2 inline-block bg-[#f3ece3] px-2 py-1">
              <DeskClocks tone="copper" />
            </div>
            <h2 className="display mt-2 sm:mt-3 text-[clamp(2.15rem,7vw,5.2rem)] leading-[0.88] text-[#fff8f3]">
              Home
              <br />
              <em className="italic text-[#1c1612]">desk.</em>
            </h2>
            <p className="bn mt-3 sm:mt-4 text-[1.05rem] sm:text-lg text-[#fff8f3] font-semibold">
              ঘরের ডেস্ক। গ্যাজেট, ক্যাশ অন ডেলিভারি।
            </p>
            <p className="bn mt-2 hidden sm:block text-[0.98rem] sm:text-base font-semibold text-[#fff8f3]">
              দেখে তারপর টাকা দেবেন, Steadfast ঘরে পৌঁছে দেবে।
            </p>
          </div>

          <HeroSlideshow slides={HOME_SLIDES} tone="copper" label="Home desk — product use cases" />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <a href="#consumer-gadgets" className="btn-ink px-5 py-3.5">
                See gadgets · COD
              </a>
              <a
                href="https://wa.me/8801886113236"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-paper px-5 py-3.5"
              >
                WhatsApp
              </a>
            </div>
            <p className="mono text-[10px] tracking-[0.14em] uppercase text-[#fff8f3] opacity-90">
              ঢাকা · সারা দেশ · COD বা bKash
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
