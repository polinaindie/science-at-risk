import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryAside } from './StoryAside';

const meta = {
  title: 'Components/StoryAside',
  component: StoryAside,
  tags: ['autodocs'],
} satisfies Meta<typeof StoryAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Author', value: 'Science at Risk editorial' },
      { label: 'Date', value: '12.11.2023' },
      { label: 'Theme', value: 'Stories' },
    ],
    ctaLabel: 'All stories',
  },
};
