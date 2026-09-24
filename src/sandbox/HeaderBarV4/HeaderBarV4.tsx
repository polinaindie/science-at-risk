import { forwardRef, type ReactNode, type Ref } from 'react';
import { Link } from '@/components/Link';

export interface HeaderBarV4Props {
  locale?: string;
  onLocaleClick?: () => void;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  tone?: 'light' | 'dark';
  className?: string;
  menuExpanded?: boolean;
  menuControls?: string;
  menuButtonRef?: Ref<HTMLButtonElement>;
  searchExpanded?: boolean;
  searchControls?: string;
  searchButtonRef?: Ref<HTMLButtonElement>;
  /** Rendered across the whole bar in place of the three zones while searching. */
  searchSlot?: ReactNode;
  homeHref?: string;
  otherLocaleHref?: string;
  brandMode?: 'mark' | 'wordmark';
}

/**
 * Fork of src/components/Header/Header.tsx for the V4 experiment.
 * Diff: a Search control next to the hamburger, and a `searchSlot` that takes
 * over the whole bar while the search is open. The shared Header is a rigid
 * `grid-cols-3`, so a fourth zone cannot be added without changing it.
 *
 * The control is the word "Search", not a magnifier: the icon set has no
 * magnifier, and a word sits better with a site built out of type anyway.
 */
export const HeaderBarV4 = forwardRef<HTMLElement, HeaderBarV4Props>(function HeaderBarV4(
  {
    locale = 'EN',
    onLocaleClick,
    onMenuClick,
    onSearchClick,
    tone = 'light',
    className = '',
    menuExpanded = false,
    menuControls,
    menuButtonRef,
    searchExpanded = false,
    searchControls,
    searchButtonRef,
    searchSlot,
    homeHref,
    otherLocaleHref,
    brandMode = 'mark',
  },
  ref,
) {
  const isDark = tone === 'dark';
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const text = isDark ? 'text-white' : 'text-brand-black';
  const hamburger = isDark ? '/assets/ui/hamburger-white.svg' : '/assets/ui/hamburger-dark.svg';
  const home = homeHref ?? (isUa ? '/uk' : '/');
  const ukHref = otherLocaleHref ?? '/uk';
  const enHref = otherLocaleHref ?? '/';
  const muted = isDark ? 'text-white/70' : 'text-brand-muted';
  const openLabel = isUa ? 'Відкрити меню' : 'Open menu';
  const closeLabel = isUa ? 'Закрити меню' : 'Close menu';
  const searchLabel = isUa ? 'Пошук' : 'Search';

  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

  const langOptionClass = `inline-flex min-h-11 items-center font-mono text-h3-mobile uppercase tracking-[-0.03em] ${focusRing} md:text-h3-desktop`;

  const renderLocaleOption = (label: string, lang: string, href: string, active: boolean) => {
    if (active) {
      return (
        <span
          className={`${langOptionClass} underline decoration-solid underline-offset-[3px] ${text}`}
          aria-current="true"
          lang={lang}
        >
          {label}
        </span>
      );
    }

    return (
      <Link
        {...(onLocaleClick
          ? { as: 'button' as const, onClick: onLocaleClick }
          : { as: 'a' as const, href })}
        className={`${langOptionClass} satr-hover-underline no-underline ${muted}`}
        lang={lang}
      >
        {label}
      </Link>
    );
  };

  // The bar keeps its 42px height in both states, so nothing below it moves.
  if (searchExpanded && searchSlot) {
    return (
      <header
        ref={ref}
        className={`relative flex h-[42px] w-full max-w-[1360px] items-center ${text} ${className}`.trim()}
      >
        {searchSlot}
      </header>
    );
  }

  return (
    <header
      ref={ref}
      className={`relative grid h-[42px] w-full max-w-[1360px] grid-cols-3 items-center ${text} ${className}`.trim()}
    >
      <div className={`z-[1] flex items-center justify-self-start ${text}`}>
        {renderLocaleOption('ENG', 'en', enHref, !isUa)}
        <span className="font-mono text-h3-mobile tracking-[-0.03em] md:text-h3-desktop" aria-hidden>
          /
        </span>
        {renderLocaleOption('УКР', 'uk', ukHref, isUa)}
      </div>

      <div className="pointer-events-none justify-self-center text-center leading-none">
        <a
          href={home}
          className={`pointer-events-auto inline-flex items-center no-underline ${focusRing}`}
          aria-label="Science At Risk"
        >
          {brandMode === 'mark' ? (
            <span
              className={`font-serif text-h3-mobile tracking-[-0.02em] md:text-h2-desktop ${text}`}
            >
              !!!
            </span>
          ) : (
            <img
              src="/assets/ui/wordmark-hero.svg"
              alt=""
              width={1360}
              height={130}
              className={`block h-6 w-auto max-w-[min(280px,58vw)] md:h-7 ${isDark ? 'brightness-0 invert' : ''}`.trim()}
            />
          )}
        </a>
      </div>

      <div className="z-[1] flex items-center gap-3 justify-self-end md:gap-5">
        <button
          ref={searchButtonRef}
          type="button"
          className={`flex min-h-11 items-center border-0 bg-transparent p-0 font-mono text-h3-mobile md:text-h3-desktop ${text} ${focusRing}`}
          aria-expanded={searchExpanded}
          aria-controls={searchControls}
          onClick={onSearchClick}
        >
          <span className="satr-hover-underline">{searchLabel}</span>
        </button>

        <button
          ref={menuButtonRef}
          type="button"
          className={`flex min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 ${focusRing}`}
          aria-label={menuExpanded ? closeLabel : openLabel}
          aria-expanded={menuExpanded}
          aria-controls={menuControls}
          onClick={onMenuClick}
        >
          <img src={hamburger} alt="" width={30} height={22} className="h-[22px] w-[30px]" />
        </button>
      </div>
    </header>
  );
});

export default HeaderBarV4;
