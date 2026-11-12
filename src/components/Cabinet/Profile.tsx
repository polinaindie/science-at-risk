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
  emptyRecommender,
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
  isEmail,
  isUrl,
  isYear,
} from './format';
import { PhotoDialog } from './PhotoDialog';
import { areSectionsValid } from './validate';
import { OTHER_FIELD, SpecialtyPicker } from './SpecialtyPicker';
import { knowledgeLabel } from './knowledgeFields';
import { FormattedText } from './FormattedText';
import { isRichEmpty } from './formatText';
import { Modal, StatusBadge } from './parts';
import { societies, societyBySlug, societyName } from './societies';

/** Every heading inside the profile, left column and right: 24px. */
const H4 = 'font-serif text-[24px] font-normal leading-[30px] tracking-[-0.02em] md:text-[28px] md:leading-[34px]';
/** The site's running text on an expert's page: IBM Plex Mono, 16 on a phone and 18 above. */
const SITE_P = 'font-mono text-[16px] leading-[26px] md:text-[18px] md:leading-[30px]';
/** The small text in the site's project and publication cards: e-Ukraine Light, 15. */
const SITE_SMALL = 'font-ukraine text-[15px] font-light leading-[25px]';
/** A project's or publication's title: serif, 20 on a phone and 22 above. */
const CARD_TITLE = 'm-0 font-serif text-[20px] font-normal leading-[28px] tracking-[-0.02em] md:text-[22px]';
/** The post is e-Ukraine Light 16, the place it belongs to is IBM Plex Mono: the same on every profile. */
const POST = 'font-ukraine text-[16px] font-light leading-[24px]';
const PLACE = 'font-mono text-[14px] leading-[22px] md:text-[15px]';
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
  /** Show the photo and the name here; false when they stand elsewhere, above the menu. */
  identity?: boolean;
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
  tight = false,
  children,
}: {
  title: string;
  action?: ReactNode;
  /** Nothing filled in: the block is not shown at all, as on the site. */
  empty?: boolean;
  /** Stands close under what is above it (the links under the photo) instead of a section's usual air. */
  tight?: boolean;
  children: ReactNode;
}) {
  if (empty) return null;
  return (
    <>
      {/* the heading and its "Change" share a row: the button stands opposite the title, centred on its height */}
      <div className={`${tight ? 'mt-6' : 'mt-12'} mb-4 flex items-center justify-between gap-4`}>
        <h4 className={H4}>{title}</h4>
        {action}
      </div>
      {children}
    </>
  );
}

/** The list of projects or publications: a 2px rule above the first item, between items and under the last.
    The rule belongs to the item, not to the heading: 32px of air above it (the margins collapse, so this one alone sets it), 32px below. */
const CARD = 'border-b-2 border-brand-black py-8 first:border-t-2';
const CardList = ({ children }: { children: ReactNode }) => <ul className="m-0 mt-8 list-none p-0">{children}</ul>;

/** A career as a timeline: the year in its own column, the post, then the place. */
const ExperienceList = ({ items }: { items: ExperienceItem[] }) => (
  <ul className="m-0 mt-2 list-none space-y-6 p-0 font-mono">
    {items
      .filter((x) => !isExperienceEmpty(x))
      .map((x, i) => (
        <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-x-2 md:grid-cols-[5rem_1fr] md:gap-x-3">
          <span className="pt-[2px] text-[14px] leading-[22px] md:pt-[3px] md:text-[16px]">{x.year}</span>
          <span>
            <span className={`block ${POST}`}>{x.position.charAt(0).toUpperCase() + x.position.slice(1)}</span>
            {x.place ? <span className={`mt-1 block ${PLACE}`}>{x.place}</span> : null}
          </span>
        </li>
      ))}
  </ul>
);

/** "Change" beside a piece of the profile; "Add" when that piece is still empty. */
function changeButton(
  locale: CabinetLocale,
  locked: boolean,
  onEdit: ProfileViewProps['onEdit'],
  id: SectionId,
  part: string,
  filled = true,
) {
  const t = cabinetCopy[locale].profile;
  if (locked || !onEdit) return null;
  return (
    <button
      type="button"
      onClick={() => onEdit(id)}
      aria-label={`${filled ? t.change : t.add}: ${part}`}
      className="satr-underlined-box inline-flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-0 font-mono text-[14px] leading-[20px] tracking-[-0.03em] text-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
    >
      <span className="satr-underlined">{filled ? t.change : t.add}</span>
    </button>
  );
}

/** The photo; when it can be changed, the whole picture is the button that opens the dialog. */
function ProfilePhoto({
  locale,
  profile,
  locked,
  onPhoto,
}: {
  locale: CabinetLocale;
  profile: ProfileData;
  locked: boolean;
  onPhoto?: (src: string) => void;
}) {
  const [photoOpen, setPhotoOpen] = useState(false);
  const photo = profile.imageSrc ? (
    <img src={profile.imageSrc} alt="" className="aspect-square w-full object-cover" />
  ) : (
    <div aria-hidden className="aspect-square w-full bg-white/60" />
  );
  return (
    <>
      {locked || !onPhoto ? (
        photo
      ) : (
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
      )}
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
    </>
  );
}

/** Name, degree and rank, institution, and the way to change them. */
function ProfileName({
  locale,
  profile,
  action,
  compact = false,
  show = 'both',
}: {
  locale: CabinetLocale;
  profile: ProfileData;
  action?: ReactNode;
  /** Narrow column: a smaller name. */
  compact?: boolean;
  /** The name alone, the position with the institution alone, or both. */
  show?: 'name' | 'position' | 'both';
}) {
  const copy = cabinetCopy[locale];
  const name = locale === 'uk' ? profile.nameUk : profile.nameEn;
  const otherDegree = profile.degree === copy.edit.options.degree.at(-1);
  const position = [otherDegree && profile.degreeOther ? profile.degreeOther : profile.degree, profile.rank]
    .filter((x) => x && x !== copy.edit.options.rank[0])
    .join(', ');
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        {show !== 'position' ? (
          <h1
            className={`m-0 font-serif tracking-[-0.02em] ${
              compact
                ? 'text-[28px] leading-[34px]'
                : 'text-[28px] leading-[32px] md:text-[36px] md:leading-[40px]'
            }`}
          >
            {name}
          </h1>
        ) : null}
        {show !== 'name' ? (
          <>
            {position ? (
              <p className={`m-0 ${POST} md:text-[18px] md:leading-[26px] ${show === 'both' ? 'mt-4' : ''}`}>
                {position.charAt(0).toUpperCase() + position.slice(1)}
              </p>
            ) : null}
            {profile.institution ? (
              <p className={`m-0 mt-1 text-[#4a5459] ${PLACE}`}>{profile.institution}</p>
            ) : null}
          </>
        ) : null}
      </div>
      {/* the "Change" for the whole block stands opposite it, level with its top edge, like the section titles' */}
      {show !== 'name' ? <div className="shrink-0 pt-2">{action}</div> : null}
    </div>
  );
}

/** Photo and name: the person, to stand above the cabinet menu. Position and institution stay in the profile. */
export function ProfileIdentity({
  locale,
  profile,
  status,
  onPhoto,
}: Pick<ProfileViewProps, 'locale' | 'profile' | 'status' | 'onPhoto'>) {
  const locked = status === 'pending';
  return (
    <div>
      <div className="max-w-[200px] lg:max-w-none">
        <ProfilePhoto locale={locale} profile={profile} locked={locked} onPhoto={onPhoto} />
      </div>
      <div className="mt-6">
        <ProfileName locale={locale} profile={profile} compact show="name" />
      </div>
    </div>
  );
}

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
  identity = true,
  siteHref = '#',
}: ProfileViewProps) {
  const [discardOpen, setDiscardOpen] = useState(false);
  const t = cabinetCopy[locale].profile;
  const pub = cabinetCopy[locale].edit.publication;
  const locked = status === 'pending';
  /** Unsent changes show in the strip as a draft, with the send and discard beside it. */
  const unsentNow = unsent && !locked;
  const change = (id: SectionId, part: string, filled = true) =>
    changeButton(locale, locked, onEdit, id, part, filled);
  const sec = (id: SectionId) => t.sections[
    ({ activity: 'activity', area: 'area', experience: 'experience', expert: 'expert', publications: 'publications', keywords: 'keywords', societies: 'societies', scienceProjects: 'projects', otherProjects: 'otherProjects' } as Record<string, keyof typeof t.sections>)[id]
  ].replace(/:$/, '').toLowerCase();
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
    .map((k) => knowledgeLabel(k.trim(), locale))
    .filter((k, i, all) => k && all.indexOf(k) === i);

  /** The links stand under the photo. On the site they have no heading; in the cabinet they get one ("Links", not "Social networks": ORCID is a researcher ID, not a network). */
  const linksBlock = (
    <Section title={t.aside.links} empty={links.length === 0} tight action={change('links', t.parts.links)}>
      <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="satr-hover-underline font-mono text-[16px] leading-[26px]">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );

  /** The keywords stand right under the institution. On the site they have no heading; in the cabinet they get one, with its own "Change". */
  const keywordsBlock = (
    <Section title={t.sections.keywords} empty={keywords.length === 0} action={change('keywords', sec('keywords'))}>
      <div className="max-w-[62ch]">
        <ul className="m-0 flex list-none flex-wrap gap-x-2.5 gap-y-2.5 p-0">
          {keywords.map((k) => (
            <li key={k}>
              <Tag as="span" className="text-[14px]! leading-[22px]! tracking-[-0.03em]! transition-colors hover:bg-brand-black hover:text-white">{k}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );

  /** The status stays small, above the name, level with the top of the photo: a chip and the one thing that can be done about it. */
  const statusLine = (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      <StatusBadge status={unsentNow ? 'draft' : status} locale={locale}>
        {status === 'approved' && !unsentNow ? (
          <Link href={siteHref} className="self-center text-[14px]! leading-[20px]!">
            {t.openOnSite}
          </Link>
        ) : null}
        {status === 'pending' && onWithdraw ? (
          <Link as="button" onClick={onWithdraw} className="self-center text-[14px]! leading-[20px]!">
            {t.withdraw}
          </Link>
        ) : null}
      </StatusBadge>
    </div>
  );

  return (
    <div className={unsentNow ? 'pb-28' : undefined}>
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

      {/* The page of an expert on the site, entity for entity: the same blocks, in the same order, in the same type on every profile.
          What is added is the way to change each one. */}
      {identity ? null : (
        <div>
          {statusLine}
          <ProfileName locale={locale} profile={profile} show="position" action={change('name', t.parts.name)} />
        </div>
      )}
      {/* Photo and identity stand side by side whenever they fit, and the identity stands first: when they do not fit it goes under the photo, before the links and the rest.
          Wide screens: the photo and the links in the left column, the identity and the rest in the right one. */}
      <div
        className={
          identity
            ? 'flex flex-wrap gap-x-8 gap-y-6 md:grid md:grid-cols-[max-content_minmax(0,1fr)] md:gap-y-0'
            : 'mt-[24px] grid gap-6'
        }
      >
        {identity ? (
          <>
            <aside className="contents md:col-start-1 md:row-span-2 md:row-start-1 md:block md:w-[clamp(180px,32vh,360px)]">
              {/* the photo is as wide as the site's: no taller than a third of the screen and never wider than 360px (200px when small); the links under it share that width */}
              <div className="order-1 w-[200px] shrink-0 md:w-full">
                <ProfilePhoto locale={locale} profile={profile} locked={locked} onPhoto={onPhoto} />
              </div>
              <div className="order-3 basis-full md:basis-auto">{linksBlock}</div>
            </aside>
            <div className="order-2 min-w-[260px] flex-1 md:col-start-2 md:row-start-1 md:min-w-0">
              {statusLine}
              <ProfileName locale={locale} profile={profile} action={change('name', t.parts.name)} />
            </div>
          </>
        ) : null}

        <div className={identity ? 'order-4 min-w-0 basis-full md:col-start-2 md:row-start-2 md:basis-auto' : 'min-w-0'}>
          {keywordsBlock}

          <Section title={t.headings.languages} empty={!profile.languages} action={change('languages', t.aside.languages.replace(/:$/, '').toLowerCase())}>
            <p className={`m-0 ${SITE_P}`}>{profile.languages}</p>
          </Section>
          {identity ? null : linksBlock}

          <Section title={t.headings.area} empty={isRichEmpty(profile.researchArea)} action={change('area', sec('area'))}>
            <FormattedText text={profile.researchArea} className={SITE_P} />
          </Section>
          <Section title={t.headings.activity} empty={isRichEmpty(profile.activity)} action={change('activity', sec('activity'))}>
            <FormattedText text={profile.activity} className={SITE_P} />
          </Section>
          <Section
            title={t.headings.experience}
            empty={profile.experience.every(isExperienceEmpty)}
            action={change('experience', sec('experience'))}
          >
            <ExperienceList items={profile.experience} />
          </Section>
          <Section
            title={t.headings.expert}
            empty={profile.expertExperience.every(isExperienceEmpty)}
            action={change('expert', sec('expert'))}
          >
            <ExperienceList items={profile.expertExperience} />
          </Section>
          {(['scienceProjects', 'otherProjects'] as const).map((key) => {
            const list = profile[key].filter((x) => !isProjectEmpty(x));
            return (
              <Section
                key={key}
                title={t.headings[key === 'scienceProjects' ? 'projects' : 'otherProjects']}
                empty={list.length === 0}
                action={change(key, sec(key))}
              >
                <CardList>
                  {list.map((x) => (
                    <li key={x.title + x.role} className={CARD}>
                      <h3 className={CARD_TITLE}>{x.title}</h3>
                      {x.description ? <p className={`m-0 mt-4 ${SITE_SMALL}`}>{x.description}</p> : null}
                      {x.role ? (
                        <p className={`m-0 mt-4 ${SITE_SMALL}`}>
                          {pub.roleIs}: {x.role}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </CardList>
              </Section>
            );
          })}
          <Section
            title={t.headings.publications}
            empty={profile.publications.every(isPublicationEmpty)}
            action={change('publications', sec('publications'))}
          >
            <CardList>
              {profile.publications
                .filter((x) => !isPublicationEmpty(x))
                .map((x) => (
                  <li key={formatPublication(x)} className={`${CARD} grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-6`}>
                    <span className="font-mono text-[16px] leading-[28px]">{x.year}</span>
                    <div className="col-start-2">
                      <h3 className={CARD_TITLE}>{x.title}</h3>
                      {x.authors || x.journal || x.year || x.pages ? (
                        <p className={`m-0 mt-4 ${SITE_SMALL}`}>{formatCitation(x)}</p>
                      ) : null}
                      {x.role ? (
                        <p className={`m-0 mt-4 ${SITE_SMALL}`}>
                          {pub.roleIs}: {pub.roles[x.role]}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
            </CardList>
          </Section>
          {(() => {
            const mine = profile.societies.map(societyBySlug).filter((x): x is NonNullable<typeof x> => !!x);
            return (
              <Section title={t.headings.societies} action={change('societies', sec('societies'), mine.length > 0)}>
                {mine.length ? (
                  <ul className={`m-0 list-none p-0 ${SITE_SMALL}`}>
                    {mine.map((x, i) => (
                      <li key={x.slug} className="inline">
                        <a
                          href={`${import.meta.env.BASE_URL}society/${x.slug}.html`}
                          className="satr-underlined"
                        >
                          {societyName(x, locale)}
                        </a>
                        {i < mine.length - 1 ? <span className="mr-2">, </span> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Section>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ edit */

/** Parts the wizard can ask for besides the ones the profile page edits. */
export type FormSection = SectionId | 'identity' | 'work' | 'recommenders' | 'consents';

/** The buttons under one step of the wizard. */
export interface StepBar {
  nextLabel: string;
  backLabel: string;
  onBack?: () => void;
  exitLabel: string;
  /** Keeps the draft as it is and leaves; nothing is checked. */
  onExit?: (draft: ProfileData) => void;
  /** Hides Next; the step has its own way on. */
  hideNext?: boolean;
  nextDisabled?: boolean;
}

/** Every part the form can show, in the order it shows them. */
const ALL_PARTS: FormSection[] = [
  'photo', 'identity', 'work', 'activity', 'area', 'experience', 'expert', 'publications',
  'keywords', 'scienceProjects', 'otherProjects', 'societies', 'languages', 'links', 'recommenders', 'consents',
];

export interface ProfileEditFormProps {
  locale: CabinetLocale;
  initial: ProfileData;
  /** Show only this part of the form: the one the person chose to change. */
  only?: SectionId;
  /** Show several parts at once: one step of the first-fill wizard. Wins over `only`. */
  sections?: FormSection[];
  /** Step mode: no page title and no bottom bar; the wizard's own buttons take their place. */
  step?: StepBar;
  /** Called with the draft each time it changes, so a wizard can keep it. */
  onChange?: (draft: ProfileData) => void;
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
  sections,
  step,
  onChange,
  showErrors = false,
  confirmingCancel = false,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const t = cabinetCopy[locale].edit;
  const f = t.fields;
  const pub = t.publication;
  const [draft, setDraft] = useState<ProfileData>(initial);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    onChange?.(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);
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

  /** Each of the three recommenders needs a name and a working-looking e-mail. */
  const recAt = (i: number) => draft.recommenders[i] ?? emptyRecommender;
  const recIssues = (i: number) => {
    const r = recAt(i);
    const out: Partial<Record<'name' | 'email', string>> = {};
    if (!r.name.trim()) out.name = t.errors.required;
    if (!r.email.trim()) out.email = t.errors.required;
    else if (!isEmail(r.email)) out.email = t.errors.email;
    return out;
  };
  const setRec = (i: number, patch: Partial<typeof emptyRecommender>) =>
    setDraft((d) => {
      const next = [0, 1, 2].map((n) => d.recommenders[n] ?? { ...emptyRecommender });
      next[i] = { ...next[i], ...patch };
      return { ...d, recommenders: next };
    });

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
        className="max-w-none"
        onBlur={() => touch(key)}
        {...extra}
      />
      {note || hint ? <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{note ?? `${t.example} ${hint}`}</p> : null}
      {err(missing(key) ? t.errors.required : shown(key) && formatIssue(key))}
    </div>
  );

  const linkField = (key: 'orcid' | 'linkedin' | 'facebook', label: string) => (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">{text(key, label, undefined, undefined, { type: 'url' })}</div>
      {draft[key] ? (
        <button
          type="button"
          onClick={() => setRemoving(key)}
          aria-label={`${t.linkRemove.aria}: ${label}`}
          className="mb-1 flex size-9 shrink-0 items-center justify-center border-2 border-[#c62828] bg-white text-[#c62828] transition-colors hover:bg-[#c62828] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
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
        label={label + star(key)}
        value={String(draft[key])}
        onChange={(e) => set(key, e.currentTarget.value as never)}
        aria-invalid={missing(key) || undefined}
        className="max-w-none"
        {...extra}
      />
      {hint ? <p className="mt-2 mb-0 font-mono text-breadcrumbs text-brand-muted">{hint}</p> : null}
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
        <h3 className="font-serif text-h2-mobile font-normal md:text-h2-desktop">{title} *</h3>
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
              {i === 0 ? (
                <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">
                  {t.example} {t.experience.yearHint} · {t.experience.positionHint} · {t.experience.placeHint}
                </p>
              ) : null}
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
        <h3 className="font-serif text-h2-mobile font-normal md:text-h2-desktop">{title}</h3>
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
                  onChange={(e) => change(i, { [part]: e.currentTarget.value })}
                  onBlur={() => touch(k(part))}
                  aria-invalid={(shown(k(part)) && !!issue[part]) || undefined}
                  className="max-w-none"
                />
              ) : (
                <TextField
                  label={pr.fields[part] + (part === 'url' ? '' : ' *')}
                  value={r[part]}
                  type={part === 'url' ? 'url' : undefined}
                  onChange={(e) => change(i, { [part]: e.currentTarget.value })}
                  onBlur={() => touch(k(part))}
                  aria-invalid={(shown(k(part)) && !!issue[part]) || undefined}
                  className="max-w-none"
                />
              )}
              {part !== 'url' ? (
                <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{t.example} {pr.hints[part]}</p>
              ) : null}
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
    const bad = !areSectionsValid(
      draft,
      ALL_PARTS.filter(on),
      { otherDegree: t.options.degree.at(-1) ?? '', otherActivity: t.options.activity[t.options.activity.length - 1] },
    );
    if (bad) {
      // Bring the first thing that needs an answer into view.
      requestAnimationFrame(() => {
        const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]');
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        if (el && 'focus' in el && el.tagName !== 'P') el.focus({ preventScroll: true });
      });
      return;
    }
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
  const want: FormSection[] | undefined = sections ?? (only ? [only] : undefined);
  // The full form is the profile as it is edited later: what was asked only once, at the start, is not in it.
  const on = (id: FormSection) =>
    want
      ? want.includes(id) || ((id === 'identity' || id === 'work') && want.includes('name'))
      : id !== 'recommenders' && id !== 'consents';
  const anyOn = (...ids: FormSection[]) => ids.some(on);
  const cancel = () => (dirty ? setLeaving(true) : onCancel?.());

  return (
    <form ref={formRef} onSubmit={submit} noValidate className={step ? 'pb-40' : 'pb-28'}>
      {step ? null : <>
      <a
        href="#profile"
        onClick={(e) => {
          e.preventDefault();
          cancel();
        }}
        className="mb-4 inline-flex items-center gap-2 font-mono text-breadcrumbs text-brand-black no-underline hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
      >
        <svg aria-hidden width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M13 5H1.5M5.5 1 1.5 5l4 4" />
        </svg>
        {cabinetCopy[locale].nav.items.profile}
      </a>
      <h1 className="font-serif text-h2-mobile md:text-h2-desktop">
        {only ? `${t.partTitle}: ${partName}` : t.title}
      </h1>
      {only ? null : <p className={`mt-3 max-w-[760px] ${PARA}`}>{t.lede}</p>}
      <p className="mt-2 mb-10 font-mono text-breadcrumbs text-brand-muted">{t.required}</p>
      </>}

      <div>
        {on('photo') ? (
          <Group bare={!!want} title={t.groups.photo}>
          <div className="flex items-center gap-5">
            {draft.imageSrc ? (
              <img src={draft.imageSrc} alt="" className="size-[96px] shrink-0 object-cover" />
            ) : (
              <div aria-hidden className="size-[96px] shrink-0 border-2 border-dashed border-brand-black/40 bg-white/60 p-2 text-[#c8c8c8]">
                {/* The same grey scientist as in the site header: no photo yet. */}
                <svg viewBox="0 0 40 40" className="size-full" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M13 13 9 6M17 11 16 4M21 10.5 23 3.5M25 11.5 30 6M28 14.5 34 12" />
                  <path d="M10 25c0-8 4-12 10-12s10 4 10 12-4 11-10 11-10-3-10-11Z" />
                  <circle cx="15.5" cy="23" r="3.6" />
                  <circle cx="24.5" cy="23" r="3.6" />
                  <path d="M19.1 23h1.8" />
                  <circle cx="15.5" cy="23" r=".6" fill="currentColor" />
                  <circle cx="24.5" cy="23" r=".6" fill="currentColor" />
                  <path d="M16 31c2.5 2 6 1.5 8-1.2" />
                </svg>
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Button variant="bordered" type="button" onClick={() => setPhotoOpen(true)}>
                  {draft.imageSrc ? f.photoChange : f.photoAdd}
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
              {err(tried && !draft.imageSrc && t.errors.required)}
            </div>
          </div>
        </Group>
        ) : null}

        {anyOn('identity') ? (
        <Group bare={!!want} title={t.groups.contacts}>
          {on('identity') ? (<>
          <div className={PAIR}>
            {/* Known from the account: shown, not changed. In the first-fill wizard only the e-mail is known, so the person writes the name, on every step they come back to. */}
            {!step && initial.nameUk.trim() ? (
              <div>
                <TextField label={f.nameUk} value={draft.nameUk} readOnly disabled className="max-w-none" />
                <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{t.hints.nameUk}</p>
              </div>
            ) : (
              text('nameUk', f.nameUk, undefined, undefined, { autoComplete: 'name' })
            )}
            <div>
            {text('nameEn', f.nameEn, undefined, undefined, {
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
        ) : null}

        {anyOn('work', 'activity', 'area', 'experience', 'expert') ? (
        <Group bare={!!want} title={t.groups.science}>
          {on('work') ? (<>
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
        ) : null}

        {on('publications') ? (
        <Group bare={!!want} title={t.groups.publications}>
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
                  <h3 className="font-serif text-h2-mobile font-normal md:text-h2-desktop">{pub.titles[i]}</h3>
                  {i > 0 ? (
                    <Link as="button" onClick={() => removePub(i)} className="text-[16px]! leading-[24px]!">
                      {pub.remove}
                    </Link>
                  ) : null}
                </div>
                {field('title')}
                {field('authors', `${t.example} ${pub.hints.authors}`)}
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

        {anyOn('keywords', 'scienceProjects', 'otherProjects') ? (
        <Group bare={!!want} title={t.groups.keywords}>
          {on('keywords') ? (<>
          <SpecialtyPicker
            field={draft.field}
            specialties={draft.specialties}
            other={draft.extraFields}
            onOther={(v) => set('extraFields', v)}
            onChange={(v) => setDraft((d) => ({ ...d, field: v.field, specialties: v.specialties }))}
            labels={t.picker}
            locale={locale}
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
                locale={locale}
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
                  label={`${f.act1.replace(/ 1$/, '')}${actCount > 1 ? ` ${i + 1}` : ''}` + (i === 0 ? ' *' : '')}
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
        ) : null}

        {anyOn('societies') ? (
        <Group bare={!!want} title={t.groups.societies}>
          {on('societies') ? (
            <SocietyPicker
              locale={locale}
              value={draft.societies}
              onChange={(v) => setDraft((d) => ({ ...d, societies: v }))}
              label={f.societies}
              copy={t.societies}
            />
          ) : null}
        </Group>
        ) : null}

        {anyOn('languages', 'links') ? (
        <Group bare={!!want} title={t.groups.links}>
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
            {linkField('orcid', f.orcid)}
            {linkField('linkedin', f.linkedin)}
            {linkField('facebook', f.facebook)}
          </div>
          ) : null}
        </Group>
        ) : null}

        {on('recommenders') ? (
          <Group bare={!!want} title={t.groups.recommenders} note={t.recommenders.lede}>
            {[0, 1, 2].map((i) => {
              const r = recAt(i);
              const issue = recIssues(i);
              const k = (part: string) => `rec${i}.${part}`;
              return (
                <div key={i} className="space-y-6">
                  <h3 className="font-serif text-h2-mobile font-normal md:text-h2-desktop">{t.recommenders.rows[i]} *</h3>
                  <div className={PAIR}>
                    <div>
                      <TextField
                        label={t.recommenders.name + ' *'}
                        value={r.name}
                        autoComplete="off"
                        onChange={(e) => setRec(i, { name: e.currentTarget.value })}
                        onBlur={() => touch(k('name'))}
                        aria-invalid={(shown(k('name')) && !!issue.name) || undefined}
                        className="max-w-none"
                      />
                      {err(shown(k('name')) && issue.name)}
                    </div>
                    <div>
                      <TextField
                        label={t.recommenders.email + ' *'}
                        type="email"
                        value={r.email}
                        autoComplete="off"
                        onChange={(e) => setRec(i, { email: e.currentTarget.value })}
                        onBlur={() => touch(k('email'))}
                        aria-invalid={(shown(k('email')) && !!issue.email) || undefined}
                        className="max-w-none"
                      />
                      {err(shown(k('email')) && issue.email)}
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="font-mono text-breadcrumbs text-brand-muted">{t.recommenders.privateNote}</p>
          </Group>
        ) : null}

        {on('consents') ? (
          <Group bare={!!want} title={t.groups.consents}>
            <div>
              <label className="flex cursor-pointer items-start gap-3 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
                <input
                  type="checkbox"
                  checked={draft.consents.personalData}
                  onChange={(e) => set('consents', { ...draft.consents, personalData: e.currentTarget.checked })}
                  aria-invalid={(tried && !draft.consents.personalData) || undefined}
                  className="mt-1.5 size-5 shrink-0 accent-black"
                />
                <span>{t.consents.personalData} *</span>
              </label>
              {err(tried && !draft.consents.personalData && t.errors.consent)}
            </div>
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="font-ukraine text-text2-mobile font-light md:text-text2-desktop">{t.consents.publish} *</legend>
              <div className="mt-4 flex flex-wrap gap-6">
                {(['yes', 'no'] as const).map((v) => (
                  <label key={v} className="flex cursor-pointer items-center gap-3 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
                    <input
                      type="radio"
                      name="consent-publish"
                      checked={draft.consents.publish === v}
                      onChange={() => set('consents', { ...draft.consents, publish: v })}
                      aria-invalid={(tried && !draft.consents.publish) || undefined}
                      className="size-5 accent-black"
                    />
                    {t.consents[v]}
                  </label>
                ))}
              </div>
              <p className="mt-3 font-mono text-breadcrumbs text-brand-muted">{t.consents.publishNote}</p>
              {err(tried && !draft.consents.publish && t.errors.consent)}
            </fieldset>
          </Group>
        ) : null}
      </div>

      {step ? (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-brand-accent-blue">
          <div className="mx-auto flex max-w-[1744px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 xl:px-10">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <Link as="button" onClick={() => step.onExit?.(draft)} className="text-[16px]! leading-[24px]!">
                {step.exitLabel}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {step.onBack ? (
                <Button variant="bordered" type="button" onClick={step.onBack}>
                  {step.backLabel}
                </Button>
              ) : null}
              {step.hideNext ? null : (
                <Button variant="black" type="submit" disabled={step.nextDisabled} aria-busy={step.nextDisabled || undefined} className="disabled:opacity-60">
                  {step.nextLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
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

        </>
      )}

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
  locale,
  value,
  onChange,
  label,
  copy,
}: {
  locale: CabinetLocale;
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
  const shown = societies.filter((x) => societyName(x, locale).toLowerCase().includes(q.trim().toLowerCase()));
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
                    {societyName(x, locale)}
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
                aria-label={`${societyName(x, locale)} ✕`}
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
