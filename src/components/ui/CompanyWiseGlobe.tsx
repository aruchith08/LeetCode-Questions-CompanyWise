import React, { useEffect, useRef } from 'react';

export interface GlobeInstance {
  dispose: () => void;
  setAutoRotate: (enabled: boolean) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  autoRotate: boolean;
}

export type GlobeConstructor = new (
  element: HTMLElement,
  options?: {
    autoRotate?: boolean;
    speed?: number;
    yaw?: number;
    pitch?: number;
    draggable?: boolean;
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
}

export default function CompanyWiseGlobe({
  className = '',
  style,
  autoRotate = true,
  speed = 0.17,
  draggable = false,
}: CompanyWiseGlobeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    let globeInstance: GlobeInstance | null = null;
    let cancelled = false;

    // Load /companywise-globe.js dynamically if not already present on window
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
        globeInstance = new Widget(rootRef.current, {
          autoRotate,
          speed,
          draggable,
        });
      })
      .catch(err => {
        console.warn('CompanyWise 3D Globe initialization notice:', err);
      });

    return () => {
      cancelled = true;
      if (globeInstance) {
        globeInstance.dispose();
        globeInstance = null;
      }
    };
  }, [autoRotate, speed, draggable]);

  return (
    <div
      ref={rootRef}
      className={`relative select-none pointer-events-none ${className}`}
      style={style}
      aria-label="3D network globe visualization"
      role="img"
    />
  );
}
