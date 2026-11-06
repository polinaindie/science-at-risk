import type { ReactNode } from 'react';
import { wrapperClass } from '@/components/Layout';
import { cabinetCopy, type CabinetLocale, type CabinetSection } from './cabinetCopy';
import type { ProfileStatus } from './cabinetCopy';

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
  hrefFor?: (section: CabinetSection) => string;
  onNavigate?: (section: CabinetSection) => void;
  children: ReactNode;
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
  hrefFor = (s) => `#${s}`,
  onNavigate,
  children,
}: CabinetLayoutProps) {
  const t = cabinetCopy[locale];

  return (
    <div className={ground === 'blue' ? 'bg-brand-accent-blue' : ''}>
    <div className={`${wrapperClass} py-8 lg:py-12`}>
      {name ? (
        <p className="m-0 font-serif text-h2-mobile md:text-h2-desktop">{name}</p>
      ) : null}
      <div className={`${name ? 'mt-6' : ''} lg:mt-10 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12`}>
      <nav aria-label={t.nav.label} className="lg:sticky lg:top-28 lg:self-start">
        <ul className="m-0 flex list-none gap-6 overflow-x-auto border-b-2 border-brand-line-muted p-0 md:gap-10 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0">
          {ORDER.map((key) => {
            const current = key === section;
            const count = key === 'notifications' ? unread : 0;
            const isNew = marked.includes(key);
            return (
              <li key={key} className="shrink-0">
                <a
                  href={hrefFor(key)}
                  aria-current={current ? 'page' : undefined}
                  onClick={(e) => {
                    if (!onNavigate) return;
                    e.preventDefault();
                    onNavigate(key);
                  }}
                  className={`-mb-0.5 flex items-center gap-3 whitespace-nowrap border-b-4 py-3 font-mono text-h3-mobile no-underline md:text-h3-desktop lg:mb-0 lg:border-b-0 lg:border-l-4 lg:py-2.5 lg:pl-4 ${
                    current
                      ? 'border-brand-black font-bold'
                      : 'border-transparent hover:border-brand-black'
                  }`}
                >
                  <span>{t.nav.items[key]}</span>
                  {count > 0 ? (
                    <span
                      className="grid min-w-6 place-items-center rounded-full bg-brand-black px-1.5 font-mono text-breadcrumbs text-white"
                      aria-label={`${count}`}
                    >
                      {count}
                    </span>
                  ) : null}
                  {isNew && !count ? (
                    <span className="bg-brand-accent-yellow px-2 py-0.5 font-mono text-breadcrumbs font-normal text-brand-black">
                      {t.nav.new}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <main className="mt-8 min-w-0 lg:mt-0">{children}</main>
      </div>
    </div>
    </div>
  );
}
