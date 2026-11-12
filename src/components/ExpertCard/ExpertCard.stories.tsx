import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpertCard } from './ExpertCard';

const meta = {
  title: 'Components/ExpertCard',
  component: ExpertCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ExpertCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Igor Komarov',
    subtitle: 'Ph.D., professor',
    organization:
      'Educational and Scientific Institute of High Technologies, Taras Shevchenko National University of Kyiv',
    description:
      'Igor leads the Institute of High Technologies of Taras Shevchenko Kyiv National University and participates in forming the university\'s scientific policy.',
    tags: [
      { label: 'Chemistry', href: '/scientists?tag=chemistry', value: 'chemistry' },
      { label: 'Biochemistry', href: '/scientists?tag=biochemistry', value: 'biochemistry' },
      {
        label: 'Natural sciences',
        href: '/scientists?tag=natural-sciences',
        value: 'natural-sciences',
      },
      {
        label: 'Science popularization',
        href: '/scientists?tag=science-popularization',
        value: 'science-popularization',
      },
    ],
    href: '/expert/komarov',
  },
};
