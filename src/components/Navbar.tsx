'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import BrandMark from './BrandMark';
import styles from './storefront.module.css';

interface NavbarProps { onOpenRFQ?: (productName?: string) => void; tone?: 'night' | 'paper' }
const LINKS = [
  { href: '/#catalog-section', label: 'Factory' },
  { href: '/#consumer-gadgets', label: 'Home & gadgets' },
  { href: '/calculator', label: 'Solar & energy' },
  { href: '/sourcing', label: 'China sourcing' },
];

export default function Navbar({ onOpenRFQ }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => { if (wide.matches) setOpen(false); };
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => { window.removeEventListener('keydown', onKey); wide.removeEventListener('change', onWide); };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`${styles.shell} ${styles.nav}`}>
        <Link href="/" className={styles.brand} aria-label="Synapse Engineering & Supply home">
          <BrandMark className="w-9 h-9" />
          <span><span className={styles.brandName}>Synapse</span><span className={styles.brandSub}>Engineering & Supply</span></span>
        </Link>
        <nav className={styles.navLinks} aria-label="Main navigation">
          {LINKS.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div className={styles.navActions}>
          <a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-3">WhatsApp</a>
          <button type="button" onClick={() => onOpenRFQ?.()} className="btn-ink px-5 py-3">Get a quote <ArrowUpRight size={15} aria-hidden className="hidden sm:block" /></button>
          <button ref={toggle} type="button" className={styles.menuToggle} aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(value => !value)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" className={styles.mobileNav} aria-label="Mobile navigation">
        {LINKS.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
        <div className={styles.mobileActions}>
          <a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer" className="btn-jade px-5 py-3">WhatsApp Sohel</a>
          <Link href="/admin" onClick={() => setOpen(false)} className="btn-ghost px-5 py-3">Seller login</Link>
        </div>
      </nav>}
    </header>
  );
}
