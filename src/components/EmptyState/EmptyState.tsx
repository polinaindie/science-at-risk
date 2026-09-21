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
    <div className="nothing">
      <h2 className="nothing__title">{title}</h2>
      <p className="nothing__text">{text}</p>
      {suggestions.length > 0 && (
        <ul className="nothing__list-tags">
          {suggestions.map((label) => (
            <li key={label} className="nothing__tag btn btn--bordered">
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
