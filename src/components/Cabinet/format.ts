import type { ExperienceItem, Project, Publication } from './cabinetData';

/**
 * Plain functions, no React: the same rules the Go side will need, both to
 * check what a scientist types and to print it the way the site prints it.
 */

const trimDots = (s: string) => s.trim().replace(/[.\s]+$/, '');

/** "Authors. Title. Journal. Year. Pages" — the line the site prints. */
export function formatPublication(p: Publication): string {
  return [p.authors, p.title, p.journal, p.year, p.pages]
    .map((x) => trimDots(x))
    .filter(Boolean)
    .join('. ')
    .concat('.');
}

/** The small line under a publication's title on the site: “Authors. Journal, pages, year.” */
export function formatCitation(p: Publication): string {
  const where = [p.journal, p.pages, p.year].map(trimDots).filter(Boolean).join(', ');
  return [trimDots(p.authors), where].filter(Boolean).join('. ').concat('.');
}

export const isPublicationEmpty = (p: Publication) =>
  !(p.title || p.authors || p.journal || p.year || p.pages || p.role || p.url).trim();

export const isUrl = (v: string) => {
  try {
    const u = new URL(v.trim());
    return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.includes('.');
  } catch {
    return false;
  }
};

export const isYear = (v: string) => {
  const n = Number(v.trim());
  return /^\d{4}$/.test(v.trim()) && n >= 1900 && n <= new Date().getFullYear() + 1;
};

/** Latin letters only, at least a surname and a first name. */
export const isLatinName = (v: string) =>
  /^[A-Za-z][A-Za-z'’.-]*(\s+[A-Za-z][A-Za-z'’.-]*)+$/.test(v.trim());

const host = (v: string) => {
  try {
    return new URL(v.trim()).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
};

/** A profile link must point at the network it is named for. Empty is fine. */
export const isProfileLink = (kind: 'orcid' | 'linkedin' | 'facebook', v: string) => {
  if (!v.trim()) return true;
  if (!isUrl(v)) return false;
  const h = host(v);
  if (kind === 'orcid')
    return h === 'orcid.org' && /orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]\/?$/i.test(v.trim());
  if (kind === 'linkedin') return h === 'linkedin.com' || h.endsWith('.linkedin.com');
  return h === 'facebook.com' || h.endsWith('.facebook.com') || h === 'fb.com';
};

/** “2021 – Head of department, University”: the line the site prints. */
export const formatExperience = (e: ExperienceItem) =>
  [e.year.trim(), [e.position.trim(), e.place.trim()].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(' – ');

export const isExperienceEmpty = (e: ExperienceItem) =>
  !(e.year.trim() || e.position.trim() || e.place.trim());

export const isProjectEmpty = (p: Project) => !(p.title || p.description || p.role || p.url).trim();

/**
 * When a notification arrived. In the list: the time if it was today, else the
 * day and month (with the year only when it is not this year). In the opened
 * message: the whole date and the time.
 */
export function formatNotificationDate(
  iso: string,
  locale: 'uk' | 'en',
  style: 'list' | 'full' = 'list',
  now: Date = new Date(),
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const tag = locale === 'uk' ? 'uk-UA' : 'en-GB';
  const time = new Intl.DateTimeFormat(tag, { hour: '2-digit', minute: '2-digit' }).format(d);
  if (style === 'full') {
    const day = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', year: 'numeric' })
      .format(d)
      .replace(/\s?р\.$/, '');
    return `${day}, ${time}`;
  }
  if (d.toDateString() === now.toDateString()) return time;
  return new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'short',
    ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}),
  })
    .format(d)
    .replace(/\s?р\.$/, '');
}

/** A plain e-mail check: something@something.something, no spaces. */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
