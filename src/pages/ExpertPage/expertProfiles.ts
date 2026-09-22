import type { PublicationCardProps } from '../../components/PublicationCard/PublicationCard';

export interface ExpertProfile {
  slug: string;
  name: string;
  degree?: string;
  photo?: string;
  languages?: string;
  links?: { label: string; href: string }[];
  /** The profile body, as the site prints it: a labelled run of paragraphs. */
  sections: { title: string; text: string }[];
  tags?: string[];
  publications?: PublicationCardProps[];
}

export const expertProfiles: ExpertProfile[] = [
  {
    slug: 'komarov-ihor-volodymyrovych',
    name: 'Igor Komarov',
    degree: 'Ph.D., professor',
    photo: '/img/experts/expert-1.jpg',
    languages: 'English',
    links: [
      { label: 'Orcid', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'Linkedin', href: '#' },
    ],
    sections: [
      {
        title: 'Description of the field of scientific research:',
        text: "Igor leads the Institute of High Technologies of Taras Shevchenko National University of Kyiv and takes part in forming the university's scientific policy. His own work is in organic and medicinal chemistry, where he develops molecules for drug discovery.",
      },
      {
        title: 'List of duties:',
        text: 'Director of the Educational and Scientific Institute of High Technologies; member of the expert council of the Ministry of Education and Science of Ukraine; supervisor of doctoral students.',
      },
    ],
    tags: ['Chemistry', 'Biochemistry', 'Natural sciences', 'Science popularization'],
    publications: [
      {
        title: 'Conformationally restricted amino acids in drug design',
        meta: 'Chemical Reviews, 2017, pp. 415–487',
        href: '#',
      },
    ],
  },
  {
    slug: 'harkusha-ihor-yevhenovych',
    name: 'Igor Garkusha',
    degree: 'Ph.D., professor',
    photo: '/img/experts/expert-2.jpg',
    languages: 'English',
    links: [{ label: 'Orcid', href: '#' }],
    sections: [
      {
        title: 'Description of the field of scientific research:',
        text: 'Plasma physics and controlled thermonuclear fusion: plasma-surface interaction, plasma accelerators and their use for materials treatment.',
      },
      {
        title: 'List of duties:',
        text: 'Deputy general director for scientific work of the National Science Centre "Kharkiv Institute of Physics and Technology".',
      },
    ],
    tags: ['Natural sciences', 'Physics', 'Plasma physics'],
  },
];

export const findExpert = (slug?: string) =>
  expertProfiles.find((profile) => profile.slug === slug) ?? expertProfiles[0];
