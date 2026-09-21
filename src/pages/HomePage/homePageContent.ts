/** Sample content for the home page, taken from the live site. */
import type { HomePageProps } from './HomePage';

export const homePageContent: HomePageProps = {
  languages: [
    { label: 'ENG', href: '#', active: true },
    { label: 'УКР', href: '#' },
  ],
  nav: [
    { label: 'Experts', href: '#' },
    { label: 'Damaged infrastructure', href: '#' },
    { label: 'Scientific societies', href: '#' },
    { label: 'About the project', href: '#' },
    { label: 'Stories', href: '#' },
    { label: 'Policies', href: '#' },
    { label: 'Contacts', href: '#' },
  ],
  social: [
    { label: 'Twitter', href: '#' },
    { label: 'Linkedin', href: '#' },
    { label: 'Facebook', href: '#' },
  ],
  popular: [
    { label: 'Physical sciences', count: 12 },
    { label: 'Social sciences', count: 5 },
    { label: 'Technology', count: 8 },
    { label: 'Arts & humanities', count: 1 },
    { label: 'Life sciences & biomedicine', count: 22 },
  ],
  heroLinks: [
    { label: 'Scientists', href: '#', count: 367 },
    { label: 'Stories', href: '#', count: 28 },
    { label: 'Researches', href: '#', count: 300 },
  ],
  stories: [
    {
      title: 'Uncovered Graves. How Lviv restores its memory about the school of mathematics',
      text: 'A Map of Burial Sites Revives the Memory of Lviv’s Forgotten Mathematicians',
      date: '12.08.26',
      image: '/img/story-1.jpg',
      href: '#',
    },
    {
      title: 'Stolen museum. Kherson',
      text: 'What did the Russians steal from the Kherson Local History Museum during the retreat from the city?',
      date: '03.02.26',
      image: '/img/story-2.png',
      href: '#',
    },
    {
      title: 'Test Tubes in the Count’s Estate',
      text: 'How the Institute of Agricultural Microbiology has kept working since the outbreak of full-scale war.',
      date: '19.11.25',
      image: '/img/story-3.png',
      href: '#',
    },
  ],
  reconstruction: [
    {
      title: 'Institute for Problems of Cryobiology and Cryomedicine',
      text: 'Institute for Problems of Cryobiology and Cryomedicine',
      price: '~ 500000 UAH',
      href: '#',
    },
    {
      title: 'Berdiansk State Pedagogical University',
      text: 'Berdiansk State Pedagogical University',
      price: '~ 1200000 UAH',
      href: '#',
    },
  ],
  supporters: [
    {
      title: 'The project is supported by:',
      links: [
        { label: 'Press, Education and Culture Department of the US Embassy in Ukraine', href: '#' },
        { label: 'Alfred P. Sloan Foundation', href: '#' },
        { label: 'Ministry of Education and Science of Ukraine', href: '#' },
        { label: 'National research fund', href: '#' },
      ],
    },
    {
      title: 'Responsible for project implementation:',
      links: [{ label: 'NGO "Kunsht"', href: '#' }],
    },
  ],
};
