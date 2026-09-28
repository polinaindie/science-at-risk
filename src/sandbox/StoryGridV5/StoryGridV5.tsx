import { useState, type CSSProperties } from 'react';
import { Wrapper, Row, Col } from '@/components/Layout';

export interface StoryCardV5 {
  id: string;
  /** The line over the headline (Figma node 225:8822). */
  kind?: string;
  /** Topics the story sits under. A story usually carries more than one. */
  tags?: string[];
  title: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface PagerLinkV5 {
  label: string;
  href?: string;
}

export interface StoryGridV5Props {
  showHeading?: boolean;
  heading?: string;
  /** Small line under the section heading. */
  eyebrow?: string;
  /** One set per page. `stories` still works and counts as a single page. */
  stories?: StoryCardV5[];
  pages?: StoryCardV5[][];
  /** Which set is on show. Leave it out and the pager keeps its own count. */
  page?: number;
  onPageChange?: (page: number) => void;
  /** Figma node 94:10608 — Back / Other Stories / Forward under the rule. */
  showPager?: boolean;
  /**
   * 0 hides the pager, 1 shows it. The pager rides the bottom of the viewport
   * while the grid is the block on screen, so a page that scrolls into this
   * one can hold it back until the grid has actually arrived — otherwise it
   * would be pinned in view from the first pixel of scroll.
   */
  pagerReveal?: number;
  /**
   * The ground this sits on. False is the accent blue of the resting page
   * (Figma node 94:10145) with black ink; true is the black the panel turns
   * as it takes the page over. Driven continuously by the page's scroll, so
   * the grid changes ground in step with the bar above it.
   */
  dark?: boolean;
  /**
   * Whether the grid has a height to fill. Left alone, a card is as tall as its
   * 3:2 photograph makes it and the grid is as tall as that — which is what any
   * page that scrolls wants. Set, the card takes the height it is given and the
   * photograph takes what the type beneath it does not, so a block pinned to a
   * screen fits that screen instead of being cut off at the foot of it. The
   * crop moves with it: `object-cover` means a shorter card shows a wider band
   * of the same picture, never a squashed one.
   */
  fill?: boolean;
  back?: PagerLinkV5;
  other?: PagerLinkV5;
  forward?: PagerLinkV5;
  className?: string;
  style?: CSSProperties;
}

/** How the sets change places. Long and strongly decelerating — most of the
 *  distance is covered early and the last of it is given away slowly, which is
 *  what makes a slide feel unhurried rather than merely slow. No overshoot:
 *  these are photographs, and a bounce would read as a glitch. */
const SLIDE = 'motion-safe:duration-[900ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]';

/** How far a set trails the track it rides on, as a share of its own width. */
const PARALLAX = 10;

/** `fill` has to be handed down every box between the section and the
 *  photograph — a flex child stops at its content unless it is told both that
 *  it may grow and that it may shrink past that content, which is what
 *  `min-h-0` says. Miss one link and the chain goes slack: the card keeps the
 *  height its picture asks for and the foot of the block is cut off again. */
const FILL_COLUMN = 'flex min-h-0 flex-1 flex-col';

/** Under `fill`, the three cards share one set of rows — photograph, rubric,
 *  headline, topics — through `subgrid`. Left to flex, each card gave its
 *  photograph whatever its own headline left over, so a two-line headline
 *  got a taller picture than a three-line one beside it. On shared rows the
 *  headline row is as deep as the deepest of the three and every photograph
 *  takes the same height. Three across only exists from `md`; stacked, each
 *  card keeps its own flex column. */
const FILL_ROWS = 'md:grid-rows-[minmax(0,1fr)_auto_auto_auto] md:gap-y-0';
const FILL_CARD = 'md:row-span-4 md:grid md:grid-rows-subgrid';

const focusRingFor = (dark: boolean) =>
  `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
    dark ? 'focus-visible:outline-white' : 'focus-visible:outline-current'
  }`;

/** The topic vocabulary these stories are filed under. */
export const storyTagsV5 = [
  'Infrastructure',
  'Heritage',
  'Medicine',
  'Environment',
  'Technology',
  'Diplomacy',
  'Memory',
  'Voices',
  'Communities',
] as const;

/**
 * Two sets. The first is the one the page rests on, under the hero; the second
 * is what the stories block turns to once it has taken the screen over, so the
 * reader is met with stories they have not already scrolled past. Back walks
 * them from the second set to the first, in place.
 */
const defaultPages: StoryCardV5[][] = [
  [
    {
      id: 'chernobyl',
      tags: ['Environment', 'Memory'],
      title: 'Science in Chernobyl: Occupation, Recovery and Future Challenges',
      href: '/story/science-in-chernobyl',
      imageSrc: '/assets/mirror/fahrenheit.png',
      imageAlt: 'Shell casing and rubble outside a damaged institute',
    },
    {
      id: 'kherson-museum',
      tags: ['Heritage', 'Memory'],
      title: 'The Museum That Was Carried Away',
      href: '/story/stolen-museum-kherson',
      imageSrc: '/assets/mirror/stolen-museum.png',
      imageAlt: 'Researcher standing in an emptied museum hall',
    },
    {
      id: 'duga',
      tags: ['Technology', 'Infrastructure'],
      title: 'Listening Posts: What the Duga Array Still Tells Us',
      href: '/story/duga',
      imageSrc: '/assets/mirror/story.jpg',
      imageAlt: 'Engineers working inside a disused radar installation',
    },
  ],
  [
    {
      id: 'herbarium',
      tags: ['Environment', 'Heritage'],
      title: 'What a Herbarium Loses When the Power Goes Out',
      href: '/story/herbarium',
      imageSrc: '/assets/mirror/herbarium.png',
      imageAlt: 'Pressed plant specimens in a herbarium cabinet',
    },
    {
      id: 'damaged-infrastructure',
      tags: ['Infrastructure', 'Diplomacy'],
      title: "Counting the Cost of Ukraine's Damaged Research Infrastructure",
      href: '/story/damaged-infrastructure',
      imageSrc: '/assets/mirror/infra.jpg',
      imageAlt: 'A research building with its windows blown out',
    },
    {
      id: 'cold-chain',
      tags: ['Medicine', 'Technology'],
      title: 'Keeping the Samples Cold Through a Blackout',
      href: '/story/cold-chain',
      imageSrc: '/assets/mirror/test-tubes.png',
      imageAlt: 'Sample tubes in a laboratory rack',
    },
  ],
];

/** Steps the grid to another set. Both directions wrap, so neither ever sits
 *  dead on the row — which is how the reference frame shows them. */
function PagerStep({
  label,
  arrow,
  dark,
  onClick,
}: {
  label: string;
  arrow: 'prev' | 'next';
  dark: boolean;
  onClick: () => void;
}) {
  const glyph = arrow === 'prev' ? '<' : '>';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-[1ch] border-0 bg-transparent p-0 font-mono text-text1-desktop ${
        dark ? 'text-white' : 'text-brand-black'
      } ${focusRingFor(dark)}`}
    >
      {arrow === 'prev' ? <span aria-hidden>{glyph}</span> : null}
      <span className="satr-hover-underline">{label}</span>
      {arrow === 'next' ? <span aria-hidden>{glyph}</span> : null}
    </button>
  );
}

/**
 * The stories, three across (Figma node 94:10484), on black where they are a
 * listing of their own and on the hero's own accent where they share its
 * screen — which is what V5 does with them: no change of ground, no second
 * title, just the stories standing under the search line as the page's subject.
 *
 * Photographs keep their colour and sit inset in the card, with a serif
 * headline beneath and the story's topics under that — no borders, the gaps
 * between the cards do the separating.
 */
export function StoryGridV5({
  showHeading = true,
  heading = 'Stories',
  eyebrow = 'Documenting the impact of the war',
  stories,
  pages,
  page: controlledPage,
  onPageChange,
  showPager = true,
  pagerReveal = 1,
  dark = true,
  fill = false,
  back = { label: 'Back' },
  other = { label: 'Other Stories', href: '/stories' },
  forward = { label: 'Forward' },
  className = '',
  style,
}: StoryGridV5Props) {
  // Back and Forward wrap around, which is why the reference shows both of
  // them live rather than one greyed out at the end of the run.
  const sets = pages ?? (stories ? [stories] : defaultPages);
  // The page owns the count when it passes one in — it opens this block on a
  // different set from the one resting under the hero. Left out, the pager
  // keeps its own.
  const [ownPage, setOwnPage] = useState(0);
  const page = Math.min(controlledPage ?? ownPage, sets.length - 1);
  const step = (by: number) => {
    const next = (page + by + sets.length) % sets.length;
    if (controlledPage === undefined) setOwnPage(next);
    onPageChange?.(next);
  };

  const ink = dark ? 'text-white' : 'text-brand-black';
  const focusRing = focusRingFor(dark);

  return (
    // Column so the pager can sit at the foot of the section rather than
    // directly under the cards when the section is given room to fill.
    <section
      className={`flex flex-col transition-colors duration-300 ${
        dark ? 'satr-on-dark bg-brand-black' : 'bg-brand-accent-blue'
      } ${className}`.trim()}
      style={style}
    >
      {showHeading ? (
        <Wrapper className="pt-[7svh]">
          <h2 className={`font-serif text-h1 ${ink}`}>{heading}</h2>
          <p
            className={`mt-4 font-mono text-h3-desktop ${dark ? 'text-white/60' : 'text-brand-muted'}`}
          >
            {eyebrow}
          </p>
        </Wrapper>
      ) : null}

      {/* Flat pixels, not the rem step: the base font is 18px here, so
          `py-10` would come out at 45. The grid owns the gap above it, which
          is why neither the heading block nor the hero before it carries a
          bottom padding of its own. */}
      <Wrapper className={`pt-[36px] ${fill ? FILL_COLUMN : ''}`.trim()}>
        {/* 36px between the cards, not the 24px the site's rows carry: both
            reference frames measure 429px columns in a 1360px content width,
            which only comes out with a 36px gutter. The twelve-column frame
            underneath is unchanged. */}
        {/* Every set is laid out side by side and the one on show is slid into
            place, so changing sets is a movement the eye can follow rather
            than three pictures being replaced where they stand. The track is
            clipped to the content box, which is where the cards' own column
            begins and ends. */}
        <div className={`overflow-hidden ${fill ? 'min-h-0 flex-1' : ''}`.trim()}>
          <div
            className={`flex motion-safe:transition-transform ${SLIDE} ${fill ? 'h-full' : ''}`}
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {sets.map((set, setIndex) => (
              /* The set does not simply ride the track: it trails it by a
                 tenth of the way and comes back level as it lands, and the one
                 leaving falls back as it goes. That small difference between
                 the two is what gives the movement its depth — a set that
                 travels rigidly with the track reads as a sheet of paper being
                 pushed, however long you give it. */
              <div
                key={setIndex}
                className={`w-full shrink-0 motion-safe:transition-[transform,opacity] ${SLIDE} ${
                  fill ? 'h-full' : ''
                }`}
                style={{
                  transform: `translateX(${(setIndex - page) * PARALLAX}%)`,
                  opacity: setIndex === page ? 1 : 0.3,
                }}
                aria-hidden={setIndex === page ? undefined : true}
                inert={setIndex !== page}
              >
                <Row
                  as="ul"
                  /* `!` because the row's own 24px gutter is the same utility
                     at the same breakpoint and was winning on source order. */
                  className={`m-0 list-none gap-y-10 p-0 md:gap-x-[36px]! ${fill ? `h-full ${FILL_ROWS}` : ''}`.trim()}
                >
                  {set.map((story) => (
                    /* The card fills the row's height and the topics are pushed to
               its foot, so they sit on one line across the three whatever the
               headlines above them do — one, two or three lines deep. */
                    <Col
                      as="li"
                      key={story.id}
                      md={4}
                      className={`flex flex-col ${fill ? `min-h-0 ${FILL_CARD}` : ''}`.trim()}
                    >
                      <a
                        href={story.href}
                        className={`group flex flex-1 flex-col no-underline ${ink} ${focusRing} ${
                          fill ? `min-h-0 ${FILL_CARD}` : ''
                        }`}
                      >
                        {/* 3:2, the frame the hero's own story images use
                    (HomeHeroSandbox, HomeHeroStoriesIndexV4). The clip is on
                    the wrapper so the hover magnification stays inside the
                    card instead of reaching over the one beside it. */}
                        <span
                          className={`block overflow-hidden ${fill ? 'min-h-0 flex-1' : ''}`.trim()}
                        >
                          {/* 429 by 235, the frame's crop (Figma node 225:8820). */}
                          <img
                            src={story.imageSrc}
                            alt={story.imageAlt ?? ''}
                            loading="lazy"
                            className={`block w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.02] ${
                              fill ? 'h-full' : 'aspect-[429/235]'
                            }`}
                          />
                        </span>

                        <span
                          className={`mt-[20px] block font-mono text-text1-desktop ${
                            dark ? 'text-white/60' : 'text-brand-muted'
                          }`}
                        >
                          {story.kind ?? 'Stories'}
                        </span>

                        {/* 26px/32px — the h2 step (36px) ran the headline to six
                    lines in a third-width column. Noto Serif regular; the
                    weight is the only one loaded for this family. */}
                        <span
                          className={`mt-[20px] block font-serif text-[22px] leading-[28px] md:text-[26px] md:leading-[32px] md:tracking-[-0.02em] ${ink}`}
                        >
                          <span
                            className={`satr-hover-underline ${dark ? 'satr-hover-underline--white' : ''}`.trim()}
                          >
                            {story.title}
                          </span>
                        </span>

                        {/* Topics, under the headline rather than over it: a story
                    carries several, and a row of them above the title read as
                    a rubric the story belonged to rather than as its subjects.
                    Plain mono labels, the same ink the single rubric had —
                    they sit with the headline, they are not chips. */}
                        {story.tags?.length ? (
                          /* In the ink, each topic underlined on its own and the
                     slashes between them left bare, so they read as separate
                     tags rather than as one underlined phrase. */
                          <span
                            className={`mt-auto block pt-[20px] font-mono text-text1-desktop ${ink}`}
                          >
                            {story.tags.map((tag, i) => (
                              <span key={tag}>
                                {i > 0 ? ' / ' : null}
                                <span className="underline underline-offset-4">{tag}</span>
                              </span>
                            ))}
                          </span>
                        ) : null}
                      </a>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>

      {showPager ? (
        // mt-auto puts it on the section's bottom edge; where the section
        // fills a pinned screen, that is the foot of the viewport.
        <div
          className={`mt-auto transition-colors duration-300 ${
            dark ? 'bg-brand-black' : 'bg-brand-accent-blue'
          }`}
          style={{
            opacity: pagerReveal,
            pointerEvents: pagerReveal < 1 ? 'none' : undefined,
          }}
          aria-hidden={pagerReveal < 1 ? true : undefined}
        >
          {/* Figma node 225:8837: 60 under the cards, a 2px rule the full
              width of the content, and the row 36 under that. A pinned screen
              keeps its own gap at the foot, so the row's closing 36 is only
              drawn where the page scrolls. */}
          <Wrapper className={`pt-[60px] ${fill ? '' : 'pb-[36px]'}`.trim()}>
            <div
              className={`grid grid-cols-3 items-center gap-6 border-t-2 pt-[36px] font-mono text-text1-desktop ${ink} ${
                dark ? 'border-white' : 'border-brand-line'
              }`}
            >
              <span className="justify-self-start">
                <PagerStep label={back.label} arrow="prev" dark={dark} onClick={() => step(-1)} />
              </span>
              <a
                href={other.href ?? '/stories'}
                className={`justify-self-center no-underline ${ink} ${focusRing}`}
              >
                <span className="underline underline-offset-4">{other.label}</span>
              </a>
              <span className="justify-self-end">
                <PagerStep label={forward.label} arrow="next" dark={dark} onClick={() => step(1)} />
              </span>
            </div>
          </Wrapper>
        </div>
      ) : null}
    </section>
  );
}

export default StoryGridV5;
