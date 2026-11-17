import type { ReactNode } from 'react';

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
    const navLabel = isUa ? 'Основна навігація' : 'Primary';

  return (
    <div
      className={`flex h-full w-full flex-col overflow-y-auto ${surface} px-6 pb-10 pt-[4.5rem] md:h-auto md:max-h-[calc(100svh-2rem)] md:px-[1.78rem] md:pb-[1.78rem] md:pt-[2.72rem] ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={menuLabel}
    >
      <nav aria-label={navLabel}>
        <ul className="m-0 flex list-none flex-col gap-5 p-0">
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={linkClass}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <hr className={`my-5 border-0 border-t ${divider}`} />
      <ul className="m-0 flex list-none flex-col gap-5 p-0">
        {social
          .filter((item) => !item.email)
          .map((item) => (
            <li key={item.label}>
              <a href={item.href} className={linkClass}>
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
            <hr className={`my-5 border-0 border-t ${divider}`} />
            {item.note && (
              <p className="m-0 mb-1 font-ui text-text1-mobile opacity-70">{isUa ? item.note[1] : item.note[0]}</p>
            )}
            <a
              href={item.href}
              className={`${linkClass} break-all text-[17px] min-[420px]:text-h3-desktop md:min-[420px]:text-[17px]`}
              data-satr-email={item.email}
              data-satr-email-text=""
            >
              {item.label}
            </a>
          </div>
        ))}
      {/* The way into the cabinet, last under its own rule. From `md` up the bar carries it, so the menu does not repeat it. */}
      <div className={`md:hidden sticky bottom-0 mt-auto -mb-7 pb-7 pt-5 ${surface}`}>
      <hr className={`mb-5 border-0 border-t ${divider}`} />
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
            <a href={loginHref} className={linkClass}>
              {isUa ? 'Увійти' : 'Log in'}
            </a>
          </li>
        )}
      </ul>
      </div>
    </div>
  );
}

export default MobileNav;
