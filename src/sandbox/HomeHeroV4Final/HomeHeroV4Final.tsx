import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { Button } from '@/components/Button';
import { Wrapper } from '@/components/Layout';
import { MobileNav } from '@/components/MobileNav';

export interface HomeHeroV4FinalNavItem {
  label: string;
  href: string;
}

export interface HomeHeroV4FinalStory {
  title: string;
  description?: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface HomeHeroV4FinalProps {
  /** The sections in the masthead (Figma node 299:7390). */
  navItems?: HomeHeroV4FinalNavItem[];
  locale?: 'en' | 'uk';
  localeHref?: string;
  /** The line under the wordmark. */
  tagline?: string;
  /** Shown one at a time; Back / Next step through them and wrap. */
  stories?: HomeHeroV4FinalStory[];
  storiesLabel?: string;
  readLabel?: string;
  otherLabel?: string;
  otherHref?: string;
  backLabel?: string;
  nextLabel?: string;
  /**
   * Whether the hero draws its own masthead. A page that carries one bar over
   * every block turns this off: the bar is the page's, and the hero starts
   * right under it.
   */
  masthead?: boolean;
  /** The page flies this into the bar. */
  wordmarkRef?: Ref<HTMLHeadingElement>;
  /**
   * For a block whose height is given (the page's deck): the story takes
   * whatever the rest leaves, the photograph fills it, and the copy is centred
   * beside it. Without it the photograph keeps its 666:428 crop.
   */
  fill?: boolean;
  className?: string;
}

const defaultNavItems: HomeHeroV4FinalNavItem[] = [
  { label: 'Scientists', href: '/experts' },
  { label: 'Scientific societies', href: '/societies' },
  { label: 'Research', href: '/research' },
  { label: 'Stories', href: '/stories' },
  { label: 'Infrastructure recovery', href: '/infrastructures' },
  { label: 'About', href: '/about' },
  { label: 'Contacts', href: '/contacts' },
];

/* The first is the frame's own; the rest are stand-ins from the mirror so
   Back / Next have somewhere to go. */
export const defaultHomeHeroV4FinalStories: HomeHeroV4FinalStory[] = [
  {
    title: 'Uncovered Graves. How Lviv restores its memory about the school of mathematics',
    description: 'A Map of Burial Sites Revives the Memory of Lviv’s Forgotten Mathematicians',
    href: '/story/uncovered-graves',
    imageSrc: '/assets/mirror/deminer.jpg',
    imageAlt: 'A deminer sweeps a field with a metal detector between marker tapes',
  },
  {
    title: 'National heritage in test tubes',
    description:
      'A drone strike hit the Palladin Institute of Biochemistry a week after Denys Kolybo became its director',
    href: '/story/national-heritage-in-test-tubes',
    imageSrc: '/assets/mirror/test-tubes.png',
    imageAlt: 'Test tubes with cell collections',
  },
  {
    title: 'An observatory at 2,028 m',
    description: 'The Chornohora Observatory on Pip Ivan is getting a telescope that can be run remotely',
    href: '/story/observatory-at-2028-m',
    imageSrc: '/assets/mirror/story.jpg',
    imageAlt: 'Chornohora Observatory on Pip Ivan',
  },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * Homepage hero, Figma frame "v4_Final" (299:7226) — the whole first screen
 * in one block, on white.
 *
 * The masthead has the "!!!" mark on the left, the seven sections in the
 * middle of the row and the ENG / УКР switch on the right. The seven only fit
 * from `xl`; below that they sit behind the menu button.
 *
 * Under it the wordmark at the full width, the tagline, a rule, then one
 * story: the copy on the left (597 of the frame's 1362), the photograph on
 * the right (666×428). Along the foot, Back / Other stories / Next over a
 * second rule; Back and Next step through `stories`.
 */
export function HomeHeroV4Final({
  navItems = defaultNavItems,
  locale = 'en',
  localeHref = '/uk',
  tagline = 'Innovation Hub for Progress: A Center for Imagination and Teamwork',
  stories = defaultHomeHeroV4FinalStories,
  storiesLabel = 'Stories',
  readLabel = 'Read Story',
  otherLabel = 'Other stories',
  otherHref = '/stories',
  backLabel = '< Back',
  nextLabel = 'Next >',
  masthead = true,
  wordmarkRef,
  fill = false,
  className = '',
}: HomeHeroV4FinalProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isUk = locale === 'uk';

  // Escape closes the menu and hands focus back to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  if (!stories.length) return null;
  const story = stories[index % stories.length];
  const step = (by: number) => setIndex((i) => (i + by + stories.length) % stories.length);

  const current = (
    <span className="font-medium underline underline-offset-4">{isUk ? 'УКР' : 'ENG'}</span>
  );
  const other = (
    <a href={localeHref} className={`satr-hover-underline text-brand-black no-underline ${focusRing}`}>
      {isUk ? 'ENG' : 'УКР'}
    </a>
  );
  const pagerStep =
    'cursor-pointer border-0 bg-transparent p-0 font-mono text-[15px] leading-[26px] md:text-[22px] text-brand-black';

  return (
    <section
      className={`bg-brand-white ${masthead ? 'pt-[26px] pb-[22px]' : ''} ${
        fill ? 'flex h-full flex-col' : ''
      } ${className}`.trim()}
    >
      <Wrapper className={fill ? 'flex min-h-0 flex-1 flex-col' : ''}>
        {masthead ? (
          <>
        {/* Masthead (299:7388): 42px tall, the sections centred on the row
            whatever the width of the mark and the switch either side. */}
        <header className="relative flex min-h-[42px] items-center justify-between">
          <a
            href="/"
            aria-label="Science At Risk"
            className={`satr-dim font-serif text-[26px] leading-[42px] tracking-[-0.02em] text-brand-black no-underline ${focusRing}`}
          >
            !!!
          </a>

          <nav
            aria-label="Main"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:block"
          >
            <ul className="m-0 flex list-none items-center gap-8 p-0">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`satr-hover-underline whitespace-nowrap font-mono text-[16px] leading-[26px] tracking-[-0.005em] text-brand-black ${focusRing}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <p className="m-0 whitespace-nowrap font-mono text-text1-mobile text-brand-black md:text-[18px] md:leading-[23px]">
              {isUk ? other : current}
              <span aria-hidden>/</span>
              {isUk ? current : other}
            </p>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              className={`flex satr-dim min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 xl:hidden ${focusRing}`}
            >
              <img src="/assets/ui/hamburger-dark.svg" alt="" width={30} height={22} className="h-[22px] w-[30px]" />
            </button>
          </div>
        </header>
          </>
        ) : null}

        {/* Wordmark and tagline, 35px apart and 35px under the masthead. */}
        <div
          className={`flex flex-col gap-[22px] ${
            masthead ? 'mt-[44px]' : 'mt-[29px]'
          }`}
        >
          <h1 ref={wordmarkRef} className="m-0 leading-none" data-hero-wordmark>
            <span className="sr-only">Science At Risk</span>
            <img
              src="/assets/ui/wordmark-hero.svg"
              alt=""
              width={1360}
              height={130}
              className="block h-auto w-full"
            />
          </h1>
          <p className="m-0 font-mono text-h3-mobile text-brand-black md:text-h3-desktop">
            {tagline}
          </p>
        </div>

        <div aria-hidden className="mt-[44px] h-0.5 w-full bg-brand-black" />

        {/* The story (299:7419): copy 597 wide, photograph 666×428. */}
        <article
          className={`mt-6 flex flex-col-reverse gap-8 md:mt-[34px] lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 ${
            fill ? 'lg:min-h-0 lg:flex-1' : ''
          }`}
          aria-live="polite"
        >
          <div className="flex flex-col gap-8 lg:col-span-5 lg:gap-10">
            <div className="flex flex-col gap-3 lg:gap-4">
              <p className="m-0 font-mono text-text1-mobile text-brand-black md:text-text1-desktop">
                {storiesLabel}
              </p>
              <div className="flex flex-col gap-4">
                <h2 className="m-0 font-serif text-[clamp(1.75rem,1.1rem+2.6vw,2.75rem)] font-normal leading-[1.15] tracking-[-0.02em] text-brand-black">
                  <a href={story.href} className={`satr-hover-underline text-brand-black ${focusRing}`}>
                    {story.title}
                  </a>
                </h2>
                {story.description ? (
                  <p className="m-0 max-w-[395px] font-ukraine text-[16px] font-light leading-[normal] text-[#717171]">
                    {story.description}
                  </p>
                ) : null}
              </div>
            </div>
            <a href={story.href} aria-label={`${readLabel}: ${story.title}`} className={`self-start ${focusRing}`}>
              <Button variant="black" tabIndex={-1}>
                {readLabel}
              </Button>
            </a>
          </div>

          <div
            className={`relative w-full overflow-hidden bg-brand-line-muted lg:col-span-6 lg:col-start-7 ${
              fill ? 'aspect-[666/428] lg:aspect-auto lg:h-full' : 'aspect-[666/428]'
            }`}
          >
            <img
              key={story.imageSrc}
              src={story.imageSrc}
              alt={story.imageAlt ?? ''}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </article>

        {/* Pager (299:7402): 20px under the story, the rule 16px under the row. */}
        <nav
          aria-label="Stories"
          className="mt-8 md:mt-10 flex shrink-0 items-center justify-between border-b-2 border-brand-black pb-[16px]"
        >
          <button type="button" className={`${pagerStep} ${focusRing}`} onClick={() => step(-1)}>
            <span className="satr-hover-underline">{backLabel}</span>
          </button>
          <a
            href={otherHref}
            className={`satr-underlined font-mono text-[15px] leading-[26px] md:text-[22px] tracking-[-0.03em] text-brand-black ${focusRing}`}
          >
            {otherLabel}
          </a>
          <button type="button" className={`${pagerStep} ${focusRing}`} onClick={() => step(1)}>
            <span className="satr-hover-underline">{nextLabel}</span>
          </button>
        </nav>
      </Wrapper>

      {masthead && menuOpen ? (
        <div id={menuId} className="fixed inset-0 z-[80] flex justify-end xl:hidden">
          <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => setMenuOpen(false)} />
          <div className="relative h-full">
            <MobileNav
              open
              items={navItems}
              tone="light"
              locale={isUk ? 'UA' : 'EN'}
              onClose={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default HomeHeroV4Final;
