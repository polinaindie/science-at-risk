import { Tag } from '@/components/Tag';

export interface KeywordItem {
  label: string;
  href: string;
  value?: string;
}

export interface KeywordListProps {
  title?: string;
  keywords: KeywordItem[];
  className?: string;
  onKeywordClick?: (keyword: KeywordItem) => void;
}

/**
 * Clickable keyword chips — link to listing filter (`/experts?tag=` or `/societies?tag=`).
 */
export function KeywordList({
  title = 'Ключові слова:',
  keywords,
  className = '',
  onKeywordClick,
}: KeywordListProps) {
  if (!keywords.length) return null;

  return (
    <section className={className.trim()} aria-labelledby="keyword-list-title">
      <h4 id="keyword-list-title" className="mb-3 font-mono text-h3-desktop">
        {title}
      </h4>
      <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
        {keywords.map((k) => (
          <li key={k.value ?? k.label}>
            <Tag
              as="a"
              href={k.href}
              onClick={(e) => {
                if (onKeywordClick) {
                  e.preventDefault();
                  onKeywordClick(k);
                }
              }}
            >
              {k.label}
            </Tag>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default KeywordList;
