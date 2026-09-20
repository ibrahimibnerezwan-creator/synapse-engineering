import styles from './storefront.module.css';

export default function BrandsMarquee() {
  return <section className={styles.brands} aria-label="Brands in our catalogue"><div className={`${styles.shell} ${styles.brandRow}`}>
    <p>Across our supply desk</p><div className={styles.brandList}><span>SIEMENS</span><span>Schneider Electric</span><span>HiTHIUM</span><span>Tuya Smart</span></div>
  </div></section>;
}
