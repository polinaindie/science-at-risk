import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';

export interface ExpertTag {
  label: string;
  href?: string;
  value?: string;
}

export interface ExpertCardProps {
  name: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  subtitle?: string;
  organization?: string;
  description?: string;
  /** Tags may be plain strings or links to `/experts?tag=…`. */
  tags?: Array<string | ExpertTag>;
  ctaLabel?: string;
  /** Heading level — lower it to 3 when the card sits under a section heading. */
  headingLevel?: 2 | 3;
  className?: string;
  onTagClick?: (tag: ExpertTag) => void;
}

function normalizeTag(t: string | ExpertTag): ExpertTag {
  return typeof t === 'string' ? { label: t } : t;
}

/** Expert list row from mirror (`.expert-card`). */
export function ExpertCard({
  name,
  href = '#',
  imageSrc = '/assets/mirror/expert.jpg',
  imageAlt = '',
  subtitle,
  organization,
  description,
  tags = [],
  ctaLabel = 'More details',
  headingLevel = 2,
  className = '',
  onTagClick,
}: ExpertCardProps) {
  const normalized = tags.map(normalizeTag);
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    <article
      className={`group relative border-b-2 border-brand-black py-6 md:py-10 ${className}`.trim()}
    >
      <div className="flex gap-8">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="hidden size-[220px] shrink-0 object-cover md:block"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <header className="mb-4 flex items-start justify-between gap-4">
            <Heading className="font-serif text-h2-mobile text-brand-black md:text-h2-desktop">
              <span className="satr-hover-underline">{name}</span>
            </Heading>
            <div className="hidden opacity-0 transition-opacity group-hover:opacity-100 md:block">
              <Button variant="black">{ctaLabel}</Button>
            </div>
          </header>
          {subtitle ? (
            <p className="mb-4 font-mono text-h3-mobile md:text-text1-desktop">{subtitle}</p>
          ) : null}
          {organization ? (
            <p className="mb-2 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
              {organization}
            </p>
          ) : null}
          {description ? (
            <p className="mb-6 max-w-[840px] font-ukraine text-text2-mobile font-light md:text-text2-desktop">
              {description}
            </p>
          ) : null}
          {normalized.length ? (
            <ul className="relative z-20 m-0 flex list-none flex-wrap gap-2.5 p-0">
              {normalized.map((t) => (
                <li key={t.value ?? t.label}>
                  {t.href ? (
                    <Tag
                      as="a"
                      href={t.href}
                      variant="accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTagClick) {
                          e.preventDefault();
                          onTagClick(t);
                        }
                      }}
                    >
                      {t.label}
                    </Tag>
                  ) : (
                    <Tag
                      variant="accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick?.(t);
                      }}
                    >
                      {t.label}
                    </Tag>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <a href={href} className="absolute inset-0 z-10" aria-label={name}>
        <span className="sr-only">{name}</span>
      </a>
    </article>
  );
}

export default ExpertCard;
