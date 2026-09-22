import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import './SectionDeck.css';

/** Header colour asked for by the section currently on screen. */
export type HeaderTone = 'black' | 'white';

export interface DeckSection {
  key: string;
  node: ReactNode;
  /**
   * What the header should be painted while this section is on screen — the
   * site's own `data-color`: `black` over a light field, `white` over a dark
   * one.
   */
  tone?: HeaderTone;
}

export interface SectionDeckProps {
  sections: DeckSection[];
  /** Called with the tone of the section that has come to the front. */
  onToneChange?: (tone: HeaderTone) => void;
  /** Turn the deck off and let the sections stack down the page as usual. */
  enabled?: boolean;
}

/** The site's own `scrollingSpeed`, easing and wheel threshold. */
const SPEED = 800;
const WHEEL_THRESHOLD = 150;
const TOUCH_SENSITIVITY = 50;
/** How far down the viewport the bar sits, for reading the tone under it. */
const HEADER_BAND = 40;

/**
 * A section has to overflow by more than this before the deck hands it the
 * gesture. A section that sits a dozen pixels over the viewport is not
 * something anyone means to scroll, and treating it as scrollable would
 * swallow every gesture and leave the deck looking stuck.
 */
const SCROLL_SLACK = 32;

/**
 * The site runs the deck from 1024px up and only when the window is tall
 * enough to hold a screen — fullpage's `responsiveWidth` / `responsiveHeight`.
 * A reader who asks for less motion gets the plain stacked page instead.
 */
const DECK_QUERY = '(min-width: 1024px) and (min-height: 500px)';
const CALM_QUERY = '(prefers-reduced-motion: reduce)';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * One screen at a time, the way the home page reads on the live site: the
 * next section slides up over the one you are leaving, which is then parked
 * out of view. A gesture moves exactly one section, and the next gesture is
 * ignored until the slide has finished.
 *
 * Sections taller than the screen scroll inside themselves first; the deck
 * only takes over once that inner scroll has reached its end.
 */
export function SectionDeck({ sections, onToneChange, enabled = true }: SectionDeckProps) {
  const roomy = useMediaQuery(DECK_QUERY);
  const calm = useMediaQuery(CALM_QUERY);
  const active = enabled && roomy && !calm;

  const [index, setIndex] = useState(0);
  // The section being left behind holds its place until the slide is over.
  const [leaving, setLeaving] = useState<number | null>(null);
  const indexRef = useRef(0);
  const locked = useRef(false);
  const wheelDistance = useRef(0);
  const touchStart = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  // Held in a ref so a new callback on every render does not rebuild `go`.
  const onTone = useRef(onToneChange);
  useEffect(() => {
    onTone.current = onToneChange;
  }, [onToneChange]);

  const go = useCallback(
    (next: number) => {
      if (locked.current) return;
      const current = indexRef.current;
      const target = Math.max(0, Math.min(sections.length - 1, next));
      if (target === current) return;
      locked.current = true;
      indexRef.current = target;
      setLeaving(current);
      setIndex(target);
      onTone.current?.(sections[target]?.tone ?? 'black');
      window.setTimeout(() => {
        locked.current = false;
        setLeaving(null);
      }, SPEED);
    },
    [sections],
  );

  // Off the deck the page scrolls as usual, so the tone follows whichever
  // section has reached the bar rather than the deck's own index.
  useEffect(() => {
    if (active) return;
    let frame = 0;
    const report = () => {
      frame = 0;
      const panes = Array.from(containerRef.current?.children ?? []) as HTMLElement[];
      let current = 0;
      panes.forEach((pane, i) => {
        if (pane.getBoundingClientRect().top <= HEADER_BAND) current = i;
      });
      onTone.current?.(sections[current]?.tone ?? 'black');
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(report);
    };
    report();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [active, sections]);

  // Off the deck nothing is animating, so no gesture should be held back.
  // `leaving` only shapes the transforms the deck itself applies, so it can be
  // left as it is.
  useEffect(() => {
    if (active) return;
    locked.current = false;
    wheelDistance.current = 0;
  }, [active]);

  // The deck owns the whole viewport, so the document must not scroll as well.
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previous;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    /** True while the section on screen can still scroll further itself. */
    const innerScrollLeft = (direction: 1 | -1) => {
      const pane = containerRef.current?.children[index] as HTMLElement | undefined;
      if (!pane) return false;
      const room = pane.scrollHeight - pane.clientHeight;
      if (room <= SCROLL_SLACK) return false;
      return direction > 0 ? pane.scrollTop < room - 1 : pane.scrollTop > 1;
    };

    const onWheel = (event: WheelEvent) => {
      const direction = event.deltaY > 0 ? 1 : -1;
      if (innerScrollLeft(direction)) {
        wheelDistance.current = 0;
        return;
      }
      if (locked.current) return;
      // A change of direction starts the count again.
      if (wheelDistance.current * event.deltaY < 0) wheelDistance.current = 0;
      wheelDistance.current += event.deltaY;
      if (Math.abs(wheelDistance.current) < WHEEL_THRESHOLD) return;
      const step = wheelDistance.current > 0 ? 1 : -1;
      wheelDistance.current = 0;
      go(index + step);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      // Let the search field and the contact form have their keys.
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('input, textarea, select, [contenteditable]')
      ) {
        return;
      }
      const keys: Record<string, number> = {
        ArrowDown: index + 1,
        PageDown: index + 1,
        ' ': index + 1,
        ArrowUp: index - 1,
        PageUp: index - 1,
        Home: 0,
        End: sections.length - 1,
      };
      const next = keys[event.key];
      if (next === undefined) return;
      if (innerScrollLeft(next > index ? 1 : -1)) return;
      event.preventDefault();
      go(next);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStart.current = event.touches[0].clientY;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const travel = touchStart.current - event.changedTouches[0].clientY;
      if (Math.abs(travel) < TOUCH_SENSITIVITY) return;
      if (innerScrollLeft(travel > 0 ? 1 : -1)) return;
      go(index + (travel > 0 ? 1 : -1));
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [active, go, index, sections.length]);

  return (
    <div className={`deck${active ? '' : ' deck--flow'}`} ref={containerRef}>
      {sections.map((section, i) => {
        // The section on screen sits at rest; the one being left behind holds
        // its place until the slide is over; the rest wait off-screen, above
        // if they have been read and below if they have not.
        const held = leaving === i;
        const offset = i === index || held ? 0 : i < index ? -100 : 100;
        return (
          <div
            key={section.key}
            className={`deck__section${i === index ? ' deck__section--active' : ''}`}
            style={active ? { transform: `translateY(${offset}%)` } : undefined}
            aria-hidden={active && i !== index && !held ? true : undefined}
          >
            {section.node}
          </div>
        );
      })}
    </div>
  );
}
