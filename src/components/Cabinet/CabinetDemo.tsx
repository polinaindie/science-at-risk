import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { cabinetCopy, type CabinetLocale, type CabinetSection, type ProfileStatus } from './cabinetCopy';
import {
  sampleCourses,
  sampleGrants,
  sampleManyNotifications,
  sampleMatches,
  sampleNotifications,
  emptyProfile,
  sampleProfile,
  type Notification,
  type ProfileData,
} from './cabinetData';
import { CabinetLayout } from './CabinetLayout';
import { SettingsScreen } from './Settings';
import { CollaborationScreen } from './Collaboration';
import { NotificationsScreen } from './Notifications';
import { OpportunitiesScreen } from './Opportunities';
import { ProfileEditForm, ProfileView, SubmitConfirmModal, type SectionId } from './Profile';
import { ApprovedBanner } from './parts';
import { OnboardingWizard } from './Onboarding/OnboardingWizard';

/** Where the demo keeps the half-filled profile, as the backend will. */
const WIZARD_KEY = 'satr-first-fill';

export interface CabinetDemoProps {
  locale?: CabinetLocale;
  section?: CabinetSection;
  status?: ProfileStatus;
  editing?: boolean;
  /** The first sign-in: an empty profile and the fill-in wizard instead of the cabinet. */
  firstLogin?: boolean;
  /** Show the review controls (status, empty states) above the cabinet. */
  controls?: boolean;
  /** Keep the real site header and footer around it. */
  chrome?: boolean;
  onSectionChange?: (section: CabinetSection) => void;
  onLocaleChange?: (locale: CabinetLocale) => void;
}

/**
 * The whole cabinet wired to sample data, so the flow can be walked through:
 * Edit → change something → Send → the sheet → "Under review" → (the team
 * approves) → the banner. The controls strip stands in for the backend.
 */
export function CabinetDemo({
  locale: initialLocale = 'uk',
  section: initialSection = 'profile',
  status: initialStatus = 'approved',
  editing: initialEditing = false,
  firstLogin = false,
  controls = false,
  chrome = true,
  onSectionChange,
  onLocaleChange,
}: CabinetDemoProps) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [section, setSectionState] = useState(initialSection);
  const [status, setStatus] = useState(initialStatus);
  const [editing, setEditing] = useState(initialEditing);
  // The wizard is on until the first send; `wizardKey` starts it over from the welcome screen.
  const [onboarding, setOnboarding] = useState(firstLogin);
  const [wizardKey, setWizardKey] = useState(0);
  // Which part is being changed; none means the whole form.
  const [part, setPart] = useState<SectionId | undefined>();
  const [profile, setProfile] = useState<ProfileData>(sampleProfile[initialLocale]);
  // Saved changes that are not sent yet; several sections can add to them before one send.
  const [unsent, setUnsent] = useState<ProfileData | null>(null);
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [banner, setBanner] = useState(false);
  const [noMatches, setNoMatches] = useState(false);
  const [noGrants, setNoGrants] = useState(false);
  const [failRequest, setFailRequest] = useState(false);
  const [accepted, setAccepted] = useState(false);
  // The copies of requests and team messages; the menu counter and the header count what is unread here.
  const [noteSet, setNoteSet] = useState<'few' | 'many' | 'none'>('few');
  const [notes, setNotes] = useState<Notification[]>(sampleNotifications[initialLocale]);

  const t = cabinetCopy[locale];
  const base = import.meta.env.BASE_URL;

  const setLocale = (next: CabinetLocale) => {
    setLocaleState(next);
    setProfile(sampleProfile[next]);
    setUnsent(null);
    setNoteSet('few');
    setNotes(sampleNotifications[next]);
    onLocaleChange?.(next);
  };
  const go = (next: CabinetSection) => {
    setSectionState(next);
    setEditing(false);
    onSectionChange?.(next);
  };

  const changeStatus = (next: ProfileStatus) => {
    // When the team approves the changes, a message from them lands in the notifications.
    if (next === 'approved' && status !== 'approved')
      setNotes((list) => [
        {
          id: `approved-${list.length}`,
          kind: 'team',
          read: false,
          date: new Date().toISOString(),
          subject: t.approved.title,
          body: t.approved.text,
        },
        ...list,
      ]);
    setStatus(next);
    setBanner(next === 'approved');
    if (next === 'draft') setProfile((p) => ({ ...p, extraFields: (p.extraFields + '; …').replace(/^; /, '') }));
  };

  /** Saving keeps the change on the profile as unsent: nothing reaches the team yet. */
  const save = (next: ProfileData) => {
    setUnsent(next);
    setEditing(false);
  };

  /** Sends every saved change at once, so the team checks them together. */
  const sendAll = () => {
    const next = unsent;
    if (!next) return;
    setSending(true);
    setTimeout(() => {
      setProfile(next);
      // A change saved while the send was on its way stays unsent.
      setUnsent((u) => (u === next ? null : u));
      setSending(false);
      setEditing(false);
      setStatus('pending');
      setBanner(false);
      setConfirmed(true);
    }, 900);
  };

  const discard = () => setUnsent(null);

  const editPart = (p?: SectionId) => {
    setPart(p);
    setEditing(true);
  };
  const changePhoto = (src: string) => save({ ...(unsent ?? profile), imageSrc: src });

  // The badge counts what has not been seen; opening the page resets it, while the cards stay unread.
  const unread = notes.filter((n) => !n.seen && !n.read && n.status !== 'declined').length;
  useEffect(() => {
    if (section === 'notifications' && notes.some((n) => !n.seen))
      setNotes((list) => list.map((n) => (n.seen ? n : { ...n, seen: true })));
  }, [section, notes]);


  // The profile as it is read is on the blue of the site's expert page; forms and other screens stay white.
  const onProfilePage = section === 'profile' && !editing && !onboarding;

  const screen = (() => {
    if (section === 'profile') {
      if (editing)
        return (
          <ProfileEditForm
            key={`${locale}${part}`}
            locale={locale}
            only={part}
            initial={unsent ?? profile}
            onSave={save}
            onCancel={() => setEditing(false)}
          />
        );
      return (
        <div className="space-y-6">
          {banner && status === 'approved' ? (
            <ApprovedBanner locale={locale} onClose={() => setBanner(false)} />
          ) : null}
          <ProfileView
            locale={locale}
            profile={unsent ?? profile}
            status={status}
            onPhoto={changePhoto}
            onEdit={editPart}
            onWithdraw={() => setStatus('draft')}
            unsent={!!unsent}
            sending={sending}
            onSend={sendAll}
            onDiscard={discard}
          />
        </div>
      );
    }
    if (section === 'notifications')
      return (
        <NotificationsScreen
          key={`${locale}${noteSet}`}
          locale={locale}
          notifications={notes}
          onChange={setNotes}
        />
      );
    if (section === 'collaboration')
      return (
        <CollaborationScreen
          key={`${locale}${noMatches}${failRequest}${notes.length}`}
          locale={locale}
          scientists={noMatches ? [] : sampleMatches[locale]}
          // A colleague who agreed (see the notifications) shows their email instead of the button.
          requests={Object.fromEntries(
            sampleMatches[locale]
              .filter((m) =>
                notes.some((n) => n.kind === 'accepted' && n.senderName === m.name),
              )
              .map((m) => [m.id, 'accepted' as const]),
          )}
          failNext={failRequest}
          accepted={accepted}
          onEditKeywords={() => {
            setSectionState('profile');
            setPart('keywords');
            setEditing(true);
          }}
        />
      );
    if (section === 'settings')
      return (
        <SettingsScreen
          key={locale}
          locale={locale}
          email={profile.email ?? ''}
          // Demo: the current password "wrong" is refused; "error" stands for a failed request.
          onChangePassword={async (current) => {
            await new Promise((r) => setTimeout(r, 600));
            if (current === 'error') throw new Error('network');
            return current !== 'wrong';
          }}
        />
      );
    return (
      <OpportunitiesScreen
        key={`${locale}${noGrants}`}
        locale={locale}
        courses={sampleCourses[locale]}
        grants={noGrants ? [] : sampleGrants[locale]}
        tab="courses"
        onEditKeywords={() => {
          setSectionState('profile');
          setPart('keywords');
          setEditing(true);
        }}
      />
    );
  })();

  const chip = (on: boolean, label: string, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`border-2 border-brand-black px-3 py-1 font-mono text-breadcrumbs ${on ? 'bg-brand-black text-white' : 'bg-white'}`}
    >
      {label}
    </button>
  );

  return (
    <div className={onProfilePage ? 'bg-brand-accent-blue' : 'bg-white'}>
      {chrome ? (
        <>
          {/* No wrapper around the header: a sticky element only sticks inside its parent. */}
          <SiteHeader
            account="member"
            progress={1}
            ground={onProfilePage ? 'bg-brand-accent-blue' : 'bg-white'}
            locale={locale === 'uk' ? 'UA' : 'EN'}
            cabinetHref={`${base}cabinet`}
            avatarSrc={onboarding ? '' : profile.imageSrc}
            accountName={onboarding ? '' : locale === 'uk' ? profile.nameUk : profile.nameEn}
            unread={onboarding ? 0 : unread}
          />
          <div className="h-[64px]" aria-hidden />
        </>
      ) : null}

      {controls ? (
        <div className="border-y-2 border-dashed border-brand-black bg-brand-accent-yellow/40 px-4 py-3 xl:px-10">
          <div className="mx-auto flex max-w-[1744px] flex-wrap items-center gap-x-6 gap-y-2 font-mono text-breadcrumbs">
            <strong>{t.demo.label}</strong>
            <span className="flex items-center gap-2">
              {t.demo.status}:
              {(['draft', 'pending', 'approved'] as const).map((s) =>
                chip(status === s, cabinetCopy[locale].status[s].label, () => changeStatus(s)),
              )}
            </span>
            <span className="flex items-center gap-2">
              {t.demo.state}:
              {chip(noMatches, locale === 'uk' ? 'Немає збігів' : 'No matches', () => setNoMatches((v) => !v))}
              {chip(noGrants, locale === 'uk' ? 'Немає грантів' : 'No grants', () => setNoGrants((v) => !v))}
              {chip(failRequest, locale === 'uk' ? 'Запит із помилкою' : 'Request fails', () => setFailRequest((v) => !v))}
              {chip(accepted, t.collab.demoAccepted, () => setAccepted((v) => !v))}
              {chip(noteSet === 'many', locale === 'uk' ? 'Багато сповіщень' : 'Many notifications', () => {
                const next = noteSet === 'many' ? 'few' : 'many';
                setNoteSet(next);
                setNotes(next === 'many' ? sampleManyNotifications[locale] : sampleNotifications[locale]);
              })}
              {chip(false, locale === 'uk' ? 'Надійшло нове' : 'New one arrives', () =>
                // On the notifications page it lands on top without a badge; elsewhere it raises the badge.
                setNotes((list) => [
                  {
                    id: `live-${list.length}-${Date.now()}`,
                    kind: 'team',
                    read: false,
                    seen: section === 'notifications',
                    date: new Date().toISOString(),
                    subject: locale === 'uk' ? 'Нове повідомлення від команди' : 'A new message from the team',
                    body: locale === 'uk' ? 'Це приклад сповіщення, що надійшло щойно.' : 'This is an example of a notification that has just arrived.',
                  },
                  ...list,
                ]),
              )}
              {chip(noteSet === 'none', locale === 'uk' ? 'Немає сповіщень' : 'No notifications', () => {
                const next = noteSet === 'none' ? 'few' : 'none';
                setNoteSet(next);
                setNotes(next === 'none' ? [] : sampleNotifications[locale]);
              })}
            </span>
            <span className="flex items-center gap-2">
              {chip(onboarding, locale === 'uk' ? 'Перший вхід' : 'First sign-in', () => {
                try {
                  localStorage.removeItem(WIZARD_KEY);
                } catch {
                  /* nothing to clear */
                }
                setWizardKey((k) => k + 1);
                setOnboarding(true);
                setSectionState('profile');
              })}
            </span>
            <span className="flex items-center gap-2">
              {chip(locale === 'uk', 'УКР', () => setLocale('uk'))}
              {chip(locale === 'en', 'ENG', () => setLocale('en'))}
            </span>
          </div>
        </div>
      ) : null}

      {onboarding ? (
        <OnboardingWizard
          key={`${locale}${wizardKey}`}
          locale={locale}
          initial={emptyProfile(sampleProfile[locale].email)}
          storageKey={WIZARD_KEY}
          sending={sending}
          onSubmit={(next) => {
            setSending(true);
            setTimeout(() => {
              setProfile(next);
              setUnsent(null);
              setSending(false);
              setOnboarding(false);
              setStatus('pending');
              setConfirmed(true);
              try {
                localStorage.removeItem(WIZARD_KEY);
              } catch {
                /* nothing to clear */
              }
            }, 900);
          }}
        />
      ) : (
      <CabinetLayout
        locale={locale}
        ground={onProfilePage ? 'blue' : 'white'}
        section={section}
        unread={unread}
        status={status}
        hrefFor={(s) => `${base}cabinet/${s}`}
        onNavigate={go}
      >
        {screen}
      </CabinetLayout>
      )}

      {confirmed ? (
        <SubmitConfirmModal locale={locale} onClose={() => setConfirmed(false)} />
      ) : null}

      {chrome && !editing && !onboarding ? <Footer locale={locale} account="member" cabinetHref={`${base}cabinet`} /> : null}
    </div>
  );
}

export { Button };
