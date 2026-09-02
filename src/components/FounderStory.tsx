'use client';

import React from 'react';

const FACTS = [
  {
    kicker: '01',
    title: 'Video QC',
    body: 'You approve the floor on camera before it packs.',
    chip: 'chip-jade',
  },
  {
    kicker: '02',
    title: 'OEM price',
    body: 'Chinese at the plant. No Alibaba desk.',
    chip: 'chip-copper',
  },
  {
    kicker: '03',
    title: 'Door delivery',
    body: 'Air 7–10d or sea 25–35d, cleared.',
    chip: 'chip-ink',
  },
];

export default function FounderStory() {
  return (
    <section id="sohel" className="scroll-mt-24 py-16 md:py-20 border-t border-[rgba(28,22,18,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 space-y-5">
            <p className="kicker">Letter from the floor</p>
            <h2 className="display text-4xl sm:text-5xl leading-[1.05] text-[#1c1612]">
              A named engineer.
            </h2>
            <p className="bn text-[#4a4038]">আমি নিজে কারখানায় তদারকি করি। না দেখে আপনাকে আমদানি করতে হয় না।</p>
            <p className="display text-2xl text-[#1c1612]">— Sohel</p>
            <a
              href="https://wa.me/8801886113236?text=Hi%20Sohel,%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-jade px-5 py-3.5"
            >
              WhatsApp Sohel
            </a>
          </div>

          <div className="lg:col-span-7 border-t border-[rgba(28,22,18,0.12)]">
            {FACTS.map((f) => (
              <article key={f.kicker} className="grid sm:grid-cols-12 gap-4 py-6 border-b border-[rgba(28,22,18,0.12)] items-start">
                <p className="sm:col-span-3 pt-0.5">
                  <span className={`chip ${f.chip}`}>{f.title}</span>
                </p>
                <p className="sm:col-span-9 text-sm text-[#4a4038] leading-relaxed">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
