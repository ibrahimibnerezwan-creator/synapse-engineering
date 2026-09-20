import { Video, PackageCheck, MessagesSquare } from 'lucide-react';
import styles from './storefront.module.css';
import Image from 'next/image';

export default function FounderStory() {
  return <section id="sohel" className={`${styles.section} ${styles.founder}`}><div className={`${styles.shell} ${styles.founderGrid}`}>
    <figure className={styles.founderPhoto}><Image src="/hero/factory-floor.jpg" alt="An industrial production line illustrating factory sourcing" width={960} height={600} sizes="(max-width: 767px) 100vw, 50vw" loading="lazy" /><figcaption>Factory sourcing · illustrative photograph</figcaption></figure>
    <div className={styles.founderCopy}><p className={styles.sectionLabel}>Meet your sourcing partner</p><h2 className={styles.sectionTitle}>A real person.<br />On the factory floor.</h2>
      <p className="bn" lang="bn">আমি নিজে কারখানায় তদারকি করি। না দেখে আপনাকে আমদানি করতে হয় না।</p><p className={styles.signature}>Sohel</p>
      <div className={styles.founderFacts}><span><Video size={17} /> Video inspection</span><span><PackageCheck size={17} /> Factory sourcing</span><span><MessagesSquare size={17} /> Direct contact</span></div>
      <a href="https://wa.me/8801886113236?text=Hi%20Sohel%2C%20I%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" className="btn-jade">Talk to Sohel</a>
    </div>
  </div></section>;
}
