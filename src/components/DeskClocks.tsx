'use client';

import React, { useEffect, useState } from 'react';

function formatZone(now: Date, timeZone: string) {
  return new Intl.DateTimeFormat('bn-BD', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
}

type DeskClocksProps = {
  tone: 'night' | 'copper';
};

export default function DeskClocks({ tone }: DeskClocksProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const dhaka = now ? formatZone(now, 'Asia/Dhaka') : '—:—';
  const shenzhen = now ? formatZone(now, 'Asia/Shanghai') : '—:—';
  const dim = tone === 'night' ? 'text-[#c9bdb0]' : 'text-[#1c1612]';

  return (
    <p className={`mono text-[10px] tracking-[0.12em] ${dim}`} aria-live="polite">
      <span className="bn tracking-normal">ঢাকা</span> {dhaka}
      <span className="mx-1.5 opacity-50" aria-hidden>
        ·
      </span>
      <span className="bn tracking-normal">শেনজেন</span> {shenzhen}
    </p>
  );
}
