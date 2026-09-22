import { useState, type CSSProperties, type ReactNode } from 'react';
import './SiteHeader.css';

/** Which way the bar is painted over the section behind it. */
export type HeaderTone = 'black' | 'white';

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteHeaderProps {
  nav: NavItem[];
  social?: NavItem[];
  /** Language toggle shown on the left, e.g. "UA". */
  lang?: { label: string; href: string };
  /** Both languages side by side, the active one marked — takes precedence over `lang`. */
  languages?: { label: string; href: string; active?: boolean }[];
  /** The site's wordmark is literally "!!!". */
  wordmark?: ReactNode;
  homeHref?: string;
  /** The site inverts the header over dark heroes. */
  dark?: boolean;
  /**
   * Paints the wordmark, language switch and burger — the site's own
   * `data-color`: `black` over a light section, `white` over a dark one. Takes
   * precedence over `dark`, and changing it crossfades, so a page can hand the
   * header the tone of whatever section is on screen.
   */
  tone?: HeaderTone;
  /** Pins the bar to the top of the viewport, as `.header-fixed` does. */
  fixed?: boolean;
  /**
   * A quiet mono link beside the burger — the way in for a scientist who came
   * to add themselves rather than to search. Without it, self-submission is
   * only reachable from inside the menu.
   */
  action?: { label: string; href: string };
  /** The site rules off the bar; drop it when the header sits on a hero. */
  divider?: boolean;
  /**
   * Paints the header bar below 1024px, where the site gives it a solid
   * background of its own. From 1024px up the bar is see-through and simply
   * shows the section behind it, the way the site has it.
   */
  background?: string;
  defaultMenuOpen?: boolean;
}

/** The site's `.header` — logo, language switch and the slide-in menu. */
export function SiteHeader({
  nav,
  social = [],
  lang,
  languages,
  wordmark = '!!!',
  homeHref = '#',
  dark = true,
  tone,
  fixed = false,
  action,
  divider = true,
  background,
  defaultMenuOpen = false,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(defaultMenuOpen);

  return (
    <header
      className={`header${tone ? ` ${tone}` : dark ? ' black' : ''}${
        divider ? '' : ' header--flush'
      }${fixed ? ' header--fixed' : ''}`}
      style={background ? ({ '--header-bg': background } as CSSProperties) : undefined}
    >
      <div className={`header__bg${open ? ' active' : ''}`}>
        <div className="wrapper">
          <div className="header__wrapper">
            <div className="header__lang">
              {languages
                ? languages.map((item, i) => (
                    <span key={item.label}>
                      {i > 0 && <span className="header__lang-divider">/</span>}
                      <a
                        href={item.href}
                        className={`header__lang-btn hover hover--black${
                          item.active ? ' header__lang-btn--active' : ''
                        }`}
                        aria-current={item.active ? 'true' : undefined}
                      >
                        {item.label}
                      </a>
                    </span>
                  ))
                : lang && (
                    <a href={lang.href} className="header__lang-btn hover hover--black">
                      {lang.label}
                    </a>
                  )}
            </div>
            <div className="header__center">
              <a href={homeHref}>{wordmark}</a>
            </div>
            <div className="header__menu">
              {action && (
                <a className="header__action hover hover--underline" href={action.href}>
                  {action.label}
                </a>
              )}
              <button
                className="header__burger"
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <div className="hamburger-menu" />
              </button>
              <div className="header__close" onClick={() => setOpen(false)} />
              <nav className="header__nav">
                <ul className="header__nav-list">
                  {nav.map((item) => (
                    <li className="header__nav-item" key={item.label}>
                      <a className="header__nav-link hover hover--white" href={item.href}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                {social.length > 0 && (
                  <ul className="header__list-link">
                    {social.map((item) => (
                      <li className="header__link-item" key={item.label}>
                        <a
                          href={item.href}
                          target="_blank"
                          className="header__link hover hover--white"
                          rel="nofollow"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
