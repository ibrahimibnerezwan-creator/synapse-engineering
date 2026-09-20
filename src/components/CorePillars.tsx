'use client';

import Link from 'next/link';
import { ArrowUpRight, CircuitBoard, BatteryCharging, Globe2 } from 'lucide-react';
import styles from './storefront.module.css';

export default function CorePillars({ onOpenRFQ }: { onOpenRFQ?: (name?: string) => void }) {
  return <section className={styles.shortcuts} aria-label="Engineering services"><div className={`${styles.shell} ${styles.shortcutGrid}`}>
    <button type="button" onClick={() => onOpenRFQ?.('Industrial Automation / PLC Modules')} className={styles.shortcut}><span className={styles.shortcutIcon}><CircuitBoard size={23} strokeWidth={1.5} /></span><span><strong>A part you can depend on.</strong><span>PLC modules & industrial spares</span></span><ArrowUpRight size={18} /></button>
    <Link href="/calculator" className={styles.shortcut}><span className={styles.shortcutIcon}><BatteryCharging size={23} strokeWidth={1.5} /></span><span><strong>Power beyond the grid.</strong><span>Size your solar & battery system</span></span><ArrowUpRight size={18} /></Link>
    <Link href="/sourcing" className={styles.shortcut}><span className={styles.shortcutIcon}><Globe2 size={23} strokeWidth={1.5} /></span><span><strong>Your connection to China.</strong><span>Factory sourcing with Sohel</span></span><ArrowUpRight size={18} /></Link>
  </div></section>;
}
