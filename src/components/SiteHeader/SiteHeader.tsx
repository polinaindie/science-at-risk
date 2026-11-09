import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { MobileNav } from '@/components/MobileNav';
import { SquircleLink } from '@/components/SquircleLink';
import { wrapperClass } from '@/components/Layout';
import { SquircleDefs } from '@/styles/SquircleDefs';
import { useSquircleClipPath } from '@/styles/useSquircleClipPath';

/** Where the site's pages are served from. The live site's pages are copied
 *  under `public/`, so they sit beside this app: `BASE_URL` is `/` locally and
 *  `/science-at-risk/` when published. The static pages pass their own prefix
 *  (`''`, `'../'`) so the same header works from any depth. */
const APP_BASE = import.meta.env.BASE_URL;

export interface NavEntry {
  label: string;
  href: string;
}

/** The same seven sections in Ukrainian. */
export const siteNavItemsUk = (base: string = APP_BASE): NavEntry[] => [
  { label: 'Науковці', href: `${base}experts.html` },
  { label: 'Товариства', href: `${base}societies.html` },
  { label: 'Дослідження', href: `${base}whitepapers.html` },
  { label: 'Історії', href: `${base}stories.html` },
  { label: 'Інфраструктура', href: `${base}infrastructures.html` },
  { label: 'Про нас', href: `${base}about.html` },
  { label: 'Контакти', href: `${base}contacts.html` },
];

/** Where the cabinet lives. Placeholders: the backend owns these routes. */
export interface AccountLinks {
  loginHref?: string;
  cabinetHref?: string;
  logoutHref?: string;
}

export interface SiteHeaderProps extends AccountLinks {
  /** `guest` shows Log in; `member` shows the account menu: photo, My cabinet, Log out. */
  account?: 'guest' | 'member';
  /** The member's photo and name, for the account menu. */
  avatarSrc?: string;
  accountName?: string;
  /** Unread notifications: a count marker on the photo; hidden at 0. */
  unread?: number;
  /** Prefix for every link and asset: the path from the page to the site's root. */
  base?: string;
  /** Overrides the sections, which are otherwise `siteNavItems(base)`. */
  items?: NavEntry[];
  /** Stable id for the menu panel — the static pages need it in their markup. */
  menuId?: string;
  /**
   * 0 on the hero, 1 once the reader has left it. The "!!!" on the left gives
   * way to the wordmark as it lands; nothing else in the row moves.
   */
  progress?: number;
  /** The ground and ink of the block the bar is standing on. */
  ground?: string;
  inverted?: boolean;
  locale?: string;
  localeHref?: string;
  homeHref?: string;
  /** The page measures this row to know where the wordmark must land. */
  innerRef?: Ref<HTMLDivElement>;
  className?: string;
}

/** The count of what is new: the same yellow pill as the cabinet menu's counter; 9+ above nine. */
function CountBadge({ count, className = '' }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden
      className={`pointer-events-none grid min-w-6 place-items-center rounded-full bg-brand-accent-yellow px-1.5 font-mono text-breadcrumbs text-brand-black ${className}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

/** The member's photo (or initial) in a squircle with a black ring, and a blue dot when something is new. */
function Avatar({ src, name, unread }: { src?: string; name?: string; unread: number }) {
  const shape = useSquircleClipPath({ radius: 12, smoothing: 0.9 });
  const ring = useSquircleClipPath({ radius: 12, smoothing: 0.9, strokeWidth: 2 });
  return (
    <span className="relative flex size-10">
      {src ? (
        <img ref={shape.ref} src={src} alt="" style={shape.style} className="size-10 object-cover" />
      ) : (
        <span
          ref={shape.ref}
          aria-hidden
          style={shape.style}
          className="flex size-10 items-center justify-center bg-white font-mono text-[16px]"
        >
          {(name ?? '?').trim().charAt(0).toUpperCase()}
        </span>
      )}
      <span ref={ring.ref} aria-hidden style={ring.style} className="absolute inset-0 bg-current" />
      <SquircleDefs clipId={shape.clipId} pathD={shape.pathD} />
      <SquircleDefs clipId={ring.clipId} pathD={ring.pathD} />
      <CountBadge count={unread} className="absolute -bottom-2 -right-3" />
    </span>
  );
}

/** A member's way into the cabinet: the photo is a link straight to it. */
function AccountLink({
  isUa,
  avatarSrc,
  name,
  unread = 0,
  cabinetHref,
  ink,
  focusRing,
}: {
  isUa: boolean;
  avatarSrc?: string;
  name?: string;
  unread?: number;
  cabinetHref: string;
  ink: string;
  focusRing: string;
}) {
  const label = isUa ? 'Мій кабінет' : 'My cabinet';
  return (
    <a
      href={cabinetHref}
      aria-label={`${name ? `${label}: ${name}` : label}${unread > 0 ? (isUa ? `, нових сповіщень: ${unread}` : `, ${unread} new notifications`) : ''}`}
      className={`satr-dim flex min-h-11 min-w-11 items-center justify-center no-underline ${ink} ${focusRing}`}
    >
      <Avatar src={avatarSrc} name={name} unread={unread} />
    </a>
  );
}

/** The wordmark in the bar: 197px wide like the reference (Noto Serif 24px), 18.84 tall at the asset's aspect. */
export const BAR_WORDMARK_H = 18.84;

/** Figma v4_Final (299:7388): the masthead stands 26px off the top and is 42
 *  tall, the same in both states. */
const PAD_TOP = 26;
const ROW_H = 42;

/** The sections of "Stolen museum story" (341:756), in one row — the site's
 *  one menu, for every page. */
export const siteNavItems = (base: string = APP_BASE): NavEntry[] => [
  { label: 'Scientists', href: `${base}experts.html` },
  { label: 'Societies', href: `${base}societies.html` },
  { label: 'Research', href: `${base}whitepapers.html` },
  { label: 'Stories', href: `${base}stories.html` },
  { label: 'Infrastructure', href: `${base}infrastructures.html` },
  { label: 'About', href: `${base}about.html` },
  { label: 'Contacts', href: `${base}contacts.html` },
];

/**
 * The bar of scienceatrisk.org's home page, with this site's sections: it
 * stands over every block, takes that block's ground and ink, and has the same
 * row in every state — a mark or the wordmark on the left, the seven
 * sections in the middle, the language switch on the right.
 *
 * The sections and the wordmark only share a row from 1280px; below that
 * they sit behind the menu button.
 */
export function SiteHeader({
  base = APP_BASE,
  items: itemsProp,
  account = 'guest',
  avatarSrc,
  accountName,
  unread,
  loginHref: loginHrefProp,
  cabinetHref = `${base}cabinet`,
  logoutHref = `${base}logout`,
  menuId: menuIdProp,
  progress = 0,
  ground = 'bg-transparent',
  inverted = false,
  locale = 'EN',
  localeHref = `${base}uk.html`,
  homeHref = base || './',
  innerRef,
  className = '',
}: SiteHeaderProps) {
  const id = useId();
  const menuId = menuIdProp ?? `${id}-menu`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const items = itemsProp ?? (isUa ? siteNavItemsUk(base) : siteNavItems(base));
  const member = account === 'member';
  const loginHref = loginHrefProp ?? (isUa ? `${base}uk/login.html` : `${base}login.html`);

  const p = Math.min(1, Math.max(0, progress));
  // The hero's own wordmark flies the whole way and is swapped for this copy
  // in one frame at the end, where the two are the same picture in the same
  // place.
  const landed = p >= 1;
  const ink = inverted ? 'text-white' : 'text-brand-black';
  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

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

  const current = <span className="satr-underlined">{isUa ? 'УКР' : 'ENG'}</span>;
  // The language not in use is greyed, as in "Stolen museum story" (341:765),
  // and comes up to full ink on hover. #4d4d4d rather than the frame's #6e6e6e:
  // the bar also stands on the blue blocks, where #6e6e6e falls under AA.
  const other = (
    <a
      href={localeHref}
      className={`satr-hover-underline no-underline transition-colors ${
        inverted ? 'text-white/70 hover:text-white' : 'text-brand-muted hover:text-brand-black'
      } ${focusRing}`}
    >
      {isUa ? 'ENG' : 'УКР'}
    </a>
  );

  return (
    <header
      className={`sticky top-0 transition-colors duration-300 ${
        menuOpen ? 'z-[70]' : 'z-50'
      } ${ground} ${ink} ${className}`.trim()}
    >
      <div
        ref={innerRef}
        className={`${wrapperClass} relative flex items-center justify-between gap-3 md:gap-6`}
        style={{ paddingTop: PAD_TOP, height: PAD_TOP + ROW_H }}
      >
        {/* The mark and the wordmark share one slot, so the sections never
            move when one gives way to the other. The slot is as wide as the
            wordmark at every size — left at nothing below `lg`, the wordmark
            ran on over the language switch on a phone. */}
        <div className="relative w-[148px] shrink-0 md:w-[197px]" style={{ height: ROW_H }}>
          <a
            href={homeHref}
            aria-label="Science At Risk"
            className={`satr-dim absolute left-0 top-1/2 -translate-y-1/2 font-serif text-[28px] leading-[42px] tracking-[-0.02em] no-underline transition-opacity duration-200 ${ink} ${focusRing}`}
            style={{ opacity: landed ? 0 : 1, pointerEvents: landed ? 'none' : undefined }}
            tabIndex={landed ? -1 : undefined}
            aria-hidden={landed ? true : undefined}
          >
            !!!
          </a>
          <a
            href={homeHref}
            aria-label="Science At Risk"
            className={`satr-dim absolute left-0 top-1/2 block -translate-y-1/2 overflow-hidden no-underline transition-opacity duration-200 ${focusRing}`}
            style={{ opacity: landed ? 1 : 0 }}
            tabIndex={landed ? undefined : -1}
            aria-hidden={landed ? undefined : true}
          >
            {/* Set in type, as the reference does: Noto Serif 24px, -0.36px —
                18px on a phone, which is what leaves room on a 320px screen
                for the language switch and the menu beside it. */}
            <span
              className={`block whitespace-nowrap font-serif text-[18px] font-normal leading-[18px] tracking-[-0.27px] md:text-[24px] md:leading-[24px] md:tracking-[-0.36px] ${ink}`}
            >
              SC!ENCE AT R!SK!
            </span>
          </a>
        </div>

        <nav aria-label={isUa ? 'Розділи' : 'Sections'} className="absolute left-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:block" style={{ top: PAD_TOP + ROW_H / 2 }}>
          <ul className="m-0 flex list-none items-center gap-[20px] p-0 min-[1440px]:gap-[32px]">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`satr-hover-underline whitespace-nowrap font-mono text-[16px] leading-[26px] no-underline ${ink} ${focusRing}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4 xl:gap-5">
          <p className="m-0 whitespace-nowrap font-mono text-text1-mobile md:text-[18px] md:leading-[24px] md:tracking-normal">
            {isUa ? other : current}
            <span aria-hidden>/</span>
            {isUa ? current : other}
          </p>
          {/* The way in, from `md` up. Outlined squircle, not filled: it must be easy
              to find without outranking the sections. Below `md` it lives at
              the foot of the menu. */}
          <div className="hidden items-center gap-4 md:flex" data-satr-account={account}>
            {member ? (
              <AccountLink
                isUa={isUa}
                avatarSrc={avatarSrc}
                name={accountName}
                unread={unread}
                cabinetHref={cabinetHref}
                ink={ink}
                focusRing={focusRing}
              />
            ) : (
              <SquircleLink href={loginHref} inverted={inverted}>
                {isUa ? 'Увійти' : 'Log in'}
              </SquircleLink>
            )}
          </div>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={`${menuOpen ? 'Close menu' : 'Open menu'}${member && unread ? (isUa ? `, нових сповіщень: ${unread}` : `, ${unread} new notifications`) : ''}`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            data-satr-menu-button=""
            className={`satr-dim flex min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 xl:hidden ${focusRing}`}
          >
            <span className="relative flex">
            <CountBadge count={member ? unread ?? 0 : 0} className="absolute -right-3 -top-3 md:hidden" />
            <img
              src={`${base}assets/ui/hamburger-dark.svg`}
              alt=""
              width={30}
              height={22}
              className={`h-[22px] w-[30px] ${inverted ? 'brightness-0 invert' : ''}`}
            />
            </span>
          </button>
        </div>
      </div>

      {/* Always in the markup, hidden until opened: the static pages are this
          component rendered to HTML, and their script finds the menu by these
          hooks. */}
      <div
        id={menuId}
        data-satr-menu=""
        hidden={!menuOpen}
        className="fixed inset-0 z-[60] flex justify-end xl:hidden"
      >
        <div
          data-satr-menu-backdrop=""
          className="absolute inset-0 bg-black/40"
          aria-hidden
          onClick={() => setMenuOpen(false)}
        />
        <div className="relative h-full">
          <MobileNav
            items={items}
            tone={inverted ? 'dark' : 'light'}
            locale={isUa ? 'UA' : 'EN'}
            account={account}
            loginHref={loginHref}
            cabinetHref={cabinetHref}
            logoutHref={logoutHref}
            onClose={() => {
              setMenuOpen(false);
              menuButtonRef.current?.focus();
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
