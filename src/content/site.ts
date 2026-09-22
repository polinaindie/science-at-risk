import type { NavItem } from '../components/SiteHeader/SiteHeader';
import type { SupportGroup } from '../components/SiteFooter/SiteFooter';

/** Every route the header links to, in the site's own order. */
export const ROUTES = {
  home: '/',
  experts: '/experts',
  infrastructures: '/infrastructures',
  societies: '/societies',
  about: '/about',
  stories: '/stories',
  research: '/research',
  contacts: '/contacts',
} as const;

/**
 * Ordered by the workshop's track hierarchy rather than the old site's order:
 * the expert base first (40), then the societies — they are the other way into
 * Ukrainian science, so they belong beside the experts and away from
 * reconstruction — then the war's documented impact (30), the policy papers
 * (20) and damaged infrastructure (10). About and Contacts carry no track of
 * their own and close the list.
 */
export const nav: NavItem[] = [
  { label: 'Experts', href: ROUTES.experts },
  { label: 'Scientific societies', href: ROUTES.societies },
  { label: 'Stories', href: ROUTES.stories },
  { label: 'Research', href: ROUTES.research },
  { label: 'Damaged infrastructure', href: ROUTES.infrastructures },
  { label: 'About the project', href: ROUTES.about },
  { label: 'Contacts', href: ROUTES.contacts },
];

export const social: NavItem[] = [
  { label: 'Twitter', href: 'https://twitter.com/ScienceAtRisk' },
  { label: 'Linkedin', href: 'https://www.linkedin.com/company/scienceatrisk' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61561122303898' },
];

export const languages = [
  { label: 'ENG', href: '#', active: true },
  { label: 'УКР', href: '#' },
];

export const supporters: SupportGroup[] = [
  {
    title: 'The project is supported by:',
    links: [
      {
        label: 'Press, Education and Culture Department of the US Embassy in Ukraine',
        href: 'https://ua.usembassy.gov/uk/education-culture-uk/',
      },
      { label: 'Alfred P. Sloan Foundation', href: 'https://sloan.org/' },
      { label: 'Ministry of Education and Science of Ukraine', href: 'https://mon.gov.ua/ua' },
      { label: 'National research fund', href: 'https://nrfu.org.ua/' },
    ],
  },
  {
    title: 'Responsible for project implementation:',
    links: [{ label: 'NGO "Kunsht"', href: 'https://kunsht.com.ua/' }],
  },
];
