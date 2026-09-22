import type { ExpertCardProps } from '../../components/ExpertCard/ExpertCard';
import { asset } from '../../content/assets';
import type { PopularRequest } from '../../components/PopularRequests/PopularRequests';

/** The tag cloud under the search field, with the site's own counts. */
export const expertRequests: PopularRequest[] = [
  { label: 'Teaching', count: 101 },
  { label: 'Science popularization', count: 86 },
  { label: 'Biology', count: 57 },
  { label: 'Natural sciences', count: 55 },
  { label: 'Biochemistry', count: 41 },
];

export const experts: ExpertCardProps[] = [
  {
    name: 'Igor Komarov',
    degree: 'Ph.D., professor',
    affiliation:
      'Educational and Scientific Institute of High Technologies, Taras Shevchenko National University of Kyiv',
    summary:
      "Igor leads the Institute of High Technologies of Taras Shevchenko Kyiv National University and participates in forming the university's scientific policy. He is a member of the expert council of the Ministry of Education and Science of Ukraine.",
    tags: ['Chemistry', 'Biochemistry', 'Natural sciences', 'Science popularization'],
    photo: asset('img/experts/expert-1.jpg'),
    href: '/experts/komarov-ihor-volodymyrovych',
  },
  {
    name: 'Igor Garkusha',
    degree: 'Ph.D., professor',
    affiliation: 'National Science Centre "Kharkiv Institute of Physics and Technology"',
    summary:
      'Igor is the deputy general director for scientific work of the National Scientific Center «Kharkiv Physical and Technical Institute».',
    tags: ['Natural sciences', 'Physics', 'Plasma physics'],
    photo: asset('img/experts/expert-2.jpg'),
    href: '/experts/harkusha-ihor-yevhenovych',
  },
  {
    name: 'Grygoriy Dmytriv',
    degree: 'Doctor of Chemical Sciences',
    affiliation: 'Ivan Franko National University of Lviv',
    summary:
      "Hryhoriy is the dean of the Chemistry faculty of Ivan Franko National University of Lviv and a member of the University's Academic Council. He represents Ukraine in the European Crystallographic Association.",
    tags: ['Chemistry', 'Natural sciences', 'Science popularization'],
    photo: asset('img/experts/expert-5.jpg'),
    href: '/experts/dmytriv-hryhorii-stepanovych',
  },
  {
    name: 'Oleksandr Golub',
    degree: 'Ph.D., professor',
    affiliation: 'National University of Kyiv-Mohyla Academy',
    summary:
      'Alongside teaching, Oleksandr researches anti-cancer nanotechnologies and drugs for immuno-, chemoimmunotherapy and photodynamic therapy.',
    tags: ['Chemistry', 'Physical chemistry', 'Natural sciences', 'Surface science'],
    photo: asset('img/experts/expert-7.jpg'),
    href: '/experts/holub-oleksandr-andriiovych',
  },
];
