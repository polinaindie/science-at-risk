import { useId, useRef, type FormEvent } from 'react';
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
  locale?: string;
  localeHref?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const defaultTags: HomeHeroSearchTag[] = [
  { label: 'Фізичні науки', count: 12, href: '/experts?tag=physical-sciences' },
  { label: 'Соціальні науки', count: 5, href: '/experts?tag=social-sciences' },
  { label: 'Технології', count: 8, href: '/experts?tag=technology' },
  { label: 'Мистецтво та гуманіатарні науки', count: 1, href: '/experts?tag=humanities' },
  { label: 'Науки про житття та біомедицина', count: 22, href: '/experts?tag=life-sciences' },
];

const defaultQuickLinks: HomeHeroSearchQuickLink[] = [
  { label: 'Scientists', href: '/experts' },
  { label: 'Stories', count: 28, href: '/stories' },
  { label: 'Researches', count: 367, href: '/whitepapers' },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * Homepage hero variant — search bar and stat links instead of the story
 * carousel (Figma node 46:3286). Tagline, wordmark, inline search, popular
 * tags, then a row of site-wide counts (Stories / Societies / Researches /
 * Infrastructure).
 */
export function HomeHeroSearch({
  tagline = "Research & expertise from Ukraine's scientific frontline",
  placeholder = 'Scientific field or name',
  buttonLabel = 'Find a scientist',
  popularLabel = 'Популярні запити',
  popularTags = defaultTags,
  quickLinks = defaultQuickLinks,
  locale = 'EN',
  localeHref = '/uk',
  onSearch,
  className = '',
}: HomeHeroSearchProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const localeTarget = isUa ? 'ENG' : 'УКР';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch?.(String(fd.get('q') ?? ''));
  };

  return (
    <section
      className={`flex min-h-[100svh] flex-col bg-brand-accent-blue px-6 pt-6 pb-8 md:px-10 md:pt-8 md:pb-10 ${className}`.trim()}
    >
      <div className="flex items-center justify-between">
        <a href={localeHref} className={`font-mono text-h3-mobile no-underline md:text-h3-desktop ${focusRing}`}>
          <span className="underline decoration-brand-black underline-offset-4">{isUa ? 'УКР' : 'ENG'}</span>
          /{localeTarget}
        </a>
        <a href="/" className={`font-serif text-h2-mobile no-underline md:text-h2-desktop ${focusRing}`} aria-label="Science At Risk">
          !!!
        </a>
        <button type="button" aria-label="Open menu" className={`flex min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 ${focusRing}`}>
          <img src="/assets/ui/hamburger-dark.svg" alt="" width={30} height={22} className="h-[22px] w-[30px]" />
        </button>
      </div>

      <div className="mt-14 flex flex-col gap-7">
        <p className="font-mono text-h3-mobile text-brand-black md:text-h3-desktop">{tagline}</p>

        <h1 className="w-full font-serif leading-none" data-hero-wordmark>
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
    </section>
  );
}

export default HomeHeroSearch;
