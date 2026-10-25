import React, { useState } from 'react';

interface CompanyLogoProps {
  slug: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function CompanyLogo({ slug, name = '', size = 'md', className = '' }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

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

  const rawSlug = (slug || '').toLowerCase().trim().replace(/_/g, '-');
  const cleanSlug = rawSlug === 'meta' ? 'facebook' : rawSlug;

  const baseContainer = `${sizeMap[size]} rounded-md bg-white dark:bg-[#17191E] border border-slate-200 dark:border-[#282B35] flex items-center justify-center shrink-0 overflow-hidden ${className}`;

  if (hasError || !cleanSlug) {
    const initials = (name || cleanSlug)
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();

    return (
      <div className={`${baseContainer} font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#252832]`}>
        {initials || cleanSlug.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const lightSrc = `${basePath}/logos/png/${cleanSlug}.png`;
  const darkSrc = `${basePath}/logos/png-on-dark/${cleanSlug}.png`;

  return (
    <div className={`${baseContainer} ${paddingMap[size]}`}>
      {/* Light mode logo */}
      <img
        src={cleanSlug === 'google' ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzQyODVGNCIgZD0iTTIyLjU2IDEyLjI1YzAtLjc4LS4wNy0xLjUzLS4yLTIuMjVIMTJ2NC4yNmg1LjkyYy0uMjYgMS4zNy0xLjA0IDIuNTMtMi4yMSAzLjMxdjIuNzdoMy41N2MyLjA4LTEuOTIgMy4yOC00Ljc0IDMuMjgtOC4wOXoiLz48cGF0aCBmaWxsPSIjMzRBODUzIiBkPSJNMTIgMjNjMi45NyAwIDUuNDYtLjk4IDcuMjgtMi42NmwtMy41Ny0yLjc3Yy0uOTguNjYtMi4yMyAxLjA2LTMuNzEgMS4wNi0yLjg2IDAtNS4yOS0xLjkzLTYuMTYtNC41M0gyLjE4djIuODRDMy45OSAyMC41MyA3LjcgMjMgMTIgMjN6Ii8+PHBhdGggZmlsbD0iI0ZCQkMwNSIgZD0iTTUuODQgMTQuMDljLS4yMi0uNjYtLjM1LTEuMzYtLjM1LTIuMDlzLjEzLTEuNDMuMzUtMi4wOVY3LjA2SDIuMThDMS40MyA4LjU1IDEgMTAuMjIgMSAxMnMuNDMgMy40NSAxLjE4IDQuOTRsMi44NS0yLjIyLjgxLS42M3oiLz48cGF0aCBmaWxsPSIjRUE0MzM1IiBkPSJNMTIgNS4zOGMxLjYyIDAgMy4wNi41NiA0LjIxIDEuNjRsMy4xNS0zLjE1QzE3LjQ1IDIuMDkgMTQuOTcgMSAxMiAxIDcuNyAxIDMuOTkgMy40NyAyLjE4IDcuMDZsMy42NiAyLjg0Yy44Ny0yLjYgMy4zLTQuNTIgNi4xNi00LjUyeiIvPjwvc3ZnPg==" : lightSrc}
        alt={`${name || cleanSlug} logo`}
        className="w-full h-full object-contain dark:hidden"
        loading="lazy"
        onError={() => setHasError(true)}
      />
      {/* Dark mode logo (adapted for high contrast on dark backgrounds) */}
      <img
        src={darkSrc}
        alt={`${name || cleanSlug} logo`}
        className="w-full h-full object-contain hidden dark:block"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
