import type { Meta, StoryObj } from '@storybook/react-vite';
import { FullImage } from './FullImage';

const meta = {
  title: 'Molecules/FullImage',
  component: FullImage,
  parameters: { layout: 'fullscreen' },
  args: { src: '/img/story-2.png', alt: 'Stolen museum. Kherson' },
} satisfies Meta<typeof FullImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCaption: Story = { args: { caption: 'Kherson Local History Museum, 2022' } };
