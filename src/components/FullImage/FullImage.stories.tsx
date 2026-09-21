import type { Meta, StoryObj } from '@storybook/react-vite';
import { FullImage } from './FullImage';

const meta = {
  title: 'Components/FullImage',
  component: FullImage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FullImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { alt: 'Story cover' },
};
