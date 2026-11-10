import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { wrapperClass } from '@/components/Layout';
import { Link } from '@/components/Link';
import { cabinetCopy, type CabinetLocale, type OnboardingStepId } from '../cabinetCopy';
import type { ProfileData } from '../cabinetData';
import { CabinetLayout } from '../CabinetLayout';
import { ProfileEditForm, ProfileView, type FormSection, type SectionId } from '../Profile';
import { SquircleDefs } from '@/styles/SquircleDefs';
import { useSquircleClipPath } from '@/styles/useSquircleClipPath';
import { areSectionsValid, type ValidateOptions } from '../validate';

/** Which parts of the one profile form each step shows. The fields themselves are the form's own. */
export const STEP_SECTIONS: Record<OnboardingStepId, FormSection[]> = {
  about: ['photo', 'identity', 'links'],
  work: ['work', 'languages'],
  activity: ['activity', 'area'],
  field: ['keywords'],
  career: ['experience', 'expert'],
  publications: ['publications'],
  more: ['scienceProjects', 'otherProjects', 'societies'],
  recommenders: ['recommenders'],
  review: ['consents'],
};

export const STEP_ORDER: OnboardingStepId[] = [
  'about',
  'work',
  'activity',
  'field',
  'career',
  'publications',
  'more',
  'recommenders',
  'review',
];

/** Where "change" on the preview of the page leads. */
const PART_STEP: Record<SectionId, OnboardingStepId> = {
  photo: 'about',
  name: 'about',
  links: 'about',
  languages: 'work',
  activity: 'activity',
  area: 'activity',
  experience: 'career',
  expert: 'career',
  publications: 'publications',
  keywords: 'field',
  societies: 'more',
  scienceProjects: 'more',
  otherProjects: 'more',
};

interface Saved {
  profile: ProfileData;
  /** -1 is the welcome screen. */
  index: number;
  reached: number;
}

export interface OnboardingWizardProps {
  locale: CabinetLocale;
  /** What the person has so far: nothing but the name and the account's e-mail on the first sign-in. */
  initial: ProfileData;
  /** Start on this step (-1 is the welcome screen). */
  initialStep?: number;
  /** Keep the draft in this browser under this key, so closing the tab loses nothing. The backend does this for real. */
  storageKey?: string;
  /** Called with the whole profile each time something changes: where the real draft is saved. */
  onDraft?: (profile: ProfileData, step: OnboardingStepId | 'welcome') => void;
  /** The person confirmed on the last step. */
  onSubmit?: (profile: ProfileData) => void;
  sending?: boolean;
  /** Show the errors on the step right away: for stories and the design review. */
  showErrors?: boolean;
  /** Wrap in the cabinet frame; false to place it inside a page that has its own. */
  framed?: boolean;
}

/** The number or tick of a step: a squircle, green when done, yellow now, a bare outline still ahead. */
function StepMark({ state, children }: { state: 'done' | 'current' | 'todo'; children: React.ReactNode }) {
  const sq = useSquircleClipPath({ radius: 10, smoothing: 0.9, strokeWidth: state === 'todo' ? 2 : 0 });
  const fill = state === 'done' ? 'bg-brand-accent-green' : state === 'current' ? 'bg-brand-accent-yellow' : 'bg-brand-black';
  return (
    <span aria-hidden className="relative grid size-7 shrink-0 place-items-center text-[12px] leading-none text-brand-black">
      <span ref={sq.ref} className={`absolute inset-0 ${fill}`} style={sq.style} />
      <SquircleDefs clipId={sq.clipId} pathD={sq.pathD} />
      <span className="relative grid place-items-center">{children}</span>
    </span>
  );
}

const hasMore = (p: ProfileData) => p.scienceProjects.length + p.otherProjects.length + p.societies.length > 0;

const readSaved = (key?: string): Saved | null => {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
};

/**
 * The first sign-in: an empty profile and one form to fill. It asks in short
 * steps, a few questions each, and shows on every step the same fields the
 * profile's own "Edit" shows: the wizard adds the order, the progress, the
 * saving and the final check, never a field of its own.
 */
export function OnboardingWizard({
  locale,
  initial,
  initialStep = -1,
  storageKey,
  onDraft,
  onSubmit,
  sending = false,
  showErrors = false,
  framed = true,
}: OnboardingWizardProps) {
  const t = cabinetCopy[locale].onboarding;
  const edit = cabinetCopy[locale].edit;
  const saved = useMemo(() => readSaved(storageKey), [storageKey]);

  const [profile, setProfile] = useState<ProfileData>(saved?.profile ?? initial);
  const [index, setIndex] = useState(saved ? saved.index : initialStep);
  const [reached, setReached] = useState(saved ? saved.reached : Math.max(initialStep, -1));
  const [exited, setExited] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const missingRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const opts: ValidateOptions = {
    otherDegree: edit.options.degree.at(-1) ?? '',
    otherActivity: edit.options.activity[edit.options.activity.length - 1],
  };
  const stepId: OnboardingStepId | null = index >= 0 ? STEP_ORDER[index] : null;
  const valid = (id: OnboardingStepId) => areSectionsValid(profile, STEP_SECTIONS[id], opts);
  const missing = STEP_ORDER.filter((id) => id !== 'review' && !valid(id));

  // Keep the draft: in the browser here, and out to whoever listens.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onDraft?.(profile, stepId ?? 'welcome');
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ profile, index, reached } satisfies Saved));
      } catch {
        /* a blocked store only means no resume */
      }
    }
    setSavedTick(true);
    const timer = setTimeout(() => setSavedTick(false), 2400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, index, reached]);

  // Every step starts at the top, with the heading read out.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [index, exited]);

  const goTo = (n: number) => {
    setBlocked(false);
    setIndex(n);
    setReached((r) => Math.max(r, n));
  };
  const next = () => goTo(Math.min(index + 1, STEP_ORDER.length - 1));

  const submitReview = (next: ProfileData) => {
    setProfile(next);
    if (areSectionsValid(next, ['consents'], opts) && STEP_ORDER.slice(0, -1).every((id) => areSectionsValid(next, STEP_SECTIONS[id], opts))) {
      onSubmit?.(next);
      return;
    }
    setBlocked(true);
    requestAnimationFrame(() => missingRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  };

  const tick = (
    <span
      aria-live="polite"
      className={`font-mono text-breadcrumbs text-brand-muted transition-opacity ${savedTick ? 'opacity-100' : 'opacity-0'}`}
    >
      ✓ {t.saved}
    </span>
  );

  /* ---------------------------------------------------------------- body */

  const body = (() => {
    if (exited)
      return (
        <div className="mx-auto max-w-[640px] text-center">
          <h1 ref={headingRef} tabIndex={-1} className="font-serif text-h1-mobile outline-none md:text-h2-desktop lg:text-h1-desktop">
            {t.exited.title}
          </h1>
          <p className="mt-4 font-ukraine text-text2-mobile font-light md:text-text2-desktop">{t.exited.text}</p>
          <div className="mt-8">
            <Button variant="black" type="button" onClick={() => setExited(false)}>
              {t.exited.back}
            </Button>
          </div>
        </div>
      );

    if (index < 0)
      return (
        <div className="mx-auto w-full max-w-[980px] text-center">
          <p className="m-0 mb-6 font-mono text-text1-mobile text-brand-muted md:text-text1-desktop">Science at Risk</p>
          <h1 ref={headingRef} tabIndex={-1} className="mx-auto max-w-[760px] font-serif text-h1-mobile outline-none md:text-h2-desktop lg:text-h1-desktop">
            {t.welcome.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] font-ukraine text-text2-mobile font-light md:text-text2-desktop">{t.welcome.lede}</p>
          <div className="mt-14 flex flex-col items-center gap-4">
            <Button variant="black" type="button" onClick={() => goTo(0)} className="min-w-[240px] justify-center">
              {t.welcome.start}
            </Button>
          </div>
        </div>
      );

    const id = stepId!;
    const copy = t.steps[id];
    const isReview = id === 'review';
    const heading = (
      <header className="mb-10">
        <div className="mb-3 flex items-center justify-between gap-4 lg:hidden">
          <p className="m-0 font-mono text-text1-mobile text-brand-muted">{t.progress(index + 1, STEP_ORDER.length)}</p>
          {tick}
        </div>
        <h1 ref={headingRef} tabIndex={-1} className="font-serif text-h1-mobile outline-none md:text-h2-desktop lg:text-h1-desktop">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-[760px] font-ukraine text-text2-mobile font-light md:text-text2-desktop">{copy.lede}</p>
        <p className="mt-3 font-mono text-breadcrumbs text-brand-muted">{edit.required}</p>
      </header>
    );

    if (!isReview)
      return (
        <div>
          {heading}
          <div className="max-w-[820px]">
          <ProfileEditForm
            key={`${locale}-${id}`}
            locale={locale}
            initial={profile}
            sections={STEP_SECTIONS[id]}
            showErrors={showErrors}
            onChange={setProfile}
            onSave={(p) => {
              setProfile(p);
              next();
            }}
            step={{
              nextLabel: t.next,
              backLabel: t.back,
              onBack: () => goTo(index - 1),
              exitLabel: t.saveExit,
              onExit: (d) => {
                setProfile(d);
                setExited(true);
              },
            }}
          />
          </div>
        </div>
      );

    // The review: the page as the site will show it, what is still missing, the two confirmations.
    return (
      <div>
        {heading}
        <div ref={missingRef} className={`mb-10 max-w-[820px] border-2 border-brand-black p-5 ${missing.length ? 'bg-brand-accent-yellow' : 'bg-white'}`}>
          <h2 className="m-0 font-mono text-h3-mobile md:text-h3-desktop">
            {missing.length ? t.review.missingTitle : t.review.missingOk}
          </h2>
          {missing.length ? (
            <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0">
              {missing.map((m) => (
                <li key={m} className="flex flex-wrap items-baseline justify-between gap-x-4 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
                  <span>{t.review.missing[m] ?? t.steps[m].title}</span>
                  <Link as="button" onClick={() => goTo(STEP_ORDER.indexOf(m))} className="text-[16px]! leading-[24px]!">
                    {t.review.fix}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {blocked && missing.length ? (
            <p role="alert" className="m-0 mt-4 font-mono text-text1-mobile">
              {t.review.blocked}
            </p>
          ) : null}
        </div>

        <h2 className="mb-4 font-serif text-h2-mobile md:text-h2-desktop">{t.review.previewTitle}</h2>
        <div className="mb-16 bg-brand-accent-blue p-5 md:p-8">
          <ProfileView
            locale={locale}
            profile={profile}
            status="draft"
            onEdit={(part) => goTo(STEP_ORDER.indexOf(part ? PART_STEP[part] : 'about'))}
          />
        </div>

        <div className="max-w-[820px]">
          <h2 className="font-serif text-h2-mobile md:text-h2-desktop">{t.review.consentsTitle}</h2>
          <p className="mb-8 mt-2 font-mono text-breadcrumbs text-brand-muted">{t.review.consentsLede}</p>
          <ProfileEditForm
            key={`${locale}-consents`}
            locale={locale}
            initial={profile}
            sections={['consents']}
            showErrors={showErrors}
            onChange={setProfile}
            onSave={submitReview}
            step={{
              nextLabel: sending ? `${t.review.sending}…` : t.review.send,
              nextDisabled: sending,
              backLabel: t.back,
              onBack: () => goTo(index - 1),
              exitLabel: t.saveExit,
              onExit: (d) => {
                setProfile(d);
                setExited(true);
              },
            }}
          />
        </div>
      </div>
    );
  })();

  /* ------------------------------------------------------------- stepper */

  const stepper =
    index >= 0 && !exited ? (
      <nav aria-label={t.stepperLabel} className="hidden lg:block">
        <p className="m-0 mb-4 font-mono text-text1-mobile text-brand-muted">{t.progress(index + 1, STEP_ORDER.length)}</p>
        <ol className="m-0 flex list-none flex-col gap-1 p-0">
          {STEP_ORDER.map((id, i) => {
            const current = i === index;
            // An optional step counts as done only once something is in it.
            const done = i < reached && id !== 'review' && valid(id) && (id !== 'more' || hasMore(profile));
            const locked = i > reached;
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={locked}
                  aria-current={current ? 'step' : undefined}
                  onClick={() => goTo(i)}
                  className={`flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-0 py-2.5 text-left font-mono text-text1-mobile text-brand-black md:text-text1-desktop disabled:cursor-default disabled:opacity-45 ${current ? 'font-bold' : ''}`}
                >
                  <StepMark state={done ? 'done' : current ? 'current' : 'todo'}>
                    {done ? (
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m2 6.5 2.6 2.6L10 3.5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </StepMark>
                  <span className={current ? 'satr-underlined [--satr-ul:2px]' : ''}>{t.steps[id].title}</span>
                  {done ? <span className="sr-only"> ✓</span> : null}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-6 h-6">{tick}</div>
      </nav>
    ) : null;

  if (!framed) return body;

  // The welcome and the "saved" screens have no steps beside them: they stand alone, in the middle.
  if (index < 0 || exited)
    return (
      <div className={`${wrapperClass} flex min-h-[calc(100dvh-68px)] items-center justify-center py-12`}>{body}</div>
    );

  return (
    <CabinetLayout
      locale={locale}
      section="profile"
      sideNav={stepper ?? <div aria-hidden />}
      hrefFor={() => '#'}
    >
      {body}
    </CabinetLayout>
  );
}
