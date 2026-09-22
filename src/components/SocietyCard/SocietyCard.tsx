import { Button } from '../Button/Button';

export interface SocietyCardProps {
  title: string;
  text?: string;
  /** Right-hand column, labelled "Science Domain" on mobile. */
  domain?: string;
  domainLabel?: string;
  /**
   * Funding still needed, already formatted. Damaged-infrastructure entries
   * carry it in a second right-hand column; societies have none.
   */
  amount?: string;
  amountLabel?: string;
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
  amount,
  amountLabel = 'Required amount',
  href,
  buttonLabel = 'More details',
}: SocietyCardProps) {
  // Entries whose description repeats their own name say nothing twice; the
  // card prints the name and leaves it at that.
  const description = text && text.trim() !== title.trim() ? text : undefined;

  return (
    <div className="infrastructures-card position-relative">
      <article className="infrastructures-card__wrap">
        <div className="row align-items-start justify-content-between">
          <div className="col-md-7 col-12">
            <div className="infrastructures-card__info">
              <h2 className="infrastructures-card__title">
                <span>{title}</span>
              </h2>
              {description && <p className="infrastructures-card__text">{description}</p>}
            </div>
          </div>
          <div className="col-md-5 col-12">
            <div className="infrastructures-card__right">
              <div className="infrastructures-card__text-left">
                <p className="d-md-none infrastructures__text-left">{domainLabel}</p>
                <p>{domain}</p>
              </div>
              {amount && (
                <div className="infrastructures-card__text-right">
                  <p className="d-md-none infrastructures__text-left">{amountLabel}</p>
                  <p>{amount}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="d-md-flex d-none justify-content-end">
          <Button className="infrastructures-card__btn" href={href}>
            {buttonLabel}
          </Button>
        </div>
      </article>
      <a className="absoluteLink" href={href} aria-label={title} />
    </div>
  );
}
