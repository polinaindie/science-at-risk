import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/Button';
import { Wrapper, Row, Col, fitTextClass } from '@/components/Layout';
import { Link } from '@/components/Link';
import { ScopeTabs } from '@/components/ScopeTabs';
import { Tag } from '@/components/Tag';

/** The live site's pages are copied under `public/`, so they sit beside this app
 *  wherever it is served from — `BASE_URL` is `/` locally and `/science-at-risk/`
 *  when published. */
const live = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export interface HomeScientistsTag {
  label: string;
  count: number;
  href: string;
}

/** What the block searches: the scientists themselves, or the societies that
 *  gather them. */
export type HomeScientistsScope = 'scientists' | 'societies';

/** Everything in the block that changes with the scope. */
export interface HomeScientistsMode {
  /** The scope's name in the switch. */
  label: string;
  placeholder: string;
  buttonLabel: string;
  note: string;
  noteLinkLabel: string;
  noteHref: string;
  tags: HomeScientistsTag[];
  /** Over the tags, when this scope's tags are not the block's `popularLabel`. */
  popularLabel?: string;
  /** Where the form goes without a handler — a plain GET. */
  action: string;
}

export interface HomeScientistsBlockProps {
  title?: string;
  /** The switch's name for screen readers; it has no visible legend. */
  scopeLabel?: string;
  popularLabel?: string;
  modes?: Record<HomeScientistsScope, HomeScientistsMode>;
  defaultScope?: HomeScientistsScope;
  onSearch?: (query: string, scope: HomeScientistsScope) => void;
  className?: string;
}

export const defaultScientistsMode: HomeScientistsMode = {
  label: 'Scientists',
  popularLabel: 'Popular requests',
  placeholder: 'Enter scientific field or name',
  buttonLabel: 'Find scientists',
  note: 'Mark the scientific field that interests you - find and involve Ukrainian scientists in your own projects',
  noteLinkLabel: 'To the full database of scientists',
  noteHref: live('scientists.html'),
  tags: [
    { label: 'Teaching', count: 100, href: live('scientists.html?tag=teaching') },
    { label: 'Science popularization', count: 86, href: live('scientists.html?tag=science-popularization') },
    { label: 'Biology', count: 57, href: live('scientists.html?tag=biology') },
    { label: 'Natural sciences', count: 55, href: live('scientists.html?tag=natural-sciences') },
    { label: 'Biochemistry', count: 41, href: live('scientists.html?tag=biochemistry') },
  ],
  action: live('scientists.html'),
};

/** The societies' domains, counted on the societies page (public/societies.html) — static, like the scientists' counts above.
 *  Fifteen societies had no domain in the live data; the page carries placeholder ones (scripts/societies-placeholder-domains.json). */
export const defaultSocietiesMode: HomeScientistsMode = {
  label: 'Societies',
  placeholder: 'Enter field or society name',
  buttonLabel: 'Find societies',
  note: 'Reach a whole community at once - scientific societies bring together the scientists of one field',
  noteLinkLabel: 'To all scientific societies',
  noteHref: live('societies.html'),
  tags: [
    { label: 'Natural sciences', count: 8, href: '/societies?tag=natural-sciences' },
    { label: 'Health care', count: 7, href: '/societies?tag=health-care' },
    { label: 'Biology', count: 5, href: '/societies?tag=biology' },
    { label: 'Social and behavioural sciences', count: 5, href: '/societies?tag=social-and-behavioural-sciences' },
    { label: 'Humanities', count: 3, href: '/societies?tag=humanities' },
  ],
  action: live('societies.html'),
};

const defaultModes: Record<HomeScientistsScope, HomeScientistsMode> = {
  scientists: defaultScientistsMode,
  societies: defaultSocietiesMode,
};

const SCOPES: HomeScientistsScope[] = ['scientists', 'societies'];

/** Lays every scope's version of a piece in one grid cell, the inactive ones
 *  hidden but still taking their room, so the piece measures the same
 *  whichever scope is on. The block sits on the foot of its screen, so a note
 *  a line longer or tags a row taller would otherwise shift everything above
 *  them at the switch. `visibility: hidden` also keeps the hidden versions out
 *  of the tab order and away from screen readers. */
function ScopeStack({
  scope,
  modes,
  render,
  as: Tag = 'div',
  className = '',
}: {
  scope: HomeScientistsScope;
  modes: Record<HomeScientistsScope, HomeScientistsMode>;
  render: (mode: HomeScientistsMode) => ReactNode;
  as?: 'div' | 'span';
  className?: string;
}) {
  return (
    <Tag className={`grid grid-cols-[minmax(0,1fr)] ${className}`.trim()}>
      {SCOPES.map((value) => (
        <Tag
          key={value}
          className={`col-start-1 row-start-1 ${value === scope ? '' : 'invisible'}`.trim()}
        >
          {render(modes[value])}
        </Tag>
      ))}
    </Tag>
  );
}

/** The popular requests, set flush left inside a box that hugs the widest row
 *  of tags and sits against the column's right edge (from `md`), so the rows
 *  end on the search line's end without being ragged on the right. CSS sizes
 *  a wrapping row box to its container, not to its widest line, so the width
 *  is worked out here: the tags are laid in rows the way `flex-wrap` lays
 *  them, and the box takes the widest. Until that runs, and without script,
 *  it is simply full width and left-aligned. */
function PopularTags({ label, tags }: { label: string; tags: HomeScientistsTag[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    const box = boxRef.current;
    const list = listRef.current;
    const room = box?.parentElement;
    if (!box || !list || !room) return;

    const measure = () => {
      const available = room.clientWidth;
      const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
      let row = 0;
      let widest = 0;
      for (const item of Array.from(list.children)) {
        const w = item.getBoundingClientRect().width;
        if (row > 0 && row + gap + w <= available + 0.5) {
          row += gap + w;
        } else {
          widest = Math.max(widest, row);
          row = w;
        }
      }
      widest = Math.max(widest, row);
      setWidth(Math.min(available, Math.ceil(widest)));
    };

    measure();
    // The room changes with the window; the tags change as the fonts land.
    const observer = new ResizeObserver(measure);
    observer.observe(room);
    Array.from(list.children).forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [tags]);

  return (
    <div ref={boxRef} className="max-w-full md:ml-auto" style={{ width }}>
      <p className="mb-3 font-text text-text1-mobile text-brand-black md:text-[1rem] md:leading-[1.5rem]">
        {label}
      </p>
      <div ref={listRef} className="flex flex-wrap gap-2.5" role="list">
        {tags.map((tag) => (
          <span role="listitem" key={tag.href} className="max-w-full">
            <Tag as="a" href={tag.href} count={tag.count}>
              {tag.label}
            </Tag>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The home page's Scientists block, laid out the way scienceatrisk.org has it:
 * the ask in large serif, the search line with its button under it, and along
 * the foot the note on the left and the popular requests on the right, on the
 * same twelve columns as everything else.
 *
 * Over the search line a switch turns the whole block from the scientists to
 * the scientific societies — the other way into Ukrainian science. The ask
 * names neither, so it holds for both and stays put while the search, its
 * button, the note and the popular requests follow the switch; what has been
 * typed stays in the field across it.
 */
export function HomeScientistsBlock({
  title = 'Find partners in Ukrainian science',
  scopeLabel = 'Search in',
  popularLabel = 'Popular domains',
  modes = defaultModes,
  defaultScope = 'scientists',
  onSearch,
  className = '',
}: HomeScientistsBlockProps) {
  const id = useId();
  const [scope, setScope] = useState<HomeScientistsScope>(defaultScope);
  const mode = modes[scope];
  const inputRef = useRef<HTMLInputElement>(null);

  /* The caret goes into the field as soon as the reader can use it, and again each time the scope is switched. On the
     home page the block waits `inert` behind the others until it is its turn, and an inert field cannot take focus, so
     this also waits for that to lift. Only while nothing else has the focus, so it is never taken from a reader who has
     moved on; not on a touch screen, where it would raise the keyboard unasked; and without scrolling the first time. */
  const focusedScope = useRef<HomeScientistsScope | null>(null);
  const usedPointer = useRef(false);
  useEffect(() => {
    const down = () => { usedPointer.current = true; };
    const key = () => { usedPointer.current = false; };
    window.addEventListener('pointerdown', down, true);
    window.addEventListener('keydown', key, true);
    return () => {
      window.removeEventListener('pointerdown', down, true);
      window.removeEventListener('keydown', key, true);
    };
  }, []);
  useEffect(() => {
    const fine = typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const input = inputRef.current;
    if (!fine || !input) return;
    let keepScroll = true;
    const hold = input.closest('[inert]') ? input.closest('[inert]') : null;
    const put = () => {
      if (!input.isConnected || input.closest('[inert]')) return false;
      /* A click on a scope word leaves the focus on that word's radio: the field takes it from there. A keyboard reader
         arrowing through the words keeps theirs. */
      const onScope = document.activeElement instanceof HTMLInputElement && document.activeElement.type === 'radio';
      if (document.activeElement !== document.body && document.activeElement !== input && !(onScope && usedPointer.current)) return true;
      input.focus({ preventScroll: keepScroll });
      focusedScope.current = scope;
      return true;
    };
    put();
    /* The block arrives: its turn comes in the deck (the inert lifts), or it scrolls into view on the plain page. Each
       time it does, and nothing else holds the focus, the caret goes back into the field. */
    const watcher = hold ? new MutationObserver(() => { put(); }) : null;
    watcher?.observe(hold!, { attributes: true, attributeFilter: ['inert'] });
    const section = input.closest('section');
    const seen =
      section && typeof IntersectionObserver === 'function'
        ? new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              keepScroll = true;
              put();
            }
          }, { threshold: 0.5 })
        : null;
    if (section) seen?.observe(section);
    return () => {
      watcher?.disconnect();
      seen?.disconnect();
    };
  }, [scope]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!onSearch) return;
    e.preventDefault();
    onSearch(String(new FormData(e.currentTarget).get('search') ?? ''), scope);
  };

  return (
    <section className={`pb-20 pt-[112px] lg:py-14 ${className}`.trim()} aria-labelledby={`${id}-title`}>
      <Wrapper>
        <h2 id={`${id}-title`} className="m-0 max-w-[18ch] font-heading text-h1 text-brand-black">
          {title}
        </h2>

        {/* Two words, not buttons (see ScopeTabs): native radios, so the arrow keys, the focus and what a screen reader
            says all come with them. They sit outside the form so the scope never rides along in the query — the form's
            action already says where it goes. */}
        <ScopeTabs
          className="mt-8 md:mt-12"
          label={scopeLabel}
          value={scope}
          onChange={setScope}
          tabs={SCOPES.map((value) => ({ value, label: modes[value].label }))}
        />

        <form
          role="search"
          action={mode.action}
          method="get"
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-6 md:mt-6 md:flex-row md:items-end md:justify-between md:gap-6 md:border-b-2 md:border-brand-black md:pb-3"
        >
          {/* The label rides up off the line and shrinks as soon as the field
              has focus or text in it, and stays there to be read. The
              placeholder is a space: `:placeholder-shown` is what tells an
              empty field from a filled one. On a phone the button drops under
              the field, so the line goes with the field and not the form —
              it is the field's line, and the button sits clear of it. */}
          <label
            className="satr-float satr-float--hero min-w-0 flex-1 border-b-2 border-brand-black pb-3 md:border-0 md:pb-0"
            htmlFor={id}
          >
            <input
              id={id}
              ref={inputRef}
              name="search"
              type="search"
              placeholder=" "
              className="w-full appearance-none border-0 bg-transparent font-text text-[length:clamp(16px,4.8vw,22px)] leading-[1.75rem] text-brand-black outline-none lg:text-[1.125rem]"
            />
            {/* Wraps rather than truncates: a reader who widens the letter
                spacing still gets the whole label, not an ellipsis. */}
            <span className="satr-float__label max-w-full font-text text-brand-muted">
              {mode.placeholder}
            </span>
          </label>
          {/* As wide as the longer label, so the field's end stays put. */}
          <Button type="submit" variant="black" className="shrink-0">
            <ScopeStack
              as="span"
              scope={scope}
              modes={modes}
              render={(m) => m.buttonLabel}
              className="justify-items-center"
            />
          </Button>
        </form>

        <Row className="mt-14 items-end gap-y-8 md:mt-24">
          {/* As on scienceatrisk.org: side by side from `md`, their bottoms on one line — halves until `lg`, then the four
              columns the Research block gives its text, with the tags from the same sixth column as its stories. */}
          <Col md={6} lg={4}>
            <ScopeStack
              scope={scope}
              modes={modes}
              className="items-end"
              render={(m) => (
                <>
                  <p className={`m-0 font-text text-brand-black ${fitTextClass}`}>{m.note}</p>
                  <Link href={m.noteHref} className="mt-6">
                    {m.noteLinkLabel}
                  </Link>
                </>
              )}
            />
          </Col>
          <Col md={6} lg={7} offsetLg={5}>
            <ScopeStack
              scope={scope}
              modes={modes}
              className="items-end"
              render={(m) => (
                <PopularTags label={m.popularLabel ?? popularLabel} tags={m.tags} />
              )}
            />
          </Col>
        </Row>
      </Wrapper>
    </section>
  );
}

export default HomeScientistsBlock;
