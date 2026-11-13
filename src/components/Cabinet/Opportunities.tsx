import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { cabinetCopy, type CabinetLocale } from './cabinetCopy';
import type { Course, Grant } from './cabinetData';
import { EmptyState, PageTitle } from './parts';

export function CourseCard({ locale, course }: { locale: CabinetLocale; course: Course }) {
  const t = cabinetCopy[locale].opp.courses;
  return (
    <article className="flex flex-col gap-6 border-b-2 border-brand-black py-6 md:flex-row md:items-end md:justify-between md:py-8">
      <div className="min-w-0 md:max-w-[70%]">
        <h3 className="font-serif text-h2-mobile md:text-h2-desktop">{course.title}</h3>
        <p className="mt-3 font-mono text-text1-mobile text-brand-muted">
          {t.provider}: <span className="text-brand-black">{course.provider}</span>
        </p>
        <p className="mt-3 font-ukraine text-[1rem] leading-[1.375rem] md:text-[1.125rem] md:leading-[1.625rem]">{course.description}</p>
      </div>
      <div className="flex justify-end md:shrink-0">
        <a href={course.href} target="_blank" rel="noopener noreferrer" className="shrink-0 no-underline">
          <Button variant="black" tabIndex={-1}>
            {t.open}
          </Button>
        </a>
      </div>
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
}: {
  locale: CabinetLocale;
  grant: Grant;
  today?: Date;
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

  const fields = Array.isArray(grant.field) ? grant.field : [grant.field];
  return (
    <article data-soon={soon || undefined} className="border-b-2 border-brand-black py-6 md:py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 md:max-w-[70%]">
          {date ? (
            <p className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-text1-mobile">
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
          {/* The label stands over the tags, so a grant with several fields has room for all of them. */}
          <div className="mt-4">
            <p className="m-0 mb-2 font-mono text-breadcrumbs text-brand-muted">{fields.length > 1 ? t.fields : t.field}</p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {fields.map((f) => (
                <li key={f}>
                  <Tag as="span" variant="accent">
                    {f}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-end md:shrink-0">
          <a href={grant.href} target="_blank" rel="noopener noreferrer" className="block no-underline">
            <Button variant="black" tabIndex={-1}>
              {t.open}
            </Button>
          </a>
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
  grants,
  tab = 'courses',
  onEditKeywords,
}: OpportunitiesScreenProps) {
  const t = cabinetCopy[locale].opp;

  return (
    <div>
      <PageTitle title={t.tabs[tab]} lede={t[tab].lede} />

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
              <div className="border-t-2 border-brand-black">
                {grants.map((g) => (
                  <GrantCard key={g.id} locale={locale} grant={g} />
                ))}
              </div>
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
