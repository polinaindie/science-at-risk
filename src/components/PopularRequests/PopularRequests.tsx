import { Tag } from '../Tag/Tag';

export interface PopularRequest {
  label: string;
  count: number;
  href?: string;
}

export interface PopularRequestsProps {
  title?: string;
  items: PopularRequest[];
  /**
   * Counts below this are left off the pill. A visible `1` on the first screen
   * says "this database is empty" louder than the rest of the page says the
   * opposite, and the tag is still worth offering as a query.
   */
  minCount?: number;
  /**
   * Drop the counts altogether. The home page does: on the first screen the
   * black discs read as data about the database rather than as a way in.
   */
  showCounts?: boolean;
  className?: string;
  onSelect?: (label: string) => void;
}

/** The `.popular-requests` cluster under the home-page search field. */
export function PopularRequests({
  title = 'Popular requests',
  items,
  minCount = 10,
  showCounts = true,
  className = '',
  onSelect,
}: PopularRequestsProps) {
  // Busiest first: an arbitrary order reads as an arbitrary database.
  const ordered = [...items].sort((a, b) => b.count - a.count);

  return (
    <div className={`popular-requests ${className}`.trim()}>
      <p className="popular-requests__text">{title}</p>
      <div className="popular-requests__wrapper">
        {ordered.map((item) => (
          <Tag
            key={item.label}
            className="popular-requests__tags"
            label={item.label}
            count={showCounts && item.count >= minCount ? item.count : undefined}
            href={item.href}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
