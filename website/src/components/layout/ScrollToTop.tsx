import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Automatically scrolls window to top on route pathname changes,
 * and handles anchor hash navigation even if lazy-loaded content
 * takes time to mount into the DOM.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const targetId = hash.replace(/^#/, '');

    // Fast path: element is already in DOM
    const immediateEl = document.getElementById(targetId);
    if (immediateEl) {
      immediateEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Lazy path: wait for suspended / lazy-loaded component to mount
    let cancelled = false;
    const startTime = performance.now();
    const timeoutMs = 1500;

    function checkAndScroll() {
      if (cancelled) return;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (performance.now() - startTime < timeoutMs) {
        requestAnimationFrame(checkAndScroll);
      } else {
        // Fallback if target element doesn't exist
        window.scrollTo(0, 0);
      }
    }

    const rafId = requestAnimationFrame(checkAndScroll);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [pathname, hash]);

  return null;
}
