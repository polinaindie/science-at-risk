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
          <div className="project-card__btn btn btn--black d-b1400-inline-flex d-none">
            <a target="_blank" href={href} rel="nofollow">
              {buttonLabel}
            </a>
          </div>
        </header>
        {meta && <p className="project-card__text">{meta}</p>}
        {role && <p className="project-card__text">{role}</p>}
      </article>
      <a target="_blank" className="absoluteLink" href={href} rel="nofollow" aria-label={title} />
    </div>
  );
}
