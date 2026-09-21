import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  { value: 'physics', label: 'Фізичні науки' },
  { value: 'life', label: 'Науки про життя та біомедицина' },
  { value: 'social', label: 'Соціальні науки' },
  { value: 'tech', label: 'Технології' },
  { value: 'arts', label: 'Мистецтво та гуманітарні науки' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options, placeholder: 'Наукова галузь' },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'physics' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
