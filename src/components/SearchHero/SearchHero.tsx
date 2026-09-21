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
}

/** The `.search-hero` section that opens the home page. */
export function SearchHero({
  title,
  fieldLabel,
  submitLabel,
  note,
  noteLink,
  popular = [],
  popularTitle,
  onSearch,
}: SearchHeroProps) {
  const handle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSearch?.(String(data.get('search') ?? ''));
  };

  return (
    <section className="search search-hero fullSection">
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
                <PopularRequests className="search-hero__requests" title={popularTitle} items={popular} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
