import { useState } from 'react';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { Tag } from '@/components/Tag';
import { TextField } from '@/components/TextField';
import { cabinetCopy, type CabinetLocale } from './cabinetCopy';
import type { MatchScientist } from './cabinetData';
import { EmptyState, Modal, PageTitle } from './parts';

export type RequestState = 'idle' | 'sent' | 'accepted' | 'error';

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
          <div className="flex shrink-0 flex-col items-start gap-3 xl:w-[300px]">
            {request === 'accepted' ? (
              /* Once the colleague agrees, the button gives way to their email, in the button's own type. */
              <p
                role="status"
                className="m-0 font-mono text-[1.25rem] leading-[1.75rem] md:text-[1.5rem] md:leading-[2rem] [overflow-wrap:anywhere]"
              >
                {t.acceptedText}{' '}
                {scientist.email ? (
                  <Link href={`mailto:${scientist.email}`} className="text-[1.25rem]! leading-[1.75rem]! md:text-[1.5rem]! md:leading-[2rem]! [--satr-ul:2px]">
                    {scientist.email}
                  </Link>
                ) : null}
              </p>
            ) : request === 'sent' ? (
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
                <Button variant="black" type="button" onClick={() => onRequest?.(scientist.id)}>
                  {request === 'error' ? t.retry : t.request}
                </Button>
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
  /** The demo's way to show every sent request as accepted by the colleague. */
  accepted?: boolean;
  onEditKeywords?: () => void;
}

export function CollaborationScreen({
  locale,
  scientists,
  requests: initialRequests = {},
  query: initialQuery = '',
  failNext = false,
  accepted = false,
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

  // Who is being written to, and what has been typed so far.
  const [writingTo, setWritingTo] = useState<MatchScientist | null>(null);
  const [subject, setSubject] = useState('');
  const [draft, setDraft] = useState('');
  const [subjectEmpty, setSubjectEmpty] = useState(false);
  const [draftEmpty, setDraftEmpty] = useState(false);
  const [failed, setFailed] = useState(false);

  const open = (id: string) => {
    setWritingTo(scientists.find((s) => s.id === id) ?? null);
    setSubject('');
    setDraft('');
    setSubjectEmpty(false);
    setDraftEmpty(false);
    setFailed(false);
  };
  const close = () => setWritingTo(null);
  const submit = () => {
    if (!writingTo) return;
    if (!subject.trim() || !draft.trim()) {
      setSubjectEmpty(!subject.trim());
      setDraftEmpty(!draft.trim());
      return;
    }
    if (fail) {
      // The message stays in the box, so nothing typed is lost.
      setFailed(true);
      setFail(false);
      return;
    }
    setRequests((r) => ({ ...r, [writingTo.id]: 'sent' }));
    close();
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
                  request={accepted && requests[s.id] === 'sent' ? 'accepted' : requests[s.id]}
                  onRequest={open}
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
      {writingTo ? (
        <Modal
          title={t.writeTitle(writingTo.name)}
          onClose={close}
          actions={
            <>
              <Button variant="black" type="button" onClick={submit}>
                {failed ? t.retry : t.send}
              </Button>
              <Button variant="white" type="button" onClick={close}>
                {t.cancel}
              </Button>
            </>
          }
        >
          <p className="m-0">{t.writeHint}</p>
          <div className="mt-6">
            <TextField
              label={`${t.writeSubject} *`}
              value={subject}
              onChange={(e) => {
                setSubject(e.currentTarget.value);
                setSubjectEmpty(false);
              }}
              aria-invalid={subjectEmpty || undefined}
              className="max-w-none"
            />
            {subjectEmpty ? (
              <p role="alert" className="mt-2 bg-brand-accent-yellow px-3 py-1 font-mono text-text1-mobile">
                {t.writeSubjectEmpty}
              </p>
            ) : null}
          </div>
          <div className="mt-6">
            <TextField
              multiline
              label={`${t.writeLabel} *`}
              value={draft}
              onChange={(e) => {
                setDraft(e.currentTarget.value);
                setDraftEmpty(false);
              }}
              aria-invalid={draftEmpty || undefined}
              className="max-w-none"
            />
            {draftEmpty ? (
              <p role="alert" className="mt-2 bg-brand-accent-yellow px-3 py-1 font-mono text-text1-mobile">
                {t.writeEmpty}
              </p>
            ) : null}
          </div>
          {failed ? (
            <p role="alert" className="mt-4 bg-brand-accent-yellow px-3 py-2 font-mono text-text1-mobile">
              {t.errorText}
            </p>
          ) : null}
        </Modal>
      ) : null}
    </div>
  );
}
