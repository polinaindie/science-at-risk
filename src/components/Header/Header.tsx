import { forwardRef, type Ref } from 'react';

export interface HeaderProps {
  locale?: string;
  onLocaleClick?: () => void;
  onMenuClick?: () => void;
  tone?: 'light' | 'dark';
  className?: string;
  /** Whether the mobile nav is open (aria-expanded). */
  menuExpanded?: boolean;
  /** id of the controlled nav panel. */
  menuControls?: string;
  menuButtonRef?: Ref<HTMLButtonElement>;
  /** Home href for the center mark. Defaults from locale. */
  homeHref?: string;
  /** Href for the inactive locale option. */
  otherLocaleHref?: string;
  /** Center brand: compact mark on hero, full wordmark after scroll / on inner pages. */
  brandMode?: 'mark' | 'wordmark';
}

/**
 * Site header — live mirror layout.
 * Language link left, !!! center mark, hamburger right.
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    locale = 'EN',
    onLocaleClick,
    onMenuClick,
    tone = 'light',
    className = '',
    menuExpanded = false,
    menuControls,
    menuButtonRef,
    homeHref,
    otherLocaleHref,
    brandMode = 'mark',
  },
  ref,
) {
  const isDark = tone === 'dark';
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const text = isDark ? 'text-white' : 'text-brand-black';
  const hamburger = isDark
    ? '/assets/ui/hamburger-white.svg'
    : '/assets/ui/hamburger-dark.svg';
  const home = homeHref ?? (isUa ? '/uk' : '/');
  const ukHref = otherLocaleHref ?? '/uk';
  const enHref = otherLocaleHref ?? '/';
  const muted = isDark ? 'text-white/70' : 'text-brand-muted';
  const openLabel = isUa ? 'Відкрити меню' : 'Open menu';
  const closeLabel = isUa ? 'Закрити меню' : 'Close menu';

  const langOptionClass =
    'inline-flex min-h-11 items-center font-mono text-h3-mobile tracking-[-0.03em] no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current md:text-h3-desktop';

  const renderLocaleOption = (
    label: string,
    lang: string,
    href: string,
    active: boolean,
  ) => {
    if (active) {
      return (
        <span className={`${langOptionClass} ${text}`} aria-current="true" lang={lang}>
          {label}
        </span>
      );
    }

    if (onLocaleClick) {
      return (
        <button
          type="button"
          className={`${langOptionClass} satr-hover-underline border-0 bg-transparent p-0 ${muted}`}
          onClick={onLocaleClick}
          lang={lang}
        >
          {label}
        </button>
      );
    }

    return (
      <a href={href} className={`${langOptionClass} satr-hover-underline ${muted}`} lang={lang}>
        {label}
      </a>
    );
  };

  return (
    <header
      ref={ref}
      className={`relative grid h-[42px] w-full max-w-[1360px] grid-cols-3 items-center ${text} ${className}`.trim()}
    >
      <div className="z-[1] justify-self-start">
        {renderLocaleOption(isUa ? 'EN' : 'UA', isUa ? 'en' : 'uk', isUa ? enHref : ukHref, false)}
      </div>

      <div className="pointer-events-none justify-self-center text-center leading-none">
        <a
          href={home}
          className="pointer-events-auto inline-flex items-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
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

      <div className="z-[1] justify-self-end">
        <button
          ref={menuButtonRef}
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
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

export default Header;
