import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Ім’я', placeholder: 'Ім’я' },
};

export const Active: Story = {
  args: { label: 'Ім’я', defaultValue: '', autoFocus: true },
};

export const Filled: Story = {
  args: { label: 'Ім’я', defaultValue: 'Кирило' },
};

export const FilledLong: Story = {
  args: {
    label: 'Текст',
    multiline: true,
    defaultValue:
      'Текст на дві строчки з цікавою пропозицією для співробітництва',
  },
};

export const Disabled: Story = {
  args: { label: 'Ім’я', defaultValue: 'Ім’я', disabled: true },
};

export const OnDark: Story = {
  args: { label: 'Ім’я', placeholder: 'Ім’я', tone: 'dark' },
  decorators: [
    (Story) => (
      <div className="bg-brand-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const AllStates: Story = {
  args: { label: 'Ім’я' },
  render: () => (
    <div className="flex flex-col gap-10 p-8">
      <TextField label="Ім’я" placeholder="Ім’я" />
      <TextField label="Ім’я" defaultValue="Кирило" />
      <TextField
        label="Текст"
        multiline
        defaultValue="Текст на дві строчки з цікавою пропозицією для співробітництва"
      />
      <TextField label="Ім’я" defaultValue="Ім’я" disabled />
    </div>
  ),
};
