import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCard } from './StoryCard';

const meta = {
  title: 'Components/StoryCard',
  component: StoryCard,
  tags: ['autodocs'],
} satisfies Meta<typeof StoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Stolen museum. Kherson',
    excerpt:
      'What did the Russians steal from the Kherson Local History Museum during the retreat from the city?',
    date: '12.08.24',
    href: '/story/stolen-museum-kherson',
  },
};

export const WithRubric: Story = {
  args: {
    rubric: 'Stories',
    title: 'Closer to Space: How the Chornohora Observatory restarts its operation',
    excerpt: 'How the observatory returns to observations after years offline.',
    date: '05.06.26',
    href: '/story/closer-to-space-how-the-chornohora-observatory-restarts-its-operation',
  },
};
