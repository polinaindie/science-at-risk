import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { cabinetCopy, type CabinetLocale, type CabinetSection, type ProfileStatus } from './cabinetCopy';
import {
  sampleCourses,
  sampleGrants,
  sampleMatches,
  sampleProfile,
  type ProfileData,
} from './cabinetData';
import { CabinetLayout } from './CabinetLayout';
import { CollaborationScreen } from './Collaboration';
import { OpportunitiesScreen } from './Opportunities';
import { ProfileEditForm, ProfileView, SubmitConfirmModal, type SectionId } from './Profile';
import { ApprovedBanner, EmptyState, PageTitle } from './parts';

export interface CabinetDemoProps {
  locale?: CabinetLocale;
  section?: CabinetSection;
  status?: ProfileStatus;
  editing?: boolean;
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
  controls = false,
  chrome = true,
  onSectionChange,
  onLocaleChange,
}: CabinetDemoProps) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [section, setSectionState] = useState(initialSection);
  const [status, setStatus] = useState(initialStatus);
  const [editing, setEditing] = useState(initialEditing);
  // Which part is being changed; none means the whole form.
  const [part, setPart] = useState<SectionId | undefined>();
  const [profile, setProfile] = useState<ProfileData>(sampleProfile[initialLocale]);
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [banner, setBanner] = useState(false);
  const [noMatches, setNoMatches] = useState(false);
  const [noGrants, setNoGrants] = useState(false);
  const [failRequest, setFailRequest] = useState(false);

  const t = cabinetCopy[locale];
  const base = import.meta.env.BASE_URL;

  const setLocale = (next: CabinetLocale) => {
    setLocaleState(next);
    setProfile(sampleProfile[next]);
    onLocaleChange?.(next);
  };
  const go = (next: CabinetSection) => {
    setSectionState(next);
    setEditing(false);
    onSectionChange?.(next);
  };

  const changeStatus = (next: ProfileStatus) => {
    setStatus(next);
    setBanner(next === 'approved');
    if (next === 'draft') setProfile((p) => ({ ...p, extraFields: (p.extraFields + '; …').replace(/^; /, '') }));
  };

  const send = (next: ProfileData) => {
    setSending(true);
    setTimeout(() => {
      setProfile(next);
      setSending(false);
      setEditing(false);
      setStatus('pending');
      setBanner(false);
      setConfirmed(true);
    }, 900);
  };

  const notifications = [
    banner || status === 'approved'
      ? { id: 'a', text: t.approved.title + '. ' + t.approved.text }
      : null,
  ].filter(Boolean) as { id: string; text: string }[];

  // The profile as it is read is on the blue of the site's expert page; forms stay on white.
  const onProfilePage = section === 'profile' && !editing;

  const screen = (() => {
    if (section === 'profile') {
      if (editing)
        return (
          <ProfileEditForm
            key={`${locale}${part}`}
            locale={locale}
            only={part}
            initial={profile}
            sending={sending}
            onSubmit={send}
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
            profile={profile}
            status={status}
            onEdit={(p) => {
              setPart(p);
              setEditing(true);
            }}
            onWithdraw={() => setStatus('draft')}
            onPhoto={(src) => send({ ...profile, imageSrc: src })}
          />
        </div>
      );
    }
    if (section === 'notifications')
      return (
        <div>
          <PageTitle title={t.notifications.title} />
          {notifications.length ? (
            <ul className="m-0 list-none border-t-2 border-brand-black p-0">
              {notifications.map((n) => (
                <li key={n.id} className="border-b-2 border-brand-black py-5 font-ukraine text-text2-desktop font-light">
                  {n.text}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title={t.notifications.empty} text="" />
          )}
        </div>
      );
    if (section === 'collaboration')
      return (
        <CollaborationScreen
          key={`${locale}${noMatches}${failRequest}`}
          locale={locale}
          scientists={noMatches ? [] : sampleMatches[locale]}
          failNext={failRequest}
          onEditKeywords={() => {
            setSectionState('profile');
            setPart('keywords');
            setEditing(true);
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
            avatarSrc={profile.imageSrc}
            accountName={locale === 'uk' ? profile.nameUk : profile.nameEn}
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
            </span>
            <span className="flex items-center gap-2">
              {chip(locale === 'uk', 'УКР', () => setLocale('uk'))}
              {chip(locale === 'en', 'ENG', () => setLocale('en'))}
            </span>
          </div>
        </div>
      ) : null}

      <CabinetLayout
        locale={locale}
        name={onProfilePage ? undefined : locale === 'uk' ? profile.nameUk : profile.nameEn}
        ground={onProfilePage ? 'blue' : 'white'}
        section={section}
        unread={status === 'approved' ? 3 : 2}
        marked={['collaboration', 'opportunities']}
        status={status}
        hrefFor={(s) => `${base}cabinet/${s}`}
        onNavigate={go}
      >
        {screen}
      </CabinetLayout>

      {confirmed ? (
        <SubmitConfirmModal locale={locale} onClose={() => setConfirmed(false)} />
      ) : null}

      {chrome && !editing ? <Footer account="member" cabinetHref={`${base}cabinet`} /> : null}
    </div>
  );
}

export { Button };
