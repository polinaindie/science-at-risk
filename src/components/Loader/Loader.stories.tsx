import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './Loader';

const meta = {
  title: 'Atoms/Loader',
  component: Loader,
  decorators: [
    (Story) => (
      <div style={{ padding: 48 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithText: Story = { args: { text: 'Loading' } };
