import { navItemsEn, navItemsUk, type NavItem } from '@/components/MobileNav';
import type { MonoblockLink, MonoblockSection } from '@/sandbox/HomeMonoblockV3';

/**
 * The index is built from the same nav items the burger menu uses, so the two
 * can never drift apart in wording or hrefs.
 */
const byLabel = (items: NavItem[], label: string): NavItem => {
  const found = items.find((item) => item.label === label);
  if (!found) throw new Error(`Nav item "${label}" is missing — MobileNav's list changed.`);
  return found;
};

/** Order of the index: the two sections people come for, then the rest. */
const EN_ORDER = [
  'Experts',
  'Stories',
  'Research',
  'Damaged infrastructure',
  'Scientific societies',
] as const;

const UK_ORDER = [
  'Експерти',
  'Історії',
  'Дослідження',
  'Постраждала інфраструктура',
  'Наукові товариства',
] as const;

const ids = ['experts', 'stories', 'research', 'infrastructure', 'societies'];

const emphases: MonoblockSection['emphasis'][] = [
  'primary',
  'primary',
  'secondary',
  'secondary',
  'secondary',
];

/**
 * Volume of content in the site mirror on 2026-09-22. The live homepage shows
 * no such aggregates, so these are static figures that will go stale — either
 * wire them to real data or use `descriptorSections` instead.
 */
const COUNTS = ['292 profiles', '71 stories', '16 papers', '23 sites', '37 societies'];

/** Says what a section is instead of how much of it there is — nothing to keep current. */
const DESCRIPTORS = [
  'Catalogue of scientists',
  'Reporting from the field',
  'Whitepapers & analytics',
  'Damage and rebuild costs',
  'Academic community',
];

const UK_DESCRIPTORS = [
  'Каталог науковців',
  'Репортажі з місць',
  'Аналітика та політики',
  'Втрати й вартість відбудови',
  'Академічна спільнота',
];

function build(items: NavItem[], order: readonly string[], metas: string[]): MonoblockSection[] {
  return order.map((label, i) => ({
    id: ids[i],
    label: byLabel(items, label).label,
    href: byLabel(items, label).href,
    meta: metas[i],
    emphasis: emphases[i],
  }));
}

export const countSections = build(navItemsEn, EN_ORDER, COUNTS);
export const descriptorSections = build(navItemsEn, EN_ORDER, DESCRIPTORS);
export const ukSections = build(navItemsUk, UK_ORDER, UK_DESCRIPTORS);

export const utilityLinks: MonoblockLink[] = [
  byLabel(navItemsEn, 'About the project'),
  byLabel(navItemsEn, 'Contacts'),
];

export const ukUtilityLinks: MonoblockLink[] = [
  byLabel(navItemsUk, 'Про проєкт'),
  byLabel(navItemsUk, 'Контакти'),
];

export const socialLinks: MonoblockLink[] = [
  { label: 'X', href: 'https://x.com/ScienceAtRisk' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/science-at-risk/' },
  { label: 'Facebook', href: 'https://www.facebook.com/scienceatrisk' },
];
