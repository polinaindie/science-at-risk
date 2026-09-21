import { Tag } from '../Tag/Tag';

export interface PopularRequest {
  label: string;
  count: number;
  href?: string;
}

export interface PopularRequestsProps {
  title?: string;
  items: PopularRequest[];
  className?: string;
  onSelect?: (label: string) => void;
}

/** The `.popular-requests` cluster under the home-page search field. */
export function PopularRequests({
  title = 'Popular requests',
  items,
  className = '',
  onSelect,
}: PopularRequestsProps) {
  return (
    <div className={`popular-requests ${className}`.trim()}>
      <p className="popular-requests__text">{title}</p>
      <div className="popular-requests__wrapper">
        {items.map((item) => (
          <Tag
            key={item.label}
            className="popular-requests__tags"
            label={item.label}
            count={item.count}
            href={item.href}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
