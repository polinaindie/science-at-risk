import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateLabel } from './DateLabel';

const meta = {
  title: 'Components/DateLabel',
  component: DateLabel,
  tags: ['autodocs'],
} satisfies Meta<typeof DateLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: '12.11.2023' },
};
