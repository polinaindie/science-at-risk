import { useState, type ReactNode } from 'react';

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
  /** The site rules off the bar; drop it when the header sits on a hero. */
  divider?: boolean;
  /**
   * Paints the header bar. The site's default is white; over a coloured hero,
   * pass that hero's colour. Note that `transparent` is not a good choice
   * here — the bar is positioned over the section below it, and leaving it
   * see-through leaves the compositor free to back the layer with white.
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
  divider = true,
  background,
  defaultMenuOpen = false,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(defaultMenuOpen);

  return (
    <header
      className={`header${dark ? ' black' : ''}${divider ? '' : ' header--flush'}`}
      style={background ? { background } : undefined}
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
