import React from 'react';

interface BrandMarkProps {
  className?: string;
  variant?: 'ink' | 'paper';
}

export default function BrandMark({ className = 'w-8 h-8', variant = 'ink' }: BrandMarkProps) {
  const fill = variant === 'paper' ? '#f3ece3' : '#1c1612';
  const copper = '#b85c38';

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="11" width="10" height="10" fill={copper} />
      <rect x="20" y="13" width="10" height="10" fill={fill} opacity="0.92" />
      <path d="M12 16h8" stroke={copper} strokeWidth="1.75" />
    </svg>
  );
}
