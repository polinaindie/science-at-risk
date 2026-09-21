import {
  useCallback,
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

export interface HomeHeroSandboxStory {
  /** Main card heading (Noto Serif). */
  title: string;
  /** Body copy under the title (e-Ukraine). */
  text?: string;
  /** Short line in the top meta row. Falls back to `title`. */
  tabTitle?: string;
  /** Secondary line in the top meta row. Falls back to `text`. */
  tabSubtitle?: string;
  href?: string;
  images: Array<{ src: string; alt?: string }>;
}

export interface HomeHeroSandboxNavItem {
  label: string;
  href: string;
}

export interface HomeHeroSandboxProps {
  stories?: HomeHeroSandboxStory[];
  navItems?: HomeHeroSandboxNavItem[];
  /** Underline the active bottom-nav item (Figma: Infrastructure). */
  activeNavHref?: string;
  locale?: string;
  localeHref?: string;
  autoPlayDuration?: number;
  carouselLabel?: string;
  className?: string;
}

const defaultStories: HomeHeroSandboxStory[] = [
  {
    tabTitle: 'Kharkiv physicists restarted the neutron source',
    tabSubtitle:
      'They restarted the neutron source — and kept research running through blackouts.',
    title: 'Science in Chernobyl: occupation, recovery, and future challenges',
    text: 'How Ukrainian researchers continue field work in the Exclusion Zone despite occupation, infrastructure loss, and the long shadow of the 1986 disaster.',
    href: '/story/science-in-chernobyl',
    images: [
      {
        src: 'https://scienceatrisk.org/storage/lp/138/35bad048a94c9d66ebfeffe80817af579e4a2290.png',
        alt: 'Duga radar near Chernobyl',
      },
    ],
  },
  {
    tabTitle: 'Stolen museum. Kherson',
    tabSubtitle:
      'What did the Russians steal from the Kherson Local History Museum during the retreat?',
    title: 'Stolen museum. Kherson',
    text: 'What did the Russians steal from the Kherson Local History Museum during the retreat from the city and how did the director-collaborator contribute to this?',
    href: '/story/stolen-museum-kherson',
    images: [
      {
        src: 'https://scienceatrisk.org/storage/lp/13/1c9d9f1dc389e5e2561ede474b210a5b32d7ec01.png',
        alt: 'Stolen museum. Kherson',
      },
    ],
  },
  {
    tabTitle: "Test Tubes in the Count's Estate",
    tabSubtitle:
      'The institute has been functioning in Count Glebov’s castle since full-scale war began.',
    title: "Test Tubes in the Count's Estate",
    text: 'The main building of the Institute of Agricultural Microbiology and Industrial Production is located in Count Glebov’s “castle.” Read how the institute has been functioning since the outbreak of full-scale war.',
    href: '/story/test-tubes-in-the-counts-estate',
    images: [
      {
        src: 'https://scienceatrisk.org/storage/lp/131/9463255b2210d4cbe1c460b411ada8ec0bca54cd.png',
        alt: "Test Tubes in the Count's Estate",
      },
    ],
  },
];

const heroNavItemsEn: HomeHeroSandboxNavItem[] = [
  { label: 'Experts', href: '/experts' },
  { label: 'Infrastructure', href: '/infrastructures' },
  { label: 'About the project', href: '/about' },
  { label: 'Stories', href: '/stories' },
  { label: 'Policies', href: '/research' },
  { label: 'Contacts', href: '/contacts' },
];

const heroNavItemsUk: HomeHeroSandboxNavItem[] = [
  { label: 'Експерти', href: '/uk/experts' },
  { label: 'Інфраструктура', href: '/uk/infrastructures' },
  { label: 'Про проєкт', href: '/uk/about' },
  { label: 'Історії', href: '/uk/stories' },
  { label: 'Політики', href: '/uk/research' },
  { label: 'Контакти', href: '/uk/contacts' },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * Homepage hero — Figma Main frame: current/next meta, lead card, wordmark, site nav.
 */
export function HomeHeroSandbox({
  stories = defaultStories,
  navItems,
  activeNavHref,
  locale = 'EN',
  localeHref,
  autoPlayDuration = 7000,
  carouselLabel = 'Featured stories',
  className = '',
}: HomeHeroSandboxProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressCycle, setProgressCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const liveRegionId = useId();
  const total = stories.length;
  const autoPlayEnabled = autoPlayDuration > 0 && total > 1;
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const siteNav = navItems ?? (isUa ? heroNavItemsUk : heroNavItemsEn);
  const localeTarget = isUa ? 'ENG' : 'UKR';
  const localeCurrent = isUa ? 'УКР' : 'eng';
  const resolvedLocaleHref = localeHref ?? (isUa ? '/' : '/uk');
  const resolvedActiveNav =
    activeNavHref ?? (isUa ? '/uk/infrastructures' : '/infrastructures');

  const goTo = useCallback(
    (index: number) => {
      if (!total) return;
      const nextIndex = (index + total) % total;
      if (nextIndex === activeIndex) return;
      setActiveIndex(nextIndex);
      setProgressCycle((cycle) => cycle + 1);
    },
    [activeIndex, total],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  const onCarouselKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  if (!total) return null;

  const current = stories[activeIndex];
  const next = stories[(activeIndex + 1) % total];
  const currentTabTitle = current.tabTitle ?? current.title;
  const currentTabSubtitle = current.tabSubtitle ?? current.text ?? '';
  const nextTabTitle = next.tabTitle ?? next.title;
  const nextTabSubtitle = next.tabSubtitle ?? next.text ?? '';

  const progressStyle = {
    '--satr-hero-progress-duration': `${autoPlayDuration}ms`,
  } as CSSProperties;

  return (
    <section
      className={`flex min-h-0 flex-1 flex-col bg-brand-white ${className}`.trim()}
      aria-label={carouselLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="flex min-h-0 flex-1 flex-col px-6 md:px-10"
        onKeyDown={onCarouselKeyDown}
        aria-live="polite"
        id={liveRegionId}
      >
        {/* Current + next meta — current spans two of three columns */}
        <div className="grid grid-cols-1 gap-y-6 pt-6 md:grid-cols-3 md:gap-x-8 md:gap-y-0">
          <div className="min-w-0 md:col-span-2">
            <p className="truncate font-serif text-text1-mobile text-brand-black md:text-text1-desktop">
              {currentTabTitle}
            </p>
            {currentTabSubtitle ? (
              <p className="truncate font-ukraine text-[12px] font-light text-[#565656]">
                {currentTabSubtitle}
              </p>
            ) : null}
            <div className="mt-7 h-px bg-brand-line-muted" aria-hidden>
              {autoPlayEnabled ? (
                <div
                  key={`${activeIndex}-${progressCycle}`}
                  className="satr-hero-story-progress h-full w-0 bg-brand-black"
                  style={{
                    ...progressStyle,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                  onAnimationEnd={() => {
                    if (!paused) goNext();
                  }}
                />
              ) : (
                <div className="h-full w-full bg-brand-black" />
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            className={`min-w-0 text-left ${focusRing}`}
            aria-label={`Next story: ${nextTabTitle}`}
          >
            <p className="truncate font-serif text-text1-mobile text-brand-muted md:text-text1-desktop">
              {nextTabTitle}
            </p>
            {nextTabSubtitle ? (
              <p className="truncate font-ukraine text-[12px] font-light text-[#747474]">
                {nextTabSubtitle}
              </p>
            ) : null}
            <div className="mt-7 h-px bg-brand-line-muted" aria-hidden />
          </button>
        </div>

        {/* Lead card — photo and copy fill two of three columns. Stacked slides
            share one grid cell (col-start-1/row-start-1) so the track sizes to
            the tallest slide and swapping is a pure opacity/transform crossfade. */}
        <div className="relative grid grid-cols-1 pt-8">
          {stories.map((story, index) => {
            const isActive = index === activeIndex;
            return (
              <article
                key={story.title}
                id={`${liveRegionId}-panel-${index}`}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 grid grid-cols-1 gap-y-6 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:grid-cols-3 md:items-start md:gap-x-8 md:gap-y-0 ${
                  isActive
                    ? 'opacity-100 translate-x-0'
                    : 'pointer-events-none opacity-0 translate-x-3'
                }`}
              >
                <div className="relative aspect-[3/2] bg-brand-line-muted">
                  {story.images[0] ? (
                    <img
                      src={story.images[0].src}
                      alt={story.images[0].alt ?? story.title}
                      className="absolute inset-0 size-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ) : null}
                </div>

                <div className="flex flex-col gap-5">
                  <h2 className="font-serif text-h2-mobile text-brand-black md:text-h2-desktop">
                    {story.href ? (
                      <a href={story.href} className="text-brand-black no-underline">
                        <span className="satr-hover-underline">{story.title}</span>
                      </a>
                    ) : (
                      story.title
                    )}
                  </h2>
                  {story.text ? (
                    <p className="font-ukraine text-text2-mobile font-light text-[#808080] md:text-text2-desktop">
                      {story.text}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {/* Wordmark */}
        <div className="mt-auto pt-10 pb-8">
          <h1 className="w-full font-serif leading-none" data-hero-wordmark>
            <span className="sr-only">Science At Risk</span>
            <img
              src="/assets/ui/wordmark-hero.svg"
              alt=""
              width={1360}
              height={130}
              className="block h-auto w-full"
            />
          </h1>
        </div>
      </div>

      {/* Bottom site nav — rule is inset to the content width */}
      <nav className="px-6 md:px-10" aria-label="Site">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t-2 border-brand-black py-3 md:justify-between md:gap-x-10 md:py-6">
          {siteNav.map((item) => {
            const isActive = item.href === resolvedActiveNav;

            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center font-mono text-h3-mobile text-brand-black no-underline md:text-h3-desktop ${focusRing} ${
                  isActive ? 'underline decoration-brand-black underline-offset-4' : ''
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href={resolvedLocaleHref}
            className={`ml-auto inline-flex min-h-11 items-center font-mono text-h3-mobile text-brand-black no-underline md:ml-0 md:text-h3-desktop ${focusRing}`}
          >
            <span className="underline decoration-brand-black underline-offset-4">
              {localeTarget}
            </span>
            /{localeCurrent}
          </a>
        </div>
      </nav>
    </section>
  );
}

export default HomeHeroSandbox;
