import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { SiteHeaderV6, type SiteHeaderV6Props } from '@/sandbox/SiteHeaderV6';
import { HomeHeroV4Final, type HomeHeroV4FinalProps } from '@/sandbox/HomeHeroV4Final';
import { HomeScientistsBlock, type HomeScientistsBlockProps } from './HomeScientistsBlock';
import {
  ResearchSection,
  InfrastructuresSection,
  type ResearchSectionProps,
  type InfrastructuresSectionProps,
} from '@/components/InfoSection';
import { Footer, type FooterProps } from '@/components/Footer';

export interface HomePageV6Props {
  header?: SiteHeaderV6Props;
  hero?: HomeHeroV4FinalProps;
  scientists?: HomeScientistsBlockProps;
  research?: ResearchSectionProps;
  infrastructure?: InfrastructuresSectionProps;
  footer?: FooterProps;
  className?: string;
}

/** The research list of scienceatrisk.org's home page, under the name the
 *  whole site now uses for it. */
export const defaultResearchV6: ResearchSectionProps = {
  info: {
    title: 'Research',
    text: 'Formalized and organized experience of Ukrainian scientists in the preservation of scientific works, collections and institutions',
    linkLabel: 'Show all studies',
    linkHref: '/research',
  },
  papers: [
    {
      title: 'Impact of the War on Different Categories of Ukrainian Scholars',
      description: 'Research: Olena Kozak, Lidia Kuzemska, Yevheniia Polishchuk, Kateryna Chuyeva',
      href: '/research/impact-of-the-war-on-different-categories-of-ukrainian-scholars',
      downloadHref: '/research/impact-of-the-war-on-different-categories-of-ukrainian-scholars.pdf',
    },
    {
      title:
        'Support Mechanisms for Researchers at Risk: Historical Development, Survey Evidence, and Policy Lessons from Wartime Ukraine',
      description: 'Research: Ilona Sviezhentseva, Igor Lyman',
      href: '/research/support-mechanisms-for-researchers-at-risk',
      downloadHref: '/research/support-mechanisms-for-researchers-at-risk.pdf',
    },
    {
      title:
        'Strategic priority-setting in research in times of crisis: how to optimise decision-making for societal resilience',
      description:
        'Research: Pavel Gol’din, Oleksiy Kolezhuk, Vitaliy Omelyanenko, Anna Vorontsova, Svitlana Tarasenko',
      href: '/research/strategic-priority-setting-in-research',
      downloadHref: '/research/strategic-priority-setting-in-research.pdf',
    },
  ],
};

export const defaultInfrastructureV6: InfrastructuresSectionProps = {
  cards: [
    {
      title: 'Institute for Problems of Cryobiology and Cryomedicine',
      amount: '~ 500 000 UAH',
      href: '/infrastructures/cryobiology-cryomedicine',
      showMetaLabels: true,
    },
    {
      title:
        'Danilevsky Institute for Endocrine Pathology Problems of the National Academy of Medical Sciences of Ukraine',
      amount: '~ 3 478 972 UAH',
      href: '/infrastructures/danilevsky-institute',
      showMetaLabels: true,
    },
    {
      title: 'Institute for Safety Problems of Nuclear Power Plants',
      amount: '~ 366 627 780 UAH',
      href: '/infrastructures/nuclear-safety-institute',
      showMetaLabels: true,
    },
  ],
};

/** How long one block takes to take the screen over, and the curve it takes it
 *  on — both read off scienceatrisk.org, where the same move is done with
 *  fullPage.js. The curve dips below zero and past one, so a block gathers
 *  itself before it leaves and settles after it lands. */
const TRANSITION_MS = 800;
const TRANSITION_EASING = 'cubic-bezier(0.58, -0.31, 0.32, 0.6)';

/** When the bar changes its ink. The blocks are full height and the bar is
 *  transparent over them, so the band the bar stands in belongs to the
 *  outgoing block until the incoming one has all but arrived — changing colour
 *  any earlier puts white type on a yellow screen for half a second. */
const INK_HANDOVER = 0.75;

/** The wheel does not scroll: it fills a bucket. The page moves on once the
 *  reader has pushed this far in one direction, which is what keeps a single
 *  flick of a trackpad from running through three blocks. */
const WHEEL_DISTANCE = 150;

/** Below either of these the deck is off and the page is an ordinary scrolling
 *  document. A screen too short for a block cannot hold one still.
 *
 *  The width is the reference's. The height is not: the reference's 500 was
 *  measured against a first screen that was the hero and nothing else. This one
 *  carries the search, its fields, the stories and their pager, and the card
 *  gives the photograph whatever the rest does not need. Measured with the
 *  fields in, that is 237px at 916, 213px at 900, 124px at 800 and nothing at
 *  all below about 820. A card whose photograph has been squeezed out of
 *  existence is not a card, so the deck stops while the photograph is still
 *  one and the page falls back to scrolling — where the search, its fields and
 *  a full 3:2 crop all have as much room as they want, and the question of
 *  which of them outweighs the other does not arise.
 *
 *  The cost is deliberate and worth naming: 1440x800 and 1366x768 are a great
 *  many laptops, and none of them see the deck any more. */
const DECK_MIN_WIDTH = 1024;
const DECK_MIN_HEIGHT = 820;

/** The gap every block keeps clear at the foot of the screen, so a card's
 *  last line or a section's last rule never sits flush against the browser
 *  chrome. 34 is what the hero frame leaves under its pager (Figma node
 *  225:8792, 871 of 905). */
const DECK_BOTTOM_GAP = 34;

/**
 * The blocks, in order, each with the ground it stands on and whether the bar
 * has to turn its ink over while standing on it.
 *
 * The bar carries no ground of its own here — the blocks run the full height of
 * the screen and the bar is transparent over them, so there is never a band of
 * one block's colour sitting over another's.
 */
const SECTIONS = [
  { ground: 'bg-brand-white', inverted: false },
  { ground: 'bg-brand-accent-blue', inverted: false },
  { ground: 'bg-brand-accent-yellow', inverted: false },
  { ground: 'bg-brand-white', inverted: false },
  { ground: 'satr-on-dark bg-brand-black', inverted: true },
] as const;

/** Reaches the one call to action in each info block's title column, so it is
 *  underlined here without the shared component changing under the older page
 *  that also uses it. */
const INFO_LINK =
  '[&_section>a]:no-underline [&_section>a]:[background-image:linear-gradient(#000,#000),linear-gradient(#000,#000)] [&_section>a]:[background-size:100%_1px,0%_3px] [&_section>a:hover]:[background-size:100%_1px,100%_3px] [&_h2]:hyphens-none [&_h2]:text-[clamp(32px,4.2vw,60px)]';

/** The deck shrinks a block that is taller than the screen, and its type with
 *  it: at 1024x820 Research comes out at 0.63, which put the papers' authors
 *  and file types at 11px. From `lg` — where the deck can be on — the body
 *  type in a block's cards is held at 16px on screen at the least, by growing
 *  it as far as the scale takes it back. Unscaled, `--satr-fit` is 1 and this
 *  is their usual 18px. The fit then solves for the taller block; the
 *  headings, which have size to spare, give up the difference. */
const FIT_FLOOR =
  'lg:[&_p.font-ukraine]:text-[length:max(18px,calc(16px/var(--satr-fit,1)))] lg:[&_p.font-ukraine]:leading-[max(26px,calc(23px/var(--satr-fit,1)))] lg:[&_p[class*=text1-desktop]]:text-[length:max(18px,calc(16px/var(--satr-fit,1)))] lg:[&_p[class*=text1-desktop]]:leading-[max(28px,calc(25px/var(--satr-fit,1)))]';

/** These blocks stand on the foot of the screen rather than in the middle of
 *  it: the title sits at the bottom of its column and the list's last rule is
 *  the line the block ends on, so both land on the same edge. `safe` keeps a
 *  block that has not been scaled yet from being cut off at the top on its
 *  first frame. */
const INFO_BOTTOM = '[justify-content:safe_flex-end]';

/** Whether the wheel should be left to the element under the pointer instead of
 *  moving the page on: a block taller than the screen scrolls inside itself
 *  first, and only hands the gesture over at its own end. */
const scrollableUnder = (from: EventTarget | null, within: HTMLElement, deltaY: number) => {
  // Stops at the deck itself rather than including it: the blocks parked a
  // screen below are still part of its scroll area, so the deck always looks
  // scrollable from the outside even though it is `overflow: hidden` and
  // nothing in it ever moves.
  let node = from instanceof HTMLElement ? from : null;
  while (node && node !== within) {
    // Overflowing is not the same as scrolling. Nearly every box on this page
    // overflows its parent by a pixel or two, and one of them — the box the
    // hero and the listing's title share, whose height the turn drives — was
    // routinely 19px over. Treated as a scroller it swallowed every wheel
    // turn made over the hero and the page simply refused to move: the box
    // cannot scroll, so it was never at its end and never handed the gesture
    // on. Only a box that is actually allowed to scroll counts.
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      const room = node.scrollHeight - node.clientHeight;
      if (room > 1) {
        const atTop = node.scrollTop <= 0;
        const atBottom = node.scrollTop >= room - 1;
        if ((deltaY > 0 && !atBottom) || (deltaY < 0 && !atTop)) return true;
      }
    }
    node = node.parentElement;
  }
  return false;
};

/**
 * The home page after scienceatrisk.org: five blocks stacked a screen each —
 * the v4_Final hero (Figma 299:7226), Scientists, Research, Damaged
 * infrastructure, the footer — and one bar over all of them.
 *
 * The blocks are stacked on top of one another rather than laid end to end,
 * each a screen tall. The one below waits at `translateY(100%)`; a gesture
 * brings it to zero over 800ms and it rides up over the one it replaces, which
 * is only moved out of the way once it is safely covered. Nothing scrolls — the
 * reader's wheel fills a bucket, and each bucketful moves the page on once.
 *
 * The bar shows "!!!" on the hero and the wordmark on every other block: the
 * two swap places in the same corner as the first block leaves.
 *
 * Under 1024px wide or 820px tall the deck is off and this is an ordinary
 * scrolling page, which is also what the reference does.
 */
export function HomePageV6({
  header,
  hero,
  scientists,
  research = defaultResearchV6,
  infrastructure = defaultInfrastructureV6,
  footer,
  className = '',
}: HomePageV6Props) {
  const [deck, setDeck] = useState(false);
  const [index, setIndex] = useState(0);
  /** Which block's ink the bar is wearing. It lags the block itself by most of
   *  the move, because the band the bar stands in is the last part of the
   *  screen the incoming block reaches. */
  const [inkIndex, setInkIndex] = useState(0);
  /** Where each block is standing. Held in state rather than written straight
   *  to the nodes so a re-render cannot put one back where it started. */
  const [transforms, setTransforms] = useState<string[]>(() =>
    SECTIONS.map((_, i) => (i === 0 ? 'translateY(0)' : 'translateY(100%)')),
  );
  /** 0 with the hero on screen, 1 once the reader has left it and the bar has
   *  taken the wordmark. Everything that changes between those two states —
   *  the hero's own pieces fading out, the copy in flight — reads from this. */
  const [progress, setProgress] = useState(0);
  // Measured, not assumed: the bar is 64px until the search field is in the
  // row, and from `xl` up the collapsed field still carries its button's 47px
  // even at zero width, which makes the bar 83.
  const [barHeight, setBarHeight] = useState(64);
  /** Which block the bar is standing on in the scrolling fallback, where no
   *  one block owns the screen. There the bar is opaque — the page scrolls
   *  under it — so it has to take that block's ground as well as its ink. */
  const [flowIndex, setFlowIndex] = useState<number | null>(null);

  const deckRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** The box each block's content lays itself out in. A block that would not
   *  fit is not given a scrollbar — it is laid out in a taller box and taken
   *  down to the screen's height, so all of it is on show at once. */
  const fitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const barInnerRef = useRef<HTMLDivElement>(null);

  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const progressRef = useRef(0);
  const transformsRef = useRef(transforms);
  transformsRef.current = transforms;

  // Whether the deck applies at all, how tall the bar is, and the two heights
  // the first screen moves between.
  useEffect(() => {
    const barNode = barInnerRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const measure = () => {
      // The header, not just its row — the collapsed state adds a rule along
      // the foot, and a block's content has to clear that too.
      if (barNode) setBarHeight(barNode.closest('header')?.offsetHeight ?? barNode.offsetHeight);
      setDeck(
        !reduceMotion.matches &&
          window.innerWidth >= DECK_MIN_WIDTH &&
          window.innerHeight >= DECK_MIN_HEIGHT,
      );
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (barNode) ro.observe(barNode);
    window.addEventListener('resize', measure);
    reduceMotion.addEventListener('change', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      reduceMotion.removeEventListener('change', measure);
    };
  }, []);

  /** Brings a block up over the one on screen. The incoming block comes to zero
   *  straight away; the outgoing one is only sent out of the way afterwards,
   *  once it is safely covered. */
  const slide = useCallback(
    (to: number) => {
      const from = indexRef.current;
      if (to < 0 || to >= SECTIONS.length || to === from) return;
      const down = to > from;

      // Leaving the first screen — or coming back to it — is where the bar swaps
      // its "!!!" for the wordmark, or back; it fades while the block rides over.
      if (from === 0 || to === 0) {
        const next = to === 0 ? 0 : 1;
        progressRef.current = next;
        setProgress(next);
      }

      indexRef.current = to;
      setIndex(to);
      setTransforms((current) => current.map((t, i) => (i === to ? 'translateY(0)' : t)));
      window.setTimeout(() => setInkIndex(to), TRANSITION_MS * INK_HANDOVER);
      window.setTimeout(() => {
        setTransforms((current) =>
          current.map((t, i) => (i === from ? `translateY(${down ? '-100%' : '100%'})` : t)),
        );
      }, TRANSITION_MS);
    },
    [],
  );

  /** One gesture, one block, in either direction. */
  const step = useCallback(
    (dir: number) => {
      if (busyRef.current || !dir) return;
      const to = indexRef.current + dir;
      if (to < 0 || to >= SECTIONS.length) return;
      slide(to);
      busyRef.current = true;
      window.setTimeout(() => {
        busyRef.current = false;
      }, TRANSITION_MS);
    },
    [slide],
  );

  // The wheel, the keyboard, and nothing else: below the deck's thresholds the
  // page is left to scroll the way any page does.
  useEffect(() => {
    if (!deck) return;
    const deckNode = deckRef.current;
    if (!deckNode) return;

    let bucket = 0;

    const onWheel = (e: WheelEvent) => {
      // Listened for on the window rather than on the deck. The bar stands
      // outside the deck, and the page is exactly a screen tall, so a wheel
      // turned with the pointer over the bar reached nothing at all and the
      // page simply refused to move.
      const inside = e.target instanceof Node && deckNode.contains(e.target);
      if (inside && scrollableUnder(e.target, deckNode, e.deltaY)) {
        return;
      }
      e.preventDefault();
      if (busyRef.current) return;
      // A push the other way empties the bucket rather than draining it, so
      // changing your mind is one gesture and not two.
      if ((bucket > 0 && e.deltaY < 0) || (bucket < 0 && e.deltaY > 0)) bucket = 0;
      bucket += e.deltaY;
      if (Math.abs(bucket) < WHEEL_DISTANCE) return;
      step(bucket > 0 ? 1 : -1);
      bucket = 0;
    };

    const onKey = (e: KeyboardEvent) => {
      // Checked rather than cast: a keydown's target is not always an element
      // — it is `window` for one raised in script — and `closest` on that
      // throws out of the listener and takes the keystroke with it. The same
      // guard `scrollableUnder` makes for the wheel.
      const target = e.target instanceof HTMLElement ? e.target : null;
      // Not while someone is typing in the hero's search field.
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      // Space belongs to whatever the reader has actually tabbed to. The
      // pager's buttons stand on the first screen now, and a Space that moved
      // the deck on instead of pressing the button under the cursor would be
      // the deck taking a key that was never aimed at it.
      if (e.key === ' ' && target?.closest('button, a[href], summary')) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') step(1);
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') step(-1);
      else return;
      e.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [deck, step]);

  // Crossing either threshold puts the page back to the top of whichever
  // arrangement it has landed in: stacked, with only the first screen standing
  // at zero, or — a narrower window, a shorter one, motion turned down — laid
  // out end to end in the flow, where the document can reach every block.
  useEffect(() => {
    indexRef.current = 0;
    busyRef.current = false;
    progressRef.current = 0;
    setIndex(0);
    setInkIndex(0);
    setProgress(0);
    setTransforms(SECTIONS.map((_, i) => (deck && i > 0 ? 'translateY(100%)' : 'translateY(0)')));
  }, [deck]);

  // In the flow the bar is opaque and takes the ink of whatever block its foot
  // is inside.
  useEffect(() => {
    if (deck) {
      setFlowIndex(null);
      return;
    }
    let frame = 0;
    const read = () => {
      frame = 0;
      const edge =
        barInnerRef.current?.closest('header')?.getBoundingClientRect().bottom ?? barHeight;
      let on: number | null = null;
      sectionRefs.current.forEach((node, i) => {
        if (!node) return;
        const box = node.getBoundingClientRect();
        // The foot has to be inside the block, not merely past its top —
        // otherwise the last block would keep the bar once scrolled away.
        if (box.top <= edge && box.bottom > edge) on = i;
      });
      setFlowIndex(on);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [deck, barHeight]);

  // Every block shows all of itself. One that does not fit the screen is not
  // given a scrollbar and half its contents below the fold: it is laid out in a
  // box as tall as it needs, and that whole box is then taken down to the
  // screen's height. Nothing is cut off and nothing has to be scrolled to.
  //
  // The first block is left out of this by design — it is the screen that turns
  // over, its height is driven by the turn from one frame to the next, and it
  // is built to fill the screen rather than to overrun it.
  useEffect(() => {
    if (!deck) {
      fitRefs.current.forEach((node) => {
        if (!node) return;
        node.style.width = '';
        node.style.height = '';
        node.style.transform = '';
        node.style.removeProperty('--satr-fit');
      });
      return;
    }

    let frame = 0;
    const fit = () => {
      frame = 0;
      const deckNode = deckRef.current;
      if (!deckNode) return;
      // What is left of the screen once the bar has had its band and the
      // foot has kept its gap.
      const room = deckNode.clientHeight - barHeight - DECK_BOTTOM_GAP;
      if (room <= 0) return;

      fitRefs.current.forEach((node, i) => {
        // The first block is left out, and not because of the turn. Scaling
        // works here by widening the box by as much as it then shrinks it, so
        // the block keeps the screen's width — which means anything whose
        // height comes from its width does not get any shorter for it. The
        // wordmark is 66% of the content width and the story photographs are a
        // 3:2 crop of a twelve-column cell: widen the box and they grow by
        // exactly as much as the scale takes back. Only the type shrinks, and
        // there is not enough type in this block to close the gap, so the
        // solver simply runs out of room. The other three blocks are type all
        // the way down, which is why the same pass fits them.
        if (!node || i === 0) return;

        // The box is widened by exactly as much as it is then scaled down, so
        // what the reader sees is the full width of the screen and the block
        // stays on the same grid as the bar above it — a block scaled without
        // that compensation ends up narrower than the bar, which is what put
        // its rules and its type off every other line on the page.
        //
        // Width and height have to be solved for together: widening the box
        // lets the type re-wrap, which changes the height that set the scale.
        // What we want is the largest scale whose content still fills its box
        // and no more — `scale × height(scale) = room`. That product only ever
        // grows with the scale, so the answer can be closed in on from both
        // sides, and closing in on it matters: a scale merely known to fit
        // leaves the block short of its box, which a block standing on the
        // foot of the screen shows as a gap along the top.
        const heightAt = (k: number) => {
          node.style.width = `${100 / k}%`;
          // The grid's own gutters and ceiling divide by this, so they come
          // out the width they always are once the block has been scaled.
          node.style.setProperty('--satr-fit', `${k}`);
          // Its own height, not the one we are about to give it: read from the
          // box we set, it would only report that box back.
          node.style.height = 'auto';
          node.style.transform = 'none';
          return node.offsetHeight;
        };

        let scale = 1;
        if (heightAt(1) > room) {
          // Nothing on this page needs to go below a quarter size; a block
          // that did would be unreadable long before it fitted.
          let fits = 0.25;
          let over = 1;
          if (heightAt(fits) * fits <= room) {
            for (let pass = 0; pass < 10; pass += 1) {
              const mid = (fits + over) / 2;
              if (heightAt(mid) * mid > room) over = mid;
              else fits = mid;
            }
          }
          scale = fits;
        }

        node.style.width = scale < 1 ? `${100 / scale}%` : '';
        node.style.height = `${room / scale}px`;
        node.style.transform = scale < 1 ? `scale(${scale})` : '';
        if (scale < 1) node.style.setProperty('--satr-fit', `${scale}`);
        else node.style.removeProperty('--satr-fit');
      });
    };

    const run = () => {
      if (!frame) frame = requestAnimationFrame(fit);
    };
    run();
    // Type that arrives after the first paint changes every height it is set
    // in, so the fit is taken again once the fonts are in.
    document.fonts?.ready.then(run);
    window.addEventListener('resize', run);
    // And again whenever a block's content changes height on its own: a
    // switch that swaps in a longer note, or a reader's own stylesheet
    // widening the line height and letter spacing (WCAG 1.4.12). Without it
    // the block keeps the scale it had and its foot is cut off by the
    // screen's edge. The fit itself ends on the size it started from, so it
    // does not set this off again.
    const content = new ResizeObserver(run);
    fitRefs.current.forEach((node, i) => {
      const child = node?.firstElementChild;
      if (i > 0 && child) content.observe(child);
    });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', run);
      content.disconnect();
    };
  }, [deck, barHeight]);

  // Which block the bar is dressed as. In the deck that is the one it stands
  // on, a beat behind the move; in the flow it is whichever the scroll has put
  // under its foot.
  const barOn = deck ? inkIndex : flowIndex;
  const inverted = barOn === null ? undefined : SECTIONS[barOn].inverted;
  const barGround = deck
    ? // In the deck the blocks run the full height of the screen and the bar
      // stands on them rather than above them, so it has no ground of its own —
      // that band was showing the colour of whichever block the bar had already
      // changed to while the screen still held the old one.
      'bg-transparent'
    : barOn === null
      ? undefined
      : SECTIONS[barOn].ground;

  const blocks: { ground: string; className: string; content: ReactNode }[] = [
    {
      ground: SECTIONS[0].ground,
      className: 'flex flex-col',
      // `fill` only in the deck: there the block's height is given, so the
      // photograph takes whatever the type does not need. In the flow nothing
      // dictates a height and the 666:428 crop stands.
      content: <HomeHeroV4Final masthead={false} fill={deck} wordmarkRef={wordmarkRef} className="min-h-0 flex-1" {...hero} />,
    },
    {
      ground: SECTIONS[1].ground,
      className: 'flex flex-col [justify-content:safe_flex-end]',
      content: <HomeScientistsBlock {...scientists} />,
    },
    {
      ground: SECTIONS[2].ground,
      className: `flex flex-col ${INFO_BOTTOM} ${INFO_LINK} ${FIT_FLOOR}`,
      content: <ResearchSection infoAtBottom {...research} />,
    },
    {
      ground: SECTIONS[3].ground,
      className: `flex flex-col ${INFO_BOTTOM} ${INFO_LINK} ${FIT_FLOOR}`,
      content: <InfrastructuresSection infoAtBottom {...infrastructure} />,
    },
    {
      ground: SECTIONS[4].ground,
      className: 'flex flex-col [justify-content:safe_flex-end]',
      content: <Footer {...footer} />,
    },
  ];

  return (
    <div className={`bg-brand-white ${className}`.trim()}>
      <SiteHeaderV6
        progress={deck ? progress : barOn ? 1 : 0}
        ground={barGround}
        inverted={inverted}
        innerRef={barInnerRef}
        {...header}
      />

      <div
        ref={deckRef}
        // `clip`, not `hidden`. The blocks parked a screen below are still part
        // of this box's scrollable overflow — 1800px of it against a 900px
        // screen — and `overflow: hidden` is a scroll container that only the
        // reader cannot scroll: the browser still can, and does, the moment
        // something inside it takes focus. Tabbing to the pager scrolled the
        // whole deck 412px and left it there, with no gesture able to put it
        // back, because `scrollableUnder` rightly ignores a box like this.
        // `clip` is not a scroll container at all, so there is nothing to
        // scroll and focus simply lands where it stands.
        className={deck ? 'relative overflow-clip' : ''}
        // Pulled back up under the bar, which is sticky and would otherwise
        // take a band of the screen for itself; each block pads its own content
        // clear of it instead.
        style={deck ? { height: '100svh', marginTop: -barHeight } : undefined}
      >
        {blocks.map((block, i) => (
          <div
            key={i}
            ref={(node) => {
              sectionRefs.current[i] = node;
            }}
            className={`${
              deck ? 'absolute inset-0 overflow-hidden' : 'min-h-[100svh]'
            } transition-colors duration-300 ${block.ground}${deck ? '' : ` ${block.className}`}`}
            style={
              deck
                ? {
                    // The stand-off from the bar belongs to the block and not
                    // to what scrolls inside it: padding on a scroll container
                    // travels with its content, which sent a block's own
                    // headings up under the transparent bar the moment it was
                    // scrolled. The ground still paints behind it either way —
                    // here and at the foot, where the same padding keeps the
                    // block's content off the bottom edge of the screen.
                    paddingTop: barHeight,
                    paddingBottom: DECK_BOTTOM_GAP,
                    transform: transforms[i],
                    zIndex: i === index ? 2 : 1,
                    // Only the block arriving moves in view of anyone: the
                    // one it replaces is sent out of the way afterwards, from
                    // under it, and has to go in a single frame. Left with a
                    // transition of its own it slid away over the next 800ms
                    // and uncovered the block behind it on the way.
                    transition:
                      i === index ? `transform ${TRANSITION_MS}ms ${TRANSITION_EASING}` : 'none',
                  }
                : undefined
            }
            aria-hidden={deck && i !== index ? true : undefined}
            inert={deck && i !== index}
          >
            {deck ? (
              <div
                ref={(node) => {
                  fitRefs.current[i] = node;
                }}
                /* Scaled about its own top left corner, so what the reader
                   sees starts right under the bar, runs to the foot of the
                   screen, and keeps both of the screen's edges. */
                className={`origin-top-left overflow-hidden ${i === 0 ? 'h-full' : ''} ${
                  block.className
                }`}
              >
                {block.content}
              </div>
            ) : (
              block.content
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default HomePageV6;
