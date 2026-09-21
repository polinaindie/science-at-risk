import { useEffect, useState } from 'react';

export interface BackToTopProps {
  /** Scroll threshold in CSS px before the button appears (≈ 1 viewport). */
  threshold?: number;
  /** Accessible name (UA default). */
  label?: string;
  className?: string;
}

/**
 * Floating “back to top” control for long articles.
 * WCAG 2.2 AA: button semantics, aria-label, ≥44×44 target, visible focus.
 */
export function BackToTop({
  threshold,
  label = 'Повернутися нагору',
  className = '',
}: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getThreshold = () => threshold ?? window.innerHeight;

    const onScroll = () => {
      setVisible(window.scrollY >= getThreshold());
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  const scrollTop = () => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label={label}
      className={`fixed bottom-6 right-6 z-40 flex min-h-11 min-w-11 items-center justify-center border-2 border-brand-black bg-brand-white text-brand-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black ${className}`.trim()}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 4 L10 16 M4 10 L10 4 L16 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}

export default BackToTop;
