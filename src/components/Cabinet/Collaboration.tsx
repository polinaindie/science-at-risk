import { useState } from 'react';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { Tag } from '@/components/Tag';
import { TextField } from '@/components/TextField';
import { cabinetCopy, type CabinetLocale } from './cabinetCopy';
import type { MatchScientist } from './cabinetData';
import { EmptyState, PageTitle } from './parts';

export type RequestState = 'idle' | 'sent' | 'error';

/**
 * A row of the Scientists list, plus what this screen adds: the tags you share
 * with the person, and the request button with its three states.
 */
export function MatchCard({
  locale,
  scientist,
  request = 'idle',
  onRequest,
}: {
  locale: CabinetLocale;
  scientist: MatchScientist;
  request?: RequestState;
  onRequest?: (id: string) => void;
}) {
  const t = cabinetCopy[locale].collab;
  const rest = scientist.tags.filter((x) => !scientist.sharedTags.includes(x));

  return (
    <article className="border-b-2 border-brand-black py-6 md:py-10">
      <div className="flex gap-6 md:gap-8">
        <img
          src={scientist.imageSrc}
          alt=""
          className="hidden size-[160px] shrink-0 object-cover md:block lg:size-[200px]"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-8 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-h2-mobile text-brand-black md:text-h2-desktop">
              {scientist.name}
            </h3>
            <p className="mt-3 font-mono text-h3-mobile md:text-text1-desktop">
              {scientist.subtitle}
            </p>
            <p className="mt-2 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
              {scientist.organization}
            </p>

            <p className="mt-5 mb-2 font-mono text-breadcrumbs text-brand-muted">{t.shared}</p>
            <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
              {scientist.sharedTags.map((tag) => (
                <li key={tag}>
                  <Tag as="span" variant="accent">
                    {tag}
                  </Tag>
                </li>
              ))}
              {rest.map((tag) => (
                <li key={tag}>
                  <Tag as="span" variant="accent">
                    {tag}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>

          {/* The request sits apart from the tags, so a button never reads as one more tag. */}
          <div className="flex shrink-0 flex-col items-start gap-3 xl:w-[240px]">
            {request === 'sent' ? (
              <>
                <span
                  role="status"
                  className="inline-flex items-center gap-2 border-2 border-brand-black bg-brand-accent-blue px-4 py-2 font-mono text-text1-mobile"
                >
                  <span aria-hidden>✓</span> {t.requested}
                </span>
                <span className="font-mono text-text1-mobile text-brand-muted">
                  {t.requestSent}
                </span>
              </>
            ) : (
              <>
                <Link
                  as="button"
                  onClick={() => onRequest?.(scientist.id)}
                  className="text-[16px]! leading-[24px]!"
                >
                  {request === 'error' ? t.retry : t.request}
                </Link>
                {request === 'error' ? (
                  <p
                    role="alert"
                    className="bg-brand-accent-yellow px-3 py-2 font-mono text-text1-mobile"
                  >
                    {t.errorText}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export interface CollaborationScreenProps {
  locale: CabinetLocale;
  scientists: MatchScientist[];
  /** Per-person request state, to open the screen already mid-story. */
  requests?: Record<string, RequestState>;
  query?: string;
  /** The demo's way to make the next request fail. */
  failNext?: boolean;
  onEditKeywords?: () => void;
}

export function CollaborationScreen({
  locale,
  scientists,
  requests: initialRequests = {},
  query: initialQuery = '',
  failNext = false,
  onEditKeywords,
}: CollaborationScreenProps) {
  const t = cabinetCopy[locale].collab;
  const [query, setQuery] = useState(initialQuery);
  // The list narrows when the form is sent, and widens again when the field is emptied.
  const [applied, setApplied] = useState(initialQuery);
  const [requests, setRequests] = useState(initialRequests);
  const [fail, setFail] = useState(failNext);

  const q = applied.trim().toLowerCase();
  const shown = q
    ? scientists.filter((s) =>
        [s.name, s.subtitle, s.organization, ...s.tags].join(' ').toLowerCase().includes(q),
      )
    : scientists;

  const request = (id: string) => {
    setRequests((r) => ({ ...r, [id]: fail ? 'error' : 'sent' }));
    setFail(false);
  };

  return (
    <div>
      <PageTitle title={t.title} lede={t.lede} />
      {scientists.length === 0 ? (
        <EmptyState
          title={t.emptyTitle}
          text={t.emptyText}
          action={
            <Button variant="black" onClick={onEditKeywords}>
              {t.emptyAction}
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <form
              role="search"
              className="flex w-full min-w-0 items-end gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setApplied(query);
              }}
            >
              <TextField
                label={t.search}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                  if (!e.currentTarget.value) setApplied('');
                }}
                className="max-w-none min-w-0 flex-1"
              />
              <Button type="submit" variant="black" className="shrink-0">
                {t.find}
              </Button>
            </form>
            {/* Not shown, but read out when a search narrows the list. */}
            <p className="sr-only" aria-live="polite">
              {t.count(shown.length)}
            </p>
          </div>
          <div className="mt-2">
            {shown.length ? (
              shown.map((s) => (
                <MatchCard
                  key={s.id}
                  locale={locale}
                  scientist={s}
                  request={requests[s.id]}
                  onRequest={request}
                />
              ))
            ) : (
              <div className="mt-8">
                <EmptyState title={t.noResultsTitle} text={t.noResultsText} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
