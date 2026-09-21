import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Всі проєкти', href: '#' },
};

export const Uppercase: Story = {
  args: { children: 'Всі проєкти', href: '#', uppercase: true },
};

export const Disabled: Story = {
  args: { as: 'button', children: 'Всі проєкти', disabled: true },
};
