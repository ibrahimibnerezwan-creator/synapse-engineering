'use client';

import React from 'react';
import Link from 'next/link';

interface CorePillarsProps {
  onOpenRFQ?: (productName?: string) => void;
}

const DESKS = [
  {
    kicker: 'Automation',
    title: 'PLC & spares',
    body: 'Siemens, Schneider, Omron. Genuine seals.',
    action: 'Quote a part',
    href: null as string | null,
    rfq: 'Industrial Automation / PLC Modules',
    chip: 'chip-ink',
    bar: 'bar-ink',
    btn: 'btn-ink',
  },
  {
    kicker: 'Storage',
    title: 'HiTHIUM ESS',
    body: '11,000 cycles. Size it, then quote.',
    action: 'Size a battery',
    href: '/calculator',
    rfq: null,
    chip: 'chip-jade',
    bar: 'bar-jade',
    btn: 'btn-jade',
  },
  {
    kicker: 'Sourcing',
    title: 'Fetch from China',
    body: 'Nameplate → plant visit → crate.',
    action: 'Send a nameplate',
    href: '/sourcing',
    rfq: null,
    chip: 'chip-kiln',
    bar: 'bar-kiln',
    btn: 'btn-copper',
  },
];

export default function CorePillars({ onOpenRFQ }: CorePillarsProps) {
  return (
    <section className="py-16 md:py-20 border-t border-[rgba(28,22,18,0.12)] bg-[#fffdf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-4xl sm:text-5xl leading-[1.05]">Three floors.</h2>
          <p className="kicker">PLC · ESS · Fetch</p>
        </div>

        <div className="divide-y divide-[rgba(28,22,18,0.12)] border-y border-[rgba(28,22,18,0.12)]">
          {DESKS.map((d) => (
            <div key={d.kicker} className={`grid lg:grid-cols-12 gap-6 py-8 items-center ${d.bar} pl-4`}>
              <p className="lg:col-span-2">
                <span className={`chip ${d.chip}`}>{d.kicker}</span>
              </p>
              <div className="lg:col-span-6 space-y-1">
                <h3 className="display text-3xl">{d.title}</h3>
                <p className="text-sm text-[#4a4038]">{d.body}</p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                {d.href ? (
                  <Link href={d.href} className={`${d.btn} px-5 py-3`}>
                    {d.action}
                  </Link>
                ) : (
                  <button type="button" onClick={() => d.rfq && onOpenRFQ?.(d.rfq)} className={`${d.btn} px-5 py-3`}>
                    {d.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
