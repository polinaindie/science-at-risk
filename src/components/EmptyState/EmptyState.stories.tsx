import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  args: {
    suggestions: ['Teaching', 'Science popularization', 'Biology', 'Natural sciences', 'Biochemistry'],
  },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSuggestions: Story = {};

export const Bare: Story = { args: { suggestions: [] } };
