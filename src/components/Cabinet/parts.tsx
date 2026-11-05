import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/Button';
import { cabinetCopy, type CabinetLocale, type ProfileStatus } from './cabinetCopy';

/** Status colours carry meaning only together with the word beside them. */
const STATUS_GROUND: Record<ProfileStatus, string> = {
  draft: 'bg-white',
  pending: 'bg-brand-accent-yellow',
  approved: 'bg-brand-accent-blue',
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
  return <span aria-hidden className="size-3 shrink-0 rounded-full bg-brand-black" />;
}

export function StatusBadge({ status, locale }: { status: ProfileStatus; locale: CabinetLocale }) {
  const t = cabinetCopy[locale].status[status];
  return (
    <span
      className={`inline-flex items-center gap-2 border-2 border-brand-black px-3 py-1 font-mono text-text1-mobile ${STATUS_GROUND[status]}`}
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
  /** On the blue page the blue strip would vanish: it gets the black outline. */
  outlined?: boolean;
  children?: ReactNode;
}) {
  const t = cabinetCopy[locale].status[status];
  return (
    <div
      role="status"
      data-status={status}
      className={`flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-6 ${STATUS_GROUND[status]} ${outlined ? 'border-2 border-brand-black' : ''}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-1 flex md:mt-2">
          <StatusMark status={status} />
        </span>
        <p className="font-mono text-text1-mobile md:text-text1-desktop">
          <strong className="font-bold">{t.label}.</strong> {t.text}
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
            className="font-mono text-text1-mobile text-white underline underline-offset-4"
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
  useEffect(() => {
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-brand-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative w-full max-w-[560px] bg-white p-6 outline-none md:p-10"
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
