import { useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/Button';
import { Wrapper, Row, Col, fitTextClass } from '@/components/Layout';
import { Link } from '@/components/Link';
import { Tag } from '@/components/Tag';

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
  placeholder: 'Enter scientific field or name',
  buttonLabel: 'Find scientists',
  note: 'Mark the scientific field that interests you - find and involve Ukrainian scientists in your own projects',
  noteLinkLabel: 'To the full database of scientists',
  noteHref: '/experts',
  tags: [
    { label: 'Teaching', count: 101, href: '/experts?tag=teaching' },
    { label: 'Science popularization', count: 86, href: '/experts?tag=science-popularization' },
    { label: 'Biology', count: 57, href: '/experts?tag=biology' },
    { label: 'Natural sciences', count: 55, href: '/experts?tag=natural-sciences' },
    { label: 'Biochemistry', count: 41, href: '/experts?tag=biochemistry' },
  ],
  action: '/experts',
};

/** The societies' fields as sartr-ui's `societiesContent` tags them, counted
 *  on 2026-10-05 — static, like the scientists' counts above. */
export const defaultSocietiesMode: HomeScientistsMode = {
  label: 'Societies',
  placeholder: 'Enter field or society name',
  buttonLabel: 'Find societies',
  note: 'Reach a whole community at once - scientific societies bring together the scientists of one field',
  noteLinkLabel: 'To all scientific societies',
  noteHref: '/societies',
  tags: [
    { label: 'Medicine', count: 4, href: '/societies?tag=medicine' },
    { label: 'Ecology', count: 2, href: '/societies?tag=ecology' },
    { label: 'Technology', count: 2, href: '/societies?tag=technology' },
    { label: 'Psychology', count: 2, href: '/societies?tag=psychology' },
    { label: 'Microbiology', count: 2, href: '/societies?tag=microbiology' },
  ],
  action: '/societies',
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
    <Tag className={`grid ${className}`.trim()}>
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
      <p className="mb-3 font-mono text-text1-mobile text-brand-black md:text-[16px] md:leading-[24px]">
        {label}
      </p>
      <div ref={listRef} className="flex flex-wrap gap-2.5" role="list">
        {tags.map((tag) => (
          <span role="listitem" key={tag.href}>
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
  popularLabel = 'Popular requests',
  modes = defaultModes,
  defaultScope = 'scientists',
  onSearch,
  className = '',
}: HomeScientistsBlockProps) {
  const id = useId();
  const [scope, setScope] = useState<HomeScientistsScope>(defaultScope);
  const mode = modes[scope];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!onSearch) return;
    e.preventDefault();
    onSearch(String(new FormData(e.currentTarget).get('search') ?? ''), scope);
  };

  return (
    <section className={`py-14 ${className}`.trim()} aria-labelledby={`${id}-title`}>
      <Wrapper>
        <h2 id={`${id}-title`} className="m-0 max-w-[18ch] font-serif text-h1 text-brand-black">
          {title}
        </h2>

        {/* Native radios, drawn as two words: the arrow keys, the focus and
            what a screen reader says all come with them. They sit outside the
            form so the scope never rides along in the query — the form's
            action already says where it goes. Words, not buttons: set larger
            and heavier than the text around them, the chosen one underlined
            thick, so the choice reads without competing with the search
            button. Each label is padded to a 44px target; the padding comes
            out of the gap above it. */}
        <fieldset className="m-0 mt-8 flex gap-8 border-0 p-0 md:mt-12">
          <legend className="sr-only">{scopeLabel}</legend>
          {SCOPES.map((value) => (
            <label key={value} className="group cursor-pointer py-2">
              <input
                type="radio"
                name={`${id}-scope`}
                value={value}
                checked={scope === value}
                onChange={() => setScope(value)}
                className="peer sr-only"
              />
              <span className="block border-b-[3px] border-transparent pb-1 font-mono text-[20px] font-medium leading-[28px] text-brand-muted transition-colors group-hover:border-brand-line-muted group-hover:text-brand-black md:text-[24px] md:leading-[32px] peer-checked:border-brand-black peer-checked:text-brand-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand-black">
                {modes[value].label}
              </span>
            </label>
          ))}
        </fieldset>

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
              name="search"
              type="search"
              placeholder=" "
              className="w-full appearance-none border-0 bg-transparent font-mono text-[length:clamp(16px,4.8vw,22px)] font-light leading-[28px] text-brand-black outline-none lg:text-[18px]"
            />
            {/* Wraps rather than truncates: a reader who widens the letter
                spacing still gets the whole label, not an ellipsis. */}
            <span className="satr-float__label max-w-full font-mono text-brand-muted">
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
          {/* Side by side from `md`, halves until `lg`, then the four columns
              the Research block gives its text, with the tags from the same
              sixth column as its stories. */}
          <Col md={6} lg={4}>
            <ScopeStack
              scope={scope}
              modes={modes}
              className="items-end"
              render={(m) => (
                <>
                  <p className={`m-0 font-mono text-brand-black ${fitTextClass}`}>{m.note}</p>
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
                <PopularTags label={popularLabel} tags={m.tags} />
              )}
            />
          </Col>
        </Row>
      </Wrapper>
    </section>
  );
}

export default HomeScientistsBlock;
