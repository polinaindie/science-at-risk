import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpertCard } from './ExpertCard';

const meta = {
  title: 'Cards/ExpertCard',
  component: ExpertCard,
  args: {
    name: 'Igor Komarov',
    degree: 'Ph.D., professor',
    affiliation:
      'Educational and Scientific Institute of High Technologies, Taras Shevchenko National University of Kyiv',
    summary:
      'Igor leads the Institute of High Technologies of Taras Shevchenko Kyiv National University and participates in forming the university’s scientific policy.',
    tags: ['Chemistry', 'Biochemistry', 'Natural sciences', 'Science popularization', 'Expert consulting'],
    photo: '/img/person-1.jpg',
    href: '#',
  },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpertCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutPhoto: Story = { args: { photo: undefined } };

export const Minimal: Story = {
  args: { degree: undefined, summary: undefined, tags: [] },
};
