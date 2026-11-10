import type { ReactNode } from 'react';
import { wrapperClass } from '@/components/Layout';
import { cabinetCopy, type CabinetLocale, type CabinetSection } from './cabinetCopy';
import type { ProfileStatus } from './cabinetCopy';
import { tabClass } from './parts';

const ORDER: CabinetSection[] = ['profile', 'notifications', 'collaboration', 'opportunities'];

export interface CabinetLayoutProps {
  locale: CabinetLocale;
  /** Whose cabinet it is: the heading over the tabs. */
  name?: string;
  /** `blue` is the colour of an expert's page on the site. */
  ground?: 'white' | 'blue';
  section: CabinetSection;
  /** Unread notifications; hidden at 0. */
  unread?: number;
  /** Sections carrying the "New" mark. */
  marked?: CabinetSection[];
  /** The status chip under the menu, so it is visible from every screen. */
  status?: ProfileStatus;
  /** Stands above the menu in the side column (on narrow screens, above the tabs): the person. */
  aside?: ReactNode;
  /** Replaces the menu in the side column: the first-fill wizard puts its steps here. */
  sideNav?: ReactNode;
  hrefFor?: (section: CabinetSection) => string;
  onNavigate?: (section: CabinetSection) => void;
  logoutHref?: string;
  children: ReactNode;
}

/** One menu entry — tabs, Settings and Log out all look and behave the same. */
function MenuLink({
  href,
  current = false,
  onClick,
  children,
}: {
  href: string;
  current?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-current={current ? 'page' : undefined}
      onClick={(e) => {
        if (!onClick) return;
        e.preventDefault();
        onClick();
      }}
      className={tabClass(current)}
    >
      {children}
    </a>
  );
}

/**
 * The cabinet's frame: the person's name, four tabs under it, the screen below. Collaboration and Opportunities sit in
 * the same menu as the profile — the frame does not change when they arrive.
 */
export function CabinetLayout({
  locale,
  name,
  ground = 'white',
  section,
  unread = 0,
  marked = [],
  aside,
  sideNav,
  hrefFor = (s) => `#${s}`,
  onNavigate,
  logoutHref = '/logout',
  children,
}: CabinetLayoutProps) {
  const t = cabinetCopy[locale];

  return (
    <div className={ground === 'blue' ? 'bg-brand-accent-blue' : ''}>
    <div className={`${wrapperClass} pt-8 pb-8 lg:pb-12`}>
      {name ? (
        <p className="m-0 font-serif text-h2-mobile md:text-h2-desktop">{name}</p>
      ) : null}
      <div className={`${name ? 'mt-6' : ''} ${name ? 'lg:mt-10' : ''} lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-[42px]`}>
      <div className="min-w-0">
      {sideNav ? (
        <div className="lg:sticky lg:top-[calc(68px+2rem)]">{sideNav}</div>
      ) : (
      <>
      {aside ? <div className="mb-8">{aside}</div> : null}
      {/* One box as tall as the screen under the header: the tabs at its top, the account links at its foot. It stays put while the cabinet scrolls and leaves, whole, when the content ends. */}
      <div className="flex flex-col lg:sticky lg:top-[calc(68px+2rem)] lg:h-[calc(100dvh-168px)]">
      <div className="lg:flex-1">
      <nav aria-label={t.nav.label}>
        <ul className="m-0 flex list-none gap-6 overflow-x-auto border-b-2 border-brand-line-muted p-0 md:gap-10 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0">
          {ORDER.map((key) => {
            const current = key === section;
            const count = key === 'notifications' ? unread : 0;
            const isNew = marked.includes(key);
            return (
              <li key={key} className="shrink-0">
                <MenuLink
                  href={hrefFor(key)}
                  current={current}
                  onClick={onNavigate && (() => onNavigate(key))}
                >
                  <span>{t.nav.items[key]}</span>
                  {count > 0 ? (
                    <span
                      className="grid min-w-6 place-items-center rounded-full bg-brand-accent-yellow px-1.5 font-mono text-breadcrumbs text-brand-black"
                      aria-label={t.notifications.unreadCount(count)}
                    >
                      {count > 99 ? '99+' : count}
                    </span>
                  ) : null}
                  {isNew && !count ? (
                    <span className="bg-brand-accent-yellow px-2 py-0.5 font-mono text-breadcrumbs font-normal text-brand-black">
                      {t.nav.new}
                    </span>
                  ) : null}
                </MenuLink>
              </li>
            );
          })}
        </ul>
      </nav>
      </div>
      {/* Account links sit at the foot of the side column, at the bottom edge of the screen. */}
      <ul className="m-0 mt-4 flex list-none flex-col gap-1 p-0">
        <li>
          <MenuLink
            href={hrefFor('settings')}
            current={section === 'settings'}
            onClick={onNavigate && (() => onNavigate('settings'))}
          >
            {t.nav.items.settings}
          </MenuLink>
        </li>
        <li>
          <MenuLink href={logoutHref}>{t.nav.logout}</MenuLink>
        </li>
      </ul>
      </div>
      </>
      )}
      </div>
      <main className="mt-8 min-w-0 lg:mt-0">{children}</main>
      </div>
    </div>
    </div>
  );
}
