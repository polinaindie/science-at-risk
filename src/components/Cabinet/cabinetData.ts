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
  // 5 · asked at registration, never published
  /** Three scientists who can vouch for the person. */
  recommenders: Recommender[];
  consents: Consents;
}

/** A scientist who can give a recommendation: the name and the e-mail the team writes to. */
export interface Recommender {
  name: string;
  email: string;
}

export const emptyRecommender: Recommender = { name: '', email: '' };

/** What the person agrees to. Both are asked before the first send. */
export interface Consents {
  /** Processing of personal data under the Law of Ukraine “On Personal Data Protection”. */
  personalData: boolean;
  /** Publishing the answers on the site; "no" is a valid answer the team has to know. */
  publish: '' | 'yes' | 'no';
}

/** A profile with nothing in it yet: what a scientist meets after the first sign-in. */
export const emptyProfile = (email: string, nameUk = ''): ProfileData => ({
  imageSrc: '',
  nameUk,
  nameEn: '',
  email,
  phone: '',
  orcid: '',
  facebook: '',
  linkedin: '',
  degree: '',
  degreeOther: '',
  rank: '',
  institution: '',
  languages: '',
  activity: '',
  researchArea: '',
  experience: [],
  expertExperience: [],
  publications: [],
  field: '',
  specialties: [],
  extraKnowledge: [],
  extraFields: '',
  activities: [],
  extraActivities: '',
  scienceProjects: [],
  otherProjects: [],
  societies: [],
  recommenders: [],
  consents: { personalData: false, publish: '' },
});

const sampleRecommenders: Recommender[] = [
  { name: 'Ihor Biletskyi', email: 'ihor.biletskyi@university.edu.ua' },
  { name: 'Olena Kovalenko', email: 'olena.kovalenko@institute.org.ua' },
  { name: 'Serhii Shevchenko', email: 'serhii.shevchenko@university.edu.ua' },
];

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
  /** Shown to the person who wrote only once this colleague has accepted the request. */
  email?: string;
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
  /** One field of knowledge, or several: each shows as its own tag. */
  field: string | string[];
  href: string;
  /** ISO date, YYYY-MM-DD. */
  deadline?: string;
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
    languages: 'Ukrainian, English, German',
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
    recommenders: sampleRecommenders,
    consents: { personalData: true, publish: 'yes' },
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
    languages: 'українська, англійська, німецька',
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
    recommenders: sampleRecommenders,
    consents: { personalData: true, publish: 'yes' },
  },
};

export const sampleMatches: Record<CabinetLocale, MatchScientist[]> = {
  en: [
    {
      id: 'm1',
      email: 'm1@university.example',
      name: 'Oleksandra Antoniuk',
      subtitle: 'Doctor of Sciences, Professor',
      organization: 'Taras Shevchenko National University of Kyiv',
      imageSrc: PHOTO,
      tags: ['Soil science', 'Remote sensing', 'GIS'],
      sharedTags: ['Soil science', 'Remote sensing'],
    },
    {
      id: 'm2',
      email: 'm2@university.example',
      name: 'Volodymyr Akhmetov',
      subtitle: 'Candidate of Sciences, Associate Professor',
      organization: 'Odesa I. I. Mechnikov National University',
      imageSrc: PHOTO,
      tags: ['Environmental management', 'Hydrology'],
      sharedTags: ['Environmental management'],
    },
    {
      id: 'm3',
      email: 'm3@university.example',
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
      email: 'm1@university.example',
      name: 'Антонюк Олександра Вікторівна',
      subtitle: 'Доктор наук, професор',
      organization: 'Київський національний університет імені Тараса Шевченка',
      imageSrc: PHOTO,
      tags: ['Ґрунтознавство', 'Дистанційне зондування', 'ГІС'],
      sharedTags: ['Ґрунтознавство', 'Дистанційне зондування'],
    },
    {
      id: 'm2',
      email: 'm2@university.example',
      name: 'Ахметов Володимир Сабірджанович',
      subtitle: 'Кандидат наук, доцент',
      organization: 'Одеський національний університет імені І. І. Мечникова',
      imageSrc: PHOTO,
      tags: ['Екологічний менеджмент', 'Гідрологія'],
      sharedTags: ['Екологічний менеджмент'],
    },
    {
      id: 'm3',
      email: 'm3@university.example',
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
      href: 'https://www.youtube.com/playlist?list=PLACEHOLDER',
    },
    {
      id: 'c2',
      title: 'Writing a competitive grant proposal',
      provider: 'Diia.Osvita',
      href: 'https://www.youtube.com/playlist?list=PLACEHOLDER',
    },
    {
      id: 'c3',
      title: 'Open data in science',
      provider: 'Diia.Osvita',
      href: 'https://www.youtube.com/playlist?list=PLACEHOLDER',
    },
  ],
  uk: [
    {
      id: 'c1',
      title: 'Академічна доброчесність і наукове письмо',
      provider: 'Дія.Освіта',
      href: 'https://www.youtube.com/playlist?list=PLACEHOLDER',
    },
    {
      id: 'c2',
      title: 'Як написати конкурентну грантову заявку',
      provider: 'Дія.Освіта',
      href: 'https://www.youtube.com/playlist?list=PLACEHOLDER',
    },
    {
      id: 'c3',
      title: 'Відкриті дані в науці',
      provider: 'Дія.Освіта',
      href: 'https://www.youtube.com/playlist?list=PLACEHOLDER',
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
    },
    {
      id: 'g3',
      title: 'Equipment grant for field monitoring',
      field: ['Remote sensing', 'Soil science', 'Environmental management'],
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
    },
    {
      id: 'g3',
      title: 'Грант на обладнання для польового моніторингу',
      field: ['Дистанційне зондування', 'Ґрунтознавство', 'Екологічний менеджмент'],
      href: '#',
      deadline: inDays(40),
    },
  ],
};

/**
 * A copy of something that reached the scientist: a visitor's request sent with
 * the Connect button (after the team has read it and let it through), or a
 * message from the team. The letter itself is in the scientist's mailbox; this
 * copy is only here so it is not lost, and it cannot be answered from here.
 */
export type NotificationKind =
  | 'request'
  | 'team'
  /** Another scientist asks to talk: the person accepts or declines right in the card. */
  | 'colleague'
  /** To the one who wrote: the colleague accepted, and the chat is open. The sender is never told about a decline. */
  | 'accepted';

export type ColleagueStatus = 'pending' | 'accepted' | 'declined';

export interface Notification {
  id: string;
  kind: NotificationKind;
  read: boolean;
  /** ISO date and time the copy reached the cabinet. */
  date: string;
  /** The letter's subject, word for word, so the person can find it in their mailbox. */
  subject: string;
  /** The whole text; a new line starts a new paragraph. */
  body: string;
  /** Requests only. A team message has no sender fields: the team is the sender. */
  senderName?: string;
  senderEmail?: string;
  /** The badge on the avatar was reset by opening the page (seen); the card stays yellow until it is read. */
  seen?: boolean;
  /** What it points to is gone (the request was withdrawn, the account deleted): shown inactive. */
  stale?: 'cancelled' | 'deleted';
  /** Colleague requests only: where the person stands on it. */
  status?: ColleagueStatus;
  /** Colleague requests only: the line under the name. */
  senderPosition?: string;
  /** Colleague requests only: the sender's photo; initials stand in when there is none. */
  senderImage?: string;
  /** Where the photo leads: the scientist's public profile. */
  senderHref?: string;
  /** Colleague requests only: names of people both of you are connected with. */
  mutualContacts?: string[];
}

/** Times are counted back from now, so "today" and "yesterday" always have a case to show. */
const ago = (days: number, hour = 10) => {
  const t = new Date();
  t.setDate(t.getDate() - Math.floor(days));
  t.setHours(hour, (days * 37) % 60, 0, 0);
  if (t.getTime() > Date.now()) t.setTime(Date.now() - 20 * 60 * 1000);
  return t.toISOString();
};

export const sampleNotifications: Record<CabinetLocale, Notification[]> = {
  en: [
    {
      id: 'c6',
      kind: 'colleague',
      read: true,
      seen: true,
      date: ago(2, 10),
      subject: '',
      status: 'pending',
      stale: 'cancelled',
      senderName: 'Vira Artemieva',
      senderImage: '/storage/person/286/f018fdbb78623c428ae13aed05119dbea0c7dfd6.jpg',
      senderHref: '/expert/artemieva-vira-borysivna.html',
      senderPosition: 'Candidate of Sciences, Associate Professor',
      body: 'Hello! I wanted to ask about joint field work in the spring.',
    },
    {
      id: 'c5',
      kind: 'colleague',
      read: true,
      date: ago(3, 12),
      subject: '',
      status: 'declined',
      senderName: 'Volodymyr Akhmetov',
      senderImage: '/storage/person/610/fc26a40b08d8e48536e1385e14c4a56108bdb056.jpg',
      senderHref: '/expert/akhmetov-volodymyr-sabirdzhanovych.html',
      senderPosition: 'Candidate of Sciences, Senior Researcher',
      senderEmail: 'volodymyr.akhmetov@institute.example',
      body: 'Hello! I would like to invite you to a joint grant application on soil monitoring.',
    },
    {
      id: 'c1',
      kind: 'colleague',
      read: false,
      date: ago(0, 9),
      subject: '',
      status: 'pending',
      senderName: 'Svitlana Arbuzova',
      senderImage: '/storage/person/97/846431c8049d103260d0d306aa3f662890877b8a.jpg',
      senderHref: '/expert/arbuzova-svitlana-borysivna.html',
      senderPosition: 'Candidate of Sciences, Associate Professor',
      senderEmail: 'svitlana.arbuzova@university.example',
      mutualContacts: ['Andrii Achasov', 'Oleksandra Antoniouk'],
      body: 'Hello! I study soil degradation in the Kherson region and saw that you work with remote sensing. I would like to discuss a joint article: do you have time for a short talk?',
    },
    {
      id: 'c2',
      kind: 'accepted',
      read: false,
      date: ago(1, 11),
      subject: '',
      senderName: 'Oleksandra Antoniuk',
      senderImage: '/storage/person/86/76974a4734d28a7b05cc94ca0b20a2f7655e36a6.jpg',
      senderHref: '/expert/antoniuk-oleksandra-viktorivna.html',
      senderEmail: 'm1@university.example',
      body: '',
    },
    {
      id: 'c4',
      kind: 'colleague',
      read: true,
      date: ago(7, 16),
      subject: '',
      status: 'accepted',
      senderName: 'Andrii Achasov',
      senderImage: '/storage/person/608/28bb19babb2b83f169028aaf3e150ff64406e790.jpg',
      senderHref: '/expert/achasov-andrii-borysovych.html',
      senderPosition: 'Doctor of Sciences, Professor',
      senderEmail: 'andrii.achasov@university.example',
      body: 'Hello! I am looking for a co-author for a review of methods for mapping saline soils. Your profile fits perfectly.',
    },
    {
      id: 'n1',
      kind: 'request',
      read: false,
      date: ago(0),
      subject: 'A comment for a story on soil erosion',
      senderName: 'Olena Melnyk',
      senderEmail: 'olena.melnyk@newsroom.example',
      body: 'Hello! I am a journalist and I am writing about soil erosion after the dam was destroyed.\nCould you give a short comment this week? Five questions, about twenty minutes by phone or in writing, whichever suits you.\nThank you in advance.',
    },
    {
      id: 'n2',
      kind: 'team',
      read: false,
      date: ago(1, 15),
      subject: 'Your changes are approved',
      body: 'The new version of your profile is already on the site.\nIf something looks wrong there, write to us and the editors will check it.',
    },
    {
      id: 'n3',
      kind: 'request',
      read: false,
      date: ago(3),
      subject:
        'A request for an expert opinion on a method of remote monitoring of soil degradation in frontline communities of the Kherson and Mykolaiv regions for humanitarian demining planning',
      senderName: 'Oleksandr-Kostiantyn Mykolaiovych Verkhovynskyi-Pidhirnyi-Levytskyi',
      senderEmail:
        'oleksandr.kostiantyn.verkhovynskyi-pidhirnyi@institute-of-environmental-and-agricultural-research.example.org',
      body: 'Dear colleague,\nOur institute is preparing a methodological note for demining operators and we would like to ask for your expert opinion on the method of remote monitoring that you describe in your profile.\nSpecifically, we need to know whether satellite data of a ten-metre resolution is enough to tell fields that are being worked from those that are overgrown, and how the answer changes in winter.\nIf it is easier, we can send the draft first. The deadline for comments is the end of the month.\nWith respect,\nthe methods group',
    },
    {
      id: 'n4',
      kind: 'request',
      read: true,
      date: ago(6),
      subject: 'Student internship',
      senderName: 'Taras Hrytsenko',
      senderEmail: 'taras.hrytsenko@student.example.edu.ua',
      body: 'Good afternoon. I am a third-year student of ecology and I would like to do an internship in your group.\nI have experience with QGIS and basic Python. My CV is attached to the letter.',
    },
    {
      id: 'n5',
      kind: 'request',
      read: true,
      date: ago(12),
      subject: 'Joint application for a grant',
      senderName: 'Marta Kovalenko',
      senderEmail: 'marta.kovalenko@foundation.example.org',
      body: 'Hello! We are putting together an application to a European call on land restoration and we are looking for a partner from Ukraine.\nYour profile matches what we need. Can we talk for half an hour next week?',
    },
    {
      id: 'n6',
      kind: 'team',
      read: true,
      date: ago(20),
      subject: 'Your profile is on its way to the site',
      body: 'Thank you for registering. The team is reading your answers and will write when the page is ready.',
    },
    {
      id: 'n7',
      kind: 'request',
      read: true,
      date: ago(41),
      subject: 'Lecture for a school science club',
      senderName: 'Ihor Savchuk',
      senderEmail: 'ihor.savchuk@school.example.ua',
      body: 'Good day! We run a science club for senior pupils. Would you give a lecture online about how soil is studied? Any date in the spring suits us.',
    },
  ],
  uk: [
    {
      id: 'c6',
      kind: 'colleague',
      read: true,
      seen: true,
      date: ago(2, 10),
      subject: '',
      status: 'pending',
      stale: 'cancelled',
      senderName: 'Артем’єва Віра Борисівна',
      senderImage: '/storage/person/286/f018fdbb78623c428ae13aed05119dbea0c7dfd6.jpg',
      senderHref: '/expert/artemieva-vira-borysivna.html',
      senderPosition: 'Кандидат наук, доцент',
      body: 'Доброго дня! Хотіла запитати про спільну польову роботу навесні.',
    },
    {
      id: 'c5',
      kind: 'colleague',
      read: true,
      date: ago(3, 12),
      subject: '',
      status: 'declined',
      senderName: 'Ахметов Володимир Сабірджанович',
      senderImage: '/storage/person/610/fc26a40b08d8e48536e1385e14c4a56108bdb056.jpg',
      senderHref: '/expert/akhmetov-volodymyr-sabirdzhanovych.html',
      senderPosition: 'Кандидат наук, старший дослідник',
      senderEmail: 'volodymyr.akhmetov@institute.example',
      body: 'Доброго дня! Хочу запросити вас до спільної грантової заявки з моніторингу ґрунтів.',
    },
    {
      id: 'c1',
      kind: 'colleague',
      read: false,
      date: ago(0, 9),
      subject: '',
      status: 'pending',
      senderName: 'Арбузова Світлана Борисівна',
      senderImage: '/storage/person/97/846431c8049d103260d0d306aa3f662890877b8a.jpg',
      senderHref: '/expert/arbuzova-svitlana-borysivna.html',
      senderPosition: 'Кандидат наук, доцент',
      senderEmail: 'svitlana.arbuzova@university.example',
      mutualContacts: ['Ачасов Андрій Борисович', 'Антонюк Олександра Вікторівна'],
      body: 'Доброго дня! Я вивчаю деградацію ґрунтів на Херсонщині й побачила, що ви працюєте з дистанційним зондуванням. Хотіла б обговорити спільну статтю: чи є у вас час на коротку розмову?',
    },
    {
      id: 'c2',
      kind: 'accepted',
      read: false,
      date: ago(1, 11),
      subject: '',
      senderName: 'Антонюк Олександра Вікторівна',
      senderImage: '/storage/person/86/76974a4734d28a7b05cc94ca0b20a2f7655e36a6.jpg',
      senderHref: '/expert/antoniuk-oleksandra-viktorivna.html',
      senderEmail: 'm1@university.example',
      body: '',
    },
    {
      id: 'c4',
      kind: 'colleague',
      read: true,
      date: ago(7, 16),
      subject: '',
      status: 'accepted',
      senderName: 'Ачасов Андрій Борисович',
      senderImage: '/storage/person/608/28bb19babb2b83f169028aaf3e150ff64406e790.jpg',
      senderHref: '/expert/achasov-andrii-borysovych.html',
      senderPosition: 'Доктор наук, професор',
      senderEmail: 'andrii.achasov@university.example',
      body: 'Вітаю! Шукаю співавтора для огляду методів картографування засолених ґрунтів. Ваш профіль підходить ідеально.',
    },
    {
      id: 'n1',
      kind: 'request',
      read: false,
      date: ago(0),
      subject: 'Коментар для матеріалу про ерозію ґрунтів',
      senderName: 'Олена Мельник',
      senderEmail: 'olena.melnyk@newsroom.example',
      body: 'Добрий день! Я журналістка й пишу про ерозію ґрунтів після руйнування дамби.\nЧи могли б ви дати короткий коментар цього тижня? П’ять запитань, близько двадцяти хвилин по телефону або письмово, як вам зручніше.\nЗаздалегідь дякую.',
    },
    {
      id: 'n2',
      kind: 'team',
      read: false,
      date: ago(1, 15),
      subject: 'Зміни в профілі схвалено',
      body: 'Нова версія вашого профілю вже на сайті.\nЯкщо щось там виглядає не так, напишіть нам, і редактори перевірять.',
    },
    {
      id: 'n3',
      kind: 'request',
      read: false,
      date: ago(3),
      subject:
        'Запит на експертну оцінку методики дистанційного моніторингу деградації ґрунтів у прифронтових громадах Херсонщини та Миколаївщини для планування гуманітарного розмінування',
      senderName: 'Олександр-Костянтин Миколайович Верховинський-Підгірний-Левицький',
      senderEmail:
        'oleksandr.kostiantyn.verkhovynskyi-pidhirnyi@institute-of-environmental-and-agricultural-research.example.org',
      body: 'Шановна колего, шановний колего!\nНаш інститут готує методичну записку для операторів розмінування, і ми хотіли б попросити вашу експертну оцінку методики дистанційного моніторингу, яку ви описуєте у своєму профілі.\nЗокрема, нам важливо знати, чи достатньо супутникових даних із роздільністю десять метрів, щоб відрізнити поля, які обробляють, від тих, що заросли, і як відповідь змінюється взимку.\nЯкщо так зручніше, ми можемо спершу надіслати чернетку. Строк для коментарів: кінець місяця.\nЗ повагою,\nметодична група',
    },
    {
      id: 'n4',
      kind: 'request',
      read: true,
      date: ago(6),
      subject: 'Стажування для студента',
      senderName: 'Тарас Гриценко',
      senderEmail: 'taras.hrytsenko@student.example.edu.ua',
      body: 'Добрий день. Я студент третього курсу, вивчаю екологію, і хотів би пройти стажування у вашій групі.\nМаю досвід роботи з QGIS і базовий Python. Резюме додаю до листа.',
    },
    {
      id: 'n5',
      kind: 'request',
      read: true,
      date: ago(12),
      subject: 'Спільна грантова заявка',
      senderName: 'Марта Коваленко',
      senderEmail: 'marta.kovalenko@foundation.example.org',
      body: 'Вітаю! Ми готуємо заявку на європейський конкурс із відновлення земель і шукаємо партнера з України.\nВаш профіль збігається з тим, що нам потрібно. Чи можемо ми поговорити пів години наступного тижня?',
    },
    {
      id: 'n6',
      kind: 'team',
      read: true,
      date: ago(20),
      subject: 'Ваш профіль готується до публікації',
      body: 'Дякуємо за реєстрацію. Команда читає ваші відповіді й напише, коли сторінка буде готова.',
    },
    {
      id: 'n7',
      kind: 'request',
      read: true,
      date: ago(41),
      subject: 'Лекція для шкільного гуртка',
      senderName: 'Ігор Савчук',
      senderEmail: 'ihor.savchuk@school.example.ua',
      body: 'Доброго дня! Ми ведемо науковий гурток для старшокласників. Чи не прочитали б ви онлайн-лекцію про те, як вивчають ґрунти? Будь-яка дата навесні нам підходить.',
    },
  ],
};

/** Forty-seven of them, to see paging: the same few requests under different names. */
export const sampleManyNotifications: Record<CabinetLocale, Notification[]> = {
  en: manyOf('en'),
  uk: manyOf('uk'),
};

function manyOf(locale: CabinetLocale): Notification[] {
  const base = sampleNotifications[locale];
  return Array.from({ length: 47 }, (_, i) => {
    const n = base[i % base.length];
    return { ...n, id: `m${i}`, read: i > 4, date: ago(i * 1.7, 9 + (i % 8)) };
  });
}
