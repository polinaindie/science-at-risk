export interface PaginationProps {
  current: number;
  total: number;
  /** Builds the href for a page number. Omit to render buttons instead. */
  hrefFor?: (page: number) => string;
  labels?: { prev: string; next: string };
  onChange?: (page: number) => void;
}

const ArrowLeft = () => (
  <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 7.39965V5.60035L9 0V1.86678L1.56977 6.38754V6.56747L9 11.0882V13L0 7.39965Z" fill="black" />
  </svg>
);

const ArrowRight = () => (
  <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5.60035V7.39965L0 13V11.1332L7.43023 6.61246V6.43253L0 1.91177V0L9 5.60035Z" fill="black" />
  </svg>
);

/** The site's `.pagination` block. */
export function Pagination({
  current,
  total,
  hrefFor,
  labels = { prev: 'Previous', next: 'Next' },
  onChange,
}: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const step = (dir: -1 | 1, label: string, arrow: React.ReactNode, cls: string) => {
    const target = current + dir;
    const disabled = target < 1 || target > total;
    const content = (
      <>
        {dir === -1 && arrow}
        <div className="d-md-inline-block d-none">
          <span className="hover hover--black">{label}</span>
        </div>
        {dir === 1 && arrow}
      </>
    );
    if (disabled) {
      return <span className={`${cls} pagination--disabled`}>{content}</span>;
    }
    return (
      <a className={cls} href={hrefFor?.(target) ?? '#'} onClick={() => onChange?.(target)}>
        {content}
      </a>
    );
  };

  return (
    <div className="pagination">
      {step(-1, labels.prev, <ArrowLeft />, 'pagination__prev')}
      <div className="pagination__numbers">
        {pages.map((p) =>
          p === current ? (
            <span key={p} aria-current="page" className="pagination__number pagination__number--active">
              {p}
            </span>
          ) : (
            <a key={p} className="pagination__number" href={hrefFor?.(p) ?? '#'} onClick={() => onChange?.(p)}>
              {p}
            </a>
          ),
        )}
      </div>
      {step(1, labels.next, <ArrowRight />, 'pagination__next')}
    </div>
  );
}
