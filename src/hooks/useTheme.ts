import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('companywise-theme') || localStorage.getItem('codewise-theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.className = 'bg-[#111215] text-neutral-100';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.className = 'bg-[#F7F8FB] text-neutral-900';
    }
    localStorage.setItem('companywise-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('codewise-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => setIsDark(prev => !prev), []);

  return { isDark, toggle };
}
