import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHero } from './PageHero';

const meta = {
  title: 'Components/PageHero',
  component: PageHero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Infrastructures: Story = {
  args: {
    title: 'Damaged infrastructure',
    text: 'Scientific infrastructure damaged during the war',
    variant: 'blue',
    breadcrumbs: [
      { label: 'Main', href: '/' },
      { label: 'Infrastructure' },
    ],
  },
};

export const Research: Story = {
  args: {
    title: 'Research',
    text: 'Research, policy and advocacy materials',
    variant: 'plain',
    breadcrumbs: [
      { label: 'Main', href: '/' },
      { label: 'Research' },
    ],
  },
};

export const Stories: Story = {
  args: {
    title: 'Stories',
    variant: 'plain',
    selectPlaceholder: 'Theme',
    selectOptions: [
      { value: 'stories', label: 'Stories' },
      { value: 'blogs', label: 'Blogs' },
    ],
    breadcrumbs: [
      { label: 'Main', href: '/' },
      { label: 'Stories' },
    ],
  },
};
