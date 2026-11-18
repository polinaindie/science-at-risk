import type { ReactNode } from 'react';
import { SquircleLink } from '@/components/SquircleLink';

export interface NavItem {
  label: string;
  href: string;
  /** An address shipped encoded (see public/js/satr-email.js); the page script fills in the text and the mailto. */
  email?: string;
  /** A line above the link, for an address (EN, UK). */
  note?: [string, string];
}

export interface MobileNavProps {
  /** `guest` ends the list with Log in; `member` with My cabinet and Log out. */
  account?: 'guest' | 'member';
  loginHref?: string;
  cabinetHref?: string;
  settingsHref?: string;
  logoutHref?: string;
  /** The member's account menu (photo, name, dropdown), drawn by the header. Without it the menu lists the cabinet links. */
  accountMenu?: ReactNode;
  /** The header carries the member's photo (and the cabinet links behind it), so the menu does not repeat them. */
  memberInBar?: boolean;
  /** The EN/UK switch for a screen too narrow to carry it in the bar (under 360px): shown at the foot of the menu there. */
  langSlot?: ReactNode;
  /** The width from which the bar carries the language switch itself (360, or 400 where a member's photo shares the bar). */
  langHideFrom?: 360 | 400;
  open?: boolean;
  onClose?: () => void;
  items?: NavItem[];
  social?: NavItem[];
  /** Tone of the page behind the panel — the panel inverts against it. */
  tone?: 'light' | 'dark';
  /** Controls chrome labels (close / nav). */
  locale?: string;
  className?: string;
}

/** UA nav labels (canonical short IA). */
export const navItemsUk: NavItem[] = [
  { label: 'Експерти', href: '/uk/scientists' },
  { label: 'Відновлення інфраструктури', href: '/uk/infrastructures' },
  { label: 'Наукові товариства', href: '/uk/societies' },
  { label: 'Про проєкт', href: '/uk/about' },
  { label: 'Історії', href: '/uk/stories' },
  { label: 'Дослідження', href: '/uk/research' },
  { label: 'Контакти', href: '/uk/contacts' },
];

/** EN nav labels. */
export const navItemsEn: NavItem[] = [
  { label: 'Experts', href: '/scientists' },
  { label: 'Infrastructure recovery', href: '/infrastructures' },
  { label: 'Scientific societies', href: '/societies' },
  { label: 'About the project', href: '/about' },
  { label: 'Stories', href: '/stories' },
  { label: 'Research', href: '/research' },
  { label: 'Contacts', href: '/contacts' },
];

const defaultItems = navItemsUk;

const defaultSocial: NavItem[] = [
  { label: 'X (Twitter)', href: 'https://twitter.com/ScienceAtRisk' },
  { label: 'Linkedin', href: 'https://www.linkedin.com/company/scienceatrisk' },
  { label: 'Facebook', href: 'https://www.facebook.com' },
  { label: '[email protected]', href: '#', note: ['For general inquiries', 'Для загальних запитів'], email: '5b302e3528332f363a3c3a2132353e1b3c363a323775383436' },
];

/**
 * Mobile / overlay navigation — Figma Frame 2234 (292:1503).
 * Closing is handled by parent (button / Escape / backdrop), not by scroll.
 */
export function MobileNav({
  open = true,
  items = defaultItems,
  social = defaultSocial,
  tone = 'light',
  locale = 'UA',
  account = 'guest',
  loginHref = `${import.meta.env.BASE_URL}login.html`,
  cabinetHref = '/cabinet',
  settingsHref = '/cabinet/settings',
  logoutHref = '/logout',
  accountMenu,
  memberInBar = false,
  langSlot,
  langHideFrom = 360,
  className = '',
}: MobileNavProps) {
  if (!open) return null;

  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const onDark = tone === 'dark';
  const surface = onDark ? 'bg-brand-white text-brand-black' : 'bg-brand-black text-white';
  const linkColor = onDark ? 'text-brand-black' : 'text-white';
  const focusRing = onDark
    ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
    : 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
  const divider = onDark ? 'border-black/40' : 'border-white/40';
  const underline = onDark ? 'satr-hover-underline' : 'satr-hover-underline satr-hover-underline--white';
  const linkClass = `${underline} font-ui text-h3-desktop ${linkColor} no-underline ${focusRing}`;
  const menuLabel = isUa ? 'Меню' : 'Menu';
  const langBelow = langHideFrom === 400 ? 'min-[400px]:hidden' : 'min-[360px]:hidden';
    const navLabel = isUa ? 'Основна навігація' : 'Primary';

  return (
    <div
      className={`flex h-full w-full flex-col overflow-y-auto max-md:justify-between ${surface} px-6 pb-10 pt-[4.5rem] max-md:pb-0 max-md:pt-[72px] md:h-auto md:max-h-[calc(100svh-2rem)] md:px-[1.78rem] md:pb-[1.78rem] md:pt-[2.72rem] ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={menuLabel}
    >
      <nav aria-label={navLabel}>
        <ul className="m-0 flex list-none flex-col gap-5 p-0 max-md:gap-[18px]">
          {items.map((item) => (
            <li key={item.label}>
              {/* on a phone the menu is the whole screen, so the sections are set larger */}
              <a href={item.href} className={`${linkClass} max-md:text-[22px] max-md:leading-[1.3]`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <hr className={`my-5 max-md:my-[18px] border-0 border-t ${divider}`} />
      <ul className="m-0 flex list-none flex-col gap-5 p-0 max-md:gap-[18px]">
        {social
          .filter((item) => !item.email)
          .map((item) => (
            <li key={item.label}>
              <a href={item.href} className={`${linkClass} max-md:text-[22px] max-md:leading-[1.3]`}>
                {item.label}
              </a>
            </li>
          ))}
      </ul>
      {/* Addresses stand apart, under their own rule, right after the social links. */}
      {social
        .filter((item) => item.email)
        .map((item) => (
          <div key={item.label}>
            <hr className={`my-5 max-md:my-[18px] border-0 border-t ${divider}`} />
            {item.note && (
              <p className="m-0 mb-1 font-ui text-text1-mobile opacity-70">{isUa ? item.note[1] : item.note[0]}</p>
            )}
            <a
              href={item.href}
              className={`${linkClass} break-all md:text-[17px] max-md:text-[22px] max-md:leading-[1.3]`}
              data-satr-email={item.email}
              data-satr-email-text=""
            >
              {item.label}
            </a>
          </div>
        ))}
      {/* The way into the cabinet, last under its own rule. From `md` up the bar carries it, so the menu does not repeat it. */}
      {account === 'member' && memberInBar ? (
        /* The photo and the cabinet links are in the bar; only a screen too narrow for the language switch has anything down here. */
        langSlot ? (
          <div className={`sticky bottom-0 pb-[40px] pt-[18px] ${langBelow} ${surface}`}>
            <hr className={`mb-5 border-0 border-t ${divider}`} />
            {langSlot}
          </div>
        ) : null
      ) : (
      <div className={`md:hidden sticky bottom-0 pb-[40px] pt-[18px] ${surface}`}>
      <hr className={`mb-5 border-0 border-t ${divider}`} />
      {langSlot ? <div className={`mb-5 ${langBelow}`}>{langSlot}</div> : null}
      <ul className="m-0 flex list-none flex-col gap-5 p-0" data-satr-account={account}>
        {account === 'member' && accountMenu ? (
          <li>{accountMenu}</li>
        ) : account === 'member' ? (
          <>
            <li>
              <a href={cabinetHref} className={linkClass}>
                {isUa ? 'Мій кабінет' : 'My cabinet'}
              </a>
            </li>
            <li>
              <a href={settingsHref} className={linkClass}>
                {isUa ? 'Налаштування' : 'Settings'}
              </a>
            </li>
            <li>
              <a href={logoutHref} className={linkClass}>
                {isUa ? 'Вийти' : 'Log out'}
              </a>
            </li>
          </>
        ) : (
          <li>
            {/* the secondary action: the site's outlined button, full width, as the one in the bar */}
            <SquircleLink href={loginHref} inverted={!onDark} radius={16} ring={2} className="w-full text-center" style={{ display: 'block', padding: '12px 14px', lineHeight: '24px' }}>
              {isUa ? 'Увійти' : 'Log in'}
            </SquircleLink>
          </li>
        )}
      </ul>
      </div>
      )}
    </div>
  );
}

export default MobileNav;