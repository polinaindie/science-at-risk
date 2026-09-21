import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeHero, HOME_HERO_BG } from './HomeHero';
import { SiteHeader } from '../SiteHeader/SiteHeader';

const popular = [
  { label: 'Physical sciences', count: 12 },
  { label: 'Social sciences', count: 5 },
  { label: 'Technology', count: 8 },
  { label: 'Arts & humanities', count: 1 },
  { label: 'Life sciences & biomedicine', count: 22 },
];

const links = [
  { label: 'Scientists', href: '#', count: 367 },
  { label: 'Stories', href: '#', count: 28 },
  { label: 'Researches', href: '#', count: 300 },
];

const meta = {
  title: 'Sections/HomeHero',
  component: HomeHero,
  parameters: { layout: 'fullscreen' },
  args: { popular, links },
} satisfies Meta<typeof HomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The whole first screen, header included — what the design shows. */
export const WithHeader: Story = {
  render: (args) => (
    <>
      <SiteHeader
        dark={false}
        divider={false}
        background={HOME_HERO_BG}
        languages={[
          { label: 'ENG', href: '#', active: true },
          { label: 'УКР', href: '#' },
        ]}
        nav={[
          { label: 'Experts', href: '#' },
          { label: 'Damaged infrastructure', href: '#' },
          { label: 'Scientific societies', href: '#' },
          { label: 'About the project', href: '#' },
          { label: 'Stories', href: '#' },
          { label: 'Policies', href: '#' },
          { label: 'Contacts', href: '#' },
        ]}
        social={[
          { label: 'Twitter', href: '#' },
          { label: 'Linkedin', href: '#' },
          { label: 'Facebook', href: '#' },
        ]}
      />
      <HomeHero {...args} />
    </>
  ),
};

export const WithoutPopular: Story = { args: { popular: [] } };

export const SearchOnly: Story = { args: { popular: [], links: [] } };
