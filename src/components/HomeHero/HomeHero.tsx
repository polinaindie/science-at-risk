import type { FormEvent, ReactNode } from 'react';
import { Button } from '../Button/Button';
import { PopularRequests, type PopularRequest } from '../PopularRequests/PopularRequests';
import './HomeHero.css';

/** The hero's field colour, so a header sitting over it can match. */
export const HOME_HERO_BG = '#b5c6cd';

export interface HeroLink {
  label: string;
  href: string;
  /** Shown in parentheses after the label, e.g. the number of scientists. */
  count?: number;
}

export interface HomeHeroProps {
  /** Mono line above the wordmark. */
  suptitle?: string;
  /** The wordmark. A node, so the `!` swaps can be marked up if needed. */
  title?: ReactNode;
  placeholder?: string;
  submitLabel?: string;
  popularTitle?: string;
  popular?: PopularRequest[];
  /** The counted entry points along the bottom. */
  links?: HeroLink[];
  onSearch?: (query: string) => void;
  onTagSelect?: (label: string) => void;
}

/**
 * The home page's first screen: wordmark, search, popular requests and the
 * counted links into the three collections.
 *
 * `SearchHero` is the layout the live site still ships; this is the newer one.
 */
export function HomeHero({
  suptitle = "Research & expertise from Ukraine's scientific frontline",
  title = 'SC!ENCE AT R!SK!',
  placeholder = 'Scientific field or name',
  submitLabel = 'Find a scientist',
  popularTitle = 'Popular requests',
  popular = [],
  links = [],
  onSearch,
  onTagSelect,
}: HomeHeroProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSearch?.(String(data.get('search') ?? ''));
  };

  return (
    <section className="home-hero">
      <div className="wrapper home-hero__wrapper">
        {suptitle && <p className="home-hero__suptitle">{suptitle}</p>}
        <h1 className="home-hero__title">{title}</h1>

        <div className="home-hero__search">
          <form className="home-hero__search-row" onSubmit={handleSubmit}>
            <div className="home-hero__field">
              <input
                className="home-hero__input"
                id="home-hero-search"
                type="text"
                name="search"
                /* A blank placeholder is what `:placeholder-shown` needs to
                   tell an empty field from a filled one; the label below is
                   what the reader actually sees. */
                placeholder=" "
              />
              <label className="home-hero__label" htmlFor="home-hero-search">
                {placeholder}
              </label>
            </div>
            <Button type="submit">{submitLabel}</Button>
          </form>

          {popular.length > 0 && (
            <PopularRequests
              className="home-hero__requests"
              title={popularTitle}
              items={popular}
              showCounts={false}
              onSelect={onTagSelect}
            />
          )}
        </div>

        {links.length > 0 && (
          <nav className="home-hero__links">
            {links.map((link) => (
              <a className="home-hero__link" href={link.href} key={link.label}>
                <span className="home-hero__link-arrow" aria-hidden>
                  &gt;&gt;
                </span>
                <span className="home-hero__link-label">{link.label}</span>
                {link.count !== undefined && (
                  <span className="home-hero__link-count">({link.count})</span>
                )}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
