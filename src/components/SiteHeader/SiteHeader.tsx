import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { Header } from '@/components/Header';
import { MobileNav, navItemsEn, navItemsUk, type NavItem } from '@/components/MobileNav';

const HERO_WORDMARK_SELECTOR = '[data-hero-wordmark]';
/** Matches fixed header spacer in this component. */
const HEADER_CHROME_HEIGHT_PX = 66;

export interface SiteHeaderProps {
  locale?: string;
  onLocaleClick?: () => void;
  tone?: 'light' | 'dark';
  items?: NavItem[];
  social?: NavItem[];
  className?: string;
}

/**
 * Site chrome pinned to the viewport for the whole scroll
 * (position:fixed — sticky would unstick at the end of its containing block).
 * Close via close button, Escape, or backdrop — not on scroll.
 */
export function SiteHeader({
  locale = 'EN',
  onLocaleClick,
  tone = 'light',
  items,
  social,
  className = '',
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [brandMode, setBrandMode] = useState<'mark' | 'wordmark'>('wordmark');
  const menuId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const navItems = items ?? (isUa ? navItemsUk : navItemsEn);
  const closeMenuLabel = isUa ? 'Закрити меню' : 'Close menu';

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  // Escape closes; restore focus to burger.
  useEffect(() => {
    if (!open) {
      previouslyFocused.current?.focus?.();
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // Focus first focusable in dialog.
    const root = dialogRef.current;
    const focusable = root?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // Focus trap inside dialog.
  const onDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Lock body scroll while open (does not close on scroll).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Homepage: !!! while hero wordmark sits below the header; wordmark once it scrolls past.
  // Inner pages without `[data-hero-wordmark]` always use the wordmark.
  useEffect(() => {
    let mutationObserver: MutationObserver | undefined;
    let heroTarget: Element | null = null;

    const syncBrandMode = () => {
      if (!heroTarget) {
        setBrandMode('wordmark');
        return;
      }
      const { top } = heroTarget.getBoundingClientRect();
      setBrandMode(top >= HEADER_CHROME_HEIGHT_PX ? 'mark' : 'wordmark');
    };

    const connect = () => {
      heroTarget = document.querySelector(HERO_WORDMARK_SELECTOR);
      if (!heroTarget) {
        setBrandMode('wordmark');
        return false;
      }
      syncBrandMode();
      return true;
    };

    const onScroll = () => syncBrandMode();

    if (!connect()) {
      mutationObserver = new MutationObserver(() => {
        if (connect()) mutationObserver?.disconnect();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const bg = tone === 'dark' ? 'bg-brand-black' : 'bg-brand-white';

  return (
    <>
      {/* In-flow spacer so fixed chrome does not cover page content */}
      <div className="h-[66px] w-full shrink-0" aria-hidden />
      <div className={`fixed inset-x-0 top-0 z-50 ${bg} ${className}`.trim()}>
        <div className="mx-auto flex max-w-[1360px] items-center px-6 py-3 md:px-10">
          <Header
            locale={locale}
            onLocaleClick={onLocaleClick}
            tone={tone}
            brandMode={brandMode}
            onMenuClick={open ? close : openMenu}
            menuButtonRef={burgerRef}
            menuExpanded={open}
            menuControls={menuId}
            className="w-full"
          />
        </div>

        {open ? (
          <div
            className="fixed inset-0 z-[60] flex justify-end"
            role="presentation"
          >
            <button
              type="button"
              className="absolute inset-0 border-0 bg-black/40"
              aria-label={closeMenuLabel}
              onClick={close}
            />
            <div
              ref={dialogRef}
              id={menuId}
              onKeyDown={onDialogKeyDown}
              className="relative z-[61] h-full"
            >
              <MobileNav
                open
                tone={tone}
                locale={locale}
                items={navItems}
                social={social}
                onClose={close}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default SiteHeader;
