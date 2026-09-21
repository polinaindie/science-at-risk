import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Main', href: '/' },
      { label: 'Experts' },
    ],
  },
};

export const Deep: Story = {
  args: {
    items: [
      { label: 'Main', href: '/' },
      { label: 'Experts', href: '/experts' },
      { label: 'Igor Komarov' },
    ],
  },
};
