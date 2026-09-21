import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from './SiteHeader';

const nav = [
  { label: 'Experts', href: '#' },
  { label: 'Damaged infrastructure', href: '#' },
  { label: 'Scientific societies', href: '#' },
  { label: 'About the project', href: '#' },
  { label: 'Stories', href: '#' },
  { label: 'Policies', href: '#' },
  { label: 'Contacts', href: '#' },
];

const social = [
  { label: 'Twitter', href: '#' },
  { label: 'Linkedin', href: '#' },
  { label: 'Facebook', href: '#' },
];

const meta = {
  title: 'Sections/SiteHeader',
  component: SiteHeader,
  parameters: { layout: 'fullscreen' },
  args: { nav, social, lang: { label: 'UA', href: '#' } },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const MenuOpen: Story = { args: { defaultMenuOpen: true } };

export const OnLightBackground: Story = { args: { dark: false } };
