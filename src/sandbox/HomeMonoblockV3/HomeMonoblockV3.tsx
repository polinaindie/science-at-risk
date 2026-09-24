import { useId, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';

export interface MonoblockSection {
  /** Stable key for the active row — not href, which changes with the locale. */
  id: string;
  label: string;
  href: string;
  /** The single small line on the right of the label. */
  meta?: string;
  /** 'primary' sets the row in h2, 'secondary' in h3. */
  emphasis?: 'primary' | 'secondary';
}

export interface MonoblockLink {
  label: string;
  href: string;
}

export interface HomeMonoblockV3Props {
  tagline?: string;
  /** The content sections that make up the index. */
  sections?: MonoblockSection[];
  /** Reference rather than content — they sit in the bottom rule, not the index. */
  utilityLinks?: MonoblockLink[];
  socialLinks?: MonoblockLink[];
  placeholder?: string;
  buttonLabel?: string;
  onSearch?: (query: string) => void;
  locale?: string;
  localeHref?: string;
  /** Which row reads as active before anyone points at one. */
  defaultActiveId?: string;
  className?: string;
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * The homepage as a single screen: an index of the site rather than a page of
 * content, so every section is one click from the first thing a visitor sees.
 *
 * Deliberately typographic — no imagery. Pictures are what made the earlier
 * draft feel crowded, and the hover preview belongs to the V4 experiment; here
 * the only thing that moves is which row is lit.
 *
 * The index band takes the leftover height (`1fr`), so the rows divide whatever
 * the wordmark and the search line leave behind, on any viewport height.
 */
export function HomeMonoblockV3({
  tagline = "Research & expertise from Ukraine's scientific frontline",
  sections = [],
  utilityLinks = [],
  socialLinks = [],
  placeholder = 'Scientific field or name',
  buttonLabel = 'Find a scientist',
  onSearch,
  locale = 'EN',
  localeHref = '/uk',
  defaultActiveId,
  className = '',
}: HomeMonoblockV3Props) {
  const id = useId();
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const localeTarget = isUa ? 'ENG' : 'УКР';
  const [activeId, setActiveId] = useState(defaultActiveId ?? sections[0]?.id);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch?.(String(fd.get('q') ?? ''));
  };

  return (
    /* `overflow-y-auto`, never `hidden`: at a larger browser font the index
       would otherwise be cut off with no way to reach it (WCAG 1.4.4). At
       ordinary sizes no scrollbar appears at all. */
    <section
      className={`flex min-h-[100svh] flex-col overflow-y-auto bg-brand-white px-6 pt-6 pb-8 md:h-[100svh] md:px-10 md:pt-8 md:pb-10 ${className}`.trim()}
    >
      <div className="flex items-center justify-between">
        <a
          href={localeHref}
          className={`font-mono text-h3-mobile no-underline md:text-h3-desktop ${focusRing}`}
        >
          <span className="underline decoration-brand-black underline-offset-4">
            {isUa ? 'УКР' : 'ENG'}
          </span>
          /{localeTarget}
        </a>
        {/* No burger: this page is the menu. */}
        <a
          href="/"
          className={`font-serif text-h2-mobile no-underline md:text-h2-desktop ${focusRing}`}
          aria-label="Science At Risk"
        >
          !!!
        </a>
        <span aria-hidden className="w-11" />
      </div>

      <div className="mt-8 flex flex-col gap-4 md:mt-[5svh]">
        <p className="font-mono text-h3-mobile text-brand-black md:text-h3-desktop">{tagline}</p>

        <h1 className="w-full font-serif leading-none" data-hero-wordmark>
          <span className="sr-only">Science At Risk</span>
          <img
            src="/assets/ui/wordmark-hero.svg"
            alt=""
            width={1360}
            height={130}
            className="block h-auto w-full max-w-[1360px] object-contain object-left md:max-h-[10svh]"
          />
        </h1>
      </div>

      <form
        className="mt-6 flex flex-col gap-4 md:mt-[4svh]"
        onSubmit={handleSubmit}
        aria-label={placeholder}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <label className="flex-1 font-mono text-breadcrumbs text-brand-black" htmlFor={id}>
            <span className="sr-only">{placeholder}</span>
            <input
              id={id}
              name="q"
              className="w-full border-0 bg-transparent font-ukraine text-[22px] leading-[28px] font-light text-brand-black outline-none placeholder:text-brand-muted focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2"
              placeholder={placeholder}
            />
          </label>
          <Button type="submit" variant="black" className="shrink-0">
            {buttonLabel}
          </Button>
        </div>
        <div className="h-0.5 w-full bg-brand-black" aria-hidden />
      </form>

      <nav
        aria-label={isUa ? 'Розділи сайту' : 'Site sections'}
        className="mt-6 flex min-h-0 flex-1 flex-col md:mt-[4svh]"
      >
        <ul className="flex min-h-0 flex-1 list-none flex-col p-0">
          {sections.map((section, index) => {
            const isActive = section.id === activeId;
            const isPrimary = section.emphasis !== 'secondary';
            return (
              <li key={section.id} className="flex min-h-0 flex-1 flex-col justify-center">
                <a
                  href={section.href}
                  aria-current={isActive ? 'true' : undefined}
                  onMouseEnter={() => setActiveId(section.id)}
                  onFocus={() => setActiveId(section.id)}
                  className={`grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-3 py-4 no-underline motion-safe:transition-colors md:gap-4 md:py-[1.6svh] ${focusRing} ${
                    /* The border doubles on the active row, so the state reads
                       without relying on color alone. */
                    isActive
                      ? 'border-t-2 border-brand-black text-brand-black'
                      : 'border-t border-brand-line-muted text-brand-black [@media(hover:hover)]:text-brand-muted'
                  }`}
                >
                  <span aria-hidden className="font-mono text-breadcrumbs text-brand-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={
                      isPrimary
                        ? 'font-serif text-h3-mobile md:text-h2-desktop'
                        : 'font-serif text-text1-mobile md:text-h3-desktop'
                    }
                  >
                    {section.label}
                  </span>
                  {section.meta ? (
                    <span className="font-mono text-breadcrumbs text-brand-muted">
                      {section.meta}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 border-t-2 border-brand-black pt-4 md:mt-[3svh]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {utilityLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-mono text-breadcrumbs text-brand-black no-underline ${focusRing}`}
              >
                <span className="satr-hover-underline">{link.label}</span>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-mono text-breadcrumbs text-brand-muted no-underline ${focusRing}`}
              >
                <span className="satr-hover-underline">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeMonoblockV3;
