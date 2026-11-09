import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { SquircleDefs } from '@/styles/SquircleDefs';
import { useSquircleClipPath } from '@/styles/useSquircleClipPath';
import { Link } from '@/components/Link';
import { cabinetCopy, type CabinetLocale } from './cabinetCopy';
import type { Notification } from './cabinetData';
import { formatNotificationDate } from './format';
import { EmptyState, PageTitle, tabClass, Toast } from './parts';

const WRAP = '[overflow-wrap:anywhere]';

/** Unread is shown by the yellow card; the word is only for screen readers. */
function UnreadMark({ label }: { label: string }) {
  return <span className="sr-only">{label}</span>;
}

/** The sender's photo, or their initials when there is none; it leads to the scientist's profile when there is one. */
function Avatar({ name, src, href, label }: { name: string; src?: string; href?: string; label: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  const squircle = useSquircleClipPath({ radius: 22, smoothing: 0.9 });
  const picture = src ? (
    <img ref={squircle.ref} style={squircle.style} src={src} alt="" className="size-16 shrink-0 object-cover" />
  ) : (
    <span
      ref={squircle.ref}
      style={squircle.style}
      aria-hidden
      className="grid size-16 shrink-0 place-items-center bg-brand-accent-blue font-mono text-text1-mobile font-bold"
    >
      {initials}
    </span>
  );
  return (
    <>
      {href ? (
        <a
          href={`${import.meta.env.BASE_URL}${href.replace(/^\//, '')}`}
          aria-label={label}
          title={label}
          onClick={(e) => e.stopPropagation()}
          className="satr-dim shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
        >
          {picture}
        </a>
      ) : (
        picture
      )}
      <SquircleDefs clipId={squircle.clipId} pathD={squircle.pathD} />
    </>
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
  onRead,
  onDelete,
}: {
  locale: CabinetLocale;
  notification: Notification;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  /** A click on the card, or an action in it, makes it read. */
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const t = cabinetCopy[locale].notifications;
  const unread = !n.read;
  const isRequest = n.kind === 'request';
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  // Esc, a click elsewhere or tabbing out closes the menu; Esc hands focus back to the button.
  useEffect(() => {
    if (!menu) return;
    const close = (e: Event) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    const focusOut = (e: FocusEvent) => {
      if (!menuRef.current?.contains(e.relatedTarget as Node)) setMenu(false);
    };
    const el = menuRef.current;
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', key);
    el?.addEventListener('focusout', focusOut);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', key);
      el?.removeEventListener('focusout', focusOut);
    };
  }, [menu]);
  // A colleague's request still waiting for an answer keeps its buttons on the card's bottom row.
  const answerable = n.kind === 'colleague' && !n.stale && n.status !== 'accepted' && n.status !== 'declined';
  const title = {
    request: t.requestTitle,
    team: t.teamTitle,
    colleague: t.colleagueTitle,
    accepted: t.acceptedTitle,
  }[n.kind];
  const mail = n.senderEmail ? (
    <Link href={`mailto:${n.senderEmail}`} className="text-[length:inherit]! leading-[inherit]!">
      {n.senderEmail}
    </Link>
  ) : null;

  // The card's fill and its black outline are two squircle layers behind the content.
  const fill = useSquircleClipPath({ radius: 24, smoothing: 0.9 });
  const ring = useSquircleClipPath({ radius: 24, smoothing: 0.9, strokeWidth: 2 });

  const hasLeft = answerable || (unread && !n.stale);
  const menuNode = (
    <div ref={menuRef} className="relative">
              <button
                ref={menuButton}
                type="button"
                aria-label={t.actions}
                aria-haspopup="menu"
                aria-expanded={menu}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenu((v) => !v);
                }}
                className="flex size-11 items-center justify-end font-mono text-h3-mobile font-bold md:text-h3-desktop"
              >
                <span aria-hidden>⋯</span>
              </button>
              {menu ? (
                <div role="menu" className={`absolute right-0 top-full z-10 border-2 border-brand-black bg-white`}>
                  <button
                    type="button"
                    role="menuitem"
                    autoFocus
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenu(false);
                      onDelete?.(n.id);
                    }}
                    className="block min-h-11 whitespace-nowrap px-4 text-left font-mono text-text1-mobile md:text-text1-desktop"
                  >
                    {t.deleteAction}
                  </button>
                </div>
              ) : null}
            </div>
  );

  return (
    <li
      data-read={n.read}
      data-stale={n.stale}
      onClick={() => unread && onRead?.(n.id)}
      className={`relative px-5 py-4 md:px-6 md:py-5 ${n.stale ? 'opacity-70' : ''}`}
    >
      <span
        ref={fill.ref}
        style={fill.style}
        aria-hidden
        className={`absolute inset-0 ${unread ? 'bg-brand-accent-yellow' : 'bg-white'}`}
      />
      <span ref={ring.ref} style={ring.style} aria-hidden className="absolute inset-0 bg-brand-black" />
      <SquircleDefs clipId={fill.clipId} pathD={fill.pathD} />
      <SquircleDefs clipId={ring.clipId} pathD={ring.pathD} />
      <div className="relative flex items-start gap-4">
        {unread ? <UnreadMark label={t.unreadMark} /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <h3
              className={`m-0 font-mono text-text1-mobile font-bold md:text-text1-desktop ${WRAP}`}
            >
              {title}
            </h3>
            <time
              dateTime={n.date}
              className="whitespace-nowrap font-mono text-breadcrumbs text-brand-muted"
            >
              {formatNotificationDate(n.date, locale, 'full')}
            </time>
            <div className="-my-3 ml-auto">{menuNode}</div>
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
              <div className="mt-3 flex items-center gap-4">
                <Avatar name={n.senderName ?? ''} src={n.senderImage} href={n.senderHref} label={t.profileOf(n.senderName ?? '')} />
                <div className={`min-w-0 font-mono text-text1-mobile md:text-text1-desktop ${WRAP}`}>
                  <p className="m-0">
                    <span className="text-brand-muted">
                      {(n.kind === 'colleague' ? t.from : t.colleague) + ': '}
                    </span>
                    <strong className="font-bold">{n.senderName}</strong>
                  </p>
                  {n.senderPosition ? <p className="m-0 mt-1 text-brand-muted">{n.senderPosition}</p> : null}
                </div>
              </div>
              <div
                className={`mt-4 border-t-2 border-brand-black pt-4 font-mono text-text1-mobile md:text-text1-desktop ${WRAP}`}
              >
                {n.kind === 'colleague' ? (
                  <>
                    {n.body ? <p className="m-0">{n.body}</p> : null}
                    {n.mutualContacts?.length ? (
                      <p className="mt-3 mb-0 text-brand-muted">{t.mutual(n.mutualContacts)}</p>
                    ) : null}
                    {n.stale ? (
                      <p className="mt-5 mb-0 text-brand-muted">
                        {n.stale === 'cancelled' ? t.staleCancelled : t.staleDeleted}
                      </p>
                    ) : n.status === 'declined' ? (
                      <div className="mt-5">
                        <p className="m-0 text-brand-muted">{t.declinedNote}</p>
                        <Link
                          as="button"
                          className="mt-2 text-[length:inherit]! leading-[inherit]!"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccept?.(n.id);
                          }}
                        >
                          {t.acceptAgain}
                        </Link>
                      </div>
                    ) : n.status === 'accepted' ? (
                      <div className="mt-5 flex flex-wrap items-center gap-4">
                        <span>
                          {t.youAccepted} {t.writeTo} {mail}
                        </span>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="m-0">
                    {t.writeTo} {mail}
                  </p>
                )}
              </div>
            </>
          )}
          {hasLeft ? (
            <div className="mt-5 flex items-center gap-4">
            {answerable ? (
              <div className="flex flex-wrap gap-3">
                <Button variant="black" type="button" onClick={(e) => { e.stopPropagation(); onAccept?.(n.id); }}>
                  {t.accept}
                </Button>
                <Button variant="white" type="button" onClick={(e) => { e.stopPropagation(); onDecline?.(n.id); }}>
                  {t.decline}
                </Button>
              </div>
            ) : unread && !n.stale ? (
              <Link
                as="button"
                className="text-[length:inherit]! leading-[inherit]!"
                onClick={(e) => {
                  e.stopPropagation();
                  onRead?.(n.id);
                }}
              >
                {t.markRead}
              </Link>
            ) : (
              <span />
            )}
            </div>
          ) : null}
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
  /** How many batches are already loaded (a batch is `pageSize` notifications). */
  page?: number;
  pageSize?: number;
}

type Tab = 'all' | 'unread';
const TAB_KEY = 'satr-notifications-tab';
const readTab = (): Tab => {
  try {
    const v = sessionStorage.getItem(TAB_KEY);
    if (v === 'all' || v === 'unread') return v;
  } catch {
    /* private mode: the filter just is not remembered */
  }
  return 'all';
};

export function NotificationsScreen({
  locale,
  notifications,
  onChange,
  page: initialPage = 1,
  pageSize = 20,
}: NotificationsScreenProps) {
  const t = cabinetCopy[locale].notifications;
  const [own, setOwn] = useState(notifications);
  const items = onChange ? notifications : own;
  const [batches, setBatches] = useState(initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  // What was just done, said aloud for screen readers.
  const [said, setSaid] = useState('');
  const top = useRef<HTMLDivElement>(null);

  // Every change builds on what is there right now, not on what was there at the last render:
  // one click can make two changes (the card becomes read, and the request is answered).
  const latest = useRef(items);
  latest.current = items;
  const set = (next: Notification[]) => {
    latest.current = next;
    if (onChange) onChange(next);
    else setOwn(next);
  };
  const setRead = (ids: string[]) =>
    set(latest.current.map((n) => (ids.includes(n.id) ? { ...n, read: true, seen: true } : n)));

  const [tab, setTabState] = useState<Tab>(readTab);
  const setTab = (next: Tab) => {
    // A shorter list must not shorten the page: the browser would pull the scroll position up
    // and the sticky side menu would jump. The screen keeps the height it has now.
    if (top.current) top.current.style.minHeight = `${top.current.offsetHeight}px`;
    setTabState(next);
    setBatches(1);
    try {
      sessionStorage.setItem(TAB_KEY, next);
    } catch {
      /* see readTab */
    }
  };

  // One message at a time: a decline or a deletion, with the way back.
  const [undo, setUndo] = useState<{ text: string; restore: () => void } | null>(null);

  // Answers are idempotent: a request that is no longer in the state they expect is left as it is.
  const answer = (id: string, status: 'accepted' | 'declined') => {
    const n = latest.current.find((x) => x.id === id);
    if (!n || n.kind !== 'colleague' || n.stale || n.status === status) return;
    set(latest.current.map((x) => (x.id === id ? { ...x, status, read: true, seen: true } : x)));
    if (status === 'declined') {
      setUndo({
        text: t.declinedToast,
        restore: () =>
          set(latest.current.map((x) => (x.id === id ? { ...x, status: 'pending', read: n.read } : x))),
      });
      setSaid(t.declinedToast);
    } else {
      setUndo(null);
      setSaid(t.acceptedSaid);
    }
  };
  const remove = (id: string) => {
    const now = latest.current;
    const at = now.findIndex((x) => x.id === id);
    if (at < 0) return;
    const gone = now[at];
    set(now.filter((x) => x.id !== id));
    setUndo({
      text: t.deletedToast,
      restore: () => {
        const current = latest.current;
        if (current.some((x) => x.id === id)) return;
        set([...current.slice(0, at), gone, ...current.slice(at)]);
      },
    });
    setSaid(t.deletedSaid);
  };
  const doUndo = () => {
    undo?.restore();
    setUndo(null);
    setSaid(t.undoneSaid);
  };

  const live = items.filter((n) => n.status !== 'declined');
  const unread = live.filter((n) => !n.read).length;

  // A declined request stays in the list, in its place by date, with a way to change one's mind.
  const visible = items
    .filter((n) => (tab === 'unread' ? !n.read && n.status !== 'declined' : true))
    .sort((a, b) => b.date.localeCompare(a.date));
  const shown = visible.slice(0, batches * pageSize);
  const hasMore = shown.length < visible.length;

  // The batch arrives after a short wait, as it would from the server.
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setBatches((b) => b + 1);
      setLoadingMore(false);
      setSaid(t.allShown);
    }, 600);
  };

  const tabs = [
    ['all', t.tabs.all, 0],
    ['unread', t.tabs.unread, unread],
  ] as const;

  return (
    <div ref={top} className="scroll-mt-28">
      <PageTitle title={t.title} lede={t.lede} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div role="group" aria-label={t.tabs.label} className="flex flex-wrap gap-x-6 md:gap-x-10">
          {tabs.map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
              className={tabClass(tab === key)}
            >
              {label}
              {key !== 'all' && count > 0 ? (
                <span className="grid min-w-6 place-items-center rounded-full bg-brand-accent-yellow px-1.5 text-breadcrumbs text-brand-black">
                  {count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {items.length > 0 ? (
          unread > 0 ? (
            <Link
              as="button"
              className="text-[length:inherit]! leading-[inherit]!"
              onClick={() => {
                setRead(items.filter((n) => !n.read).map((n) => n.id));
                setSaid(t.markedAllRead);
              }}
            >
              {t.markAllRead}
            </Link>
          ) : (
            <p className="m-0 font-mono text-text1-mobile md:text-text1-desktop">{t.allRead}</p>
          )
        ) : null}
      </div>
      {items.length === 0 ? (
        <EmptyState title={t.emptyTitle} text={t.emptyText} />
      ) : (
        <>
          {visible.length === 0 ? <EmptyState title={t.unreadEmpty} text={t.emptyTab} /> : null}
          {visible.length > 0 ? (
            <ul aria-label={t.listLabel} className="m-0 mb-8 flex list-none flex-col gap-4 p-0">
              {shown.map((n) => (
                <NotificationCard
                  key={n.id}
                  locale={locale}
                  notification={n}
                  onAccept={(id) => answer(id, 'accepted')}
                  onDecline={(id) => answer(id, 'declined')}
                  onRead={(id) => setRead([id])}
                  onDelete={remove}
                />
              ))}
            </ul>
          ) : null}
          {loadingMore ? (
            <div aria-hidden className="flex flex-col gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-[24px] bg-brand-line-muted" />
              ))}
            </div>
          ) : hasMore ? (
            <Button variant="white" type="button" onClick={loadMore}>
              {t.more}
            </Button>
          ) : visible.length > 0 ? (
            <p className="m-0 font-mono text-text1-mobile text-brand-muted md:text-text1-desktop">{t.allShown}</p>
          ) : null}
        </>
      )}
      {undo ? (
        <Toast
          kind="success"
          duration={10000}
          closeLabel={t.closeToast}
          onClose={() => setUndo(null)}
          action={{ label: t.undo, onClick: doUndo }}
        >
          {undo.text}
        </Toast>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {said}
      </p>
    </div>
  );
}
