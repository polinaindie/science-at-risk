import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Atoms/TextField',
  component: TextField,
  args: { label: 'Name' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = { args: { defaultValue: 'Sofiia Fedzhora' } };

export const Email: Story = { args: { label: 'Email', type: 'email' } };

export const Multiline: Story = {
  args: { label: 'Text', multiline: true },
};

export const OverLimit: Story = {
  args: { label: 'Text', multiline: true, maxLength: 20, defaultValue: 'A request far longer than the limit allows.' },
};
