export interface NavItem {
  label: string;
  href: string;
}

export interface MobileNavProps {
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
  { label: 'Експерти', href: '/uk/experts' },
  { label: 'Постраждала інфраструктура', href: '/uk/infrastructures' },
  { label: 'Наукові товариства', href: '/uk/societies' },
  { label: 'Про проєкт', href: '/uk/about' },
  { label: 'Історії', href: '/uk/stories' },
  { label: 'Дослідження', href: '/uk/research' },
  { label: 'Контакти', href: '/uk/contacts' },
];

/** EN nav labels. */
export const navItemsEn: NavItem[] = [
  { label: 'Experts', href: '/experts' },
  { label: 'Damaged infrastructure', href: '/infrastructures' },
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
];

/**
 * Mobile / overlay navigation — Figma Frame 2234 (292:1503).
 * Closing is handled by parent (button / Escape / backdrop), not by scroll.
 */
export function MobileNav({
  open = true,
  onClose,
  items = defaultItems,
  social = defaultSocial,
  tone = 'light',
  locale = 'UA',
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
  const linkClass = `font-mono text-h3-desktop ${linkColor} no-underline hover:opacity-70 ${focusRing}`;
  const menuLabel = isUa ? 'Меню' : 'Menu';
  const closeLabel = isUa ? 'Закрити меню' : 'Close menu';
  const navLabel = isUa ? 'Основна навігація' : 'Primary';

  return (
    <div
      className={`flex h-full w-full max-w-[330px] flex-col ${surface} px-8 py-7 ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={menuLabel}
    >
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className={`flex min-h-11 min-w-11 items-center justify-center border-0 bg-transparent p-0 ${focusRing}`}
          aria-label={closeLabel}
          onClick={onClose}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden focusable="false">
            <path
              d="M1 1 L21 21 M21 1 L1 21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
      <nav aria-label={navLabel}>
        <ul className="m-0 flex list-none flex-col gap-6 p-0">
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={linkClass}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <hr className={`my-6 border-0 border-t ${divider}`} />
      <ul className="m-0 flex list-none flex-col gap-6 p-0">
        {social.map((item) => (
          <li key={item.label}>
            <a href={item.href} className={linkClass}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MobileNav;
