import type { FormEvent } from 'react';
import { PopularRequests, type PopularRequest } from '../PopularRequests/PopularRequests';
import { Button } from '../Button/Button';

export interface SearchHeroProps {
  title: string;
  fieldLabel: string;
  submitLabel: string;
  /** Supporting copy in the bottom-left column. */
  note?: string;
  noteLink?: { label: string; href: string };
  popular?: PopularRequest[];
  popularTitle?: string;
  onSearch?: (query: string) => void;
  /** A popular request is a query of its own — the site runs the search on it. */
  onTagSelect?: (label: string) => void;
  /**
   * Hold the full screen, as the home page's first section does. The site's
   * own search pages let the hero take only the height it needs, with the
   * results beginning right under it.
   */
  full?: boolean;
}

/**
 * The `.search-hero` section as the live site ships it: one headline, the
 * search field, and the popular requests beside a supporting note.
 *
 * Kept as-is. `HomeHero` is the newer first screen; this one stays available
 * for pages that still want the shipped layout.
 */
export function SearchHero({
  title,
  fieldLabel,
  submitLabel,
  note,
  noteLink,
  popular = [],
  popularTitle,
  onSearch,
  onTagSelect,
  full = true,
}: SearchHeroProps) {
  const handle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSearch?.(String(data.get('search') ?? ''));
  };

  return (
    <section className={`search search-hero${full ? ' fullSection' : ''}`}>
      <div className="wrapper">
        <div className="search__wrapper">
          <div className="search-hero__info-wrap">
            <h1 className="search-hero__title">{title}</h1>
          </div>
          <form className="search-hero__input-wrap" onSubmit={handle}>
            <div className="search-hero__column">
              <input className="_risk-label" type="text" name="search" id="search" defaultValue="" />
              <label htmlFor="search">{fieldLabel}</label>
            </div>
            <Button className="search-hero__btn" type="submit">
              {submitLabel}
            </Button>
          </form>
          <div className="row align-items-end flex-md-row flex-column-reverse search__bottom">
            <div className="col-md-4 col-12">
              {note && <p className="search__text">{note}</p>}
              {noteLink && (
                <a href={noteLink.href} className="search__link main-text main-text--monoBig">
                  <span className="hover hover--underline">{noteLink.label}</span>
                </a>
              )}
            </div>
            <div className="offset-md-1 col-md-7 col-12">
              {popular.length > 0 && (
                <PopularRequests
                  className="search-hero__requests"
                  title={popularTitle}
                  items={popular}
                  onSelect={onTagSelect}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
