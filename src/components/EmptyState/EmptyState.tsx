import { SquircleShape } from '../../styles/SquircleShape';

export interface EmptyStateProps {
  title?: string;
  text?: string;
  /** Suggested queries, rendered as bordered buttons. */
  suggestions?: string[];
  onSelect?: (label: string) => void;
}

/**
 * The site's `.nothing` block — the "no results" state on the list pages,
 * offering popular queries as a way out.
 */
export function EmptyState({
  title = 'We didn’t find anything for your query',
  text = 'Try another keyword, or see popular queries.',
  suggestions = [],
  onSelect,
}: EmptyStateProps) {
  return (
    // `.nothing` is `display: none` on the site until its JS adds
    // `--active`; the component is only ever rendered when it should show.
    <div className="nothing nothing--active">
      <h2 className="nothing__title">{title}</h2>
      <p className="nothing__text">{text}</p>
      {suggestions.length > 0 && (
        <ul className="nothing__list-tags">
          {suggestions.map((label) => (
            // The site shapes the `li` itself, not the button inside it, so
            // the squircle ring goes here rather than on a <Button>.
            <li key={label} className="nothing__tag btn btn--bordered sartr-squircle">
              <SquircleShape radius={60} smoothing={0.9} strokeWidth={1} fill="#000000" />
              <button
                type="button"
                className="nothing__tag-link"
                aria-label={label}
                onClick={() => onSelect?.(label)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
