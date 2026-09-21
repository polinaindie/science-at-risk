import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Molecules/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    items: [{ label: 'Main', href: '#' }, { label: 'Experts' }],
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoLevels: Story = {};

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: 'Main', href: '#' },
      { label: 'Experts', href: '#' },
      { label: 'Igor Komarov' },
    ],
  },
};
