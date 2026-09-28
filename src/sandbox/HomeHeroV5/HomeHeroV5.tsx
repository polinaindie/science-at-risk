import { useId, type CSSProperties, type FormEvent, type Ref } from "react";
import { Button } from "@/components/Button";
import { Wrapper } from "@/components/Layout";

export interface HomeHeroV5Props {
  placeholder?: string;
  /** From `lg` up, beside the wordmark (Figma node 225:8812). Where the
   *  field is too narrow for all of it, it ends in an ellipsis on one line. */
  placeholderDesktop?: string;
  buttonLabel?: string;
  buttonLabelDesktop?: string;
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
 * The expanded half of the header's two states: the wordmark at full size
 * living in the content. Below `lg` the search is a full-width line beneath
 * it; from `lg` up it stands on the same line, to the wordmark's right, the
 * two sharing a foot (Figma node 188:5337, "Hero" on Main Page).
 *
 * These two elements are the ones that travel: HomePageV5 measures where each
 * ends up in the bar and drives them there with a transform, so what the reader
 * follows is the wordmark itself moving rather than one copy fading out while a
 * second fades in somewhere else.
 */
export function HomeHeroV5({
  placeholder = "Scientific field or name",
  placeholderDesktop = "Search scientists by field or name",
  buttonLabel = "Find a scientist",
  buttonLabelDesktop = "Find",
  progress = 0,
  ground = true,
  wordmarkRef,
  searchRef,
  inputRef,
  onSearch,
  action = "/experts",
  queryName = "search",
  className = "",
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
    onSearch(String(fd.get(queryName) ?? ""));
  };

  /** The search line clears the screen in the first half of the change. Only
   *  the wordmark travels — the bar brings in a "Search" of its own, so there
   *  is nothing for this line to fly into. */
  const leavingStyle: CSSProperties = { opacity: 1 - Math.min(1, p * 2) };

  return (
    // Full bleed, so the ground runs edge to edge; the container sits inside.
    <section
      /* Figma node 225:8792: the wordmark's top at 211, 143 under the 68px
         bar, and the photographs 56 under its foot. The field and its rule
         run 3px taller than the wordmark and the row starts at their top,
         hence 140; 20 plus the grid's own 36 is the 56. */
      className={`pt-[64px] transition-colors duration-300 lg:pt-[140px] lg:pb-[20px] ${
        ground ? (isDark ? "bg-brand-black" : "bg-brand-accent-blue") : ""
      } ${className}`.trim()}
    >
      <Wrapper>
        {/* One line from `lg` up: the wordmark takes 665 of the frame's 1360
            and the field the rest, bottoms level so the rule under the field
            runs out from the foot of the wordmark. */}
        <div className="lg:flex lg:items-end lg:gap-[36px]">
          {/* transform-origin and the transform itself are set by the page. */}
          <h1
            ref={wordmarkRef}
            className="w-full font-serif leading-none lg:w-[49%] lg:shrink-0"
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
              /* Below `lg`, 66% of the content width — the wordmark stops well
             short of the right margin, it does not span it, and the ceiling
             keeps it in hand past 1920. From `lg` up the heading's own width
             sets it. */
              className={`block h-auto w-[66%] max-w-[1130px] object-contain object-left transition-[filter] duration-300 lg:w-full lg:max-w-none ${
                isDark ? "brightness-0 invert" : ""
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
            className={`mt-[56px] border-b-2 pb-[18px] transition-colors duration-300 lg:mt-0 lg:min-w-0 lg:flex-1 ${
              isDark ? "border-white/40" : "border-brand-line"
            }`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
              {/* The label is not a placeholder that vanishes as you type: it
                rides up off the line and shrinks, and it is still there to read
                once the field has something in it. The field reserves that
                height from the start, so nothing below it moves. */}
              <label
                className="satr-float satr-float--hero min-w-0 flex-1"
                htmlFor={id}
              >
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
                  className={`w-full appearance-none border-0 bg-transparent font-mono text-[22px] leading-[28px] font-light outline-none transition-colors duration-300 lg:text-[18px] ${
                    isDark ? "text-white" : "text-brand-black"
                  }`}
                />
                <span
                  /* No `transition-*` utility here: a utility sets
                   `transition-property` and would drop the transform from the
                   list, which is what made the label jump rather than travel.
                   The rule the class carries transitions both. */
                  className={`satr-float__label max-w-full truncate font-mono ${
                    isDark ? "text-white/60" : "text-brand-muted"
                  }`}
                >
                  <span className="lg:hidden">{placeholder}</span>
                  <span className="hidden lg:inline">{placeholderDesktop}</span>
                </span>
              </label>
              <Button
                type="submit"
                variant={isDark ? "white" : "black"}
                className="shrink-0 lg:px-[36px]"
                tabIndex={p > 0.9 ? -1 : undefined}
              >
                <span className="lg:hidden">{buttonLabel}</span>
                <span className="hidden lg:inline">{buttonLabelDesktop}</span>
              </Button>
            </div>
          </form>
        </div>
      </Wrapper>
    </section>
  );
}

export default HomeHeroV5;
