import { useState } from 'react';

export interface HeroStoryV4 {
  id: string;
  title: string;
  /** Short line of themes, set beside the title on wide screens. */
  rubric?: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface HomeHeroStoriesIndexV4Props {
  tagline?: string;
  storiesLabel?: string;
  allLabel?: string;
  allHref?: string;
  totalCount?: number;
  stories?: HeroStoryV4[];
  /** Which row reads as active before anyone points at one. */
  defaultActive?: number;
  locale?: string;
  className?: string;
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/** Local files, not scienceatrisk.org URLs — a remote fetch on first hover shows an empty frame. */
const defaultStories: HeroStoryV4[] = [
  {
    id: 'chernobyl',
    title: 'Science in Chernobyl: occupation, recovery, and future challenges',
    rubric: 'Exclusion Zone',
    href: '/story/science-in-chernobyl',
    imageSrc: '/assets/mirror/story.jpg',
    imageAlt: 'Researcher in the Exclusion Zone',
  },
  {
    id: 'kherson-museum',
    title: 'Stolen museum. Kherson',
    rubric: 'Heritage',
    href: '/story/stolen-museum-kherson',
    imageSrc: '/assets/mirror/stolen-museum.png',
    imageAlt: 'Kherson Local History Museum',
  },
  {
    id: 'test-tubes',
    title: "Test Tubes in the Count's Estate",
    rubric: 'Institutes',
    href: '/story/test-tubes-in-the-counts-estate',
    imageSrc: '/assets/mirror/test-tubes.png',
    imageAlt: 'Laboratory glassware',
  },
  {
    id: 'herbarium',
    title: 'The herbarium that survived the shelling',
    rubric: 'Collections',
    href: '/story/herbarium',
    imageSrc: '/assets/mirror/herbarium.png',
    imageAlt: 'Herbarium sheets',
  },
  {
    id: 'fahrenheit',
    title: 'Fahrenheit 451, rewritten by war',
    rubric: 'Libraries',
    href: '/story/fahrenheit',
    imageSrc: '/assets/mirror/fahrenheit.png',
    imageAlt: 'Damaged books',
  },
];

/**
 * The hero as an index of stories: a numbered list on the left, one preview
 * photograph on the right that belongs to whichever row is lit.
 *
 * No carousel and no timer — unlike the V2 hero, this one is meant to be read
 * at the reader's pace, so nothing advances on its own.
 *
 * On touch there is no hover to give, so the preview column is dropped entirely
 * and each row carries its own thumbnail instead; no state stays hidden.
 */
export function HomeHeroStoriesIndexV4({
  tagline = "Research & expertise from Ukraine's scientific frontline",
  storiesLabel = 'Stories',
  allLabel = 'All stories',
  allHref = '/stories',
  totalCount = 71,
  stories = defaultStories,
  defaultActive = 0,
  locale = 'EN',
  className = '',
}: HomeHeroStoriesIndexV4Props) {
  const [active, setActive] = useState(defaultActive);
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';

  return (
    <section
      className={`flex min-h-[calc(100svh-66px)] flex-col bg-brand-white px-6 pt-[66px] pb-6 md:px-10 md:pb-8 ${className}`.trim()}
    >
      <div className="mt-5 flex flex-col gap-3 md:mt-[3svh] md:gap-4">
        <p className="font-mono text-h3-mobile text-brand-black md:text-h3-desktop">{tagline}</p>

        <h1 className="w-full font-serif leading-none" data-hero-wordmark>
          <span className="sr-only">Science At Risk</span>
          <img
            src="/assets/ui/wordmark-hero.svg"
            alt=""
            width={1360}
            height={130}
            className="block h-auto w-full max-w-[1360px] object-contain object-left md:max-h-[11svh]"
          />
        </h1>
      </div>

      {/* The list ends on its own "All stories" row, so the header carries the
          label alone rather than the same link twice. */}
      <div className="mt-5 border-b-2 border-brand-black pb-2 md:mt-[3svh]">
        <p className="font-mono text-text1-desktop text-brand-black">{storiesLabel}</p>
      </div>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-1 gap-8 md:mt-4 md:grid-cols-12">
        <ol className="list-none p-0 md:col-span-7">
          {stories.map((story, index) => {
            const isActive = index === active;
            return (
              <li key={story.id} className="border-b border-brand-line-muted">
                <a
                  href={story.href}
                  aria-current={isActive ? 'true' : undefined}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={`grid grid-cols-[2.25rem_1fr_88px] items-center gap-3 py-3 no-underline motion-safe:transition-colors md:grid-cols-[2.5rem_1fr_auto] md:items-baseline md:gap-4 ${focusRing} ${
                    isActive ? 'text-brand-black' : 'text-brand-black md:text-brand-muted'
                  }`}
                >
                  <span
                    aria-hidden
                    className="font-mono text-breadcrumbs text-brand-muted tabular-nums"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {/* h2 only where six rows of it actually fit; on a short
                      laptop the index would otherwise run past the fold. */}
                  <span className="font-serif text-h3-mobile md:text-h3-desktop [@media(min-height:800px)_and_(min-width:768px)]:text-h2-desktop">
                    {story.title}
                  </span>
                  {/* Phone: the picture rides along with the row, since the
                      preview column has no hover to respond to. */}
                  <img
                    src={story.imageSrc}
                    alt=""
                    loading="lazy"
                    className="aspect-[3/2] w-[88px] object-cover md:hidden"
                  />
                  {story.rubric ? (
                    <span className="hidden font-mono text-breadcrumbs text-brand-muted md:inline">
                      {story.rubric}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}

          <li>
            <a
              href={allHref}
              className={`grid grid-cols-[2.5rem_1fr] items-baseline gap-4 py-3 text-brand-black no-underline ${focusRing}`}
            >
              <span aria-hidden className="font-mono text-breadcrumbs text-brand-muted">
                &rarr;
              </span>
              <span className="font-serif text-h3-mobile md:text-h3-desktop [@media(min-height:800px)_and_(min-width:768px)]:text-h2-desktop">
                <span className="satr-hover-underline">
                  {isUa ? `Усі історії (${totalCount})` : `${allLabel} (${totalCount})`}
                </span>
              </span>
            </a>
          </li>
        </ol>

        {/* Decoration, not a second route into the stories. */}
        <div
          aria-hidden
          className="relative hidden min-h-0 overflow-hidden md:col-span-5 md:block"
        >
          {stories.map((story, index) => (
            <img
              key={story.id}
              src={story.imageSrc}
              alt={story.imageAlt ?? ''}
              fetchPriority={index < 3 ? 'high' : 'auto'}
              loading={index < 3 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 size-full object-cover motion-safe:transition-opacity motion-safe:duration-300 ${
                index === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeHeroStoriesIndexV4;
