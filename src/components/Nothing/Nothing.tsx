import { Tag } from '@/components/Tag';

export interface NothingProps {
  title?: string;
  text?: string;
  /**
   * Optional alternate suggestions — must NOT repeat the same popular tags
   * already shown in SearchHero (avoids the “duplicate tags” empty state).
   * Prefer leaving empty so the empty state only advises changing the query.
   */
  suggestions?: string[];
  onSuggestionClick?: (tag: string) => void;
  className?: string;
}

/** Empty search state from mirror (`.nothing`) — no duplicate popular tags. */
export function Nothing({
  title = 'Nothing found',
  text = 'Try another keyword or clear filters and search again.',
  suggestions = [],
  onSuggestionClick,
  className = '',
}: NothingProps) {
  return (
    <div className={`py-16 text-center ${className}`.trim()} role="status">
      <h2 className="font-serif text-h2-desktop text-brand-black">{title}</h2>
      <p className="mx-auto mt-4 max-w-md font-ukraine text-text2-desktop font-light text-brand-black">
        {text}
      </p>
      {suggestions.length ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {suggestions.map((s) => (
            <Tag key={s} onClick={() => onSuggestionClick?.(s)}>
              {s}
            </Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Nothing;
