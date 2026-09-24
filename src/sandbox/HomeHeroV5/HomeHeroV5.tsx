import { useId, type CSSProperties, type FormEvent, type Ref } from 'react';
import { Button } from '@/components/Button';
import { Wrapper } from '@/components/Layout';

export interface HomeHeroV5Props {
  tagline?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** 0 at rest, 1 once the bar has taken the wordmark and the search over. */
  progress?: number;
  /**
   * Whether this carries its own ground. On the page it must not: the screen
   * it sits on shrinks to the height of the title that replaces it, while
   * this block keeps its full height, so its ground would hang below the box
   * and lie across the tops of the story photographs beneath. There the stage
   * behind it holds the ground instead.
   */
  ground?: boolean;
  /** The page flies these two into the header bar; it needs to reach them. */
  wordmarkRef?: Ref<HTMLHeadingElement>;
  searchRef?: Ref<HTMLFormElement>;
  /** The bar's "Search" sends focus here — this is the field on screen at
   *  the moment that word is legible. */
  inputRef?: Ref<HTMLInputElement>;
  onSearch?: (query: string) => void;
  action?: string;
  queryName?: string;
  className?: string;
}

/**
 * The expanded half of the header's two states (Figma node 94:10484): the
 * wordmark at full size living in the content, with the search as a full-width
 * line beneath it.
 *
 * These two elements are the ones that travel: HomePageV5 measures where each
 * ends up in the bar and drives them there with a transform, so what the reader
 * follows is the wordmark itself moving rather than one copy fading out while a
 * second fades in somewhere else.
 */
export function HomeHeroV5({
  tagline = "Research & expertise from Ukraine's scientific frontline",
  placeholder = 'Scientific field or name',
  buttonLabel = 'Find a scientist',
  progress = 0,
  ground = true,
  wordmarkRef,
  searchRef,
  inputRef,
  onSearch,
  action = '/experts',
  queryName = 'search',
  className = '',
}: HomeHeroV5Props) {
  const id = useId();
  const p = Math.min(1, Math.max(0, progress));
  /** Same threshold the bar inverts on: the wordmark and the search line are
      still in flight here, and a white band between the already-black bar and
      the black stories panel would read as a third, stranded header. */
  const isDark = p > 0.5;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!onSearch) return; // Plain GET otherwise — works with no JavaScript.
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch(String(fd.get(queryName) ?? ''));
  };

  /** The tagline and the search line both clear the screen in the first
   *  half of the change. Only the wordmark travels — the bar keeps the word
   *  "Search" of its own, so there is nothing for this line to fly into. */
  const leavingStyle: CSSProperties = { opacity: 1 - Math.min(1, p * 2) };

  return (
    // Full bleed, so the ground runs edge to edge; the container sits inside.
    <section
      className={`pt-[36px] transition-colors duration-300 lg:pt-[38px] ${
        ground ? (isDark ? 'bg-brand-black' : 'bg-brand-accent-blue') : ''
      } ${className}`.trim()}
    >
      <Wrapper>
        <p
          className={`font-mono text-h3-mobile md:text-h3-desktop lg:hidden ${
            isDark ? 'text-white' : 'text-brand-black'
          }`}
          style={leavingStyle}
        >
          {tagline}
        </p>

        {/* transform-origin and the transform itself are set by the page. */}
        <h1
          ref={wordmarkRef}
          className="mt-[28px] w-full font-serif leading-none lg:mt-0"
          data-hero-wordmark
        >
          <span className="sr-only">Science At Risk</span>
          {/* The filter transitions over the same 300ms as the ground under it,
            so the wordmark changes colour with the band rather than snapping. */}
          <img
            src="/assets/ui/wordmark-hero.svg"
            alt=""
            width={1360}
            height={130}
            /* 66% of the content width, measured off the reference frame —
             the wordmark stops well short of the right margin, it does not
             span it. The ceiling keeps it in hand past 1920. */
            className={`block h-auto w-[66%] max-w-[1130px] object-contain object-left transition-[filter] duration-300 ${
              isDark ? 'brightness-0 invert' : ''
            }`.trim()}
          />
        </h1>

        <form
          ref={searchRef}
          style={leavingStyle}
          aria-hidden={p > 0.5 ? true : undefined}
          role="search"
          action={action}
          method="get"
          onSubmit={handleSubmit}
          className={`mt-[56px] border-b-2 pb-[18px] transition-colors duration-300 lg:mt-[123px] ${
            isDark ? 'border-white/40' : 'border-brand-line'
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            {/* The label is not a placeholder that vanishes as you type: it
                rides up off the line and shrinks, and it is still there to read
                once the field has something in it. The field reserves that
                height from the start, so nothing below it moves. */}
            <label className="satr-float satr-float--hero min-w-0 flex-1" htmlFor={id}>
              <input
                ref={inputRef}
                id={id}
                name={queryName}
                type="search"
                tabIndex={p > 0.9 ? -1 : undefined}
                /* A space, not the label: `:placeholder-shown` is what tells an
                   empty field from a filled one, and a visible placeholder
                   would sit under the label that has not moved yet. */
                placeholder=" " 
                /* `appearance-none` is not cosmetic here: a search input
                   keeps a native inner editor whose own metrics render the
                   typed value higher and smaller than the placeholder it
                   replaces, so the line appears to jump as you start typing.
                   Stripping the native chrome makes value and placeholder
                   share one box. */
                className={`w-full appearance-none border-0 bg-transparent font-mono text-[22px] leading-[28px] font-light outline-none transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-brand-black'
                }`}
              />
              <span
                /* No `transition-*` utility here: a utility sets
                   `transition-property` and would drop the transform from the
                   list, which is what made the label jump rather than travel.
                   The rule the class carries transitions both. */
                className={`satr-float__label font-mono ${
                  isDark ? 'text-white/60' : 'text-brand-muted'
                }`}
              >
                {placeholder}
              </span>
            </label>
            <Button
              type="submit"
              variant={isDark ? 'white' : 'black'}
              className="shrink-0"
              tabIndex={p > 0.9 ? -1 : undefined}
            >
              {buttonLabel}
            </Button>
          </div>
        </form>
      </Wrapper>
    </section>
  );
}

export default HomeHeroV5;
