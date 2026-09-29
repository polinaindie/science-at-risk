import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { MobileNav } from '@/components/MobileNav';
import { Tag } from '@/components/Tag';

export interface HomeHeroSearchTag {
  label: string;
  count?: number | string;
  href?: string;
}

export interface HomeHeroSearchQuickLink {
  label: string;
  count?: number | string;
  href: string;
}

export interface HomeHeroSearchNavItem {
  label: string;
  href: string;
}

export interface HomeHeroSearchProps {
  /** Sections in the header row (Figma node 230:5498). */
  navItems?: HomeHeroSearchNavItem[];
  tagline?: string;
  placeholder?: string;
  buttonLabel?: string;
  popularLabel?: string;
  popularTags?: HomeHeroSearchTag[];
  quickLinks?: HomeHeroSearchQuickLink[];
  locale?: string;
  localeHref?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const defaultNavItems: HomeHeroSearchNavItem[] = [
  { label: 'Scientists', href: '/experts' },
  { label: 'Researches', href: '/research' },
  { label: 'Societies', href: '/societies' },
  { label: 'Stories', href: '/stories' },
  { label: 'Infrastructure', href: '/infrastructures' },
  { label: 'About', href: '/about' },
];

const defaultTags: HomeHeroSearchTag[] = [
  { label: 'Physical sciences', count: 12, href: '/experts?tag=physical-sciences' },
  { label: 'Social sciences', count: 5, href: '/experts?tag=social-sciences' },
  { label: 'Technology', count: 8, href: '/experts?tag=technology' },
  { label: 'Arts & humanities', count: 1, href: '/experts?tag=humanities' },
  { label: 'Life sciences & biomedicine', count: 22, href: '/experts?tag=life-sciences' },
];

const defaultQuickLinks: HomeHeroSearchQuickLink[] = [
  { label: 'Scientists', href: '/experts' },
  { label: 'Societies', href: '/societies' },
  { label: 'Infrastructure', href: '/infrastructures' },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * Homepage hero variant — search bar and stat links instead of the story
 * carousel (Figma node 46:3286). Tagline, wordmark, inline search, popular
 * tags, then a row of section links (Scientists / Societies / Infrastructure).
 */
export function HomeHeroSearch({
  navItems = defaultNavItems,
  tagline = "Research & expertise from Ukraine's scientific frontline",
  placeholder = 'Scientific field or name',
  buttonLabel = 'Find a scientist',
  popularLabel = 'Popular searches',
  popularTags = defaultTags,
  quickLinks = defaultQuickLinks,
  locale = 'EN',
  localeHref = '/uk',
  onSearch,
  className = '',
}: HomeHeroSearchProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const menuId = `${id}-menu`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';

  // Escape closes the menu and hands focus back to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch?.(String(fd.get('q') ?? ''));
  };

  const linkType = 'font-mono text-text1-desktop text-brand-black whitespace-nowrap';
  const current = <span className="underline decoration-brand-black underline-offset-4">{isUa ? 'UKR' : 'ENG'}</span>;
  const other = (
    <a href={localeHref} className={`satr-hover-underline no-underline ${focusRing}`}>
      {isUa ? 'ENG' : 'UKR'}
    </a>
  );

  return (
    <section className={`flex min-h-[100svh] flex-col bg-brand-accent-blue ${className}`.trim()}>
      {/* Site header (Figma node 230:5498): wordmark, the six sections, and the
          language switch. The sections only fit from `lg`; below that they sit
          behind the menu button. */}
      <header className="flex items-center justify-between gap-4 md:gap-7 border-b-2 border-brand-accent-blue bg-brand-accent-blue px-6 py-7 md:px-10">
        <a
          href="/"
          aria-label="Science At Risk"
          className={`flex min-w-0 items-center no-underline lg:w-[242px] lg:shrink-0 ${focusRing}`}
        >
          <img
            src="/assets/ui/wordmark-science-at-risk.svg"
            alt=""
            width={239}
            height={24}
            className="block h-auto w-[199px] max-w-full"
          />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="m-0 flex list-none items-center gap-7 p-0">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={`satr-hover-underline ${linkType} ${focusRing}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4 md:gap-7">
          <p className={`m-0 flex items-center gap-2 ${linkType}`}>
            {isUa ? other : current}
            <span aria-hidden>/</span>
            {isUa ? current : other}
          </p>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className={`flex min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 lg:hidden ${focusRing}`}
          >
            <img src="/assets/ui/hamburger-dark.svg" alt="" width={30} height={22} className="h-[22px] w-[30px]" />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div id={menuId} className="fixed inset-0 z-[60] flex justify-end lg:hidden">
          <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => setMenuOpen(false)} />
          <div className="relative h-full">
            <MobileNav
              open
              items={navItems}
              tone="light"
              locale={isUa ? 'UA' : 'EN'}
              onClose={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col px-6 pb-8 md:px-10 md:pb-10">
        <div className="mt-14 flex flex-col gap-7">
          <p className="font-mono text-h3-mobile text-brand-black md:text-h3-desktop">{tagline}</p>

          <h1 className="w-full font-serif leading-none" data-hero-wordmark>
            <span className="sr-only">Science At Risk</span>
            <img
              src="/assets/ui/wordmark-hero.svg"
              alt=""
              width={1360}
              height={130}
              className="block h-auto w-full max-w-[1360px]"
            />
          </h1>
        </div>

        <form className="mt-12 flex flex-col gap-7" onSubmit={handleSubmit} aria-label={placeholder}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <label className="flex-1 font-mono text-breadcrumbs text-brand-black" htmlFor={id}>
              <span className="sr-only">{placeholder}</span>
              <input
                id={id}
                ref={inputRef}
                name="q"
                className="w-full border-0 bg-transparent font-ukraine text-[22px] leading-[28px] font-light text-brand-black outline-none placeholder:text-brand-black/40 focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2"
                placeholder={placeholder}
              />
            </label>
            <Button type="submit" variant="black" className="shrink-0">
              {buttonLabel}
            </Button>
          </div>
          <div className="h-0.5 w-full bg-brand-black" aria-hidden />
        </form>

        <div className="mt-[6svh]">
          <p className="mb-[18px] font-mono text-text1-desktop">{popularLabel}</p>
          <div className="flex flex-wrap gap-2.5" role="list">
            {popularTags.map((tag) =>
              tag.href ? (
                <span role="listitem" key={tag.href}>
                  <Tag as="a" href={tag.href} count={tag.count}>
                    {tag.label}
                  </Tag>
                </span>
              ) : (
                <span role="listitem" key={tag.label}>
                  <Tag as="span" count={tag.count}>
                    {tag.label}
                  </Tag>
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mt-auto border-t-2 border-brand-black pt-9">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-[5px] font-mono text-h3-mobile text-brand-black md:text-h3-desktop ${focusRing}`}
              >
                <span aria-hidden>&gt;&gt;</span>
                <span className="satr-hover-underline">{link.label}</span>
                {link.count !== undefined ? (
                  <span className="text-text1-mobile text-brand-muted md:text-text1-desktop">
                    ({link.count})
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHeroSearch;
