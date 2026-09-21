import { Tag } from '@/components/Tag';

export interface StoryCardProps {
  title: string;
  excerpt?: string;
  date?: string;
  /** Optional rubric label above the title. */
  rubric?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Heading level — lower it to 3 when the card sits under a section heading. */
  headingLevel?: 2 | 3;
  className?: string;
}

/** Story list card — rubric → action title → deck → date. */
export function StoryCard({
  title,
  excerpt,
  date,
  rubric,
  href = '#',
  imageSrc = '/assets/mirror/story.jpg',
  imageAlt = '',
  headingLevel = 2,
  className = '',
}: StoryCardProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    <article className={`group mb-0 ${className}`.trim()}>
      <a href={href} className="block text-brand-black no-underline">
        <div className="relative mb-4 overflow-hidden md:mb-6" style={{ paddingTop: '67.3%' }}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <header className="mb-3">
          {rubric ? (
            <p className="mb-3">
              <Tag as="span" appearance="label">
                {rubric}
              </Tag>
            </p>
          ) : null}
          <Heading className="font-serif text-h2-mobile md:text-h2-desktop">
            <span className="satr-hover-underline">{title}</span>
          </Heading>
        </header>
        {excerpt ? (
          <p className="font-ukraine text-text2-mobile font-light md:text-text2-desktop">{excerpt}</p>
        ) : null}
        {date ? <p className="mt-3 font-mono text-breadcrumbs text-brand-muted">{date}</p> : null}
      </a>
    </article>
  );
}

export default StoryCard;
