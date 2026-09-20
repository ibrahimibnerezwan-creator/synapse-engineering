'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import DeskClocks from './DeskClocks';
import HeroSlideshow, { type HeroSlide } from './HeroSlideshow';
import styles from './storefront.module.css';

interface HeroSectionProps {
  onOpenRFQ?: (productName?: string) => void;
  onSearch?: (term: string) => void;
}

const FACTORY_SLIDES: HeroSlide[] = [
  {
    src: '/hero/factory-panel.jpg',
    alt: 'ইন্ডাস্ট্রিয়াল কন্ট্রোল প্যানেলের ভেতরে মডিউল ও ওয়্যারিং',
    label: 'প্যানেল ও PLC',
    note: 'Siemens · Schneider',
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
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch?.(searchTerm.trim());
  };

  return (
    <section id="hero" className={styles.hero} aria-label="Factory and Home desks">
      <h1 className="sr-only">Synapse Engineering. For your factory. For your home.</h1>
      <div className={styles.heroPanels}>
        <HeroSlideshow slides={FACTORY_SLIDES} tone="night" label="Factory desk imagery">
          <div className={styles.heroTop}><span>Engineering & industrial supply</span></div>
          <h2 className={styles.heroTitle}>Factory.</h2>
          <p className={styles.heroSummary}>The parts that keep<br />your business moving.</p>
          <p className={styles.heroBangla} lang="bn">কারখানার ডেস্ক। জেনুইন PLC, ESS ও খুচরা যন্ত্রাংশ।</p>
          <div className={styles.heroActions}>
            <button type="button" onClick={() => onOpenRFQ?.()} className="btn-paper px-6 py-3.5">Request a quote <ArrowUpRight size={17} aria-hidden /></button>
            <a href="#catalog-section">Explore industrial supply</a>
          </div>
        </HeroSlideshow>
        <HeroSlideshow slides={HOME_SLIDES} tone="copper" label="Home desk imagery" intervalMs={6500}>
          <div className={styles.heroTop}><span>Everyday technology, delivered</span></div>
          <h2 className={styles.heroTitle}>Home.</h2>
          <p className={styles.heroSummary}>A little smarter.<br />A lot more possibility.</p>
          <p className={styles.heroBangla} lang="bn">ঘরের ডেস্ক। গ্যাজেট, ক্যাশ অন ডেলিভারি।</p>
          <div className={styles.heroActions}>
            <a href="#consumer-gadgets" className="btn-paper px-6 py-3.5">Shop home & gadgets <ArrowUpRight size={17} aria-hidden /></a>
            <a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
          </div>
        </HeroSlideshow>
      </div>
      <div className={`${styles.shell} ${styles.heroSearch}`}>
        <form className={styles.searchForm} onSubmit={handleSearch} role="search">
          <Search size={20} aria-hidden />
          <label htmlFor="hero-search" className="sr-only">Search part number or gadget</label>
          <input id="hero-search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Find a part, brand or gadget…" type="search" />
          <button type="submit">Search</button>
        </form>
        <div><DeskClocks tone="night" /></div>
      </div>
    </section>
  );
}
