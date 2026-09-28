import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { SiteHeaderV5, BAR_WORDMARK_H, type SiteHeaderV5Props } from '@/sandbox/SiteHeaderV5';
import { HomeHeroV5, type HomeHeroV5Props } from '@/sandbox/HomeHeroV5';
import { StoryGridV5, type StoryGridV5Props } from '@/sandbox/StoryGridV5';
import {
  ResearchSection,
  InfrastructuresSection,
  type ResearchSectionProps,
  type InfrastructuresSectionProps,
} from '@/components/InfoSection';
import { defaultResearches, defaultInfrastructure } from '@/sandbox/HomePage';
import { Footer, type FooterProps } from '@/components/Footer';

export interface HomePageV5Props {
  header?: SiteHeaderV5Props;
  hero?: HomeHeroV5Props;
  stories?: StoryGridV5Props;
  /** The two blocks that follow the stories on the search-hero ordering. */
  researches?: ResearchSectionProps;
  infrastructure?: InfrastructuresSectionProps;
  footer?: FooterProps;
  className?: string;
}

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
const DECK_MIN_HEIGHT = 850;

/** The gap every block keeps clear at the foot of the screen, so a card's
 *  last line or a section's last rule never sits flush against the browser
 *  chrome. 34 is what the hero frame leaves under its pager (Figma node
 *  225:8792, 871 of 905). */
const DECK_BOTTOM_GAP = 34;

/** The wordmark's own curve — ease-in-out cubic, and nothing more. The blocks
 *  ride in on the reference's `cubic-bezier(0.58, -0.31, 0.32, 0.6)`, which
 *  pulls back before it leaves and overshoots as it lands: on a whole screen
 *  that reads as weight, but on one travelling word it was a stumble. It set
 *  off backwards, then shot past the slot in the bar and came back to it. This
 *  one leaves and lands softly and never turns round on the way. */
const easeTurn = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * The blocks, in order, each with the ground it stands on and whether the bar
 * has to turn its ink over while standing on it.
 *
 * The bar carries no ground of its own here — the blocks run the full height of
 * the screen and the bar is transparent over them, so there is never a band of
 * one block's colour sitting over another's.
 */
const SECTIONS = [
  { ground: 'bg-brand-accent-blue', inverted: false },
  { ground: 'bg-brand-accent-yellow', inverted: false },
  { ground: 'bg-brand-white', inverted: false },
  { ground: 'satr-on-dark bg-brand-black', inverted: true },
] as const;

/** Reaches the one call to action in each info block's title column, so it is
 *  underlined here without the shared component changing under the older page
 *  that also uses it. */
const INFO_LINK = '[&_section>a]:underline [&_section>a]:underline-offset-4';

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
 * V5 experiment — one header in two states rather than two headers
 * (Figma nodes 94:10484 and 94:10608), over the block-by-block movement
 * scienceatrisk.org uses on its own home page.
 *
 * The blocks are stacked on top of one another rather than laid end to end,
 * each a screen tall. The one below waits at `translateY(100%)`; a gesture
 * brings it to zero over 800ms and it rides up over the one it replaces, which
 * is only moved out of the way once it is safely covered. Nothing scrolls — the
 * reader's wheel fills a bucket, and each bucketful moves the page on once.
 *
 * The first screen holds the hero and the stories together, and goes on
 * holding them: the story sets are paged in place by the grid's own pager, so
 * the reader can walk through them without the search line above ever leaving.
 * What does travel is the wordmark, and only on the way out — the page measures
 * where it ends up in the bar and flies it there on the same curve and in the
 * same time a block takes to arrive, scaling it down to the bar's 20px.
 *
 * Under 1024px wide or 500px tall the deck is off and this is an ordinary
 * scrolling page, which is also what the reference does.
 */
export function HomePageV5({
  header,
  hero,
  stories,
  researches = defaultResearches,
  infrastructure = defaultInfrastructure,
  footer,
  className = '',
}: HomePageV5Props) {
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
  const [flying, setFlying] = useState(false);
  // Which set of stories the grid is showing. It is the pager's to move and
  // nothing else touches it, so a reader who steps down the deck and comes back
  // finds the set they left rather than the one the page opened on.
  const [storiesPage, setStoriesPage] = useState(0);
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
  const flierRef = useRef<HTMLImageElement>(null);

  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const progressRef = useRef(0);
  const transformsRef = useRef(transforms);
  transformsRef.current = transforms;
  /** Where the flight starts and ends, captured once per flight: both ends are
   *  still while it runs, so measuring them again every frame would only
   *  re-read the same two boxes. */
  const flightRef = useRef<{
    from: { left: number; top: number; height: number };
    to: { left: number; top: number; scale: number };
  } | null>(null);

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

  /** The hero's wordmark where it stands at rest, and the slot in the bar it
   *  has to land in. */
  const captureFlight = useCallback(() => {
    const img = wordmarkRef.current?.querySelector('img');
    const barNode = barInnerRef.current;
    if (!img || !barNode) return null;

    const rect = img.getBoundingClientRect();
    // Where the wordmark stands *at rest*, which on the way back is not where
    // it is standing now. The flight out is captured with the hero on screen,
    // but the flight home is captured while the hero is still parked a screen
    // above, and a rect read through that transform aims the wordmark at a
    // point off the top of the window — it left the bar and flew out of the
    // page. The hero's block is `absolute inset-0`, so whatever its own box
    // reads is exactly the parking it has to be measured back out of.
    const parked = sectionRefs.current[0]?.getBoundingClientRect();
    const restLeft = rect.left - (parked?.left ?? 0);
    const restTop = rect.top - (parked?.top ?? 0);
    const bar = barNode.getBoundingClientRect();
    const barStyle = getComputedStyle(barNode);
    const padLeft = parseFloat(barStyle.paddingLeft) || 0;
    const padTop = parseFloat(barStyle.paddingTop) || 0;
    const padBottom = parseFloat(barStyle.paddingBottom) || 0;
    // The middle of the row, not of the box: the bar stands 46px off the top of
    // the page and nothing off the bottom, so halving its height would aim the
    // wordmark well above where the row actually sits.
    const midY = bar.top + padTop + (bar.height - padTop - padBottom) / 2;

    return {
      from: { left: restLeft, top: restTop, height: rect.height },
      to: {
        left: bar.left + padLeft,
        top: midY - BAR_WORDMARK_H / 2,
        scale: rect.height ? BAR_WORDMARK_H / rect.height : 1,
      },
    };
  }, []);

  /** Puts the travelling copy where the given progress says it is. It is a copy
   *  and not the hero's own wordmark for one reason: the blocks stack with a
   *  z-index, which opens a stacking context each, and nothing inside a block
   *  can be lifted over the bar out of one. At both ends of the flight the copy
   *  and the real thing are the same picture at the same size in the same
   *  place, so the handover shows nothing at all. */
  const placeFlier = useCallback((p: number) => {
    const node = flierRef.current;
    const geom = flightRef.current;
    if (!node || !geom) return;
    const { from, to } = geom;
    node.style.transform = `translate(${(to.left - from.left) * p}px, ${
      (to.top - from.top) * p
    }px) scale(${1 + (to.scale - 1) * p})`;
  }, []);

  /** Sends the wordmark between the two homes it has — the hero's own line and
   *  the slot in the bar — while the rest of the hero fades, on the block's own
   *  curve and in its own time, so the screen changing and the wordmark
   *  travelling are one movement. */
  const fly = useCallback(
    (to: number) => {
      const from = progressRef.current;
      if (from === to) return;
      const geom = captureFlight();
      const run = (p: number) => {
        progressRef.current = p;
        setProgress(p);
        placeFlier(p);
      };
      if (!geom) {
        run(to);
        return;
      }
      flightRef.current = geom;
      setFlying(true);
      const started = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / TRANSITION_MS);
        run(from + (to - from) * easeTurn(t));
        if (t < 1) {
          requestAnimationFrame(step);
          return;
        }
        run(to);
        setFlying(false);
      };
      // The first frame has to land before the copy is shown, or it appears for
      // one frame wherever the browser last left it.
      placeFlier(from);
      requestAnimationFrame(step);
    },
    [captureFlight, placeFlier],
  );

  /** Brings a block up over the one on screen. The incoming block comes to zero
   *  straight away; the outgoing one is only sent out of the way afterwards,
   *  once it is safely covered. */
  const slide = useCallback(
    (to: number) => {
      const from = indexRef.current;
      if (to < 0 || to >= SECTIONS.length || to === from) return;
      const down = to > from;

      // Leaving the first screen — or coming back to it — is the move where the
      // wordmark changes hands: it flies into the bar while the next block rides
      // up over the hero, on the same clock and for the same 800ms, so what the
      // reader sees is one movement rather than two that happen to coincide.
      // `fly` takes the flight's own 0..1 and not a block index: the two only
      // happened to be the same number while the hero had a screen to itself.
      if (from === 0 || to === 0) fly(to === 0 ? 0 : 1);

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
    [fly],
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
    setFlying(false);
    setStoriesPage(0);
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
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', run);
    };
  }, [deck, barHeight]);

  // The first screen keeps its wordmark only while it is the one on show. The
  // moment the flight starts, the travelling copy is the wordmark and the
  // original steps aside — the two are the same picture in the same place at
  // that moment, so nothing is seen to change hands.
  useEffect(() => {
    const node = wordmarkRef.current;
    if (!node) return;
    node.style.opacity = progress > 0 ? '0' : '1';
  }, [progress]);

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
      content: (
        <>
          <HomeHeroV5
            ground={false}
            progress={progress}
            wordmarkRef={wordmarkRef}
            className="shrink-0"
            {...hero}
          />

          {/* The stories are on the home page from the first frame, under the
              hero and on the hero's own ground — and they are walked through
              here rather than on a screen of their own. The grid fills the rest
              of the block, which puts its pager on the foot of the screen, and
              the set under the search line changes without the search line
              itself going anywhere.

              `fill` only in the deck: there the block's height is given, so the
              cards can hand the photograph whatever the type does not need. In
              the flow nothing dictates a height and the 3:2 crop stands. */}
          {/* The stories are the one region on this screen with nothing
              standing over them — the page's own h1 is the wordmark, and the
              grid's section has no name of its own. The heading is read but not
              drawn: the reference frame has no title here, and the cards carry
              their topics themselves. */}
          <h2 className="sr-only">{stories?.heading ?? 'Stories'}</h2>

          <StoryGridV5
            {...stories}
            page={storiesPage}
            onPageChange={setStoriesPage}
            showHeading={false}
            dark={false}
            fill={deck}
            className="min-h-0 flex-1"
          />
        </>
      ),
    },
    {
      ground: SECTIONS[1].ground,
      className: `flex flex-col ${INFO_BOTTOM} ${INFO_LINK}`,
      content: <ResearchSection infoAtBottom {...researches} />,
    },
    {
      ground: SECTIONS[2].ground,
      className: `flex flex-col ${INFO_BOTTOM} ${INFO_LINK}`,
      content: <InfrastructuresSection infoAtBottom {...infrastructure} />,
    },
    {
      ground: SECTIONS[3].ground,
      className: 'flex flex-col [justify-content:safe_flex-end]',
      content: <Footer {...footer} />,
    },
  ];

  return (
    <div className={`bg-brand-accent-blue ${className}`.trim()}>
      <SiteHeaderV5
        progress={progress}
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

      {/* The travelling wordmark. It only exists between its two homes, over
          everything else including the bar it is heading for. */}
      <img
        ref={flierRef}
        src="/assets/ui/wordmark-hero.svg"
        alt=""
        aria-hidden
        className={`pointer-events-none fixed z-[60] w-auto max-w-none transition-[filter] duration-300 ${
          inverted ? 'brightness-0 invert' : ''
        }`}
        style={{
          display: flying ? 'block' : 'none',
          left: flightRef.current?.from.left,
          top: flightRef.current?.from.top,
          height: flightRef.current?.from.height,
          transformOrigin: 'left top',
        }}
      />
    </div>
  );
}

export default HomePageV5;
