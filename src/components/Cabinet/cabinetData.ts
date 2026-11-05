import type { CabinetLocale } from './cabinetCopy';

/** The shapes the backend will fill. Sample data below stands in for it. */
/**
 * The profile, field for field as the registration form collects it, so the
 * edit screen is that form with the answers already in it.
 */
/** A field of knowledge with the specialities picked under it. */
export interface KnowledgeChoice {
  field: string;
  specialties: string[];
  /** When the field is "not in the list": what the person suggests. */
  other?: string;
}

export interface ProfileData {
  imageSrc: string;
  // 1 · contact details
  nameUk: string;
  nameEn: string;
  /** From the account; not editable here. */
  email: string;
  /** Never published. */
  phone: string;
  orcid: string;
  facebook: string;
  linkedin: string;
  // 2 · scientific profile
  degree: string;
  /** Asked only when the degree is “Other”. */
  degreeOther: string;
  rank: string;
  institution: string;
  languages: string;
  activity: string;
  researchArea: string;
  experience: ExperienceItem[];
  expertExperience: ExperienceItem[];
  // 3 · publications, one to three
  publications: Publication[];
  // 4 · keywords and activity
  /** A field of knowledge from the official list (knowledgeFields.ts). */
  field: string;
  /** Its specialities, chosen from the same list; at least one. */
  specialties: string[];
  /** More than one field? Each extra one is chosen from the same list. */
  extraKnowledge: KnowledgeChoice[];
  /** What the list lacks: a suggestion for the moderators to look at. */
  extraFields: string;
  /** Three choices from the fifteen. */
  activities: string[];
  extraActivities: string;
  scienceProjects: Project[];
  otherProjects: Project[];
  /** Scientific societies the person belongs to: slugs from societies.ts, each linked to its page on the site. */
  societies: string[];
}

/** A project the scientist took part in: what it is called, what it is, their part, a link. */
export interface Project {
  title: string;
  description: string;
  role: string;
  url: string;
}

export const emptyProject: Project = { title: '', description: '', role: '', url: '' };

/** One line of a career or of expert work: when, in what post, and where. */
export interface ExperienceItem {
  year: string;
  position: string;
  place: string;
}

export const emptyExperience: ExperienceItem = { year: '', position: '', place: '' };

/** The sample text is written as the old form took it, “year – text”, one per line. */
const jobs = (lines: string): ExperienceItem[] =>
  lines.split('\n').map((l) => {
    // “year – post – place”
    const [year, position = '', ...place] = l.split(' – ');
    return { year, position, place: place.join(' – ') };
  });

/** How the scientist took part; the label comes from the copy file. */
export type PublicationRole = 'author' | 'lead' | 'coauthor';

/** One key publication, a field per part so nothing has to be parsed later. */
export interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: string;
  pages: string;
  role: PublicationRole | '';
  url: string;
}

export const emptyPublication: Publication = {
  title: '',
  authors: '',
  journal: '',
  year: '',
  pages: '',
  role: '',
  url: '',
};

export interface MatchScientist {
  id: string;
  name: string;
  subtitle: string;
  organization: string;
  imageSrc: string;
  tags: string[];
  sharedTags: string[];
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  href: string;
}

export interface Grant {
  id: string;
  title: string;
  field: string;
  href: string;
  /** ISO date, YYYY-MM-DD. */
  deadline?: string;
  saved?: boolean;
}

const PHOTO = '/assets/mirror/expert.jpg';

export const sampleProfile: Record<CabinetLocale, ProfileData> = {
  en: {
    imageSrc: PHOTO,
    nameUk: 'Ачасов Андрій Борисович',
    nameEn: 'Andrii Achasov',
    email: 'andrii.achasov@university.edu.ua',
    phone: '+380 50 000 00 00',
    orcid: 'https://orcid.org/0000-0003-2446-3707',
    facebook: '',
    linkedin: 'https://www.linkedin.com/in/andrii-achasov-69903638/',
    degree: 'Doctor of Sciences',
    degreeOther: '',
    rank: 'Professor',
    institution: 'V. N. Karazin Kharkiv National University',
    languages: 'English, German',
    activity:
      'Head of the Department of Ecology and Environmental Management at V. N. Karazin Kharkiv National University.',
    researchArea:
      'Soil science; landscape science; remote sensing; geographic information systems; digital elevation modelling',
    experience:
      jobs('1994 – Engineer, Soil Erosion Control Laboratory – Institute of Soil Science and Agrochemistry, Kharkiv\n2010 – Head of the Department of Geodesy, Cartography and Geoinformatics – V. V. Dokuchaev Kharkiv National Agrarian University\n2021 – Head of the Department of Ecology and Environmental Management – V. N. Karazin Kharkiv National University'),
    expertExperience: jobs('2019 – Expert – National Research Foundation of Ukraine'),
    publications: [
      {
        title: 'Soil erosion modelling with satellite data',
        authors: 'Achasov A., Petrenko O., Kovalenko I.',
        journal: 'Geoderma',
        year: '2022',
        pages: '100–112',
        role: 'lead',
        url: 'https://doi.org/10.0000/example',
      },
    ],
    field: 'Природничі науки',
    specialties: ['Науки про Землю', 'Екологія', 'Географія'],
    extraKnowledge: [{ field: 'Аграрні науки та продовольство', specialties: ['Агрономія'] }],
    extraFields: '',
    activities: ['Teaching', 'Programming', 'Project management'],
    extraActivities: '',
    scienceProjects: [
      {
        title: 'ERASMUS+ SUNRISE',
        description: 'Supporting the Next Generation of Ukrainian Researchers.',
        role: 'Coordinator at the university',
        url: '',
      },
    ],
    otherProjects: [],
    societies: ['ukrainske-botanichne-tovarystvo', 'hidroekolohichne-tovarystvo-ukrainy'],
  },
  uk: {
    imageSrc: PHOTO,
    nameUk: 'Ачасов Андрій Борисович',
    nameEn: 'Andrii Achasov',
    email: 'andrii.achasov@university.edu.ua',
    phone: '+380 50 000 00 00',
    orcid: 'https://orcid.org/0000-0003-2446-3707',
    facebook: '',
    linkedin: 'https://www.linkedin.com/in/andrii-achasov-69903638/',
    degree: 'Доктор наук',
    degreeOther: '',
    rank: 'Професор',
    institution: 'Харківський національний університет імені В. Н. Каразіна',
    languages: 'англійська, німецька',
    activity:
      'Завідувач кафедри екології та управління довкіллям Харківського національного університету імені В. Н. Каразіна.',
    researchArea:
      'ґрунтознавство; ландшафтознавство; дистанційне зондування; геоінформаційні системи; цифрове моделювання рельєфу',
    experience:
      jobs('1994 – інженер лабораторії протиерозійного захисту ґрунтів – Інститут ґрунтознавства та агрохімії, Харків\n2010 – завідувач кафедри геодезії, картографії та геоінформатики – ХНАУ імені В. В. Докучаєва\n2021 – завідувач кафедри екології та управління довкіллям – ХНУ імені В. Н. Каразіна'),
    expertExperience: jobs('2019 – експерт – Національний фонд досліджень України'),
    publications: [
      {
        title: 'Моделювання ерозії ґрунтів за супутниковими даними',
        authors: 'Achasov A., Petrenko O., Kovalenko I.',
        journal: 'Geoderma',
        year: '2022',
        pages: '100–112',
        role: 'lead',
        url: 'https://doi.org/10.0000/example',
      },
    ],
    field: 'Природничі науки',
    specialties: ['Науки про Землю', 'Екологія', 'Географія'],
    extraKnowledge: [{ field: 'Аграрні науки та продовольство', specialties: ['Агрономія'] }],
    extraFields: '',
    activities: ['Викладання', 'Програмування', 'Менеджмент проєктів'],
    extraActivities: '',
    scienceProjects: [
      {
        title: 'ERASMUS+ SUNRISE',
        description: 'Підтримка наступного покоління українських дослідників.',
        role: 'Координатор від університету',
        url: '',
      },
    ],
    otherProjects: [],
    societies: ['ukrainske-botanichne-tovarystvo', 'hidroekolohichne-tovarystvo-ukrainy'],
  },
};

export const sampleMatches: Record<CabinetLocale, MatchScientist[]> = {
  en: [
    {
      id: 'm1',
      name: 'Oleksandra Antoniuk',
      subtitle: 'Doctor of Sciences, Professor',
      organization: 'Taras Shevchenko National University of Kyiv',
      imageSrc: PHOTO,
      tags: ['Soil science', 'Remote sensing', 'GIS'],
      sharedTags: ['Soil science', 'Remote sensing'],
    },
    {
      id: 'm2',
      name: 'Volodymyr Akhmetov',
      subtitle: 'Candidate of Sciences, Associate Professor',
      organization: 'Odesa I. I. Mechnikov National University',
      imageSrc: PHOTO,
      tags: ['Environmental management', 'Hydrology'],
      sharedTags: ['Environmental management'],
    },
    {
      id: 'm3',
      name: 'Iryna Kovalenko',
      subtitle: 'Senior Researcher',
      organization: 'Institute of Geography, NAS of Ukraine',
      imageSrc: PHOTO,
      tags: ['Remote sensing', 'Climate', 'Soil science'],
      sharedTags: ['Soil science', 'Remote sensing'],
    },
  ],
  uk: [
    {
      id: 'm1',
      name: 'Антонюк Олександра Вікторівна',
      subtitle: 'Доктор наук, професор',
      organization: 'Київський національний університет імені Тараса Шевченка',
      imageSrc: PHOTO,
      tags: ['Ґрунтознавство', 'Дистанційне зондування', 'ГІС'],
      sharedTags: ['Ґрунтознавство', 'Дистанційне зондування'],
    },
    {
      id: 'm2',
      name: 'Ахметов Володимир Сабірджанович',
      subtitle: 'Кандидат наук, доцент',
      organization: 'Одеський національний університет імені І. І. Мечникова',
      imageSrc: PHOTO,
      tags: ['Екологічний менеджмент', 'Гідрологія'],
      sharedTags: ['Екологічний менеджмент'],
    },
    {
      id: 'm3',
      name: 'Коваленко Ірина Петрівна',
      subtitle: 'Старший дослідник',
      organization: 'Інститут географії НАН України',
      imageSrc: PHOTO,
      tags: ['Дистанційне зондування', 'Клімат', 'Ґрунтознавство'],
      sharedTags: ['Ґрунтознавство', 'Дистанційне зондування'],
    },
  ],
};

export const sampleCourses: Record<CabinetLocale, Course[]> = {
  en: [
    {
      id: 'c1',
      title: 'Research integrity and academic writing',
      provider: 'Diia.Osvita',
      href: 'https://osvita.diia.gov.ua/',
    },
    {
      id: 'c2',
      title: 'Writing a competitive grant proposal',
      provider: 'Diia.Osvita',
      href: 'https://osvita.diia.gov.ua/',
    },
    {
      id: 'c3',
      title: 'Open data in science',
      provider: 'Diia.Osvita',
      href: 'https://osvita.diia.gov.ua/',
    },
  ],
  uk: [
    {
      id: 'c1',
      title: 'Академічна доброчесність і наукове письмо',
      provider: 'Дія.Освіта',
      href: 'https://osvita.diia.gov.ua/',
    },
    {
      id: 'c2',
      title: 'Як написати конкурентну грантову заявку',
      provider: 'Дія.Освіта',
      href: 'https://osvita.diia.gov.ua/',
    },
    {
      id: 'c3',
      title: 'Відкриті дані в науці',
      provider: 'Дія.Освіта',
      href: 'https://osvita.diia.gov.ua/',
    },
  ],
};

/** Dates are counted from today so the "deadline is near" alert always has a case to show. */
const inDays = (n: number) => {
  const t = new Date();
  t.setDate(t.getDate() + n);
  return t.toISOString().slice(0, 10);
};

export const sampleGrants: Record<CabinetLocale, Grant[]> = {
  en: [
    {
      id: 'g1',
      title: 'Support for researchers in environmental science',
      field: 'Environmental management',
      href: '#',
      deadline: inDays(6),
    },
    {
      id: 'g2',
      title: 'Short research stay at a European partner university',
      field: 'Soil science',
      href: '#',
      saved: true,
    },
    {
      id: 'g3',
      title: 'Equipment grant for field monitoring',
      field: 'Remote sensing',
      href: '#',
      deadline: inDays(40),
    },
  ],
  uk: [
    {
      id: 'g1',
      title: 'Підтримка дослідників у сфері наук про довкілля',
      field: 'Екологічний менеджмент',
      href: '#',
      deadline: inDays(6),
    },
    {
      id: 'g2',
      title: 'Коротке дослідницьке стажування в європейському університеті-партнері',
      field: 'Ґрунтознавство',
      href: '#',
      saved: true,
    },
    {
      id: 'g3',
      title: 'Грант на обладнання для польового моніторингу',
      field: 'Дистанційне зондування',
      href: '#',
      deadline: inDays(40),
    },
  ],
};
