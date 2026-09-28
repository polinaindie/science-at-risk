import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react";
import { MobileNav } from "@/components/MobileNav";
import { wrapperClass } from "@/components/Layout";

export interface NavEntryV5 {
  label: string;
  href: string;
  /** Optional tally beside the label; the Figma frames show none. */
  count?: number;
}

export interface SiteHeaderV5Props {
  items?: NavEntryV5[];
  /**
   * 0 at the top of the page, 1 once the hero has scrolled away. Everything
   * that moves between the two states reads from this, so the wordmark and the
   * search travel with the scroll instead of snapping at a threshold.
   */
  progress?: number;
  /**
   * The ground and the ink the bar takes when the block beneath it is not one
   * of the two the scroll drives. Every block on the page hands these over, so
   * the bar reads as part of whatever it is standing on rather than as a black
   * band left behind by the stories.
   */
  ground?: string;
  inverted?: boolean;
  locale?: string;
  localeHref?: string;
  homeHref?: string;
  /** The page measures this row to know where the hero's pieces must land. */
  innerRef?: Ref<HTMLDivElement>;
  className?: string;
}

/** The wordmark's size once it has landed: 20px tall, which at the asset's
 *  own aspect is 210 wide. Wider than the frame's 202 because our SVG carries
 *  a little more side bearing, and a narrower box clipped the closing "!". */
export const BAR_WORDMARK_H = 20;
const WORDMARK_W = 210;

/** The bar does not change height: the same 40px stand-off in both states
 *  (Figma node 225:8792), and the row below it is what moves. */
const PAD_TOP = 40;

/** Room the landed wordmark takes ahead of the sections, gap included. */
const WORDMARK_SLOT = WORDMARK_W + 40;

/** Figma node 225:8792 — six sections, in the bar from `lg` up, behind the
 *  menu button below that. */
export const navItemsV5: NavEntryV5[] = [
  { label: "Scientists", href: "/experts" },
  { label: "Researches", href: "/research" },
  { label: "Societies", href: "/societies" },
  { label: "Stories", href: "/stories" },
  { label: "Infrastructure", href: "/infrastructures" },
  { label: "About", href: "/about" },
];

/**
 * Sticky chrome with two states rather than two components.
 *
 * At rest the bar carries the sections on the left and the locale on the
 * right; the wordmark and the search field belong to the hero below. As the
 * hero leaves, the wordmark flies into the left of the bar and the sections
 * move to its middle. There is no search in the bar; the hero's field is it.
 *
 * Past the halfway point the bar inverts to black, because by then it is
 * sitting over the black stories listing.
 */
export function SiteHeaderV5({
  items = navItemsV5,
  progress = 0,
  ground,
  inverted,
  locale = "EN",
  localeHref = "/uk",
  homeHref = "/",
  innerRef,
  className = "",
}: SiteHeaderV5Props) {
  const id = useId();
  const menuId = `${id}-menu`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // Measured so the sections can be centred by margin, which — unlike a
  // transform — also keeps them clear of the landed wordmark.
  const navListRef = useRef<HTMLUListElement>(null);
  const [navWidth, setNavWidth] = useState(0);

  useEffect(() => {
    const node = navListRef.current;
    if (!node) return;
    const ro = new ResizeObserver(() => setNavWidth(node.offsetWidth));
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const isUa = locale.toUpperCase() === "UA" || locale.toUpperCase() === "UK";

  const p = Math.min(1, Math.max(0, progress));
  const isDark = inverted ?? p > 0.5;
  const groundClass =
    ground ?? (isDark ? "bg-brand-black" : "bg-brand-accent-blue");
  const interactive = p > 0.95;
  /** The hero's own wordmark flies the whole way and is swapped for this
      copy in one frame at the end, where the two are the same picture in the
      same place. Anything gradual here shows two wordmarks, or dims the one
      there should be. */
  const landed = p >= 1 ? 1 : 0;

  const text = isDark ? "text-white" : "text-brand-black";
  const muted = isDark ? "text-white/60" : "text-brand-muted";

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

  // Escape closes the menu and hands focus back to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Inline because the value is continuous; a class can only hold the two ends.
  const wordmarkStyle: CSSProperties = { opacity: landed };

  const menuLabel = isUa
    ? menuOpen
      ? "Закрити меню"
      : "Відкрити меню"
    : menuOpen
      ? "Close menu"
      : "Open menu";

  return (
    <header
      /* The collapsed bar carries a white rule along its foot (Figma node
         94:10572); the expanded one has none, so it arrives with the rest of
         the collapsed state. */
      /* Above the lifted hero while the menu is open, so the panel cannot be
         covered by a wordmark in flight. */
      className={`sticky top-0 transition-colors duration-300 ${
        menuOpen ? "z-[70]" : "z-50"
      } ${groundClass} ${text} ${className}`.trim()}
    >
      <div
        ref={innerRef}
        className={`${wrapperClass} relative flex items-center`}
        style={{ paddingTop: PAD_TOP }}
      >
        {/* The landed wordmark, out of the flow at the row's padding edge —
            where the flight aims — so the sections move on their own terms. */}
        <div className="absolute hidden md:block">
          <a
            href={homeHref}
            aria-label="Science At Risk"
            className={`block overflow-hidden no-underline ${focusRing}`}
            style={wordmarkStyle}
            tabIndex={interactive ? undefined : -1}
            aria-hidden={interactive ? undefined : true}
          >
            <img
              src="/assets/ui/wordmark-hero.svg"
              alt=""
              width={1360}
              height={130}
              className={`block h-[20px] w-auto max-w-none ${isDark ? "brightness-0 invert" : ""}`.trim()}
            />
          </a>
        </div>

        {/* Desktop: the sections open the row on the left at rest, as in the
            frame, and travel to the middle of the bar with the flight — never
            closer to the left edge than the landed wordmark allows. */}
        <nav
          aria-label={isUa ? "Розділи" : "Sections"}
          className="hidden shrink-0 lg:block"
          style={{
            marginLeft: `max(${WORDMARK_SLOT * p}px, calc((100% - ${navWidth}px) / 2 * ${p}))`,
          }}
        >
          <ul ref={navListRef} className="m-0 flex list-none items-center gap-[28px] p-0">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`font-mono text-text1-desktop whitespace-nowrap no-underline hover:underline hover:underline-offset-4 ${text} ${focusRing}`}
                >
                  {item.label}
                  {item.count != null ? (
                    <span className={muted}> {item.count}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div aria-hidden className="flex-1" />

        {/* Both halves in the ink, the language being read underlined.
            Below `lg` there is no row of sections, so the switch opens the bar
            on the left and the menu button closes it on the right. From `md`
            the landed wordmark takes that corner once the bar has collapsed,
            so the switch steps right by the wordmark's slot as it lands. */}
        <a
          href={localeHref}
          className={`order-first shrink-0 font-mono text-text1-desktop uppercase whitespace-nowrap no-underline md:ml-[var(--satr-lang-slot)] lg:order-none lg:ml-0 ${text} ${focusRing}`}
          style={{ "--satr-lang-slot": `${WORDMARK_SLOT * p}px` } as CSSProperties}
        >
          <span className="underline underline-offset-4">
            {isUa ? "УКР" : "ENG"}
          </span>
          <span>/{isUa ? "ENG" : "УКР"}</span>
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuLabel}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className={`flex shrink-0 items-center justify-center border-0 bg-transparent p-0 lg:hidden ${focusRing}`}
        >
          <img
            src="/assets/ui/hamburger-dark.svg"
            alt=""
            width={30}
            height={22}
            className={`h-[22px] w-[30px] ${isDark ? "brightness-0 invert" : ""}`.trim()}
          />
        </button>
      </div>

      {menuOpen ? (
        <div
          id={menuId}
          className="fixed inset-0 z-[60] flex justify-end lg:hidden"
        >
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full">
            <MobileNav
              open
              items={items}
              tone={isDark ? "dark" : "light"}
              locale={isUa ? "UA" : "EN"}
              onClose={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default SiteHeaderV5;
