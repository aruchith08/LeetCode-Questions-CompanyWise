import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface GlobeInstance {
  dispose: () => void;
  setAutoRotate: (enabled: boolean) => void;
  setSpeed: (speed: number) => void;
  setDarkMode: (enabled?: boolean) => void;
  reset: () => void;
  autoRotate: boolean;
  darkMode?: boolean;
}

export type GlobeConstructor = new (
  element: HTMLElement,
  options?: {
    autoRotate?: boolean;
    speed?: number;
    yaw?: number;
    pitch?: number;
    draggable?: boolean;
    darkMode?: boolean;
    textureUrl?: string;
    onReady?: () => void;
  }
) => GlobeInstance;

declare global {
  interface Window {
    CompanyWiseGlobe?: GlobeConstructor;
    __companywiseGlobeLoad?: Promise<GlobeConstructor>;
  }
}

interface CompanyWiseGlobeProps {
  className?: string;
  style?: React.CSSProperties;
  autoRotate?: boolean;
  speed?: number;
  draggable?: boolean;
  darkMode?: boolean;
}

export default function CompanyWiseGlobe({
  className = '',
  style,
  autoRotate = true,
  speed = 0.17,
  draggable = false,
  darkMode,
}: CompanyWiseGlobeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<GlobeInstance | null>(null);
  const { isDark } = useTheme();

  // Effective dark mode state: explicit prop if provided, otherwise application theme state
  const effectiveDark = darkMode !== undefined ? darkMode : isDark;

  // Reactively notify globe instance whenever theme state changes
  useEffect(() => {
    if (globeInstanceRef.current) {
      globeInstanceRef.current.setDarkMode(effectiveDark);
    }
  }, [effectiveDark]);

  // Secondary listener: Watch class mutations on <html> element for immediate synchronization
  useEffect(() => {
    function checkTheme() {
      const isHtmlDark = document.documentElement.classList.contains('dark');
      if (globeInstanceRef.current) {
        globeInstanceRef.current.setDarkMode(darkMode !== undefined ? darkMode : isHtmlDark);
      }
    }

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('companywise-theme-change', checkTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('companywise-theme-change', checkTheme);
    };
  }, [darkMode]);

  useEffect(() => {
    if (!rootRef.current) return;

    let cancelled = false;

    const initGlobe = () => {
      if (cancelled || !rootRef.current) return;

      const loadScript: Promise<GlobeConstructor> = window.CompanyWiseGlobe
        ? Promise.resolve(window.CompanyWiseGlobe)
        : (window.__companywiseGlobeLoad ||= new Promise<GlobeConstructor>((resolve, reject) => {
            const existingScript = document.querySelector('script[src="/companywise-globe.js"]');
            if (existingScript) {
              existingScript.addEventListener('load', () => {
                if (window.CompanyWiseGlobe) {
                  resolve(window.CompanyWiseGlobe);
                } else {
                  reject(new Error('CompanyWiseGlobe not defined after script load'));
                }
              });
              existingScript.addEventListener('error', () => reject(new Error('Failed to load globe script')));
              return;
            }

            const script = document.createElement('script');
            script.src = '/companywise-globe.js';
            script.async = true;
            script.onload = () => {
              if (window.CompanyWiseGlobe) {
                resolve(window.CompanyWiseGlobe);
              } else {
                reject(new Error('CompanyWiseGlobe was not found on window'));
              }
            };
            script.onerror = () => reject(new Error('Could not load /companywise-globe.js'));
            document.head.appendChild(script);
          }));

      loadScript
        .then((Widget: GlobeConstructor) => {
          if (cancelled || !rootRef.current || !Widget) return;

          const removeFallback = () => {
            if (cancelled || !rootRef.current) return;
            const fallback = rootRef.current.querySelector<HTMLElement>('.companywise-globe-fallback');
            if (fallback) {
              fallback.remove();
            }
          };

          const instance = new Widget(rootRef.current, {
            autoRotate,
            speed,
            draggable,
            darkMode: darkMode !== undefined ? darkMode : undefined,
            onReady: removeFallback,
          });
          globeInstanceRef.current = instance;
          // WebP texture data URI is already in memory: remove fallback immediately
          removeFallback();
        })
        .catch(err => {
          console.warn('CompanyWise 3D Globe initialization notice:', err);
        });
    };

    // Initialize globe immediately on mount
    initGlobe();

    return () => {
      cancelled = true;
      if (globeInstanceRef.current) {
        globeInstanceRef.current.dispose();
        globeInstanceRef.current = null;
      }
    };
  }, [autoRotate, speed, draggable, darkMode]);

  return (
    <div
      ref={rootRef}
      className={`relative select-none pointer-events-none ${className}`}
      style={style}
      aria-label="3D network globe visualization"
      role="img"
    >
      <picture className="companywise-globe-fallback absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <source media="(max-width: 640px)" srcSet="/globe-fallback-mobile.webp" type="image/webp" />
        <source srcSet="/globe-fallback.webp" type="image/webp" />
        <img
          src="/globe-fallback.png"
          alt="3D network globe visualization"
          width={460}
          height={460}
          decoding="async"
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      </picture>
    </div>
  );
}
