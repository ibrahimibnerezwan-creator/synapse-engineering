'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import BrandMark from './BrandMark';

interface NavbarProps {
  onOpenRFQ?: (productName?: string) => void;
  tone?: 'night' | 'paper';
}

const LINKS = [
  { href: '/#catalog-section', label: 'Spares' },
  { href: '/#consumer-gadgets', label: 'Gadgets' },
  { href: '/calculator', label: 'ESS' },
  { href: '/sourcing', label: 'Sourcing' },
];

export default function Navbar({ onOpenRFQ, tone = 'paper' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(tone === 'night');

  useEffect(() => {
    if (tone !== 'night') {
      setOverHero(false);
      return;
    }
    const hero = document.getElementById('hero');
    if (!hero) {
      setOverHero(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [tone]);

  const night = tone === 'night' && overHero;

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
        night
          ? 'bg-[#16120f]/90 border-[rgba(243,236,227,0.12)] text-[#f3ece3]'
          : 'bg-[#f3ece3]/90 border-[rgba(28,22,18,0.12)] text-[#1c1612]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-[4.25rem]">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark className="w-8 h-8" variant={night ? 'paper' : 'ink'} />
            <span className="text-left leading-tight">
              <span className="block text-[11px] font-semibold tracking-[0.22em] uppercase">
                Synapse
              </span>
              <span className={`block text-[10px] tracking-[0.16em] uppercase ${night ? 'text-[#c9bdb0]' : 'text-[#8a7e72]'}`}>
                Engineering & Supply
              </span>
            </span>
          </Link>

          <nav className={`hidden lg:flex items-center gap-8 text-[11px] font-medium tracking-[0.14em] uppercase ${night ? 'text-[#c9bdb0]' : 'text-[#4a4038]'}`}>
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={night ? 'hover:text-[#f3ece3]' : 'hover:text-[#1c1612]'}>
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className={night ? 'text-[#8a7e72] hover:text-[#c9bdb0]' : 'text-[#8a7e72] hover:text-[#4a4038]'}>
              Seller
            </Link>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <a
              href="https://wa.me/8801886113236"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-jade px-3 py-2.5"
            >
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => onOpenRFQ?.()}
              className={night ? 'btn-paper px-4 py-2.5' : 'btn-ink px-4 py-2.5'}
            >
              Quote
            </button>
          </div>

          <button
            type="button"
            className="sm:hidden p-2"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`sm:hidden border-t px-4 pt-3 pb-5 space-y-1 ${night ? 'border-[rgba(243,236,227,0.12)] bg-[#16120f]' : 'border-[rgba(28,22,18,0.12)] bg-[#f3ece3]'}`}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[#8a7e72]">
            Seller desk
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRFQ?.();
            }}
            className="btn-ink w-full py-3 mt-3"
          >
            Quote
          </button>
          <a
            href="https://wa.me/8801886113236"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-jade w-full py-3 mt-2"
          >
            WhatsApp the desk
          </a>
        </div>
      )}
    </header>
  );
}
