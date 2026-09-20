'use client';

import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import styles from './storefront.module.css';
import Image from 'next/image';

export type HeroSlide = { src: string; alt: string; label: string; note: string };

type Props = {
  slides: HeroSlide[];
  tone: 'night' | 'copper';
  label: string;
  intervalMs?: number;
  children: React.ReactNode;
};

export default function HeroSlideshow({ slides, tone, label, intervalMs = 6000, children }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || interacting || reducedMotion || slides.length < 2) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex(i => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, interacting, reducedMotion, slides.length, intervalMs]);

  return (
    <article className={`${styles.heroPanel} ${tone === 'copper' ? styles.heroPanelHome : ''}`}
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
      {slides.map((slide, i) => (
        <Image key={slide.src} src={slide.src} alt={i === index ? slide.alt : ''}
          aria-hidden={i !== index} width={960} height={600} sizes="(max-width: 767px) 100vw, 50vw" loading="eager" decoding="async"
          fetchPriority={i === 0 ? 'high' : 'auto'}
          className={`${styles.heroPhoto} ${i !== index ? styles.heroPhotoHidden : ''}`} />
      ))}
      {children}
      <div className={styles.heroControls} role="group" aria-label={label}>
        <p className={`${styles.heroCaption} bn`} lang="bn">{slides[index].label}</p>
        <div className={styles.slideControls}>
          {slides.map((slide, i) => (
            <button key={slide.src} type="button" aria-label={`Show image ${i + 1}: ${slide.label}`}
              aria-pressed={i === index} onClick={() => { setIndex(i); setPaused(true); }}>
              <span className={styles.slideDot} />
            </button>
          ))}
          {!reducedMotion && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? `Play ${label}` : `Pause ${label}`}>
            {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
          </button>}
        </div>
      </div>
    </article>
  );
}
