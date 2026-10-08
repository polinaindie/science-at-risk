import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { MobileNav } from '@/components/MobileNav';
import { wrapperClass } from '@/components/Layout';

export interface NavEntryV6 {
  label: string;
  href: string;
}

export interface SiteHeaderV6Props {
  items?: NavEntryV6[];
  /**
   * 0 on the hero, 1 once the reader has left it. The "!!!" on the left gives
   * way to the wordmark as it lands; nothing else in the row moves.
   */
  progress?: number;
  /** The ground and ink of the block the bar is standing on. */
  ground?: string;
  inverted?: boolean;
  locale?: string;
  localeHref?: string;
  homeHref?: string;
  /** The page measures this row to know where the wordmark must land. */
  innerRef?: Ref<HTMLDivElement>;
  className?: string;
}

/** The wordmark in the bar: 197px wide like the reference (Noto Serif 24px), 18.84 tall at the asset's aspect. */
export const BAR_WORDMARK_H_V6 = 18.84;

/** Figma v4_Final (299:7388): the masthead stands 26px off the top and is 42
 *  tall, the same in both states. */
const PAD_TOP = 26;
const ROW_H = 42;

/** The sections of "Stolen museum story" (341:756), in one row. */
export const navItemsV6: NavEntryV6[] = [
  { label: 'Scientists', href: '/experts' },
  { label: 'Societies', href: '/societies' },
  { label: 'Research', href: '/research' },
  { label: 'Stories', href: '/stories' },
  { label: 'Infrastructure', href: '/infrastructures' },
  { label: 'About', href: '/about' },
  { label: 'Contacts', href: '/contacts' },
];

/**
 * The bar of scienceatrisk.org's home page, with this site's sections: it
 * stands over every block, takes that block's ground and ink, and has the same
 * row in every state — a mark or the wordmark on the left, the seven
 * sections in the middle, the language switch on the right.
 *
 * The sections and the wordmark only share a row from 1280px; below that
 * they sit behind the menu button.
 */
export function SiteHeaderV6({
  items = navItemsV6,
  progress = 0,
  ground = 'bg-transparent',
  inverted = false,
  locale = 'EN',
  localeHref = '/uk',
  homeHref = '/',
  innerRef,
  className = '',
}: SiteHeaderV6Props) {
  const id = useId();
  const menuId = `${id}-menu`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';

  const p = Math.min(1, Math.max(0, progress));
  // The hero's own wordmark flies the whole way and is swapped for this copy
  // in one frame at the end, where the two are the same picture in the same
  // place.
  const landed = p >= 1;
  const ink = inverted ? 'text-white' : 'text-brand-black';
  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const current = <span className="underline underline-offset-4">{isUa ? 'УКР' : 'ENG'}</span>;
  const other = (
    <a href={localeHref} className={`satr-hover-underline no-underline ${ink} ${focusRing}`}>
      {isUa ? 'ENG' : 'УКР'}
    </a>
  );

  return (
    <header
      className={`sticky top-0 transition-colors duration-300 ${
        menuOpen ? 'z-[70]' : 'z-50'
      } ${ground} ${ink} ${className}`.trim()}
    >
      <div
        ref={innerRef}
        className={`${wrapperClass} relative flex items-center justify-between gap-3 md:gap-6`}
        style={{ paddingTop: PAD_TOP, height: PAD_TOP + ROW_H }}
      >
        {/* The mark and the wordmark share one slot, so the sections never
            move when one gives way to the other. The slot is as wide as the
            wordmark at every size — left at nothing below `lg`, the wordmark
            ran on over the language switch on a phone. */}
        <div className="relative w-[148px] shrink-0 md:w-[197px]" style={{ height: ROW_H }}>
          <a
            href={homeHref}
            aria-label="Science At Risk"
            className={`satr-dim absolute left-0 top-1/2 -translate-y-1/2 font-serif text-[28px] leading-[42px] tracking-[-0.02em] no-underline transition-opacity duration-200 ${ink} ${focusRing}`}
            style={{ opacity: landed ? 0 : 1, pointerEvents: landed ? 'none' : undefined }}
            tabIndex={landed ? -1 : undefined}
            aria-hidden={landed ? true : undefined}
          >
            !!!
          </a>
          <a
            href={homeHref}
            aria-label="Science At Risk"
            className={`satr-dim absolute left-0 top-1/2 block -translate-y-1/2 overflow-hidden no-underline transition-opacity duration-200 ${focusRing}`}
            style={{ opacity: landed ? 1 : 0 }}
            tabIndex={landed ? undefined : -1}
            aria-hidden={landed ? undefined : true}
          >
            {/* Set in type, as the reference does: Noto Serif 24px, -0.36px —
                18px on a phone, which is what leaves room on a 320px screen
                for the language switch and the menu beside it. */}
            <span
              className={`block whitespace-nowrap font-serif text-[18px] font-normal leading-[18px] tracking-[-0.27px] md:text-[24px] md:leading-[24px] md:tracking-[-0.36px] ${ink}`}
            >
              SC!ENCE AT R!SK!
            </span>
          </a>
        </div>

        <nav aria-label={isUa ? 'Розділи' : 'Sections'} className="absolute left-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:block" style={{ top: PAD_TOP + ROW_H / 2 }}>
          <ul className="m-0 flex list-none items-center gap-[32px] p-0">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`satr-hover-underline whitespace-nowrap font-mono text-[16px] leading-[26px] no-underline ${ink} ${focusRing}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <p className="m-0 whitespace-nowrap font-mono text-text1-mobile md:text-[18px] md:leading-[24px] md:tracking-normal">
            {isUa ? other : current}
            <span aria-hidden>/</span>
            {isUa ? current : other}
          </p>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className={`satr-dim flex min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 xl:hidden ${focusRing}`}
          >
            <img
              src="/assets/ui/hamburger-dark.svg"
              alt=""
              width={30}
              height={22}
              className={`h-[22px] w-[30px] ${inverted ? 'brightness-0 invert' : ''}`}
            />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id={menuId} className="fixed inset-0 z-[60] flex justify-end xl:hidden">
          <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => setMenuOpen(false)} />
          <div className="relative h-full">
            <MobileNav
              open
              items={items}
              tone={inverted ? 'dark' : 'light'}
              locale={isUa ? 'UA' : 'EN'}
              onClose={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default SiteHeaderV6;
