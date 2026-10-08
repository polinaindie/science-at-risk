import { useEffect, useId, useLayoutEffect, useRef, useState, type AnchorHTMLAttributes, type Ref } from 'react';
import { Button } from '@/components/Button';
import { SquircleDefs } from '@/styles/SquircleDefs';
import { useSquircleClipPath } from '@/styles/useSquircleClipPath';
import { Wrapper, rowClass } from '@/components/Layout';
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
  /**
   * `v4` is the v4_Final frame (299:7226): Read Story under the copy, and
   * Back / Other stories / Next across the foot. `museum` is "Stolen museum
   * story" (341:696): the copy on six columns and the photograph on the other
   * six, "Stories" as the link to the list, and Back / Next over a rule at
   * the foot of the copy.
   */
  layout?: 'v4' | 'museum';
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

/* The nine stories on scienceatrisk.org/stories, in the site's order, as of
   2026-10-07; the covers are the ones its list shows. */
export const defaultHomeHeroV4FinalStories: HomeHeroV4FinalStory[] = [
  {
    title: 'Uncovered Graves. How Lviv restores its memory about the school of mathematics',
    description: 'A Map of Burial Sites Revives the Memory of Lviv’s Forgotten Mathematicians',
    href: '/story/uncovered-graves-how-lviv-restores-its-memory-about-the-school-of-mathematics',
    imageSrc: '/assets/stories/uncovered-graves.jpg',
    imageAlt: 'Gravestone of Professor Volodymyr Levytskyi and Sofiia Levytska with grave candles',
  },
  {
    title: 'A Hit Too Close To Home. What happened to the Institute of Biochemistry after a drone strike',
    description: 'How is the Institute of Biochemistry recovering from the attack?',
    href: '/story/a-hit-too-close-to-home-what-happened-to-the-institute-of-biochemistry-after-a-drone-strike',
    imageSrc: '/assets/stories/institute-of-biochemistry.jpg',
    imageAlt: 'A man stands in a doorway of a damaged room with torn-out wiring',
  },
  {
    title: '“Lost Worlds.” How the Russian strike ruined the Chornobyl Museum in Kyiv',
    description: 'We visited the Chornobyl Museum after a Russian strike to see how artifacts and memory are being preserved',
    href: '/story/lost-worlds-how-the-russian-strike-ruined-the-chornobyl-museum-in-kyiv',
    imageSrc: '/assets/stories/chornobyl-museum.jpg',
    imageAlt: 'A museum hall with a shattered ceiling and debris on the floor',
  },
  {
    title: '“We will sow wheat and grow bread”: pitfalls of humanitarian demining in Ukraine',
    description: 'How Humanitarian Demining Works in Ukraine',
    href: '/story/we-will-sow-wheat-and-grow-bread-pitfalls-of-humanitarian-demining-in-ukraine',
    imageSrc: '/assets/stories/humanitarian-demining.jpg',
    imageAlt: 'A deminer sweeps a field with a metal detector',
  },
  {
    title: 'Explosion Residues on Our Tables. How the war impacts the environment and why it’s difficult to study',
    description: 'How Ukraine Is Documenting the Environmental Impact of Russian Aggression',
    href: '/story/explosion-residues-on-our-tables-how-the-war-impacts-the-environment-and-why-its-difficult-to-study',
    imageSrc: '/assets/stories/explosion-residues.jpg',
    imageAlt: 'Two researchers stand side by side in an office',
  },
  {
    title: 'Race Against the War: How Leonid Marushchak and volunteers are rescuing Ukrainian cultural heritage',
    description: 'How to save museum collections during Russia\'s full-scale invasion and who does that',
    href: '/story/race-against-the-war-how-leonid-marushchak-and-volunteers-are-rescuing-ukrainian-cultural-heritage',
    imageSrc: '/assets/stories/race-against-the-war.jpg',
    imageAlt: 'Leonid Marushchak in a cap under a chestnut tree',
  },
  {
    title: 'Closer to Space: How the Chornohora Observatory restarts its operation',
    description: 'Reviving the Observatory on Mount Pip Ivan',
    href: '/story/closer-to-space-how-the-chornohora-observatory-restarts-its-operation',
    imageSrc: '/assets/stories/chornohora-observatory.jpg',
    imageAlt: 'The observatory on the snowy summit of Pip Ivan at sunset',
  },
  {
    title: 'Remembering the Oblivion. How the Odesa National Fine Arts Museum rescued its collection from the Russian attack',
    description: 'How the Odesa National Fine Arts Museum survived a Russian attack',
    href: '/story/remembering-the-oblivion-how-the-odesa-national-fine-arts-museum-rescued-its-collection-from-the-russian-attack',
    imageSrc: '/assets/stories/odesa-fine-arts-museum.jpg',
    imageAlt: 'A museum hall with empty frames on the walls and fragments laid out in display cases',
  },
  {
    title: 'Psychedelic-Assisted Therapy: who it helps and how to do it right',
    description: 'What research shows about psychedelics for treating PTSD and depression',
    href: '/story/psychedelic-assisted-therapy-who-it-helps-and-how-to-do-it-right',
    imageSrc: '/assets/stories/psychedelic-assisted-therapy.jpg',
    imageAlt: 'Illustration of a soldier whose head is a pot of orange trees',
  },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/** The black squircle `Button`, drawn on a link: it goes somewhere, and a
 *  button inside a link is not something a keyboard or a screen reader can
 *  make sense of. */
function SquircleLink({ className = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const squircle = useSquircleClipPath({ radius: 16, smoothing: 0.9 });
  return (
    <a className={`satr-squircle satr-squircle--black no-underline ${className}`.trim()} {...props}>
      <span ref={squircle.ref} className="satr-squircle__bg" style={squircle.style} aria-hidden />
      <SquircleDefs clipId={squircle.clipId} pathD={squircle.pathD} />
      {children}
    </a>
  );
}

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
  tagline = 'Centre of Excellence on Science at Risk, Ukraine',
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
  layout = 'v4',
  className = '',
}: HomeHeroV4FinalProps) {
  const museum = layout === 'museum';
  const id = useId();
  const menuId = `${id}-menu`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const isUk = locale === 'uk';

  // Filling the screen, the museum story's column is as tall as the row and
  // no taller, so the title comes down from 36px only as far as the story on
  // show needs to fit it, Read Story and the pager included. Sized for the
  // story in hand rather than for the longest one, a three-line title keeps
  // its 36px on a screen where a five-line one has to give.
  useLayoutEffect(() => {
    const column = copyRef.current;
    if (!fill || !museum || !column) return;
    const title = column.querySelector<HTMLElement>('[data-story-title]');
    if (!title) return;
    const wide = window.matchMedia('(min-width: 1024px)');

    const fit = () => {
      title.style.fontSize = '';
      if (!wide.matches) return;
      let size = 36;
      title.style.fontSize = `${size}px`;
      // Lines change as the size does, so a few passes rather than one sum.
      for (let pass = 0; pass < 4; pass += 1) {
        const over = column.scrollHeight - column.clientHeight;
        if (over <= 0) break;
        const lines = Math.max(1, Math.round(title.offsetHeight / (size * 1.1667)));
        size = Math.max(20, size - over / (lines * 1.1667) - 0.5);
        title.style.fontSize = `${size}px`;
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(column);
    wide.addEventListener('change', fit);
    void document.fonts?.ready.then(fit);
    return () => {
      observer.disconnect();
      wide.removeEventListener('change', fit);
    };
  }, [fill, museum, index, stories]);

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

        {/* Wordmark and tagline, 35px apart and 35px under the masthead.
            "Stolen museum story" stands them lower, the wordmark's caps 139px
            from the top of its 810px frame; on a shorter screen that gap
            gives first. */}
        <div
          className={`flex flex-col gap-[22px] ${
            masthead ? 'mt-[44px]' : museum ? 'mt-[29px] lg:mt-[clamp(29px,8.3vh,67px)]' : 'mt-[29px]'
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

        <div aria-hidden className={`${museum ? 'mt-[37px]' : 'mt-[44px]'} h-0.5 w-full shrink-0 bg-brand-black`} />

        {museum ? (
          /* "Stolen museum story" (341:696), 41px under the rule. From `lg`
             the two columns are hung off the wordmark above them rather than
             the twelve: the photograph runs from the S to the end of
             "SC!ENCE", the copy from the A of "AT" to the last "!" — 0–667.8,
             706.9–1360 in the wordmark's own 1360 units, so they hold at any
             width the wordmark is drawn at. On a phone the photograph comes
             first, on the twelve columns. The photograph keeps the frame's
             654:355 crop, and from `lg` stretches with the copy beside it
             when that runs taller, so its foot and Back / Next are always
             one line. Filling the screen, it stands as far off the foot
             as off the rule: the 34px every block keeps clear under it,
             and 7 more to make the 41 above. */
          <article
            className={`group/story ${rowClass} mt-[24px] gap-y-[32px] md:mt-[34px] lg:mt-[41px] lg:grid-cols-[minmax(0,667.8fr)_minmax(0,39.1fr)_minmax(0,653.1fr)] lg:gap-0 ${
              fill ? 'lg:mb-[7px] lg:min-h-0 lg:flex-1 lg:grid-rows-[minmax(0,1fr)] lg:[container-type:size]' : ''
            }`}
          >
            {/* The label, the title and the standfirst at the top, Back /
                Other Stories / Next at the foot (341:768). */}
            <div
              ref={copyRef}
              className="col-span-12 flex flex-col justify-between gap-[24px] lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:min-h-0"
            >
              <div className="flex flex-col gap-[16px]">
                <p className="m-0 font-mono text-text1-mobile text-brand-black md:text-text1-desktop">
                  {storiesLabel}
                </p>
                {/* Every story's copy in the one cell, only the current one
                    shown, so Back / Next stay put whatever the length of the
                    title. Filling the screen the row's height is set and the
                    pager stands at its foot anyway, so there only the story
                    on show is drawn, and its title is fitted to the row
                    (above). The story stops at 489px, its width in the
                    frame, so on a big screen its lines don't run the whole
                    column.
                    32px under the standfirst, Read Story comes up while the
                    pointer is anywhere on the story, or the keyboard is in
                    it; its room is kept the rest of the time, so nothing
                    moves when it shows. Only the story on show carries it:
                    kept under every story, it would hold the room under the
                    longest title too, and on a 1440×810 screen take the
                    pager off the foot of it for every story. This way the
                    pager only moves for a title long enough to need it. A
                    touch screen has no hover, so there it is always shown. */}
                <div className="grid" aria-live="polite">
                  {(fill ? [story] : stories).map((item) => (
                    <div
                      key={item.href}
                      className={`col-start-1 row-start-1 flex flex-col gap-[16px] lg:max-w-[489px] ${item === story ? '' : 'invisible'}`}
                    >
                      <h2
                        data-story-title={item === story ? '' : undefined}
                        className="m-0 font-serif text-[28px] font-normal leading-[1.1667] tracking-[-0.02em] text-brand-black md:text-[32px] lg:line-clamp-5 lg:text-[36px]"
                      >
                        <a href={item.href} className={`satr-hover-underline text-brand-black ${focusRing}`}>
                          {item.title}
                        </a>
                      </h2>
                      {item.description ? (
                        <p className="m-0 font-mono text-[15px] leading-[22px] text-brand-black md:text-[18px] md:leading-[23px]">
                          {item.description}
                        </p>
                      ) : null}
                      {item === story ? (
                        <SquircleLink
                          href={item.href}
                          aria-label={`${readLabel}: ${item.title}`}
                          className={`mt-[16px] self-start opacity-0 transition-opacity duration-200 group-focus-within/story:opacity-100 group-hover/story:opacity-100 [@media(hover:none)]:opacity-100 ${focusRing}`}
                        >
                          {readLabel}
                        </SquircleLink>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pager (341:788), level with the foot of the photograph:
                  Other Stories in the middle of the column whatever the
                  width of Back and Next either side. */}
              <nav
                aria-label={storiesLabel}
                className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-[12px]"
              >
                <button
                  type="button"
                  className={`cursor-pointer justify-self-start border-0 bg-transparent p-0 font-mono text-text1-mobile text-brand-black md:text-text1-desktop ${focusRing}`}
                  onClick={() => step(-1)}
                >
                  <span className="satr-hover-underline">{backLabel}</span>
                </button>
                <a
                  href={otherHref}
                  className={`satr-underlined whitespace-nowrap font-mono text-text1-mobile text-brand-black md:text-text1-desktop ${focusRing}`}
                >
                  {otherLabel}
                </a>
                <button
                  type="button"
                  className={`cursor-pointer justify-self-end border-0 bg-transparent p-0 font-mono text-text1-mobile text-brand-black md:text-text1-desktop ${focusRing}`}
                  onClick={() => step(1)}
                >
                  <span className="satr-hover-underline">{nextLabel}</span>
                </button>
              </nav>
            </div>

            <div
              className={`relative order-first col-span-12 aspect-[654/355] w-full overflow-hidden bg-brand-line-muted lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:self-stretch ${
                fill ? 'lg:aspect-auto lg:h-full' : ''
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
        ) : (
          <>

        {/* The story (299:7419): copy 597 wide, photograph 666×428. Filling,
            the one row is held to the height it is given — an auto row would
            grow with a long story's copy and take the photograph down over
            the pager — and that height is a container the title is sized
            against, below. */}
        <article
          className={`mt-6 flex flex-col-reverse gap-8 md:mt-[34px] lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 ${
            fill ? 'lg:min-h-0 lg:flex-1 lg:grid-rows-[minmax(0,1fr)] lg:[container-type:size]' : ''
          }`}
          aria-live="polite"
        >
          {/* Every story's copy is laid in the one cell and only the current
              one shown, so the column is always as tall as the longest and
              the pager stays put as Back / Next step through them. The
              hidden ones are `visibility: hidden`: out of the tab order and
              unread. The title and its line sit at the top, the button at
              the foot, whatever the length between. */}
          <div className="grid lg:col-span-5">
            {stories.map((item) => (
              <div
                key={item.href}
                className={`col-start-1 row-start-1 flex flex-col justify-between gap-8 lg:gap-10 ${
                  item === story ? '' : 'invisible'
                }`}
              >
                <div className="flex flex-col gap-3 lg:gap-4">
                  <p className="m-0 font-mono text-text1-mobile text-brand-black md:text-text1-desktop">
                    {storiesLabel}
                  </p>
                  <div className="flex flex-col gap-4">
                    {/* The site's titles run to a hundred-odd characters; beside
                        the photograph they stop at four lines, the whole title
                        still in the link for anyone reading it out. Filling,
                        four lines and everything else in the copy (215px:
                        the label, a three-line standfirst, the button and the
                        gaps) have to fit the row, so the title comes down
                        from its size on a screen too short for it. */}
                    <h2
                      className={`m-0 font-serif text-[clamp(1.75rem,1.1rem+2.6vw,2.75rem)] font-normal leading-[1.15] tracking-[-0.02em] text-brand-black lg:line-clamp-4 ${
                        fill
                          ? 'lg:text-[length:min(clamp(1.75rem,1.1rem+2.6vw,2.75rem),calc((100cqh-215px)/4.6))]'
                          : ''
                      }`}
                    >
                      <a href={item.href} className={`satr-hover-underline text-brand-black ${focusRing}`}>
                        {item.title}
                      </a>
                    </h2>
                    {item.description ? (
                      <p className="m-0 max-w-[395px] font-ukraine text-[16px] font-light leading-[normal] text-[#717171]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
                <a href={item.href} aria-label={`${readLabel}: ${item.title}`} className={`self-start ${focusRing}`}>
                  <Button variant="black" tabIndex={-1}>
                    {readLabel}
                  </Button>
                </a>
              </div>
            ))}
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
          </>
        )}
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
