import { useState } from 'react';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { cabinetCopy, type CabinetLocale } from './cabinetCopy';
import type { Course, Grant } from './cabinetData';
import { EmptyState, PageTitle } from './parts';

export function CourseCard({ locale, course }: { locale: CabinetLocale; course: Course }) {
  const t = cabinetCopy[locale].opp.courses;
  return (
    <article className="flex flex-col gap-5 border-b-2 border-brand-black py-6 md:flex-row md:items-center md:justify-between md:py-8">
      <div className="min-w-0">
        <h3 className="font-serif text-h2-mobile md:text-h2-desktop">{course.title}</h3>
        <p className="mt-3 font-mono text-text1-mobile text-brand-muted">
          {t.provider}: <span className="text-brand-black">{course.provider}</span>
        </p>
      </div>
      <a href={course.href} target="_blank" rel="noopener noreferrer" className="shrink-0 no-underline">
        <Button variant="bordered" tabIndex={-1}>
          {t.open}
        </Button>
      </a>
    </article>
  );
}

/** A deadline this close gets an alert of its own. */
const SOON_DAYS = 14;

const daysLeft = (iso: string, today: Date) => {
  const end = new Date(`${iso}T23:59:59`);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
};

export function GrantCard({
  locale,
  grant,
  today = new Date(),
  onToggleSaved,
}: {
  locale: CabinetLocale;
  grant: Grant;
  today?: Date;
  onToggleSaved?: (id: string) => void;
}) {
  const t = cabinetCopy[locale].opp.grants;
  const left = grant.deadline ? daysLeft(grant.deadline, today) : null;
  const soon = left !== null && left <= SOON_DAYS;
  const date = grant.deadline
    ? new Date(`${grant.deadline}T12:00:00`).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <article data-soon={soon || undefined} className="border-b-2 border-brand-black py-6 md:py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          {date || grant.saved ? (
            <p className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-text1-mobile">
              {grant.saved ? (
                <span role="status" className="inline-flex items-center gap-2 bg-brand-black px-3 py-1 text-[16px] leading-6 font-bold text-white">
                  <span aria-hidden>✓</span>
                  {t.saved}
                </span>
              ) : null}
              {date ? (
                <span>
                  {t.deadline}: <strong className="font-bold">{date}</strong>
                </span>
              ) : null}
              {soon ? (
                <span
                  role="status"
                  className="inline-flex items-center gap-2 bg-brand-accent-yellow px-3 py-1 font-bold"
                >
                  <span aria-hidden>!</span>
                  {t.soon(left)}
                </span>
              ) : null}
            </p>
          ) : null}
          <h3 className="font-serif text-h2-mobile md:text-h2-desktop">{grant.title}</h3>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-mono text-breadcrumbs text-brand-muted">{t.field}:</span>
            <Tag as="span" variant="accent">
              {grant.field}
            </Tag>
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 md:w-[290px]">
          <a href={grant.href} target="_blank" rel="noopener noreferrer" className="block no-underline">
            <Button variant="black" tabIndex={-1} className="w-full justify-center">
              {t.open}
            </Button>
          </a>
          <Button
            variant="bordered"
            aria-pressed={!!grant.saved}
            onClick={() => onToggleSaved?.(grant.id)}
            className="w-full justify-center"
          >
            {grant.saved ? t.unsave : t.save}
          </Button>
        </div>
      </div>
    </article>
  );
}

export type OpportunityTab = 'courses' | 'grants';

export interface OpportunitiesScreenProps {
  locale: CabinetLocale;
  courses: Course[];
  grants: Grant[];
  tab?: OpportunityTab;
  onEditKeywords?: () => void;
}

export function OpportunitiesScreen({
  locale,
  courses,
  grants: initialGrants,
  tab: initialTab = 'courses',
  onEditKeywords,
}: OpportunitiesScreenProps) {
  const t = cabinetCopy[locale].opp;
  const [tab, setTab] = useState<OpportunityTab>(initialTab);
  const [grants, setGrants] = useState(initialGrants);
  const [savedOnly, setSavedOnly] = useState(false);
  const savedCount = grants.filter((g) => g.saved).length;
  const shownGrants = savedOnly ? grants.filter((g) => g.saved) : grants;

  const toggleSaved = (id: string) =>
    setGrants((all) => all.map((g) => (g.id === id ? { ...g, saved: !g.saved } : g)));

  return (
    <div>
      <PageTitle title={t.title} lede={t.lede} />

      <fieldset className="m-0 flex gap-8 border-0 p-0">
        <legend className="sr-only">{t.title}</legend>
        {(['courses', 'grants'] as const).map((key) => (
          <label key={key} className="group cursor-pointer py-2">
            <input
              type="radio"
              name="opp-tab"
              value={key}
              checked={tab === key}
              onChange={() => setTab(key)}
              className="peer sr-only"
            />
            <span className="block border-b-[3px] border-transparent pb-1 font-mono text-[20px] font-medium leading-[28px] text-brand-muted transition-colors group-hover:border-brand-line-muted group-hover:text-brand-black md:text-[24px] md:leading-[32px] peer-checked:border-brand-black peer-checked:text-brand-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand-black">
              {t.tabs[key]}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="mt-8">
        {tab === 'courses' ? (
          <>
            {courses.length ? (
              <div className="border-t-2 border-brand-black">
                {courses.map((c) => (
                  <CourseCard key={c.id} locale={locale} course={c} />
                ))}
              </div>
            ) : (
              <EmptyState title={t.courses.emptyTitle} text={t.courses.emptyText} />
            )}
          </>
        ) : (
          <>
            {grants.length ? (
              <>
                <button
                  type="button"
                  aria-pressed={savedOnly}
                  onClick={() => setSavedOnly((v) => !v)}
                  className={`mb-4 border-2 border-brand-black px-3 py-1 font-mono text-text1-mobile ${savedOnly ? 'bg-brand-black text-white' : 'bg-white'}`}
                >
                  {t.grants.savedOnly} ({savedCount})
                </button>
                {shownGrants.length ? (
                  <div className="border-t-2 border-brand-black">
                    {shownGrants.map((g) => (
                      <GrantCard key={g.id} locale={locale} grant={g} onToggleSaved={toggleSaved} />
                    ))}
                  </div>
                ) : (
                  <EmptyState title={t.grants.noSavedTitle} text={t.grants.noSavedText} />
                )}
              </>
            ) : (
              <EmptyState
                title={t.grants.emptyTitle}
                text={t.grants.emptyText}
                action={
                  <Button variant="black" onClick={onEditKeywords}>
                    {t.grants.emptyAction}
                  </Button>
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
