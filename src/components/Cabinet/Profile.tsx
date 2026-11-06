import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { FieldSelect } from '@/components/Select';
import { Tag } from '@/components/Tag';
import { TextField } from '@/components/TextField';
import { cabinetCopy, type CabinetLocale, type ProfileStatus } from './cabinetCopy';
import {
  emptyExperience,
  emptyProject,
  emptyPublication,
  type ExperienceItem,
  type Project,
  type ProfileData,
  type Publication,
} from './cabinetData';
import {
  formatCitation,
  formatPublication,
  isExperienceEmpty,
  isProjectEmpty,
  isLatinName,
  isProfileLink,
  isPublicationEmpty,
  isUrl,
  isYear,
} from './format';
import { PhotoDialog } from './PhotoDialog';
import { OTHER_FIELD, SpecialtyPicker } from './SpecialtyPicker';
import { FormattedText } from './FormattedText';
import { isRichEmpty } from './formatText';
import { Modal, StatusStrip } from './parts';
import { societies, societyBySlug } from './societies';

const H4 = 'font-serif text-[22px] font-normal leading-[30px] tracking-[-0.02em] md:text-[28px] md:leading-[36px]';
/** The site's text on an expert's page: mono, 18/26. */
const SITE_P = 'font-mono text-[16px] leading-[26px] md:text-[18px]';
/** Small print in the site's aside and project cards: e-Ukraine light, 16. */
const SITE_SMALL = 'font-ukraine text-[16px] font-light leading-[19px]';
const PARA = 'font-ukraine text-text2-mobile font-light md:text-text2-desktop';

/* ------------------------------------------------------------------ view */

export interface ProfileViewProps {
  locale: CabinetLocale;
  profile: ProfileData;
  status: ProfileStatus;
  /** Called with the part to change, or with nothing for the whole form. */
  onEdit?: (part?: SectionId) => void;
  onWithdraw?: () => void;
  /** The new photo, from the “Change photo” dialog. */
  onPhoto?: (src: string) => void;
  /** Saved changes that are not sent yet: the strip offers to send them all at once. */
  unsent?: boolean;
  /** The send is on its way. */
  sending?: boolean;
  onSend?: () => void;
  onDiscard?: () => void;
  siteHref?: string;
}

/** The pieces of the profile that can be changed on their own, as the site shows them. */
export type SectionId =
  | 'photo'
  | 'links'
  | 'name'
  | 'languages'
  | 'activity'
  | 'area'
  | 'experience'
  | 'expert'
  | 'publications'
  | 'keywords'
  | 'societies'
  | 'scienceProjects'
  | 'otherProjects';

function Section({
  title,
  action,
  empty = false,
  children,
}: {
  title: string;
  action?: ReactNode;
  /** Nothing filled in: the block is not shown at all, as on the site. */
  empty?: boolean;
  children: ReactNode;
}) {
  if (empty) return null;
  return (
    <>
      <div className="mt-12 mb-5">
        <h4 className={H4}>{title}</h4>
      </div>
      {children}
      {action ? <div className="mt-4">{action}</div> : null}
    </>
  );
}

/** A career as a timeline: the year in its own column, the post, then the place. */
const ExperienceList = ({ items }: { items: ExperienceItem[] }) => (
  <ul className="m-0 mt-2 list-none space-y-6 p-0 font-mono">
    {items
      .filter((x) => !isExperienceEmpty(x))
      .map((x, i) => (
        <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-x-2 md:grid-cols-[5rem_1fr] md:gap-x-3">
          <span className="pt-[2px] text-[14px] leading-[22px] md:pt-[3px] md:text-[16px]">{x.year}</span>
          <span>
            <span className="block font-ukraine text-[16px] font-medium leading-[24px] md:text-[18px] md:leading-[26px]">{x.position.charAt(0).toUpperCase() + x.position.slice(1)}</span>
            {x.place ? <span className="mt-1 block text-[14px] leading-[22px] md:text-[15px]">{x.place}</span> : null}
          </span>
        </li>
      ))}
  </ul>
);

/**
 * The profile as the site shows it — the same aside, the same headings, the
 * same tags — with the status on top and one button: Edit. Saved changes wait
 * here as unsent, so several parts can be changed before one send. The phone
 * and the email are not part of it: the site never publishes them.
 */
export function ProfileView({
  locale,
  profile,
  status,
  onEdit,
  onWithdraw,
  onPhoto,
  unsent = false,
  sending = false,
  onSend,
  onDiscard,
  siteHref = '#',
}: ProfileViewProps) {
  const [photoOpen, setPhotoOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const t = cabinetCopy[locale].profile;
  const pub = cabinetCopy[locale].edit.publication;
  const locked = status === 'pending';
  /** Unsent changes show in the strip as a draft, with the send and discard beside it. */
  const unsentNow = unsent && !locked;
  /** "Change" beside a piece of the profile; "Add" when that piece is still empty. */
  const change = (id: SectionId, part: string, filled = true) =>
    locked || !onEdit ? null : (
      <button
        type="button"
        onClick={() => onEdit(id)}
        aria-label={`${filled ? t.change : t.add}: ${part}`}
        className="inline-flex items-center gap-1.5 border-2 border-brand-black bg-white px-2.5 py-0.5 font-mono text-[14px] leading-[20px] tracking-[-0.03em] hover:bg-brand-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
      >
        <svg aria-hidden width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 14l.8-3.4L11.4 2l2.6 2.6-8.6 8.6L2 14zM9.6 3.8l2.6 2.6" />
        </svg>
        {filled ? t.change : t.add}
      </button>
    );
  const sec = (id: SectionId) => t.sections[
    ({ activity: 'activity', area: 'area', experience: 'experience', expert: 'expert', publications: 'publications', keywords: 'keywords', societies: 'societies', scienceProjects: 'projects', otherProjects: 'otherProjects' } as Record<string, keyof typeof t.sections>)[id]
  ].replace(/:$/, '').toLowerCase();
  const name = locale === 'uk' ? profile.nameUk : profile.nameEn;
  const otherDegree = profile.degree === cabinetCopy[locale].edit.options.degree.at(-1);
  const position = [otherDegree && profile.degreeOther ? profile.degreeOther : profile.degree, profile.rank]
    .filter((x) => x && x !== cabinetCopy[locale].edit.options.rank[0])
    .join(', ');
  const links = [
    profile.orcid && { label: 'Orcid', href: profile.orcid },
    profile.linkedin && { label: 'LinkedIn', href: profile.linkedin },
    profile.facebook && { label: 'Facebook', href: profile.facebook },
  ].filter(Boolean) as { label: string; href: string }[];
  const keywords = [
    profile.field === OTHER_FIELD ? '' : profile.field,
    ...profile.specialties,
    ...(profile.field === OTHER_FIELD ? profile.extraFields.split(/[;,]/) : []),
    ...profile.extraKnowledge.flatMap((k) =>
      k.field === OTHER_FIELD ? (k.other ?? '').split(/[;,]/) : [k.field, ...k.specialties],
    ),
    ...profile.activities,
    ...profile.extraActivities.split(/[;,]/),
  ]
    .map((k) => k.trim())
    .filter((k, i, all) => k && all.indexOf(k) === i);

  return (
    <div className={unsentNow ? 'pb-28' : undefined}>
      <StatusStrip status={unsentNow ? 'draft' : status} locale={locale} outlined>
        {status === 'approved' ? (
          <Link href={siteHref} className="self-center text-[16px]! leading-[24px]!">
            {t.openOnSite}
          </Link>
        ) : null}
        {status === 'pending' && onWithdraw ? (
          <Link as="button" onClick={onWithdraw} className="self-center text-[16px]! leading-[24px]!">
            {t.withdraw}
          </Link>
        ) : null}
      </StatusStrip>
      {discardOpen ? (
        <Modal
          title={t.unsent.discardTitle}
          onClose={() => setDiscardOpen(false)}
          actions={
            <>
              <Button variant="black" type="button" onClick={() => setDiscardOpen(false)}>
                {t.unsent.discardKeep}
              </Button>
              <Button
                variant="bordered"
                type="button"
                onClick={() => {
                  setDiscardOpen(false);
                  onDiscard?.();
                }}
              >
                {t.unsent.discardConfirm}
              </Button>
            </>
          }
        >
          {t.unsent.discardText}
        </Modal>
      ) : null}

      {/* Fixed to the bottom, as on the edit page: the unsent changes and the two answers. */}
      {unsentNow ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-brand-black bg-white">
          <div className="mx-auto flex max-w-[1744px] flex-wrap items-center justify-between gap-3 px-4 py-3 xl:px-10">
            <p className="font-mono text-text1-mobile" aria-live="polite">
              <span aria-hidden className="mr-2 inline-block size-3 border-2 border-brand-black bg-brand-accent-yellow align-middle" />
              {t.unsent.bar}
            </p>
            <div className="flex gap-3">
              {onDiscard ? (
                <Button variant="bordered" type="button" onClick={() => setDiscardOpen(true)}>
                  {t.unsent.discard}
                </Button>
              ) : null}
              {onSend ? (
                <Button
                  variant="black"
                  type="button"
                  onClick={onSend}
                  disabled={sending}
                  aria-busy={sending || undefined}
                  className="disabled:opacity-60"
                >
                  {sending ? `${cabinetCopy[locale].edit.bar.sending}…` : t.unsent.send}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* The page of an expert on the site, piece for piece; what is added is the way to change it. */}
      <div className="mt-8 grid gap-6 md:grid-cols-[5fr_7fr] lg:grid-cols-[4fr_8fr]">
        <aside>
          {(() => {
            const photo = profile.imageSrc ? (
              <img src={profile.imageSrc} alt="" className="aspect-square w-full object-cover" />
            ) : (
              <div aria-hidden className="aspect-square w-full bg-white/60" />
            );
            if (locked || !onPhoto) return photo;
            return (
              <button
                type="button"
                onClick={() => setPhotoOpen(true)}
                className="group relative block w-full cursor-pointer p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
              >
                {photo}
                <span className="absolute inset-0 flex items-end justify-center bg-brand-black/45 p-4 font-mono text-[16px] leading-[24px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:bg-transparent [@media(hover:none)]:opacity-100">
                  <span className="[@media(hover:none)]:bg-brand-black/70 [@media(hover:none)]:px-2">
                    {cabinetCopy[locale].photoDialog.title}
                  </span>
                </span>
              </button>
            );
          })()}
          {photoOpen ? (
            <PhotoDialog
              locale={locale}
              current={profile.imageSrc}
              onClose={() => setPhotoOpen(false)}
              onSave={(src) => {
                setPhotoOpen(false);
                onPhoto?.(src);
              }}
            />
          ) : null}

          {profile.languages ? (
            <>
              <h4 className="mt-8 mb-1 font-mono text-[14px] leading-[20px] tracking-[-0.03em]">
                {t.aside.languages}
              </h4>
              <p className={`m-0 ${SITE_SMALL}`}>{profile.languages}</p>
              <div className="mt-4">
                {change('languages', t.aside.languages.replace(/:$/, '').toLowerCase())}
              </div>
            </>
          ) : null}

          {links.length ? (
            <ul className="m-0 mt-6 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="satr-hover-underline font-mono text-[15px] leading-[18px] tracking-[-0.03em]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {links.length ? <div className="mt-4">{change('links', t.parts.links)}</div> : null}
        </aside>

        <div className="min-w-0">
          <h1 className="m-0 mb-4 font-serif text-[32px] leading-[38px] tracking-[-0.02em] md:text-[48px] md:leading-[54px]">
            {name}
          </h1>
          {position ? (
            <p className="m-0 font-ukraine text-[16px] font-medium leading-[24px] md:text-[18px] md:leading-[26px]">
              {position.charAt(0).toUpperCase() + position.slice(1)}
            </p>
          ) : null}
          {profile.institution ? (
            <p className="m-0 mt-1 font-mono text-[14px] leading-[22px] md:text-[15px]">{profile.institution}</p>
          ) : null}
          <div className="mt-4">{change('name', t.parts.name)}</div>

          <Section title={t.sections.activity} empty={isRichEmpty(profile.activity)} action={change('activity', sec('activity'))}>
            <FormattedText text={profile.activity} className={SITE_P} />
          </Section>
          <Section title={t.sections.area} empty={isRichEmpty(profile.researchArea)} action={change('area', sec('area'))}>
            <FormattedText text={profile.researchArea} className={SITE_P} />
          </Section>
          <Section
            title={t.sections.experience}
            empty={profile.experience.every(isExperienceEmpty)}
            action={change('experience', sec('experience'))}
          >
            <ExperienceList items={profile.experience} />
          </Section>
          <Section
            title={t.sections.expert}
            empty={profile.expertExperience.every(isExperienceEmpty)}
            action={change('expert', sec('expert'))}
          >
            <ExperienceList items={profile.expertExperience} />
          </Section>
          <Section
            title={t.sections.publications}
            empty={profile.publications.every(isPublicationEmpty)}
            action={change('publications', sec('publications'))}
          >
            <ul className="m-0 mt-2 list-none p-0">
              {profile.publications
                .filter((x) => !isPublicationEmpty(x))
                .map((x) => (
                  <li key={formatPublication(x)} className="border-b-2 border-brand-black py-6 first:border-t-2">
                    <div>
                      <h3 className="m-0 font-serif text-[26px] font-normal leading-[34px] tracking-[-0.02em] md:text-[34px] md:leading-[42px]">
                        {x.title}
                      </h3>
                    </div>
                    {x.authors || x.journal || x.year || x.pages ? (
                      <p className={`m-0 mt-2 ${SITE_SMALL}`}>{formatCitation(x)}</p>
                    ) : null}
                    {x.role ? (
                      <p className={`m-0 mt-2.5 ${SITE_SMALL}`}>
                        {pub.roleIs}: {pub.roles[x.role]}
                      </p>
                    ) : null}
                  </li>
                ))}
            </ul>
          </Section>
          <Section title={t.sections.keywords} empty={keywords.length === 0} action={change('keywords', sec('keywords'))}>
            <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
              {keywords.map((k) => (
                <li key={k}>
                  <Tag as="span" className="text-[16px]! leading-[22px]! tracking-[-0.03em]!">{k}</Tag>
                </li>
              ))}
            </ul>
          </Section>
          {(() => {
            const mine = profile.societies.map(societyBySlug).filter((x): x is NonNullable<typeof x> => !!x);
            return (
              <Section title={t.sections.societies} action={change('societies', sec('societies'), mine.length > 0)}>
                {mine.length ? (
                  <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
                    {mine.map((x) => (
                      <li key={x.slug}>
                        <a
                          href={`${import.meta.env.BASE_URL}society/${x.slug}.html`}
                          className="satr-hover-underline font-mono text-[15px] leading-[22px] tracking-[-0.03em]"
                        >
                          {x.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Section>
            );
          })()}
          {(['scienceProjects', 'otherProjects'] as const).map((key) => {
            const list = profile[key].filter((x) => !isProjectEmpty(x));
            return (
              <Section
                key={key}
                title={t.sections[key === 'scienceProjects' ? 'projects' : 'otherProjects']}
                empty={list.length === 0}
                action={change(key, sec(key))}
              >
                {(
                  <ul className="m-0 list-none space-y-6 p-0">
                    {list.map((x) => (
                      <li key={x.title + x.role}>
                        <div>
                          <h3 className="m-0 font-serif text-[26px] font-normal leading-[34px] tracking-[-0.02em] md:text-[34px] md:leading-[42px]">
                            {x.title}
                          </h3>
                        </div>
                        {x.description ? (
                          <p className={`m-0 mt-2 ${SITE_SMALL}`}>{x.description}</p>
                        ) : null}
                        {x.role ? (
                          <p className={`m-0 mt-2 ${SITE_SMALL}`}>
                            {pub.roleIs}: {x.role}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ edit */

export interface ProfileEditFormProps {
  locale: CabinetLocale;
  initial: ProfileData;
  /** Show only this part of the form: the one the person chose to change. */
  only?: SectionId;
  /** Show the form already failing — for stories and the design review. */
  showErrors?: boolean;
  /** Open with the "leave without saving?" sheet showing. */
  confirmingCancel?: boolean;
  /** Keeps the valid answers as unsent changes; nothing is sent from here. */
  onSave?: (next: ProfileData) => void;
  onCancel?: () => void;
}

/** Two columns where the answers are short; one where they are not. */
const PAIR = 'grid grid-cols-1 gap-x-8 gap-y-12 min-[480px]:grid-cols-2';

function Group({
  title,
  note,
  bare = false,
  children,
}: {
  title: string;
  note?: string;
  /** Alone on the page: no heading, the page title already says what it is. */
  bare?: boolean;
  children: ReactNode;
}) {
  if (bare) return <div className="mt-12 space-y-12 first:mt-0">{children}</div>;
  return (
    <fieldset className="m-0 mt-16 min-w-0 border-0 p-0 first:mt-0">
      <legend className="p-0 font-serif text-h2-mobile md:text-h2-desktop">{title}</legend>
      {note ? <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{note}</p> : null}
      <div className="mt-8 space-y-12">{children}</div>
    </fieldset>
  );
}

const REQUIRED: (keyof ProfileData)[] = [
  'nameUk',
  'nameEn',
  'institution',
  'languages',
  'activity',
  'researchArea',
  'field',
];

/**
 * The registration form again, with the answers in it: five groups, in the
 * order the scientist first met them. Some answers are changed, some are added
 * to; the e-mail comes from the account and stays as it is. The bar fixed to
 * the bottom holds the two buttons. Save keeps the changes on the profile as
 * unsent; they go to the team together, from the profile.
 */
export function ProfileEditForm({
  locale,
  initial,
  only,
  showErrors = false,
  confirmingCancel = false,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const t = cabinetCopy[locale].edit;
  const f = t.fields;
  const pub = t.publication;
  const [draft, setDraft] = useState<ProfileData>(initial);
  const [tried, setTried] = useState(showErrors);
  const [leaving, setLeaving] = useState(confirmingCancel);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [removing, setRemoving] = useState<'orcid' | 'linkedin' | 'facebook' | null>(null);
  // Publications 2 and 3 appear on request; so do activities beyond the three.
  const [actCount, setActCount] = useState(Math.max(1, initial.activities.filter(Boolean).length));
  const [pubCount, setPubCount] = useState(
    Math.max(1, initial.publications.filter((p) => !isPublicationEmpty(p)).length),
  );
  // A format message waits until the person has left the field; submitting shows them all.
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [nameStripped, setNameStripped] = useState(false);
  const touch = (key: string) => setTouched((s) => (s[key] ? s : { ...s, [key]: true }));
  const shown = (key: string) => tried || !!touched[key];

  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const otherDegree = draft.degree === t.options.degree.at(-1);
  const missing = (key: keyof ProfileData) =>
    tried &&
    (REQUIRED.includes(key) || (key === 'degreeOther' && otherDegree)) &&
    !String(draft[key]).trim();
  const pubAt = (i: number): Publication => draft.publications[i] ?? emptyPublication;
  const setPub = (i: number, patch: Partial<Publication>) =>
    setDraft((d) => {
      const next = [...d.publications];
      while (next.length <= i) next.push({ ...emptyPublication });
      next[i] = { ...next[i], ...patch };
      return { ...d, publications: next };
    });
  const removePub = (i: number) => {
    setDraft((d) => ({ ...d, publications: d.publications.filter((_, k) => k !== i) }));
    setPubCount((n) => Math.max(1, n - 1));
  };

  /** What is wrong with one publication, by field. Empty extra cards are left alone. */
  const pubIssues = (i: number): Partial<Record<keyof Publication, string>> => {
    const p = pubAt(i);
    const out: Partial<Record<keyof Publication, string>> = {};
    if (i > 0 && isPublicationEmpty(p)) return out;
    (['title', 'authors', 'journal'] as const).forEach((k) => {
      if (!p[k].trim()) out[k] = t.errors.required;
    });
    if (!p.year.trim()) out.year = t.errors.required;
    else if (!isYear(p.year)) out.year = t.errors.year;
    if (p.url.trim() && !isUrl(p.url)) out.url = t.errors.url;
    return out;
  };
  const anyPubIssue = () => Array.from({ length: pubCount }, (_, i) => pubIssues(i)).some((o) => Object.keys(o).length);

  /** The first row needs both parts; a later row needs both only once one is filled. */
  const expIssues = (key: 'experience' | 'expertExperience', i: number) => {
    const r = draft[key][i] ?? emptyExperience;
    const out: Partial<Record<keyof ExperienceItem, string>> = {};
    if (i > 0 && isExperienceEmpty(r)) return out;
    if (!r.year.trim()) out.year = t.errors.required;
    if (!r.position.trim()) out.position = t.errors.required;
    if (!r.place.trim()) out.place = t.errors.required;
    return out;
  };
  const anyExpIssue = () =>
    (['experience', 'expertExperience'] as const).some((key) =>
      Array.from({ length: Math.max(1, draft[key].length) }, (_, i) => expIssues(key, i)).some(
        (o) => Object.keys(o).length,
      ),
    );

  /** A project that was started needs a name, a short description and the person's role. */
  const projIssues = (key: 'scienceProjects' | 'otherProjects', i: number) => {
    const r = draft[key][i] ?? emptyProject;
    const out: Partial<Record<keyof Project, string>> = {};
    if (isProjectEmpty(r)) return out;
    (['title', 'description', 'role'] as const).forEach((k) => {
      if (!r[k].trim()) out[k] = t.errors.required;
    });
    if (r.url.trim() && !isUrl(r.url)) out.url = t.errors.url;
    return out;
  };
  const anyProjIssue = () =>
    (['scienceProjects', 'otherProjects'] as const).some((key) =>
      draft[key].some((_, i) => Object.keys(projIssues(key, i)).length),
    );

  /** Format checks for the fields that have one; the required check stays separate. */
  const formatIssue = (key: keyof ProfileData): string | undefined => {
    const v = String(draft[key] ?? '');
    if (!v.trim()) return undefined;
    if (key === 'nameEn' && !isLatinName(v)) return t.errors.nameEn;
    if ((key === 'orcid' || key === 'linkedin' || key === 'facebook') && !isProfileLink(key, v))
      return t.errors[key];
    return undefined;
  };
  const actMissing = (i: number) => tried && !draft.activities[i];

  const err = (text?: string | false) =>
    text ? (
      <p role="alert" className="mt-2 bg-brand-accent-yellow px-3 py-2 font-mono text-text1-mobile">
        {text}
      </p>
    ) : null;

  const star = (key: keyof ProfileData) =>
    REQUIRED.includes(key) || (key === 'degreeOther' && otherDegree) ? ' *' : '';

  /** A hint shows inside the field once it is focused; a `note` stays on the page. */
  const text = (key: keyof ProfileData, label: string, hint?: string, note?: string, extra: object = {}) => (
    <div>
      <TextField
        label={label + star(key)}
        value={String(draft[key])}
        onChange={(e) => set(key, e.currentTarget.value as never)}
        aria-invalid={missing(key) || (shown(key) && !!formatIssue(key)) || undefined}
        placeholder={hint}
        className="max-w-none"
        onBlur={() => touch(key)}
        {...extra}
      />
      {note ? <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{note}</p> : null}
      {err(missing(key) ? t.errors.required : shown(key) && formatIssue(key))}
    </div>
  );

  const linkField = (key: 'orcid' | 'linkedin' | 'facebook', label: string, hint: string) => (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">{text(key, label, hint, undefined, { type: 'url' })}</div>
      {draft[key] ? (
        <button
          type="button"
          onClick={() => setRemoving(key)}
          aria-label={`${t.linkRemove.aria}: ${label}`}
          className="mb-1 flex size-9 shrink-0 items-center justify-center border-2 border-brand-black bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
        >
          <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 4h12M6 4V2.5h4V4M3.5 4l.7 9.5h7.6L12.5 4M6.5 7v4M9.5 7v4" />
          </svg>
        </button>
      ) : null}
    </div>
  );

  const area = (key: 'activity' | 'researchArea', label: string, hint?: string, extra: object = {}) => (
    <div>
      <TextField
        multiline
        autoGrow
        rows={3}
        label={label + star(key)}
        value={String(draft[key])}
        onChange={(e) => set(key, e.currentTarget.value as never)}
        aria-invalid={missing(key) || undefined}
        placeholder={hint}
        className="max-w-none"
        {...extra}
      />
      {err(missing(key) && t.errors.required)}
    </div>
  );

  /** Years and places as rows. The first row is required; a half-filled row names what is missing. */
  const experienceRows = (key: 'experience' | 'expertExperience', title: string, addLabel: string) => {
    const list = draft[key];
    const rows: ExperienceItem[] = list.length ? list : [{ ...emptyExperience }];
    const change = (i: number, patch: Partial<ExperienceItem>) => {
      const next = rows.map((r) => ({ ...r }));
      next[i] = { ...next[i], ...patch };
      set(key, next);
    };
    return (
      <div className="space-y-6">
        <h3 className="font-mono text-h3-mobile md:text-h3-desktop">{title} *</h3>
        {rows.map((r, i) => {
          const issue = expIssues(key, i);
          const k = (part: string) => `${key}${i}.${part}`;
          return (
            <div key={i}>
              <div className="grid grid-cols-1 items-start gap-x-6 gap-y-6 min-[560px]:grid-cols-[100px_1fr] lg:grid-cols-[100px_1fr_1fr]">
                {(['year', 'position', 'place'] as const).map((part) => (
                  <div key={part} className={part === 'place' ? 'min-[560px]:col-span-2 lg:col-span-1' : undefined}>
                    <TextField
                      label={t.experience[part] + (i === 0 ? ' *' : '')}
                      value={r[part]}
                      placeholder={t.experience[part === 'year' ? 'yearHint' : part === 'position' ? 'positionHint' : 'placeHint']}
                      onChange={(e) => change(i, { [part]: e.currentTarget.value })}
                      // A long line scrolls sideways; coming into the field puts the caret
                      // at the end, where the person goes on writing.
                      onFocus={(e) => {
                        const el = e.currentTarget;
                        requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
                      }}
                      onBlur={() => touch(k(part))}
                      aria-invalid={(shown(k(part)) && !!issue[part]) || undefined}
                      className="max-w-none"
                    />
                    {err(shown(k(part)) && issue[part])}
                  </div>
                ))}
              </div>
              {i > 0 ? (
                <div className="mt-3">
                  <Link
                    as="button"
                    onClick={() => set(key, rows.filter((_, n) => n !== i))}
                    className="text-[16px]! leading-[24px]!"
                  >
                    {pub.remove}
                  </Link>
                </div>
              ) : null}
            </div>
          );
        })}
        <div>
          <Button variant="bordered" type="button" onClick={() => set(key, [...rows, { ...emptyExperience }])}>
            + {addLabel}
          </Button>
        </div>
      </div>
    );
  };

  /** Projects as cards: nothing is required until the first one is added. */
  const projectCards = (key: 'scienceProjects' | 'otherProjects', title: string, addLabel: string) => {
    const rows = draft[key];
    const change = (i: number, patch: Partial<Project>) =>
      set(key, rows.map((r, n) => (n === i ? { ...r, ...patch } : r)));
    const pr = t.project;
    return (
      <div className="space-y-12">
        <h3 className="font-mono text-h3-mobile md:text-h3-desktop">{title}</h3>
        {rows.map((r, i) => {
          const issue = projIssues(key, i);
          const k = (part: string) => `${key}${i}.${part}`;
          const field = (part: 'title' | 'description' | 'role' | 'url') => (
            <div>
              {part === 'description' ? (
                <TextField
                  multiline
                  autoGrow
                  rows={1}
                  label={pr.fields[part] + ' *'}
                  value={r[part]}
                  placeholder={pr.hints[part]}
                  onChange={(e) => change(i, { [part]: e.currentTarget.value })}
                  onBlur={() => touch(k(part))}
                  aria-invalid={(shown(k(part)) && !!issue[part]) || undefined}
                  className="max-w-none"
                />
              ) : (
                <TextField
                  label={pr.fields[part] + (part === 'url' ? '' : ' *')}
                  value={r[part]}
                  placeholder={part === 'url' ? 'https://' : pr.hints[part]}
                  type={part === 'url' ? 'url' : undefined}
                  onChange={(e) => change(i, { [part]: e.currentTarget.value })}
                  onBlur={() => touch(k(part))}
                  aria-invalid={(shown(k(part)) && !!issue[part]) || undefined}
                  className="max-w-none"
                />
              )}
              {err(shown(k(part)) && issue[part])}
            </div>
          );
          return (
            <div key={i} className="space-y-12">
              {field('title')}
              {field('description')}
              {field('role')}
              {field('url')}
              <Link
                as="button"
                onClick={() => set(key, rows.filter((_, n) => n !== i))}
                className="text-[16px]! leading-[24px]!"
              >
                {pub.remove}
              </Link>
            </div>
          );
        })}
        <div>
          <Button variant="bordered" type="button" onClick={() => set(key, [...rows, { ...emptyProject }])}>
            + {addLabel}
          </Button>
        </div>
      </div>
    );
  };

  const options = (list: string[]) => list.map((o) => ({ value: o, label: o }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    const bad =
      REQUIRED.some((k) => !String(draft[k]).trim()) ||
      (draft.field === OTHER_FIELD ? !draft.extraFields.trim() : draft.specialties.length === 0) ||
      (otherDegree && !draft.degreeOther.trim()) ||
      anyPubIssue() ||
      anyExpIssue() ||
      anyProjIssue() ||
      draft.activities.includes(t.options.activity[t.options.activity.length - 1]) ||
      (['nameEn', 'orcid', 'linkedin', 'facebook'] as const).some((k) => formatIssue(k));
    if (bad || !draft.activities[0]) return;
    onSave?.({
      ...draft,
      extraKnowledge: draft.extraKnowledge.filter((k) => (k.field === OTHER_FIELD ? k.other?.trim() : k.field || k.specialties.length)),
      publications: draft.publications.filter((p) => !isPublicationEmpty(p)),
      experience: draft.experience.filter((r) => !isExperienceEmpty(r)),
      expertExperience: draft.expertExperience.filter((r) => !isExperienceEmpty(r)),
      activities: draft.activities.filter(Boolean),
      scienceProjects: draft.scienceProjects.filter((r) => !isProjectEmpty(r)),
      otherProjects: draft.otherProjects.filter((r) => !isProjectEmpty(r)),
    });
  };

  const partName = only
    ? (
        {
          photo: cabinetCopy[locale].profile.parts.photo,
          links: cabinetCopy[locale].profile.parts.links,
          name: cabinetCopy[locale].profile.parts.name,
          languages: f.languages,
          activity: f.activity,
          area: f.area,
          experience: f.experience,
          expert: f.expert,
          publications: t.groups.publications.replace(/ \(.*\)$/, ''),
          keywords: t.groups.keywords,
          societies: t.groups.societies,
          scienceProjects: f.scienceProjects,
          otherProjects: f.otherProjects,
        } as Record<SectionId, string>
      )[only].toLowerCase()
    : '';
  const on = (id: SectionId) => !only || only === id;
  const cancel = () => (dirty ? setLeaving(true) : onCancel?.());

  return (
    <form onSubmit={submit} noValidate className="pb-28">
      <h1 className="font-serif text-h2-mobile md:text-h2-desktop">
        {only ? `${t.partTitle}: ${partName}` : t.title}
      </h1>
      {only ? null : <p className={`mt-3 max-w-[760px] ${PARA}`}>{t.lede}</p>}
      <p className="mt-2 mb-10 font-mono text-breadcrumbs text-brand-muted">{t.required}</p>

      <div>
        {on('photo') ? (
          <Group bare={!!only} title={t.groups.photo}>
          <div className="flex items-center gap-5">
            {draft.imageSrc ? (
              <img src={draft.imageSrc} alt="" className="size-[96px] shrink-0 object-cover" />
            ) : (
              <div aria-hidden className="size-[96px] shrink-0 bg-white/60" />
            )}
            <div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Button variant="bordered" type="button" onClick={() => setPhotoOpen(true)}>
                  {f.photoChange}
                </Button>
                {draft.imageSrc ? (
                  <Link as="button" onClick={() => set('imageSrc', '')} className="text-[16px]! leading-[24px]!">
                    {t.photoRemove}
                  </Link>
                ) : null}
              </div>
              {photoOpen ? (
                <PhotoDialog
                  locale={locale}
                  current={draft.imageSrc}
                  onClose={() => setPhotoOpen(false)}
                  onSave={(src) => {
                    set('imageSrc', src);
                    setPhotoOpen(false);
                  }}
                />
              ) : null}
              <p className="mt-2 max-w-[420px] font-mono text-breadcrumbs text-brand-muted">
                {t.hints.photo}
              </p>
            </div>
          </div>
        </Group>
        ) : null}

        <Group bare={!!only} title={t.groups.contacts}>
          {on('name') ? (<>
          <div className={PAIR}>
            <div>
              <TextField label={f.nameUk} value={draft.nameUk} readOnly disabled className="max-w-none" />
              <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{t.hints.nameUk}</p>
            </div>
            <div>
            {text('nameEn', f.nameEn, 'Volodymyr Shevchenko', undefined, {
              lang: 'en',
              spellCheck: false,
              autoCapitalize: 'words',
              // Cyrillic never gets into this field; the message says why.
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                const raw = e.currentTarget.value;
                const clean = raw.replace(/[^A-Za-z '’.-]/g, '');
                setNameStripped(clean !== raw);
                set('nameEn', clean);
              },
            })}
            {nameStripped && !(shown('nameEn') && formatIssue('nameEn')) ? err(t.errors.nameEn) : null}
            </div>
          </div>
          <div className={PAIR}>
            <div>
              <TextField label={f.email} value={draft.email} readOnly disabled className="max-w-none" />
              <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{t.hints.email}</p>
            </div>
            {text('phone', f.phone, undefined, t.hints.phone, { type: 'tel', autoComplete: 'tel' })}
          </div>
          </>) : null}
        </Group>

        <Group bare={!!only} title={t.groups.science}>
          {on('name') ? (<>
          <div className={PAIR}>
            <FieldSelect
              label={f.degree + ' *'}
              options={options(t.options.degree)}
              value={draft.degree}
              onChange={(v) => set('degree', v)}
              placeholder={t.select}
            />
            <FieldSelect
              label={f.rank + ' *'}
              options={options(t.options.rank)}
              value={draft.rank}
              onChange={(v) => set('rank', v)}
              placeholder={t.select}
            />
          </div>
          {otherDegree ? text('degreeOther', f.degreeOther) : null}
          {text('institution', f.institution)}
          </>) : null}
          {on('activity') ? area('activity', f.activity, t.hints.activity) : null}
          {on('area') ? area('researchArea', f.area, t.hints.area, {
            // Items are often several words, so one space stays a space; a second one ends the item.
            onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key !== ' ') return;
              const el = e.currentTarget;
              const at = el.selectionStart;
              const before = el.value.slice(0, at);
              if (el.selectionEnd !== at || !/[^\s;] $/.test(before)) return;
              e.preventDefault();
              const head = `${before.slice(0, -1)}; `;
              set('researchArea', head + el.value.slice(at));
              requestAnimationFrame(() => el.setSelectionRange(head.length, head.length));
            },
          }) : null}
          {on('experience') ? experienceRows('experience', f.experience, t.experience.addJob) : null}
          {on('expert') ? experienceRows('expertExperience', f.expert, t.experience.addExpert) : null}
        </Group>

        {on('publications') ? (
        <Group bare={!!only} title={t.groups.publications}>
          {Array.from({ length: pubCount }, (_, i) => {
            const cur = pubAt(i);
            const issues = pubIssues(i);
            const key = (k: keyof Publication) => `pub${i}.${k}`;
            const field = (k: 'title' | 'authors' | 'journal' | 'year' | 'pages' | 'url', note?: string) => (
              <div>
                <TextField
                  label={pub.fields[k] + (i === 0 && k !== 'pages' && k !== 'url' ? ' *' : '')}
                  value={cur[k]}
                  onChange={(e) => {
                    let v = e.currentTarget.value;
                    // After "Surname N." the next word is a new author: put the comma in for them.
                    if (k === 'authors' && v.length > cur.authors.length)
                      v = v.replace(/(\p{L}\.) (\p{L}{2})$/u, '$1, $2');
                    setPub(i, { [k]: v });
                  }}
                  onBlur={() => touch(key(k))}
                  placeholder={k === 'authors' ? pub.hints.authors : undefined}
                  aria-invalid={(shown(key(k)) && !!issues[k]) || undefined}
                  inputMode={k === 'year' ? 'numeric' : undefined}
                  maxLength={k === 'year' ? 4 : undefined}
                  type={k === 'url' ? 'url' : undefined}
                  className="max-w-none"
                />
                {note ? <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{note}</p> : null}
                {err(shown(key(k)) && issues[k])}
              </div>
            );
            return (
              <div key={i} className="space-y-12">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-mono text-h3-mobile md:text-h3-desktop">{pub.titles[i]}</h3>
                  {i > 0 ? (
                    <Link as="button" onClick={() => removePub(i)} className="text-[16px]! leading-[24px]!">
                      {pub.remove}
                    </Link>
                  ) : null}
                </div>
                {field('title')}
                {field('authors')}
                {field('journal')}
                <div className={PAIR}>
                  {field('year')}
                  {field('pages', pub.hints.pages)}
                </div>
                <FieldSelect
                  label={pub.fields.role}
                  options={(['author', 'lead', 'coauthor'] as const).map((r) => ({
                    value: r,
                    label: pub.roles[r],
                  }))}
                  value={cur.role}
                  onChange={(v) => setPub(i, { role: v as Publication['role'] })}
                  placeholder={t.select}
                />
                {field('url', pub.hints.url)}
                {cur.title.trim() ? (
                  <p className="font-mono text-text1-mobile text-brand-muted">
                    {pub.preview}{' '}
                    <span className="text-brand-black">{formatPublication(cur)}</span>
                  </p>
                ) : null}
              </div>
            );
          })}
          {pubCount < 3 ? (
            <div>
              <Button variant="bordered" type="button" onClick={() => setPubCount(pubCount + 1)}>
                + {t.addPublication}
              </Button>
            </div>
          ) : null}
        </Group>
        ) : null}

        <Group bare={!!only} title={t.groups.keywords}>
          {on('keywords') ? (<>
          <SpecialtyPicker
            field={draft.field}
            specialties={draft.specialties}
            other={draft.extraFields}
            onOther={(v) => set('extraFields', v)}
            onChange={(v) => setDraft((d) => ({ ...d, field: v.field, specialties: v.specialties }))}
            labels={t.picker}
            fieldInvalid={missing('field')}
            specialtiesInvalid={tried && (draft.field === OTHER_FIELD ? !draft.extraFields.trim() : draft.specialties.length === 0)}
          />
          {missing('field') ? err(t.picker.errField) : null}
          {tried && draft.field !== OTHER_FIELD && draft.specialties.length === 0 ? err(t.picker.errSpecialty) : null}
          {draft.extraKnowledge.map((k, i) => (
            <div key={i} className="flex flex-col gap-4">
              <SpecialtyPicker
                field={k.field}
                specialties={k.specialties}
                other={k.other ?? ''}
                onOther={(v) => set('extraKnowledge', draft.extraKnowledge.map((x, n) => (n === i ? { ...x, other: v } : x)))}
                onChange={(v) => set('extraKnowledge', draft.extraKnowledge.map((x, n) => (n === i ? { ...x, ...v } : x)))}
                labels={t.picker}
                requiredMark=""
              />
              <div>
                <Link
                  as="button"
                  onClick={() => set('extraKnowledge', draft.extraKnowledge.filter((_, n) => n !== i))}
                  className="text-[16px]! leading-[24px]!"
                >
                  {t.picker.removeField}
                </Link>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="bordered"
              type="button"
              onClick={() => set('extraKnowledge', [...draft.extraKnowledge, { field: '', specialties: [] }])}
            >
              + {t.picker.addField}
            </Button>
          </div>
          {Array.from({ length: actCount }, (_, i) => i).map((i) => {
            const other = t.options.activity[t.options.activity.length - 1];
            const v = draft.activities[i] ?? '';
            const isOther = v === other || (v !== '' && !t.options.activity.includes(v));
            const setAct = (val: string) => {
              const next = [...draft.activities];
              next[i] = val;
              set('activities', next);
            };
            return (
              <div key={i} className="flex flex-col gap-6">
                <FieldSelect
                  label={`${f.act1.replace(/ 1$/, '')} ${i + 1}` + (i === 0 ? ' *' : '')}
                  options={options(t.options.activity)}
                  value={isOther ? other : v}
                  onChange={setAct}
                  placeholder={t.select}
                />
                {i === 0 && actMissing(0) ? err(t.errors.required) : null}
                {isOther ? (
                  <div>
                    <TextField
                      label={f.activityOther + ' *'}
                      value={v === other ? '' : v}
                      onChange={(e) => setAct(e.currentTarget.value || other)}
                    />
                    {tried && v === other ? err(t.errors.required) : null}
                  </div>
                ) : null}
                {i > 0 ? (
                  <div>
                    <Link
                      as="button"
                      onClick={() => {
                        set('activities', draft.activities.filter((_, n) => n !== i));
                        setActCount((n) => Math.max(1, n - 1));
                      }}
                      className="text-[16px]! leading-[24px]!"
                    >
                      {pub.remove}
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
          <div>
            <Button variant="bordered" type="button" onClick={() => setActCount(actCount + 1)}>
              + {t.addActivity}
            </Button>
          </div>
          </>) : null}
          {on('scienceProjects') ? projectCards('scienceProjects', f.scienceProjects, t.project.addScience) : null}
          {on('otherProjects') ? projectCards('otherProjects', f.otherProjects, t.project.addOther) : null}
        </Group>

        <Group bare={!!only} title={t.groups.societies}>
          {on('societies') ? (
            <SocietyPicker
              value={draft.societies}
              onChange={(v) => setDraft((d) => ({ ...d, societies: v }))}
              label={f.societies}
              copy={t.societies}
            />
          ) : null}
        </Group>

        <Group bare={!!only} title={t.groups.links}>
          {on('languages') ? text('languages', f.languages, undefined, undefined, {
            // A space after a finished word starts the next language: the comma is put in.
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              const v = e.currentTarget.value;
              const grew = v.length === draft.languages.length + 1 && v.endsWith(' ');
              const afterWord = /[^\s,;]\s$/.test(v);
              set('languages', grew && afterWord ? `${v.slice(0, -1)}, ` : v);
            },
          }) : null}
          {on('links') ? (
          <div className={PAIR}>
            {linkField('orcid', f.orcid, 'https://orcid.org/0000-0000-0000-0000')}
            {linkField('linkedin', f.linkedin, 'https://www.linkedin.com/in/…')}
            {linkField('facebook', f.facebook, 'https://www.facebook.com/…')}
          </div>
          ) : null}
        </Group>
      </div>

      {/* Fixed to the bottom of the screen: the two answers are always in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-brand-black bg-white">
        <div className="mx-auto flex max-w-[1744px] flex-wrap items-center justify-between gap-3 px-4 py-3 xl:px-10">
          <p className="font-mono text-text1-mobile" aria-live="polite">
            <span
              aria-hidden
              className={`mr-2 inline-block size-3 border-2 border-brand-black align-middle ${dirty ? 'bg-brand-accent-yellow' : ''}`}
            />
            {dirty ? t.bar.unsaved : t.bar.saved}
          </p>
          <div className="flex gap-3">
            <Button variant="bordered" type="button" onClick={cancel}>
              {t.bar.cancel}
            </Button>
            <Button variant="black" type="submit">
              {t.bar.save}
            </Button>
          </div>
        </div>
      </div>

      {removing ? (
        <Modal
          title={t.linkRemove.title}
          onClose={() => setRemoving(null)}
          actions={
            <>
              <Button
                variant="black"
                type="button"
                onClick={() => {
                  set(removing, '');
                  setRemoving(null);
                }}
              >
                {t.linkRemove.confirm}
              </Button>
              <Button variant="bordered" type="button" onClick={() => setRemoving(null)}>
                {cabinetCopy[locale].photoDialog.cancel}
              </Button>
            </>
          }
        >
          {t.linkRemove.text(f[removing])}
        </Modal>
      ) : null}

      {leaving ? (
        <Modal
          title={t.cancelTitle}
          onClose={() => setLeaving(false)}
          actions={
            <>
              <Button variant="black" type="button" onClick={() => setLeaving(false)}>
                {t.cancelKeep}
              </Button>
              <Button
                variant="bordered"
                type="button"
                onClick={() => {
                  setLeaving(false);
                  onCancel?.();
                }}
              >
                {t.cancelDiscard}
              </Button>
            </>
          }
        >
          {t.cancelText}
        </Modal>
      ) : null}
    </form>
  );
}

/* ----------------------------------------------------------- confirmation */

/** The sheet shown after sending: what happens to the changes now. */
export function SubmitConfirmModal({
  locale,
  onClose,
}: {
  locale: CabinetLocale;
  onClose?: () => void;
}) {
  const t = cabinetCopy[locale].confirm;
  return (
    <Modal
      title={t.title}
      onClose={onClose}
      actions={
        <Button variant="black" type="button" onClick={onClose}>
          {t.toProfile}
        </Button>
      }
    >
      <p className="font-bold">{t.text}</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5">
        {t.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </Modal>
  );
}

/**
 * The societies of the site: a field to type in, a dropdown of checkboxes that
 * narrows as you type, and the chosen ones listed beneath, each removable.
 */
function SocietyPicker({
  value,
  onChange,
  label,
  copy,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label: string;
  copy: { hint: string; search: string; none: string; selected: (n: number) => string };
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);
  const shown = societies.filter((x) => x.name.toLowerCase().includes(q.trim().toLowerCase()));
  const toggle = (slug: string) =>
    onChange(value.includes(slug) ? value.filter((x) => x !== slug) : [...value, slug]);
  const chosen = value.map(societyBySlug).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <div role="group" aria-label={label}>
      <div
        ref={box}
        className="relative"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <TextField
          label={copy.search}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          className="max-w-none"
        />
        {open ? (
          <ul
            role="listbox"
            aria-multiselectable="true"
            className="absolute inset-x-0 top-full z-30 m-0 max-h-[320px] list-none overflow-y-auto border-2 border-brand-black bg-white p-0"
          >
            {shown.length ? (
              shown.map((x) => (
                <li key={x.slug} role="option" aria-selected={value.includes(x.slug)}>
                  <label className="flex cursor-pointer items-start gap-3 px-4 py-2.5 font-ukraine text-[16px] leading-[22px] hover:bg-brand-black/5">
                    <input
                      type="checkbox"
                      checked={value.includes(x.slug)}
                      onChange={() => toggle(x.slug)}
                      className="mt-[3px] size-[18px] shrink-0 accent-black"
                    />
                    {x.name}
                  </label>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 font-mono text-breadcrumbs text-brand-muted">{copy.none}</li>
            )}
          </ul>
        ) : null}
      </div>
      <p className="mt-3 font-mono text-breadcrumbs text-brand-muted">
        {copy.hint} {copy.selected(value.length)}
      </p>
      {chosen.length ? (
        <ul className="m-0 mt-6 flex list-none flex-wrap gap-2.5 p-0">
          {chosen.map((x) => (
            <li key={x.slug}>
              <Tag
                type="button"
                variant="accent"
                onClick={() => toggle(x.slug)}
                aria-label={`${x.name} ✕`}
                className="min-h-[36px]! py-1.5! text-[14px]! leading-[20px]! tracking-[-0.03em]!"
              >
                {x.name} ✕
              </Tag>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
