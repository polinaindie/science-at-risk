import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';

export interface ExpertCardProps {
  name: string;
  /** Degree and rank, e.g. "Ph.D., professor". */
  degree?: string;
  affiliation?: string;
  summary?: string;
  tags?: string[];
  photo?: string;
  href: string;
  buttonLabel?: string;
  onTagClick?: (tag: string) => void;
}

/** The `.expert-card` from the experts directory. */
export function ExpertCard({
  name,
  degree,
  affiliation,
  summary,
  tags = [],
  photo,
  href,
  buttonLabel = 'More details',
  onTagClick,
}: ExpertCardProps) {
  return (
    <div className="expert-card position-relative">
      <article className="expert-card__wrapper">
        {photo && (
          <picture className="expert-card__img">
            <img src={photo} alt={name} loading="lazy" />
          </picture>
        )}
        <div className="expert-card__content">
          <header className="expert-card__header">
            <h2 className="expert-card__title">
              <span>{name}</span>
            </h2>
            <Button className="expert-card__btn" href={href}>
              {buttonLabel}
            </Button>
          </header>
          {degree && <p className="expert-card__subtitle">{degree}</p>}
          {affiliation && <p className="expert-card__text">{affiliation}</p>}
          {summary && (
            <div className="expert-card__text">
              <p className="paragraph">{summary}</p>
            </div>
          )}
          {tags.length > 0 && (
            <ul className="expert-card__list">
              {tags.map((tag) => (
                <li className="expert-card__item" key={tag}>
                  {/* The site tints the tags inside an expert card. */}
                  <Tag className="expert-card__tag" label={tag} fill="#B5C6CD" onClick={onTagClick} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
      <a className="absoluteLink" href={href} aria-label={name} />
    </div>
  );
}
