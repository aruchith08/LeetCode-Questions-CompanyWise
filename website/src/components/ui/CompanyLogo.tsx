import React, { useState } from 'react';

interface CompanyLogoProps {
  slug: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function CompanyLogo({ slug, name = '', size = 'md', className = '' }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);
  const [useFallbackPng, setUseFallbackPng] = useState(false);

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl',
  };

  const paddingMap = {
    xs: 'p-0.5',
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
    xl: 'p-2.5',
  };

  const pixelDimensions: Record<string, number> = {
    xs: 24,
    sm: 32,
    md: 44,
    lg: 56,
    xl: 80,
  };

  const rawSlug = (slug || '').toLowerCase().trim().replace(/_/g, '-');
  const cleanSlug = rawSlug === 'meta' ? 'facebook' : rawSlug;

  const baseContainer = `${sizeMap[size]} rounded-md bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] flex items-center justify-center shrink-0 overflow-hidden ${className}`;

  if (hasError || !cleanSlug) {
    const initials = (name || cleanSlug)
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();

    return (
      <div className={`${baseContainer} font-mono dark:font-serif dark:font-normal font-semibold text-slate-700 dark:text-[#FAF9F5] bg-slate-100 dark:bg-[#1F1E1D] quick-jump-letter`}>
        {initials || cleanSlug.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const imageSrc = useFallbackPng
    ? `${basePath}/logos/png/${cleanSlug}.png?v=20261025`
    : `${basePath}/logos/svg/${cleanSlug}.svg?v=20261025`;

  const handleImageError = () => {
    if (!useFallbackPng) {
      setUseFallbackPng(true);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={baseContainer}>
      <img
        src={imageSrc}
        alt={`${name || cleanSlug} logo`}
        width={pixelDimensions[size] || 44}
        height={pixelDimensions[size] || 44}
        className={`w-full h-full object-contain ${paddingMap[size]}`}
        onError={handleImageError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
