import { useId, useRef, type FormEvent, type Ref } from 'react';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';

export interface HomeHeroSearchTag {
  label: string;
  count?: number | string;
  href?: string;
}

export interface HomeHeroSearchQuickLink {
  label: string;
  count?: number | string;
  href: string;
}

export interface HomeHeroSearchProps {
  tagline?: string;
  placeholder?: string;
  buttonLabel?: string;
  popularLabel?: string;
  popularTags?: HomeHeroSearchTag[];
  quickLinks?: HomeHeroSearchQuickLink[];
  /** The wordmark, so the page can fly it into the bar. */
  wordmarkRef?: Ref<HTMLHeadingElement>;
  onSearch?: (query: string) => void;
  className?: string;
}

const defaultTags: HomeHeroSearchTag[] = [
  { label: 'Physical sciences', count: 12, href: '/experts?tag=physical-sciences' },
  { label: 'Social sciences', count: 5, href: '/experts?tag=social-sciences' },
  { label: 'Technology', count: 8, href: '/experts?tag=technology' },
  { label: 'Arts & humanities', count: 1, href: '/experts?tag=humanities' },
  { label: 'Life sciences & biomedicine', count: 22, href: '/experts?tag=life-sciences' },
];

const defaultQuickLinks: HomeHeroSearchQuickLink[] = [
  { label: 'Scientists', href: '/experts' },
  { label: 'Societies', href: '/societies' },
  { label: 'Infrastructure', href: '/infrastructures' },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * Homepage hero variant — search bar and stat links instead of the story
 * carousel (Figma node 46:3286). Tagline, wordmark, inline search, popular
 * tags, then a row of section links (Scientists / Societies / Infrastructure).
 */
export function HomeHeroSearch({
  tagline = "Research & expertise from Ukraine's scientific frontline",
  placeholder = 'Scientific field or name',
  buttonLabel = 'Find a scientist',
  popularLabel = 'Popular searches',
  popularTags = defaultTags,
  quickLinks = defaultQuickLinks,
  wordmarkRef,
  onSearch,
  className = '',
}: HomeHeroSearchProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch?.(String(fd.get('q') ?? ''));
  };

  return (
    // The page's bar stands over the top of the hero rather than in it, so the
    // hero keeps its height clear: 86px, the bar's own (Figma node 230:5498).
    <section
      className={`flex min-h-[100svh] flex-col bg-brand-accent-blue pt-[86px] ${className}`.trim()}
    >
      <div className="flex flex-1 flex-col px-6 pb-8 md:px-10 md:pb-10">
        <div className="mt-14 flex flex-col gap-7">
          <p className="font-mono text-h3-mobile text-brand-black md:text-h3-desktop">{tagline}</p>

          <h1 ref={wordmarkRef} className="w-full font-serif leading-none" data-hero-wordmark>
            <span className="sr-only">Science At Risk</span>
            <img
              src="/assets/ui/wordmark-hero.svg"
              alt=""
              width={1360}
              height={130}
              className="block h-auto w-full max-w-[1360px]"
            />
          </h1>
        </div>

        <form className="mt-12 flex flex-col gap-7" onSubmit={handleSubmit} aria-label={placeholder}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <label className="flex-1 font-mono text-breadcrumbs text-brand-black" htmlFor={id}>
              <span className="sr-only">{placeholder}</span>
              <input
                id={id}
                ref={inputRef}
                name="q"
                className="w-full border-0 bg-transparent font-ukraine text-[22px] leading-[28px] font-light text-brand-black outline-none placeholder:text-brand-black/40 focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2"
                placeholder={placeholder}
              />
            </label>
            <Button type="submit" variant="black" className="shrink-0">
              {buttonLabel}
            </Button>
          </div>
          <div className="h-0.5 w-full bg-brand-black" aria-hidden />
        </form>

        <div className="mt-[6svh]">
          <p className="mb-[18px] font-mono text-text1-desktop">{popularLabel}</p>
          <div className="flex flex-wrap gap-2.5" role="list">
            {popularTags.map((tag) =>
              tag.href ? (
                <span role="listitem" key={tag.href}>
                  <Tag as="a" href={tag.href} count={tag.count}>
                    {tag.label}
                  </Tag>
                </span>
              ) : (
                <span role="listitem" key={tag.label}>
                  <Tag as="span" count={tag.count}>
                    {tag.label}
                  </Tag>
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mt-auto border-t-2 border-brand-black pt-9">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-[5px] font-mono text-h3-mobile text-brand-black md:text-h3-desktop ${focusRing}`}
              >
                <span aria-hidden>&gt;&gt;</span>
                <span className="satr-hover-underline">{link.label}</span>
                {link.count !== undefined ? (
                  <span className="text-text1-mobile text-brand-muted md:text-text1-desktop">
                    ({link.count})
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHeroSearch;
