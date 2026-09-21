import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta = {
  title: 'Molecules/Select',
  component: Select,
  args: {
    value: 'Stories',
    options: [{ label: 'Stories' }, { label: 'Blogs' }],
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, minHeight: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const ManyOptions: Story = {
  args: {
    value: 'All fields',
    defaultOpen: true,
    options: [
      { label: 'All fields' },
      { label: 'Biochemistry' },
      { label: 'Biology' },
      { label: 'Natural sciences' },
      { label: 'Teaching' },
    ],
  },
};
