import { useState, useEffect, useCallback } from 'react';

function getStoredTheme(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('companywise-theme') || localStorage.getItem('codewise-theme');
  return stored ? stored === 'dark' : true;
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => getStoredTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.className = 'bg-[#262624] text-[#FAF9F5]';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.className = 'bg-[#F7F8FB] text-neutral-900';
    }
    localStorage.setItem('companywise-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('codewise-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    function handleThemeEvent(e: Event) {
      const custom = e as CustomEvent<{ isDark: boolean }>;
      if (custom.detail && typeof custom.detail.isDark === 'boolean') {
        setIsDark(custom.detail.isDark);
      }
    }
    window.addEventListener('companywise-theme-change', handleThemeEvent);
    return () => window.removeEventListener('companywise-theme-change', handleThemeEvent);
  }, []);

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('companywise-theme-change', { detail: { isDark: next } }));
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}
