export interface SocietyCardProps {
  title: string;
  text?: string;
  /** Right-hand column, labelled "Science Domain" on mobile. */
  domain?: string;
  domainLabel?: string;
  href: string;
  buttonLabel?: string;
}

/**
 * The `.infrastructures-card` block. Despite the class name the site uses it
 * for scientific societies, so the component is named after what it shows.
 */
export function SocietyCard({
  title,
  text,
  domain,
  domainLabel = 'Science Domain',
  href,
  buttonLabel = 'More details',
}: SocietyCardProps) {
  return (
    <div className="infrastructures-card position-relative">
      <article className="infrastructures-card__wrap">
        <div className="row align-items-start justify-content-between">
          <div className="col-md-7 col-12">
            <div className="infrastructures-card__info">
              <h2 className="infrastructures-card__title">
                <span>{title}</span>
              </h2>
              {text && <p className="infrastructures-card__text">{text}</p>}
            </div>
          </div>
          <div className="col-md-5 col-12">
            <div className="infrastructures-card__right">
              <div className="infrastructures-card__text-left">
                <p className="d-md-none infrastructures__text-left">{domainLabel}</p>
                <p>{domain}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-md-flex d-none justify-content-end">
          <div className="infrastructures-card__btn btn btn--black">
            <a href={href}>{buttonLabel}</a>
          </div>
        </div>
      </article>
      <a className="absoluteLink" href={href} aria-label={title} />
    </div>
  );
}
