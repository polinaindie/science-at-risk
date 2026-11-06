import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { Pagination } from '@/components/Pagination';
import { cabinetCopy, type CabinetLocale } from './cabinetCopy';
import type { Notification } from './cabinetData';
import { formatNotificationDate } from './format';
import { EmptyState, Modal, PageTitle } from './parts';

const WRAP = '[overflow-wrap:anywhere]';

/** The filled dot that says "not read yet"; the word is there for screen readers. */
function UnreadMark({ label }: { label: string }) {
  return (
    <span className="mt-2 flex size-3 shrink-0" title={label}>
      <span aria-hidden className="size-3 rounded-full bg-brand-black" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * One notification, whole: there is no page behind it. A request only says that a
 * letter is waiting in the person's mailbox and shows its subject and sender;
 * the letter's text is never shown. Yellow means not read yet.
 */
export function NotificationCard({
  locale,
  notification: n,
  onAccept,
  onDecline,
}: {
  locale: CabinetLocale;
  notification: Notification;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  const t = cabinetCopy[locale].notifications;
  const unread = !n.read;
  const isRequest = n.kind === 'request';
  const title = {
    request: t.requestTitle,
    team: t.teamTitle,
    colleague: t.colleagueTitle,
    accepted: t.acceptedTitle,
    declined: t.declinedTitle,
  }[n.kind];
  const mail = n.senderEmail ? (
    <Link href={`mailto:${n.senderEmail}`} className="text-[16px]! leading-[24px]!">
      {n.senderEmail}
    </Link>
  ) : null;

  return (
    <li
      data-read={n.read}
      className={`border-2 border-brand-black px-5 py-4 md:px-6 md:py-5 ${unread ? 'bg-brand-accent-yellow' : 'bg-white'}`}
    >
      <div className="flex items-start gap-4">
        {unread ? <UnreadMark label={t.unreadMark} /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2
              className={`m-0 font-mono text-text1-mobile font-bold md:text-text1-desktop ${WRAP}`}
            >
              {title}
            </h2>
            <time
              dateTime={n.date}
              className="whitespace-nowrap font-mono text-breadcrumbs text-brand-muted"
            >
              {formatNotificationDate(n.date, locale, 'full')}
            </time>
          </div>

          {n.kind === 'request' || n.kind === 'team' ? (
            <>
              <p className={`mt-3 font-mono text-text1-mobile md:text-text1-desktop ${WRAP}`}>
                <span className="text-brand-muted">{t.subject}: </span>
                <strong className="font-bold">{n.subject}</strong>
              </p>
              <p className={`mt-1 font-mono text-text1-mobile md:text-text1-desktop ${WRAP}`}>
                <span className="text-brand-muted">{t.sender}: </span>
                {isRequest ? n.senderEmail : t.teamName}
              </p>
              <p
                className={`mt-4 border-t-2 border-brand-black pt-4 font-mono text-text1-mobile md:text-text1-desktop ${WRAP}`}
              >
                {isRequest ? t.requestText : n.body.replace(/\s*\n\s*/g, ' ')}
              </p>
            </>
          ) : (
            <>
              <p className={`mt-3 font-mono text-text1-mobile md:text-text1-desktop ${WRAP}`}>
                <span className="text-brand-muted">
                  {(n.kind === 'colleague' ? t.from : t.colleague) + ': '}
                </span>
                <strong className="font-bold">{n.senderName}</strong>
              </p>
              {n.senderPosition ? (
                <p className={`mt-1 font-mono text-text1-mobile text-brand-muted md:text-text1-desktop ${WRAP}`}>
                  {n.senderPosition}
                </p>
              ) : null}
              <div
                className={`mt-4 border-t-2 border-brand-black pt-4 font-mono text-text1-mobile md:text-text1-desktop ${WRAP}`}
              >
                {n.kind === 'colleague' ? (
                  <>
                    <p className="m-0">{n.body}</p>
                    {n.status === 'pending' || !n.status ? (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Button variant="black" type="button" onClick={() => onAccept?.(n.id)}>
                          {t.accept}
                        </Button>
                        <Button variant="white" type="button" onClick={() => onDecline?.(n.id)}>
                          {t.decline}
                        </Button>
                      </div>
                    ) : n.status === 'accepted' ? (
                      <p className="mt-5 mb-0 bg-brand-accent-blue px-4 py-3">
                        {t.youAccepted} {t.writeTo} {mail}
                      </p>
                    ) : (
                      <p className="mt-5 mb-0 text-brand-muted">{t.youDeclined}</p>
                    )}
                  </>
                ) : n.kind === 'accepted' ? (
                  <p className="m-0 bg-brand-accent-blue px-4 py-3">
                    {t.writeTo} {mail}
                  </p>
                ) : (
                  <p className="m-0">{t.declinedText}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export interface NotificationsScreenProps {
  locale: CabinetLocale;
  notifications: Notification[];
  /**
   * The caller owns the data (the menu counter needs it too): changes come out
   * here. Without it the screen keeps its own copy, which is enough to look at.
   */
  onChange?: (next: Notification[]) => void;
  page?: number;
  pageSize?: number;
}

export function NotificationsScreen({
  locale,
  notifications,
  onChange,
  page: initialPage = 1,
  pageSize = 10,
}: NotificationsScreenProps) {
  const t = cabinetCopy[locale].notifications;
  const [own, setOwn] = useState(notifications);
  const items = onChange ? notifications : own;
  const [page, setPage] = useState(initialPage);
  // What was just done, said aloud for screen readers.
  const [said, setSaid] = useState('');
  const top = useRef<HTMLDivElement>(null);

  const set = (next: Notification[]) => (onChange ? onChange(next) : setOwn(next));
  const setRead = (ids: string[]) =>
    set(items.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)));

  // The colleague request that is about to be declined; the sheet asks once more.
  const [asking, setAsking] = useState<string | null>(null);
  const answer = (id: string, status: 'accepted' | 'declined') => {
    set(items.map((n) => (n.id === id ? { ...n, status, read: true } : n)));
    setSaid(status === 'accepted' ? t.acceptedSaid : t.declinedSaid);
  };

  const unread = items.filter((n) => !n.read).length;
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pages);
  const shown = items.slice((current - 1) * pageSize, current * pageSize);

  const goToPage = (next: number) => {
    setPage(next);
    top.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <div ref={top} className="scroll-mt-28">
      <PageTitle title={t.title} lede={t.lede} />
      {items.length === 0 ? (
        <EmptyState title={t.emptyTitle} text={t.emptyText} />
      ) : (
        <>
          <div className="mb-4 flex min-h-6 flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="m-0 font-mono text-text1-mobile md:text-text1-desktop">
              {unread > 0 ? t.unreadCount(unread) : t.allRead}
            </p>
            {unread > 0 ? (
              <Link
                as="button"
                onClick={() => {
                  setRead(items.filter((n) => !n.read).map((n) => n.id));
                  setSaid(t.markedAllRead);
                }}
                className="text-[16px]! leading-[24px]!"
              >
                {t.markAllRead}
              </Link>
            ) : null}
          </div>
          <ul aria-label={t.listLabel} className="m-0 flex list-none flex-col gap-4 p-0">
            {shown.map((n) => (
              <NotificationCard
                key={n.id}
                locale={locale}
                notification={n}
                onAccept={(id) => answer(id, 'accepted')}
                onDecline={setAsking}
              />
            ))}
          </ul>
          {pages > 1 ? (
            <Pagination
              className="mt-10"
              currentPage={current}
              totalPages={pages}
              onPageChange={goToPage}
              prevLabel={t.pager.prev}
              nextLabel={t.pager.next}
              label={t.pager.label}
            />
          ) : null}
        </>
      )}
      {asking ? (
        <Modal
          title={t.declineAsk.title}
          onClose={() => setAsking(null)}
          actions={
            <>
              <Button
                variant="black"
                type="button"
                onClick={() => {
                  answer(asking, 'declined');
                  setAsking(null);
                }}
              >
                {t.declineAsk.confirm}
              </Button>
              <Button variant="white" type="button" onClick={() => setAsking(null)}>
                {t.declineAsk.keep}
              </Button>
            </>
          }
        >
          <p className="m-0">{t.declineAsk.text}</p>
        </Modal>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {said}
      </p>
    </div>
  );
}
