import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { MobileNav, navItemsEn, navItemsUk, type NavItem } from '@/components/MobileNav';
import { HeaderBarV4 } from '@/sandbox/HeaderBarV4';
import { SearchOverlayV4, type SearchOverlayV4Props } from '@/sandbox/SearchOverlayV4';

const HERO_WORDMARK_SELECTOR = '[data-hero-wordmark]';
/** Matches the spacer in this component. */
const HEADER_CHROME_HEIGHT_PX = 66;

export interface SiteHeaderV4Props {
  locale?: string;
  onLocaleClick?: () => void;
  tone?: 'light' | 'dark';
  items?: NavItem[];
  social?: NavItem[];
  search?: Omit<SearchOverlayV4Props, 'open' | 'onOpenChange' | 'returnFocusRef' | 'locale'>;
  /** Off when the page sizes its own first section against the fixed chrome. */
  withSpacer?: boolean;
  className?: string;
}

/**
 * Fork of src/components/SiteHeader/SiteHeader.tsx for the V4 experiment.
 * Diff: carries the site-wide expert search alongside the menu, plus the `/`
 * and Cmd/Ctrl-K shortcuts and a `withSpacer` switch.
 *
 * Menu and search are mutually exclusive — two overlays in one fixed bar would
 * otherwise fight over Escape and over the backdrop.
 */
export function SiteHeaderV4({
  locale = 'EN',
  onLocaleClick,
  tone = 'light',
  items,
  social,
  search,
  withSpacer = true,
  className = '',
}: SiteHeaderV4Props) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [brandMode, setBrandMode] = useState<'mark' | 'wordmark'>('wordmark');
  const menuId = useId();
  const searchId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const navItems = items ?? (isUa ? navItemsUk : navItemsEn);
  const closeMenuLabel = isUa ? 'Закрити меню' : 'Close menu';

  const close = useCallback(() => setOpen(false), []);

  // Closing the search swaps the bar back to its three zones, which builds a
  // fresh Search button — so the focus has to be restored after that render,
  // not inside the overlay, where the ref still points at the old node.
  const wasSearchOpen = useRef(false);
  useEffect(() => {
    if (wasSearchOpen.current && !searchOpen) searchButtonRef.current?.focus();
    wasSearchOpen.current = searchOpen;
  }, [searchOpen]);

  const openMenu = useCallback(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setSearchOpen(false);
    setOpen(true);
  }, []);

  const openSearch = useCallback(() => {
    setOpen(false);
    setSearchOpen(true);
  }, []);

  // Escape closes the menu; the search handles its own two-step Escape on the
  // input, so only the menu is routed here.
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

    const root = dialogRef.current;
    const focusable = root?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // `/` and Cmd/Ctrl-K open the search — but never while the reader is typing
  // somewhere else on the page.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable === true;

      const slash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey;
      const cmdK = e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey);

      if ((slash && !typing) || cmdK) {
        e.preventDefault();
        openSearch();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openSearch]);

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

  // Lock body scroll while the menu is open, and while the search covers the
  // screen on a phone.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
      {withSpacer ? <div className="h-[66px] w-full shrink-0" aria-hidden /> : null}
      <div className={`fixed inset-x-0 top-0 z-50 ${bg} ${className}`.trim()}>
        <div className="mx-auto flex max-w-[1360px] items-center px-6 py-3 md:px-10">
          <HeaderBarV4
            locale={locale}
            onLocaleClick={onLocaleClick}
            tone={tone}
            brandMode={brandMode}
            onMenuClick={open ? close : openMenu}
            menuButtonRef={burgerRef}
            menuExpanded={open}
            menuControls={menuId}
            onSearchClick={searchOpen ? () => setSearchOpen(false) : openSearch}
            searchButtonRef={searchButtonRef}
            searchExpanded={searchOpen}
            searchControls={searchId}
            className="w-full"
            searchSlot={
              <div id={searchId} className="w-full">
                <SearchOverlayV4
                  {...search}
                  open={searchOpen}
                  onOpenChange={setSearchOpen}
                  locale={locale}
                />
              </div>
            }
          />
        </div>

        {/* Without JavaScript the bar has no Search button to press, so the
            plain GET form the live site uses is rendered instead. */}
        <noscript>
          <div className="mx-auto w-full max-w-[1360px] px-6 pb-3 md:px-10">
            <form role="search" action={search?.action ?? '/experts'} method="get">
              <label className="font-mono text-breadcrumbs" htmlFor="satr-v4-noscript-search">
                {isUa ? 'Наукова галузь або імʼя' : 'Scientific field or name'}
              </label>
              <input
                id="satr-v4-noscript-search"
                name={search?.queryName ?? 'search'}
                type="search"
                className="ml-3 border-b border-brand-black bg-transparent"
              />
              <button type="submit" className="ml-3 font-mono text-breadcrumbs underline">
                {isUa ? 'Знайти' : 'Search'}
              </button>
            </form>
          </div>
        </noscript>

        {open ? (
          <div className="fixed inset-0 z-[60] flex justify-end" role="presentation">
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

export default SiteHeaderV4;
