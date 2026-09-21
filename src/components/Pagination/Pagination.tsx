function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 'ellipsis', total];
  }
  if (current >= total - 2) {
    return [1, 'ellipsis', total - 2, total - 1, total];
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

/**
 * Pagination — Figma Paginator (292:1635).
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  prevLabel = 'Попередня',
  nextLabel = 'Наступна',
  className = '',
}: PaginationProps) {
  const pages = buildPages(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav
      className={`flex flex-wrap items-center gap-4 font-mono text-h3-desktop text-brand-black ${className}`.trim()}
      aria-label="Пагінація"
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 border-0 bg-transparent p-0 disabled:opacity-40"
        disabled={!canPrev}
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        <img src="/assets/ui/arrow-prev.svg" alt="" width={9} height={13} />
        <span>{prevLabel}</span>
      </button>

      <ul className="m-0 flex list-none items-center gap-5 p-0">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <li key={`e-${index}`} className="min-w-[14px]" aria-hidden>
              ...
            </li>
          ) : (
            <li key={page} className="relative flex size-8 items-center justify-center">
              {page === currentPage ? (
                <span
                  className="absolute inset-0 rounded-full bg-brand-black"
                  aria-hidden
                />
              ) : null}
              <button
                type="button"
                aria-current={page === currentPage ? 'page' : undefined}
                className={`relative z-10 border-0 bg-transparent p-0 ${
                  page === currentPage ? 'text-white' : 'text-brand-black'
                }`}
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className="inline-flex items-center gap-2 border-0 bg-transparent p-0 disabled:opacity-40"
        disabled={!canNext}
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        <span>{nextLabel}</span>
        <img
          src="/assets/ui/arrow-next.svg"
          alt=""
          width={9}
          height={13}
          className="rotate-180"
        />
      </button>
    </nav>
  );
}

export default Pagination;
