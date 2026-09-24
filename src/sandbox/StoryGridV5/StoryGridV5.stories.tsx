import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryGridV5 } from './StoryGridV5';

const meta = {
  title: 'Sandbox/StoryGrid V5',
  component: StoryGridV5,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StoryGridV5>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
