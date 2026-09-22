import { Button } from '../Button/Button';
import './PaperCard.css';

export interface PaperCardProps {
  title: string;
  /** The authors, on their own. */
  authors?: string;
  /**
   * What kind of document this is, set small above the names. The names are
   * the evidence the section exists for, so they are not buried in the same
   * line as a label.
   */
  kind?: string;
  /** The file on offer; the site prints the extension alone. */
  fileType?: string;
  href: string;
  /** When given, the card offers the file itself beside the details button. */
  downloadHref?: string;
  detailsLabel?: string;
  downloadLabel?: string;
}

/** The site's `.paper-card` — one white paper in the policies list. */
export function PaperCard({
  title,
  authors,
  kind = 'Policy paper',
  fileType = '.pdf',
  href,
  downloadHref,
  detailsLabel = 'More details',
  downloadLabel = 'Download',
}: PaperCardProps) {
  return (
    <div className="paper-card">
      <article className="paper-card__wrap">
        <div className="row align-items-start justify-content-between">
          <div className="col-xl-6 col-md-7">
            <div className="paper-card__info">
              <h2 className="paper-card__title">
                <span>{title}</span>
              </h2>
              {kind && <p className="paper-card__kind">{kind}</p>}
              {authors && <p className="paper-card__text">{authors}</p>}
            </div>
          </div>
          <div className="offset-xl-3 offset-md-2 col-md-3">
            <div className="paper-card__right">
              <p className="paper-card__right-text">{fileType}</p>
            </div>
          </div>
        </div>
      </article>
      <a className="absoluteLink" href={href} aria-label={title} />
      <div className="paper-card__wrap-btn d-md-flex d-none">
        <Button className="paper-card__btn" variant="bordered" href={href}>
          {detailsLabel}
        </Button>
        {downloadHref && (
          <Button className="paper-card__btn" href={downloadHref} target="_blank" overlayLink>
            {downloadLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
