import { Button } from '../Button/Button';

export interface PublicationCardProps {
  title: string;
  /** Free-form citation line: authors, journal, year, pages. */
  meta?: string;
  role?: string;
  href: string;
  buttonLabel?: string;
}

/** The `.project-card` block — a publication on an expert's profile. */
export function PublicationCard({
  title,
  meta,
  role,
  href,
  buttonLabel = 'Read',
}: PublicationCardProps) {
  return (
    <div className="project-card position-relative">
      <article className="project-card__wrapper">
        <header className="project-card__header">
          <h2 className="project-card__title">
            <span>{title}</span>
          </h2>
          <Button
            className="project-card__btn d-b1400-inline-flex d-none"
            href={href}
            target="_blank"
          >
            {buttonLabel}
          </Button>
        </header>
        {meta && <p className="project-card__text">{meta}</p>}
        {role && <p className="project-card__text">{role}</p>}
      </article>
      <a target="_blank" className="absoluteLink" href={href} rel="nofollow" aria-label={title} />
    </div>
  );
}
