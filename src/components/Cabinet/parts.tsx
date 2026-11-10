import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/Button';
import { cabinetCopy, type CabinetLocale, type ProfileStatus } from './cabinetCopy';

/** Status colours carry meaning only together with the word beside them. */
const STATUS_GROUND: Record<ProfileStatus, string> = {
  draft: 'bg-white',
  pending: 'bg-brand-accent-yellow',
  approved: 'bg-brand-accent-green',
};

/** The mark before the label: three shapes, so the state reads without colour. */
function StatusMark({ status }: { status: ProfileStatus }) {
  if (status === 'draft')
    return <span aria-hidden className="size-3 shrink-0 border-2 border-brand-black" />;
  if (status === 'pending')
    return (
      <span
        aria-hidden
        className="size-3 shrink-0 rounded-full border-2 border-brand-black bg-[linear-gradient(90deg,#000_50%,transparent_50%)]"
      />
    );
  // Approved needs no mark: the green and the word say it.
  return null;
}

export function StatusBadge({ status, locale }: { status: ProfileStatus; locale: CabinetLocale }) {
  const t = cabinetCopy[locale].status[status];
  return (
    <span
      role="status"
      title={t.text || undefined}
      // Only the draft chip is outlined: it is white, and on a white page it would vanish.
      className={`inline-flex items-center gap-2 px-3 py-1 font-mono text-text1-mobile ${STATUS_GROUND[status]} ${
        status === 'draft' ? 'border-2 border-brand-black' : ''
      }`}
      data-status={status}
    >
      <StatusMark status={status} />
      {t.label}
    </span>
  );
}

/**
 * The status, said in a sentence, at the top of every profile screen — so a
 * scientist never has to open Notifications to learn what the site shows.
 */
export function StatusStrip({
  status,
  locale,
  outlined = false,
  children,
}: {
  status: ProfileStatus;
  locale: CabinetLocale;
  /** Only the draft strip is outlined: it is white, and on a white page it would vanish. */
  outlined?: boolean;
  children?: ReactNode;
}) {
  const t = cabinetCopy[locale].status[status];
  return (
    <div
      role="status"
      data-status={status}
      className={`flex flex-col gap-3 px-5 py-[10px] md:flex-row md:items-center md:justify-between md:gap-6 ${STATUS_GROUND[status]} ${outlined && status === 'draft' ? 'border-2 border-brand-black' : ''}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-1 flex md:mt-2">
          <StatusMark status={status} />
        </span>
        <p className="font-mono text-text1-mobile md:text-text1-desktop">
          <strong className="font-bold">{t.text ? `${t.label}.` : t.label}</strong>{t.text ? ` ${t.text}` : null}
        </p>
      </div>
      {children ? <div className="flex shrink-0 flex-wrap gap-3">{children}</div> : null}
    </div>
  );
}

/** The banner shown once, when the team approves the changes. */
export function ApprovedBanner({
  locale,
  siteHref = '#',
  onClose,
}: {
  locale: CabinetLocale;
  siteHref?: string;
  onClose?: () => void;
}) {
  const t = cabinetCopy[locale].approved;
  return (
    <div
      role="status"
      className="flex flex-col gap-3 bg-brand-black px-5 py-4 text-white md:flex-row md:items-center md:justify-between"
    >
      <p className="font-mono text-text1-mobile md:text-text1-desktop">
        <strong className="font-bold">{t.title}.</strong> {t.text}
      </p>
      <div className="flex shrink-0 items-center gap-5">
        <a
          href={siteHref}
          className="satr-hover-underline satr-hover-underline--white font-mono text-text1-mobile text-white no-underline"
        >
          {t.link}
        </a>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="satr-underlined font-mono text-text1-mobile text-white"
          >
            {t.close}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** A centred sheet over a dimmed page. Esc and the backdrop close it. */
export function Modal({
  title,
  children,
  onClose,
  actions,
}: {
  title: string;
  children?: ReactNode;
  onClose?: () => void;
  actions: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  // The latest onClose, read when Esc is pressed. It is a new function on every render of the
  // caller, so it must not be an effect dependency: that moved focus to the sheet on every keystroke.
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    // Focus the sheet once, unless something inside (a field with autoFocus) already has it.
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close.current?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-brand-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative max-h-full w-full max-w-[560px] overflow-y-auto bg-white p-6 outline-none md:p-10"
      >
        <h2 className="font-serif text-h2-mobile md:text-h2-desktop">{title}</h2>
        <div className="mt-4 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
          {children}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
      </div>
    </div>
  );
}

/** A short message that appears over the page and goes away on its own; errors stay until closed. */
export function Toast({
  kind,
  children,
  closeLabel,
  onClose,
  action,
  duration = 5000,
}: {
  kind: 'success' | 'error';
  children: ReactNode;
  closeLabel: string;
  onClose: () => void;
  /** An optional button in the message, e.g. "Undo". */
  action?: { label: string; onClick: () => void };
  /** How long a success message stays, in ms. */
  duration?: number;
}) {
  useEffect(() => {
    if (kind !== 'success') return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [kind, onClose, duration]);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[60] flex justify-end px-4 md:px-10">
      <div
        role={kind === 'error' ? 'alert' : 'status'}
        className={`pointer-events-auto flex max-w-[560px] items-start gap-4 border-2 border-brand-black px-5 py-4 font-ukraine text-text2-mobile md:text-text2-desktop ${
          kind === 'error' ? 'bg-white' : 'bg-brand-accent-blue'
        }`}
      >
        <span aria-hidden className="mt-0.5 font-mono">{kind === 'error' ? '!' : '✓'}</span>
        <span className="min-w-0">{children}</span>
        {action ? (
          <button type="button" onClick={action.onClick} className="shrink-0 font-bold underline underline-offset-4">
            {action.label}
          </button>
        ) : null}
        <button type="button" onClick={onClose} aria-label={closeLabel} className="-my-2 -mr-3 ml-2 grid size-11 shrink-0 place-items-center">
          <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <path d="M3 3l16 16M19 3L3 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** One empty state for the whole cabinet: what is missing, why, what to do. */
export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-2 border-dashed border-brand-black px-6 py-12 text-center md:py-16">
      <h3 className="font-serif text-h2-mobile md:text-h2-desktop">{title}</h3>
      <p className="mx-auto mt-3 max-w-[520px] font-ukraine text-text2-mobile font-light md:text-text2-desktop">
        {text}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function PageTitle({ title, lede }: { title: string; lede?: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-serif text-h1-mobile md:text-h2-desktop lg:text-h1-desktop">{title}</h1>
      {lede ? (
        <p className="mt-4 max-w-[760px] font-ukraine text-text2-mobile font-light md:text-text2-desktop">
          {lede}
        </p>
      ) : null}
    </header>
  );
}

export { Button };

/** The look of every cabinet tab: the side menu and the notification filter share it. */
export const tabClass = (current: boolean) =>
  `flex w-fit items-center gap-3 whitespace-nowrap py-3 font-mono text-h3-mobile text-brand-black no-underline [--satr-ul:2px] md:text-h3-desktop lg:py-2.5 ${
    current ? 'satr-underlined font-bold' : 'satr-hover-underline'
  }`;
