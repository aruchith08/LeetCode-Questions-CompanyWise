import React from 'react';

interface CompanyWiseLogoProps {
  variant?: 'full' | 'mark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export default function CompanyWiseLogo({
  variant = 'full',
  size = 'md',
  className = '',
  iconClassName = '',
  textClassName = '',
}: CompanyWiseLogoProps) {
  const iconSizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12',
  };

  const textSizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const Mark = (
    <svg
      viewBox="0 0 112 112"
      className={`${iconSizeMap[size]} shrink-0 shadow-2xs ${iconClassName}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Squircle: Midnight Navy in light mode, crisp White in dark mode (as designed in brand system) */}
      <rect
        width="112"
        height="112"
        rx="26"
        className="fill-[#0F1B3D] dark:fill-white transition-colors"
      />
      {/* Amber Gold Peak Dot */}
      <circle cx="56" cy="23" r="8" fill="#F5A524" />
      {/* Three Progression Bars: White in light mode, Midnight Navy in dark mode */}
      <rect
        x="25"
        y="56"
        width="16"
        height="28"
        rx="8"
        className="fill-white dark:fill-[#0F1B3D] transition-colors"
      />
      <rect
        x="48"
        y="39"
        width="16"
        height="45"
        rx="8"
        className="fill-white dark:fill-[#0F1B3D] transition-colors"
      />
      <rect
        x="71"
        y="48"
        width="16"
        height="36"
        rx="8"
        className="fill-white dark:fill-[#0F1B3D] transition-colors"
      />
    </svg>
  );

  if (variant === 'mark') {
    return Mark;
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {Mark}
      <span
        className={`font-bold tracking-tight text-[#0F1B3D] dark:text-white transition-colors ${textSizeMap[size]} ${textClassName}`}
      >
        CompanyWise
      </span>
    </div>
  );
}
