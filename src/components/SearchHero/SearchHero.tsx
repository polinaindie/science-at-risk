import { useId, useRef, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs';
import { Tag } from '@/components/Tag';

export interface PopularTag {
  label: string;
  count?: number | string;
  value?: string;
  /** When set, tag navigates (clears text search via URL contract). */
  href?: string;
}

export interface SearchHeroProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  placeholder?: string;
  buttonLabel?: string;
  popularLabel?: string;
  popularTags?: PopularTag[];
  /** Explainer under the field; when set, tags move into a second column. */
  note?: string;
  noteLinkLabel?: string;
  noteHref?: string;
  /**
   * Example of a real collaboration query — frames the database as partners,
   * not a list of victims.
   */
  exampleQuery?: string;
  exampleLabel?: string;
  /** Lower to 2 when the block sits inside a page that already has an h1. */
  headingLevel?: 1 | 2;
  /** Controlled / default text query shown in the field. */
  defaultQuery?: string;
  /** Currently selected tag value (highlights matching chip). */
  selectedTag?: string;
  onSearch?: (query: string) => void;
  /**
   * Fired when a popular tag is activated. Callers should clear the text
   * query and filter by tag only (never combine leftover search + tag).
   */
  onTagClick?: (tag: PopularTag) => void;
  className?: string;
}

/** Experts / search blue hero (`.search-hero` + `.popular-requests`). */
export function SearchHero({
  title,
  breadcrumbs,
  placeholder = 'Name, specialty, institution',
  buttonLabel = 'Find a scientist',
  popularLabel = 'Popular requests',
  popularTags = [],
  note,
  noteLinkLabel,
  noteHref,
  exampleQuery,
  exampleLabel = 'Try a query like',
  headingLevel = 1,
  defaultQuery = '',
  selectedTag,
  onSearch,
  onTagClick,
  className = '',
}: SearchHeroProps) {
  const id = useId();
  const exampleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const Heading = headingLevel === 2 ? 'h2' : 'h1';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch?.(String(fd.get('q') ?? ''));
  };

  const handleTagActivate = (tag: PopularTag) => {
    // Clear text field so tag filter is not combined with leftover query.
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onTagClick?.(tag);
  };

  const useExample = () => {
    if (!exampleQuery || !inputRef.current) return;
    inputRef.current.value = exampleQuery;
    inputRef.current.focus();
  };

  const tagsBlock = popularTags.length ? (
    <div>
      <p className="mb-3 font-mono text-text1-desktop">{popularLabel}</p>
      <div className="flex flex-wrap gap-2.5" role="list">
        {popularTags.map((tag) => {
          const isSelected =
            selectedTag !== undefined && (tag.value === selectedTag || tag.label === selectedTag);
          const selectedClass = isSelected ? 'ring-2 ring-brand-black ring-offset-2' : undefined;

          if (tag.href) {
            return (
              <span role="listitem" key={tag.value ?? tag.label}>
                <Tag
                  as="a"
                  href={tag.href}
                  count={tag.count}
                  className={selectedClass}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={(e) => {
                    if (onTagClick) {
                      e.preventDefault();
                      handleTagActivate(tag);
                    } else {
                      handleTagActivate(tag);
                    }
                  }}
                >
                  {tag.label}
                </Tag>
              </span>
            );
          }

          return (
            <span role="listitem" key={tag.value ?? tag.label}>
              <Tag
                count={tag.count}
                className={selectedClass}
                aria-pressed={isSelected}
                onClick={() => handleTagActivate(tag)}
              >
                {tag.label}
              </Tag>
            </span>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <section
      className={`bg-brand-accent-blue px-6 pb-14 pt-2 md:px-10 md:pb-16 md:pt-6 ${className}`.trim()}
    >
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="max-w-[420px]">
        <Heading className="font-serif text-h1-mobile md:text-h1-desktop" id={id}>
          {title}
        </Heading>
      </div>
      <form className="mt-8" onSubmit={handleSubmit} aria-labelledby={id}>
        <div className="flex flex-col gap-4 border-b-2 border-brand-black pb-6 md:flex-row md:items-end md:gap-6">
          <label className="flex-1 font-mono text-breadcrumbs text-brand-black">
            <span className="mb-1 block">{placeholder}</span>
            <input
              ref={inputRef}
              name="q"
              defaultValue={defaultQuery}
              key={defaultQuery}
              aria-describedby={exampleQuery ? exampleId : undefined}
              className="w-full border-0 bg-transparent font-ukraine text-[16px] font-light text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2"
              placeholder={placeholder}
            />
          </label>
          <Button type="submit" variant="black">
            {buttonLabel}
          </Button>
        </div>
      </form>

      {exampleQuery ? (
        <p id={exampleId} className="mt-4 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
          <span className="font-mono text-breadcrumbs text-brand-muted">{exampleLabel}: </span>
          <button
            type="button"
            onClick={useExample}
            className="satr-hover-underline border-0 bg-transparent p-0 text-left font-ukraine text-text2-mobile font-light text-brand-black md:text-text2-desktop"
          >
            “{exampleQuery}”
          </button>
        </p>
      ) : null}

      {note ? (
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <p className="font-ukraine text-text2-mobile font-light md:text-text2-desktop">{note}</p>
            {noteHref && noteLinkLabel ? (
              <a
                href={noteHref}
                className="satr-hover-underline mt-4 inline-block font-mono text-text1-desktop"
              >
                {noteLinkLabel}
              </a>
            ) : null}
          </div>
          {tagsBlock ? <div className="md:col-span-7 md:col-start-6">{tagsBlock}</div> : null}
        </div>
      ) : tagsBlock ? (
        <div className="mt-8">{tagsBlock}</div>
      ) : null}
    </section>
  );
}

export default SearchHero;
