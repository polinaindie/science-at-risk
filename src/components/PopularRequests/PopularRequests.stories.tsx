import type { Meta, StoryObj } from '@storybook/react-vite';
import { PopularRequests } from './PopularRequests';

const meta = {
  title: 'Molecules/PopularRequests',
  component: PopularRequests,
  args: {
    items: [
      { label: 'Teaching', count: 101 },
      { label: 'Science popularization', count: 86 },
      { label: 'Biology', count: 57 },
      { label: 'Natural sciences', count: 55 },
      { label: 'Biochemistry', count: 41 },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PopularRequests>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ukrainian: Story = {
  args: {
    title: 'Популярні запити',
    items: [
      { label: 'Викладання', count: 101 },
      { label: 'Популяризація науки', count: 86 },
      { label: 'Біологія', count: 57 },
    ],
  },
};
