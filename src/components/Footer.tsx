import Link from 'next/link';
import BrandMark from './BrandMark';
import { ArrowUpRight } from 'lucide-react';
import styles from './storefront.module.css';

export default function Footer() {
  return <footer className={styles.footer}><div className={styles.shell}>
    <div className={styles.footerTop}><p className={styles.footerTitle}>Let’s make<br />the right connection.</p><a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer" className="btn-paper">Start a conversation <ArrowUpRight size={18} /></a></div>
    <div className={styles.footerGrid}>
      <div><Link href="/" aria-label="Synapse Engineering home"><span className="flex gap-3 items-center mb-4"><BrandMark className="w-9 h-9" variant="paper" /><span className="text-2xl font-medium">Synapse</span></span></Link><p>Engineering & Supply<br />Dhaka desk. China sourcing.</p><a href="mailto:synapseengneering@gmail.com">synapseengneering@gmail.com</a><a href="https://wa.me/8801886113236" target="_blank" rel="noopener noreferrer">+880 1886-113236</a></div>
      <div><h2>Explore the desks</h2><Link href="/#catalog-section">Industrial supply</Link><Link href="/#consumer-gadgets">Home & gadgets</Link><Link href="/calculator">Solar & battery sizing</Link><Link href="/sourcing">Source from China</Link></div>
      <div><h2>A personal connection</h2><Link href="/#sohel">Meet Sohel</Link><Link href="/sourcing">Factory visits & video QC</Link><Link href="/admin">Seller login</Link></div>
    </div>
    <div className={styles.footerBottom}><p>© {new Date().getFullYear()} Synapse Engineering & Supply</p><p>Two desks. One connection.</p></div>
  </div></footer>;
}
