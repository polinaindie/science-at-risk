import { Button } from '../Button/Button';

export interface ListCardProps {
  title: string;
  text?: string;
  /** Funding needed, already formatted, e.g. "~ 500000 UAH". */
  price?: string;
  href: string;
  buttonLabel?: string;
  priceLabel?: string;
}

/** The `.list-card` used for damaged-infrastructure entries. */
export function ListCard({
  title,
  text,
  price,
  href,
  buttonLabel = 'More details',
  priceLabel = 'Required amount',
}: ListCardProps) {
  // Entries whose description repeats their own name say nothing twice; the
  // card prints the name and leaves it at that.
  const description = text && text.trim() !== title.trim() ? text : undefined;

  return (
    <article className="list-card">
      <div className="list-card__wrapper">
        <header className="list-card__header">
          <h2 className="list-card__title">
            <span>{title}</span>
          </h2>
          {price && <p className="list-card__price d-md-block d-none">{price}</p>}
        </header>
        <footer className="list-card__footer">
          {description && <p className="list-card__text">{description}</p>}
          <Button className="list-card__btn" href={href}>
            {buttonLabel}
          </Button>
          {price && (
            <div className="list-card__summ d-md-none d-block">
              <p className="help__text">{priceLabel}</p>
              <p className="list-card__price">{price}</p>
            </div>
          )}
        </footer>
      </div>
      <a className="list-card__link-wrap" href={href} aria-label={title} />
    </article>
  );
}
