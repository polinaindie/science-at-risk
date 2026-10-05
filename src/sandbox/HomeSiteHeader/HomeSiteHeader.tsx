import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { MobileNav } from '@/components/MobileNav';

export interface HomeSiteHeaderNavItem {
  label: string;
  href: string;
}

export interface HomeSiteHeaderProps {
  /** Sections in the row (Figma node 230:5498). */
  navItems?: HomeSiteHeaderNavItem[];
  locale?: string;
  localeHref?: string;
  /**
   * How far the wordmark has come into the bar, 0..1. At 0 the bar holds only
   * the sections on the left and the language switch on the right — the hero
   * has the wordmark. At 1 the wordmark has its slot on the left and the
   * sections stand between it and the switch, as in the Figma frame.
   */
  logo?: number;
  /** White ink, for a bar standing on a dark block. */
  inverted?: boolean;
  /** The ground of the block the bar is standing on. */
  ground?: string;
  /** The wordmark's slot, so the page can aim the travelling copy at it. */
  logoRef?: Ref<HTMLImageElement>;
  className?: string;
}

/** `wordmark-hero.svg` is 1360x130; the bar shows the same picture. */
const WORDMARK_RATIO = 1360 / 130;

const defaultNavItems: HomeSiteHeaderNavItem[] = [
  { label: 'Scientists', href: '/experts' },
  { label: 'Researches', href: '/research' },
  { label: 'Societies', href: '/societies' },
  { label: 'Stories', href: '/stories' },
  { label: 'Infrastructure recovery', href: '/infrastructures' },
  { label: 'About', href: '/about' },
];

/**
 * The home page's bar (Figma node 230:5498). It stays at the top of the screen
 * over every block and takes that block's ground and ink.
 *
 * The wordmark is not in it while the hero is on screen — the hero carries it.
 * As the next block comes up the page flies the hero's wordmark into the slot
 * on the left, and the sections move over from the left edge to the middle to
 * make room: the slot grows with `logo`, and so does the space in front of the
 * sections, until the three groups stand evenly spaced across the row.
 *
 * The six sections only fit from `lg`; below that they sit behind the menu
 * button.
 */
export function HomeSiteHeader({
  navItems = defaultNavItems,
  locale = 'EN',
  localeHref = '/uk',
  logo = 0,
  inverted = false,
  ground = 'bg-brand-accent-blue',
  logoRef,
  className = '',
}: HomeSiteHeaderProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';

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

  const p = Math.min(1, Math.max(0, logo));
  const ink = inverted ? 'text-brand-white' : 'text-brand-black';
  const focusRing = `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
    inverted ? 'focus-visible:outline-brand-white' : 'focus-visible:outline-brand-black'
  }`;
  // Between `lg` and `xl` the wordmark, all six sections and the switch only
  // share a row at a size down — 16px type, 16px apart — so the menu stays whole
  // there rather than going back behind the button.
  const linkType = `font-mono text-[16px] leading-[28px] tracking-[-0.03em] xl:text-text1-desktop whitespace-nowrap ${ink}`;
  const switchType = `font-mono text-text1-mobile md:text-text1-desktop whitespace-nowrap ${ink}`;
  const current = (
    <span className="underline underline-offset-4">{isUa ? 'UKR' : 'ENG'}</span>
  );
  const other = (
    <a href={localeHref} className={`satr-hover-underline no-underline ${ink} ${focusRing}`}>
      {isUa ? 'ENG' : 'UKR'}
    </a>
  );

  return (
    <>
      {/* `--bar-logo-h` is the wordmark's height in the bar: 20, as the Figma
          vector (208x20), and 16 below `md`, which is what lets it share a
          phone's row with the language switch and the menu button. */}
      <header
        className={`flex items-center py-7 px-6 md:px-10 [--bar-logo-h:16px] md:[--bar-logo-h:20px] ${ground} ${
          inverted ? 'satr-on-dark' : ''
        } ${className}`.trim()}
      >
        {/* The wordmark's slot. It is as wide as the wordmark has arrived, so
            at rest on the hero it takes no room at all. The picture itself is
            only shown once the travelling copy has landed on it. */}
        <a
          href="/"
          aria-label="Science At Risk"
          tabIndex={p < 1 ? -1 : undefined}
          aria-hidden={p < 1 ? true : undefined}
          className={`flex shrink-0 items-center overflow-hidden no-underline ${focusRing}`}
          style={{ width: `calc(var(--bar-logo-h) * ${WORDMARK_RATIO * p})` }}
        >
          <img
            ref={logoRef}
            src="/assets/ui/wordmark-hero.svg"
            alt=""
            width={1360}
            height={130}
            className={`block w-auto max-w-none ${
              inverted ? 'brightness-0 invert' : ''
            }`}
            style={{ height: 'var(--bar-logo-h)', opacity: p >= 1 ? 1 : 0 }}
          />
        </a>

        {/* Grows with the wordmark, so the sections start at the left edge and
            end up in the middle of what is left of the row. */}
        <span aria-hidden className="min-w-0" style={{ flexGrow: p, minWidth: 16 * p }} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="m-0 flex list-none items-center gap-4 p-0 xl:gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={`satr-hover-underline ${linkType} ${focusRing}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <span aria-hidden className="min-w-3 flex-1 md:min-w-4" />

        <div className="flex shrink-0 items-center gap-3 md:gap-7">
          <p className={`m-0 flex items-center gap-2 ${switchType}`}>
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
            className={`flex min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 lg:hidden ${focusRing}`}
          >
            <img
              src={inverted ? '/assets/ui/hamburger-white.svg' : '/assets/ui/hamburger-dark.svg'}
              alt=""
              width={30}
              height={22}
              className="h-[22px] w-[30px]"
            />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div id={menuId} className="fixed inset-0 z-[80] flex justify-end lg:hidden">
          <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => setMenuOpen(false)} />
          <div className="relative h-full">
            <MobileNav
              open
              items={navItems}
              tone="light"
              locale={isUa ? 'UA' : 'EN'}
              onClose={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default HomeSiteHeader;
