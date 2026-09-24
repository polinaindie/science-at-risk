import { useEffect, useId, useRef, useState, type CSSProperties, type Ref } from 'react';
import { MobileNav } from '@/components/MobileNav';
import { wrapperClass } from '@/components/Layout';

export interface NavEntryV5 {
  label: string;
  href: string;
  /** Optional tally beside the label; the Figma frames show none. */
  count?: number;
}

export interface SiteHeaderV5Props {
  items?: NavEntryV5[];
  /**
   * 0 at the top of the page, 1 once the hero has scrolled away. Everything
   * that moves between the two states reads from this, so the wordmark and the
   * search travel with the scroll instead of snapping at a threshold.
   */
  progress?: number;
  /** Sits in the slot the wordmark flies into, and leaves as it arrives. */
  tagline?: string;
  /**
   * The ground and the ink the bar takes when the block beneath it is not one
   * of the two the scroll drives. Every block on the page hands these over, so
   * the bar reads as part of whatever it is standing on rather than as a black
   * band left behind by the stories.
   */
  ground?: string;
  inverted?: boolean;
  locale?: string;
  localeHref?: string;
  homeHref?: string;
  /** Fired by the word "Search" at rest — the page points it at the hero's
   *  own field, which is the one on screen at that moment. */
  onSearchClick?: () => void;
  /** The page measures this row to know where the hero's pieces must land. */
  innerRef?: Ref<HTMLDivElement>;
  className?: string;
}

/** The wordmark's size once it has landed: 20px tall, which at the asset's
 *  own aspect is 210 wide. Wider than the frame's 202 because our SVG carries
 *  a little more side bearing, and a narrower box clipped the closing "!". */
export const BAR_WORDMARK_H = 20;
const WORDMARK_W = 210;

/** The bar does not change height: the reference holds the same 46px stand-off
 *  in both states, and the row below it is what moves. */
const PAD_TOP = 46;

/** Figma node 94:10484 — five sections, now behind the menu button. */
export const navItemsV5: NavEntryV5[] = [
  { label: 'Scientists', href: '/experts' },
  { label: 'Research', href: '/research' },
  { label: 'Infrastructure', href: '/infrastructures' },
  { label: 'Stories', href: '/stories' },
  { label: 'About', href: '/about' },
];

/**
 * Sticky chrome with two states rather than two components.
 *
 * At rest the bar carries the tagline on the left and Search / locale / menu
 * on the right; the wordmark and the search field belong to the hero below.
 * As the hero scrolls away each of those two flies into the bar, and what it
 * lands on is not empty space but a stand-in that leaves as it arrives — the
 * wordmark takes the tagline's place, the field takes the word "Search". That
 * is the whole idea of this header: every slot is occupied at both ends, so
 * nothing on the row ever jumps.
 *
 * Past the halfway point the bar inverts to black, because by then it is
 * sitting over the black stories listing.
 */
export function SiteHeaderV5({
  items = navItemsV5,
  progress = 0,
  tagline = "Research & expertise from Ukraine's scientific frontline",
  ground,
  inverted,
  locale = 'EN',
  localeHref = '/uk',
  homeHref = '/',
  onSearchClick,
  innerRef,
  className = '',
}: SiteHeaderV5Props) {
  const id = useId();
  const menuId = `${id}-menu`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';

  const p = Math.min(1, Math.max(0, progress));
  const isDark = inverted ?? p > 0.5;
  const groundClass = ground ?? (isDark ? 'bg-brand-black' : 'bg-brand-accent-blue');
  const interactive = p > 0.95;
  /** The hero's own wordmark flies the whole way and is swapped for this
      copy in one frame at the end, where the two are the same picture in the
      same place. Anything gradual here shows two wordmarks, or dims the one
      there should be. */
  const landed = p >= 1 ? 1 : 0;
  /** The stand-ins clear the slot in the first half, well before the real
      thing arrives, so the two are never both legible. */
  const standIn = 1 - Math.min(1, p * 2);

  const text = isDark ? 'text-white' : 'text-brand-black';
  const muted = isDark ? 'text-white/60' : 'text-brand-muted';

  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

  // Escape closes the menu and hands focus back to the button that opened it.
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

  // Inline because the value is continuous; a class can only hold the two ends.
  const wordmarkStyle: CSSProperties = { opacity: landed };

  const menuLabel = isUa
    ? menuOpen
      ? 'Закрити меню'
      : 'Відкрити меню'
    : menuOpen
      ? 'Close menu'
      : 'Open menu';
  const searchLabel = isUa ? 'ПОШУК' : 'SEARCH';

  return (
    <header
      /* The collapsed bar carries a white rule along its foot (Figma node
         94:10572); the expanded one has none, so it arrives with the rest of
         the collapsed state. */
      /* Above the lifted hero while the menu is open, so the panel cannot be
         covered by a wordmark in flight. */
      className={`sticky top-0 transition-colors duration-300 ${
        menuOpen ? 'z-[70]' : 'z-50'
      } ${groundClass} ${text} ${className}`.trim()}
    >
      <div
        ref={innerRef}
        className={`${wrapperClass} flex items-center`}
        style={{ paddingTop: PAD_TOP }}
      >
        {/* The left slot. Its width is the wordmark's, which is zero at rest;
            the tagline is laid over it rather than in it, so a 700px line of
            type never pushes the controls on the right out of place. */}
        {/* A fixed slot, not one that grows with the scroll: the flexible
            spacer to its right absorbs the difference either way, and a slot
            that grew clipped the wordmark just as it was handed over. */}
        <div className="relative hidden shrink-0 md:block" style={{ width: WORDMARK_W }}>
          <a
            href={homeHref}
            aria-label="Science At Risk"
            className={`block overflow-hidden no-underline ${focusRing}`}
            style={wordmarkStyle}
            tabIndex={interactive ? undefined : -1}
            aria-hidden={interactive ? undefined : true}
          >
            <img
              src="/assets/ui/wordmark-hero.svg"
              alt=""
              width={1360}
              height={130}
              className={`block h-[20px] w-auto max-w-none ${isDark ? 'brightness-0 invert' : ''}`.trim()}
            />
          </a>

          {/* From `lg` up only: below that the line is wider than the space
              left beside the controls, so the hero keeps its own copy. */}
          <p
            className={`absolute top-1/2 left-0 m-0 hidden -translate-y-1/2 font-mono text-h3-desktop whitespace-nowrap lg:block ${text}`}
            style={{ opacity: standIn }}
            aria-hidden={standIn < 0.5 ? true : undefined}
          >
            {tagline}
          </p>
        </div>

        <div aria-hidden className="flex-1" />

        <div className="flex shrink-0 items-center gap-[40px]">
          {/* The word, not a magnifier, and it stays put: the bar never
              takes the hero's field. Scrolling moves the wordmark into this
              row and nothing else. */}
          <button
            type="button"
            onClick={onSearchClick}
            className={`border-0 bg-transparent p-0 font-mono text-text1-desktop whitespace-nowrap ${text} ${focusRing}`}
          >
            <span className="underline underline-offset-4">{searchLabel}</span>
          </button>

          <a
            href={localeHref}
            className={`shrink-0 font-mono text-text1-desktop whitespace-nowrap no-underline ${focusRing}`}
          >
            {/* The language you are reading carries the ink and the underline;
                the one you can switch to is muted. */}
            <span className={`underline underline-offset-4 ${text}`}>{isUa ? 'УКР' : 'ENG'}</span>
            <span className={muted}>/{isUa ? 'ENG' : 'УКР'}</span>
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuLabel}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className={`flex shrink-0 items-center justify-center border-0 bg-transparent p-0 ${focusRing}`}
          >
            <img
              src="/assets/ui/hamburger-dark.svg"
              alt=""
              width={30}
              height={22}
              className={`h-[22px] w-[30px] ${isDark ? 'brightness-0 invert' : ''}`.trim()}
            />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id={menuId} className="fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full">
            <MobileNav
              open
              items={items}
              tone={isDark ? 'dark' : 'light'}
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

export default SiteHeaderV5;
