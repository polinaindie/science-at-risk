import { useEffect, useId, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';

export interface HomeHeroSearchV2Story {
  title: string;
  /** Short line under the title — the story's themes, like the reference's project tags. */
  rubric?: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface HomeHeroSearchV2QuickLink {
  label: string;
  count?: number | string;
  href: string;
}

export interface HomeHeroSearchV2Props {
  tagline?: string;
  placeholder?: string;
  buttonLabel?: string;
  storiesLabel?: string;
  storiesLinkLabel?: string;
  storiesHref?: string;
  stories?: HomeHeroSearchV2Story[];
  /** Milliseconds each story holds before the hero advances. 0 disables it. */
  storyDuration?: number;
  quickLinks?: HomeHeroSearchV2QuickLink[];
  locale?: string;
  localeHref?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const defaultStories: HomeHeroSearchV2Story[] = [
  {
    title: 'Science in Chernobyl: occupation, recovery, and future challenges',
    rubric: 'Exclusion Zone, Field work',
    href: '/story/science-in-chernobyl',
    imageSrc:
      'https://scienceatrisk.org/storage/lp/138/35bad048a94c9d66ebfeffe80817af579e4a2290.png',
    imageAlt: 'Duga radar near Chernobyl',
  },
  {
    title: 'Stolen museum. Kherson',
    rubric: 'Heritage, Occupation',
    href: '/story/stolen-museum-kherson',
    imageSrc: 'https://scienceatrisk.org/storage/lp/13/1c9d9f1dc389e5e2561ede474b210a5b32d7ec01.png',
    imageAlt: 'Kherson Local History Museum',
  },
  {
    title: "Test Tubes in the Count's Estate",
    rubric: 'Institutes, Wartime research',
    href: '/story/test-tubes-in-the-counts-estate',
    imageSrc:
      'https://scienceatrisk.org/storage/lp/131/9463255b2210d4cbe1c460b411ada8ec0bca54cd.png',
    imageAlt: 'Institute of Agricultural Microbiology',
  },
];

/** V2 order — Stories lead, then Experts, then Research. */
const defaultQuickLinks: HomeHeroSearchV2QuickLink[] = [
  { label: 'Stories', count: 28, href: '/stories' },
  { label: 'Experts', href: '/experts' },
  { label: 'Research', count: 367, href: '/research' },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * V2 homepage hero — deliberately spare: wordmark, one line of search, and a
 * single featured story as the hook. The popular-search tags and the three-up
 * story grid of the earlier draft are gone; they filled the screen and left
 * nothing for the eye to land on. The quick-link row leads with Stories, then
 * Experts, then Research.
 */
export function HomeHeroSearchV2({
  tagline = "Research & expertise from Ukraine's scientific frontline",
  placeholder = 'Scientific field or name',
  buttonLabel = 'Find a scientist',
  storiesLabel = 'Stories',
  storiesLinkLabel = 'All stories',
  storiesHref = '/stories',
  stories = defaultStories,
  storyDuration = 6000,
  quickLinks = defaultQuickLinks,
  locale = 'EN',
  localeHref = '/uk',
  onSearch,
  className = '',
}: HomeHeroSearchV2Props) {
  const id = useId();
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const localeTarget = isUa ? 'ENG' : 'УКР';

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = stories.length;
  const featured = stories[active];
  // Bumped on every manual pick so the timer (and its bar) restarts on the story
  // the reader just chose, even when they pick the one already showing.
  const [cycle, setCycle] = useState(0);

  const select = (index: number) => {
    setActive(index);
    setCycle((c) => c + 1);
  };

  useEffect(() => {
    if (total < 2 || paused || storyDuration <= 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % total), storyDuration);
    return () => window.clearTimeout(timer);
  }, [active, cycle, paused, storyDuration, total]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch?.(String(fd.get('q') ?? ''));
  };

  return (
    <section
      className={`flex h-[100svh] min-h-[100svh] flex-col overflow-hidden bg-brand-accent-blue px-6 pt-6 pb-8 md:px-10 md:pt-8 md:pb-10 ${className}`.trim()}
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

      <div className="mt-[5svh] flex flex-col gap-5">
        <p className="font-mono text-h3-mobile text-brand-black md:text-h3-desktop">{tagline}</p>

        <h1 className="w-full font-serif leading-none" data-hero-wordmark>
          <span className="sr-only">Science At Risk</span>
          <img
            src="/assets/ui/wordmark-hero.svg"
            alt=""
            width={1360}
            height={130}
            /* Height tracks the viewport so short laptops don't spend the
               whole screen on the wordmark. */
            className="block h-auto max-h-[12svh] w-full max-w-[1360px] object-contain object-left"
          />
        </h1>
      </div>

      <form className="mt-[4svh] flex flex-col gap-5" onSubmit={handleSubmit} aria-label={placeholder}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <label className="flex-1 font-mono text-breadcrumbs text-brand-black" htmlFor={id}>
            <span className="sr-only">{placeholder}</span>
            <input
              id={id}
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

      {/* Story rail — the headers stand in a row, the one on air is black with a
          bar counting down while the rest sit back in grey, and the image below
          belongs to whichever header is lit. Pointer or keyboard takes over the
          rotation; it resumes on leave. */}
      <div
        className="mt-[4svh] flex min-h-0 flex-1 flex-col gap-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex items-baseline justify-between gap-6">
          <p className="font-mono text-text1-desktop text-brand-black">{storiesLabel}</p>
          <a
            href={storiesHref}
            className={`inline-flex items-center gap-[5px] font-mono text-text1-desktop text-brand-black no-underline ${focusRing}`}
          >
            <span aria-hidden>&gt;&gt;</span>
            <span className="satr-hover-underline">{storiesLinkLabel}</span>
          </a>
        </div>

        <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 md:gap-8">
          {stories.map((story, index) => {
            const isActive = index === active;
            return (
              <li key={story.href}>
                <a
                  href={story.href}
                  aria-current={isActive ? 'true' : undefined}
                  onMouseEnter={() => select(index)}
                  onFocus={() => {
                    setPaused(true);
                    select(index);
                  }}
                  onBlur={() => setPaused(false)}
                  className={`block no-underline transition-colors duration-300 ${focusRing} ${
                    isActive ? 'text-brand-black' : 'text-brand-black/35'
                  }`}
                >
                  <span
                    className="block h-0.5 w-full overflow-hidden bg-brand-black/15"
                    aria-hidden
                  >
                    <span
                      key={`${index}-${cycle}-${active}`}
                      className={`block h-full bg-brand-black ${
                        isActive ? 'satr-hero-timer' : 'w-0'
                      }`}
                      style={
                        isActive
                          ? ({ animationDuration: `${storyDuration}ms` } as const)
                          : undefined
                      }
                    />
                  </span>
                  <span className="mt-3 block font-serif text-h3-mobile md:text-h3-desktop">
                    {story.title}
                  </span>
                  {story.rubric ? (
                    <span className="mt-1 block font-mono text-breadcrumbs">{story.rubric}</span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        {featured ? (
          <a
            href={featured.href}
            tabIndex={-1}
            aria-hidden
            /* Phone: the three stacked headers leave no slack, so the image
               takes a fixed slice. Desktop: it soaks up what is left. */
            className="group relative block h-[15svh] shrink-0 overflow-hidden md:h-auto md:min-h-0 md:flex-1"
          >
            {stories.map((story, index) => (
              <img
                key={story.href}
                src={story.imageSrc}
                alt=""
                className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                  index === active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </a>
        ) : null}
      </div>

      <div className="mt-auto border-t-2 border-brand-black pt-6">
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

export default HomeHeroSearchV2;
