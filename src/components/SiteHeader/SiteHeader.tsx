import { useState } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteHeaderProps {
  nav: NavItem[];
  social?: NavItem[];
  /** Language toggle shown on the left, e.g. "UA". */
  lang?: { label: string; href: string };
  homeHref?: string;
  /** The site inverts the header over dark heroes. */
  dark?: boolean;
  defaultMenuOpen?: boolean;
}

/** The site's `.header` — logo, language switch and the slide-in menu. */
export function SiteHeader({
  nav,
  social = [],
  lang,
  homeHref = '#',
  dark = true,
  defaultMenuOpen = false,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(defaultMenuOpen);

  return (
    <header className={`header${dark ? ' black' : ''}`}>
      <div className={`header__bg${open ? ' active' : ''}`}>
        <div className="wrapper">
          <div className="header__wrapper">
            {lang && (
              <div className="header__lang">
                <a href={lang.href} className="header__lang-btn hover hover--black">
                  {lang.label}
                </a>
              </div>
            )}
            <div className="header__center">
              <a href={homeHref}>Science at risk</a>
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
