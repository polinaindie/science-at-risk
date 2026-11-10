import type { ProfileData } from './cabinetData';
import {
  isEmail,
  isExperienceEmpty,
  isLatinName,
  isProfileLink,
  isProjectEmpty,
  isPublicationEmpty,
  isUrl,
  isYear,
} from './format';
import { OTHER_FIELD } from './SpecialtyPicker';
import type { FormSection } from './Profile';

/** Words of the form that the checks need and the data does not carry. */
export interface ValidateOptions {
  /** The last entry of the degree list: “Other”. */
  otherDegree: string;
  /** The last entry of the activity list: “Other”. */
  otherActivity: string;
}

const has = (v: string) => !!v.trim();

const experienceOk = (rows: ProfileData['experience']) => {
  if (!rows.length || isExperienceEmpty(rows[0])) return false;
  return rows.every((r, i) => (i > 0 && isExperienceEmpty(r)) || (has(r.year) && has(r.position) && has(r.place)));
};

const publicationOk = (p: ProfileData['publications'][number]) =>
  has(p.title) && has(p.authors) && has(p.journal) && isYear(p.year) && (!has(p.url) || isUrl(p.url));

/**
 * Is one part of the profile complete and well-formed? The edit form, every
 * step of the first-fill wizard and the checklist before sending all ask this,
 * so they can never disagree about what "filled in" means.
 */
export function isSectionValid(d: ProfileData, id: FormSection, o: ValidateOptions): boolean {
  switch (id) {
    case 'photo':
      return has(d.imageSrc);
    case 'identity':
      return has(d.nameUk) && has(d.nameEn) && isLatinName(d.nameEn);
    case 'work':
      return (
        has(d.degree) && has(d.rank) && has(d.institution) && (d.degree !== o.otherDegree || has(d.degreeOther))
      );
    case 'name':
      return isSectionValid(d, 'identity', o) && isSectionValid(d, 'work', o);
    case 'languages':
      return has(d.languages);
    case 'links':
      return (['orcid', 'linkedin', 'facebook'] as const).every((k) => isProfileLink(k, d[k]));
    case 'activity':
      return has(d.activity);
    case 'area':
      return has(d.researchArea);
    case 'experience':
      return experienceOk(d.experience);
    case 'expert':
      return experienceOk(d.expertExperience);
    case 'publications': {
      const list = d.publications;
      if (!list.length || isPublicationEmpty(list[0])) return false;
      return list.every((p, i) => (i > 0 && isPublicationEmpty(p)) || publicationOk(p));
    }
    case 'keywords':
      return (
        has(d.field) &&
        (d.field === OTHER_FIELD ? has(d.extraFields) : d.specialties.length > 0) &&
        !!d.activities[0] &&
        !d.activities.includes(o.otherActivity)
      );
    case 'scienceProjects':
    case 'otherProjects':
      return d[id].every(
        (r) => isProjectEmpty(r) || (has(r.title) && has(r.description) && has(r.role) && (!has(r.url) || isUrl(r.url))),
      );
    case 'societies':
      return true;
    case 'recommenders':
      return [0, 1, 2].every((i) => {
        const r = d.recommenders[i];
        return !!r && has(r.name) && isEmail(r.email);
      });
    case 'consents':
      return d.consents.personalData && !!d.consents.publish;
  }
}

/** Every listed part is fine. */
export const areSectionsValid = (d: ProfileData, ids: FormSection[], o: ValidateOptions) =>
  ids.every((id) => isSectionValid(d, id, o));
