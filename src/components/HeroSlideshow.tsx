'use client';

import React, { useEffect, useState } from 'react';

export type HeroSlide = {
  src: string;
  alt: string;
  label: string;
  note: string;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
  tone: 'night' | 'copper';
  label: string;
  intervalMs?: number;
};

export default function HeroSlideshow({ slides, tone, label, intervalMs = 5200 }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => window.clearInterval(id);
  }, [paused, slides.length, intervalMs]);

  const night = tone === 'night';
  const frame = night ? 'border-[rgba(243,236,227,0.22)]' : 'border-[rgba(255,248,243,0.30)]';
  const caption = night ? 'bg-[rgba(22,18,15,0.72)] text-[#f3ece3]' : 'bg-[rgba(28,22,18,0.74)] text-[#fff8f3]';
  const dotIdle = night ? 'bg-[rgba(243,236,227,0.4)]' : 'bg-[rgba(255,248,243,0.45)]';
  const dotOn = night ? 'bg-[#f3ece3]' : 'bg-[#fff8f3]';
  const current = slides[index];

  return (
    <div
      className={`relative w-full flex-1 min-h-[112px] overflow-hidden border ${frame}`}
      role="group"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ''}
          loading={i === 0 ? 'eager' : 'lazy'}
          aria-hidden={i === index ? undefined : true}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent" aria-hidden />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-2 sm:p-3">
        <div className={`${caption} px-2.5 py-1.5 max-w-[80%]`}>
          <p className="mono text-[9px] sm:text-[10px] tracking-[0.14em] uppercase opacity-90">{current.label}</p>
          <p className="bn text-[11px] sm:text-[13px] leading-snug mt-0.5">{current.note}</p>
        </div>
        <div className="flex shrink-0">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`ছবি ${i + 1}: ${slide.label}`}
              aria-current={i === index}
              className="w-6 h-6 flex items-center justify-center"
            >
              <span className={`block w-2 h-2 ${i === index ? dotOn : dotIdle}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
